import React, {useContext, useState} from 'react'
import {useForm} from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import AuthAPI from '../API/AuthAPI';

const Registration = () => {

  const [error, setError] = useState("");

  const {
    register,
    formState: {errors, isValid},
    handleSubmit,
  } = useForm({mode: "onBlur"});

  const navigate = useNavigate()

  const registrationHandler = async (formData, e) => {
    e.preventDefault()
    let response = await AuthAPI.registration({'username':e.target.username.value, 'password':e.target.password.value});

    let data = await response.json()

    if(response.status === 201){
        navigate('/login')
    } 
    else if (response.status === 400){
        setError("Пользователь с таким именем уже существует")
    }
    else {
        alert('Что то пошло не так')
    }
  }


  return (
    <div>
      <form onSubmit={handleSubmit(registrationHandler)} className={["form", "login"].join(' ')}>
        <h2 className="form__title">Регистрация</h2>
        <div className="center">{error}</div>
        <div className="form__group">
          <div className="form__item">
            <div>
              {errors.username && errors.username.message ? 
              <p>{errors.username.message.toString()}</p> :
              <p></p>}
            </div>
            <label htmlFor="username">username</label>
            <input type="text"
              {...register("username", {
                required: "Поле обязательно к заполнению",
              })} 
            />
          </div>
          
          <div className="form__item">
            <div>
              {errors.password && errors.password.message ? 
              <p>{errors.password.message.toString()}</p> :
              <p></p>}
            </div>
            <label htmlFor="password">password</label>
            <input type="password" 
              {...register("password", {
                required: "Поле обязательно к заполнению",
              })} 
            />
          </div>

        </div>

          <div className="form__buttons">
              <input disabled={!isValid} type="submit" value="Зарегестрироваться" className={["button", "blueButton"].join(' ')}/>
          </div>
        </form>

    </div>
  )
}

export default Registration