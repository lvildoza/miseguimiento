import { useContext, useEffect } from "react"
import { SeguimientoContext } from "../context/Context.jsx"
import { useSelector } from "react-redux"


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
                                        <th>ESTADO</th>
                                        <th>FECHA DE ENTREGA</th>
                                        <th>CLIENTE</th>
                                        <th>DETALLE</th>
                                        <th>TIPO DE ENTREGA</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        // Mapeo de cada seguimiento en cada fila, y cada campo en su columna correspondiente
                                        seguimiento.map(seg => (
                                            <tr key={seg.id}>
                                                <td>{seg.id}</td>
                                                <td>{seg.product_status}</td>
                                                <td>{seg.product_deadline}</td>
                                                <td>{seg.user_name}</td>
                                                <td>{seg.product_description}</td>
                                                <td>{seg.product_delivery}</td>
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
