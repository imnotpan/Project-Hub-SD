import React, { useState, useEffect } from 'react'
import { toast, Toaster } from 'sonner'
import { apiGetData, apiSendData } from '../../services/apiService'
import { projectAuthStore, teamAuthStore, userAuthStore } from '../../authStore'
import Send from '../../assets/Send'
import {
	rabbitSubscribeChannel,
	rabbitUnsubscribeChannel,
	client,
} from '../../services/rabbitMQService'
import { MessageProps } from '../../types/types'
import MessageList from './MessageList'

const Chat: React.FC = () => {
	// Componente para el chat
	const [messages, setMessages] = useState<MessageProps[]>([])
	const [hover, setHover] = useState(false)
	const [message, setMessage] = useState('')
	const teamId = teamAuthStore.getState().team_id
	const token_project = projectAuthStore.getState().token
	const token_user = userAuthStore.getState().token

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		// Envía el mensaje al backend
		e.preventDefault()
		if (!message) {
			toast.warning('Por favor, Escribe un mensaje.')
			return
		}
		e.currentTarget.reset()
		createNewMessage()
	}
	const handleMessage = (e: React.ChangeEvent<HTMLInputElement>) => {
		// Actualiza el estado del mensaje
		setMessage(e.target.value)
	}

	const fetchMessages = async () => {
		// Función para obtener los mensajes del equipo desde la base de datos
		const teamId = teamAuthStore.getState().team_id
		const token_project = projectAuthStore.getState().token
		const token_user = userAuthStore.getState().token

		try {
			const route = `/team/${teamId}/messages?project_auth_key=${token_project}`

			const header = {
				Authorization: `Bearer ${token_user}`,
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
		} catch (e) {
			toast.warning(
				'Error de red. Por favor, revisa tu conexión e intenta de nuevo.'
			)
		}
	}

	const onMessageReceived = async (body: string) => {
		// Función que maneja cuando se recibe un mensaje
		const messageObject = JSON.parse(body)
		const newMessage: MessageProps = {
			app_user_name: messageObject.user_name,
			app_user_email: messageObject.user_email,
			message_content: messageObject.message_text,
			message_date: messageObject.message_date,
			message_id: messageObject.message_id,
		}
		setMessages((prevMessages) => [...prevMessages, newMessage])
	}

	const createNewMessage = async () => {
		// Función para crear un nuevo mensaje y enviarlo al backend
		try {
			const route = `/message/send/team?project_auth_key=${token_project}&team_id=${teamId}&message_content=${message}`
			const header = {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token_user}`,
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

	useEffect(() => {
		//  Obtiene los mensajes del equipo y suscribe al canal de mensajes del equipo
		fetchMessages()
		rabbitSubscribeChannel('messages_team_' + teamId, onMessageReceived)

		return () => {
			if (client && client.connected) {
				rabbitUnsubscribeChannel('messages_team_' + teamId)
			}
		}
	}, [])

	return (
		<div>
			<div
				style={{
					height: '36vh',
					overflowY: 'auto',
					overflowX: 'hidden',
				}}>
				<div className="d-flex m-4">
					<div className="align-content-center w-100">
						<MessageList messages={messages} />
					</div>
				</div>
			</div>
			<form onSubmit={handleSubmit} className="d-flex ps-3 pe-2 pt-4">
				<input
					className="form-control me-2"
					style={{ backgroundColor: '#f8f8f8', borderColor: 'white' }}
					type="text"
					onChange={handleMessage}
					placeholder="Ingresa tu mensaje!"
				/>
				<button
					className="bg-transparent border-0"
					type="submit"
					onMouseOver={(e) => (
						(e.currentTarget.style.transform = 'scale(1.1)'),
						setHover(true),
						(e.currentTarget.style.transform = 'scale(-1.1)')
					)}
					onMouseOut={(e) => (
						(e.currentTarget.style.transform = 'scale(1)'), setHover(false)
					)}>
					<Send size="40" color={hover ? '#74bff6' : '#333'} />
				</button>
			</form>
			<Toaster richColors />
		</div>
	)
}

export default Chat
