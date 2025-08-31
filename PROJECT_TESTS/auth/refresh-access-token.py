import requests

url1 = "http://127.0.0.1:8000/auth/token/refresh/"

token = {
  "refresh": 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1ODY4MzY5NCwiaWF0IjoxNzU2MDkxNjk0LCJqdGkiOiIxNmIxOWQ2MzZjOTU0OWM2YmZlYjAwYWMyNDU1NzA1NyIsInVzZXJfaWQiOiIxIiwiZnVsbF9uYW1lIjoiTW9oYW1tZWQgQWhtZWQgR2hhbmFtIiwidXNlcm5hbWUiOiJNaWRvR2hhbmFtIiwiZW1haWwiOiJtZ2hhbmFtODgzQGdtYWlsLmNvbSIsImlzX3N0YWZmIjp0cnVlLCJyb2xlIjoiYWRtaW4ifQ.IsVlshlZ6yx9jZw7Q9EKf6pME296_vt-DMctRrZ64gM',
}

u = requests.post(url1, json=token)

print(u.text)
print(u.status_code)
