"""
ThiDom Email Service - async SMTP email sending.
"""
import logging
import ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.core.config import settings

logger = logging.getLogger(__name__)


async def send_email(to: str, subject: str, body: str) -> bool:
    """Send an email via SMTP. Returns True on success."""
    if not settings.smtp_host or not settings.smtp_user:
        logger.warning("Email not configured (missing smtp_host or smtp_user)")
        return False

    try:
        import aiosmtplib

        msg = MIMEMultipart("alternative")
        msg["From"] = settings.smtp_from or settings.smtp_user
        msg["To"] = to
        msg["Subject"] = subject
        msg.attach(MIMEText(body, "html", "utf-8"))

        kwargs = {
            "hostname": settings.smtp_host,
            "port": settings.smtp_port,
            "username": settings.smtp_user,
            "password": settings.smtp_password,
        }

        if settings.smtp_use_tls:
            ctx = ssl.create_default_context()
            ctx.load_default_certs()
            kwargs["start_tls"] = True
            kwargs["tls_context"] = ctx

        await aiosmtplib.send(msg, **kwargs)
        logger.info("Email sent to %s: %s", to, subject)
        return True
    except ImportError:
        logger.error("aiosmtplib not installed - run: pip install aiosmtplib")
        return False
    except Exception as exc:
        logger.error("Email send failed: %s", exc)
        return False
