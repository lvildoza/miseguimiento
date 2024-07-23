import { useContext, useState } from "react"
import { SeguimientoContext, StatusContext } from "../context/Context.jsx"
import { useLocation } from "react-router-dom"

// Custom hook para reutilizar funciones de buscador de seguimiento por id
const useSeguimientoSearch = () => {
    
    const { getSeguimiento, setErrors } = useContext(SeguimientoContext)
    const { getStatus, setErrors: setStatusErrors } = useContext(StatusContext)

    const location = useLocation()
    const isInSearchSeguimientoPath = location.pathname === '/search-seguimiento'
    const isInDeleteSeguimientoPath = location.pathname === '/delete-seguimiento'
    const isInEditDeadlinePath = location.pathname === '/edit-deadline'

    const [inputValue, setInputValue] = useState('')
    const [showCard, setShowCard] = useState(false)

    // Manejador del valor dentro del input
    const handleInputChange = e => {
        console.log(e.target.value)
        setInputValue(e.target.value) // Actuliza el estado con el valor del input
    }

    // Función para realizar la búsqueda del seguimiento
    const handleSearch = (value) => {

        // Vaciar estados para evitar problemas en renderizados en los componentes
        setErrors([])
        setStatusErrors([])

        // Llamada a getSeguimiento o getStatus solo si el input tiene un valor
        if (!value) return
        
        isInSearchSeguimientoPath || isInDeleteSeguimientoPath || isInEditDeadlinePath ? getSeguimiento(inputValue.trim()) && setShowCard(true)
            : getStatus(inputValue.trim()) && setShowCard(true)
    }
    
    return {
        handleInputChange,
        handleSearch,
        inputValue,
        showCard
    }
}

export default useSeguimientoSearch
