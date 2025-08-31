from django.conf.urls.static import static
from django.urls import path, include
from django.contrib import admin
from django.conf import settings

urlpatterns = [
    path('admin/', admin.site.urls),
    path('auth/', include('authentication.urls')),
    path('dashboard/', include('dashboard.urls')),
    path('websites/', include('websites.urls')),
    path('threats/', include('threats.urls')),
    path('alerts/', include('alerts.urls')),
    path('reports/', include('reports.urls')),
    path('ai_module/', include('ai_module.urls')),
]

# 👇 إضافة روابط static/media (فقط في التطوير)
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
