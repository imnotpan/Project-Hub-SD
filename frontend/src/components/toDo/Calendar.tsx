import React, { useState, useRef } from 'react'
import {
	format,
	startOfMonth,
	endOfMonth,
	startOfWeek,
	endOfWeek,
	eachDayOfInterval,
	isSameMonth,
	isSameDay,
} from 'date-fns'
import 'bootstrap/dist/css/bootstrap.min.css' // Asegúrate de tener Bootstrap importado
import CalendarIcon from '../../assets/CalendarIcon'

const Calendar: React.FC<{ dateSelect: (date: Date) => void }> = ({
	dateSelect,
}) => {
	const [currentDate, setCurrentDate] = useState<Date>(new Date())
	const [showPopover, setShowPopover] = useState<boolean>(false)
	const popoverRef = useRef<HTMLDivElement | null>(null)

	const daysOfWeek = ['L', 'M', 'M', 'J', 'V', 'S', 'D']

	const monthStart = startOfMonth(currentDate)
	const monthEnd = endOfMonth(currentDate)
	const startDate = startOfWeek(monthStart, { weekStartsOn: 1 }) // Empieza el lunes (1)
	const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 }) // Termina el domingo (0)

	const daysInMonth = eachDayOfInterval({ start: startDate, end: endDate })

	const handlePrevMonth = () => {
		setCurrentDate(
			(prevDate) => new Date(prevDate.getFullYear(), prevDate.getMonth() - 1, 1)
		)
	}

	const handleNextMonth = () => {
		setCurrentDate(
			(prevDate) => new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, 1)
		)
	}

	const togglePopover = () => {
		setShowPopover(!showPopover)
	}

	const handleClickOutside = (event: MouseEvent) => {
		if (
			popoverRef.current &&
			!popoverRef.current.contains(event.target as Node)
		) {
			setShowPopover(false)
		}
	}

	React.useEffect(() => {
		document.addEventListener('mousedown', handleClickOutside)
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [])

	const handleClickDay = (day: Date) => {
		dateSelect(day)
		setShowPopover(false)
	}

	// Divide los días en semanas
	const weeks = []
	for (let i = 0; i < daysInMonth.length; i += 7) {
		weeks.push(daysInMonth.slice(i, i + 7))
	}

	const toggleDropdown = () => {
		const dropdownToggle = document.getElementById('dropdown-menu')
		dropdownToggle?.classList.toggle('show')
	}

	return (
		<div className="">
			<button
				className="btn border-0 p-0 m-0"
				type="button"
				onClick={togglePopover}
				style={{
					transition: 'all 0.3s ease-in-out',
				}}
				onMouseOver={(e) => {
					e.currentTarget.style.transform = 'scale(1.1)'
					e.currentTarget.style.color = '#4CD9D7'
				}}
				onMouseOut={(e) => {
					e.currentTarget.style.transform = 'scale(1)'
					e.currentTarget.style.color = '#333'
				}}>
				<CalendarIcon size="36" color="" />
			</button>
			{showPopover && (
				<div
					ref={popoverRef}
					className="my-3 p-3 border border-1 border-secondary rounded-2 bg-white"
					style={{ width: '300px', position: 'absolute', zIndex: 1000 }}>
					<div className="d-flex justify-content-between align-items-center mb-3">
						<button className="btn border-0 p-0 m-0" onClick={handlePrevMonth}>
							{'<'}
						</button>

						<div
							className="dropdown border-bottom border-black"
							onClick={toggleDropdown}>
							<button className="btn border-0 fw-bold px-4" type="button">
								{format(currentDate, 'MMMM yyyy')}
							</button>
							<ul className="dropdown-menu text-center" id="dropdown-menu">
								<li>elementos</li>
							</ul>
						</div>
						<button className="btn border-0 p-0 m-0" onClick={handleNextMonth}>
							{'>'}
						</button>
					</div>

					<div className="row">
						{daysOfWeek.map((day, index) => (
							<div className="col text-center fw-bold p-0" key={`day-${index}`}>
								{day}
							</div>
						))}
					</div>
					{weeks.map((week, weekIndex) => (
						<div className="row " key={`week-${weekIndex}`}>
							{week.map((day, dayIndex) => (
								<div
									onClick={() => handleClickDay(day)}
									onMouseOver={(e) => {
										e.currentTarget.style.transform = 'scale(1.2)'
									}}
									onMouseOut={(e) => {
										e.currentTarget.style.transform = 'scale(1)'
									}}
									key={`day-${weekIndex}-${dayIndex}`}
									className={`col p-2 text-center fw-medium  ${
										!isSameMonth(day, currentDate) ? 'text-secondary' : ''
									} ${
										isSameDay(day, new Date())
											? 'text-white bg-primary rounded-5 '
											: ''
									}`}>
									{day.getDate()}
								</div>
							))}
						</div>
					))}
				</div>
			)}
		</div>
	)
}

export default Calendar
