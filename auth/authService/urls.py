from django.urls import include, path
from rest_framework_simplejwt.views import (
    TokenRefreshView,
    TokenVerifyView,
)

from .views import *


urlpatterns = [
    path('', getRoutes),
    path('registration/', CreateUserView.as_view(), name='registration'),
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('token/decode/', TokenDecode.as_view(), name='token_decode'),
]