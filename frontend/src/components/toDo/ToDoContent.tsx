import React, { useState } from 'react'
import { toast, Toaster } from 'sonner'
import Close from '../../assets/Close'
import Calendar from './Calendar'

interface ToDoContentProps {
	onClose: () => void
	title: string
}

const ToDoContent: React.FC<ToDoContentProps> = ({ onClose, title }) => {
	const [closeButtonHovered, setCloseButtonHovered] = useState(false)

	const [data, setData] = useState({
		startDate: '',
		endDate: '',
		description: '',
	})

	const handleDataInputs = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		setData({
			...data,
			[e.target.name]: e.target.value,
		})
	}

	const handleMouseOver = () => {
		setCloseButtonHovered(true)
	}

	const handleMouseLeave = () => {
		setCloseButtonHovered(false)
	}

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		if (!data.startDate || !data.endDate) {
			toast.warning('Por favor, completa todas las fechas.')
			return
		}

		toast.success('Tarea creada exitosamente.')
		onClose()
	}

	return (
		<div
			className="d-flex justify-content-center align-items-center position-fixed"
			style={{
				top: 0,
				left: 0,
				width: '100%',
				height: '100%',
				backgroundColor: 'rgba(255, 255, 255, 0.9)',
				zIndex: 9999,
			}}>
			<div
				className="card p-4 border-0"
				style={{
					maxWidth: '400px',
					width: '100%',
					boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
				}}>
				<div className="d-flex align-items-center justify-content-between mb-4 p-2">
					<h2 className="font-inter p-0 m-0" style={{ fontSize: '1.7rem' }}>
						{title}
					</h2>
					<div className="me-2">
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
							onMouseOver={handleMouseOver}
							onMouseLeave={handleMouseLeave}
							onClick={onClose}>
							<Close
								size="26"
								color={closeButtonHovered ? '#000' : '#FF5F56'}
							/>
						</button>
					</div>
				</div>

				<form onSubmit={handleSubmit}>
					<div className="mb-3 d-flex align-items-center">
						<input
							placeholder="Fecha de inicio"
							style={{ backgroundColor: '#f8f8f8', borderColor: 'white' }}
							type="text"
							value={data.startDate}
							onChange={handleDataInputs}
							name="startDate"
							className="form-control me-2"
							readOnly
						/>
						<Calendar
							dateSelect={(date) => setData({ ...data, startDate: date })}
						/>
					</div>
					<div className="mb-3 d-flex align-items-center">
						<input
							placeholder="Fecha de fin"
							style={{ backgroundColor: '#f8f8f8', borderColor: 'white' }}
							type="text"
							value={data.endDate}
							onChange={handleDataInputs}
							name="endDate"
							className="form-control me-2"
							readOnly
						/>
						<Calendar
							dateSelect={(date) => setData({ ...data, endDate: date })}
						/>
					</div>
					<div className="mb-3 d-flex align-items-center">
						<textarea
							placeholder="Descripción de la tarea"
							value={data.description}
							onChange={handleDataInputs}
							style={{
								backgroundColor: '#f8f8f8',
								borderColor: 'white',
								height: '150px',
								resize: 'none',
							}}
							name="description"
							className="form-control me-2"
						/>
					</div>

					<div className="mb-3"></div>
					<div style={{ width: '100%' }}>
						<button
							type="submit"
							className="btn text-white w-100"
							style={{ backgroundColor: '#202020' }}>
							Guardar
						</button>
					</div>
				</form>
				<Toaster richColors />
			</div>
		</div>
	)
}

export default ToDoContent
