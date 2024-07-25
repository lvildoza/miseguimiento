import { useContext } from "react"
import { StatusContext } from "../context/Context.jsx"
import { useSelector } from "react-redux"
import useSeguimientoSearch from "../hooks/useSeguimientoSearch.jsx"
import { formattedDate } from "../utilities/formattedDate.js"
import { useNavigate } from "react-router-dom"

const Status = () => {

    const { loadingSearch, errors, setErrors } = useContext(StatusContext)
    const {inputValue, showCard, handleInputChange, handleSearch} = useSeguimientoSearch()
    const status = useSelector(state => state.status) // Uso del estado status desde store.js

    const navigate = useNavigate()

    const handleNavigateClick = () => {
        setErrors([])
        navigate('/create-seguimiento')
    }

    return (
        <div>
            <div>
                <input
                    type="text"
                    value={inputValue.toLowerCase().trimStart()}
                    onChange={handleInputChange} />
                <button onClick={() => handleSearch(inputValue.length > 0)}>Buscar</button>
            </div>
            <br />
            {loadingSearch ? <div>Loading...</div>
                : showCard && errors.length === 0 ? (
                    <>
                        <h3>Estado del envío:</h3>
                        {
                            status[0].product_status.map((sta, index) => (
                                <div key={index}>
                                    <span style={{ marginRight: '20px'}}>{formattedDate(sta.product_status_datetime)}</span>
                                    <span style={{ marginRight: '20px'}}>{sta.product_status_type}</span>
                                    <span style={{ marginRight: '20px'}}>{sta.product_description_status}</span>
                                </div>
                            ))
                        }
                    </>
                )
                    : errors.length > 0 && (
                        <>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px'}}>
                                <span>{errors}</span>
                                {errors === "Error al obtener los estados: 'product_status'" && status.length === 0 && (
                                    <>
                                        <span>No tienes estados para mostrar</span>
                                        <button onClick={handleNavigateClick}>Ir a crear estado</button>
                                    </>
                                )}
                            </div>
                        </>
                    )
                
            }
        </div>
    )
}

export default Status
