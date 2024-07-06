import Back from '../../assets/Back'
import { useEffect, useState } from 'react'
import { Toaster } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { fetchCreateProject, fetchJoinProject } from '../../services/project'

// Componente para crear un proyecto
const CreateProject: React.FC<{ onReturn: () => void }> = ({ onReturn }) => {
	const [idProject, setIdProject] = useState('')

	const navigate = useNavigate()
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

		fetchCreateProject(
			createProjectData.project_name,
			createProjectData.project_password,
			createProjectData.project_description,
			setIdProject
		)
	}
	useEffect(() => {
		if (idProject) {
			fetchJoinProject(idProject, createProjectData.project_password, navigate) // Llama a la función para unirse al proyecto
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
			</div>
			<Toaster richColors />
		</div>
	)
}

export default CreateProject
