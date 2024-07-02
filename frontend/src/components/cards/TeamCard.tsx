import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Avatar from 'react-avatar'
import { TeamsCardProps } from '../../types/types'
import { fetchJoinTeam } from '../../services/team'

const TeamsCard: React.FC<TeamsCardProps> = ({ team, colorRow }) => {
	const [showTeam, setShowTeam] = useState(false)
	const [hover, setHover] = useState(false)

	const [dataTeam, setDataTeam] = useState({
		team_id: team.team_id.toString(),
		password: '',
	})

	const navigate = useNavigate()

	const handleLoginTeamChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setDataTeam({
			...dataTeam,
			[e.target.name]: e.target.value,
		})
	}

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		fetchJoinTeam(
			team.team_id,
			team.team_name,
			team.team_private,
			dataTeam.password,
			navigate,
			setShowTeam
		)
	}

	return (
		<div
			className="position-relative"
			style={{ backgroundColor: colorRow }}
			onMouseOver={(e) => {
				e.currentTarget.style.backgroundColor = '#dde8ff'
				setHover(true)
			}}
			onMouseOut={(e) => {
				e.currentTarget.style.backgroundColor = colorRow
				setHover(false)
			}}>
			<div onClick={() => setShowTeam(true)} style={{ cursor: 'pointer' }}>
				<div className="card-body d-flex align-items-center p-2">
					<div
						className="me-2"
						style={{ transform: hover ? 'scale(1.1)' : 'scale(1)' }}>
						<Avatar name={team.team_name} size="46" round={true} />
					</div>
					<div className="mx-2">
						<p className="fw-bold m-0 p-0">{team.team_name}</p>
						<p className="m-0 p-0 d-none d-md-table-cell">
							{team.team_description.length < 41
								? team.team_description
								: team.team_description.slice(0, 47) + '...'}
						</p>
					</div>
				</div>
			</div>
			{showTeam && (
				<div
					className="d-flex justify-content-center align-items-center position-fixed mt-5"
					style={{
						top: 0,
						left: 0,
						width: '100%',
						height: 'calc(100vh - 46px)',
						backgroundColor: 'rgba(255, 255, 255, 0.9)',
						zIndex: 9999,
					}}>
					<div
						className="bg-white rounded-2 p-1 mb-5"
						style={{
							width: '80%',
							maxWidth: '400px',
							height: 'auto',
							maxHeight: '90%',
							display: 'flex',
							flexDirection: 'column',
							boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
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
									¡Ingresa al equipo!
								</h2>
								<p
									className="fw-bold text-uppercase text-center pt-1"
									style={{ fontSize: '1.1rem' }}>
									{team.team_name}
								</p>
							</div>

							<form onSubmit={handleSubmit}>
								<div className="mb-3 d-flex">
									<label className="form-label w-50 align-content-center align-items-center">
										ID team:
									</label>
									<input
										type="text"
										name="team_id"
										className="form-control"
										value={team.team_id}
										style={{ backgroundColor: '#f8f8f8', borderColor: 'white' }}
										disabled
									/>
								</div>
								<div className="mb-3">
									<label className="form-label w-50 align-content-center align-items-center">
										Descripción:
									</label>
									<input
										type="text"
										name="description"
										className="form-control"
										value={team.team_description}
										onChange={handleLoginTeamChange}
										style={{
											backgroundColor: '#f8f8f8',
											borderColor: 'white',
										}}
										disabled
									/>
								</div>

								{team.team_private && (
									<div className="mb-3">
										<input
											type="password"
											name="password"
											className="form-control"
											placeholder="Contraseña"
											onChange={handleLoginTeamChange}
											style={{
												backgroundColor: '#f8f8f8',
												borderColor: 'white',
											}}
										/>
									</div>
								)}
								<div className="d-flex mt-3">
									<div className="w-50 me-2">
										<button
											type="submit"
											className="btn text-white w-100"
											style={{ backgroundColor: '#202020' }}>
											Confirmar
										</button>
									</div>
									<div className="w-50">
										<button
											type="button"
											className="btn text-white w-100"
											style={{ backgroundColor: '#202020' }}
											onClick={() => setShowTeam(false)}>
											Cancelar
										</button>
									</div>
								</div>
							</form>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}

export default TeamsCard
