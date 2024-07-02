import { projectAuthStore, teamAuthStore } from '../authStore'
import {
	client,
	rabbitSubscribeChannel,
	rabbitUnsubscribeChannel,
} from './rabbitMQ'
import { apiGetData, apiSendData } from './apiService'
import { getUserSession } from './login'
import { toast } from 'sonner'
import { MessageProps } from '../types/types'

export const subscribeToUserMessages = (
	onMessageReceived: (body: string) => void
) => {
	const { team_id } = teamAuthStore.getState()

	rabbitSubscribeChannel('users_team_' + team_id, onMessageReceived)
}

export const unsubscribeFromUserMessages = () => {
	const { team_id } = teamAuthStore.getState()

	if (client && client.connected) {
		rabbitUnsubscribeChannel('users_team_' + team_id)
	}
}

export const fetchMessages = async (
	setMessages: (data: MessageProps[]) => void
) => {
	// Función para obtener los mensajes del equipo desde la base de datos
	const { access_token } = getUserSession()
	const { team_id } = teamAuthStore.getState()
	const { token_project } = projectAuthStore.getState()

	try {
		const route = `/team/${team_id}/messages?project_auth_key=${token_project}`

		const header = {
			Authorization: `Bearer ${access_token}`,
			'Content-Type': 'application/json',
		}

		const response = await apiGetData(route, header)
		if (response.ok) {
			setTimeout(async () => {
				toast.success('Mensajes obtenidos exitosamente.')
			}, 0)
			const data = await response.json()
			setMessages(data)
		} else {
			toast.error('Error al obtener los mensajes.')
		}
	} catch {
		toast.warning(
			'Error de red. Por favor, revisa tu conexión e intenta de nuevo.'
		)
	}
}

export const createNewMessage = async (
	message: string,
	setMessage: (text: string) => void
) => {
	// Función para crear un nuevo mensaje y enviarlo al backend
	const { access_token } = getUserSession()
	const { team_id } = teamAuthStore.getState()
	const { token_project } = projectAuthStore.getState()

	try {
		const route = `/message/send/team?project_auth_key=${token_project}&team_id=${team_id}&message_content=${message}`
		const header = {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${access_token}`,
		}
		const response = await apiSendData(route, header)
		if (response.ok) {
			toast.success('Mensaje enviado correctamente.')
			setMessage('')
		} else {
			toast.error('Error al enviar mensaje.')
		}
	} catch {
		toast.warning(
			'Error de red. Por favor, revisa tu conexión e intenta de nuevo.'
		)
	}
}
