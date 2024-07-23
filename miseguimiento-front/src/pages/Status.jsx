import { useContext, useEffect } from "react"
import StatusSegumiento from "../components/StatusSegumiento.jsx"
import { StatusContext } from "../context/Context.jsx"
import { useSelector } from "react-redux"
import useSeguimientoSearch from "../hooks/useSeguimientoSearch.jsx"

const Status = () => {

    const { loadingSearch, errors } = useContext(StatusContext)
    const {inputValue, showCard, handleInputChange, handleSearch} = useSeguimientoSearch()
    const status = useSelector(state => state.status) // Uso del estado status desde store.js

    return (
        <div>
            <div>
                <input
                    type="text"
                    value={inputValue.toLowerCase().trimStart()}
                    onChange={handleInputChange} />
                <button onClick={() => handleSearch(inputValue.length > 0)}>Buscar</button>
            </div>
            {loadingSearch ? <div>Loading...</div>
                : showCard && errors.length === 0 ? (
                    <>
                        <h3>Tu producto y/o servicio se encuentra en estado:</h3>
                        <StatusSegumiento statusString={status[0].product_status} />
                    </>
                )
                    : <span>{errors}</span>
            }
        </div>
    )
}

export default Status
