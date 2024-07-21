// Función para transformar fechas en formato DD/MM/YYYY
export const formattedDate = (fullDate) => {
    const date = new Date(fullDate)
    const day = date.getDate()
    const month = date.getMonth() + 1 
    const year = date.getFullYear()

    const formattedDay = day < 10 ? `0${day}` : day
    const formattedMonth = month < 10 ? `0${month}` : month

    return `${formattedDay}/${formattedMonth}/${year}`
}