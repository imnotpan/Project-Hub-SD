import React, { useEffect, useState } from 'react'
import BarChartHor from './BarChartHor'
import BarChart from './BarChart'
import { toast } from 'sonner'
import { projectAuthStore } from '../../authStore'
import { apiGetData } from '../../services/apiService'
import { getUserSession } from '../../services/login'

const ChartsContainer: React.FC = () => {
	const [dataCharts, setdataCharts] = useState([])
	useEffect(() => {
		const fetchMetrics = async () => {
			const { token_project } = projectAuthStore.getState()
			const { access_token } = getUserSession()

			try {
				const route = `/project/metrics?project_auth_key=${token_project}`
				const header = {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${access_token}`,
				}
				const response = await apiGetData(route, header)

				if (response.ok) {
					const data = await response.json()
					setdataCharts(data)
				}
			} catch {
				toast.warning(
					'Error de red. Por favor, revisa tu conexión e intenta de nuevo.'
				)
			}
		}

		fetchMetrics()
	}, [])

	return (
		<div className="container-fluid">
			<div className="row">
				<div className="col-md-6 p-1" style={{ backgroundColor: '#fff' }}>
					<BarChartHor data={dataCharts} />
				</div>
				<div className="col-md-6 p-1" style={{ backgroundColor: '#fff' }}>
					<BarChart data={dataCharts} />
				</div>
			</div>
		</div>
	)
}

export default ChartsContainer
