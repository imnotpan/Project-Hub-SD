import { toast } from 'sonner'
import { projectAuthStore, userAuthStore } from '../authStore'
import { apiGetData } from './apiService'

export const fetchTeams = async () => {
	const token_project = projectAuthStore.getState().token
	const token_user = userAuthStore.getState().token
	try {
		const route = `/project/${token_project}/teams`
		const header = {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token_user}`,
		}
		const response = await apiGetData(route, header)

		if (response.ok) {
			setTimeout(async () => {
				toast.success('Equipos obtenidos exitosamente.')
			}, 900)
			const data = await response.json()
			return data
		} else {
			toast.error('Error al obtener los equipos.')
		}
	} catch (e) {
		console.error('Error:', e)
	}
}
