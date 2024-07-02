import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import { LoginProps } from '../types/types'
import { loginUser } from '../services/login'

const Login: React.FC = () => {
	const [loginData, setloginData] = useState<LoginProps>({
		email: '',
		password: '',
	})

	const navigate = useNavigate()

	const handleLoginPageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setloginData({
			...loginData,
			[e.target.name]: e.target.value,
		})
	}

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		const { email, password } = loginData
		loginUser(email, password, navigate)
	}

	return (
		<div className="d-flex justify-content-center align-items-center w-100 vh-100 div-login">
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
						Ingresa tus datos para iniciar sesión
					</p>
				</div>
				<form onSubmit={handleSubmit}>
					<div className="mb-3">
						<input
							type="email"
							name="email"
							className="form-control"
							placeholder="Correo electrónico"
							style={{ backgroundColor: '#f8f8f8', borderColor: 'white' }}
							onChange={handleLoginPageChange}
						/>
					</div>
					<div className="mb-3">
						<input
							type="password"
							name="password"
							className="form-control"
							placeholder="Contraseña"
							style={{ backgroundColor: '#f8f8f8', borderColor: 'white' }}
							onChange={handleLoginPageChange}
						/>
					</div>
					<div style={{ width: '100%' }}>
						<button
							type="submit"
							className="btn text-white w-100"
							style={{ backgroundColor: '#202020' }}>
							Iniciar sesión
						</button>
					</div>
					<Toaster richColors />
				</form>
				<p className="mt-3 text-center text-dark">
					¿No tienes una cuenta?{' '}
					<Link to="/register" className="text-dark">
						Crear cuenta
					</Link>
				</p>
			</div>
			<Toaster richColors />
		</div>
	)
}

export default Login
