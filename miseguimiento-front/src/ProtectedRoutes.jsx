import { useContext } from "react"
import { AuthContext } from "./context/Context.jsx"
import { Navigate, Outlet } from "react-router-dom"

// Componente encargado de verificar la autentificación del usuario
// Si no está autentificado lo redirige a la ruta /login y se elimina el historial de navegación
// Si está autentificado, el usuario podrá navegar por las rutas hijas de este componente
const ProtectedRoutes = () => {

    const { isAuthenticated, loading } = useContext(AuthContext)

    if (loading) return <span>Loading...</span>
    if (!isAuthenticated && !loading) return <Navigate to='/login' replace />

    return <Outlet />
}

export default ProtectedRoutes
