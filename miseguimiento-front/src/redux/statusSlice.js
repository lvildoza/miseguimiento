import { createSlice } from "@reduxjs/toolkit";

// Slice para manejar el estado global de los estados de los productos
const statusSlice = createSlice({
    name: "status",

    // Estado inicial vacío para luego realizar acciones
    initialState: [],

    reducers: {
        // reducer que reemplaza el estado actual con el payload de la acción
        getStatusById: (state, action) => {
        return Array.isArray(action.payload) ? action.payload : [action.payload] 
        },

        // reducer para crear un estado y agregarlo al array
        addStatus: (state, action) => {
            state.push(action.payload)
        },

        // reducer para modificar el estado del seguimiento de un producto
        editStatus: (state, action) => {
        const index = state.findIndex(status => status.product_id === action.payload.product_id)
            if (index !== -1) {
                state[index] = action.payload
            }
        },
    }
})

// Exportación de los reducers para utilizarlos en componentes
export const { getStatusById , addStatus, editStatus } = statusSlice.actions
export default statusSlice.reducer