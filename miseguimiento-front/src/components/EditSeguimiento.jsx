import useSeguimientoSearch from "../hooks/useSeguimientoSearch.jsx"
import { useContext, useState } from "react"
import { SeguimientoContext, StatusContext } from "../context/Context.jsx"
import { useSelector } from "react-redux"
import { useForm } from "react-hook-form"
import CardStatusAndDeadline from "./CardStatusAndDeadline.jsx"
import PropTypes from 'prop-types'

// Componente que se reutiliza para actualizar el estado de un seguimiento o la fecha de entrega
// editWordsArray contiene strings que cambian según el arreglo del componente que envía la prop
// updateType son 2 string -> "status" y "deadline", dependiendo del componente en que se envía la prop, se ejecutan acciones y renderizados diferentes
const EditSeguimiento = ({ editWordsArray, updateType }) => {

    const { updateStatus, loadingUpdate, errors: statusErrors, statusSuccess: productStatusSuccess } = useContext(StatusContext)
    const { updateDeadline, loadingUpdateDeadline, errors, statusSuccess } = useContext(SeguimientoContext)
    
    const { inputValue, showCard, handleInputChange, handleSearch } = useSeguimientoSearch()

    // Uso de react-hook-form para envíar los datos del formulario
    const { register, handleSubmit } = useForm()

    // Llamada los estados almacenados en el store.js de redux
    const seguimientos = useSelector(state => state.seguimientos)
    const status = useSelector(state => state.status)

    // Estado que muestra el renderizado de la actualización del seguimiento cuando su valor es true
    const [showNewCard, setShowNewCard] = useState(false)

    const submit = handleSubmit(async (newData) => {
        try {
            if (updateType === 'status') {
                if (!status || status.length === 0) {
                    console.error("No se encontró ningún estado")
                    return
                }

                // Valor por defecto del campo product_id
                newData.product_id = status[0].product_id

                const currentStatus = status[0].product_status

                const newStatus = {
                    product_status_datetime: new Date().toISOString(),
                    product_status_type: newData.product_status_type,
                    product_description_status: newData.product_description_status
                }

                console.log("Datos a enviar para status:", newData)

                const updatedStatus = [...currentStatus, newStatus]
                // Llamada a la función updateStatus de StatusContext
                await updateStatus(
                    newData.product_id,
                    {
                        product_id: newData.product_id,
                        product_status: updatedStatus
                    })

            } else if (updateType === 'deadline') {
                if (!seguimientos || seguimientos.length === 0) {
                    console.error("No se encontró ningún seguimiento")
                    return
                }

                // Valor por defecto del campo id
                newData.product_id = seguimientos[0].product_id
                console.log("Datos a enviar para deadline:", newData)

                // Llamada a la función updateDeadline de SeguimientoContext
                await updateDeadline(newData.product_id,
                    {
                        product_deadline: newData.product_deadline
                    })
            }
            
            setShowNewCard(true)
            
        } catch (error) {
            console.error('Error al actualizar: ', error);
        }
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
                <button onClick={() => handleSearch(inputValue.length > 0)}>Buscar</button>
            </div>
            <br />

            {showCard && <CardStatusAndDeadline />}

            <br />
            <label htmlFor="input-field">{editWordsArray[0]}</label>
            <form onSubmit={submit}>
                
                {
                    // JSX a mostrar en el componente <EditStatusPage /> 
                    updateType === "status" ? (
                        <div>
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
                        </div>
                    ) : updateType === 'deadline' &&
                        
                        // JSX a mostrar en el componente <EditDeadlinePage />
                        <input
                            type="text"
                            {...register("product_deadline")}
                            name="product_deadline"
                            id="input-field"
                        />
                    
                }
                <button>Actualizar</button>
            </form>
            <br />
            {
                loadingUpdate || loadingUpdateDeadline ? <div>Loading...</div>
                    
                    // JSX a mostrar al actualizar product_status o product_deadline
                    : showNewCard && (
                        <>
                            <label>{editWordsArray[1]}</label>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px'}}>
                                <span>ID: {updateType === 'deadline' ? seguimientos[0].product_id : status[0].product_id}</span>
                                <span>{editWordsArray[2]} {updateType === 'status' ? status[0].product_status[0].product_status_type : seguimientos[0].product_deadline}</span>
                                {updateType === 'status' && <span>{editWordsArray[3]} {status[0].product_status[0].product_description_status}</span>}
                            </div>

                            {/* Renderizado de mensajes de error o estado 200 dependiendo cuál es el valor de updateType */}
                            { 
                                updateType === 'deadline' && errors.length > 0 ? <span>{errors}</span>
                                    : updateType === 'deadline' && statusSuccess.length > 0 ? <span>{statusSuccess}</span>
                                        : updateType === 'status' && statusErrors.length > 0 ? <span>{statusErrors}</span>
                                            : updateType === 'status' && productStatusSuccess.length > 0 && <span>{productStatusSuccess}</span>
                            }
                        </>
                    )
            }
        </div>
    )
}

EditSeguimiento.propTypes = {
    editWordsArray: PropTypes.array,
    updateType: PropTypes.string
}

export default EditSeguimiento
