import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import { registerUser } from '../services/register'
import { RegisterProps } from '../types/types'

const RegisterPage: React.FC = () => {
	const navigate = useNavigate()

	const [registerData, setRegisterData] = useState<RegisterProps>({
		username: '',
		email: '',
		password: '',
	})

	const handleRegisterPageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setRegisterData({
			...registerData,
			[e.target.name]: e.target.value,
		})
	}

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		const { username, email, password } = registerData
		registerUser(username, email, password, navigate)
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
				<div className="text-left mb-2">
					<h2 className="font-inter" style={{ fontSize: '2rem' }}>
						¡Bienvenido!
					</h2>
					<p className="text-secondary pt-1" style={{ fontSize: '1.1rem' }}>
						Ingresa tus datos para crear una cuenta
					</p>
				</div>
				<form onSubmit={handleSubmit}>
					<div className="mb-3">
						<input
							type="text"
							name="username"
							className="form-control"
							placeholder="Nombre de usuario"
							style={{ backgroundColor: '#f8f8f8', borderColor: 'white' }}
							onChange={handleRegisterPageChange}
						/>
					</div>
					<div className="mb-3">
						<input
							type="email"
							name="email"
							className="form-control"
							placeholder="Correo electrónico"
							style={{ backgroundColor: '#f8f8f8', borderColor: 'white' }}
							onChange={handleRegisterPageChange}
						/>
					</div>
					<div className="mb-3">
						<input
							type="password"
							name="password"
							className="form-control"
							placeholder="Contraseña"
							style={{ backgroundColor: '#f8f8f8', borderColor: 'white' }}
							onChange={handleRegisterPageChange}
						/>
					</div>
					<div style={{ width: '100%' }}>
						<button
							type="submit"
							className="btn text-white w-100"
							style={{ backgroundColor: '#202020' }}>
							Registrarse
						</button>
					</div>
				</form>
				<p className="mt-3 text-center text-dark">
					¿Ya tienes una cuenta?{' '}
					<Link to="/login" className="text-dark">
						Iniciar sesión
					</Link>
				</p>
			</div>
			<Toaster richColors />
		</div>
	)
}

export default RegisterPage
