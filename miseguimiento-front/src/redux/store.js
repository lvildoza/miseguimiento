import { configureStore } from '@reduxjs/toolkit'
import seguimientoSlice from './seguimientoSlice'

export const store = configureStore({
    reducer: {
        seguimientos: seguimientoSlice
    }
})
