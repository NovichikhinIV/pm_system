import React, { useEffect, useState, useContext } from 'react'
import { Link, useNavigate, useParams} from 'react-router-dom'
import ItProjectAPI from '../../API/ItProjectAPI';
import DevelopmentTeamAPI from '../../API/DevelopmentTeamAPI';
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



  const [ItProject, setItProject] = useState(null);
  const [DevelopmentTeams, setDevelopmentTeams] = useState([]);
  const [errorLoad, setErrorLoad] = useState(null);
  const [IsNew, setIsNew] = useState(false);
  const [IsLoading, setIsLoading] = useState(true);
  const [ProtectedError, setProtectedError] = useState('');


  let [fetchItProjectById, isProjectLoading, errorProject] = useFetching(async (id) => {
    const reponse = await ItProjectAPI.retrieve(params.id, authTokens.access);
    if(reponse.status === 404) {
      setErrorLoad('Page not found')
    }
    let data = await reponse.json();
    setItProject(data)
  })

  let [fetchDevelopmentTeams, isTeamsLoading, errorTeams] = useFetching(async () => {
    const reponse = await DevelopmentTeamAPI.list(authTokens.access);
    let data = await reponse.json();
    setDevelopmentTeams(data.sort((a, b) => a.id > b.id ? 1 : -1))
  })



  useEffect(() => {
    if(typeof fetchDevelopmentTeams === "function") {fetchDevelopmentTeams() }
    
    if (params.id === 'new') {
      setIsNew(true)
    }
    else {
      if(typeof fetchItProjectById === "function") {fetchItProjectById(params.id) }
    }
  }, [])


  useEffect(() => {
    if(IsNew && !isTeamsLoading && DevelopmentTeams.length === 0) {
      setErrorLoad('Сначала надо добавить команду разработчиков')
      setIsLoading(false)
    }
    else if(IsNew && !isTeamsLoading) {
      setIsLoading(false)
      setItProject({name: '', description: '', team: DevelopmentTeams[0].id})
    }
    else if(!isProjectLoading && !isTeamsLoading) {
      setIsLoading(false)
    }
  }, [IsNew, isProjectLoading, isTeamsLoading])



  const createHandler = async (data, e) => {
    e.preventDefault()
    const response = await ItProjectAPI.create(ItProject, authTokens.access);
    await navigate(-1)
  }

  const updateHandler = async (data, e) => {
    e.preventDefault()
    const response = await ItProjectAPI.update(ItProject.id, ItProject, authTokens.access);
    await navigate(-1)
  }

  const destroyHandler = async (e) => {
    e.preventDefault()
    const response = await ItProjectAPI.destroy(ItProject.id, authTokens.access);
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
              <h2 className="form__title">ИТ-проекты</h2>
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
                          value={ItProject.name} onChange={e => setItProject({...ItProject, 'name': e.target.value})}
                      />
                  </div>

                  <div className="form__item">
                      <label htmlFor="description">Описание</label>
                      <textarea name="description" value={ItProject.description} onChange={e => setItProject({...ItProject, 'description': e.target.value})}/>
                  </div>

                  <div className="form__item">
                      <label htmlFor="team">Команда разработки</label>
                      <select name="team" value={ItProject.team} onChange={e => setItProject({...ItProject, 'team': e.target.value})}>
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
          
          {IsNew ?
          <></>
          :
          <Link to={`/ItProject/${params.id}/report`}>
            <button className={["button", "greenButton"].join(' ')}>
              Составить отчет по проекту
            </button>
          </Link>
          }
          
          

          </>
          }
        </>
        }
        
    </div>
  )
}

export default ItProjectId