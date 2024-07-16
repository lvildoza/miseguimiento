import CardSeguimiento from "../components/CardSeguimiento.jsx"
import useSeguimientoSearch from "../hooks/useSeguimientoSearch.jsx"

const IndividualSeguimiento = () => {

    const {inputValue, showCard, handleInputChange, handleSearch} = useSeguimientoSearch()

    return (
        <div>
            <div>
                <input
                    type="text"
                    value={inputValue.toLowerCase().trim()}
                    onChange={handleInputChange} />
                <button onClick={handleSearch}>Buscar</button>
            </div>
            {showCard && <CardSeguimiento seguimientoValue={inputValue} />}
        </div>
    )
}

export default IndividualSeguimiento
