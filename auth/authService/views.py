from django.http import JsonResponse
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.views import APIView
from django.conf import settings

import jwt
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView


from rest_framework import permissions
from rest_framework.generics import CreateAPIView
from django.contrib.auth import get_user_model

from .serializers import UserSerializer
from .decorators import jwt_required

@api_view(['GET'])
def getRoutes(request):
    routes = [
        '/api/registration',
        '/api/token',
        '/api/token/refresh',
        '/api/token/verify',
        '/api/token/decode',
    ]

    return Response(routes)


class CreateUserView(CreateAPIView):
    model = get_user_model()
    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = UserSerializer
    
    
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['username'] = user.username
        return token


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


class TokenDecode(APIView):
    @jwt_required # only a valid token can access this view
    def post(self, request):
        token = request.headers.get('Authorization').split('Bearer ')[1]
        if token:
            try:
                payload = jwt.decode(token, settings.SECRET_KEY, algorithms="HS256")
            except jwt.ExpiredSignatureError:
                raise AuthenticationFailed('Unauthenticated', token)

            return Response({'id': payload['user_id']})
        
        raise AuthenticationFailed('Unauthenticated')