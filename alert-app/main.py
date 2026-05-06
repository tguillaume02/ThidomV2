"""
ThiDomV2 - Application d alerte Windows (.exe)
Se connecte au backend via WebSocket et emet une alerte sonore
lorsqu un appareil surveille est active.
Fonctionne en arriere-plan dans la zone de notification (system tray).
Compilable: pyinstaller --onefile --noconsole --name ThiDomAlert main.py
"""
import threading, json, time, os, sys, base64, hashlib, ssl, stat
import tkinter as tk
from tkinter import ttk
import winsound, requests, websocket
from cryptography.fernet import Fernet
import ctypes, ctypes.wintypes
import pystray
from PIL import Image, ImageDraw

def get_config_path():
    appdata = os.environ.get("APPDATA", os.path.expanduser("~"))
    config_dir = os.path.join(appdata, "ThiDomV2Alert")
    os.makedirs(config_dir, exist_ok=True)
    return os.path.join(config_dir, "config.json")

def _dpapi_encrypt(data: bytes) -> bytes:
    """Chiffre des donnees avec Windows DPAPI (lie a l utilisateur courant)."""
    class DATA_BLOB(ctypes.Structure):
        _fields_ = [("cbData", ctypes.wintypes.DWORD), ("pbData", ctypes.POINTER(ctypes.c_char))]
    input_blob = DATA_BLOB(len(data), ctypes.cast(ctypes.create_string_buffer(data, len(data)), ctypes.POINTER(ctypes.c_char)))
    output_blob = DATA_BLOB()
    if not ctypes.windll.crypt32.CryptProtectData(ctypes.byref(input_blob), None, None, None, None, 0, ctypes.byref(output_blob)):
        raise OSError("DPAPI CryptProtectData failed")
    encrypted = ctypes.string_at(output_blob.pbData, output_blob.cbData)
    ctypes.windll.kernel32.LocalFree(output_blob.pbData)
    return encrypted

def _dpapi_decrypt(data: bytes) -> bytes:
    """Dechiffre des donnees avec Windows DPAPI."""
    class DATA_BLOB(ctypes.Structure):
        _fields_ = [("cbData", ctypes.wintypes.DWORD), ("pbData", ctypes.POINTER(ctypes.c_char))]
    input_blob = DATA_BLOB(len(data), ctypes.cast(ctypes.create_string_buffer(data, len(data)), ctypes.POINTER(ctypes.c_char)))
    output_blob = DATA_BLOB()
    if not ctypes.windll.crypt32.CryptUnprotectData(ctypes.byref(input_blob), None, None, None, None, 0, ctypes.byref(output_blob)):
        raise OSError("DPAPI CryptUnprotectData failed")
    decrypted = ctypes.string_at(output_blob.pbData, output_blob.cbData)
    ctypes.windll.kernel32.LocalFree(output_blob.pbData)
    return decrypted

def _get_fernet_key() -> bytes:
    """Genere ou recupere une cle Fernet protegee par DPAPI."""
    config_dir = os.path.join(os.environ.get("APPDATA", os.path.expanduser("~")), "ThiDomV2Alert")
    key_file = os.path.join(config_dir, ".keystore")
    if os.path.exists(key_file):
        encrypted_key = open(key_file, "rb").read()
        return _dpapi_decrypt(encrypted_key)
    else:
        key = Fernet.generate_key()
        encrypted_key = _dpapi_encrypt(key)
        os.makedirs(config_dir, exist_ok=True)
        with open(key_file, "wb") as f: f.write(encrypted_key)
        return key

def load_config():
    path = get_config_path()
    defaults = {"backend_url":"http://localhost:8000","ws_url":"ws://localhost:8000/ThiDom/api/ws/live","username":"","password":"","device_id":"","alert_frequency":1000,"alert_duration_ms":500,"alert_repeat_ms":2000,"verify_ssl":False}
    if os.path.exists(path):
        try:
            key = _get_fernet_key()
            fernet = Fernet(key)
            with open(path, "rb") as f: encrypted = f.read()
            decrypted = fernet.decrypt(encrypted)
            saved = json.loads(decrypted.decode("utf-8"))
            defaults.update(saved)
        except Exception:
            # Fichier corrompu ou non chiffre, on repart des defaults
            pass
    return defaults

def save_config(cfg):
    path = get_config_path()
    key = _get_fernet_key()
    fernet = Fernet(key)
    data = json.dumps(cfg, indent=2, ensure_ascii=False).encode("utf-8")
    encrypted = fernet.encrypt(data)
    with open(path, "wb") as f: f.write(encrypted)
    # Restreindre les permissions au proprietaire uniquement
    try:
        os.chmod(path, stat.S_IRUSR | stat.S_IWUSR)
    except OSError:
        pass

