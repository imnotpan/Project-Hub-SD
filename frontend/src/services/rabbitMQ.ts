import { Client, IMessage, StompSubscription } from '@stomp/stompjs'

import { getUserSession } from './login'

const wsUrl = `ws://${import.meta.env.VITE_BROKER_URL}/ws` // URL del servidor de RabbitMQ

const client = new Client({
	// Define el cliente de RabbitMQ
	brokerURL: wsUrl,
	connectHeaders: {
		login: import.meta.env.VITE_RABBITMQ_LOGIN,
		passcode: import.meta.env.VITE_RABBITMQ_PASSCODE,
	},
	heartbeatIncoming: 5000,
	heartbeatOutgoing: 5000,
})

const subscriptions: { [key: string]: StompSubscription } = {} // Almacena las suscripciones
const { user_email } = getUserSession() ? getUserSession() : { user_email: '' }

client.onConnect = () => {
	console.log('Connected to RabbitMQ broker')
}

client.onStompError = (frame) => {
	console.error('Broker reported error:', frame.headers['message'])
	console.error('Additional details:', frame.body)
}

client.activate()

const rabbitSubscribeChannel = async (
	// Función para suscribirse a un canal de RabbitMQ
	brokerChannel: string,
	onMessageReceived: (message: string) => void
) => {
	const uniqueId = `sub-${brokerChannel}-${user_email}` // Identificador único de la suscripción

	if (!subscriptions[uniqueId]) {
		// Si la id no se encuentra en las suscripciones, lo suscribe al canal
		const subscription = client.subscribe(
			'/queue/' + brokerChannel,
			(message: IMessage) => {
				if (message.body) {
					onMessageReceived(message.body)
				} else {
					console.log('Received empty message')
				}
			},
			{
				id: uniqueId,
			}
		)
		subscriptions[uniqueId] = subscription
		console.log('Subscribed to channel:', brokerChannel)
	} else {
		// Si ya está suscrito, muestra un mensaje en consola
		console.log('Already subscribed to channel:', brokerChannel)
	}
}

const rabbitUnsubscribeChannel = async (brokerChannel: string) => {
	// Función para cancelar la suscripción a un canal de RabbitMQ
	const uniqueId = `sub-${brokerChannel}-${user_email}`
	if (subscriptions[uniqueId]) {
		subscriptions[uniqueId].unsubscribe()
		delete subscriptions[uniqueId]
		console.log('Unsubscribed from channel:', brokerChannel)
	} else {
		console.log(
			'No active subscription to unsubscribe from channel:',
			brokerChannel
		)
	}
}

export { rabbitSubscribeChannel, rabbitUnsubscribeChannel, client }
