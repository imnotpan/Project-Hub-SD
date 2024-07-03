import React, { useEffect, useState } from 'react'
import UserCard from '../components/cards/UserCard'
import ToDoContainer from '../components/toDo/TodoContainer'
import Chat from '../components/chat/Chat'
import Back from '../assets/Back'
import { useNavigate } from 'react-router-dom'
import { teamAuthStore } from '../authStore'
import { UserMessageProps } from '../types/types'
import {
	subscribeToUserMessages,
	unsubscribeFromUserMessages,
} from '../services/messages'
import { fetchTeamUsers } from '../services/team'

const TeamsPage: React.FC = () => {
	// Página de equipos
	const navigate = useNavigate()
	const [sessionUsers, setSessionUsers] = useState<UserMessageProps[]>([])
	const team_name = teamAuthStore.getState().team_name

	const onMessageReceived = async (body: string) => {
		// Cuando se recibe un mensaje, actualiza el estado de los usuarios
		const messageObject = JSON.parse(body)
		const newUser: UserMessageProps = {
			app_user_name: messageObject.app_user_name,
			app_user_email: messageObject.app_user_email,
			app_user_id: messageObject.app_user_id,
			user_status: messageObject.user_status,
		}
		if (newUser.user_status === 'connected') {
			// Si el usuario está conectado, añádelo a la lista de usuarios
			setSessionUsers((prevUsers) => [...prevUsers, newUser])
		} else if (newUser.user_status === 'disconnected') {
			// Si el usuario está desconectado, elimínalo de la lista de usuarios
			setSessionUsers((prevUsers) =>
				prevUsers.filter((user) => user.app_user_id !== newUser.app_user_id)
			)
		}
	}

	useEffect(() => {
		// Obtiene los usuarios del equipo y se suscribe al canal de mensajes
		fetchTeamUsers(setSessionUsers)
		subscribeToUserMessages(onMessageReceived)

		return () => {
			unsubscribeFromUserMessages()
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
						<span className="fw-bold p-0">Volver a la página de proyectos</span>
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
								app_user_email={user.app_user_name}
								app_user_name={user.app_user_email}
								user_status={user.user_status}
								colorRow={index % 2 ? '#fff' : '#f4f9ff'}
							/>
						</li>
					))}
				</ul>
				<footer className="d-flex border-top me-2 p-2  align-items-center">
					<strong className="fs-5 me-2">Team:</strong>
					<strong className="fs-5 text-primary"> {team_name}</strong>
				</footer>
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
