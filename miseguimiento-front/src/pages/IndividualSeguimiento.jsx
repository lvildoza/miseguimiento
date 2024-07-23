import { useLocation } from "react-router-dom"
import CardSeguimiento from "../components/CardSeguimiento.jsx"
import useSeguimientoSearch from "../hooks/useSeguimientoSearch.jsx"

const IndividualSeguimiento = () => {

    const {inputValue, showCard, handleInputChange, handleSearch} = useSeguimientoSearch()
    const location = useLocation()
    const isInDeleteSeguimientoPath = location.pathname === '/delete-seguimiento'

    return (
        <div>
            <div>
                <input
                    type="text"
                    value={inputValue.toLowerCase().trimStart()}
                    onChange={handleInputChange} />
                <button onClick={() => handleSearch(inputValue.length > 0)}>Buscar</button>
            </div>
            {showCard && <CardSeguimiento isInDeleteSeguimientoPath={isInDeleteSeguimientoPath} />}
        </div>
    )
}

export default IndividualSeguimiento
