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
	onMessageReceived: (body: string) => void,
	type: string
) => {
	const { team_id } = teamAuthStore.getState()
	const { project_id } = projectAuthStore.getState()

	const brokerChannel =
		type == 'general' ? 'users_general_' + project_id : 'users_team_' + team_id

	if (client.connected) {
		rabbitSubscribeChannel(brokerChannel, onMessageReceived)
	} else {
		client.onConnect = () => {
			rabbitSubscribeChannel(brokerChannel, onMessageReceived)
		}
	}
}

export const unsubscribeFromUserMessages = (type: string) => {
	const { team_id } = teamAuthStore.getState()
	const { project_id } = projectAuthStore.getState()

	const brokerChannel =
		type == 'general' ? 'users_general_' + project_id : 'users_team_' + team_id

	rabbitUnsubscribeChannel(brokerChannel)
}

export const fetchMessages = async (
	setMessages: (data: MessageProps[]) => void,
	type: string
) => {
	const { access_token } = getUserSession()
	const { team_id } = teamAuthStore.getState()
	const { token_project } = projectAuthStore.getState()

	try {
		let route = ''
		if (type === 'general') {
			route = `/project/get/messages?project_auth_key=${token_project}`
		} else {
			route = `/team/${team_id}/messages?project_auth_key=${token_project}`
		}

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

export const createNewMessage = async (message: string, type: string) => {
	const { access_token } = getUserSession()
	const { team_id } = teamAuthStore.getState()
	const { token_project } = projectAuthStore.getState()

	try {
		let route = ''
		if (type === 'general') {
			route = `/message/send/general?project_auth_key=${token_project}&message_content=${message}`
		} else {
			route = `/message/send/team?project_auth_key=${token_project}&team_id=${team_id}&message_content=${message}`
		}
		const header = {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${access_token}`,
		}
		const response = await apiSendData(route, header)
		if (response.ok) {
			toast.success('Mensaje enviado correctamente.')
		} else {
			toast.error('Error al enviar mensaje.')
		}
	} catch {
		toast.warning(
			'Error de red. Por favor, revisa tu conexión e intenta de nuevo.'
		)
	}
}
