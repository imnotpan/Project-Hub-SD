import React, { useState, useEffect } from 'react'
import { toast, Toaster } from 'sonner'
import { projectAuthStore, teamAuthStore } from '../../authStore'
import Send from '../../assets/Send'
import {
	rabbitSubscribeChannel,
	rabbitUnsubscribeChannel,
	client,
} from '../../services/rabbitMQ'
import { MessageProps } from '../../types/types'
import MessageList from './MessageList'
import { createNewMessage, fetchMessages } from '../../services/messages'

const Chat: React.FC<{ type: string }> = ({ type }) => {
	// Componente para el chat
	const [messages, setMessages] = useState<MessageProps[]>([])
	const [hover, setHover] = useState(false)
	const [message, setMessage] = useState('')
	const { team_id } = teamAuthStore.getState()
	const { project_id } = projectAuthStore.getState()

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		// Envía el mensaje al backend
		e.preventDefault()
		if (!message) {
			toast.warning('Por favor, Escribe un mensaje.')
			return
		}
		e.currentTarget.reset()
		createNewMessage(message, setMessage, type)
	}

	const handleMessage = (e: React.ChangeEvent<HTMLInputElement>) => {
		// Actualiza el estado del mensaje
		setMessage(e.target.value)
	}

	const onMessageReceived = (body: string) => {
		try {
			const messageObject = JSON.parse(body)
			const newMessage: MessageProps = {
				app_user_name: messageObject.user_name,
				app_user_email: messageObject.user_email,
				message_content: messageObject.message_text,
				message_date: messageObject.message_date,
				message_id: messageObject.message_id,
			}
			setMessages((prevMessages) => [...prevMessages, newMessage])
		} catch (error) {
			console.error('Error al procesar el mensaje recibido:', error)
		}
	}

	useEffect(() => {
		const fetchAndSubscribe = async () => {
			try {
				await fetchMessages(setMessages, type)
				let channel = ''
				if (type === 'general') {
					channel = 'messages_general_' + project_id
				} else {
					channel = 'messages_team_' + team_id
				}
				await rabbitSubscribeChannel(channel, onMessageReceived)
			} catch (error) {
				console.error('Error al suscribirse al canal de RabbitMQ:', error)
			}
		}

		fetchAndSubscribe()

		return () => {
			if (client && client.connected) {
				const unsubscribeChannel =
					type === 'general'
						? 'messages_general_' + project_id
						: 'messages_team_' + team_id
				rabbitUnsubscribeChannel(unsubscribeChannel)
			}
		}
	}, [type, team_id, project_id])

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
