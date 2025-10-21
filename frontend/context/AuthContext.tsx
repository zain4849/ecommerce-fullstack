'use client'

import api from '@/lib/api';
/* 
This is importing api instance from the path

@/lib/api has inside something like this:
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

export default api;
*/
import User from '../types/user'
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react'

interface AuthContextType {
    user: User | null
    token: string | null;
    login: (email:string, password: string) => void
    register: (name:string, email:string, password: string) => void
    logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);


export const AuthProvider = ({children}: {children: ReactNode}) => {
    const [user, setUser] = useState<User | null>(null)
    const [token, setToken] = useState<string | null>(null)

    useEffect(() => {
        const storedToken = localStorage.getItem('token')
        const storedUser = localStorage.getItem('user')
        if (storedToken && storedUser) {
            setToken(storedToken)
            setUser(JSON.parse(storedUser))
            api.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`

        }
    }, []) // We do this because the browser whenever we refresh or open/close new tabs we KEEP localStorage but LOSE states (user, token)


    const register = async (name:string, email:string, password:string) => {
        const res = await api.post('/auth/register', {email, password})
        setToken(res.data.token)
        setUser(JSON.parse(res.data.user))
        localStorage.setItem('token', res.data.token)
        localStorage.setItem('user', res.data.user)
        api.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`
        // By setting it as a default, you don’t need to manually include the token in every API call. It's automatically sent with every request through api going forward.
        // It globally sets the Authorization header for all future requests made with that api instance.
    }

    const login = async (email:string, password:string) => {
        const res = await api.post('/auth/login', {email, password})
        setToken(res.data.token)
        setUser(JSON.parse(res.data.user))
        localStorage.setItem('token', res.data.token)
        localStorage.setItem('user', res.data.user)
        api.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`
    }

    const logout = () => {
        setToken(null)
        setUser(null)
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        delete api.defaults.headers.common["Authorization"]
    }
  
    return ( 
    <AuthContext.Provider value={ {user, token, register, login, logout} }>
        {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error("useAuth isn't under AuthProvider")
    return ctx   

}

