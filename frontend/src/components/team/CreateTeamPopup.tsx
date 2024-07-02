import React from 'react'
import { CreateTeamPopupProps } from '../../types/types'

const CreateTeamPopup: React.FC<CreateTeamPopupProps> = ({
	createNewTeam,
	newTeamData,
	setNewTeamData,
	setShowCreateTeamPopup,
}) => {
	return (
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
									setNewTeamData({
										team_name: '',
										team_description: '',
										team_password: '',
									})
								}}>
								Cancelar
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	)
}

export default CreateTeamPopup
