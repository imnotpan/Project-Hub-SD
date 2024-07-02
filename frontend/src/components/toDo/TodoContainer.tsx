import React, { useEffect, useState } from 'react'

import ToDo from './ToDo'
import { TodoType } from '../../types/types'
import { toast } from 'sonner'
import { apiGetData } from '../../services/apiService'
import { projectAuthStore, teamAuthStore } from '../../authStore'
import { getUserSession } from '../../services/login'

const ToDoContainer: React.FC = () => {
	const [dataToDo, setDataToDo] = useState<TodoType[]>([])
	const teamId = teamAuthStore.getState().team_id
	const { access_token } = getUserSession()
	const { token_project } = projectAuthStore.getState()

	const fetchTodos = async () => {
		try {
			const route = `/team/${teamId}/tasks?project_auth_key=${token_project}`
			const headers = {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${access_token}`,
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
	}, [teamId, token_project, access_token])

	const filterTasksByState = (state: string) =>
		dataToDo.filter((task) => task.task_state === state)

	return (
		<div className="container">
			<div className="row justify-content-center text-center">
				<div className="col-md m-2">
					<ToDo
						color=""
						title="Sin asignar"
						tasks={filterTasksByState('Unassigned')}
						status="Unassigned"
						refreshTasks={fetchTodos} // Pass the fetch function
					/>
				</div>
				<div className="col-md m-2">
					<ToDo
						color="#ffe2dd"
						title="Sin iniciar"
						tasks={filterTasksByState('Not started')}
						status="Not started"
						refreshTasks={fetchTodos} // Pass the fetch function
					/>
				</div>
				<div className="col-md m-2">
					<ToDo
						color="#fdecc8"
						title="En proceso"
						tasks={filterTasksByState('In process')}
						status="In process"
						refreshTasks={fetchTodos} // Pass the fetch function
					/>
				</div>
				<div className="col-md m-2">
					<ToDo
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
