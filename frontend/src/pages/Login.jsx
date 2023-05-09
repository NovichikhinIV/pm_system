import React, {useContext} from 'react'
import AuthContext from '../context/AuthContext'
import {useForm} from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  let {loginUser} = useContext(AuthContext)

  const {
    register,
    formState: {errors, isValid},
    handleSubmit,
  } = useForm({mode: "onBlur"});

  const navigate = useNavigate()

  const registrationHandler = async (e) => {
    e.preventDefault()
    navigate('/registration')
  }


  return (
    <div>
      <form onSubmit={handleSubmit(loginUser)} className={["form", "login"].join(' ')}>
        <h2 className="form__title">Вход</h2>
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
              <input disabled={!isValid} type="submit" value="Войти" className={["button", "blueButton"].join(' ')}/>
          </div>
        </form>

        <form className="center">
          <button onClick={registrationHandler} className={["button", "greenButton"].join(' ')}>Регистрация</button>
        </form>
    </div>
  )
}

export default Login