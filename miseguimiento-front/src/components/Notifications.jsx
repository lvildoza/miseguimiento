import { useContext, useEffect } from 'react'
import { Bounce, toast, ToastContainer } from 'react-toastify'
import 'react-toastify/ReactToastify.css'
import { AuthContext } from '../context/Context.jsx'

// Componente que muestra una notificación dependiendo el valor dentro del campo type
// Cualquier función que contenga el estado notification renderizará este componente
const Notifications = () => {

    const { notification } = useContext(AuthContext) 

    // Efecto que se monta cada vez que cambie el valor de notification
    useEffect(() => {
        if (notification.text) {
            switch (notification.type) {
                case 'success':
                    toast.success(notification.text, { // Estilos para notificación exitosa
                        position: 'bottom-right',
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "colored",
                        transition: Bounce
                    })
                    break;
                case 'error':
                    toast.error(notification.text, { // Estilos para notificación de error
                        position: 'bottom-left',
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "colored",
                        transition: Bounce
                    })
                    break;
            }
        }
    }, [notification])

    return (
        <>
            <ToastContainer />
        </>
    )
}

export default Notifications
