import requests

url1 = "http://127.0.0.1:8000/auth/register/"

register = {
  "first_name": "Demo",
  "last_name": "Account",
  "username": 'Demo',
  "password": "Moh@2009@",
  "email": "mghanam88@gmail.com",
  "user_lang": "ar",
}

u = requests.post(url1, json=register)

#access = u.json().get("tokens").get("access")

#refresh = u.json().get("tokens").get("refresh")

print(u.text)
print(u.status_code)
