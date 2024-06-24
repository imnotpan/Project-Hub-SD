import React, { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { userAuthStore } from '../authStore.tsx'
import Menu from '../assets/Menu.tsx'
import Sun from '../assets/Sun.tsx'
import Moon from '../assets/Moon.tsx'

const NavigationBar: React.FC = () => {
	const [isOpen, setIsOpen] = useState(false)
	const [mode, setMode] = useState('light')
	const login = userAuthStore((state) => state.state)
	const [activeItem, setActiveItem] = useState<string>('')

	const navRef = useRef<HTMLDivElement>(null)

	const logout = () => {
		setIsOpen(false)
		const authState = userAuthStore.getState()
		authState.setToken('')
		authState.setUsername('')
		authState.setEmail('')
		authState.setTokenType('')
		authState.setState(false)
		localStorage.removeItem('userDataLogin')
	}

	const handleNavItemClick = (link: string) => {
		setActiveItem(link)
		setIsOpen(false)
	}

	const handleClickOutside = (event: MouseEvent) => {
		if (navRef.current && !navRef.current.contains(event.target as Node)) {
			setIsOpen(false)
		}
	}

	useEffect(() => {
		document.addEventListener('mousedown', handleClickOutside)
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [])

	const NavItem: React.FC<{ link: string; text: string }> = ({
		link,
		text,
	}) => (
		<li className={`nav-item ms-2 ${activeItem === link ? 'active' : ''}`}>
			<Link
				to={link}
				className="nav-link text-black"
				onClick={() => handleNavItemClick(link)}>
				<span
					className="nav-item-text p-1"
					style={{ transition: 'all 0.1s ease', fontSize: '1.1rem' }}
					onMouseOver={(e) => {
						e.currentTarget.style.borderBottom = '3px solid #74bff6'
						e.currentTarget.style.fontWeight = 'bold'
					}}
					onMouseOut={(e) => {
						e.currentTarget.style.borderBottom =
							activeItem === link ? '3px solid #74bff6' : 'none'
						e.currentTarget.style.fontWeight =
							activeItem === link ? 'bold' : 'normal'
					}}>
					{text}
				</span>
			</Link>
		</li>
	)

	const NavButton: React.FC<{
		route: string
		text: string
		clickEvent?: () => void
	}> = ({ route, text, clickEvent }) => (
		<Link to={route} className="nav-link " onClick={clickEvent}>
			<button
				className="btn btn-sm me-2 d-inline-flex rounded-pill border-0 fw-bold"
				onMouseOver={(e) => (
					(e.currentTarget.style.background = '#74bff6'),
					(e.currentTarget.style.color = mode === 'light' ? '#00' : '#fff')
				)}
				onMouseOut={(e) => (
					(e.currentTarget.style.background =
						mode === 'light' ? '#000' : '#fff'),
					(e.currentTarget.style.color = mode === 'light' ? '#fff' : '#000')
				)}
				style={{
					background: mode === 'light' ? '#000' : '#fff',
					fontSize: '1rem',
					transition: 'all 0.3s ease',
					color: mode === 'light' ? '#fff' : '#000',
				}}>
				{text}
			</button>
		</Link>
	)

	const renderAuthButtons = () => {
		if (login) {
			return (
				<>
					<NavButton
						route="/profile"
						text="Perfil"
						clickEvent={() => {
							setIsOpen(false)
						}}
					/>
					<NavButton route="/" text="Cerrar sesión" clickEvent={logout} />
				</>
			)
		} else {
			return (
				<NavButton
					route="/login"
					text="Iniciar sesión"
					clickEvent={() => setIsOpen(false)}
				/>
			)
		}
	}

	const toggleMode = () => {
		const newMode = mode === 'light' ? 'dark' : 'light'
		setMode(newMode)
		if (newMode === 'dark') {
			document.body.classList.add('dark-mode')
		} else {
			document.body.classList.remove('dark-mode')
		}
	}

	return (
		<nav
			className="navbar navbar-expand-lg navbar-dark navbar m-0 p-0 align-items-center"
			style={{
				background: mode === 'light' ? 'white' : '#000',
				position: 'fixed',
				width: '100%',
				zIndex: 1000,
				top: 0,
			}}
			ref={navRef}>
			<div className="container">
				<button
					className="navbar-toggler"
					type="button"
					onClick={() => setIsOpen(!isOpen)}>
					<Menu color={mode === 'light' ? '#000' : '#fff'} size="40" />
				</button>

				<Link
					to="/"
					className="nav-link"
					onClick={() => handleNavItemClick('/')}
					style={{
						fontSize: '1.4rem',
						transition: 'all 0.3s ease',
						transform: 'scale(1)',
						color: mode === 'light' ? '#000' : '#fff',
					}}
					onMouseOver={(e) => {
						e.currentTarget.style.color = '#74bff6'
						e.currentTarget.style.transform = 'scale(1.1)'
					}}
					onMouseOut={(e) => {
						e.currentTarget.style.color = mode === 'light' ? '#000' : '#fff'
						e.currentTarget.style.transform = 'scale(1)'
					}}
					onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.8)')}
					onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}>
					<span className="fw-bold">Project Hub</span>
				</Link>

				<div
					className={`collapse navbar-collapse p-2 align-items-center ${
						isOpen ? 'show' : ''
					}`}>
					<ul className="navbar-nav w-100 ps-2 ">
						<NavItem link="/" text="Inicio" />
						{login && (
							<>
								<NavItem link="/project-options" text="Opciones de proyecto" />
								<NavItem link="/my-projects" text="Mis proyectos" />
							</>
						)}
						<NavItem link="/about" text="Acerca de" />
					</ul>
				</div>
				<div className="d-flex p-2 ms-auto align-items-center">
					<button className="btn p-0 border-0" onClick={toggleMode}>
						{mode === 'light' ? (
							<Sun size="36" color="#F5CE13" />
						) : (
							<Moon size="36" color="#E8E5D6" />
						)}
					</button>
					<div className="d-flex align-items-center ms-2">
						{renderAuthButtons()}
					</div>
				</div>
			</div>
		</nav>
	)
}

export default NavigationBar
