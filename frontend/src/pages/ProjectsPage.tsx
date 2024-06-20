import React, { useEffect, useState } from 'react'
import Chat from '../components/chat/Chat'
import TeamCard from '../components/cards/TeamCard'
import ChartsContainer from '../components/charts/ChartsContainer'
import Back from '../assets/Back'
import { useNavigate } from 'react-router-dom'
import { projectAuthStore, userAuthStore } from '../authStore'
import { toast } from 'sonner'
import { apiSendData } from '../services/apiService'
import { TeamsCardProps } from '../types/types'
import { fetchTeams } from '../services/teamServices'

const ProjectPage: React.FC = () => {
	const [dataTeams, setDataTeams] = useState<TeamsCardProps[]>([])
	const token_project = projectAuthStore.getState().token
	const token_user = userAuthStore.getState().token
	const [newTeamData, setNewTeamData] = useState({
		team_name: '',
		team_description: '',
		team_password: '',
	})
	const [showCreateTeamPopup, setShowCreateTeamPopup] = useState(false)

	const navigate = useNavigate()

	useEffect(() => {
		const setTeamsList = async () => {
			setDataTeams(await fetchTeams())
		}
		setTeamsList()
	}, [])

	const createNewTeam = async (e: { preventDefault: () => void }) => {
		e.preventDefault()
		if (!newTeamData.team_name || !newTeamData.team_description) {
			toast.warning('Por favor, completa todos los campos.')
			return
		}
		console.log(newTeamData.team_name)

		try {
			const route = `/team/create?project_auth_key=${token_project}&team_name=${newTeamData.team_name}&team_description=${newTeamData.team_description}&team_password=${newTeamData.team_password}`
			const header = {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token_user}`,
			}
			const response = await apiSendData(route, header)
			if (response.ok) {
				toast.success('Equipo creado exitosamente.')
				setDataTeams(await fetchTeams())
				setShowCreateTeamPopup(false)
			} else {
				toast.error('Error al crear el equipo.')
			}
		} catch (error) {
			console.error('Error:', error)
		}
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
					<button
						type="button"
						className="btn text-white w-100 me-2"
						style={{ backgroundColor: '#202020' }}
						onClick={() => setShowCreateTeamPopup(true)}>
						Crear equipo
					</button>
				</div>
				<ul
					className="m-2 mt-2 p-0 overflow-y-auto"
					style={{
						maxHeight: 'calc(100vh - 190px)',
						flex: '1 1 auto',
					}}>
					{dataTeams.map((team: TeamsCardProps, index: number) => (
						<TeamCard team={team} colorRow={index % 2 ? '#fff' : '#f4f9ff'} />
					))}
				</ul>
				<div className=" m-1 text-center fs-2 mt-auto">
					<span>Project!</span>
				</div>
			</div>

			{showCreateTeamPopup && (
				<div className="position-fixed top-0 start-0 h-100 w-100 d-flex justify-content-center align-items-center">
					<div
						className="bg-white rounded-2 p-1"
						style={{
							width: '25vw',
							height: '40vh',
							display: 'flex',
							flexDirection: 'column',
						}}>
						<div
							className="rounded-2 p-4"
							style={{
								flex: '1 1 auto',
								display: 'flex',
								flexDirection: 'column',
								justifyContent: 'space-between',
							}}>
							<div className="text-center">
								<h2 className="font-inter" style={{ fontSize: '2rem' }}>
									¡Crear equipo!
								</h2>
								<p
									className="fw-bold text-uppercase text-center pt-1"
									style={{ fontSize: '1.1rem' }}></p>
							</div>
							<form onSubmit={createNewTeam}>
								<div className="mb-3 d-flex">
									<input
										type="text"
										name="team_name"
										className="form-control"
										placeholder="Nombre del equipo"
										style={{
											backgroundColor: '#f8f8f8',
											borderColor: 'white',
										}}
										value={newTeamData.team_name}
										onChange={(e) =>
											setNewTeamData({
												...newTeamData,
												team_name: e.target.value,
											})
										}
									/>
								</div>
								<div className="mb-3">
									<input
										type="password"
										name="password"
										className="form-control"
										placeholder="Contraseña"
										value={newTeamData.team_password}
										onChange={(e) =>
											setNewTeamData({
												...newTeamData,
												team_password: e.target.value,
											})
										}
										style={{
											backgroundColor: '#f8f8f8',
											borderColor: 'white',
										}}
									/>
								</div>
								<div className="mb-3">
									<textarea
										placeholder="Descripcion"
										style={{ backgroundColor: '#f8f8f8', borderColor: 'white' }}
										value={newTeamData.team_description}
										onChange={(e) =>
											setNewTeamData({
												...newTeamData,
												team_description: e.target.value,
											})
										}
										className="form-control"
										name="project_description"
									/>
								</div>
								<div className="d-flex">
									<button
										type="submit"
										className="btn text-white w-100 me-2"
										style={{ backgroundColor: '#202020' }}>
										Crear
									</button>
									<button
										className="btn text-white w-100"
										style={{ backgroundColor: '#202020' }}
										onClick={() => {
											setShowCreateTeamPopup(false)
										}}>
										Cancelar
									</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			)}
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

export default ProjectPage
