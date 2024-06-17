import React, { useState } from 'react'
import { toast, Toaster } from 'sonner'
import Close from '../../assets/Close'
import Calendar from './Calendar'
import Priority from './Priority'
import { projectAuthStore, teamAuthStore, userAuthStore } from '../../authStore'
import { apiSendData } from '../../services/apiService'
import { ToDoContentProps } from '../../types/types'

const ToDoContent: React.FC<
	ToDoContentProps & { refreshTasks: () => void }
> = ({ onClose, status, name, todo, refreshTasks }) => {
	const [closeButtonHovered, setCloseButtonHovered] = useState(false)
	const token_user = userAuthStore.getState().token
	const token_project = projectAuthStore.getState().token
	const teamId = teamAuthStore.getState().team_id

	const statusMap: { [key: string]: number } = {
		Unassigned: 0,
		'Not started': 1,
		'In process': 2,
		Completed: 3,
	}

	const [data, setData] = useState({
		name: name,
		startDate: todo.task_creation_date
			? new Date(todo.task_creation_date)
			: new Date(),
		endDate: todo.task_end_date ? new Date(todo.task_end_date) : new Date(),
		description: todo.task_description || '', // Aquí también ajustado para tomar el valor de task_description si existe
		difficulty:
			typeof todo.task_difficult === 'number' ? todo.task_difficult : 0,
		state: statusMap[status],
	})

	const handleDataInputs = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		setData({
			...data,
			[e.target.name]: e.target.value,
		})
	}

	const handleMouseOver = () => {
		setCloseButtonHovered(true)
	}

	const handleMouseLeave = () => {
		setCloseButtonHovered(false)
	}

	const handleStartDate = (date: Date) => {
		const formattedDate = date.toISOString().substring(0, 10)
		return formattedDate
	}

	const handleEndDate = (date: Date) => {
		const formattedDate = date.toISOString().substring(0, 10)
		return formattedDate
	}

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		if (!data.startDate || !data.endDate) {
			toast.warning('Por favor, completa todas las fechas.')
			return
		}

		try {
			const route = `/tasks/add?project_auth_key=${token_project}&team_id=${teamId}&task_description=${
				data.description
			}&task_end_date=${data.endDate
				.toISOString()
				.slice(0, 10)}&task_deadline_date=${data.endDate
				.toISOString()
				.slice(0, 10)}&task_difficult=${data.difficulty}&task_state=${status}`
			const header = {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token_user}`,
			}
			console.log(route)
			const response = await apiSendData(route, header)
			const responseData = await response.json() // Parse the JSON response

			if (response.ok) {
				refreshTasks()

				console.log(responseData)
				toast.success('Tarea creada exitosamente.')
			} else {
				toast.warning('Error al crear la tarea.')
			}
		} catch (e) {
			refreshTasks()

			toast.warning(
				'Error de red. Por favor, revisa tu conexión e intenta de nuevo.'
			)
		}

		onClose()
	}

	return (
		<div
			className="d-flex justify-content-center align-items-center position-fixed"
			draggable="false"
			style={{
				top: 0,
				left: 0,
				width: '100%',
				height: '100%',
				backgroundColor: 'rgba(255, 255, 255, 0.9)',
				zIndex: 9999,
			}}>
			<div
				className="card p-4 border-0"
				style={{
					maxWidth: '400px',
					width: '100%',
					boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
				}}>
				<div className="d-flex align-items-center justify-content-between mb-4 p-2">
					<h2 className="font-inter p-0 m-0" style={{ fontSize: '1.7rem' }}>
						{data.name}
					</h2>
					<div className="me-2">
						<button
							className="border-0 rounded-5"
							style={{
								backgroundColor: '#FF5F56',
								transition: 'all 0.3s ease-in-out',
								width: '26px',
								height: '26px',
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
								transform: closeButtonHovered ? 'scale(1.1)' : 'scale(1)',
							}}
							onMouseOver={handleMouseOver}
							onMouseLeave={handleMouseLeave}
							onClick={onClose}>
							<Close
								size="26"
								color={closeButtonHovered ? '#000' : '#FF5F56'}
							/>
						</button>
					</div>
				</div>

				<form onSubmit={handleSubmit}>
					<div className="mb-3 d-flex align-items-center">
						<input
							placeholder="Fecha de creacion"
							style={{ backgroundColor: '#f8f8f8', borderColor: 'white' }}
							type="text"
							value={handleStartDate(data.startDate)}
							onChange={handleDataInputs}
							name="startDate"
							className="form-control me-2"
							disabled
						/>
						<Calendar
							dateSelect={(date) => setData({ ...data, startDate: date })}
						/>
					</div>
					<div className="mb-3 d-flex align-items-center">
						<input
							placeholder="Fecha de fin"
							style={{ backgroundColor: '#f8f8f8', borderColor: 'white' }}
							type="text"
							value={handleEndDate(data.endDate)}
							onChange={handleDataInputs}
							name="endDate"
							className="form-control me-2"
							disabled
						/>
						<Calendar
							dateSelect={(date) => setData({ ...data, endDate: date })}
						/>
					</div>
					<div className="mb-3 d-flex align-items-center">
						<Priority
							difficulty={data.difficulty}
							onChange={(value) => setData({ ...data, difficulty: value })}
						/>
					</div>
					<div className="mb-3 d-flex align-items-center">
						<textarea
							placeholder="Descripción de la tarea"
							value={data.description}
							onChange={handleDataInputs}
							style={{
								backgroundColor: '#f8f8f8',
								borderColor: 'white',
								height: '150px',
								resize: 'none',
							}}
							name="description"
							className="form-control me-2"
						/>
					</div>
					<div style={{ width: '100%' }}>
						<button
							type="submit"
							className="btn text-white w-100"
							style={{ backgroundColor: '#202020' }}>
							Guardar
						</button>
					</div>
				</form>
				<Toaster richColors />
			</div>
		</div>
	)
}

export default ToDoContent
