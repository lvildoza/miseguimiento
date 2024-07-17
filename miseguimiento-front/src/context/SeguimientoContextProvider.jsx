import { useDispatch } from 'react-redux'
import { getAllSeguimientosRequest, getSeguimientoRequest, putDeadlineRequest } from '../services/seguimiento.js'
import { SeguimientoContext } from './Context.jsx'
import { useState } from "react"
import { editDeadline, getAllSeguimientosState, getSeguimientoState } from '../redux/seguimientoSlice.js'
import PropTypes from 'prop-types'

// Proveedor de funciones y estados para utilizar en los componentes relacionados al seguimiento de los productos
const SeguimientoContextProvider = ({ children }) => {

    const dispatch = useDispatch()
    const [loadingSearch, setLoadingSearch] = useState(false)
    const [loading, setLoading] = useState(false)
    const [loadingUpdateDeadline, setLoadingUpdateDeadline] = useState(false)

    // Función para obtener todos los seguimientos existentes
    const getAllSeguimientos = async () => {
        setLoading(true)
        const res = await getAllSeguimientosRequest()
        if (res) {
            dispatch(getAllSeguimientosState(res))
            setLoading(false)
        } else {
            setLoading(false)
            throw Error('La respuesta es: ', res)
        }
    }

    // Función para obtener el seguimiento de un producto por id
    const getSeguimiento = async (id) => {
        setLoadingSearch(true)
        const res = await getSeguimientoRequest(id) // Llamada de la función de servicio proveniente de seguimiento.js
        if (res) {
            dispatch(getSeguimientoState(res)) // Envío de la resupesta al estado global en seguimientoSlice.js
            setLoadingSearch(false)
        } else {
            setLoadingSearch(false)
            throw Error('La respuesta es: ', res)
        }
    }

    // Función para actualizar la fecha de entrega de un producto
    const updateDeadline = async (id, deadline) => {
        setLoadingUpdateDeadline(true)
        const res = await putDeadlineRequest(id, deadline)
        if (res) {
            dispatch(editDeadline(res))
            await getSeguimiento(id)
        } else {
            throw Error('La respuesta es: ', res)
        }
        setLoadingUpdateDeadline(false)
    }

    return (
        <SeguimientoContext.Provider value={{
            loading,
            loadingSearch,
            loadingUpdateDeadline,
            getAllSeguimientos,
            getSeguimiento,
            updateDeadline
        }}>
            {children}
        </SeguimientoContext.Provider>
    )
}

SeguimientoContextProvider.propTypes = {
    children: PropTypes.node
}

export default SeguimientoContextProvider
