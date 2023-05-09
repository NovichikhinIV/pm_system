import React, { useEffect, useState, useContext } from 'react'
import { useNavigate, useParams} from 'react-router-dom'
import DeveloperAPI from '../../API/DeveloperAPI';
import DevelopmentTeamAPI from '../../API/DevelopmentTeamAPI';
import { useFetching } from '../../hooks/useFetching';
import {useForm} from 'react-hook-form'
import AuthContext from '../../context/AuthContext'

const DeveloperId = () => {
  const params = useParams()
  const navigate = useNavigate();
  let {authTokens} = useContext(AuthContext)

  const EMAIL_REGEXP = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;


  const {
    register,
    formState: {errors, isValid},
    handleSubmit,
  } = useForm({mode: "onBlur"});



  const [Developer, setDeveloper] = useState(null);
  const [DevelopmentTeams, setDevelopmentTeams] = useState([]);
  const [errorLoad, setErrorLoad] = useState(null);
  const [IsNew, setIsNew] = useState(false);
  const [IsLoading, setIsLoading] = useState(true);
  const [ProtectedError, setProtectedError] = useState('');


  let [fetchDeveloperById, isDeveloperLoading, errorDeveloper] = useFetching(async (id) => {
    const reponse = await DeveloperAPI.retrieve(params.id, authTokens.access);
    if(reponse.status === 404) {
      setErrorLoad('Page not found')
    }
    let data = await reponse.json();
    setDeveloper(data)
  })

  let [fetchDevelopmentTeams, isTeamsLoading, errorTeams] = useFetching(async () => {
    const reponse = await DevelopmentTeamAPI.list(authTokens.access);
    let data = await reponse.json();
    setDevelopmentTeams(data)
  })



  useEffect(() => {
    if(typeof fetchDevelopmentTeams === "function") {fetchDevelopmentTeams() }
    
    if (params.id === 'new') {
      setIsNew(true)
    }
    else {
      if(typeof fetchDeveloperById === "function") {fetchDeveloperById(params.id) }
    }
  }, [])


  useEffect(() => {
    if(IsNew && !isTeamsLoading && DevelopmentTeams.length === 0) {
      setErrorLoad('Сначала надо добавить команду разработчиков')
      setIsLoading(false)
    }
    else if(IsNew && !isTeamsLoading) {
      setIsLoading(false)
      setDeveloper({first_name: '', last_name: '', middle_name: '', email: '', salary: '', team: DevelopmentTeams[0].id})
    }
    else if(!isDeveloperLoading && !isTeamsLoading) {
      setIsLoading(false)
    }
  }, [IsNew, isDeveloperLoading, isTeamsLoading])



  const createHandler = async (data, e) => {
    e.preventDefault()
    const response = await DeveloperAPI.create(Developer, authTokens.access);
    await navigate(-1)
  }

  const updateHandler = async (data, e) => {
    e.preventDefault()
    const response = await DeveloperAPI.update(Developer.id, Developer, authTokens.access);
    await navigate(-1)
  }

  const destroyHandler = async (e) => {
    e.preventDefault()
    const response = await DeveloperAPI.destroy(Developer.id, authTokens.access);
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
              <h2 className="form__title">Разработчик</h2>
              <div className="form__group">
                  <div className="form__item">
                      <div>
                        {errors.first_name && errors.first_name.message ? 
                        <p>{errors.first_name.message.toString()}</p> :
                        <p></p>}
                      </div>
                      <label htmlFor="first_name">Имя</label>
                      <input type="text"
                          {...register("first_name", {
                            required: "Поле обязательно к заполнению",
                          })}
                          value={Developer.first_name} onChange={e => setDeveloper({...Developer, 'first_name': e.target.value})}
                      />
                  </div>

                  <div className="form__item">
                      <div>
                        {errors.last_name && errors.last_name.message ? 
                        <p>{errors.last_name.message.toString()}</p> :
                        <p></p>}
                      </div>
                      <label htmlFor="last_name">Фамилия</label>
                      <input type="text"
                          {...register("last_name", {
                            required: "Поле обязательно к заполнению",
                          })}
                          value={Developer.last_name} onChange={e => setDeveloper({...Developer, 'last_name': e.target.value})}
                      />
                  </div>

                  <div className="form__item">
                      <label htmlFor="middle_name">Отчество</label>
                      <textarea name="middle_name" value={Developer.middle_name} onChange={e => setDeveloper({...Developer, 'middle_name': e.target.value})}/>
                  </div>

                  <div className="form__item">
                      <div>
                        {errors.email && errors.email.message ? 
                        <p>{errors.email.message.toString()}</p> :
                        <p></p>}
                      </div>
                      <label htmlFor="email">email</label>
                      <input type="email"
                          {...register("email", {
                            required: "Поле обязательно к заполнению",
                            pattern: {
                                value: EMAIL_REGEXP,
                                message: "Введите правильный адрес электронной почты"
                            }
                          })}
                          value={Developer.email} onChange={e => setDeveloper({...Developer, 'email': e.target.value})}
                      />
                  </div>

                  <div className="form__item">
                      <div>
                        {errors.salary && errors.salary.message ? 
                        <p>{errors.salary.message.toString()}</p> :
                        <p></p>}
                      </div>
                      <label htmlFor="salary">Зарплата</label>
                      <input type="text"
                          {...register("salary", {
                            required: "Поле обязательно к заполнению",
                            pattern: {
                                value: /^[0-9]+$/,
                                message: "Введите целое неотрицательное число"
                            }
                          })}
                          value={Developer.salary} onChange={e => setDeveloper({...Developer, 'salary': e.target.value})}
                      />
                  </div>

                  <div className="form__item">
                      <label htmlFor="team">Команда разработки</label>
                      <select name="team" value={Developer.team} onChange={e => setDeveloper({...Developer, 'team': e.target.value})}>
                      {DevelopmentTeams.map((obj, index) => (
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

export default DeveloperId