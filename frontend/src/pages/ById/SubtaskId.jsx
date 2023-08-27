import React, { useEffect, useState, useContext } from 'react'
import { useNavigate, useParams} from 'react-router-dom'
import SubtaskAPI from '../../API/SubtaskAPI';
import TaskAPI from '../../API/TaskAPI';
import { useFetching } from '../../hooks/useFetching';
import {useForm} from 'react-hook-form'
import AuthContext from '../../context/AuthContext'

const SubtaskId = () => {
  const params = useParams()
  const navigate = useNavigate();
  let {authTokens} = useContext(AuthContext)


  const {
    register,
    formState: {errors, isValid},
    handleSubmit,
  } = useForm({mode: "onBlur"});



  const [Subtask, setSubtask] = useState(null);
  const [Tasks, setTasks] = useState([]);
  const [errorLoad, setErrorLoad] = useState(null);
  const [IsNew, setIsNew] = useState(false);
  const [IsLoading, setIsLoading] = useState(true);


  let [fetchSubtaskById, isSubtaskLoading, errorSubtask] = useFetching(async (id) => {
    const reponse = await SubtaskAPI.retrieve(params.id, authTokens.access);
    if(reponse.status === 404) {
      setErrorLoad('Page not found')
    }
    let data = await reponse.json();
    setSubtask(data)
  })

  let [fetchTasks, isTasksLoading, errorTasks] = useFetching(async () => {
    const reponse = await TaskAPI.list(authTokens.access);
    let data = await reponse.json();
    setTasks(data.sort((a, b) => a.id > b.id ? 1 : -1))
  })



  useEffect(() => {
    if(typeof fetchTasks === "function") {fetchTasks() }
    
    if (params.id === 'new') {
      setIsNew(true)
    }
    else {
      if(typeof fetchSubtaskById === "function") {fetchSubtaskById(params.id) }
    }
  }, [])


  useEffect(() => {
    if(IsNew && !isTasksLoading && Tasks.length === 0) {
      setErrorLoad('Сначала надо добавить задачу')
      setIsLoading(false)
    }
    else if(IsNew && !isTasksLoading) {
      setIsLoading(false)
      setSubtask({name: '', description: '', lead_time: '', time_spent: null, start_time: null, end_time: null, status: 'не начато', task: Tasks[0].id})
    }
    else if(!isSubtaskLoading && !isTasksLoading) {
      setIsLoading(false)
    }
  }, [IsNew, isSubtaskLoading, isTasksLoading])



  const createHandler = async (data, e) => {
    e.preventDefault()
    const response = await SubtaskAPI.create(Subtask, authTokens.access);
    await navigate(-1)
  }

  const updateHandler = async (data, e) => {
    e.preventDefault()
    const response = await SubtaskAPI.update(Subtask.id, Subtask, authTokens.access);
    await navigate(-1)
  }

  const destroyHandler = async (e) => {
    e.preventDefault()
    const response = await SubtaskAPI.destroy(Subtask.id, authTokens.access);
    await navigate(-1)
  }


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
          <button onClick={() => navigate(-1)} className={["button", "blueButton"].join(' ')}>Назад</button>

          <form className="form">
              <h2 className="form__title">Подзадача</h2>
              <div className="form__group">
                  <div className="form__item">
                      <div>
                        {errors.name && errors.name.message ? 
                        <p>{errors.name.message.toString()}</p> :
                        <p></p>}
                      </div>
                      <label htmlFor="name">Название</label>
                      <input type="text"
                          {...register("name", {
                            required: "Поле обязательно к заполнению",
                          })}
                          value={Subtask.name} onChange={e => setSubtask({...Subtask, 'name': e.target.value})}
                      />
                  </div>

                  <div className="form__item">
                      <label htmlFor="description">Описание</label>
                      <textarea name="description" value={Subtask.description} onChange={e => setSubtask({...Subtask, 'description': e.target.value})}/>
                  </div>

                  <div className="form__item">
                      <div>
                        {errors.lead_time && errors.lead_time.message ? 
                        <p>{errors.lead_time.message.toString()}</p> :
                        <p></p>}
                      </div>
                      <label htmlFor="lead_time">Часов на выполнение</label>
                      <input type="text"
                          {...register("lead_time", {
                            required: "Поле обязательно к заполнению",
                            pattern: {
                                value: /^[0-9]+$/,
                                message: "Введите целое неотрицательное число"
                            }
                          })}
                          value={Subtask.lead_time} onChange={e => setSubtask({...Subtask, 'lead_time': e.target.value})}
                      />
                  </div>

                  <div className="form__item">
                      <div>
                        {errors.time_spent && errors.time_spent.message ? 
                        <p>{errors.time_spent.message.toString()}</p> :
                        <p></p>}
                      </div>
                      <label htmlFor="time_spent">Потраченное время</label>
                      <input type="text"
                          {...register("time_spent", {
                            pattern: {
                                value: /^[0-9]+$/,
                                message: "Введите целое неотрицательное число"
                            }
                          })}
                          value={Subtask.time_spent} onChange={e => setSubtask({...Subtask, 'time_spent': e.target.value})}
                      />
                  </div>

                  <div className="form__item">
                      <label htmlFor="start_time">Время начала</label>
                      <input type="date" name="start_time" max={Subtask.end_time} value={Subtask.start_time} 
                      onChange={e => e.target.value !== '' ? setSubtask({...Subtask, 'start_time': e.target.value}) : setSubtask({...Subtask, 'start_time': null})}
                      />
                  </div>

                  <div className="form__item">
                      <label htmlFor="end_time">Время окончания</label>
                      <input type="date" name="end_time" min={Subtask.start_time} value={Subtask.end_time} 
                      onChange={e => e.target.value !== '' ? setSubtask({...Subtask, 'end_time': e.target.value}) : setSubtask({...Subtask, 'end_time': null})}
                      />
                  </div>

                  <div className="form__item">
                      <label htmlFor="status">Статус</label>
                      <select name="status" value={Subtask.status} onChange={e => setSubtask({...Subtask, 'status': e.target.value})}>
                          <option>не начато</option>
                          <option>в процессе</option>
                          <option>выполнено</option>
                      </select>
                  </div>

                  <div className="form__item">
                      <label htmlFor="task">Задача</label>
                      <select name="task" value={Subtask.task} onChange={e => setSubtask({...Subtask, 'task': e.target.value})}>
                      {Tasks.map((obj, index) => (
                          <option value={obj.id} key={index}>{obj.id}</option>
                      ))} 
                      </select>
                  </div> 



              </div>

              <div className="form__buttons">
                  {(params.id === 'new')
                  ?
                    <button disabled={!isValid} onClick={handleSubmit(createHandler)} className={["button", "blueButton"].join(' ')}>Создать</button>
                  :
                  <>
                    <button disabled={!isValid} onClick={handleSubmit(updateHandler)} className={["button", "blueButton"].join(' ')}>Изменить</button>
                    <button onClick={destroyHandler} className={["button", "redButton"].join(' ')}>Удалить</button>
                  </>
                  }
              </div>
          </form>


          </>
          }
        </>
        }
        
    </div>
  )
}

export default SubtaskId