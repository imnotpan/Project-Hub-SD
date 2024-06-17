const days = [
	// Define los días de la semana y los meses
	'domingo',
	'lunes',
	'martes',
	'miércoles',
	'jueves',
	'viernes',
	'sábado',
]
const months = [
	'enero',
	'febrero',
	'marzo',
	'abril',
	'mayo',
	'junio',
	'julio',
	'agosto',
	'septiembre',
	'octubre',
	'noviembre',
	'diciembre',
]

const parseDate = (dateString: string): Date => {
	// Parsea la fecha en el formato correcto
	const date = new Date(dateString)

	const userTimezoneOffset = date.getTimezoneOffset() * 60000
	return new Date(date.getTime() + userTimezoneOffset)
}

export const formatDate = (dateString: string): string => {
	// Formatea la fecha mostrando el día, mes y año
	const date = parseDate(dateString)
	const dayName = days[date.getDay()]
	const day = date.getDate()
	const monthName = months[date.getMonth()]
	const year = date.getFullYear()

	return `${dayName} ${day} de ${monthName} ${year}`
}
