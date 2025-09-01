import requests

url1 = "http://127.0.0.1:8000/auth/account/resetPassword/"

login = {
  "email": 'midoghanam@hotmail.com',
}

u = requests.post(url1, json=login)

print(u.text)
print(u.status_code)
