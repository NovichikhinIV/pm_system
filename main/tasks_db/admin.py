from django.contrib import admin

from .models import *

admin.site.register(ItProject)
admin.site.register(DevelopmentTeam)
admin.site.register(Developer)
admin.site.register(Task)
admin.site.register(Subtask)
admin.site.register(Expenses)
