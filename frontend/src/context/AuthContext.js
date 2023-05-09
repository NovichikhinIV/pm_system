import React from 'react'
import { createContext, useState, useEffect } from 'react'
import jwt_decode from "jwt-decode";
import { useNavigate } from 'react-router-dom'
import AuthAPI from '../API/AuthAPI';

const AuthContext = createContext(null)

export default AuthContext;


export const AuthProvider = ({children}) => {
    let [authTokens, setAuthTokens] = useState(()=> localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null)
    let [user, setUser] = useState(()=> localStorage.getItem('authTokens') ? jwt_decode(localStorage.getItem('authTokens')) : null)
    let [loading, setLoading] = useState(true)

    const navigate = useNavigate()

    let loginUser = async (formData, e)=> {
        e.preventDefault()
        let response = await AuthAPI.token({'username':e.target.username.value, 'password':e.target.password.value});
        let data = await response.json()

        if(response.status === 200){
            setAuthTokens(data)
            setUser(jwt_decode(data.access))
            localStorage.setItem('authTokens', JSON.stringify(data))
            navigate('/')
        } else {
            alert('Something went wrong!')
        }
    }

    let logoutUser = () => {
        setAuthTokens(null)
        setUser(null)
        localStorage.removeItem('authTokens')
        navigate('/login')
    }


    let updateToken = async ()=> {

        let response = await AuthAPI.tokenRefresh({'refresh': (authTokens === null ? null : authTokens.refresh)});
        let data = await response.json()
        
        if (response.status === 200){
            setAuthTokens(data)
            setUser(jwt_decode(data.access))
            localStorage.setItem('authTokens', JSON.stringify(data))
        } else {
            logoutUser()
        }

    }

    let contextData = {
        user:user,
        authTokens:authTokens,
        loginUser:loginUser,
        logoutUser:logoutUser,
    }


    useEffect(()=> {

        if(loading && authTokens){
            updateToken()
        }

        if(loading){
            setLoading(false)
        }

        let fourMinutes = 1000 * 60 * 4

        let interval = setInterval(()=> {
            if(authTokens){
                updateToken()
            }
        }, fourMinutes)
        return ()=> clearInterval(interval)

    }, [authTokens, loading])

    return(
        <AuthContext.Provider value={contextData} >
            {loading ? null : children}
        </AuthContext.Provider>
    )
}
