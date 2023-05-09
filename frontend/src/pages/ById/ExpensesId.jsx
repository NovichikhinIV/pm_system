import React, { useEffect, useState, useContext } from 'react'
import { useNavigate, useParams} from 'react-router-dom'
import ExpensesAPI from '../../API/ExpensesAPI';
import ItProjectAPI from '../../API/ItProjectAPI';
import { useFetching } from '../../hooks/useFetching';
import {useForm} from 'react-hook-form'
import AuthContext from '../../context/AuthContext'

const ExpensesId = () => {
  const params = useParams()
  const navigate = useNavigate();
  let {authTokens} = useContext(AuthContext)


  const {
    register,
    formState: {errors, isValid},
    handleSubmit,
  } = useForm({mode: "onBlur"});



  const [Expenses, setExpenses] = useState(null);
  const [ItProjects, setItProjects] = useState([]);
  const [errorLoad, setErrorLoad] = useState(null);
  const [IsNew, setIsNew] = useState(false);
  const [IsLoading, setIsLoading] = useState(true);


  let [fetchExpensesById, isExpensesLoading, errorExpenses] = useFetching(async (id) => {
    const reponse = await ExpensesAPI.retrieve(params.id, authTokens.access);
    if(reponse.status === 404) {
      setErrorLoad('Page not found')
    }
    let data = await reponse.json();
    setExpenses(data)
  })

  let [fetchItProject, isItProjectLoading, errorItProject] = useFetching(async () => {
    const reponse = await ItProjectAPI.list(authTokens.access);
    let data = await reponse.json();
    setItProjects(data)
  })



  useEffect(() => {
    if(typeof fetchItProject === "function") {fetchItProject() }
    
    if (params.id === 'new') {
      setIsNew(true)
    }
    else {
      if(typeof fetchExpensesById === "function") {fetchExpensesById(params.id) }
    }
  }, [])


  useEffect(() => {
    if(IsNew && !isItProjectLoading && ItProjects.length === 0) {
      setErrorLoad('Сначала надо добавить ИТ проект')
      setIsLoading(false)
    }
    else if(IsNew && !isItProjectLoading) {
      setIsLoading(false)
      setExpenses({name: '', price: '', project: ItProjects[0].id})
    }
    else if(!isExpensesLoading && !isItProjectLoading) {
      setIsLoading(false)
    }
  }, [IsNew, isExpensesLoading, isItProjectLoading])



  const createHandler = async (data, e) => {
    e.preventDefault()
    const response = await ExpensesAPI.create(Expenses, authTokens.access);
    await navigate(-1)
  }

  const updateHandler = async (data, e) => {
    e.preventDefault()
    const response = await ExpensesAPI.update(Expenses.id, Expenses, authTokens.access);
    await navigate(-1)
  }

  const destroyHandler = async (e) => {
    e.preventDefault()
    const response = await ExpensesAPI.destroy(Expenses.id, authTokens.access);
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
              <h2 className="form__title">Затраты</h2>
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
                          value={Expenses.name} onChange={e => setExpenses({...Expenses, 'name': e.target.value})}
                      />
                  </div>

                  <div className="form__item">
                      <div>
                        {errors.price && errors.price.message ? 
                        <p>{errors.price.message.toString()}</p> :
                        <p></p>}
                      </div>
                      <label htmlFor="price">Цена</label>
                      <input type="text"
                          {...register("price", {
                            required: "Поле обязательно к заполнению",
                            pattern: {
                                value: /^[0-9]+$/,
                                message: "Введите целое неотрицательное число"
                            }
                          })}
                          value={Expenses.price} onChange={e => setExpenses({...Expenses, 'price': e.target.value})}
                      />
                  </div>

                  <div className="form__item">
                      <label htmlFor="project">ИТ проект</label>
                      <select name="project" value={Expenses.project} onChange={e => setExpenses({...Expenses, 'project': e.target.value})}>
                      {ItProjects.map((obj, index) => (
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

export default ExpensesId