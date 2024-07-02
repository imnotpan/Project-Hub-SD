import React, { useEffect, useRef, useState } from 'react'
import { toast, Toaster } from 'sonner'
import Close from '../../assets/Close'
import Calendar from './Calendar'
import Priority from './Priority'
import { projectAuthStore, teamAuthStore } from '../../authStore'
import { apiPatchData } from '../../services/apiService'
import { ToDoContentProps } from '../../types/types'
import Edit from '../../assets/Edit'
import { getUserSession } from '../../services/login'

const ToDoContent: React.FC<
	ToDoContentProps & {
		refreshTasks: () => void
		changeText: (text: string) => void
	}
> = ({ onClose, status, name, todo, refreshTasks, changeText }) => {
	const [closeButtonHovered, setCloseButtonHovered] = useState(false)
	const access_token = getUserSession()
	const { token_project } = projectAuthStore.getState()
	const { team_id } = teamAuthStore.getState()
	const [isEditing, setIsEditing] = useState(false)
	const [hoverEdit, setHoverEdit] = useState(false)

	const statusMap: { [key: string]: number } = {
		Unassigned: 0,
		'Not started': 1,
		'In process': 2,
		Completed: 3,
	}

	const [data, setData] = useState({
		name: name,
		task_creation_date: todo.task_creation_date
			? new Date(todo.task_creation_date)
			: new Date(),
		task_end_date: todo.task_end_date
			? new Date(todo.task_end_date)
			: new Date(),
		task_deadline_date: todo.task_deadline_date
			? new Date(todo.task_deadline_date)
			: new Date(),
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

		if (!data.task_creation_date || !data.task_deadline_date) {
			toast.warning('Por favor, completa todas las fechas.')
			return
		}

		try {
			const route = `/tasks/update?project_auth_key=${token_project}&team_id=${team_id}&task_id=${
				todo.task_id
			}&task_description=${data.description}&task_end_date=${data.task_end_date
				.toISOString()
				.slice(0, 10)}&task_deadline_date=${data.task_deadline_date
				.toISOString()
				.slice(0, 10)}&task_difficult=${
				data.difficulty
			}&task_state=${status}&task_name=${data.name}`
			const header = {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${access_token}`,
			}
			const response = await apiPatchData(route, header)

			if (response.ok) {
				refreshTasks()
				toast.success('Tarea actualizada exitosamente.')
			} else {
				toast.warning('Error al actualizar la tarea.')
			}
		} catch {
			toast.warning(
				'Error de red. Por favor, revisa tu conexión e intenta de nuevo.'
			)
		}

		onClose()
	}

	const handleEdit = () => {
		setIsEditing(!isEditing)
	}

	const inputRef = useRef<HTMLInputElement>(null)

	useEffect(() => {
		if (isEditing && inputRef.current) {
			inputRef.current.focus()
		}
	}, [isEditing])

	const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		changeText(event.target.value)
	}
	const handleBlur = () => {
		handleSave()
	}
	const handleSave = () => {
		// Aquí podrías enviar la actualización del texto a través de una función prop si es necesario
		setIsEditing(false)
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
					{isEditing ? (
						<input
							ref={inputRef}
							type="text"
							className="form-control p-0 fs-5 pe-2 me-2"
							value={name}
							onChange={handleTextChange}
							onBlur={handleBlur}
							autoFocus
							style={{
								cursor: 'pointer',
								outline: 'none',
								color: '#333',
								backgroundColor: 'transparent',
								border: 'none',
								boxShadow: 'none',
							}}
						/>
					) : (
						<h2 className="font-inter p-0 m-0" style={{ fontSize: '1.7rem' }}>
							{todo.task_name?.length > 0
								? todo.task_name.length > 17
									? todo.task_name.slice(0, 17) + '...'
									: todo.task_name
								: 'Tarea sin nombre'}
						</h2>
					)}
					<div className=" d-flex">
						<button
							className="border-0 rounded-5 p-0 me-2"
							onClick={handleEdit}
							style={{
								backgroundColor: '#F3D32F',
								transition: 'transform 0.3s ease-in-out',
								color: hoverEdit ? '#000' : '#F3D32F',
								width: '26px',
								height: '26px',
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
								transform: hoverEdit ? 'scale(1.1)' : 'scale(1)',
							}}
							onMouseOver={() => setHoverEdit(true)}
							onMouseLeave={() => setHoverEdit(false)}>
							<Edit size="22" color="" />
						</button>
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
							onMouseOver={() => setCloseButtonHovered(true)}
							onMouseLeave={() => setCloseButtonHovered(false)}
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
						<strong className="me-auto">Fecha de creacion:</strong>
						<input
							placeholder="Fecha de creacion"
							style={{ backgroundColor: '#f8f8f8', borderColor: 'white' }}
							type="date"
							value={handleStartDate(data.task_creation_date)}
							onChange={handleDataInputs}
							name="startDate"
							className="form-control w-50"
							disabled
						/>
					</div>
					<div className="mb-3 d-flex align-items-center ">
						<strong className="me-auto">Fecha de fin:</strong>
						<input
							placeholder="Fecha de creacion"
							style={{ backgroundColor: '#f8f8f8', borderColor: 'white' }}
							type="date"
							value={handleStartDate(data.task_end_date)}
							onChange={handleDataInputs}
							name="startDate"
							className="form-control me-2 w-50"
							disabled
						/>
						<Calendar
							dateSelect={(date) => setData({ ...data, task_end_date: date })}
						/>
					</div>
					<div className="mb-3 d-flex align-items-center">
						<strong className="me-auto">Fecha limite:</strong>
						<input
							placeholder="Fecha de fin"
							style={{ backgroundColor: '#f8f8f8', borderColor: 'white' }}
							type="date"
							value={handleEndDate(data.task_deadline_date)}
							onChange={handleDataInputs}
							name="endDate"
							className="form-control me-2 w-50"
							disabled
						/>
						<Calendar
							dateSelect={(date) =>
								setData({ ...data, task_deadline_date: date })
							}
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
