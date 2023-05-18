from django.urls import include, path

from .views import *


urlpatterns = [
    path('', getRoutes),
    path('report/<str:pk>/', Report.as_view()),
]