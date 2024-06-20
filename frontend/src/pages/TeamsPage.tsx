import React, { useEffect, useState } from 'react'
import UserCard from '../components/cards/UserCard'
import ToDoContainer from '../components/toDo/TodoContainer'
import Chat from '../components/chat/Chat'
import Back from '../assets/Back'
import { useNavigate } from 'react-router-dom'
import { projectAuthStore, teamAuthStore, userAuthStore } from '../authStore'
import { apiGetData } from '../services/apiService'
import { toast } from 'sonner'
import {
	rabbitUnsubscribeChannel,
	client,
	rabbitSubscribeChannel,
} from '../services/rabbitMQService'
import { UserProps } from '../types/types'

const TeamsPage: React.FC = () => {
	// Página de equipos
	const navigate = useNavigate()
	const teamId = teamAuthStore.getState().team_id
	const token_user = userAuthStore.getState().token
	const token_project = projectAuthStore.getState().token
	const [sessionUsers, setSessionUsers] = useState<UserProps[]>([])

	const fetchTeamUsers = async () => {
		// Obtiene los usuarios del equipo
		try {
			const route = `/team/${teamId}/users?project_auth_key=${token_project}`
			const header = {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token_user}`,
			}
			const response = await apiGetData(route, header)

			if (response.ok) {
				// Si la respuesta es exitosa, muestra un mensaje de éxito y devuelve los datos
				setTimeout(async () => {
					toast.success('Usuarios obtenidos exitosamente.')
				}, 700)
				const data = await response.json()
				setSessionUsers(data)
				return data
			} else {
				toast.error('Error al obtener los usuarios.')
			}
		} catch (e) {
			console.error('Error:', e)
		}
	}

	const onMessageReceived = async (body: string) => {
		// Cuando se recibe un mensaje, actualiza el estado de los usuarios
		const messageObject = JSON.parse(body)
		const newUser: UserProps = {
			app_user_name: messageObject.app_user_name,
			app_user_email: messageObject.app_user_email,
			app_user_id: messageObject.app_user_id,
			user_status: messageObject.user_status,
		}
		if (newUser.user_status == 'connected') {
			// Si el usuario está conectado, añádelo a la lista de usuarios
			setSessionUsers((prevUsers) => [...prevUsers, newUser])
		} else if (newUser.user_status == 'disconnected') {
			// Si el usuario está desconectado, elimínalo de la lista de usuarios
			setSessionUsers((prevUsers) =>
				prevUsers.filter((user) => user.app_user_id !== newUser.app_user_id)
			)
		}
	}

	useEffect(() => {
		// Obtiene los usuarios del equipo y se suscribe al canal de mensajes
		fetchTeamUsers()
		rabbitSubscribeChannel('users_team_' + teamId, onMessageReceived)

		return () => {
			if (client && client.connected) {
				rabbitUnsubscribeChannel('users_team_' + teamId)
			}
		}
	}, [])

	return (
		<div
			style={{
				display: 'flex',
				height: 'calc(100vh - 58px)',
				marginTop: '58px',
			}}>
			<div
				className="mt-2 m-2 d-flex flex-column"
				style={{
					flex: '0.7',
					overflowY: 'hidden',
					borderRight: '1px solid #e0e0e0',
				}}>
				<div className="d-flex align-items-center">
					<div className="m-2">
						<button className="btn p-0" onClick={() => navigate('/projects')}>
							<Back size="36" color="#000" />
						</button>
					</div>
					<div className="w-100 mt-2 mb-2 me-2 text-center">
						<span className=" p-0">Volver a la página de proyectos</span>
					</div>
				</div>
				<ul
					className="p-2 m-1 h-[calc(100vh-10px)]"
					style={{
						listStyle: 'none',
						padding: 0,
						flex: '1 1 auto',
						overflowY: 'auto',
					}}>
					{sessionUsers.map((user, index) => (
						<li className="mb-3" key={index}>
							<UserCard
								user_name={user.app_user_name}
								user_email={user.app_user_email}
								user_status={user.user_status}
								colorRow={index % 2 ? '#fff' : '#f4f9ff'}
							/>
						</li>
					))}
				</ul>
				<div className="m-1 text-center fs-2 mt-auto border-top pt-2">
					<span className="p-0 m-0">Team!</span>
				</div>
			</div>
			<div
				className="d-flex flex-column overflow-y-auto"
				style={{
					flex: '3',
				}}>
				<div className="px-2" style={{ flex: '1' }}>
					<ToDoContainer />
				</div>
				<div className="p-2 " style={{ flex: '1' }}>
					<Chat />
				</div>
			</div>
		</div>
	)
}

export default TeamsPage
