import EditSeguimiento from "../components/EditSeguimiento.jsx"

const EditStatusPage = () => {

    // Arreglo de strings que se muestra solo en la ruta /edit-status
    const editWords = [
        'Seleccione un nuevo estado:',
        'Estado actualizado:',
        'Nuevo estado:',
        'Nueva descripción de estado:'
    ]

    return (
        <div>
            <EditSeguimiento editWordsArray={editWords} updateType='status' />
        </div>
    )
}

export default EditStatusPage
