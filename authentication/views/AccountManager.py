from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

class GetUserDetails(APIView):
  permission_classes = [IsAuthenticated]
  def post(self, request):
    pass
