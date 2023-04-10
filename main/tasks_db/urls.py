from django.urls import include, path
from rest_framework import routers

from .views import *

router = routers.DefaultRouter()
router.register(r'ItProject', ItProjectViewSet)
router.register(r'DevelopmentTeam', DevelopmentTeamViewSet)
router.register(r'Developer', DeveloperViewSet)
router.register(r'Task', TaskViewSet)
router.register(r'Subtask', SubtaskViewSet)
router.register(r'Expenses', ExpensesViewSet)


urlpatterns = [
    path('', include(router.urls)),
]