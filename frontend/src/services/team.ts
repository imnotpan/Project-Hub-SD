import { apiSendData } from './apiService'
import { toast } from 'sonner'
import { projectAuthStore, teamAuthStore } from '../authStore'
import { apiGetData } from './apiService'
import { getUserSession } from './login'
import { TeamsProps, UserMessageProps } from '../types/types'

export const fetchTeams = async () => {
	const { token_project } = projectAuthStore.getState()
	const { access_token } = getUserSession()

	try {
		const route = `/project/${token_project}/teams`
		const header = {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${access_token}`,
		}
		const response = await apiGetData(route, header)

		if (response.ok) {
			const data = await response.json()
			return data
		}
	} catch {
		toast.warning(
			'Error de red. Por favor, revisa tu conexión e intenta de nuevo.'
		)
	}
}

export const createTeam = async (
	tokenProject: string,
	teamData: {
		team_name: string
		team_description: string
		team_password: string
	},
	setNewTeamData: (data: {
		team_name: ''
		team_description: ''
		team_password: ''
	}) => void,
	tokenUser: string,
	setDataTeams: (data: TeamsProps[]) => void,
	setShowCreateTeamPopup: (value: boolean) => void
) => {
	if (!teamData.team_name || !teamData.team_description) {
		toast.warning('Por favor, completa todos los campos.')
		return
	}

	try {
		const route = `/team/create?project_auth_key=${tokenProject}&team_name=${teamData.team_name}&team_description=${teamData.team_description}&team_password=${teamData.team_password}`
		const header = {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${tokenUser}`,
		}
		const response = await apiSendData(route, header)

		if (response.ok) {
			toast.success('Equipo creado exitosamente.')
			setDataTeams(await fetchTeams())
			setShowCreateTeamPopup(false)
			setNewTeamData({
				team_name: '',
				team_description: '',
				team_password: '',
			})
		} else {
			toast.error('Error al crear el equipo.')
		}
	} catch {
		toast.warning(
			'Error de red. Por favor, revisa tu conexión e intenta de nuevo.'
		)
		return false
	}
}

export const fetchTeamUsers = async (
	setSessionUsers: React.Dispatch<React.SetStateAction<UserMessageProps[]>>
) => {
	const access_token = getUserSession()
	const { token_project } = projectAuthStore.getState()
	const { team_id } = teamAuthStore.getState()

	try {
		const route = `/team/${team_id}/users?project_auth_key=${token_project}`
		const header = {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${access_token}`,
		}
		const response = await apiGetData(route, header)

		if (response.ok) {
			const data = await response.json()
			setSessionUsers(data)
			toast.success('Usuarios obtenidos exitosamente.')
			return data
		} else {
			toast.error('Error al obtener los usuarios.')
		}
	} catch {
		toast.warning(
			'Error de red. Por favor, revisa tu conexión e intenta de nuevo.'
		)
	}
}

export const fetchJoinTeam = async (
	team_id: number,
	team_name: string,
	team_private: boolean,
	team_password: string,
	navigate: (path: string) => void,
	setShowTeam: (value: boolean) => void
) => {
	const { setTeamId, setTeamName } = teamAuthStore.getState()

	const { token_project } = projectAuthStore.getState()
	const { access_token } = getUserSession()

	if (team_private && !team_password) {
		toast.warning('Por favor, completa todos los campos.')
		return
	}

	try {
		const route = `/team/join?team_id=${team_id}&team_password=${team_password}&project_auth_key=${token_project}`
		const header = {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${access_token}`,
		}

		const response = await apiSendData(route, header)

		if (response.ok) {
			setTeamId(team_id)
			setTeamName(team_name)
			toast.success('¡Credenciales exitosas!')
			setShowTeam(false) // Cerrar el formulario después del éxito
			setTimeout(() => {
				navigate('/teams')
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
