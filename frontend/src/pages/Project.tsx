import React, { useEffect, useState } from 'react'
import Chat from '../components/chat/Chat'
import TeamCard from '../components/cards/TeamCard'
import ChartsContainer from '../components/charts/ChartsContainer'
import Back from '../assets/Back'
import { useNavigate } from 'react-router-dom'
import { projectAuthStore } from '../authStore'
import { TeamsProps } from '../types/types'
import { createTeam, fetchTeams } from '../services/team'
import { getUserSession } from '../services/login'
import CreateTeamPopup from '../components/team/CreateTeamPopup'
import UserList from '../components/project/UserList'

const Project: React.FC = () => {
	const [dataTeams, setDataTeams] = useState<TeamsProps[]>([])
	const [showCreateTeamPopup, setShowCreateTeamPopup] = useState(false)
	const [showUserList, setShowUserList] = useState(false)
	const { token_project, project_name, owner } = projectAuthStore.getState()
	const { access_token } = getUserSession()
	const navigate = useNavigate()

	const [newTeamData, setNewTeamData] = useState({
		team_name: '',
		team_description: '',
		team_password: '',
	})

	useEffect(() => {
		const setTeamsList = async () => {
			const teams = await fetchTeams()
			if (teams) setDataTeams(teams)
		}

		setTeamsList()
	}, [])

	const createNewTeam = (e: React.FormEvent) => {
		e.preventDefault()
		createTeam(
			token_project,
			newTeamData,
			setNewTeamData,
			access_token,
			setDataTeams,
			setShowCreateTeamPopup
		)
	}

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
						<button
							className="btn p-0"
							onClick={() => navigate('/project-options')}>
							<Back size="36" color="#000" />
						</button>
					</div>
					<div className="w-100 mt-2 mb-2 me-2 text-center">
						<span className=" p-0">Volver a la página de opciones</span>
					</div>
				</div>
				<div className="d-flex my-2">
					{owner && (
						<>
							<button
								type="button"
								className="btn text-white w-100 me-2"
								style={{ backgroundColor: '#202020' }}
								onClick={() => setShowCreateTeamPopup(true)}>
								Crear equipo
							</button>
							<button
								type="button"
								className="btn text-white w-100 me-2"
								style={{ backgroundColor: '#202020' }}
								onClick={() => setShowUserList(true)}>
								Lista de usuarios
							</button>
						</>
					)}
				</div>
				<ul
					className="m-2 mt-2 p-0 overflow-y-auto"
					style={{
						maxHeight: 'calc(100vh - 190px)',
						flex: '1 1 auto',
					}}>
					{dataTeams.map((team: TeamsProps, index: number) => (
						<TeamCard
							key={team.team_id}
							team={team}
							colorRow={index % 2 ? '#fff' : '#f4f9ff'}
						/>
					))}
				</ul>
				<footer className="d-flex border-top me-2 p-2  align-items-center">
					<strong className="fs-5 me-2">Proyecto:</strong>
					<strong className="fs-5 text-primary"> {project_name}</strong>
				</footer>
			</div>

			{showCreateTeamPopup && (
				<CreateTeamPopup
					createNewTeam={createNewTeam}
					newTeamData={newTeamData}
					setNewTeamData={setNewTeamData}
					setShowCreateTeamPopup={setShowCreateTeamPopup}
				/>
			)}
			{showUserList && <UserList showList={setShowUserList} />}
			<div
				className="d-flex flex-column w-100 h-100 overflow-y-auto"
				style={{
					flex: '3',
				}}>
				<div className="px-2 " style={{ flex: '1' }}>
					<ChartsContainer />
				</div>
				<div className="p-2  " style={{ flex: '1' }}>
					<Chat />
				</div>
			</div>
		</div>
	)
}

export default Project