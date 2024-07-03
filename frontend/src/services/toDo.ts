import { toast } from 'sonner'
import { projectAuthStore, teamAuthStore } from '../authStore'
import { apiPatchData } from './apiService'
import { getUserSession } from './login'

export const fetchAndUpdateTask = async (
	refreshTasks: () => void,
	task_id: number,
	name?: string,
	endDate?: string,
	deadLineDate?: string,
	status?: string,
	description?: string,
	difficulty?: string
) => {
	const { access_token } = getUserSession()
	const { token_project } = projectAuthStore.getState()
	const { team_id } = teamAuthStore.getState()

	try {
		// Construir los parámetros de consulta de manera dinámica
		const params = new URLSearchParams({
			project_auth_key: token_project,
			team_id: team_id ? team_id.toString() : '',
			task_id: task_id.toString(),
			...(name && { task_name: name }),
			...(description && { task_description: description }),
			...(endDate && { task_end_date: endDate }),
			...(deadLineDate && { task_deadline_date: deadLineDate }),
			...(status && { task_state: status }),
			...(difficulty && { task_difficult: difficulty }),
		}).toString()

		const route = `/tasks/update?${params}`

		const header = {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${access_token}`,
		}
		const response = await apiPatchData(route, header)

		if (response.ok) {
			refreshTasks()
		}
	} catch (e) {
		toast.warning(
			'Error de red. Por favor, revisa tu conexión e intenta de nuevo.'
		)
	}
}
