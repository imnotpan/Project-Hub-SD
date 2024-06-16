import React, { useRef, useState, useEffect } from 'react'

import Trash from '../../assets/trash'
import ToDoContent from './ToDoContent'
import Edit from '../../assets/Edit'

import Save from '../../assets/Save'

interface ToDoCardProps {
	id: number
	onDelete: (id: number) => void
}

const ToDoCard: React.FC<ToDoCardProps> = ({ id, onDelete }) => {
	const [clickToDo, setClickToDo] = useState(false)
	const [isDragging, setIsDragging] = useState(false)
	const [isEditing, setIsEditing] = useState(true)
	const [text, setText] = useState('')
	const inputRef = useRef<HTMLInputElement>(null)
	const dragItem = useRef<HTMLDivElement>(null)
	const [isOver, setIsOver] = useState(false)

	const handleDeleteTodo = () => {
		onDelete(id)
	}

	useEffect(() => {
		if (isEditing) {
			inputRef.current?.focus()
		}
	}, [isEditing])

	const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setText(event.target.value)
	}

	const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter') {
			setIsEditing(false)
		}
	}

	const handleBlur = () => {
		if (text.trim() === '') {
			setText('Sin nombre')
		}
		setIsEditing(false)
	}

	const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
		setIsDragging(true)
		event.dataTransfer.setData('text/plain', id.toString())
	}

	const handleDragEnd = () => {
		setIsDragging(false)
	}

	return (
		<div
			className={`container py-1 card my-2 ${isDragging ? 'dragging' : ''}  `}
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
				{clickToDo && (
					<ToDoContent onClose={() => setClickToDo(false)} title={text} />
				)}
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
							style={{
								cursor: 'pointer',
								outline: 'none',
								color: isEditing ? '#999' : '#333',
								backgroundColor: 'transparent',
								border: 'none',
								boxShadow: 'none',
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
						className={`border-0 p-0 bg-transparent ' ${
							isEditing ? 'd-none' : ''
						}`}
						onClick={() => setIsEditing(!isEditing)}
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
					{isEditing && (
						<button
							className="border-0 p-0 bg-transparent"
							onClick={() => setIsEditing(!isEditing)}
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
							<Save size="28" color="" />
						</button>
					)}
				</div>
				<div className="col-md-2 p-0">
					<button
						className="border-0 p-0 bg-transparent"
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
