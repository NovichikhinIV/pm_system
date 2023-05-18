from tasks_db.models import Task, Subtask


def taskUpdate(task_id):
    task = Task.objects.filter(id=task_id)
    subtasks = Subtask.objects.filter(task_id=task_id)
    if(len(subtasks) == 0):
        task.update(lead_time=1, time_spent=0, start_time=None, end_time=None, status=Task.NOT_STARTED)
    else:
        lt = 0
        ts = 0
        st = None
        et = None
        status = Task.NOT_STARTED
        statusDoneCounter = 0
        for s in subtasks:
            lt += s.lead_time
            if(s.time_spent != None):
                ts += s.time_spent
            if(s.start_time != None):
                if(st == None):
                    st = s.start_time
                else:
                    st = min(st, s.start_time)
            if(s.end_time != None):
                if(et == None):
                    et = s.end_time
                else:
                    et = max(et, s.end_time)
            if(s.status == Task.IN_PROGRESS):
                status = Task.IN_PROGRESS
            elif(s.status == Task.DONE):
                statusDoneCounter += 1
        
        if(statusDoneCounter == len(subtasks)):
            status = Task.DONE
              
        task.update(lead_time=lt, time_spent=ts, start_time=st, end_time=et, status=status)