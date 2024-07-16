import CardStatus from "./CardStatus.jsx"
import useSeguimientoSearch from "../hooks/useSeguimientoSearch.jsx"
import { useContext, useState } from "react"
import { StatusContext } from "../context/Context.jsx"
import { useSelector } from "react-redux"
import { useForm } from "react-hook-form"


const EditStatus = () => {

    const { updateStatus, loadingUpdate } = useContext(StatusContext)
    
    const { inputValue, showCard, handleInputChange, handleSearch } = useSeguimientoSearch()
    const { register, handleSubmit } = useForm()

    const status = useSelector(state => state.status)

    const [showNewStatusCard, setShowNewStatusCard] = useState(false)

    const submitStatus = handleSubmit(async (newStatus) => {

        newStatus.id = status[0].id
        newStatus.product_status = newStatus.product_status.toUpperCase()

        await updateStatus(inputValue, newStatus)
        setShowNewStatusCard(true)
    })

    return (
        <div>
            <div>
                <input
                    type="text"
                    value={inputValue.toLowerCase().trim()}
                    onChange={handleInputChange}
                    placeholder="Introduce tu código de seguimiento"
                />
                <button onClick={handleSearch}>Buscar</button>
            </div>
            <br />

            {showCard && <CardStatus />}

            <br />
            <label htmlFor="input-status">Seleccione un nuevo estado:</label>
            <form onSubmit={submitStatus}>
                <input
                    type="text"
                    {...register("product_status")}
                    name="product_status"
                    id="input-status"
                />
                <button>Actualizar</button>
            </form>
            <br />
            {
                loadingUpdate ? <div>Loading...</div>
                    : showNewStatusCard && (
                        <>
                            <label>Estado actualizado:</label>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px'}}>
                                <span>ID: {status[0].id}</span>
                                <span>Nuevo estado: {status[0].product_status}</span>
                            </div>
                        </>
                    )
            }
        </div>
    )
}

export default EditStatus