class SettingsWindow:
    def __init__(self, parent, config, on_save):
        self.win=tk.Toplevel(parent); self.win.title("Configuration"); self.win.geometry("420x400"); self.win.grab_set()
        self.config=config; self.on_save=on_save
        frame=ttk.Frame(self.win,padding=15); frame.pack(fill=tk.BOTH,expand=True)
        fields=[("URL du backend","backend_url"),("URL WebSocket","ws_url"),("Utilisateur","username"),("Mot de passe","password"),("ID appareil a surveiller","device_id"),("Frequence alerte (Hz)","alert_frequency"),("Duree bip (ms)","alert_duration_ms"),("Intervalle bip (ms)","alert_repeat_ms"),("Verifier SSL (True/False)","verify_ssl")]
        self.entries={}
        for lbl,key in fields:
            ttk.Label(frame,text=lbl).pack(anchor=tk.W,pady=(4,0))
            e=ttk.Entry(frame,width=50); e.insert(0,str(config.get(key,""))); e.pack(fill=tk.X); self.entries[key]=e
        bf=ttk.Frame(frame); bf.pack(pady=12)
        ttk.Button(bf,text="Sauvegarder",command=self._save).pack(side=tk.LEFT,padx=5)
        ttk.Button(bf,text="Annuler",command=self.win.destroy).pack(side=tk.LEFT,padx=5)
    def _save(self):
        for key,entry in self.entries.items():
            val=entry.get().strip()
            if key in ("alert_frequency","alert_duration_ms","alert_repeat_ms"):
                try: val=int(val)
                except: val=1000
            elif key == "verify_ssl":
                val = val.lower() in ("true", "1", "yes", "oui")
            self.config[key]=val
        save_config(self.config); self.on_save(self.config); self.win.destroy()

