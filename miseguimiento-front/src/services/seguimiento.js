import axios from 'axios'
import { API_BASE_URL } from '../config.js'

// Solicitud POST al backend con datos de un seguimiento
export const createSeguimientoRequest = async (seguimiento) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/seguimiento`, seguimiento)
        console.log(response)
        return response.data
    } catch (error) {
        console.error(error)
    }
}

// Solicitud GET para obtener datos de un seguimiento por id
export const getSeguimientoRequest = async (id) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/seguimiento/${id}`)
        console.log(response.data)
        return response.data
    } catch (error) {
        console.error(error)
        throw error
    }
}
