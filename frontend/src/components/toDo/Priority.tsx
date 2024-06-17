import React, { useEffect, useRef, useState } from 'react'

interface PriorityProps {
	difficulty: number
	onChange: (difficulty: number) => void
}

const Priority: React.FC<PriorityProps> = ({ difficulty, onChange }) => {
	const [selectedDifficulty, setSelectedDifficulty] = useState<string>('')
	const [backgroundColor, setBackgroundColor] = useState<string>('#f8f8f8')
	const [dropdownOpen, setDropdownOpen] = useState<boolean>(false)
	const dropdownRef = useRef<HTMLDivElement>(null)

	const backgroundColors: string[] = [
		'#a3e2a3', // Muy facil
		'#91c9ff', // Facil
		'#ffc966', // Intermedio
		'#fcb995', // Dificil
		'#ff9999', // Muy Dificil
	]

	const difficulties: string[] = [
		'Muy facil',
		'Facil',
		'Intermedio',
		'Dificil',
		'Muy Dificil',
	]

	useEffect(() => {
		setSelectedDifficulty(difficulties[difficulty])
		setBackgroundColor(backgroundColors[difficulty] || '#f8f8f8')
	}, [difficulty])

	const handleDropdownSelect = (index: number) => {
		setSelectedDifficulty(difficulties[index])
		setBackgroundColor(backgroundColors[index] || '#f8f8f8')
		onChange(index) // Aquí pasamos el índice seleccionado a la función onChange
		setDropdownOpen(false) // Cerrar el menú después de seleccionar
	}

	const handleClickOutside = (event: MouseEvent) => {
		if (
			dropdownRef.current &&
			!dropdownRef.current.contains(event.target as Node)
		) {
			setDropdownOpen(false)
		}
	}

	useEffect(() => {
		if (dropdownOpen) {
			document.addEventListener('click', handleClickOutside)
		} else {
			document.removeEventListener('click', handleClickOutside)
		}

		return () => {
			document.removeEventListener('click', handleClickOutside)
		}
	}, [dropdownOpen])

	const toggleDropdown = () => {
		setDropdownOpen(!dropdownOpen)
	}

	return (
		<div className="mb-3 d-flex align-items-center">
			<div className="dropdown" ref={dropdownRef}>
				<button
					className="btn btn-secondary dropdown-toggle"
					type="button"
					aria-expanded={dropdownOpen}
					onClick={toggleDropdown}>
					Dificultad
				</button>
				<ul className={`dropdown-menu${dropdownOpen ? ' show' : ''}`}>
					{difficulties.map((dif, index) => (
						<li key={index}>
							<a
								href="#!"
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
					disabled
				/>
			</div>
		</div>
	)
}

export default Priority
