from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.exceptions import AuthenticationFailed
from django.shortcuts import get_object_or_404
from django.db.models import ProtectedError

from .models import ItProject, DevelopmentTeam, Developer, Task, Subtask, Expenses
from .serializers import ItProjectSerializer, DevelopmentTeamSerializer, DevelopmentTeamSerializerWithoutUser, DeveloperSerializer, TaskSerializer, SubtaskSerializer, ExpensesSerializer
from .serializers import ItProjectSerializerLabels, DevelopmentTeamSerializerLabels, DevelopmentTeamSerializerWithoutUserLabels, DeveloperSerializerLabels, TaskSerializerLabels, SubtaskSerializerLabels, ExpensesSerializerLabels

from .service.auth_service import Auth
from .decorators import is_authorized
from .helpers import extract_token



# 1
class ItProjectViewSet(viewsets.ViewSet):
    @is_authorized
    def list(self, request):
        token = extract_token(request.headers)
        user = Auth().get_user(token).get('id')

        queryset = ItProject.objects.filter(team__user_id=user)
        
        serializer = ItProjectSerializerLabels(queryset, many=True)
        return Response(serializer.data)

    @is_authorized
    def create(self, request):
        token = extract_token(request.headers)
        user = Auth().get_user(token).get('id')
        
        queryset = DevelopmentTeam.objects.filter(id=request.data['team']).filter(user_id=user).first()
        # queryset = ItProject.objects.filter(team__user_id=user).first()
        if not queryset:
            raise AuthenticationFailed('Unauthenticated')
        
        serializer = ItProjectSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @is_authorized
    def retrieve(self, request, pk=None):    
        token = extract_token(request.headers)
        user = Auth().get_user(token).get('id')
        
        queryset = ItProject.objects.filter(id=pk, team__user_id=user)
        
        query = get_object_or_404(queryset, pk=pk)
        serializer = ItProjectSerializer(query)
        return Response(serializer.data)

    @is_authorized
    def update(self, request, pk=None):
        token = extract_token(request.headers)
        user = Auth().get_user(token).get('id')
        
        queryset = ItProject.objects.filter(id=pk, team__user_id=user).first()
        
        serializer = ItProjectSerializer(instance=queryset, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_202_ACCEPTED)

    @is_authorized
    def destroy(self, request, pk=None):
        token = extract_token(request.headers)
        user = Auth().get_user(token).get('id')
        
        queryset = ItProject.objects.filter(id=pk, team__user_id=user).first()

        try:
            queryset.delete()
        except ProtectedError:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    
# 2 
class DevelopmentTeamViewSet(viewsets.ViewSet):
    @is_authorized
    def list(self, request):
        token = extract_token(request.headers)
        user = Auth().get_user(token).get('id')

        queryset = DevelopmentTeam.objects.filter(user_id=user)

        serializer = DevelopmentTeamSerializerWithoutUserLabels(queryset, many=True)
        return Response(serializer.data)

    @is_authorized
    def create(self, request):
        token = extract_token(request.headers)
        user = Auth().get_user(token).get('id')
        
        if user != request.data['user_id']:
            raise AuthenticationFailed('Unauthenticated')
        
        serializer = DevelopmentTeamSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @is_authorized
    def retrieve(self, request, pk=None):    
        token = extract_token(request.headers)
        user = Auth().get_user(token).get('id')
        
        queryset = DevelopmentTeam.objects.filter(id=pk, user_id=user)
        
        query = get_object_or_404(queryset, pk=pk)
        serializer = DevelopmentTeamSerializer(query)
        return Response(serializer.data)

    @is_authorized
    def update(self, request, pk=None):
        token = extract_token(request.headers)
        user = Auth().get_user(token).get('id')
        
        queryset = DevelopmentTeam.objects.filter(id=pk, user_id=user).first()
        
        serializer = DevelopmentTeamSerializer(instance=queryset, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_202_ACCEPTED)

    @is_authorized
    def destroy(self, request, pk=None):
        token = extract_token(request.headers)
        user = Auth().get_user(token).get('id')
        
        queryset = DevelopmentTeam.objects.filter(id=pk, user_id=user).first()

        try:
            queryset.delete()
        except ProtectedError:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        return Response(status=status.HTTP_204_NO_CONTENT)
  
  
# 3
class DeveloperViewSet(viewsets.ViewSet):
    @is_authorized
    def list(self, request):
        token = extract_token(request.headers)
        user = Auth().get_user(token).get('id')

        queryset = Developer.objects.filter(team__user_id=user)

        serializer = DeveloperSerializerLabels(queryset, many=True)
        return Response(serializer.data)

    @is_authorized
    def create(self, request):
        token = extract_token(request.headers)
        user = Auth().get_user(token).get('id')
        
        queryset = DevelopmentTeam.objects.filter(id=request.data['team']).filter(user_id=user).first()
        # queryset = Developer.objects.filter(team__user_id=user).first()
        if not queryset:
            raise AuthenticationFailed('Unauthenticated')
        
        serializer = DeveloperSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @is_authorized
    def retrieve(self, request, pk=None):    
        token = extract_token(request.headers)
        user = Auth().get_user(token).get('id')
        
        queryset = Developer.objects.filter(id=pk, team__user_id=user)
        
        query = get_object_or_404(queryset, pk=pk)
        serializer = DeveloperSerializer(query)
        return Response(serializer.data)

    @is_authorized
    def update(self, request, pk=None):
        token = extract_token(request.headers)
        user = Auth().get_user(token).get('id')
        
        queryset = Developer.objects.filter(id=pk, team__user_id=user).first()
        
        serializer = DeveloperSerializer(instance=queryset, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_202_ACCEPTED)

    @is_authorized
    def destroy(self, request, pk=None):
        token = extract_token(request.headers)
        user = Auth().get_user(token).get('id')
        
        queryset = Developer.objects.filter(id=pk, team__user_id=user).first()

        try:
            queryset.delete()
        except ProtectedError:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        return Response(status=status.HTTP_204_NO_CONTENT)


