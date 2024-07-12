import axios from 'axios'
import { API_BASE_URL } from '../config.js'

export const createSeguimientoRequest = async (seguimiento) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/seguimiento`, seguimiento)
        console.log(response)
        return response.data
    } catch (error) {
        console.error(error)
    }
}