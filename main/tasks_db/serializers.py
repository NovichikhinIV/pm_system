from rest_framework import serializers

from .models import ItProject, DevelopmentTeam, Developer, Task, Subtask, Expenses


class ItProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItProject
        fields = '__all__'
        
        
class DevelopmentTeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = DevelopmentTeam
        fields = '__all__'


class DeveloperSerializer(serializers.ModelSerializer):
    class Meta:
        model = Developer
        fields = '__all__'


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'


class SubtaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subtask
        fields = '__all__'


class ExpensesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expenses
        fields = '__all__'
