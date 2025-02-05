import axios from "axios"
import { API_BASE_URL } from "../config.js"


// Solicitud GET al id de un estado al backend
export const getStatusByIdRequest = async (statusId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/status/${statusId}`)
        console.log(response.data)
        return response.data
    } catch (error) {
        console.error(error)
    }
}

// Solicitud PUT para modificar el estado de un seguimiento
export const putStatusRequest = async (id, status) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/status/${id}`, status)
        console.log(response.data)
        return response.data

    } catch (error) {
        console.error(error)
        throw error
    }
}