import React from 'react'
import DonutChart from './DonutChart'
import BarChart from './BarChart'

import testjson from './testjson.json'

const ChartsContainer: React.FC = () => {
	return (
		<div className="container-fluid">
			<div className="row">
				<div className="col-md-6 p-1" style={{ backgroundColor: '#fff' }}>
					<DonutChart data={testjson} />
				</div>
				<div className="col-md-6 p-1" style={{ backgroundColor: '#fff' }}>
					<BarChart data={testjson} />
				</div>
			</div>
		</div>
	)
}

export default ChartsContainer
