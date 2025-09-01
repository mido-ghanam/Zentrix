from django.contrib import admin
from . import models as m

admin.site.site_header = admin.site.site_title = "Zentrix - Admin Panel"
admin.site.index_title = f"Welcome to Zentrix Admin panal"

admin.site.register(m.Users)
admin.site.register(m.GitHubAuth)
admin.site.register(m.GoogleAuth)
admin.site.register(m.ResetPassword)
