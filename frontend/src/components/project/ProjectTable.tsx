import React, { useEffect, useState } from 'react'
import { Toaster } from 'sonner'
import { ProjectCardProps } from '../../types/types'
import ElementProjectTable from './ElementProjectTable'
import { fetchProjects } from '../../services/project'

const ProjectTable: React.FC = () => {
	const [dataProjects, setDataProjects] = useState<ProjectCardProps[]>([])
	const [currentPage, setCurrentPage] = useState(1)
	const itemsPerPage = 5

	useEffect(() => {
		fetchProjects(setDataProjects)
	}, [])

	const indexOfLastProject = currentPage * itemsPerPage
	const indexOfFirstProject = indexOfLastProject - itemsPerPage
	const currentProjects = dataProjects.slice(
		indexOfFirstProject,
		indexOfLastProject
	)
	const totalPages = Math.ceil(dataProjects.length / itemsPerPage)

	return (
		<div className="container mt-4">
			<div
				className="card rounded-4 p-4 border-0 h-75"
				style={{
					boxShadow:
						'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px',
					position: 'relative',
				}}>
				<div className="d-flex justify-content-between align-items-center mb-4">
					<h5 className="mb-0 fw-bold">
						Mis Proyectos ({dataProjects.length})
					</h5>
				</div>
				<div
					className="h-100"
					style={{ overflowY: 'auto', position: 'relative' }}>
					<table className="table table-striped table-hover p-0 m-0">
						<thead>
							<tr>
								<th className="text-secondary" style={{ width: '40%' }}>
									Nombre
								</th>
								<th className="text-secondary" style={{ width: '20%' }}>
									ID
								</th>
								<th
									className="text-secondary d-none d-md-table-cell"
									style={{ width: '20%' }}>
									Fecha de creación
								</th>
							</tr>
						</thead>
						<tbody>
							{currentProjects.map((project: ProjectCardProps) => (
								<ElementProjectTable
									key={project.project_id}
									name={project.project_name}
									description={project.project_description}
									project_id={project.project_id}
									project_password="" // en caso de hacer una forma de obtener la contraseña ponerla aqui para el que creo el proyecto
									project_creation_date={project.project_creation_date}
								/>
							))}
						</tbody>
					</table>
				</div>
				<div
					className="d-flex"
					style={{ bottom: 0, backgroundColor: 'white', zIndex: 1 }}>
					<PaginationControl
						currentPage={currentPage}
						totalPages={totalPages}
						onPageChange={setCurrentPage}
					/>
				</div>
			</div>
			<Toaster richColors />
		</div>
	)
}

const PaginationControl: React.FC<{
	currentPage: number
	totalPages: number
	onPageChange: (page: number) => void
}> = ({ currentPage, totalPages, onPageChange }) => {
	return (
		<ul className="d-flex h-100 justify-content-end align-content-end align-items-end">
			{Array.from({ length: totalPages }, (_, i) => (
				<li
					key={i}
					className={`page-item px-2 ${
						currentPage === i + 1 ? 'active fw-bold' : ''
					}`}
					onMouseOver={(e) => {
						e.currentTarget.style.transform = 'scale(1.1)'
					}}
					onMouseOut={(e) => {
						e.currentTarget.style.transform = 'scale(1)'
					}}
					style={{
						listStyle: 'none',
						color: currentPage === i + 1 ? '#111' : '#333',
						transition: 'all 0.3s',
					}}>
					<button
						className="page-link px-2"
						onClick={() => onPageChange(i + 1)}>
						<p
							className={`${
								currentPage === i + 1 ? ' fw-bold  border-bottom' : ''
							}`}
							style={{ fontSize: '1.2rem' }}>
							{i + 1}
						</p>
					</button>
				</li>
			))}
		</ul>
	)
}

export default ProjectTable
