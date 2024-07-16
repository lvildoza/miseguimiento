import { useState } from "react"
import { StatusContext } from "./Context.jsx"
import { getStatusByIdRequest } from "../services/status.js"
import { useDispatch } from "react-redux"
import { getStatusById } from "../redux/statusSlice.js"
import { putStatusRequest } from "../services/status.js"
import { editStatus } from "../redux/statusSlice.js"
import PropTypes from 'prop-types'

// Proveedor de funciones y estados para utilizar en los componentes relacionados al Status de los productos
const StatusContextProvider = ({ children }) => {

    const dispatch = useDispatch()

    // loader para mostrar mientras se espera una request
    const [loadingSearch, setLoadingSearch] = useState(false)
    const [loadingUpdate, setLoadingUpdate] = useState(false)
    
    // Obtener un solo estado por id
    const getStatus = async (statusId) => {
        setLoadingSearch(true)
        const res = await getStatusByIdRequest(statusId) // Llamada de la función de servicio proveniente de status.js 
        if (res) {
            dispatch(getStatusById(res)) // Envío del contenido de la respuesta al estado global en statusSlice.js
        } else {
            throw Error('La respuesta de es status: ', res)
        }
        setLoadingSearch(false)
    }

    const updateStatus = async (statusId, status) => {
        setLoadingUpdate(true)
        const res = await putStatusRequest(statusId, status)
        if (res) {
            dispatch(editStatus(res))
            await getStatus(statusId)
        } else {
            throw Error('La respuesta es: ', res)
        }
        setLoadingUpdate(false)
    }

    return (
        <StatusContext.Provider value={{
            loadingSearch,
            loadingUpdate,
            getStatus,
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
