import { useContext, useEffect } from "react"
import StatusSegumiento from "../components/StatusSegumiento.jsx"
import { StatusContext } from "../context/Context.jsx"
import { useParams } from 'react-router-dom'
import { useSelector } from "react-redux"

const Status = () => {

    const { getStatus, loadingSearch } = useContext(StatusContext)
    const { statusid } = useParams() // Obtener el parametro statusid desde la URL /status/:statusid
    const status = useSelector(state => state.status) // Uso del estado status desde store.js

    // Renderizado del estado del producto cada vez que cambia el parametro statusid
    useEffect(() => {
        getStatus(statusid)
    }, [statusid])

    return (
        <div>
            {loadingSearch ? <div>Loading...</div>
                : (
                    <>
                        <h3>Tu producto y/o servicio se encuentra en estado:</h3>
                        <StatusSegumiento statusString={status.product_status} />
                    </>
                )
            }
        </div>
    )
}

export default Status
