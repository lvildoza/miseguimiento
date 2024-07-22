import { useContext } from 'react'
import { useForm } from 'react-hook-form'
import { SeguimientoContext } from '../context/Context.jsx'

const FormSeguimiento = () => {

    const { createSeguimiento, errors, statusSuccess } = useContext(SeguimientoContext) 
    const { register, handleSubmit } = useForm()

    const submitSeguimiento = handleSubmit(async (values) => {
        values.id = ""

        // LLamada a createSeguimiento del contexto
        await createSeguimiento(values)
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
            {
                errors.length > 0 ? <div>{errors}</div>
                : statusSuccess.length > 0 && <div>{statusSuccess}</div>
            }
        </>
    )
}

export default FormSeguimiento
