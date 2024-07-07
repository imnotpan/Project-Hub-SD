import React, { useState } from 'react'
import CreateProject from '../components/project/CreateProject'
import JoinProject from '../components/project/JoinProject'
import { ProjectOptionsPageButtonProps } from '../types/types'

const ProjectOptionsButton: React.FC<ProjectOptionsPageButtonProps> = ({
	type,
	onClick,
}) => {
	return (
		<button
			type="submit"
			className="btn text-white w-100 mb-2"
			style={{ backgroundColor: '#202020' }}
			onClick={onClick}>
			{type}
		</button>
	)
}

const ProjectOptions: React.FC = () => {
	const [showCreateProject, setShowCreateProject] = useState(false)
	const [showJoinProject, setShowJoinProject] = useState(false)

	const handleCreateProjectClick = () => {
		setShowCreateProject(true)
		setShowJoinProject(false)
	}

	const handleJoinProjectClick = () => {
		setShowJoinProject(true)
		setShowCreateProject(false)
	}

	const handleReturn = () => {
		setShowCreateProject(false)
		setShowJoinProject(false)
	}

	return (
		<div
			className="d-flex justify-content-center align-items-center w-100 vh-100"
			style={{ backgroundColor: '#f9f9f9' }}>
			{showCreateProject && <CreateProject onReturn={handleReturn} />}
			{showJoinProject && <JoinProject onReturn={handleReturn} />}
			{!showCreateProject && !showJoinProject && (
				<div
					className="card p-4 border-0 "
					style={{
						maxWidth: '450px',
						width: '100%',
						boxShadow: '10px 10px 15px -3px rgba(0, 0, 0, 0.1) ',
					}}>
					<h2
						className="font-inter text-center text-uppercase mb-4"
						style={{ fontSize: '2rem' }}>
						Seleciona una opcion
					</h2>
					<ProjectOptionsButton
						type="Crear un proyecto"
						onClick={handleCreateProjectClick}
					/>
					<ProjectOptionsButton
						type="Unirse a un proyecto"
						onClick={handleJoinProjectClick}
					/>
				</div>
			)}
		</div>
	)
}

export default ProjectOptions
