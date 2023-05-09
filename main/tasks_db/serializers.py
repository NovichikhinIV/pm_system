from rest_framework import serializers
from rest_framework.fields import SerializerMethodField

from .models import ItProject, DevelopmentTeam, Developer, Task, Subtask, Expenses


class ItProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItProject
        fields = '__all__'
        
        
class DevelopmentTeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = DevelopmentTeam
        fields = '__all__'
        
        
class DevelopmentTeamSerializerWithoutUser(serializers.ModelSerializer):
    class Meta:
        model = DevelopmentTeam
        fields = ['id', 'about']


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



# MyModelSerializer

class MyModelSerializer(serializers.ModelSerializer):
    def __init__(self, *args, **kwargs):
        super(MyModelSerializer, self).__init__(*args, **kwargs)

        if 'labels' in self.fields:
            raise RuntimeError(
                'You cant have labels field defined '
                'while using MyModelSerializer'
            )

        self.fields['labels'] = SerializerMethodField()

    def get_labels(self, *args):
        labels = {}

        for field in self.Meta.model._meta.get_fields():
            if field.name in self.fields:
                labels[field.name] = field.verbose_name

        return labels
    
    
class ItProjectSerializerLabels(MyModelSerializer):
    class Meta:
        model = ItProject
        fields = '__all__'
        
        
class DevelopmentTeamSerializerLabels(MyModelSerializer):
    class Meta:
        model = DevelopmentTeam
        fields = '__all__'
        
        
class DevelopmentTeamSerializerWithoutUserLabels(MyModelSerializer):
    class Meta:
        model = DevelopmentTeam
        fields = ['id', 'about']


class DeveloperSerializerLabels(MyModelSerializer):
    class Meta:
        model = Developer
        fields = '__all__'


class TaskSerializerLabels(MyModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'


class SubtaskSerializerLabels(MyModelSerializer):
    class Meta:
        model = Subtask
        fields = '__all__'


class ExpensesSerializerLabels(MyModelSerializer):
    class Meta:
        model = Expenses
        fields = '__all__'
