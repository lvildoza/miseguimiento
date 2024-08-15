import { useEffect, useState } from "react"
import { StatusContext } from "./Context.jsx"
import { createStatusRequest, getStatusByIdRequest } from "../services/status.js"
import { useDispatch } from "react-redux"
import { addStatus, getStatusById } from "../redux/statusSlice.js"
import { putStatusRequest } from "../services/status.js"
import { editStatus } from "../redux/statusSlice.js"
import PropTypes from 'prop-types'

// Proveedor de funciones y estados para utilizar en los componentes relacionados al Status de los productos
const StatusContextProvider = ({ children }) => {

    const dispatch = useDispatch()

    const [errors, setErrors] = useState([])
    const [statusSuccess, setStatusSuccess] = useState([])
    const [loadingSearch, setLoadingSearch] = useState(false)
    const [loadingUpdate, setLoadingUpdate] = useState(false)

    useEffect(() => {
        if (statusSuccess.length > 0) {
            const timeout = setTimeout(() => {
                setStatusSuccess([])
            }, 3000)
        
            return () => clearTimeout(timeout)
        }
    }, [statusSuccess])
    
    // Obtener un solo estado por id
    const getStatus = async (statusId) => {
        setLoadingSearch(true)
        try {
            const res = await getStatusByIdRequest(statusId) // Llamada de la función de servicio proveniente de status.js 
            if (res) {
                dispatch(getStatusById(res)) // Envío del contenido de la respuesta al estado global en statusSlice.js
                setLoadingSearch(false)
            } 
        } catch (error) {
            setErrors(error.response.data.detail)
            setLoadingSearch(false)
        }
    }

    // Crear un estado por id
    const createStatus = async (statusId, status) => {
        try {
            const res = await createStatusRequest(statusId, status)
            if (res) {
                dispatch(addStatus(res))
                setErrors([])
                setStatusSuccess(res.message)
            }
        } catch (error) {
            setErrors(error.response.data.detail)
        }
    }

    const updateStatus = async (statusId, status) => {
        setLoadingUpdate(true)
        try {
            const res = await putStatusRequest(statusId, status)
            if (res) {
                dispatch(editStatus(res))
                setStatusSuccess(res.message)
                await getStatus(statusId)
                setLoadingUpdate(false)
            } 
        } catch (error) {
            setErrors(error.response.data.detail)
            setLoadingUpdate(false)
        }
    }

    return (
        <StatusContext.Provider value={{
            errors,
            setErrors,
            statusSuccess,
            loadingSearch,
            loadingUpdate,
            getStatus,
            createStatus,
            updateStatus
        }}>
            {children}
        </StatusContext.Provider>
    )
}

StatusContextProvider.propTypes = {
    children: PropTypes.node
}

export default StatusContextProvider
