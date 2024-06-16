import React from 'react'
import { projectAuthStore, userAuthStore } from '../../authStore'
import { toast } from 'sonner'
import { apiSendData } from '../../services/apiService'
import { useNavigate } from 'react-router-dom'
import Copy from '../../assets/Copy'
import Avatar from 'react-avatar'

type ElementProjectTableProps = {
	// Define las propiedades de la tabla de proyectos
	name: string
	description: string
	project_id: string
	project_creation_date: string
	project_password: string
}

const ElementProjectTable: React.FC<ElementProjectTableProps> = ({
	// Componente para mostrar un proyecto en la tabla
	name,
	description,
	project_id,
	project_creation_date,
	project_password,
}) => {
	const setToken = projectAuthStore((state) => state.setToken) // Token del proyecto
	const setTokenType = projectAuthStore((state) => state.setTokenType) // Tipo de token del proyecto
	const navigate = useNavigate()

	const clickCard = async () => {
		// Función para manejar el click en el proyecto
		try {
			const route = `/project/auth?project_id=${project_id}&project_password=${project_password}`
			const header = {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${userAuthStore.getState().token}`,
			}
			const response = await apiSendData(route, header)
			const data = await response.json()
			if (response.ok) {
				// Si la respuesta es exitosa, almacena el token del proyecto y navega a la página de proyectos
				setToken(data.access_token)
				setTokenType(data.token_type)
				toast.success('Credenciales exitosas!.')
				navigate('/projects') // Navega a la página de proyectos
			} else {
				toast.error('Credenciales inválidas. Por favor, intenta de nuevo.')
			}
		} catch (e) {
			toast.warning(
				'Error de red. Por favor, revisa tu conexión e intenta de nuevo.'
			)
		}
	}

	const copyClick = (e: React.MouseEvent<HTMLTableDataCellElement>) => {
		// Maneja el click para copiar el id o la contraseña
		if (e.currentTarget.getAttribute('data-type') === 'password') {
			toast.info('Contraseña copiada!')
		} else {
			toast.info('ID copiada!')
		}
		navigator.clipboard.writeText(e.currentTarget.textContent || '')
	}

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

	const formatDate = (dateString: string): string => {
		// Formatea la fecha mostrando el día, mes y año
		const date = parseDate(dateString)
		const dayName = days[date.getDay()]
		const day = date.getDate()
		const monthName = months[date.getMonth()]
		const year = date.getFullYear()

		return `${dayName} ${day} de ${monthName} ${year}`
	}

	const [hover, SetHover] = React.useState(false)

	return (
		<tr className="">
			<td className="d-flex align-items-center ">
				<div
					className="d-flex justify-content-center align-items-center text-uppercase fw-bold text-white mx-2 me-4"
					onMouseOver={(e) => {
						e.currentTarget.style.border = '2px solid #007bff'
					}}
					onMouseOut={(e) => {
						e.currentTarget.style.border = 'none'
					}}
					onClick={clickCard}
					style={{
						borderRadius: '50%',
						height: '50px',
						width: '50px',
						objectFit: 'cover',
						cursor: 'pointer',
						marginRight: '10px',
						transition: 'border 0.3s ease',
					}}>
					<Avatar name={name} size="46" round={true} />
				</div>
				<div>
					<p className="fw-bold m-0 p-0">{name}</p>
					<p className="m-0 p-0 d-none d-md-table-cell">
						{description.length < 41
							? description
							: description.slice(0, 47) + '...'}
					</p>
				</div>
			</td>
			<td className="align-content-center" onClick={copyClick} data-type="id">
				<div
					className="d-flex align-items-center justify-content-between border-1 rounded-5 p-1 px-2"
					style={{
						backgroundColor: '#f6f8fa',
						cursor: 'pointer',
						color: '#333',
					}}
					onMouseOver={(e) => {
						e.currentTarget.style.color = '#a1a5a7'
						SetHover(true)
					}}
					onMouseOut={(e) => {
						e.currentTarget.style.color = '#333'
						SetHover(false)
					}}>
					<p className="m-0 text-center ">{project_id}</p>
					<Copy color={hover ? '#a1a5a7' : '#333'} size="20" />
				</div>
			</td>
			<td className="align-content-center d-none d-md-table-cell">
				{formatDate(project_creation_date)}
			</td>
		</tr>
	)
}

export default ElementProjectTable
