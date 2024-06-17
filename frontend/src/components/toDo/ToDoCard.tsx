import React, { useRef, useState, useEffect } from 'react'
import Trash from '../../assets/trash'
import ToDoContent from './ToDoContent'
import Edit from '../../assets/Edit'
import Save from '../../assets/Save'
import { projectAuthStore, userAuthStore } from '../../authStore'
import { toast } from 'sonner'
import { apiDeleteData } from '../../services/apiService'
import { ToDoCardProps } from '../../types/types'

const ToDoCard: React.FC<ToDoCardProps & { refreshTasks: () => void }> = ({
	todo,
	onDelete,
	status,
	refreshTasks,
}) => {
	const [clickToDo, setClickToDo] = useState(false)
	const [isDragging, setIsDragging] = useState(false)
	const [isEditing, setIsEditing] = useState(true)
	const [text, setText] = useState(todo.task_description)
	const inputRef = useRef<HTMLInputElement>(null)
	const dragItem = useRef<HTMLDivElement>(null)
	const [isOver, setIsOver] = useState(false)

	const token_user = userAuthStore.getState().token
	const token_project = projectAuthStore.getState().token

	const handleDeleteTodo = async () => {
		onDelete(todo.task_id)
		try {
			const route = `/tasks/delete?project_auth_key=${token_project}&task_id=${todo.task_id}`
			const headers = {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token_user}`,
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
	}

	useEffect(() => {
		setText(todo.task_description)
	}, [todo.task_description])

	useEffect(() => {
		if (isEditing && inputRef.current) {
			inputRef.current.focus()
		}
	}, [isEditing])

	const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setText(event.target.value)
	}

	const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter') {
			handleSave()
		}
	}

	const handleBlur = () => {
		handleSave()
	}

	const handleSave = () => {
		// Aquí podrías enviar la actualización del texto a través de una función prop si es necesario
		setIsEditing(false)
	}

	const handleEdit = () => {
		setIsEditing(true)
	}

	const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
		event.stopPropagation()
		event.dataTransfer.setData('text/plain', JSON.stringify(todo))
		dragItem.current!.style.opacity = '0.5'
	}

	const handleDragEnd = () => {
		setIsDragging(false)
		dragItem.current!.style.opacity = '1'
	}

	return (
		<>
			<div
				className={`container py-1 card my-2 ${isDragging ? 'dragging' : ''}`}
				style={{
					backgroundColor: '#fff',
					border: '1px solid #ddd',
					transition: 'background-color 0.2s',
					boxShadow: isOver ? '0 0 5px rgba(0, 0, 0, 0.2)' : 'none',
				}}
				draggable
				ref={dragItem}
				onMouseOver={() => setIsOver(true)}
				onMouseOut={() => setIsOver(false)}
				onDragStart={handleDragStart}
				onDragEnd={handleDragEnd}>
				<div className="row align-items-center">
					<div
						className="col-md d-flex align-items-center p-0 px-2 scale"
						onClick={() => setClickToDo(true)}
						style={{ cursor: 'pointer' }}>
						{isEditing ? (
							<input
								ref={inputRef}
								type="text"
								className="form-control p-0 fs-5 px-1"
								value={text}
								onChange={handleTextChange}
								onBlur={handleBlur}
								onKeyDown={handleKeyDown}
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
							<div className="fs-5">
								{text.length > 17
									? text.slice(0, 16) + '...'
									: text || 'Sin nombre'}
							</div>
						)}
					</div>
					<div className="col-md-1 p-0">
						<button
							className={`border-0 p-0 bg-transparent ${
								isEditing ? 'd-none' : ''
							}`}
							onClick={handleEdit}
							onMouseOver={(e) => {
								e.currentTarget.style.transform = 'scale(1.1) rotate(10deg)'
								e.currentTarget.style.transition = 'transform 0.2s'
								e.currentTarget.style.cursor = 'pointer'
								e.currentTarget.style.color = '#4CD9D7'
							}}
							onMouseLeave={(e) => {
								e.currentTarget.style.transform = 'scale(1)'
								e.currentTarget.style.transition = 'transform 0.2s'
								e.currentTarget.style.color = '#333'
							}}>
							<Edit size="28" color="" />
						</button>
						{isEditing && (
							<button
								className="border-0 p-0 bg-transparent"
								onClick={handleSave}
								onMouseOver={(e) => {
									e.currentTarget.style.transform = 'scale(1.1) rotate(10deg)'
									e.currentTarget.style.transition = 'transform 0.2s'
									e.currentTarget.style.cursor = 'pointer'
									e.currentTarget.style.color = '#4CD9D7'
								}}
								onMouseLeave={(e) => {
									e.currentTarget.style.transform = 'scale(1)'
									e.currentTarget.style.transition = 'transform 0.2s'
									e.currentTarget.style.color = '#333'
								}}>
								<Save size="28" color="" />
							</button>
						)}
					</div>
					<div className="col-md-2 p-0">
						<button
							className="border-0 p-0 bg-transparent"
							onClick={handleDeleteTodo}
							onMouseOver={(e) => {
								e.currentTarget.style.transform = 'scale(1.1) rotate(10deg)'
								e.currentTarget.style.transition = 'transform 0.2s'
								e.currentTarget.style.cursor = 'pointer'
								e.currentTarget.style.color = '#DF3813'
							}}
							onMouseLeave={(e) => {
								e.currentTarget.style.transform = 'scale(1)'
								e.currentTarget.style.transition = 'transform 0.2s'
								e.currentTarget.style.color = '#333'
							}}>
							<Trash size="28" color="" />
						</button>
					</div>
				</div>
			</div>
			{clickToDo && (
				<ToDoContent
					refreshTasks={refreshTasks}
					name={text !== '' ? text : 'Sin nombre'}
					onClose={() => setClickToDo(false)}
					status={status}
					todo={todo}
				/>
			)}
		</>
	)
}

export default ToDoCard
