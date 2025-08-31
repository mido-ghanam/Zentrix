import requests

url1 = "http://127.0.0.1:8000/auth/login/"

login = {
  "username": 'MidoGhanam',
  "password": "Moh@2009@"
}

u = requests.post(url1, json=login)

print(u.text)
print(u.status_code)
