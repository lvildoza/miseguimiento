import EditSeguimiento from "../components/EditSeguimiento.jsx"

const EditDeadlinePage = () => {

    // Arreglo de strings que se muestran solo en la ruta /edit-deadline
    const editWords = [
        'Modificar fecha de entrega:',
        'Nueva fecha de entrega:',
        'Fecha estimada de entrega:'
    ]

    return (
        <div>
            <EditSeguimiento editWordsArray={editWords} updateType='deadline' />
        </div>
    )
}

export default EditDeadlinePage
