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

        // reducer para obtener un único seguimiento
        getSeguimientoState: (state, action) => {
            return action.payload
        },

    }
})

// Exportación de los reducers para utilizarlos en componentes
export const { addSeguimiento, getSeguimientoState } = seguimientoSlice.actions
export default seguimientoSlice.reducer