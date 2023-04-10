from rest_framework import viewsets, status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from .models import ItProject, DevelopmentTeam, Developer, Task, Subtask, Expenses
from .serializers import ItProjectSerializer, DevelopmentTeamSerializer, DeveloperSerializer, TaskSerializer, SubtaskSerializer, ExpensesSerializer



class ItProjectViewSet(viewsets.ModelViewSet):
    queryset = ItProject.objects.all()
    serializer_class = ItProjectSerializer

class DevelopmentTeamViewSet(viewsets.ModelViewSet):
    queryset = DevelopmentTeam.objects.all()
    serializer_class = DevelopmentTeamSerializer
    
class DeveloperViewSet(viewsets.ModelViewSet):
    queryset = Developer.objects.all()
    serializer_class = DeveloperSerializer
    
class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    
class SubtaskViewSet(viewsets.ModelViewSet):
    queryset = Subtask.objects.all()
    serializer_class = SubtaskSerializer
    
class ExpensesViewSet(viewsets.ModelViewSet):
    queryset = Expenses.objects.all()
    serializer_class = ExpensesSerializer
    

# class ItProjectViewSet(viewsets.ViewSet):
#     def list(self, request):
#         queryset = ItProject.objects.all()
#         serializer = ItProjectSerializer(queryset, many=True)
#         return Response(serializer.data)

#     def create(self, request):
#         serializer = ItProjectSerializer(data=request.data)
#         serializer.is_valid(raise_exception=True)
#         serializer.save()
#         return Response(serializer.data, status=status.HTTP_201_CREATED)

#     def retrieve(self, request, pk=None):
#         queryset = ItProject.objects.get(id=pk)
#         query = get_object_or_404(queryset, pk=pk)
#         serializer = ItProjectSerializer(query)
#         return Response(serializer.data)

#     def update(self, request, pk=None):
#         queryset = ItProject.objects.get(id=pk)
#         serializer = ItProjectSerializer(instance=queryset, data=request.data)
#         serializer.is_valid(raise_exception=True)
#         serializer.save()
#         return Response(serializer.data, status=status.HTTP_202_ACCEPTED)

#     def destroy(self, request, pk=None):
#         queryset = ItProject.objects.get(id=pk)
#         queryset.delete()
#         return Response(status=status.HTTP_204_NO_CONTENT)