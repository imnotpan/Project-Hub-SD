import { useState } from 'react'
import Back from '../../assets/Back'
import { projectAuthStore, userAuthStore } from '../../authStore'
import { useNavigate } from 'react-router-dom'
import { toast, Toaster } from 'sonner'
import { apiSendData } from '../../services/apiService'

const JoinProject: React.FC<{ onReturn: () => void }> = ({ onReturn }) => {
	const setToken = projectAuthStore((state) => state.setToken) // Obtén el método setToken del store
	const setTokenType = projectAuthStore((state) => state.setTokenType) // Obtén el método setUserType del store
	const setProjectName = projectAuthStore((state) => state.setProjectName) // Obtén el método setProjectName del store
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
		if (!joinProjectData.project_id || !joinProjectData.project_password) {
			toast.warning('Por favor, completa todos los campos.')
			return
		}
		try {
			const route = `/project/auth?project_id=${joinProjectData.project_id}&project_password=${joinProjectData.project_password}`
			const header = {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${userAuthStore.getState().token}`,
			}
			const response = await apiSendData(route, header)
			const data = await response.json() // Parsear la respuesta JSON
			if (response.ok) {
				setToken(data.access_token) // Almacena el token en el store
				setTokenType(data.token_type) // Almacena el tipo de token en el store
				setProjectName(data.project_name) // Almacena el nombre del proyecto en el store
				toast.success('Credenciales exitosas!.')

				setTimeout(() => {
					navigate('/projects')
				}, 500)
			} else {
				toast.error('Credenciales inválidas. Por favor, intenta de nuevo.')
			}
		} catch (e) {
			toast.warning(
				'Error de red. Por favor, revisa tu conexión e intenta de nuevo.'
			)
		}
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
