import React, { useEffect, useState, useContext } from 'react'
import { useNavigate, useParams} from 'react-router-dom'
import DevelopmentTeamAPI from '../../API/DevelopmentTeamAPI';
import { useFetching } from '../../hooks/useFetching';
import {useForm} from 'react-hook-form'
import AuthContext from '../../context/AuthContext'

const DevelopmentTeamId = () => {
  const params = useParams()
  const navigate = useNavigate();
  let {authTokens, user} = useContext(AuthContext)


  const {
    register,
    formState: {errors, isValid},
    handleSubmit,
  } = useForm({mode: "onBlur"});


  const [DevelopmentTeam, setDevelopmentTeam] = useState(null);
  const [errorLoad, setErrorLoad] = useState(null);
  const [IsNew, setIsNew] = useState(false);
  const [IsLoading, setIsLoading] = useState(true);
  const [ProtectedError, setProtectedError] = useState('');


  let [fetchDevelopmentTeamById, isDevelopmentTeamLoading, errorDevelopmentTeam] = useFetching(async (id) => {
    const reponse = await DevelopmentTeamAPI.retrieve(params.id, authTokens.access);
    if(reponse.status === 404) {
      setErrorLoad('Page not found')
    }
    let data = await reponse.json();
    setDevelopmentTeam(data)
  })




  useEffect(() => {
    if (params.id === 'new') {
      setIsNew(true)
    }
    else {
      if(typeof fetchDevelopmentTeamById === "function") {fetchDevelopmentTeamById(params.id) }
    }
  }, [])


  useEffect(() => {
    if(IsNew) {
      setIsLoading(false)
      setDevelopmentTeam({about: '', user_id: user.user_id})
    }
    else if(!isDevelopmentTeamLoading) {
      setIsLoading(false)
    }
  }, [IsNew, isDevelopmentTeamLoading])



  const createHandler = async (data, e) => {
    e.preventDefault()
    const response = await DevelopmentTeamAPI.create(DevelopmentTeam, authTokens.access);
    await navigate(-1)
  }

  const updateHandler = async (data, e) => {
    e.preventDefault()
    const response = await DevelopmentTeamAPI.update(DevelopmentTeam.id, DevelopmentTeam, authTokens.access);
    await navigate(-1)
  }

  const destroyHandler = async (e) => {
    e.preventDefault()
    const response = await DevelopmentTeamAPI.destroy(DevelopmentTeam.id, authTokens.access);
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
              <h2 className="form__title">Команда разработчиков</h2>
              <div className="form__group">
                  <div className="form__item">
                      <div>
                        {errors.about && errors.about.message ? 
                        <p>{errors.about.message.toString()}</p> :
                        <p></p>}
                      </div>
                      <label htmlFor="about">О команде</label>
                      <input type="text"
                          {...register("about", {
                            required: "Поле обязательно к заполнению",
                          })}
                          value={DevelopmentTeam.about} onChange={e => setDevelopmentTeam({...DevelopmentTeam, 'about': e.target.value})}
                      />
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

export default DevelopmentTeamId