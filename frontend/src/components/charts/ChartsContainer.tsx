import React from 'react'
import DonutChart from './DonutChart'
import BarChart from './BarChart'

import testjson from './testjson.json'

const ChartsContainer: React.FC = () => {
	return (
		<div className="container-fluid">
			<div className="row">
				<div
					className="col-md-6"
					style={{ backgroundColor: '#fff', padding: '20px' }}>
					<DonutChart data={testjson} />
				</div>
				<div
					className="col-md-6"
					style={{ backgroundColor: '#fff', padding: '20px' }}>
					<BarChart data={testjson} />
				</div>
			</div>
		</div>
	)
}

export default ChartsContainer
