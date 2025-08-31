from django.core.validators import RegexValidator
from django.contrib.auth.models import User
from django.utils.timezone import now
from datetime import timedelta
from django.db import models
import uuid

ROLE_CHOICES = (('admin', 'Admin'), ('analyst', 'Security Analyst'), ('user', 'User'),)

class Users(models.Model):
  id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=True)
  user = models.OneToOneField(User, on_delete=models.DO_NOTHING)
  role = models.CharField(max_length=50, default="user", choices=ROLE_CHOICES)
  phone = models.CharField(max_length=20, blank=True, null=True)
  actived_account = models.BooleanField(default=False)
  preferred_language = models.CharField(max_length=10, default="en", choices=[("en", "English"), ("ar", "Arabic")])
  created_at = models.DateTimeField(auto_now_add=True)
  def __str__(self):
    return f"{self.user.get_full_name()} - ({self.user.username})"

class GoogleAuth(models.Model):
  id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=True)
  user = models.ForeignKey(Users, on_delete=models.CASCADE)
  sub = models.CharField(max_length=50, default=0)
  def save(self, *args, **kwargs):
    if not self.expires_in:
      self.expires_in = 3599
    elif self.expires_in:
      self.created_at = now()
      self.expires_at = self.created_at + timedelta(seconds=self.expires_in)
    super().save(*args, **kwargs)
  def __str__(self):
    return f"Auth for {self.user.user.get_full_name()} @{self.user.user.username}"

class GitHubAuth(models.Model):
  id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=True)
  user = models.ForeignKey(Users, on_delete=models.CASCADE)
  username = models.CharField(max_length=50, blank=True, null=True)
  access_token = models.TextField(blank=True, null=True)
  user_github_id = models.BigIntegerField(blank=True, null=True)
  avatar_url = models.URLField(blank=True, null=True)
  def __str__(self):
    return f"Auth for {self.user.user.get_full_name()} @{self.user.user.username}"

class ResetPassword(models.Model):
  id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=True)
  user = models.ForeignKey(Users, on_delete=models.CASCADE)
  token = models.TextField()
  