import React, { DragEvent, useState } from 'react'
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

	const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
		event.preventDefault()
		setIsOver(true)
	}

	const handleDragLeave = () => {
		setIsOver(false)
	}

	const handleDrop = (event: DragEvent<HTMLDivElement>) => {
		event.preventDefault()
		setIsOver(false)
		const data = event.dataTransfer?.getData('text/plain')
		if (data === 'DraggableItem') {
			// Realizar acciones necesarias al soltar el elemento
			console.log('Elemento soltado en el área.')
		}
	}
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

	const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setText(event.target.value)
	}

	const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter') {
			setIsEditing(false)
		}
	}

	return (
		<div className="">
			<div onClick={handleTextClick} className="mb-2 p-2 ">
				{isEditing ? (
					<input
						type="text"
						className="form-control"
						value={text}
						onChange={handleTextChange}
						onKeyDown={handleKeyDown}
						autoFocus
					/>
				) : (
					<div
						className=" fs-5 rounded-2 "
						style={{
							backgroundColor: color,
						}}>
						{text}
					</div>
				)}
			</div>
			<div
				className="row"
				style={{
					height: '38vh',
					backgroundColor: isOver ? 'rgba(0, 0, 0, 0.1)' : '#ffffff',
					overflowY: 'auto',
					overflowX: 'hidden',
					color: isOver ? '#ffffff' : '#000000',
				}}
				onDragOver={handleDragOver}
				onDragLeave={handleDragLeave}
				onDrop={handleDrop}>
				<div className="col-md m-2 p-0">
					<ul className="p-0 list-unstyled">
						{todos.map((todo) => (
							<li className="container " key={todo.id}>
								<ToDoCard id={todo.id} onDelete={handleDeleteTodo} />
							</li>
						))}
					</ul>
					<button
						className="border-0 p-0 bg-transparent "
						onClick={handleAddTodo}
						onMouseOver={(e) => (
							(e.currentTarget.style.transform = 'scale(1.1)'),
							(e.currentTarget.style.transition = 'transform 0.2s'),
							(e.currentTarget.style.cursor = 'pointer')
						)}
						onMouseLeave={(e) => (
							(e.currentTarget.style.transform = 'scale(1)'),
							(e.currentTarget.style.transition = 'transform 0.2s')
						)}>
						<Add size="36" color={isOver ? '#ffffff' : '#323232'} />
					</button>
				</div>
			</div>
		</div>
	)
}

export default ToDo
