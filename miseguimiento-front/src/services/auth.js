import axios from 'axios'
import { API_BASE_URL } from '../config.js'

// Solicitud POST para comunicar login de usuario entre frontend y backend enviando los datos necesarios
export const loginRequest = async (data) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/token`, data, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
        console.log(response.data)
        return response.data
        
    } catch (error) {
        console.error(error)
        throw error
    }
} 

// Solicitud POST para comunicar registro de usuario entre frontend y backend enviando los datos necesarios 
export const registerRequest = async (data) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/users`, data)
        console.log(response.data)
        return response.data
    } catch (error) {
        console.error(error)
        throw error
    }
}