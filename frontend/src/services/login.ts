import Cookies from 'js-cookie'
import { toast } from 'sonner'
import { apiSendData } from './apiService'
import { userAuthStore } from '../authStore'
import { UserSession } from '../types/types'
const COOKIE_NAME = 'user_session'

export const saveUserSession = (session: UserSession) => {
	Cookies.set(COOKIE_NAME, JSON.stringify(session), { expires: 7 })
}

export const getUserSession = (): UserSession => {
	const session = Cookies.get(COOKIE_NAME)
	return session ? JSON.parse(session) : null
}

export const clearUserSession = () => {
	Cookies.remove(COOKIE_NAME)
}

export const loginUser = async (
	email: string,
	password: string,
	navigate: (path: string) => void
) => {
	const { setState } = userAuthStore.getState()

	if (!email || !password) {
		toast.warning('Por favor, completa todos los campos.')
		return
	}

	const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
	if (!emailPattern.test(email)) {
		toast.warning('Por favor, introduce un correo electrónico válido.')
		return
	}

	try {
		const formData = new URLSearchParams()
		formData.append('username', email)
		formData.append('password', password)

		const route = `/auth/login?user_email=${email}&user_password=${password}`
		const header = {
			'Content-Type': 'application/x-www-form-urlencoded',
		}
		const body = formData.toString()
		const response = await apiSendData(route, header, body)

		if (response.ok) {
			const responseData = await response.json()
			setState(true)
			saveUserSession(responseData)
			toast.success('Credenciales validas. ¡Bienvenido!')
			setTimeout(() => {
				navigate('/')
			}, 500)
		} else {
			toast.error('Credenciales inválidas. Por favor, intenta de nuevo.')
		}
	} catch {
		toast.warning(
			'Error de red. Por favor, revisa tu conexión e intenta de nuevo.'
		)
	}
}
