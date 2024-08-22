import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../context/Context.jsx"
import { useForm } from "react-hook-form"
import { VisibilityOff, Visibility } from '@mui/icons-material'
import { Link } from "react-router-dom"

const Register = () => {

    const { register: registerUser, loading } = useContext(AuthContext)
    const { register, handleSubmit, reset, formState: { errors: formErrors } } = useForm()
    const [displayErrors, setDisplayErrors] = useState(formErrors)
    const [visiblePassword, setVisiblePassword] = useState(false)

    // Temporizador para renderizar errores, pasados los 2s se vacía el estado con los errores
    useEffect(() => {
        if (Object.keys(formErrors).length > 0) {
            setDisplayErrors(formErrors)
            
            const timeout = setTimeout(() => {
                setDisplayErrors({})
            }, 2000)
            
            return () => clearTimeout(timeout)
        }

    }, [formErrors])

    // Función que maneja los valores de los inputs
    // Ejecuta la función registerUser() con los valores enviados
    const submit = handleSubmit(async (values) => {
        registerUser(values)
    })

    // Resetea los valores de los inputs al clickear el botón Cancelar
    const handleCancel = () => {
        reset()
    }

    return (
        <div>
            <div>
                <h1>REGISTRO</h1>

                <form
                    style={{ display: "flex", flexDirection: "column", width: 200, gap: 10 }}
                    onSubmit={submit}>
                    <input
                        type="text"
                        {...register('user_first_name', { required: true })}
                        name="user_first_name"
                        placeholder="Nombre" />
                    {displayErrors.user_first_name && <span>Nombre es requerido.</span>}

                    <input
                        type="text"
                        {...register('user_last_name', { required: true })}
                        name="user_last_name"
                        placeholder="Apellido" />
                    {displayErrors.user_last_name && <span>Apellido es requerido.</span>}
                    
                    <input
                        type="email"
                        {...register('user_mail', {
                            required: true,
                            pattern: /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/ 
                        })}
                        name="user_mail"
                        placeholder="Correo electrónico" />
                    {displayErrors.user_mail?.type === 'required' ?
                        <span>Email es requerido.</span>
                        : displayErrors.user_mail?.type === 'pattern' && <span>Correo inválido.</span>}
                    
                    <input
                        type="text"
                        {...register('user_name', {
                            required: true,
                            minLength: 3
                        })}
                        name="user_name"
                        placeholder="Nombre de usuario"
                        autoComplete="username" />
                    {displayErrors.user_name?.type === 'required' ?
                        <span>Nombre de usuario es requerido.</span>
                        : displayErrors.user_name?.type === 'minLength' && <span>Nombre de usuario debe tener mínimo 3 caracteres</span>}
                    
                    <div>
                        <input
                            type={!visiblePassword ? 'password' : 'text'}
                            {...register('user_password', {
                                required: true,
                                minLength: 6
                            })}
                            name="user_password"
                            placeholder="Contraseña"
                            autoComplete="current-password" />
                        {displayErrors.user_password?.type === 'required' ? 
                            <span>Contraseña es requerida.</span>
                            : displayErrors.user_password?.type === 'minLength' && <span>Contraseña debe tener mínimo 6 caracteres</span>}
                        {
                            !visiblePassword ?
                                <VisibilityOff onClick={() => setVisiblePassword(!visiblePassword)} />
                                : <Visibility onClick={() => setVisiblePassword(!visiblePassword)} />
                        }
                    </div>
                    
                    <div>
                        <button type="button" onClick={handleCancel}>Cancelar</button>
                        <button type="submit" disabled={loading}>Registrarse</button>
                    </div>
                </form>

                <span>Ya tienes una cuenta? <Link to='/login'>Inicia sesión</Link></span>
            </div>
        </div>
    )
}

export default Register
