from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.exceptions import AuthenticationFailed
import requests
import json
from dateutil.parser import parse as du_parse
from dateutil.relativedelta import relativedelta

from .service.auth_service import Auth
from .decorators import is_authorized
from .helpers import extract_token


@api_view(['GET'])
def getRoutes(request):
    routes = [
        '/api/report<str:pk>/',
    ]

    return Response(routes)


class Report(APIView):
    @is_authorized
    def get(self, request, pk=None):  
        token = extract_token(request.headers)
        user = Auth().get_user(token).get('id')
        authHeaders = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer {}'.format(token),
        }
        
        # ItProject
        resItProject = requests.get(f'http://main:8000/api/ItProject/{pk}/', headers=authHeaders)
        if (resItProject.status_code) != 200:
            raise AuthenticationFailed('Unauthenticated')
        team = resItProject.json()['team']

        # Developer
        resDevelopersAll = requests.get(f'http://main:8000/api/Developer/', headers=authHeaders)
        resDevelopers = [x for x in resDevelopersAll.json() if x['team'] == team]
        idDevelopers = [x['id'] for x in resDevelopers]
        
        # Task and Subtask
        resTaskAll = requests.get(f'http://main:8000/api/Task/', headers=authHeaders)
        resTask = [x for x in resTaskAll.json() if x['developer'] in idDevelopers]
        idTasks = [x['id'] for x in resTask]
        
        resSubtaskAll = requests.get(f'http://main:8000/api/Subtask/', headers=authHeaders)
        resSubtask = [x for x in resSubtaskAll.json() if x['task'] in idTasks]

        # Expenses
        resExpensesAll = requests.get(f'http://main:8000/api/Expenses/', headers=authHeaders)
        resExpenses = [x for x in resExpensesAll.json() if x['project'] == int(pk)]
        
        
        
        # start_time and end_time
        st = None
        et = None
        for t in resTask:
            if(t['start_time'] != None):
                if(st == None):
                    st = t['start_time']
                else:
                    st = min(st, t['start_time'])
            if(t['end_time'] != None):
                if(et == None):
                    et = t['end_time']
                else:
                    et = max(et, t['end_time'])
                    
        # создание массива задач с подзадачами
        tasks = []
        for task in resTask:
            task_add = {'name': task['name'], 'start_time': task['start_time'], 'end_time': task['end_time'], 'status': task['status']}
            subtasks = []
            for subtask in resSubtask:
                if(subtask['task'] == task['id']):
                    subtask_add = {'name': subtask['name'], 'start_time': subtask['start_time'], 'end_time': subtask['end_time'], 'status': subtask['status']}
                    subtasks.append(subtask_add)
            task_add['subtasks'] = subtasks
            tasks.append(task_add)
        print(tasks)
        
        # создание массива затрат
        expenses = []
        expenses_sum = 0
        for expense in resExpenses:    
            expense_add = {'name': expense['name'], 'price': expense['price']}
            expenses.append(expense_add)
            expenses_sum += expense['price']
            
        # создание массива затрат на разработчиков
        expenses_dev = []
        expenses_dev_sum = 0
        for dev in resDevelopers:    
            expense_dev_add = {'first_name': dev['first_name'], 'last_name': dev['last_name'], 'salary': dev['salary']}
            expenses_dev.append(expense_dev_add)
            expenses_dev_sum += dev['salary']
        
        if(st != None and et != None): 
            itProject_length_days = relativedelta(du_parse(str(et)), du_parse(str(st))).days 
            expenses_dev_sum = int(expenses_dev_sum * itProject_length_days / 30)
        else:
            itProject_length_days = 0
            expenses_dev_sum = 0
            
            
        
        responseObject = {}
        responseObject['ItProjectName'] = resItProject.json()['name']
        responseObject['ItProjectDescription'] = resItProject.json()['description']
        responseObject['StartProject'] = st
        responseObject['EndProject'] = et
        responseObject['DevelopersCount'] = len(resDevelopers)
        
        responseObject['TasksCount'] = len(resTask) + len(resSubtask)
        responseObject['TasksDone'] = len([x for x in resTask if x['status'] == 'выполнено']) + len([x for x in resSubtask if x['status'] == 'выполнено'])
        responseObject['Tasks'] = tasks
        
        responseObject['Expenses'] = expenses
        responseObject['ExpensesSum'] = expenses_sum
        responseObject['ExpensesDev'] = expenses_dev
        responseObject['ExpensesDevSum'] = expenses_dev_sum
        responseObject['ExpensesAll'] = expenses_sum + expenses_dev_sum
        
        
        return Response(responseObject)
    