import { toast } from 'sonner'
import { apiGetData, apiSendData } from './apiService'
import { projectAuthStore } from '../authStore'
import { getUserSession } from './login'
import { ProjectCardProps } from '../types/types'

export const fetchCreateProject = async (
	project_name: string,
	project_password: string,
	project_description: string,
	setIdProject: (id: string) => void
) => {
	const { setProjectName } = projectAuthStore.getState() // Obtén el método setProjectName del store
	const { access_token } = getUserSession()

	if (!project_name || !project_password || !project_description) {
		toast.warning('Por favor, completa todos los campos.')
		return
	}

	try {
		// Intenta crear el proyecto
		const route = `/project/create?project_name=${project_name}&project_password=${project_password}&project_description=${project_description}`
		const header = {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${access_token}`,
		}
		const response = await apiSendData(route, header)
		const data = await response.json()
		if (response.ok) {
			// Si la respuesta es exitosa, almacena el id del proyecto
			setIdProject(data.project_id)
			setProjectName(project_name)
		} else {
			toast.error('Error al crear el proyecto. Por favor, intenta de nuevo.')
		}
	} catch (e) {
		toast.warning(
			'Error de red. Por favor, revisa tu conexión e intenta de nuevo.'
		)
	}
}

export const fetchJoinProject = async (
	idProject: string,
	project_password: string,
	navigate: (path: string) => void
) => {
	const { access_token } = getUserSession()
	const { setToken, setProjectName, setOwner } = projectAuthStore.getState()

	// Hace fetch para unirse al proyecto
	try {
		const route = `/project/auth?project_id=${idProject}&project_password=${project_password}`
		const header = {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${access_token}`,
		}
		const response = await apiSendData(route, header)
		const data = await response.json() // Parsear la respuesta JSON
		if (response.ok) {
			setToken(data.access_token)
			setOwner(data.owner)
			setProjectName(data.project_name)
			toast.success('Credenciales exitosas!.')
			setTimeout(() => {
				navigate('/projects')
			}, 500)
		} else {
			toast.error('Credenciales inválidas. Por favor, intenta de nuevo.')
		}
	} catch (e) {
		toast.warning(
			'Error de red. Por favor, revisa tu conexión e intenta de nuevo.'
		)
	}
}

export const fetchProjects = async (
	setDataProjects: (data: ProjectCardProps[]) => void
) => {
	const { access_token } = getUserSession()

	try {
		const route = `/user/projects`
		const header = {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${access_token}`,
		}
		const response = await apiGetData(route, header)
		if (response.ok) {
			const data = await response.json()
			setDataProjects(data)
		}
	} catch {
		toast.warning(
			'Error de red. Por favor, revisa tu conexión e intenta de nuevo.'
		)
	}
}
