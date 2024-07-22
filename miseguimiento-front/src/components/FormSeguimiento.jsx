import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { createSeguimientoRequest } from '../services/seguimiento.js'
import { addSeguimiento } from '../redux/seguimientoSlice.js'

const FormSeguimiento = () => {

    const dispatch = useDispatch()
    const { register, handleSubmit } = useForm()

    // Función encargada de enviar los datos ingresados en el formulario al backend
    const submitSeguimiento = handleSubmit(async (values) => {

        values.id = ""

        // Uso de la función creada en status.js 
        const res = await createSeguimientoRequest(values)

        // Uso del reducer addSeguimiento proveniente de seguimientoSlice.js
        // Envío del contenido de la respuesta 
        dispatch(addSeguimiento(res))
    })
    
    return (
        <>
            <h1>FORMULARIO CREAR SEGUIMIENTO</h1>
            <form onSubmit={submitSeguimiento}>
                <input
                    type="text"
                    {...register("product_deadline")}
                    name="product_deadline"
                    placeholder="product deadline" />
                
                <input
                    type="text"
                    {...register("user_name")}
                    name="user_name"
                    placeholder="username" />
                <textarea
                    type="text"
                    {...register("product_description")}
                    name="product_description"
                    placeholder="description" />
                
                <input
                    type="text"
                    {...register("product_delivery")}
                    name="product_delivery"
                    placeholder="delivery" />
                
                <button>Enviar</button>
            </form>
        </>
    )
}

export default FormSeguimiento