# 4
class TaskViewSet(viewsets.ViewSet):
    @is_authorized
    def list(self, request):
        token = extract_token(request.headers)
        user = Auth().get_user(token).get('id')

        queryset = Task.objects.filter(developer__team__user_id=user)

        serializer = TaskSerializerLabels(queryset, many=True)
        return Response(serializer.data)

    @is_authorized
    def create(self, request):
        token = extract_token(request.headers)
        user = Auth().get_user(token).get('id')
        
        queryset = Developer.objects.filter(id=request.data['developer']).filter(team__user_id=user).first()
        # queryset = Task.objects.filter(developer__team__user_id=user).first()
        if not queryset:
            raise AuthenticationFailed('Unauthenticated')
        
        serializer = TaskSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @is_authorized
    def retrieve(self, request, pk=None):    
        token = extract_token(request.headers)
        user = Auth().get_user(token).get('id')
        
        queryset = Task.objects.filter(id=pk, developer__team__user_id=user)
        
        query = get_object_or_404(queryset, pk=pk)
        serializer = TaskSerializer(query)
        return Response(serializer.data)

    @is_authorized
    def update(self, request, pk=None):
        token = extract_token(request.headers)
        user = Auth().get_user(token).get('id')
        
        queryset = Task.objects.filter(id=pk, developer__team__user_id=user).first()
        
        serializer = TaskSerializer(instance=queryset, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_202_ACCEPTED)

    @is_authorized
    def destroy(self, request, pk=None):
        token = extract_token(request.headers)
        user = Auth().get_user(token).get('id')
        
        queryset = Task.objects.filter(id=pk, developer__team__user_id=user).first()

        try:
            queryset.delete()
        except ProtectedError:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        return Response(status=status.HTTP_204_NO_CONTENT) 
    

# 5    
class SubtaskViewSet(viewsets.ViewSet):
    @is_authorized
    def list(self, request):
        token = extract_token(request.headers)
        user = Auth().get_user(token).get('id')

        queryset = Subtask.objects.filter(task__developer__team__user_id=user)

        serializer = SubtaskSerializerLabels(queryset, many=True)
        return Response(serializer.data)

    @is_authorized
    def create(self, request):
        token = extract_token(request.headers)
        user = Auth().get_user(token).get('id')
        
        queryset = Task.objects.filter(id=request.data['task']).filter(developer__team__user_id=user).first()
        # queryset = Subtask.objects.filter(task__developer__team__user_id=user).first()  
        if not queryset:
            raise AuthenticationFailed('Unauthenticated')
        
        serializer = SubtaskSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @is_authorized
    def retrieve(self, request, pk=None):    
        token = extract_token(request.headers)
        user = Auth().get_user(token).get('id')
        
        queryset = Subtask.objects.filter(id=pk, task__developer__team__user_id=user)
        
        query = get_object_or_404(queryset, pk=pk)
        serializer = SubtaskSerializer(query)
        return Response(serializer.data)

    @is_authorized
    def update(self, request, pk=None):
        token = extract_token(request.headers)
        user = Auth().get_user(token).get('id')
        
        queryset = Subtask.objects.filter(id=pk, task__developer__team__user_id=user).first()
        
        serializer = SubtaskSerializer(instance=queryset, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_202_ACCEPTED)

    @is_authorized
    def destroy(self, request, pk=None):
        token = extract_token(request.headers)
        user = Auth().get_user(token).get('id')
        
        queryset = Subtask.objects.filter(id=pk, task__developer__team__user_id=user).first()

        try:
            queryset.delete()
        except ProtectedError:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        return Response(status=status.HTTP_204_NO_CONTENT)   
 

# 6 
class ExpensesViewSet(viewsets.ViewSet):
    @is_authorized
    def list(self, request):
        token = extract_token(request.headers)
        user = Auth().get_user(token).get('id')

        queryset = Expenses.objects.filter(project__team__user_id=user)

        serializer = ExpensesSerializerLabels(queryset, many=True)
        return Response(serializer.data)

    @is_authorized
    def create(self, request):
        token = extract_token(request.headers)
        user = Auth().get_user(token).get('id')
        
        queryset = ItProject.objects.filter(id=request.data['project']).filter(team__user_id=user).first()
        # queryset = Expenses.objects.filter(project__team__user_id=user).first()
        if not queryset:
            raise AuthenticationFailed('Unauthenticated')
        
        serializer = ExpensesSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @is_authorized
    def retrieve(self, request, pk=None):    
        token = extract_token(request.headers)
        user = Auth().get_user(token).get('id')
        
        queryset = Expenses.objects.filter(id=pk, project__team__user_id=user)
        
        query = get_object_or_404(queryset, pk=pk)
        serializer = ExpensesSerializer(query)
        return Response(serializer.data)

    @is_authorized
    def update(self, request, pk=None):
        token = extract_token(request.headers)
        user = Auth().get_user(token).get('id')
        
        queryset = Expenses.objects.filter(id=pk, project__team__user_id=user).first()
        
        serializer = ExpensesSerializer(instance=queryset, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_202_ACCEPTED)

    @is_authorized
    def destroy(self, request, pk=None):
        token = extract_token(request.headers)
        user = Auth().get_user(token).get('id')
        
        queryset = Expenses.objects.filter(id=pk, project__team__user_id=user).first()

        try:
            queryset.delete()
        except ProtectedError:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        return Response(status=status.HTTP_204_NO_CONTENT) 
