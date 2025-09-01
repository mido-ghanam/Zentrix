from .MainVariables import BaseURLs, GoogleOAuth, GitHubOAuth, HostURL, _zentrix_access_token, MainVars
from rest_framework_simplejwt.tokens import RefreshToken
from django.core.mail import send_mail, EmailMessage
import base64, requests, time, random
from email.mime.text import MIMEText
from django.conf import settings
from user_agents import parse
from . import jwt_extract

url = HostURL

def get_client_ip(request):
  x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
  if x_forwarded_for:
    ip = x_forwarded_for.split(',')[0]
  else:
    ip = request.META.get('REMOTE_ADDR')
  return ip

def get_user_agent(request):
  user_agent = parse(request.META.get('HTTP_USER_AGENT', ''))
  if user_agent.is_mobile:
    device_type = "Mobile"
  elif user_agent.is_pc:
    device_type = "Computer"
  else:
    device_type = "Unknown Device"
  os = user_agent.os.family
  browser = user_agent.browser.family
  return {'device_type': device_type, 'os': os, 'browser': browser,}

def exchange_code_github(code):
  data = {
    "client_id": GitHubOAuth['client_id'],
    "client_secret": GitHubOAuth['client_secret'],
    "code": code,
    "redirect_uri": f"{url}/auth/oauth/github/callback/"
  }
  token_json = requests.post(BaseURLs["GitHubOAuth"]["getTokens"], data=data, headers={"Accept": "application/json"}).json()
  access_token = token_json.get("access_token")
  if not access_token:
    return {"error": "No access token", "details": token_json}
  user_info = requests.get(BaseURLs.get("GitHubOAuth").get('users'), headers={"Authorization": f"Bearer {access_token}", "Accept": "application/json"}).json()
  email = user_info.get("email")
  if not email:
    emails = requests.get(BaseURLs.get("GitHubOAuth").get('emails'), headers={"Authorization": f"Bearer {access_token}", "Accept": "application/json"}).json()
    if isinstance(emails, list):
      # يفضل الإيميل الأساسي والمفعل
      primary_email = next((e["email"] for e in emails if e.get("primary") and e.get("verified")), None)
      if not primary_email:
        primary_email = next((e["email"] for e in emails if e.get("primary")), None)
      if not primary_email:
        primary_email = next((e["email"] for e in emails if e.get("verified")), None)
      email = primary_email or (emails[0]["email"] if emails else None)
  return {"id": user_info.get("id"), "login": user_info.get("login"), "name": user_info.get("name"), "email": email, "avatar_url": user_info.get("avatar_url"), "raw": user_info}

def exchange_code_google(code):
  data = {
    "code": code,
    "client_id": "15653912530-ti0c8p8ncq7v4va8pi6gikp12jui5k5g.apps.googleusercontent.com",
    "client_secret": "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",
    "redirect_uri": f"{url}/auth/oauth/google/callback/",
    "grant_type": "authorization_code"
  }
  response = requests.post(BaseURLs["GoogleOAuth"]["getTokens"], data=data)
  s = response.status_code
  response = response.json()
  if s == 200:
    response["id_token"] = jwt_extract.decode_jwt(response["id_token"])
  return response

def refresh_google_access_token(refresh_token):
  data = {
    "client_id": "15653912530-ti0c8p8ncq7v4va8pi6gikp12jui5k5g.apps.googleusercontent.com",
    "client_secret": "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",
    "refresh_token": refresh_token,
    "grant_type": "refresh_token"
  }
  response = requests.post(BaseURLs["GoogleOAuth"]["getTokens"], data=data)
  return response.json()

#def send_email(access_token, to, subject, message_text, is_html=False):
#  mime_message = MIMEText(message_text, _subtype="html" if is_html else "plain", _charset="utf-8")
#  mime_message['to'], mime_message['subject'] = to, subject
#  mime_message['from'] = "Test Sender"
#  response = requests.post(BaseURLs["GoogleOAuth"]["emailAPI"]["send"], headers={"Authorization": f"Bearer {access_token}", "Content-Type": "application/json"}, json={"raw": base64.urlsafe_b64encode(mime_message.as_bytes()).decode("utf-8")})
#  if response.status_code == 200:
#    return {"status": True, "message": "E-mail sent successfully"}
#  return {"status": False, "message": "error at sending e-mail", "status_code": response.status_code, "text": response.text}


def send_email(to, subject, message_text, is_html=False, from_email=settings.EMAIL_HOST_USER):
  try:
    if is_html:
      email = EmailMessage(subject=subject, body=message_text, from_email=from_email, to=[to],)
      email.content_subtype = "html"
      email.send()
    else:
      send_mail(subject=subject, message=message_text, from_email=from_email, recipient_list=[to],)
    return {"status": True, "message": "E-mail sent successfully"}, 200
  except Exception as e:
    return {"status": False, "message": "error at sending e-mail", "status_code": response.status_code, "text": response.text}, response.status_code

def get_zentrix_google_access():
  global _zentrix_access_token
  if _zentrix_access_token['token'] and time.time() < _zentrix_access_token['expires_at'] - 60:
    return _zentrix_access_token['token']
  data = {
    'client_id': GoogleOAuth["client_id"],
    'client_secret': GoogleOAuth["client_secret"],
    'refresh_token': MainVars["zentrix"]["gmail"]["refresh_token"],
    'grant_type': 'refresh_token'
  }
  res = requests.post(BaseURLs["GoogleOAuth"]["getTokens"], data=data)
  res.raise_for_status()
  tokens = res.json()
  _zentrix_access_token['token'] = tokens['access_token']
  _zentrix_access_token['expires_at'] = time.time() + tokens['expires_in']
  return _zentrix_access_token['token']

def generate_code(length=8):
  return ''.join(str(random.randint(0, 9)) for _ in range(length))

def getUserTokens(user):
  refresh = RefreshToken.for_user(user)
  return {"refresh": str(refresh), "access": str(refresh.access_token),}
  