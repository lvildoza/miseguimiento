import { useContext, useEffect } from "react"
import { SeguimientoContext } from "../context/Context.jsx"
import { useSelector } from "react-redux"
import { formattedDate } from '../utilities/formattedDate.js'


const TableSeguimientos = () => {

    // Llamada a la función getAllSeguimientos para devolver todos los seguimientos y el estado loading para mostrar mientras se realiza la petición GET
    const { getAllSeguimientos, loading } = useContext(SeguimientoContext)

    // Uso del estado seguimientos del store.js de redux
    const seguimiento = useSelector(state => state.seguimientos)

    // Renderizado de la función al renderizarse por primera vez
    useEffect(() => {
        getAllSeguimientos()
    }, [])

    return (
        <>
            {
                loading ? <div>Loading...</div>
                    : seguimiento.length === 0 ? <div>No hay seguimientos aún</div>
                        : (
                            <table>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>FECHA INICIAL</th>
                                        <th>CLIENTE</th>
                                        <th>FECHA DE ENTREGA</th>
                                        <th>DETALLE</th>
                                        <th>TIPO DE ENTREGA</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        // Mapeo de cada seguimiento en cada fila, y cada campo en su columna correspondiente
                                        seguimiento.map((seg, index) => (
                                            <tr key={index}>
                                                <td>{seg.product_id}</td>
                                                <td>{formattedDate(seg.product_initial_date)}</td>
                                                <td>{seg.product_client_name}</td>
                                                <td>{seg.product_deadline}</td>
                                                <td>{seg.product_description}</td>
                                                <td>{seg.product_delivery_type}</td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                    )
            }
        </>
    )
}

export default TableSeguimientos
