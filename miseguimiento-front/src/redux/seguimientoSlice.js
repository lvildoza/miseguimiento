import { createSlice } from "@reduxjs/toolkit";

// Slice para manejar el estado global de los seguimientos
const seguimientoSlice = createSlice({
    name: 'seguimientos',
    initialState: [],

    reducers: {

        // reducer que agrega al arreglo los datos provenientes del payload
        addSeguimiento: (state, action) => {
            state.push(action.payload)
        },

        // reducer para obtener todos los seguimientos
        getAllSeguimientosState: (state, action) => {
            return [...action.payload]
        },

        // reducer para obtener un único seguimiento
        getSeguimientoState: (state, action) => {

            // Verificación si lo que se obtiene es un array, si no lo es, por defecto devuelve un array
            return Array.isArray(action.payload) ? action.payload : [action.payload]
        },

        // reducer para modificar el estado actual de la fecha de entrega de un producto
        editDeadline: (state, action) => {
            const index = state.findIndex(seguimiento => seguimiento.id === action.payload.id)
            if (index !== -1) {
                state[index] = action.payload
            }
        },

        // reducer para remover un seguimiento en el arreglo
        removeSeguimiento: (state, action) => {
            return state.filter(seguimiento => seguimiento.id !== action.payload.id)
        }
    }
})

// Exportación de los reducers para utilizarlos en componentes
export const { addSeguimiento, getAllSeguimientosState, getSeguimientoState, editDeadline, removeSeguimiento } = seguimientoSlice.actions
export default seguimientoSlice.reducer