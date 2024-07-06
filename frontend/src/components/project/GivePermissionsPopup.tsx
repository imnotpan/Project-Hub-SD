import React, { useState } from 'react'
import Close from '../../assets/Close'
import { getUserSession } from '../../services/login'
import { projectAuthStore } from '../../authStore'
import { toast } from 'sonner'
import { apiDeleteData, apiSendData } from '../../services/apiService'

const GivePermissionsPopup: React.FC<{ onClose: () => void }> = ({
	onClose,
}) => {
	const { access_token } = getUserSession()
	const { token_project } = projectAuthStore.getState()
	const [userData, setUserData] = useState({
		email: '',
	})
	const [closeButtonHovered, setCloseButtonHovered] = useState(false)

	const handleDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setUserData({
			...userData,
			[e.target.name]: e.target.value,
		})
	}

	const handleButtonGivePermission = async (
		e: React.MouseEvent<HTMLButtonElement>
	) => {
		//fetch hacer admin
		e.preventDefault()

		if (!userData.email) {
			toast.warning('Por favor, completa todos los campos.')
			return
		}

		try {
			const route = `/project/add/owner?project_auth_key=${token_project}&user_email=${userData.email}`
			const header = {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${access_token}`,
			}
			const response = await apiSendData(route, header)

			if (response.ok) {
				toast.success(`Permiso asignado exitosamente.`)
			} else {
				toast.error(`Error al asignar permiso.`)
			}
		} catch {
			toast.warning(
				'Error de red. Por favor, revisa tu conexión e intenta de nuevo.'
			)
		}
	}

	const handleButtonDeletePermission = async (
		e: React.MouseEvent<HTMLButtonElement>
	) => {
		//fetch quitar admin
		e.preventDefault()
		if (!userData.email) {
			toast.warning('Por favor, completa todos los campos.')
			return
		}

		try {
			const route = `/project/delete/owner?project_auth_key=${token_project}&user_email=${userData.email}`
			const header = {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${access_token}`,
			}
			const response = await apiDeleteData(route, header)

			if (response.ok) {
				toast.success(`Permiso elimiado exitosamente.`)
			} else {
				toast.error(`Error al eliminar permiso.`)
			}
		} catch {
			toast.warning(
				'Error de red. Por favor, revisa tu conexión e intenta de nuevo.'
			)
		}
	}
	return (
		<div
			className="d-flex justify-content-center align-items-center position-fixed top-0 start-0 w-100 h-100 bg-white bg-opacity-75"
			style={{ zIndex: 9999 }}>
			<div
				className="bg-white rounded-3 p-3 mb-5 shadow-lg"
				style={{
					maxWidth: '400px',
					width: '100%',
					boxShadow: '-10px 10px 15px -3px rgba(0, 0, 0, 0.1) ',
				}}>
				<div className=" d-flex justify-content-end">
					<button
						className="border-0 rounded-5"
						style={{
							backgroundColor: '#FF5F56',
							transition: 'all 0.3s ease-in-out',
							width: '26px',
							height: '26px',
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							transform: closeButtonHovered ? 'scale(1.1)' : 'scale(1)',
						}}
						onMouseOver={() => setCloseButtonHovered(true)}
						onMouseLeave={() => setCloseButtonHovered(false)}
						onClick={onClose}>
						<Close size="26" color={closeButtonHovered ? '#000' : '#FF5F56'} />
					</button>
				</div>
				<div className="text-center mb-1">
					<h2 className="font-inter fs-3">Rol a usuario</h2>
				</div>
				<div className="mb-3">
					<input
						placeholder="Correo electronico"
						style={{ backgroundColor: '#f8f8f8', borderColor: 'white' }}
						type="email"
						name="email"
						onChange={handleDataChange}
						className="form-control"
					/>
				</div>

				<div className="d-flex pt-2 gap-2">
					<button
						className="btn btn-dark w-100 mt-2"
						onClick={handleButtonGivePermission}>
						Asignar rol
					</button>
					<button
						className="btn btn-dark w-100 mt-2"
						onClick={handleButtonDeletePermission}>
						Eliminar rol
					</button>
				</div>
			</div>
		</div>
	)
}

export default GivePermissionsPopup
