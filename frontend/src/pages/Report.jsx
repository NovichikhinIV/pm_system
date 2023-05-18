import React, { useEffect, useState, useContext } from 'react'
import ReportAPI from '../API/ReportAPI';
import AuthContext from '../context/AuthContext'
import { useFetching } from '../hooks/useFetching';
import {useParams} from 'react-router-dom'

const Report = () => {
  let {authTokens} = useContext(AuthContext)
  const params = useParams()

  const [Report, setReport] = useState(null);
  const [errorLoad, setErrorLoad] = useState(null);
  const [IsLoading, setIsLoading] = useState(true);

  let [fetchReportById, isReportLoading, errorReport] = useFetching(async (id) => {
    const reponse = await ReportAPI.retrieve(params.id, authTokens.access);
    if(reponse.status !== 200) {
      setErrorLoad('Page not found')
    }
    let data = await reponse.json();
    setReport(data)
  })

  useEffect(() => {
    if(typeof fetchReportById === "function") {fetchReportById() }
  }, [])

  useEffect(() => {
    if(!isReportLoading) {
      setIsLoading(false)
      console.log(Report)
    }
  }, [isReportLoading])

  return (
    <div className="container">
      {IsLoading ?
        <h1>Loading</h1>
        : 
        <>

          {errorLoad ? 
          <h1><>{errorLoad}</></h1>
          : 
          <>
          <h1>Отчет по проекту {params.id}</h1>

          <div>
              <div className='marginTopBottom'><b>Название:</b> {Report.ItProjectName}</div>
              {Report.ItProjectDescription && <div className='marginTopBottom'><b>Описание:</b> {Report.ItProjectDescription}</div>}
              {Report.StartProject && Report.EndProject ? 
              <div className='marginTopBottom'><b>Сроки:</b> с {Report.StartProject} до {Report.EndProject}</div>
              :
                Report.StartProject !== null && Report.EndProject === null ?
                <div className='marginTopBottom'><b>Сроки:</b> с {Report.StartProject}</div>
                :
                  Report.StartProject === null && Report.EndProject !== null ?
                  <div className='marginTopBottom'><b>Сроки:</b> до {Report.EndProject}</div>
                  :
                  <div className='marginTopBottom'><b>Сроки:</b> -</div>
              }
              <div className='marginTopBottom'><b>Количество исполнителей:</b> {Report.DevelopersCount}</div>
              <div className='marginTopBottom'><b>Общее количество задач:</b> {Report.TasksCount}</div>
              <div className='marginTopBottom'><b>Выполнено задач:</b> {Report.TasksDone}</div>
          </div>
          
          <h1>Задачи</h1>
          {Report.Tasks.length === 0 ?
          <div>Задач нет</div>
          :
          <div className='taskContainer'>
              <div className='taskContainer__elem'>
                <b>Название</b>
                <ul>
                {Report.Tasks.map(task => (
                  <div key={task.id}>
                    <li className='taskContainer__elem_marginTopBottom'>{task.name}</li>
                    {task.subtasks && task.subtasks.length > 0 && (
                      <ul className='taskContainer__elem_marginLeft'>
                        {task.subtasks.map(subtask => (
                          <li key={subtask.id} className='taskContainer__elem_marginTopBottom'>{subtask.name}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
                </ul>
              </div>

              <div className='taskContainer__elem'>
                <b>Дата начала</b>
                {Report.Tasks.map(task => (
                  <div key={task.id}>
                    <div className='taskContainer__elem_marginTopBottom'>{task.start_time === null ? '-' : task.start_time}</div>
                    {task.subtasks && task.subtasks.length > 0 && (
                      task.subtasks.map(subtask => (
                        <div key={subtask.id} className='taskContainer__elem_marginTopBottom'>{subtask.start_time === null ? '-' : subtask.start_time}</div>
                      ))
                    )}
                  </div>
                ))}
              </div>
              
              <div className='taskContainer__elem'>
                <b>Дата окончания</b>
                {Report.Tasks.map(task => (
                  <div key={task.id}>
                    <div className='taskContainer__elem_marginTopBottom'>{task.end_time === null ? '-' : task.end_time}</div>
                    {task.subtasks && task.subtasks.length > 0 && (
                      task.subtasks.map(subtask => (
                        <div key={subtask.id} className='taskContainer__elem_marginTopBottom'>{subtask.end_time === null ? '-' : subtask.end_time}</div>
                      ))
                    )}
                  </div>
                ))}
              </div> 

              <div className='taskContainer__elem'>
                <b>Статус</b>
                {Report.Tasks.map(task => (
                  <div key={task.id}>
                    <div className='taskContainer__elem_marginTopBottom'>{task.status}</div>
                    {task.subtasks && task.subtasks.length > 0 && (
                      task.subtasks.map(subtask => (
                        <div key={subtask.id} className='taskContainer__elem_marginTopBottom'>{subtask.status}</div>
                      ))
                    )}
                  </div>
                ))}
              </div>     

          </div>   
          }   


          <h1>Затраты</h1>
          <div className='marginTopBottom'><b>Затраты на разработчиков в месяц</b></div>
          <ul>           
          {Report.ExpensesDev.map(expenseDev => (
            <li key={expenseDev.id} className='marginTopBottom'>{expenseDev.first_name} {expenseDev.last_name}: {expenseDev.salary}</li>
          ))}
          </ul>   
          <div><b>Итого на разработчиков за весь срок проекта: {Report.ExpensesDevSum}</b></div>


          <div className='marginTopBottom spaceTop'><b>Другие затраты</b></div>
          <ul>           
          {Report.Expenses.map(expense => (
            <li key={expense.id} className='marginTopBottom'>{expense.name}: {expense.price}</li>
          ))}
          </ul>   
          <div><b>Итого на другие затраты: {Report.ExpensesSum}</b></div>


          <div className='spaceTop spaceBottom'><b>Общие затраты: {Report.ExpensesAll}</b></div>

          </>
          }
        </>
      }

    </div>
  )
}

export default Report