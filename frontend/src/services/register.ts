import { toast } from 'sonner'
import { apiSendData } from './apiService'

export const registerUser = async (
	username: string,
	email: string,
	password: string,
	navigate: (path: string) => void
) => {
	if (!username || !email || !password) {
		toast.warning('Por favor, completa todos los campos.')
		return
	}

	const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
	if (!emailPattern.test(email)) {
		toast.warning('Por favor, introduce un correo electrónico válido.')
		return
	}
	try {
		const route = `/auth/register?user_name=${username}&user_email=${email}&user_password=${password}`
		const header = { 'Content-Type': 'application/json' }
		const response = await apiSendData(route, header)

		if (response.ok) {
			toast.success('Usuario registrado exitosamente.')
			setTimeout(() => {
				navigate('/login')
			}, 500)
		} else {
			toast.error(`El correo ${email} ya tiene cuenta`)
		}
	} catch (e) {
		toast.warning(
			'Error de red. Por favor, revisa tu conexión e intenta de nuevo.'
		)
	}
}
