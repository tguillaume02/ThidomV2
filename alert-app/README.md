# ThiDomV2 - Application d'Alerte Windows

Application Python compilable en .exe qui surveille un appareil ThiDomV2.
Fonctionne en arriere-plan dans la zone de notification Windows (icones cachees).

## Comportement

- Au lancement : aucune console, l'app demarre directement dans le system tray (icones cachees)
- Clic sur l'icone tray : ouvre la fenetre
- Fermer / reduire la fenetre : retourne dans le tray
- Clic droit sur l'icone : menu (Ouvrir / Configuration / Quitter)
- En cas d'alerte : notification Windows + fenetre au premier plan + bip sonore

## Compilation en .exe

```bash
pip install -r requirements.txt
pyinstaller --onefile --noconsole --name ThiDomAlert main.py
```

L'executable sera dans dist/ThiDomAlert.exe.

## Configuration

Clic droit sur l'icone tray > Configuration, ou menu dans la fenetre.
Config chiffree dans %APPDATA%\ThiDomV2Alert\config.json (DPAPI + Fernet).

## Demarrage auto Windows

Copier dist/ThiDomAlert.exe dans shell:startup (Win+R).
