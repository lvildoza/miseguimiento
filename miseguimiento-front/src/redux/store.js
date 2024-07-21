import { configureStore } from '@reduxjs/toolkit'
import seguimientoSlice from './seguimientoSlice'
import statusSlice from './statusSlice'

export const store = configureStore({
    reducer: {
        seguimientos: seguimientoSlice,
        status: statusSlice
    }
})
