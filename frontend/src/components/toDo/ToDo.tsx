import React, { DragEvent, useState, useRef, useEffect } from 'react'
import Add from '../../assets/Add'
import ToDoCard from './ToDoCard'
import { Todo, ToDoProps } from '../../types/types'

const ToDo: React.FC<ToDoProps & { refreshTasks: () => void }> = ({
	color,
	title,
	tasks,
	status,
	refreshTasks,
}) => {
	const [todos, setTodos] = useState<Todo[]>([])
	const [text, setText] = useState(title || 'Agrega tareas!')
	const [isEditing, setIsEditing] = useState(false)
	const [isOver, setIsOver] = useState(false)
	const titleRef = useRef<HTMLInputElement>(null)

	useEffect(() => {
		if (tasks) {
			setTodos(tasks)
		}
	}, [tasks])

	const handleAddTodo = () => {
		const newTodoItem: Todo = {
			task_id: Date.now(),
			task_description: '',
			task_creation_date: '',
			task_end_date: '',
			task_deadline_date: '',
			task_difficult: 0,
			task_state: 'Pending',
			team_id: 1,
		}
		setTodos([...todos, newTodoItem])
	}

	const handleDeleteTodo = (id: number) => {
		setTodos((prevTodos) => prevTodos.filter((todo) => todo.task_id !== id))
		refreshTasks() // Fetch new tasks after deleting one
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

	const handleDrop = (event: DragEvent<HTMLDivElement>) => {
		event.preventDefault()
		setIsOver(false)
		const data = JSON.parse(event.dataTransfer?.getData('text/plain') || '{}')

		if (data) {
			const newTodoItem: Todo = {
				task_id: data['task_id'],
				task_description: data['task_description'],
				task_creation_date: data['task_creation_date'],
				task_end_date: data['task_end_date'],
				task_deadline_date: data['task_deadline_date'],
				task_difficult: data['task_difficult'],
				task_state: data['task_state'],
				team_id: data['team_id'],
			}
			setTodos([...todos, newTodoItem])
			refreshTasks() // Fetch new tasks after dropping one
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
							<li className="container" key={todo.task_id}>
								<ToDoCard
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
