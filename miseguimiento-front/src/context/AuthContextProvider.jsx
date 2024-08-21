import { useEffect, useState } from "react"
import { AuthContext } from "./Context.jsx"
import { loginRequest, registerRequest } from "../services/auth"
import { jwtDecode } from 'jwt-decode'
import axios from "axios"
import { useNavigate } from "react-router-dom"
import PropTypes from 'prop-types'

const AuthContextProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token') || null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [username, setUsername] = useState(localStorage.getItem('username') || '')
    const [loading, setLoading] = useState(true)
    const [notification, setNotification] = useState({ text: '', type: ''})
    const navigate = useNavigate()

    // La función se montará cada vez que cambie el valor del token
    useEffect(() => {
        checkLogin()
    }, [token])

    // Función para verificar si existe un token, si existe se actualizan los estados isAuthenticated y username
    // Si no existe el token, isAuthenticated será false y se ejecuta la función logout()
    const checkLogin = () => {
        if (token) {
            try {
                const decodeToken = jwtDecode(token)
                if (decodeToken) {
                    setIsAuthenticated(true)
                    setUsername(decodeToken.sub)
                } else {
                    setIsAuthenticated(false)
                    logout()
                }
            } catch (error) {
                console.error('Error decoding token: ', error)
                setIsAuthenticated(false)
                logout()
            }
        } else {
            setIsAuthenticated(false)
        }
        setLoading(false)
    }


    // Función para obtener y decodificar el token de acceso y username
    // Se almacena en localStorage y actualiza los estados para su posterior uso
    // Navegación a la ruta /seguimientos
    // En caso de error se actualiza el estado notification para avisarle al usuario
    const login = async (values) => {
        try {
            const data = await loginRequest(values)
            const { access_token } = data
            const decodeToken = jwtDecode(access_token)
            const usernameFromToken = decodeToken.sub

            localStorage.setItem('token', access_token)
            localStorage.setItem('username', usernameFromToken)

            setToken(access_token)
            setUsername(usernameFromToken)
            setIsAuthenticated(true)
            navigate('/seguimientos')
        } catch (error) {
            console.error('Login failed: ', error)
            setNotification({ text: error.response?.data?.detail, type: 'error' })
        }
    }

    // Función para cerrar sesión y quitar datos del localStorage
    // Navegación fuera de las rutas privadas
    const logout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('username')
        setToken(null)
        setUsername('')
        setIsAuthenticated(false)
        navigate('/')
    }

    // Función para crear un usuario
    // Navegación a la ruta /login
    const register = async (values) => {
        try {
            await registerRequest(values)
            setLoading(false)
            setNotification({ text: 'Usuario registrado exitosamente', type: 'success' })
            navigate('/login')
        } catch (error) {
            console.error(error)
            setLoading(false)
            setNotification({ text: error.response?.data?.detail, type: 'error' })
            
        }
    }

    // Interceptar las solicitudes y modificar la autorización antes de que ese envíen
    // Si existe un token en localStorage se agrega el mismo en el encabezado de autorización en formato `Bearer ${token}`
    // Asegura que el token sea enviado para cada solicitud que requiera autentificación
    // Eliminación del interceptor previamente añadido cuando cambie el valor del token
    useEffect(() => {
        const interceptor = axios.interceptors.request.use((config) => {
            if (token) {
                config.headers.Authorization = `Bearer ${token}`
            }
            return config;
        },
            (error) => {
                Promise.reject(error)
            }
        )

        return () => {
            axios.interceptors.response.eject(interceptor)
        }
    }, [token])

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                username,
                loading,
                notification,
                setNotification,
                register,
                checkLogin,
                login,
                logout
            }}>
            {children}
        </AuthContext.Provider>
    )
}

AuthContextProvider.propTypes = {
    children: PropTypes.node
}

export default AuthContextProvider