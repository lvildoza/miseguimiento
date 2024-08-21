import { useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { AuthContext } from '../context/Context.jsx'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { Link } from 'react-router-dom'


const Login = () => {

    const { login, username } = useContext(AuthContext)

    const { handleSubmit, register, reset, formState: { errors: formErrors } } = useForm()
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
    // Ejecuta la función login() con los valores enviados
    const submit = handleSubmit(async (values) => {
        login(values)
    })

    // Resetea los valores de los inputs al clickear el botón Cancelar
    const handleCancel = () => {
        reset()
    }
    
    return (
        <div>
            <div>
                <h1>LOGIN</h1>
                <form
                    style={{ display: "flex", flexDirection: "column", width: 200, gap: 10 }}
                    onSubmit={submit}>
                    <input
                        type="text"
                        {...register('username', { required: true })}
                        name='username'
                        placeholder="Nombre de usuario"
                        autoComplete="username" />
                    {displayErrors.username && <span>Nombre de usuario es requerido</span>}

                    <div>
                        <input
                            type={!visiblePassword ? 'password' : 'text'}
                            {...register('password', { required: true })}
                            name='password'
                            placeholder="Contraseña"
                            autoComplete="current-password" />
                        {displayErrors.password && <span>Contraseña es requerida</span>}
                        {
                            !visiblePassword ?
                                <VisibilityOff onClick={() => setVisiblePassword(!visiblePassword)} />
                                : <Visibility onClick={() => setVisiblePassword(!visiblePassword)} />
                        }
                    </div>

                    <div>
                        <button type='button' onClick={handleCancel}>Cancelar</button>
                        <button type='submit'>Iniciar sesión</button>
                    </div>
                </form>
            </div>
            
            <span>No tienes cuenta? <Link to='/register'>Crear cuenta</Link></span>

            <div>
                <span>{username}</span>
            </div>
        </div>
    )
}

export default Login
