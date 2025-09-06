import React, { createContext, useContext, useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import axiosInstance from '../utils/axiosInstance'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = Cookies.get('accessToken')
      if (token) {
        try {
          // Verify token by making a request to get user info
          const response = await axiosInstance.get('/api/user/me')
          setUser(response.data.user)
          setIsAuthenticated(true)
        } catch (error) {
          // Token is invalid, clear it
          Cookies.remove('accessToken')
          setIsAuthenticated(false)
          setUser(null)
        }
      } else {
        setIsAuthenticated(false)
        setUser(null)
      }
      setLoading(false)
    }

    checkAuth()
  }, [])

  const login = (userData) => {
    setUser(userData)
    setIsAuthenticated(true)
  }

  const logout = () => {
    Cookies.remove('accessToken')
    setUser(null)
    setIsAuthenticated(false)
  }

  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
