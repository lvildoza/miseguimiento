import { useContext } from "react"
import { StatusContext } from "../context/Context.jsx"
import { useForm } from "react-hook-form"
import useSeguimientoSearch from "../hooks/useSeguimientoSearch.jsx"
import { useSelector } from "react-redux"
import { formattedDate } from "../utilities/formattedDate.js"

const FormStatus = () => {

    const { getStatus, createStatus, statusSuccess, errors, loadingSearch } = useContext(StatusContext)
    const { handleSubmit, register } = useForm()
    const { handleInputChange, inputValue } = useSeguimientoSearch()
    const status = useSelector(state => state.status)

    const submitStatus = handleSubmit(async (values) => {

        await createStatus(inputValue, values)
        await getStatus(inputValue)
    })

    return (
        <div>
            <h1>FORMULARIO CREAR STATUS</h1>

            <div>
                <input
                    type="text"
                    value={inputValue.toLowerCase().trim()}
                    onChange={handleInputChange}
                    placeholder="Introduce tu código de seguimiento"
                />
            </div>
            <br />

            <div>
                <form onSubmit={submitStatus}>
                    <select {...register("product_status_type")}>
                        <option value="">Selecciona un estado</option>
                        <option value="PENDIENTE">PENDIENTE</option>
                        <option value="CONFIRMADO">CONFIRMADO</option>
                        <option value="PREPARADO">PREPARADO</option>
                        <option value="ENVIADO">ENVIADO</option>
                        <option value="ENTREGADO">ENTREGADO</option>
                    </select>

                    <input
                        type="text"
                        {...register("product_description_status")}
                        name="product_description_status"
                        id="input_field"
                    />

                    <button>Enviar</button>
                </form>
                <br />
                {
                    errors.length > 0 ? <div>{errors}</div>
                        : statusSuccess.length > 0 && <div>{statusSuccess}</div>
                }
                {
                    loadingSearch ? <div>Loading...</div>
                        
                        : status.length > 0 &&
                        status[0].product_status &&
                        status[0].product_status.length > 0 && (

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                <span>{formattedDate(status[0].product_status[0].product_status_datetime)}</span>
                                <span>{status[0].product_status[0].product_status_type}</span>
                                <span>{status[0].product_status[0].product_description_status}</span>
                            </div>

                        )
                }
            </div>
        </div>
    )
}

export default FormStatus
