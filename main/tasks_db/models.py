from django.db import models
from django.db.models import CheckConstraint, Q, F


class ItProject(models.Model):
    name = models.CharField(max_length=255, verbose_name="Название")
    description = models.TextField(blank=True, null=True, verbose_name="Описание")
    start_date = models.DateField(auto_now_add=False, verbose_name="Время начала")
    deadline = models.DateField(auto_now_add=False, verbose_name="Крайний срок")
    team = models.ForeignKey('DevelopmentTeam', on_delete=models.PROTECT, verbose_name="Команда разработки")

    def __str__(self) -> str:
        return self.name
    
    class Meta:
        constraints = [
            CheckConstraint(check = Q(deadline__gte=F('start_date')), name = 'Время окончания проекта'),
        ]
    


class DevelopmentTeam(models.Model):
    about = models.TextField(verbose_name="о команде")
    user_id = models.IntegerField(verbose_name="Пользователь")

    def __str__(self) -> str:
        return "development team " + str(self.pk)



class Developer(models.Model):
    first_name = models.CharField(max_length=255, verbose_name="Имя")
    last_name = models.CharField(max_length=255, verbose_name="Фамилия")
    middle_name = models.CharField(max_length=255, blank=True, null=True, verbose_name="Отчество")
    email = models.EmailField(max_length=255, verbose_name="email")
    salary = models.IntegerField(verbose_name="Зарплата")
    team = models.ForeignKey('DevelopmentTeam', on_delete=models.PROTECT, verbose_name="Команда разработки")
    
    def __str__(self) -> str:
        return self.first_name + self.last_name
    
    class Meta:
        constraints = [
            CheckConstraint(check = Q(salary__gt=0), name = 'Зарплата больше нуля'),
        ]

    

class Task(models.Model):
    name = models.CharField(max_length=255, verbose_name="Название")
    description = models.TextField(blank=True, null=True, verbose_name="Описание")
    start_time = models.DateField(auto_now_add=False, blank=True, null=True, verbose_name="Время начала")
    lead_time = models.IntegerField(verbose_name="Часов на выполение")
    time_spent = models.IntegerField(blank=True, null=True, default=0, verbose_name="Потраченное время")
    end_time = models.DateField(auto_now_add=False, blank=True, null=True, verbose_name="Время окончания")
    developer = models.ForeignKey('Developer', on_delete=models.PROTECT, verbose_name="Разработчик")

    def __str__(self) -> str:
        return self.name
    
    class Meta:
        constraints = [
            CheckConstraint(check = Q(lead_time__gt=0), name = 'Часов на выполение задачи'),
            CheckConstraint(check = Q(time_spent__gte=0), name = 'Потраченное время на задачу'),
            CheckConstraint(check = Q(end_time__gte=F('start_time')), name = 'Время окончания задачи'),
        ]



class Subtask(models.Model):
    name = models.CharField(max_length=255, verbose_name="Название")
    description = models.TextField(blank=True, null=True, verbose_name="Описание")
    start_time = models.DateField(auto_now_add=False, blank=True, null=True, verbose_name="Время начала")
    lead_time = models.IntegerField(verbose_name="Часов на выполение")
    time_spent = models.IntegerField(blank=True, null=True, default=0, verbose_name="Потраченное время")
    end_time = models.DateField(auto_now_add=False, blank=True, null=True, verbose_name="Время окончания")
    task = models.ForeignKey('Task', on_delete=models.PROTECT, verbose_name="Задача")
    
    def __str__(self) -> str:
        return self.name
    
    class Meta:
        constraints = [
            CheckConstraint(check = Q(lead_time__gt=0), name = 'Часов на выполение подзадачи'),
            CheckConstraint(check = Q(time_spent__gte=0), name = 'Потраченное время на подзадачу'),
            CheckConstraint(check = Q(end_time__gte=F('start_time')), name = 'Время окончания подзадачи'),
        ]



class Expenses(models.Model):
    name = models.CharField(max_length=255, verbose_name="Название")
    price = models.IntegerField(verbose_name="Цена")
    project = models.ForeignKey('ItProject', on_delete=models.PROTECT, verbose_name="ИТ проект")

    def __str__(self) -> str:
        return "expenses for project number " + str(self.project)
    
    class Meta:
        constraints = [
            CheckConstraint(check = Q(price__gt=0), name = 'Цена больше нуля'),
        ]