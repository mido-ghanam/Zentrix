from rest_framework import serializers

class ResetPasswordSerializer(serializers.Serializer):
  email = serializers.EmailField()

class ResetPasswordConfirmSerializer(serializers.Serializer):
  UUID = serializers.CharField()
  token = serializers.CharField()
  newPassword = serializers.CharField()
