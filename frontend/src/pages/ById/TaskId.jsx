import React, { useEffect, useState, useContext } from 'react'
import { useNavigate, useParams} from 'react-router-dom'
import TaskAPI from '../../API/TaskAPI';
import DeveloperAPI from '../../API/DeveloperAPI';
import { useFetching } from '../../hooks/useFetching';
import {useForm} from 'react-hook-form'
import AuthContext from '../../context/AuthContext'

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
    setDevelopers(data)
  })



  useEffect(() => {
    if(typeof fetchDevelopers === "function") {fetchDevelopers() }
    
    if (params.id === 'new') {
      setIsNew(true)
    }
    else {
      if(typeof fetchTaskById === "function") {fetchTaskById(params.id) }
    }
  }, [])


  useEffect(() => {
    if(IsNew && !isDevelopersLoading && Developers.length === 0) {
      setErrorLoad('Сначала надо добавить разработчика')
      setIsLoading(false)
    }
    else if(IsNew && !isDevelopersLoading) {
      setIsLoading(false)
      setTask({name: '', description: '', start_time: null, lead_time: '', time_spent: null, end_time: null, developer: Developers[0].id})
    }
    else if(!isTaskLoading && !isDevelopersLoading) {
      setIsLoading(false)
    }
  }, [IsNew, isTaskLoading, isDevelopersLoading])



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
                      <label htmlFor="start_time">Время начала</label>
                      <input type="date" name="start_time" max={Task.end_time} value={Task.start_time} onChange={e => setTask({...Task, 'start_time': e.target.value})}
                      />
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
                          value={Task.lead_time} onChange={e => setTask({...Task, 'lead_time': e.target.value})}
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
                          value={Task.time_spent} onChange={e => setTask({...Task, 'time_spent': e.target.value})}
                      />
                  </div>

                  <div className="form__item">
                      <label htmlFor="end_time">Время окончания</label>
                      <input type="date" name="end_time" min={Task.start_time} value={Task.end_time} onChange={e => setTask({...Task, 'end_time': e.target.value})}
                      />
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


          </>
          }
        </>
        }
        
    </div>
  )
}

export default ItProjectId