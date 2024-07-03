import React, { DragEvent, useState, useRef, useEffect } from 'react'
import Add from '../../assets/Add'
import ToDoCard from './ToDoCard'
import { TodoType, ToDoProps } from '../../types/types'
import { toast } from 'sonner'
import { projectAuthStore, teamAuthStore } from '../../authStore'
import {
	apiDeleteData,
	apiPatchData,
	apiSendData,
} from '../../services/apiService'
import { getUserSession } from '../../services/login'

const ToDo: React.FC<ToDoProps & { refreshTasks: () => void }> = ({
	color,
	title,
	tasks,
	status,
	refreshTasks,
}) => {
	const [todos, setTodos] = useState<TodoType[]>([])
	const [text, setText] = useState(title)
	const [isEditing, setIsEditing] = useState(false)
	const [isOver, setIsOver] = useState(false)
	const titleRef = useRef<HTMLInputElement>(null)

	const { access_token } = getUserSession()
	const { token_project } = projectAuthStore.getState()
	const teamId = teamAuthStore.getState().team_id

	useEffect(() => {
		if (tasks) {
			setTodos(tasks)
		}
	}, [tasks])

	const handleAddTodo = async () => {
		const newTodoItem: TodoType = {
			task_id: Date.now(),
			task_name: '',
			task_description: '',
			task_creation_date: '',
			task_end_date: '',
			task_deadline_date: '',
			task_difficult: 0,
			task_state: status,
			team_id: teamId!,
		}
		setTodos([...todos, newTodoItem])

		try {
			const route = `/tasks/add?project_auth_key=${token_project}&team_id=${teamId}&task_state=${status}&task_name=${''}`
			const header = {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${access_token}`,
			}
			const response = await apiSendData(route, header)

			if (response.ok) {
				toast.success('Tarea creada exitosamente.')
				refreshTasks()
			} else {
				toast.warning('Error al crear la tarea.')
			}
		} catch (e) {
			toast.warning(
				'Error de red. Por favor, revisa tu conexión e intenta de nuevo.'
			)
		}
	}

	const handleDeleteTodo = async (id: number) => {
		try {
			const route = `/tasks/delete?project_auth_key=${token_project}&task_id=${id}&team_id=${teamId}`
			const headers = {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${access_token}`,
			}
			const response = await apiDeleteData(route, headers)
			if (response.ok) {
				toast.success('Tarea eliminada exitosamente!.')
			}
		} catch (error) {
			toast.warning(
				'Error de red. Por favor, revisa tu conexión e intenta de nuevo.'
			)
		}
		setTodos((prevTodos) => prevTodos.filter((todo) => todo.task_id !== id))

		refreshTasks()
	}

	const handleTextClick = () => {
		setIsEditing(true)
	}

	const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setText(event.target.value)
	}

	const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter') {
			setIsEditing(false)
		}
	}

	const handleBlur = () => {
		setIsEditing(false)
	}

	const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
		event.preventDefault()
		setIsOver(true)
	}

	const handleDragLeave = () => {
		setIsOver(false)
	}

	const handleDrop = async (event: DragEvent<HTMLDivElement>) => {
		event.preventDefault()
		setIsOver(false)
		const data = JSON.parse(event.dataTransfer?.getData('text/plain') || '{}')

		if (data) {
			try {
				const route = `/tasks/update?project_auth_key=${token_project}&team_id=${teamId}&task_id=${data['task_id']}&task_state=${status}`

				const header = {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${access_token}`,
				}
				const response = await apiPatchData(route, header)
				if (response.ok) {
					refreshTasks()
				}
			} catch {
				toast.warning(
					'Error de red. Por favor, revisa tu conexión e intenta de nuevo.'
				)
			}
		}
	}

	useEffect(() => {
		if (isEditing) {
			titleRef.current?.focus()
		}
	}, [isEditing])

	return (
		<div style={{ position: 'relative' }}>
			<div onClick={handleTextClick} className="mb-2">
				{isEditing ? (
					<input
						ref={titleRef}
						type="text"
						className="form-control"
						value={text}
						onChange={handleTextChange}
						onKeyDown={handleKeyDown}
						onBlur={handleBlur}
						autoFocus
					/>
				) : (
					<div
						className="fs-5 rounded-2"
						style={{
							backgroundColor: color,
						}}>
						{text}
					</div>
				)}
			</div>

			<div
				className="row rounded-4 position-relative"
				style={{
					height: '36vh',
					backgroundColor: isOver ? 'rgba(0, 0, 0, 0.1)' : '#ffffff',
					overflowY: 'auto',
					marginRight: '-17px',
					color: isOver ? '#ffffff' : '#000000',
				}}
				onDragOver={handleDragOver}
				onDragLeave={handleDragLeave}
				onDrop={handleDrop}>
				<div className="col-md p-0">
					<ul className="p-0 list-unstyled">
						{todos.map((todo) => (
							<li className="container " key={todo.task_id}>
								<ToDoCard
									color={color}
									refreshTasks={refreshTasks}
									todo={todo}
									onDelete={handleDeleteTodo}
									status={status}
								/>
							</li>
						))}
					</ul>
				</div>
			</div>

			<button
				className="border-0 p-0 bg-transparent bottom-0"
				onClick={handleAddTodo}
				onMouseOver={(e) => {
					e.currentTarget.style.transform = 'scale(1.1)'
					e.currentTarget.style.transition = 'transform 0.2s'
					e.currentTarget.style.cursor = 'pointer'
				}}
				onMouseLeave={(e) => {
					e.currentTarget.style.transform = 'scale(1)'
					e.currentTarget.style.transition = 'transform 0.2s'
				}}>
				<Add size="36" color={isOver ? '#ffffff' : '#323232'} />
			</button>
		</div>
	)
}

export default ToDo
