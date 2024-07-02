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
	difficutly?: string
) => {
	const { access_token } = getUserSession()
	const { token_project } = projectAuthStore.getState()
	const { team_id } = teamAuthStore.getState()

	try {
		const route = `/tasks/update?project_auth_key=${token_project}&team_id=${team_id}&task_id=${task_id}&task_name=${name}&task_description=${description}&task_end_date=${endDate}&task_deadline_date=${deadLineDate}&task_state=${status}&task_difficult=${difficutly}`

		const header = {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${access_token}`,
		}

		const response = await apiPatchData(route, header)

		if (response.ok) {
			refreshTasks()
			toast.success('Tarea actualizada exitosamente.')
		} else {
			toast.warning('Error al actualizar la tarea.')
		}
	} catch (e) {
		toast.warning(
			'Error de red. Por favor, revisa tu conexión e intenta de nuevo.'
		)
	}
}
