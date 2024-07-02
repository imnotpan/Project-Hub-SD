import React, { useEffect } from 'react'
import { userAuthStore } from './authStore'
import { Routes, Route, Navigate } from 'react-router-dom'
import NavigationBar from './components/NavigationBar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import ProjectOptions from './pages/ProjectOptions'
import Teams from './pages/Team'
import NotFound from './pages/NotFound' // Importa tu componente de página no encontrada
import Projects from './pages/Project'
import Profile from './pages/Profile'
import About from './pages/About'
import MyProjects from './pages/MyProjects'
import { getUserSession } from './services/login'

const App: React.FC = () => {
	const login = userAuthStore((state) => state.state)

	useEffect(() => {
		const login = getUserSession()
		if (login) {
			const { setState } = userAuthStore.getState()
			setState(true)
		}
	}, [])

	return (
		<div>
			<NavigationBar />
			<Routes>
				<Route path="/" element={<Home />} />

				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register />} />
				<Route
					path="/project-options"
					element={login ? <ProjectOptions /> : <Navigate to="/" />}
				/>
				<Route
					path="/projects"
					element={login ? <Projects /> : <Navigate to="/" />}
				/>
				<Route
					path="/teams"
					element={login ? <Teams /> : <Navigate to="/" />}
				/>
				<Route
					path="my-projects"
					element={login ? <MyProjects /> : <Navigate to="/" />}
				/>
				<Route
					path="/profile"
					element={login ? <Profile /> : <Navigate to="/" />}
				/>
				<Route path="/about" element={<About />} />
				<Route path="*" element={<NotFound />} />
			</Routes>
		</div>
	)
}

export default App
