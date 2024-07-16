import { useContext } from "react"
import { SeguimientoContext } from "../context/Context.jsx"
import { useSelector } from "react-redux"
import { formattedDate } from "../utilities/formattedDate.js"
import StatusSegumiento from "./StatusSegumiento.jsx"

const CardSeguimiento = () => {

    const { loading } = useContext(SeguimientoContext)

    // Uso del estado seguimientos desde store.js
    const seguimientos = useSelector(state => state.seguimientos)

    // Obtener el primer seguimiento de la lista
    let seguimiento = seguimientos[0]

    return (
        <div>
            {loading ? <div>Loading...</div>
                : seguimiento ? (
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span>{formattedDate(seguimiento.initial_date)}</span>
                        <span>{seguimiento.product_deadline}</span>
                        <span>{seguimiento.user_name}</span>
                        <span>{seguimiento.product_description}</span>
                        <span>{seguimiento.product_delivery}</span>
                        
                        <StatusSegumiento statusString={seguimiento.product_status} />
                    </div>
                )
                    : !seguimientos || seguimientos.length === 0 && <div>No se encontró el seguimiento</div>
            }
        </div>
    )
}

export default CardSeguimiento
