import { useDispatch } from 'react-redux'
import { createSeguimientoRequest, deleteSeguimientoRequest, getAllSeguimientosRequest, getSeguimientoRequest, putDeadlineRequest } from '../services/seguimiento.js'
import { SeguimientoContext } from './Context.jsx'
import { useEffect, useState } from "react"
import { addSeguimiento, editDeadline, getAllSeguimientosState, getSeguimientoState, removeSeguimiento } from '../redux/seguimientoSlice.js'
import PropTypes from 'prop-types'

// Proveedor de funciones y estados para utilizar en los componentes relacionados al seguimiento de los productos
const SeguimientoContextProvider = ({ children }) => {

    const dispatch = useDispatch()
    const [errors, setErrors] = useState([])
    const [statusSuccess, setStatusSuccess] = useState([])
    const [loadingSearch, setLoadingSearch] = useState(false)
    const [loading, setLoading] = useState(false)
    const [loadingUpdateDeadline, setLoadingUpdateDeadline] = useState(false)

    useEffect(() => {
        if (errors.length > 0) {
            const timeout = setTimeout(() => {
                setErrors([])
            }, 3000)
            
            return () => clearTimeout(timeout)
        } else if (statusSuccess.length > 0) {
            const timeout = setTimeout(() => {
                setStatusSuccess([])
            }, 3000)
        
            return () => clearTimeout(timeout)
        }
    }, [errors, statusSuccess])

    // Función para obtener todos los seguimientos existentes
    const getAllSeguimientos = async () => {
        setLoading(true)
        try {
            const res = await getAllSeguimientosRequest()
            if (res) {
                dispatch(getAllSeguimientosState(res))
                setLoading(false)
            }
        } catch (error) {
            setErrors(error.response.data.detail)
            setLoading(false)
        }
    }

    // Función para obtener el seguimiento de un producto por id
    const getSeguimiento = async (id) => {
        setLoadingSearch(true)
        try {
            const res = await getSeguimientoRequest(id) // Llamada de la función de servicio proveniente de seguimiento.js
            if (res) {
                dispatch(getSeguimientoState(res)) // Envío de la resupesta al estado global en seguimientoSlice.js
                setLoadingSearch(false)
            }
        } catch (error) {
            setErrors(error.response.data.detail)
            setLoadingSearch(false)
        }
    }

    // Función para crear un seguimiento completo
    const createSeguimiento = async (value) => {
        try {
            const res = await createSeguimientoRequest(value)
            if (res) {
                dispatch(addSeguimiento(res))
                setStatusSuccess(res.message)
            }
        } catch (error) {
            setErrors(error.response.data.detail)
        }
    }

    // Función para actualizar la fecha de entrega de un producto
    const updateDeadline = async (id, deadline) => {
        setLoadingUpdateDeadline(true)
        try {
            const res = await putDeadlineRequest(id, deadline)
            if (res) {
                dispatch(editDeadline(res))
                setStatusSuccess(res.message)
                await getSeguimiento(id)
            } 
        } catch (error) {
            setErrors(error.response.data.detail)
        }
    }

    // Función para borrar un seguimiento de la BD
    const deleteSeguimiento = async (id) => {
        try {
            const res = await deleteSeguimientoRequest(id)
            dispatch(removeSeguimiento({ id }))
            setStatusSuccess(res.message)
        } catch (error) {
            setErrors(error.response.data.detail)
        }
    }

    return (
        <SeguimientoContext.Provider value={{
            errors,
            statusSuccess,
            loading,
            loadingSearch,
            loadingUpdateDeadline,
            getAllSeguimientos,
            getSeguimiento,
            createSeguimiento,
            updateDeadline,
            deleteSeguimiento
        }}>
            {children}
        </SeguimientoContext.Provider>
    )
}

SeguimientoContextProvider.propTypes = {
    children: PropTypes.node
}

export default SeguimientoContextProvider
