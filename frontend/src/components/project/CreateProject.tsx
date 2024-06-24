import { projectAuthStore, userAuthStore } from '../../authStore'
import Back from '../../assets/Back'
import { useEffect, useState } from 'react'
import { toast, Toaster } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { apiSendData } from '../../services/apiService'
// Componente para crear un proyecto
const CreateProject: React.FC<{ onReturn: () => void }> = ({ onReturn }) => {
	const navigate = useNavigate()
	const [idProject, setIdProject] = useState('')

	const setToken = projectAuthStore((state) => state.setToken) // Obtén el método setToken del store
	const setTokenType = projectAuthStore((state) => state.setTokenType) // Obtén el método setUserType del store
	const setProjectName = projectAuthStore((state) => state.setProjectName) // Obtén el método setProjectName del store

	const [createProjectData, setCreateProjectData] = useState({
		project_name: '',
		project_password: '',
		project_description: '',
	})

	const handleCreateDataChange = (
		// Función para manejar los cambios en los inputs
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target
		setCreateProjectData((prevState) => ({
			...prevState,
			[name]: value,
		}))
	}

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		// Función para manejar el envío del formulario
		e.preventDefault()

		if (
			!createProjectData.project_name ||
			!createProjectData.project_password ||
			!createProjectData.project_description
		) {
			toast.warning('Por favor, completa todos los campos.')
			return
		}

		try {
			// Intenta crear el proyecto
			const route = `/project/create?project_name=${createProjectData.project_name}&project_password=${createProjectData.project_password}&project_description=${createProjectData.project_description}`
			const header = {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${userAuthStore.getState().token}`,
			}
			const response = await apiSendData(route, header)
			const data = await response.json()
			if (response.ok) {
				// Si la respuesta es exitosa, almacena el id del proyecto
				setIdProject(data.project_id)
				setProjectName(createProjectData.project_name)
			} else {
				toast.error('Error al crear el proyecto. Por favor, intenta de nuevo.')
			}
		} catch (e) {
			toast.warning(
				'Error de red. Por favor, revisa tu conexión e intenta de nuevo.'
			)
		}
	}

	useEffect(() => {
		const fetchJoinProject = async () => {
			// Hace fetch para unirse al proyecto
			try {
				const route = `/project/auth?project_id=${idProject}&project_password=${createProjectData.project_password}`
				const header = {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${userAuthStore.getState().token}`,
				}
				const response = await apiSendData(route, header)
				const data = await response.json() // Parsear la respuesta JSON
				if (response.ok) {
					setToken(data.access_token) // Almacena el token en el store
					setTokenType(data.token_type) // Almacena el tipo de token en el store
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
		if (idProject) {
			fetchJoinProject() // Llama a la función para unirse al proyecto
		}
	}, [idProject])

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
						<h2 className="font-inter  m-0" style={{ fontSize: '1.7rem' }}>
							¡Crea un proyecto!
						</h2>
					</div>
					<p className="text-secondary pt-1" style={{ fontSize: '1.1rem' }}>
						Ingresa los datos para crear un proyecto
					</p>
				</div>
				<form onSubmit={handleSubmit}>
					<div className="mb-3">
						<input
							onChange={handleCreateDataChange}
							placeholder="Nombre del proyecto"
							style={{ backgroundColor: '#f8f8f8', borderColor: 'white' }}
							type="text"
							name="project_name"
							className="form-control"
						/>
					</div>
					<div className="mb-3">
						<input
							onChange={handleCreateDataChange}
							placeholder="Contraseña"
							style={{ backgroundColor: '#f8f8f8', borderColor: 'white' }}
							type="password"
							name="project_password"
							className="form-control"
						/>
					</div>
					<div className="mb-3">
						<textarea
							placeholder="Descripcion"
							style={{ backgroundColor: '#f8f8f8', borderColor: 'white' }}
							onChange={handleCreateDataChange}
							className="form-control"
							name="project_description"
						/>
					</div>
					<div style={{ width: '100%' }}>
						<button
							type="submit"
							className="btn text-white w-100"
							style={{ backgroundColor: '#202020' }}>
							Crear proyecto
						</button>
					</div>
				</form>
				<Toaster richColors />
			</div>
		</div>
	)
}

export default CreateProject
