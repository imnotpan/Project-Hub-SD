import React, { useRef, useState, DragEvent, useEffect } from 'react'

import Trash from '../../assets/trash'
import ToDoContent from './ToDoContent'
import Edit from '../../assets/Edit'

interface ToDoCardProps {
	id: number
	onDelete: (id: number) => void
}

const ToDoCard: React.FC<ToDoCardProps> = ({ id, onDelete }) => {
	// Componente que representa una tarea (visualmente una carta)
	const [clickToDo, setClickToDo] = useState(false)
	const [isDragging, setIsDragging] = useState(false)
	const [isEditing, setIsEditing] = useState(true)
	const [text, setText] = useState('')
	const inputRef = useRef<HTMLInputElement>(null) // Tipado correcto y valor inicial
	const dragItem = useRef<HTMLDivElement>(null)

	const handleDragStart = (event: DragEvent<HTMLDivElement>) => {
		setIsDragging(true)
		event.dataTransfer?.setData('text/html', 'DraggableItem')
	}

	const handleDragEnd = () => {
		setIsDragging(false)
	}

	const handleDeleteTodo = () => {
		onDelete(id)
	}
	const handleClick = () => {
		setClickToDo(!clickToDo)
	}

	useEffect(() => {
		if (isEditing) {
			inputRef.current?.focus() // Enfocar solo si está editando
		}
	}, [isEditing]) // Dependencia a isEditing

	const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setText(event.target.value)
	}

	const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter') {
			setIsEditing(!isEditing)
		}
	}

	const handleBlur = () => {
		if (text.trim() === '') {
			setText('Sin nombre')
		}
	}

	return (
		<div
			className={`container py-1 card my-2  ${isDragging ? 'dragging' : ''}`}
			draggable
			ref={dragItem}
			onDragStart={handleDragStart}
			onDragEnd={handleDragEnd}>
			<div className="row align-items-center">
				{clickToDo && <ToDoContent onClose={handleClick} />}
				<div
					className="col-md d-flex align-items-center "
					onDoubleClick={() => {
						setIsEditing(!isEditing)
					}}
					style={{
						cursor: 'pointer', // Cambia el cursor al puntero al pasar sobre el texto
					}}>
					{isEditing ? (
						<input
							ref={inputRef}
							type="text"
							className="form-control p-0 fs-5"
							value={text}
							onChange={handleTextChange}
							onBlur={handleBlur} // Añadir esta línea
							style={{
								cursor: 'pointer', // Cambia el cursor al puntero al pasar sobre el texto
								outline: 'none', // Quita el borde del focus
								border: 'none', // Quita cualquier borde predeterminado
								boxShadow: 'none', // Quita cualquier sombra que pueda aparecer al hacer focus
							}}
							onKeyDown={handleKeyDown}
							autoFocus
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
						className="border-0 p-0 bg-transparent "
						onClick={handleClick}
						onMouseOver={(e) => (
							(e.currentTarget.style.transform = 'scale(1.1) rotate(10deg)'),
							(e.currentTarget.style.transition = 'transform 0.2s'),
							(e.currentTarget.style.cursor = 'pointer'),
							(e.currentTarget.style.color = '#4CD9D7')
						)}
						onMouseLeave={(e) => (
							(e.currentTarget.style.transform = 'scale(1)'),
							(e.currentTarget.style.transition = 'transform 0.2s'),
							(e.currentTarget.style.color = '#333')
						)}>
						<Edit size="28" color="" />
					</button>
				</div>
				<div className="col-md-2 p-0">
					<button
						className="border-0 p-0 bg-transparent "
						onClick={handleDeleteTodo}
						onMouseOver={(e) => (
							(e.currentTarget.style.transform = 'scale(1.1) rotate(10deg)'),
							(e.currentTarget.style.transition = 'transform 0.2s'),
							(e.currentTarget.style.cursor = 'pointer'),
							(e.currentTarget.style.color = '#DF3813')
						)}
						onMouseLeave={(e) => (
							(e.currentTarget.style.transform = 'scale(1)'),
							(e.currentTarget.style.transition = 'transform 0.2s'),
							(e.currentTarget.style.color = '#333')
						)}>
						<Trash size="28" color="" />
					</button>
				</div>
			</div>
		</div>
	)
}

export default ToDoCard
