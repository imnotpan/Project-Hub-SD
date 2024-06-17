import React, { DragEvent, useState, useRef, useEffect } from 'react'
import Add from '../../assets/Add'
import ToDoCard from './ToDoCard'

interface Todo {
	id: number
	completed: boolean
}

type ToDoProps = {
	color: string
	title: string
}

const ToDo: React.FC<ToDoProps> = ({ color, title }) => {
	const [todos, setTodos] = useState<Todo[]>([])
	const [text, setText] = useState(title || 'Agrega tareas!')
	const [isEditing, setIsEditing] = useState(false)
	const [isOver, setIsOver] = useState(false)
	const titleRef = useRef<HTMLInputElement>(null)

	const handleAddTodo = () => {
		const newTodoItem: Todo = {
			id: Date.now(),
			completed: false,
		}

		setTodos([...todos, newTodoItem])
	}

	const handleDeleteTodo = (id: number) => {
		setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id))
	}

	const handleTextClick = () => {
		setIsEditing(true)
	}

	useEffect(() => {
		if (isEditing) {
			titleRef.current?.focus()
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
		setIsEditing(false)
	}

	const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
		if (event.preventDefault) {
			event.preventDefault()
			setIsOver(true)
		}
		return false
	}

	const handleDragLeave = () => {
		setIsOver(false)
	}

	const handleDrop = (event: DragEvent<HTMLDivElement>) => {
		event.preventDefault()
		setIsOver(false)
		const data = event.dataTransfer?.getData('text/plain')
		if (data) {
			console.log('Elemento soltado en el área.')
			const newTodoItem: Todo = {
				id: parseInt(data),
				completed: false,
			}
			setTodos([...todos, newTodoItem])
		}
	}

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
					marginRight: '-17px', // Ajuste para compensar la barra de desplazamiento vertical
					color: isOver ? '#ffffff' : '#000000',
				}}
				onDragOver={handleDragOver}
				onDragLeave={handleDragLeave}
				onDrop={handleDrop}>
				<div className="col-md p-0">
					<ul className="p-0 list-unstyled">
						{todos.map((todo) => (
							<li className="container" key={todo.id}>
								<ToDoCard id={todo.id} onDelete={handleDeleteTodo} />
							</li>
						))}
					</ul>
				</div>
			</div>

			<button
				className="border-0 p-0 bg-transparent bottom-0 "
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
