import React, { useEffect, useState, useContext } from 'react'
import { Link, useNavigate, useParams} from 'react-router-dom'
import TaskAPI from '../../API/TaskAPI';
import DeveloperAPI from '../../API/DeveloperAPI';
import SubtaskAPI from '../../API/SubtaskAPI';
import { useFetching } from '../../hooks/useFetching';
import {useForm} from 'react-hook-form'
import AuthContext from '../../context/AuthContext'
import MyTable from '../../components/UI/table/MyTable';

const ItProjectId = () => {
  const params = useParams()
  const navigate = useNavigate();
  let {authTokens} = useContext(AuthContext)


  const {
    register,
    formState: {errors, isValid},
    handleSubmit,
  } = useForm({mode: "onBlur"});



  const [Task, setTask] = useState(null);
  const [Developers, setDevelopers] = useState([]);
  const [errorLoad, setErrorLoad] = useState(null);
  const [IsNew, setIsNew] = useState(false);
  const [IsLoading, setIsLoading] = useState(true);
  const [ProtectedError, setProtectedError] = useState('');
  
  const [Subtasks, setSubtasks] = useState([]);
  const [Check, setChech] = useState(false);
  const [DisabledFlag, setDisabledFlag] = useState(false)


  let [fetchTaskById, isTaskLoading, errorTask] = useFetching(async (id) => {
    const reponse = await TaskAPI.retrieve(params.id, authTokens.access);
    if(reponse.status === 404) {
      setErrorLoad('Page not found')
    }
    let data = await reponse.json();
    setTask(data)
  })

  let [fetchDevelopers, isDevelopersLoading, errorDevelopers] = useFetching(async () => {
    const reponse = await DeveloperAPI.list(authTokens.access);
    let data = await reponse.json();
    setDevelopers(data.sort((a, b) => a.id > b.id ? 1 : -1))
  })


  let [fetchSubtasks, isSubtasksLoading, errorSubtask] = useFetching(async (id) => {
    const reponse = await SubtaskAPI.list(authTokens.access);
    let data = await reponse.json();
    setSubtasks(data.sort((a, b) => a.id > b.id ? 1 : -1))
  })



  useEffect(() => {
    if(typeof fetchDevelopers === "function") {fetchDevelopers() }
    
    if (params.id === 'new') {
      setIsNew(true)
    }
    else {
      if(typeof fetchTaskById === "function") {fetchTaskById(params.id) }
      if(typeof fetchSubtasks === "function") {fetchSubtasks() }
    }
  }, [])


  useEffect(() => {
    if(IsNew && !isDevelopersLoading && Developers.length === 0) {
      setErrorLoad('Сначала надо добавить разработчика')
      setIsLoading(false)
    }
    else if(IsNew && !isDevelopersLoading) {
      setIsLoading(false)
      setTask({name: '', description: '', lead_time: '', time_spent: null, start_time: null, end_time: null, status: 'не начато', developer: Developers[0].id})
    }
    else if(!isTaskLoading && !isDevelopersLoading && !isSubtasksLoading) {
      setIsLoading(false)
      setSubtasks(Subtasks.filter((el) => el.task === parseInt(Task.id)))
      setChech(true)
    }
  }, [IsNew, isTaskLoading, isDevelopersLoading, isSubtasksLoading])


  useEffect(() => {
    if(Subtasks.length !== 0) {
      setDisabledFlag(true)
    }

  }, [Check])


  const createHandler = async (data, e) => {
    e.preventDefault()
    const response = await TaskAPI.create(Task, authTokens.access);
    await navigate(-1)
  }

  const updateHandler = async (data, e) => {
    e.preventDefault()
    const response = await TaskAPI.update(Task.id, Task, authTokens.access);
    await navigate(-1)
  }

  const destroyHandler = async (e) => {
    e.preventDefault()
    const response = await TaskAPI.destroy(Task.id, authTokens.access);
    if(response.status === 500) {
        setProtectedError('Удалите связанные с этой записью элементы')
    }
    else {
        await navigate(-1)
    }
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
              <h2 className="form__title">Задача</h2>
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
                          value={Task.name} onChange={e => setTask({...Task, 'name': e.target.value})}
                      />
                  </div>

                  <div className="form__item">
                      <label htmlFor="description">Описание</label>
                      <textarea name="description" value={Task.description} onChange={e => setTask({...Task, 'description': e.target.value})}/>
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
                          value={Task.lead_time} onChange={e => setTask({...Task, 'lead_time': e.target.value})} disabled={DisabledFlag}
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
                          value={Task.time_spent} onChange={e => setTask({...Task, 'time_spent': e.target.value})} disabled={DisabledFlag}
                      />
                  </div>

                  <div className="form__item">
                      <label htmlFor="start_time">Время начала</label>
                      <input type="date" name="start_time" max={Task.end_time} value={Task.start_time} 
                      onChange={e => e.target.value !== '' ? setTask({...Task, 'start_time': e.target.value}) : setTask({...Task, 'start_time': null})} disabled={DisabledFlag}
                      />
                  </div>

                  <div className="form__item">
                      <label htmlFor="end_time">Время окончания</label>
                      <input type="date" name="end_time" min={Task.start_time} value={Task.end_time} 
                      onChange={e => e.target.value !== '' ? setTask({...Task, 'end_time': e.target.value}) : setTask({...Task, 'end_time': null})} disabled={DisabledFlag}
                      />
                  </div>

                  <div className="form__item">
                      <label htmlFor="status">Статус</label>
                      <select name="status" value={Task.status} onChange={e => setTask({...Task, 'status': e.target.value})} disabled={DisabledFlag}>
                          <option>не начато</option>
                          <option>в процессе</option>
                          <option>выполнено</option>
                      </select>
                  </div>

                  <div className="form__item">
                      <label htmlFor="developer">Разработчик</label>
                      <select name="developer" value={Task.developer} onChange={e => setTask({...Task, 'developer': e.target.value})}>
                      {Developers.map((obj, index) => (
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

              <div className="form__title">
                {ProtectedError}
              </div>
          </form>

          <h1>Подзадачи</h1>

          <Link to="/Subtask/new">
            <button className={["button", "blueButton"].join(' ')}>
              Добавить подзадачу
            </button>
          </Link>


          {Subtasks.length === 0 ?
          <></>
          :
          <MyTable data={Subtasks} pageName='Subtask'/>
          }

          </>
          }
        </>
        }
        
    </div>
  )
}

export default ItProjectId