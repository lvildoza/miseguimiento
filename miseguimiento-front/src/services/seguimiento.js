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
        throw error
    }
}

// Solicitud GET para obtener los datos de todos los seguimientos
export const getAllSeguimientosRequest = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/seguimiento`)
        console.log(response.data)
        return response.data
    } catch (error) {
        console.error(error)
        throw error
    }
}

// Solicitud GET para obtener datos de un seguimiento por id
export const getSeguimientoRequest = async (id) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/seguimiento/${id}`)
        console.log(response.data)
        return response.data
    } catch (error) {
        console.error(error.response.data)
        throw error
    }
}

// Solicitud PUT para modificar la fecha de entrega del producto
export const putDeadlineRequest = async (id, deadline) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/seguimiento/${id}/deadline`, deadline)
        console.log(response.data)
        return response.data
    } catch (error) {
        console.error(error)
        throw error
    }
}

// Solicitud DELETE para borrar un seguimiento de la base de datos
export const deleteSeguimientoRequest = async (id) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/seguimiento/${id}`)
        console.log(response.data)
        return response.data
    } catch (error) {
        console.error(error)
        throw error
    }
}