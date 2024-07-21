import { useContext, useState } from "react"
import { SeguimientoContext } from "../context/Context.jsx"
import { useDispatch, useSelector } from "react-redux"
import { formattedDate } from "../utilities/formattedDate.js"
import StatusSegumiento from "./StatusSegumiento.jsx"
import PropTypes from 'prop-types'
import { deleteSeguimientoRequest } from "../services/seguimiento.js"
import { removeSeguimiento } from "../redux/seguimientoSlice.js"

const CardSeguimiento = ({ isInDeleteSeguimientoPath }) => {

    const { loading } = useContext(SeguimientoContext)
    const dispatch = useDispatch()

    // Uso del estado seguimientos desde store.js
    const seguimientos = useSelector(state => state.seguimientos)

    // Obtener el primer seguimiento de la lista
    let seguimiento = seguimientos[0]

    // Función para borrar un seguimiento de la BD
    const deleteSeguimiento = async (id) => {
        try {
            await deleteSeguimientoRequest(id)
            dispatch(removeSeguimiento({ id }))
            console.log('Seguimiento eliminado')
        } catch (error) {
            console.error('Error al eliminar el seguimiento: ', id)
        }
    }

    return (
        <div>
            {loading ? <div>Loading...</div>
                : seguimientos.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span>{formattedDate(seguimiento.initial_date)}</span>
                        <span>{seguimiento.product_deadline}</span>
                        <span>{seguimiento.user_name}</span>
                        <span>{seguimiento.product_description}</span>
                        <span>{seguimiento.product_delivery}</span>
                        
                        <StatusSegumiento statusString={seguimiento.product_status} />

                        {isInDeleteSeguimientoPath && !loading && (
                            <div>
                                <button onClick={() => deleteSeguimiento(seguimiento.id)}>Eliminar</button>
                            </div>
                        )}
                    </div>
                )
                    : <div>No se encontró el seguimiento</div>
            }

        </div>
    )
}

CardSeguimiento.propTypes = {
    isInDeleteSeguimientoPath: PropTypes.bool
}

export default CardSeguimiento
