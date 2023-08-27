import ItProject from "../pages/Tables/ItProject";
import Developer from "../pages/Tables/Developer";
import Task from "../pages/Tables/Task";
import Expenses from "../pages/Tables/Expenses";

import ItProjectId from "../pages/ById/ItProjectId";
import DevelopmentTeamId from "../pages/ById/DevelopmentTeamId";
import DeveloperId from "../pages/ById/DeveloperId";
import TaskId from "../pages/ById/TaskId";
import SubtaskId from "../pages/ById/SubtaskId";
import ExpensesId from "../pages/ById/ExpensesId";

import Report from "../pages/Report";

import Main from "../pages/Main";
import Login from "../pages/Login";
import Registration from "../pages/Registration";


export const privateRoutes = [
    {path: '/ItProject', component: ItProject},
    {path: '/Developer', component: Developer},
    {path: '/Task', component: Task},
    {path: '/Expenses', component: Expenses},

    {path: '/ItProject/:id', component: ItProjectId},
    {path: '/DevelopmentTeam/:id', component: DevelopmentTeamId},
    {path: '/Developer/:id', component: DeveloperId},
    {path: '/Task/:id', component: TaskId},
    {path: '/Subtask/:id', component: SubtaskId},
    {path: '/Expenses/:id', component: ExpensesId},

    {path: '/ItProject/:id/report', component: Report},
]


export const publicRoutes = [
    {path: '/', component: Main},
    {path: '/login', component: Login},
    {path: '/registration', component: Registration},
]