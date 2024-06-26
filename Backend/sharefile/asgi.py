"""
ASGI config for sharefile project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/howto/deployment/asgi/
"""

import os

from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from shareapp.routing import wsPattern

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sharefile.settings')

application = get_asgi_application()
application = ProtocolTypeRouter(
    {"http": application, "websocket": URLRouter(wsPattern)}
)