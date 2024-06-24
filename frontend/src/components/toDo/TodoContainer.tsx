import React, { useEffect, useState } from 'react'

interface Task {
	task_id: number
	task_description: string
	task_creation_date: string
	task_end_date: string
	task_deadline_date: string
	task_difficult: number
	task_state: string
	team_id: number
}
import Todo from './ToDo'
import { toast } from 'sonner'
import { apiGetData } from '../../services/apiService'
import { projectAuthStore, teamAuthStore, userAuthStore } from '../../authStore'

const ToDoContainer: React.FC = () => {
	const [dataToDo, setDataToDo] = useState<Task[]>([])
	const teamId = teamAuthStore.getState().team_id
	const token_user = userAuthStore.getState().token
	const token_project = projectAuthStore.getState().token

	const fetchTodos = async () => {
		try {
			const route = `/team/${teamId}/tasks?project_auth_key=${token_project}`
			const headers = {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token_user}`,
			}
			const response = await apiGetData(route, headers)
			const data = await response.json()

			if (response.ok) {
				setDataToDo(data)
				toast.success('Tareas obtenidas exitosamente!.')
			}
		} catch (error) {
			toast.warning(
				'Error de red. Por favor, revisa tu conexión e intenta de nuevo.'
			)
		}
	}

	useEffect(() => {
		fetchTodos()
	}, [teamId, token_project, token_user])

	const filterTasksByState = (state: string) =>
		dataToDo.filter((task) => task.task_state === state)

	return (
		<div className="container">
			<div className="row justify-content-center text-center">
				<div className="col-md m-2">
					<Todo
						color=""
						title="Sin asignar"
						tasks={filterTasksByState('Unassigned')}
						status="Unassigned"
						refreshTasks={fetchTodos} // Pass the fetch function
					/>
				</div>
				<div className="col-md m-2">
					<Todo
						color="#ffe2dd"
						title="Sin iniciar"
						tasks={filterTasksByState('Not started')}
						status="Not started"
						refreshTasks={fetchTodos} // Pass the fetch function
					/>
				</div>
				<div className="col-md m-2">
					<Todo
						color="#fdecc8"
						title="En proceso"
						tasks={filterTasksByState('In process')}
						status="In process"
						refreshTasks={fetchTodos} // Pass the fetch function
					/>
				</div>
				<div className="col-md m-2">
					<Todo
						color="#dbeddb"
						title="Terminada"
						tasks={filterTasksByState('Completed')}
						status="Completed"
						refreshTasks={fetchTodos} // Pass the fetch function
					/>
				</div>
			</div>
		</div>
	)
}

export default ToDoContainer
