import { useContext, useState } from 'react'
import { useForm } from 'react-hook-form'
import { SeguimientoContext } from '../context/Context.jsx'
import { useSelector } from 'react-redux'
import { formattedDate } from '../utilities/formattedDate.js'

const FormSeguimiento = () => {

    const { getSeguimiento, createSeguimiento, errors, statusSuccess } = useContext(SeguimientoContext) 
    const { register, handleSubmit, reset } = useForm()
    const seguimiento = useSelector(state => state.seguimientos)

    const submitSeguimiento = handleSubmit(async (values) => {

        // Valor por defecto de product_id
        values.product_id = ""

        // LLamada a createSeguimiento del contexto
        const response = await createSeguimiento(values)

        if (response) {
            const fullSeguimiento = await getSeguimiento(response.product_id)
            
            // Reset del formulario si está el seguimiento completo
            fullSeguimiento && reset()
        }
    })
    
    // Validación para devolver sí o sí el último seguimiento creado y poder renderizarlo en pantalla
    const latestSeguimiento = seguimiento[seguimiento.length - 1]
    
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
                    {...register("product_client_name")}
                    name="product_client_name"
                    placeholder="username" />
                <textarea
                    type="text"
                    {...register("product_description")}
                    name="product_description"
                    placeholder="description" />
                
                <input
                    type="text"
                    {...register("product_delivery_type")}
                    name="product_delivery_type"
                    placeholder="delivery" />
                
                <button>Enviar</button>
            </form>
            <br />
            {
                errors.length > 0 ? <div>{errors}</div>
                : statusSuccess.length > 0 && <div>{statusSuccess}</div>
            }

            {
                latestSeguimiento && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <h3>DETALLE DEL PRODUCTO</h3>
                        <span>ID: {latestSeguimiento.product_id}</span>
                        <span>Fecha inicial: {formattedDate(latestSeguimiento.product_initial_date)}</span>
                        <span>Nombre del cliente: {latestSeguimiento.product_client_name}</span>
                        <span>Fecha de entrega: {latestSeguimiento.product_deadline}</span>
                        <span>Descripción del producto: {latestSeguimiento.product_description}</span>
                        <span>Delivery: {latestSeguimiento.product_delivery_type}</span>
                    </div>
                )
            }
        </>
    )
}

export default FormSeguimiento
