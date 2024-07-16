import { useDispatch } from 'react-redux'
import { getSeguimientoRequest } from '../services/seguimiento.js'
import { SeguimientoContext } from './Context.jsx'
import { useState } from "react"
import { getSeguimientoState } from '../redux/seguimientoSlice.js'
import PropTypes from 'prop-types'

// Proveedor de funciones y estados para utilizar en los componentes relacionados al seguimiento de los productos
const SeguimientoContextProvider = ({ children }) => {

    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)

    // Función para obtener el seguimiento de un producto por id
    const getSeguimiento = async (id) => {
        setLoading(true)
        const res = await getSeguimientoRequest(id) // Llamada de la función de servicio proveniente de seguimiento.js
        if (res) {
            dispatch(getSeguimientoState(res)) // Envío de la resupesta al estado global en seguimientoSlice.js
            setLoading(false)
        } else {
            setLoading(false)
            throw Error('La respuesta es: ', res)
        }
    }

    return (
        <SeguimientoContext.Provider value={{
            loading,
            getSeguimiento
        }}>
            {children}
        </SeguimientoContext.Provider>
    )
}

SeguimientoContextProvider.propTypes = {
    children: PropTypes.node
}

export default SeguimientoContextProvider
