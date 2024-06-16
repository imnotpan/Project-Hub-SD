import React from 'react'
import ProjectTable from '../components/project/ProjectTable'

const MyProjectsPage: React.FC = () => {
	return (
		<div style={{ height: 'calc(100vh - 58px)', marginTop: '58px' }}>
			<div className="container h-100">
				<div
					className="h-100 d-flex justify-content-center  pt-5"
					style={{ overflowY: 'auto', width: '100%' }}>
					<ProjectTable />
				</div>
			</div>
		</div>
	)
}

export default MyProjectsPage
