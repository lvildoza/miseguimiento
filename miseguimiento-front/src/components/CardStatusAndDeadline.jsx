import { useContext } from "react"
import { SeguimientoContext, StatusContext } from "../context/Context.jsx"
import { useSelector } from "react-redux"
import { useLocation } from "react-router-dom"

const CardStatusAndDeadline = () => {

    // Llamada al estado loadingSearch para mostrar mientras se realiza la solicitud GET
    const { loadingSearch } = useContext(StatusContext)
    const { loadingSearch: loaderSearchDeadline, errors, statusSuccess } = useContext(SeguimientoContext)
    
    // Uso de los estados status y seguimientos del store.js de redux
    const status = useSelector(state => state.status)
    const seguimiento = useSelector(state => state.seguimientos)

    // Uso de useLocation() para indicar la ruta /edit-status
    const location = useLocation()
    const isInEditStatusPath = location.pathname === '/edit-status'

    return (
        <div>
            {
                loadingSearch ? <div>Loading...</div> 
                    
                    // Renderizado de JSX si isInEditStatusPath es true
                    : isInEditStatusPath && status[0] ? (
                        <>
                            <label>Estado actual:</label>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px'}}>
                                <span>ID: {status[0].id}</span>
                                <span>Estado del producto: {status[0].product_status}</span>
                            </div>
                            <br />
                        </>
                    )
                        : loaderSearchDeadline ? <div>Loading...</div>
                            
                            // Renderizado de JSX si isInEditStatusPath es false
                            : !isInEditStatusPath && seguimiento[0] && errors.length === 0 ? (
                                <>
                                    <label>Fecha actual:</label>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px'}}>
                                        <span>ID: {seguimiento[0].id}</span>
                                        <span>Fecha estimada de entrega: {seguimiento[0].product_deadline}</span>
                                    </div>
                                </>
                            )
                                : <span>{errors}</span>
            }
        </div>
    )
}

export default CardStatusAndDeadline
