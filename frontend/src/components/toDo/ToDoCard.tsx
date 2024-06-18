import React, { useRef, useState, useEffect } from 'react'
import Trash from '../../assets/trash'
import ToDoContent from './ToDoContent'
import Edit from '../../assets/Edit'
import Save from '../../assets/Save'

import { ToDoCardProps } from '../../types/types'
import Close from '../../assets/Close'

const ToDoCard: React.FC<
	ToDoCardProps & { refreshTasks: () => void; color: string }
> = ({ todo, onDelete, status, refreshTasks, color }) => {
	const [clickToDo, setClickToDo] = useState(false)
	const [isDragging, setIsDragging] = useState(false)
	const [isEditing, setIsEditing] = useState(true)
	const [text, setText] = useState(todo.task_description)
	const inputRef = useRef<HTMLInputElement>(null)
	const dragItem = useRef<HTMLDivElement>(null)
	const [isOver, setIsOver] = useState(false)

	const [closeButtonHovered, setCloseButtonHovered] = useState(false)
	const [hoverEdit, setHoverEdit] = useState(false)
	const [saveButton, setSaveButton] = useState(false)

	const handleDeleteTodo = async () => {
		onDelete(todo.task_id)
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
					borderColor: color,
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
								className="form-control p-0 fs-5 px-1 "
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
							<div
								className={`fs-5 ${
									status === 'Completed' ? 'text-decoration-line-through' : ''
								}`}>
								{text.length > 17
									? text.slice(0, 16) + '...'
									: text || 'Tarea sin nombre'}
							</div>
						)}
					</div>
					<div className="col-md-1 p-0 me-2">
						{/* <button
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
						</button> */}
						<button
							className={`border-0 rounded-5 p-0 me-2 ${
								isEditing ? 'd-none' : ''
							}`}
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
						{isEditing && (
							<>
								{/* <button
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
								</button> */}
								<button
									className="border-0 p-0 rounded-5 me-2"
									onClick={handleSave}
									style={{
										backgroundColor: '#4CD964',
										transition: 'transform 0.3s ease-in-out',
										color: saveButton ? '#000' : '#4CD964',
										width: '26px',
										height: '26px',
										display: 'flex',
										justifyContent: 'center',
										alignItems: 'center',
										transform: saveButton ? 'scale(1.1)' : 'scale(1)',
									}}
									onMouseOver={() => setSaveButton(true)}
									onMouseLeave={() => setSaveButton(false)}>
									<Save size="22" color="" />
								</button>
							</>
						)}
					</div>
					<div className="col-md-2 p-0">
						{/* <button
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
						</button> */}
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
							onClick={handleDeleteTodo}>
							<Close
								size="26"
								color={closeButtonHovered ? '#000' : '#FF5F56'}
							/>
						</button>
					</div>
				</div>
			</div>
			{clickToDo && (
				<ToDoContent
					changeText={setText}
					refreshTasks={refreshTasks}
					name={text !== '' ? text : ''}
					onClose={() => setClickToDo(false)}
					status={status}
					todo={todo}
				/>
			)}
		</>
	)
}

export default ToDoCard
