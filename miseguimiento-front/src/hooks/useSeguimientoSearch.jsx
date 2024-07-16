import { useContext, useState } from "react"
import { SeguimientoContext, StatusContext } from "../context/Context.jsx"
import { useLocation } from "react-router-dom"

// Custom hook para reutilizar funciones de buscador de seguimiento por id
const useSeguimientoSearch = () => {
    
    const { getSeguimiento } = useContext(SeguimientoContext)
    const { getStatus } = useContext(StatusContext)

    const location = useLocation()
    const isInSearchSeguimientoPath = location.pathname === '/search-seguimiento'

    const [inputValue, setInputValue] = useState('')
    const [showCard, setShowCard] = useState(false)

    // Manejador del valor dentro del input
    const handleInputChange = e => {
        console.log(e.target.value)
        setInputValue(e.target.value) // Actuliza el estado con el valor del input
    }

    // Función para realizar la búsqueda del seguimiento
    const handleSearch = () => {

        // Llamada a getSeguimiento solo si el input tiene un valor
        inputValue &&
            isInSearchSeguimientoPath ? getSeguimiento(inputValue.trim()) && setShowCard(true)
            : inputValue && getStatus(inputValue.trim()) && setShowCard(true)
    }
    
    return {
        handleInputChange,
        handleSearch,
        inputValue,
        showCard
    }
}

export default useSeguimientoSearch