class AlertApp:
    def __init__(self):
        self.root=tk.Tk(); self.root.title("ThiDomV2 - Alerte Appareil"); self.root.geometry("500x400"); self.root.resizable(False,False)
        self.config=load_config(); self.alerting=False; self.alert_device_id=None; self.ws=None; self.token=None; self.device_name=""
        self.tray_icon=None
        self._build_ui(); self._connect()
        # Demarrer cache (system tray uniquement)
        self.root.withdraw()
        self._setup_tray()
        self.root.protocol("WM_DELETE_WINDOW",self._hide_to_tray)
        self.root.mainloop()

    def _create_tray_image(self, alert=False):
        """Cree une icone pour le system tray."""
        img = Image.new("RGB", (64, 64), color=(220, 50, 50) if alert else (50, 130, 200))
        draw = ImageDraw.Draw(img)
        draw.ellipse([12, 12, 52, 52], fill=(255, 80, 80) if alert else (80, 180, 255))
        draw.text((22, 18), "T", fill="white")
        return img

    def _setup_tray(self):
        """Configure l icone dans la zone de notification."""
        menu = pystray.Menu(
            pystray.MenuItem("Ouvrir", self._show_window, default=True),
            pystray.MenuItem("Configuration", self._tray_open_settings),
            pystray.Menu.SEPARATOR,
            pystray.MenuItem("Quitter", self._quit_app),
        )
        self.tray_icon = pystray.Icon("ThiDomAlert", self._create_tray_image(), "ThiDomV2 Alert", menu)
        threading.Thread(target=self.tray_icon.run, daemon=True).start()

    def _show_window(self, icon=None, item=None):
        """Affiche la fenetre depuis le tray."""
        self.root.after(0, self._do_show_window)

    def _do_show_window(self):
        self.root.deiconify(); self.root.lift(); self.root.focus_force()

    def _hide_to_tray(self):
        """Cache la fenetre dans le system tray au lieu de fermer."""
        self.root.withdraw()

    def _tray_open_settings(self, icon=None, item=None):
        self.root.after(0, self._show_and_settings)

    def _show_and_settings(self):
        self._do_show_window(); self._open_settings()

    def _quit_app(self, icon=None, item=None):
        """Quitte completement l application."""
        self.alerting = False
        if self.ws: self.ws.close()
        if self.tray_icon: self.tray_icon.stop()
        self.root.after(0, self.root.destroy)

    def _build_ui(self):
        menubar=tk.Menu(self.root); menubar.add_command(label="Configuration",command=self._open_settings); self.root.config(menu=menubar)
        frame=ttk.Frame(self.root,padding=20); frame.pack(fill=tk.BOTH,expand=True)
        self.status_label=ttk.Label(frame,text="Connexion...",font=("Segoe UI",11)); self.status_label.pack(pady=(0,10))
        did=self.config.get("device_id","")
        self.device_info_label=ttk.Label(frame,text=f"Appareil surveille: #{did}" if did else "Aucun appareil configure",font=("Segoe UI",9)); self.device_info_label.pack(pady=(0,10))
        self.device_label=ttk.Label(frame,text="",font=("Segoe UI",14,"bold"),foreground="red"); self.device_label.pack(pady=10)
        self.stop_button=ttk.Button(frame,text="Arreter l alerte et eteindre",command=self._stop_alert,state=tk.DISABLED); self.stop_button.pack(pady=15,ipadx=10,ipady=5)
        self.log_text=tk.Text(frame,height=8,width=55,state=tk.DISABLED,font=("Consolas",9)); self.log_text.pack(fill=tk.BOTH,expand=True)

    def _open_settings(self):
        SettingsWindow(self.root,self.config.copy(),self._on_config_saved)
    def _on_config_saved(self,new_config):
        self.config=new_config; did=self.config.get("device_id","")
        self.device_info_label.config(text=f"Appareil surveille: #{did}" if did else "Aucun appareil configure")
        self._log("Config mise a jour. Reconnexion...")
        if self.ws: self.ws.close()
        # Re-fetch device name with new config
        threading.Thread(target=self._fetch_device_name, daemon=True).start()

    def _connect(self):
        self._authenticate(); self._fetch_device_name(); threading.Thread(target=self._ws_loop,daemon=True).start()

    def _fetch_device_name(self):
        """Recupere le nom de l appareil surveille via l API."""
        did = self.config.get("device_id", "")
        if not did: return
        try:
            headers = {}
            if self.token: headers["Authorization"] = f"Bearer {self.token}"
            r = requests.get(f"{self.config['backend_url']}/ThiDom/api/devices/{did}", headers=headers, timeout=5, verify=self.config.get('verify_ssl', False))
            if r.ok:
                data = r.json()
                self.device_name = data.get("name", f"Appareil #{did}")
                self.root.after(0, lambda: self.device_info_label.config(text=f"Appareil surveille: {self.device_name}"))
                self._log(f"Appareil: {self.device_name}")
            else:
                self.device_name = f"Appareil #{did}"
        except Exception:
            self.device_name = f"Appareil #{did}"

    def _log(self,msg):
        self.root.after(0,self._append_log,msg)
    def _append_log(self,msg):
        self.log_text.config(state=tk.NORMAL); self.log_text.insert(tk.END,f"{msg}\n"); self.log_text.see(tk.END); self.log_text.config(state=tk.DISABLED)

    def _authenticate(self):
        u=self.config.get("username","")
        if not u: return
        try:
            r=requests.post(f"{self.config['backend_url']}/ThiDom/api/auth/login",json={"username":u,"password":self.config.get("password","")},timeout=5,verify=self.config.get('verify_ssl', False))
            if r.ok: self.token=r.json().get("access_token"); self._log("Auth OK")
            else: self._log(f"Auth echouee: {r.status_code}")
        except Exception as e: self._log(f"Erreur auth: {e}")

    def _ws_loop(self):
        backoff = 5
        while True:
            try:
                url=self.config.get("ws_url","")
                if not url: time.sleep(5); continue
                # Construire les headers pour le handshake WS
                headers = {}
                if self.token: headers["Authorization"]=f"Bearer {self.token}"
                # Ajouter Origin pour satisfaire les politiques du reverse proxy
                backend_url = self.config.get("backend_url","")
                if backend_url:
                    from urllib.parse import urlparse
                    parsed = urlparse(backend_url)
                    headers["Origin"] = f"{parsed.scheme}://{parsed.netloc}"
                ssl_opts = {"cert_reqs": ssl.CERT_REQUIRED, "check_hostname": True} if self.config.get('verify_ssl', False) else {"cert_reqs": ssl.CERT_NONE}
                self.ws=websocket.WebSocketApp(url, header=headers, on_open=self._on_ws_open,on_message=self._on_ws_message,on_error=self._on_ws_error,on_close=self._on_ws_close)
                self.ws.run_forever(ping_interval=30, suppress_origin=True, sslopt=ssl_opts)
                backoff = 5  # Reset on clean disconnect
            except Exception as e: self._log(f"WS erreur: {e}")
            time.sleep(backoff)
            backoff = min(backoff * 2, 60)  # Backoff exponentiel, max 60s

    def _on_ws_open(self,ws): self._log("WebSocket connecte"); self.root.after(0,lambda:self.status_label.config(text="Connecte - En ecoute"))
    def _on_ws_message(self,ws,message):
        try: data=json.loads(message)
        except (json.JSONDecodeError, TypeError): return
        if not isinstance(data, dict): return
        if data.get("type")=="device_state_update":
            device_id = data.get("device_id")
            state = data.get("state", {})
            if isinstance(device_id, int) and isinstance(state, dict):
                self._handle_device_state(device_id, state)
    def _on_ws_error(self,ws,error): self._log(f"WS erreur: {error}")
    def _on_ws_close(self,ws,*a): self._log("WS deconnecte"); self.root.after(0,lambda:self.status_label.config(text="Deconnecte - Reconnexion..."))

    def _handle_device_state(self,device_id,state):
        target=self.config.get("device_id","")
        if not target: return
        try: target=int(target)
        except: return
        if device_id!=target: return
        # Detecter power="on" (string) ou power=True ou on=True
        power_val = state.get("power", state.get("on", state.get("active", False)))
        is_on = power_val in (True, "on", "ON", 1, "1", "true")
        if is_on and not self.alerting:
            self.alerting=True; self.alert_device_id=device_id
            self._log(f"ALERTE: Appareil #{device_id} active!"); self.root.after(0,self._show_alert,device_id)
            threading.Thread(target=self._play_alert_sound,daemon=True).start()

    def _show_alert(self,device_id):
        name = getattr(self, 'device_name', f'Appareil #{device_id}')
        self.device_label.config(text=f"{name} ACTIVE"); self.stop_button.config(state=tk.NORMAL)
        self.root.deiconify(); self.root.lift(); self.root.attributes("-topmost",True); self.root.after(100,lambda:self.root.attributes("-topmost",False))
        if self.tray_icon: self.tray_icon.icon = self._create_tray_image(alert=True); self.tray_icon.notify(f"{name} active!", "ThiDomV2 Alert")

    def _play_alert_sound(self):
        freq=int(self.config.get("alert_frequency",1000)); dur=int(self.config.get("alert_duration_ms",500)); rep=int(self.config.get("alert_repeat_ms",2000))
        while self.alerting:
            winsound.Beep(freq, dur)
            # Use short sleep intervals to allow quick stop
            elapsed = 0
            while elapsed < rep and self.alerting:
                time.sleep(0.1)
                elapsed += 100

    def _stop_alert(self):
        if not self.alerting and not self.alert_device_id:
            return
        self.alerting=False
        self.root.after(0, lambda: self.device_label.config(text=""))
        self.root.after(0, lambda: self.stop_button.config(state=tk.DISABLED))
        self.root.after(0, lambda: self.status_label.config(text="Connecte - En ecoute"))
        if self.tray_icon: self.tray_icon.icon = self._create_tray_image(alert=False)
        device_id = self.alert_device_id
        self.alert_device_id = None
        if device_id:
            threading.Thread(target=self._turn_off_device, args=(device_id,), daemon=True).start()
        # Fermer la fenetre (retour au tray)
        self.root.after(1000, self._hide_to_tray)

    def _turn_off_device(self,device_id):
        try:
            headers={}
            if self.token: headers["Authorization"]=f"Bearer {self.token}"
            r=requests.put(f"{self.config['backend_url']}/ThiDom/api/devices/{device_id}/state",json={"state":{"power":"off","on":False}},headers=headers,timeout=5,verify=self.config.get('verify_ssl', False))
            if r.ok: self._log(f"Appareil #{device_id} eteint.")
            else: self._log(f"Erreur extinction: {r.status_code}")
        except Exception as e: self._log(f"Erreur: {e}")

    def _on_close(self):
        """Reduire = cacher dans le tray."""
        self._hide_to_tray()

def _ensure_single_instance():
    """Empeche le lancement de plusieurs instances via un Named Mutex Windows."""
    mutex_name = "Global\\ThiDomV2AlertMutex"
    kernel32 = ctypes.windll.kernel32
    mutex = kernel32.CreateMutexW(None, True, mutex_name)
    last_error = kernel32.GetLastError()
    if last_error == 183:  # ERROR_ALREADY_EXISTS
        kernel32.CloseHandle(mutex)
        # Tenter de mettre au premier plan la fenetre existante
        ctypes.windll.user32.MessageBoxW(
            None,
            "ThiDomV2 Alert est déjà en cours d'exécution.\nVérifiez la zone de notification (icônes cachées).",
            "ThiDomV2 Alert",
            0x40  # MB_ICONINFORMATION
        )
        sys.exit(0)
    return mutex  # Garder la reference pour ne pas liberer le mutex

if __name__=="__main__":
    _mutex = _ensure_single_instance()
    AlertApp()
