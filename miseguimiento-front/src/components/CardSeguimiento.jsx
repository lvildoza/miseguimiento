import { useContext } from "react"
import { SeguimientoContext } from "../context/Context.jsx"
import { useSelector } from "react-redux"
import { formattedDate } from "../utilities/formattedDate.js"
import PropTypes from 'prop-types'

const CardSeguimiento = ({ isInDeleteSeguimientoPath }) => {

    const { loadingSearch, errors, deleteSeguimiento, statusSuccess } = useContext(SeguimientoContext)
    // Uso del estado seguimientos desde store.js
    const seguimientos = useSelector(state => state.seguimientos)
    let seguimiento = seguimientos[0]

    return (
        <div>
            {loadingSearch ? <div>Loading...</div>
                : seguimiento && errors.length === 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span>{formattedDate(seguimiento.product_initial_date)}</span>
                        <span>{seguimiento.product_deadline}</span>
                        <span>{seguimiento.product_client_name}</span>
                        <span>{seguimiento.product_description}</span>
                        <span>{seguimiento.product_delivery_type}</span>
                
                        {isInDeleteSeguimientoPath && !loadingSearch && (
                            <>
                                <div>
                                    <button onClick={() => deleteSeguimiento(seguimiento.product_id)}>Eliminar</button>
                                    
                                </div>
                                {statusSuccess.length > 0 && <div>{statusSuccess}</div>}
                            </>
                        )}
                    </div>
                )
                    : errors.length > 0 ? <div> {errors}</div>
                        : statusSuccess.length > 0 && <div>{statusSuccess}</div>
            }

        </div>
    )
}

CardSeguimiento.propTypes = {
    isInDeleteSeguimientoPath: PropTypes.bool
}

export default CardSeguimiento
