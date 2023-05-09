import React, {useContext} from 'react'
import AuthContext from '../context/AuthContext'

const Main = () => {
  let {user} = useContext(AuthContext)
  return (
    <div>
        {user 
        ?
        <h1> Пользователь {user.username}</h1>
        :
        <h1> Войдите в систему</h1>
        }
        <h1> Система управления ИТ-проектами </h1>
    </div>
  )
}

export default Main