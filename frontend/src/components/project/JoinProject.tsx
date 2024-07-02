import { useState } from 'react'
import Back from '../../assets/Back'
import { useNavigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import { fetchJoinProject } from '../../services/project'

const JoinProject: React.FC<{ onReturn: () => void }> = ({ onReturn }) => {
	const navigate = useNavigate()
	const [joinProjectData, setJoinProjectData] = useState({
		project_id: '',
		project_password: '',
	})

	const handleJoinProjectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setJoinProjectData({
			...joinProjectData,
			[e.target.name]: e.target.value,
		})
	}

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		fetchJoinProject(
			joinProjectData.project_id,
			joinProjectData.project_password,
			navigate
		)
	}

	return (
		<div className="d-flex justify-content-center align-items-center w-100 vh-100 div-register">
			<div
				className="card p-4 border-0 "
				style={{
					maxWidth: '400px',
					width: '100%',
					boxShadow: '-10px 10px 15px -3px rgba(0, 0, 0, 0.1) ',
				}}>
				<div className="d-flex justify-content-between align-items-center m-auto mb-4"></div>
				<div className="text-left mb-2">
					<div className="d-flex align-items-center  ">
						<button className="btn p-0 me-1" onClick={onReturn}>
							<Back size="36" color="#000" />
						</button>
						<h2 className="font-inter m-0" style={{ fontSize: '1.7rem' }}>
							¡Unete a un proyecto!
						</h2>
					</div>
					<p className="text-secondary pt-1" style={{ fontSize: '1.1rem' }}>
						Ingresa los datos para unirte a un proyecto
					</p>
				</div>
				<form onSubmit={handleSubmit}>
					<div className="mb-3">
						<input
							onChange={handleJoinProjectChange}
							placeholder="ID del proyecto"
							style={{ backgroundColor: '#f8f8f8', borderColor: 'white' }}
							type="text"
							name="project_id"
							className="form-control"
						/>
					</div>
					<div className="mb-3">
						<input
							placeholder="Contraseña"
							style={{ backgroundColor: '#f8f8f8', borderColor: 'white' }}
							onChange={handleJoinProjectChange}
							type="password"
							name="project_password"
							className="form-control"
						/>
					</div>
					<div style={{ width: '100%' }}>
						<button
							type="submit"
							className="btn text-white w-100"
							style={{ backgroundColor: '#202020' }}>
							Unirse al proyecto
						</button>
					</div>
				</form>
				<div style={{ width: '100%' }}>
					<Toaster richColors />
				</div>
			</div>
		</div>
	)
}

export default JoinProject
