import { useContext } from "react"
import { StatusContext } from "../context/Context.jsx"
import { useSelector } from "react-redux"

const CardStatus = () => {

    const { loadingSearch } = useContext(StatusContext)
    const status = useSelector(state => state.status)

    return (
        <div>
            {
                loadingSearch ? <div>Loading...</div> 
                    : status[0] ? (
                        <>
                            <label>Estado actual:</label>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px'}}>
                                <span>ID: {status[0].id}</span>
                                <span>Estado del producto: {status[0].product_status}</span>
                            </div>
                            <br />
                        </>
                    )
                        : <span>No se encontró el número de seguimiento</span>
            }
        </div>
    )
}

export default CardStatus
