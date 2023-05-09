import ItProject from "../pages/Tables/ItProject";
import DevelopmentTeam from "../pages/Tables/DevelopmentTeam";
import Developer from "../pages/Tables/Developer";
import Task from "../pages/Tables/Task";
import Subtask from "../pages/Tables/Subtask";
import Expenses from "../pages/Tables/Expenses";

import ItProjectId from "../pages/ById/ItProjectId";
import DevelopmentTeamId from "../pages/ById/DevelopmentTeamId";
import DeveloperId from "../pages/ById/DeveloperId";
import TaskId from "../pages/ById/TaskId";
import SubtaskId from "../pages/ById/SubtaskId";
import ExpensesId from "../pages/ById/ExpensesId";

import Main from "../pages/Main";
import Login from "../pages/Login";
import Registration from "../pages/Registration";


export const privateRoutes = [
    {path: '/ItProject', component: ItProject},
    // {path: '/DevelopmentTeam', component: DevelopmentTeam},
    {path: '/Developer', component: Developer},
    {path: '/Task', component: Task},
    {path: '/Subtask', component: Subtask},
    {path: '/Expenses', component: Expenses},

    {path: '/ItProject/:id', component: ItProjectId},
    {path: '/DevelopmentTeam/:id', component: DevelopmentTeamId},
    {path: '/Developer/:id', component: DeveloperId},
    {path: '/Task/:id', component: TaskId},
    {path: '/Subtask/:id', component: SubtaskId},
    {path: '/Expenses/:id', component: ExpensesId},
]


export const publicRoutes = [
    {path: '/', component: Main},
    {path: '/login', component: Login},
    {path: '/registration', component: Registration},
]