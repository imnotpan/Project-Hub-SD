import React, { useEffect, useState } from 'react'

interface PriorityProps {
	difficulty: number
	onChange: (difficulty: number) => void
}

const Priority: React.FC<PriorityProps> = ({ difficulty, onChange }) => {
	const [selectedDifficulty, setSelectedDifficulty] = useState<string>('')
	const [backgroundColor, setBackgroundColor] = useState<string>('#f8f8f8')

	useEffect(() => {
		setSelectedDifficulty(difficulties[difficulty])
		setBackgroundColor(backgroundColors[difficulty.toString()] || '#f8f8f8')
	}, [difficulty])

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
		const newSelectedDifficulty = difficulties[index]
		setSelectedDifficulty(newSelectedDifficulty)
		setBackgroundColor(backgroundColors[index.toString()] || '#f8f8f8')
		const newIndex = difficulties.indexOf(newSelectedDifficulty)
		onChange(newIndex)
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
					{difficulties.map((dif, index) => (
						<li key={index}>
							<a
								className="dropdown-item"
								onClick={() => handleDropdownSelect(index)}>
								{dif}
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
