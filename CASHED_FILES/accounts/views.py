from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import PasswordResetForm
from django.core.mail import send_mail
from .forms import RegisterForm, LoginForm
from .models import UserProfile

def login_view(request):
    if request.method == "POST":
        form = LoginForm(data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            messages.success(request, "تم تسجيل الدخول بنجاح ✅")
            return redirect("dashboard")
    else:
        form = LoginForm()
    return render(request, "accounts/login.html", {"form": form})
def register_view(request):
    if request.method == "POST":
        form = RegisterForm(request.POST)
        if form.is_valid():
            user = form.save(commit=False)
            user.username = user.email  # نخلي اليوزر نيم نفس الايميل
            user.save()
            login(request, user)  # تسجيل الدخول مباشرة بعد التسجيل
            return redirect("/")  # يوجه للصفحة الرئيسية بعد التسجيل
    else:
        form = RegisterForm()

    return render(request, "accounts/register.html", {"form": form})
from django.shortcuts import render, redirect
from django.contrib.auth.forms import PasswordResetForm
from django.contrib import messages

def reset_password_view(request):
    if request.method == "POST":
        form = PasswordResetForm(request.POST)
        if form.is_valid():
            form.save(
                request=request,
                use_https=request.is_secure(),
                from_email="noreply@cybersec.com",  # غيّريها لبريدك الرسمي
                email_template_name="accounts/reset_password_email.html"
            )
            messages.success(request, "تم إرسال رابط استعادة كلمة المرور إلى بريدك الإلكتروني.")
            return redirect("login")  # لازم يكون عندك url اسمه login
    else:
        form = PasswordResetForm()
    
    return render(request, "accounts/reset_password.html", {"form": form})

@login_required
def logout_view(request):
    logout(request)
    messages.info(request, "تم تسجيل الخروج")
    return redirect("login")