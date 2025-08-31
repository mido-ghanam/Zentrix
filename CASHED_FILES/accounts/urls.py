from django.urls import path
from . import views
from django.contrib.auth import views as auth_views
from .views import reset_password_view

urlpatterns = [
    path('login/', views.login_view, name="login"),
    path('register/', views.register_view, name="register"),
    path("reset-password/", reset_password_view, name="reset_password"),
    
    # Django built-in views for reset confirmation
    path("reset-password/done/", auth_views.PasswordResetDoneView.as_view(
        template_name="accounts/reset_password_done.html"
    ), name="password_reset_done"),

    path("reset-password-confirm/<uidb64>/<token>/", auth_views.PasswordResetConfirmView.as_view(
        template_name="accounts/reset_password_confirm.html"
    ), name="password_reset_confirm"),

    path("reset-password-complete/", auth_views.PasswordResetCompleteView.as_view(
        template_name="accounts/reset_password_complete.html"
    ), name="password_reset_complete"),
    path("logout/", views.logout_view, name="logout"),
]
