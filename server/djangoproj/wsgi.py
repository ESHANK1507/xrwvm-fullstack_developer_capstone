"""
WSGI config for djangoproj project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.2/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'djangoproj.settings')

application = get_asgi_application()
