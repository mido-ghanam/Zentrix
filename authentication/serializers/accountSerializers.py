from rest_framework import serializers

class ResetPasswordSerializer(serializers.Serializer):
  email = serializers.EmailField()

class ResetPasswordConfirmSerializer(serializers.Serializer):
  uidb64 = serializers.CharField()
  token = serializers.CharField()
  new_password = serializers.CharField()
