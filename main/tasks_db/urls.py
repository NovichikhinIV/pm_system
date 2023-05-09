from django.urls import include, path
from .views import *


urlpatterns = [   
    path('ItProject/', ItProjectViewSet.as_view({
        'get': 'list',
        'post': 'create'
    })),
    path('ItProject/<str:pk>/', ItProjectViewSet.as_view({
        'get': 'retrieve',
        'put': 'update',
        'delete': 'destroy'
    })),
    
    path('DevelopmentTeam/', DevelopmentTeamViewSet.as_view({
        'get': 'list',
        'post': 'create'
    })),
    path('DevelopmentTeam/<str:pk>/', DevelopmentTeamViewSet.as_view({
        'get': 'retrieve',
        'put': 'update',
        'delete': 'destroy'
    })),
    
    path('Developer/', DeveloperViewSet.as_view({
        'get': 'list',
        'post': 'create'
    })),
    path('Developer/<str:pk>/', DeveloperViewSet.as_view({
        'get': 'retrieve',
        'put': 'update',
        'delete': 'destroy'
    })),
    
    path('Task/', TaskViewSet.as_view({
        'get': 'list',
        'post': 'create'
    })),
    path('Task/<str:pk>/', TaskViewSet.as_view({
        'get': 'retrieve',
        'put': 'update',
        'delete': 'destroy'
    })),
    
    path('Subtask/', SubtaskViewSet.as_view({
        'get': 'list',
        'post': 'create'
    })),
    path('Subtask/<str:pk>/', SubtaskViewSet.as_view({
        'get': 'retrieve',
        'put': 'update',
        'delete': 'destroy'
    })),
    
    path('Expenses/', ExpensesViewSet.as_view({
        'get': 'list',
        'post': 'create'
    })),
    path('Expenses/<str:pk>/', ExpensesViewSet.as_view({
        'get': 'retrieve',
        'put': 'update',
        'delete': 'destroy'
    })),
]