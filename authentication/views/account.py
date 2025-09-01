from core.utils import get_client_ip, get_user_agent, send_email, generate_code
from ..serializers import ResetPasswordSerializer, ResetPasswordConfirmSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth.tokens import default_token_generator
from django.template.loader import render_to_string
from rest_framework.response import Response
from django.contrib.auth.models import User
from datetime import datetime, timedelta
from rest_framework.views import APIView
from django.utils.timezone import now
from .. import models as m

#@api_view(["GET", "POST"])
#@permission_classes([IsAuthenticated])
#def activateUserAccount(request):
#  user = m.Users.objects.filter(user=request.user).first()
#  if user.actived_account: return Response({"status": True, "message": "Account already activated"}, status=status.HTTP_200_OK)
#  session, email, ip = request.session, request.user.email, get_client_ip(request)
#  user_agent = get_user_agent(request)
#  user_agent_str = f"{user_agent['device_type']} - {user_agent['os']} - {user_agent['browser']}"
#  def set_activation_session(): session["activateCode"], session["activateCodeTime"], session["activateTries"] = generate_code(6), now().isoformat(), 0
#  def send_activation_email():
#    html_message = render_to_string("emails/activate-account.html", {"user_email": email, "activate_time": now().strftime('%Y-%m-%d %H:%M:%S'), "ip": ip, "user_agent": user_agent_str, "code": session["activateCode"] })
#    send_email(access_token=get_mediadrop_google_access(), to=email, subject="Activate Your Account", message_text=html_message, is_html=True)
#  if request.method == "GET":
#    set_activation_session(); send_activation_email()
#    return Response({"status": True, "message": "Activation code sent"}, status=status.HTTP_200_OK)
#  verification_code, saved_code, code_time, tries = request.data.get("verification_code", "").strip(), session.get("activateCode"), session.get("activateCodeTime"), session.get("activateTries", 0)
#  if not verification_code: return Response({"status": False, "error": "Verification code is required"}, status=status.HTTP_400_BAD_REQUEST)
#  if not verification_code.isdigit(): return Response({"status": False, "error": "Verification code must be digits only"}, status=status.HTTP_400_BAD_REQUEST)
#  if not saved_code or not code_time: set_activation_session(); send_activation_email(); return Response({"status": False, "error": "Something went wrong. A new code has been sent"}, status=status.HTTP_400_BAD_REQUEST)
#  if now() > datetime.fromisoformat(code_time) + timedelta(minutes=10): set_activation_session(); send_activation_email(); return Response({"status": False, "error": "Code expired. A new one has been sent"}, status=status.HTTP_400_BAD_REQUEST)
#  if tries >= 5: return Response({"status": False, "error": "Too many failed attempts"}, status=status.HTTP_403_FORBIDDEN)
#  if verification_code != saved_code: session["activateTries"] = tries + 1; return Response({"status": False, "error": "Invalid verification code"}, status=status.HTTP_400_BAD_REQUEST)
#  for key in ["activateCode", "activateCodeTime", "activateTries"]: session.pop(key, None)
#  user.actived_account, _ = True, user.save()
#  return Response({"status": True, "message": "Account activated successfully"}, status=status.HTTP_200_OK)

#@api_view(["POST"])
#@permission_classes([IsAuthenticated])
#def completeUserDetials(request):
#  process_code, email = request.data.get("processCode", ""), request.data.get("email", "")
#  if not email: return Response({"status": False, "error": "E-mail field required"}, status=status.HTTP_400_BAD_REQUEST)
#  request.user.email, _ = email, request.user.save()
#  return Response({"status": True, "message": "Email saved successfully, please activate your account", "next": "/auth/account/activate/"}, status=status.HTTP_200_OK)

@api_view(["POST"])
@permission_classes([AllowAny])
def ResetPassword(request):
  email = request.data.get("email", "")
  serializer = ResetPasswordSerializer(data={"email": email})
  if not serializer.is_valid(): return Response({"status": False, "error": "E-mail is invalid"}, status=400)
  user = User.objects.filter(email=email).first()
  if not user: return Response({"status": False, "error": f"No user recorded with email: '{email}'"}, status=400)
  user_auth = m.Users.objects.get(user=user)
  resetPassword, created = m.ResetPassword.objects.get_or_create(user=user_auth, defaults={"token": default_token_generator.make_token(user)})
  if not created:
    resetPassword.expired_at = m.default_expiry(ex=30)
    resetPassword.save()
  email_json, status  = send_email(email, "Resetting Password", "Test")
  return Response(email_json, status=status)


class ResetPasswordConfirmView(APIView):
    def post(self, request):
        serializer = ResetPasswordConfirmSerializer(data=request.data)
        if serializer.is_valid():
            uidb64 = serializer.validated_data['uidb64']
            token = serializer.validated_data['token']
            new_password = serializer.validated_data['new_password']
            try:
                uid = urlsafe_base64_decode(uidb64).decode()
                user = User.objects.get(pk=uid)
            except (TypeError, ValueError, OverflowError, User.DoesNotExist):
                user = None
            if user is not None and default_token_generator.check_token(user, token):
                user.set_password(new_password)
                user.save()
                return Response({'message': 'Password reset successfully'})
            else:
                return Response({'message': 'Invalid token'})
        else:
            return Response(serializer.errors)
