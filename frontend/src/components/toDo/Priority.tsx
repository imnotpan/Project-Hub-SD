import React, { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

const Priority: React.FC = () => {
	const [selectedDifficulty, setSelectedDifficulty] = useState<string>('')
	const [backgroundColor, setBackgroundColor] = useState<string>('#f8f8f8')

	const backgroundColors: Record<string, string> = {
		'0': '#b3e6b3', // Muy facil
		'1': '#80d4ff', // Facil
		'2': '#ffd480', // Intermedio
		'3': '#ff8080', // Dificil
		'4': '#ff6666', // Muy Dificil
	}

	const difficulties: string[] = [
		'Muy facil',
		'Facil',
		'Intermedio',
		'Dificil',
		'Muy Dificil',
	]

	const handleDropdownSelect = (index: number) => {
		setSelectedDifficulty(difficulties[index])
		setBackgroundColor(backgroundColors[index.toString()] || '#f8f8f8')
	}

	return (
		<div className="mb-3 d-flex align-items-center">
			<div className="dropdown">
				<button
					className="btn btn-secondary dropdown-toggle"
					type="button"
					data-bs-toggle="dropdown"
					aria-expanded="false">
					Dificultad
				</button>
				<ul className="dropdown-menu">
					{difficulties.map((difficulty, index) => (
						<li key={index}>
							<a
								className="dropdown-item"
								onClick={() => handleDropdownSelect(index)}>
								{difficulty}
							</a>
						</li>
					))}
				</ul>
			</div>
			<div className="text-center fw-medium ms-3 fs-4">
				<input
					placeholder="Prioridad"
					style={{
						backgroundColor: backgroundColor,
						borderColor: 'white',
						fontWeight: 'bold',
					}}
					type="text"
					className="form-control text-center"
					value={selectedDifficulty}
					readOnly
				/>
			</div>
		</div>
	)
}

export default Priority
