import { createSlice } from "@reduxjs/toolkit";

const seguimientoSlice = createSlice({
    name: 'seguimientos',
    initialState: [],

    reducers: {
        addSeguimiento: (state, action) => {
            state.push(action.payload)
        }
    }
})

export const { addSeguimiento } = seguimientoSlice.actions
export default seguimientoSlice.reducer