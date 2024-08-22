import { Link } from "react-router-dom"


const GetStarted = () => {
    return (
        <div>
            <div>
                <h1>PÁGINA DE INICIO</h1>
                <br />
                <Link to='/login'>Iniciar sesión</Link>
                <Link to='/register'>Crear cuenta</Link>
            </div>
        </div>
    )
}

export default GetStarted
