import React, { useEffect, useRef } from 'react'
import {
	Chart,
	BarElement,
	BarController,
	CategoryScale,
	LinearScale,
	Title,
	Tooltip,
	Legend,
} from 'chart.js'

Chart.register(
	BarController,
	BarElement,
	CategoryScale,
	LinearScale,
	Title,
	Tooltip,
	Legend
)

interface Team {
	completed_tasks: number
	in_process_tasks: number
	no_started_tasks: number
	unassigned_tasks: number
	number_of_people: number
	team_id: number
	team_name: string
	total_tasks: number
}

interface BarStackedChartProps {
	data: Team[]
}

const BarChart: React.FC<BarStackedChartProps> = ({ data }) => {
	const chartRef = useRef<HTMLCanvasElement>(null)

	useEffect(() => {
		if (chartRef.current && data) {
			const context = chartRef.current.getContext('2d')

			if (context) {
				const barChart = new Chart(context, {
					type: 'bar',
					data: {
						labels: data.map((team) => team.team_name),
						datasets: [
							{
								label: 'Tareas Terminadas',
								data: data.map((team) => team.completed_tasks),
								backgroundColor: '#4CD964',
								stack: 'Stack 0',
							},
							{
								label: 'Tareas En Proceso',
								data: data.map((team) => team.in_process_tasks),
								backgroundColor: '#F3D32F',
								stack: 'Stack 0',
							},
							{
								label: 'Tareas Sin Iniciar',
								data: data.map((team) => team.no_started_tasks),
								backgroundColor: '#FF5F56',
								stack: 'Stack 0',
							},
							{
								label: 'Tareas Sin Asignar',
								data: data.map((team) => team.unassigned_tasks),
								backgroundColor: '#BBB',
								stack: 'Stack 0',
							},
						],
					},
					options: {
						plugins: {
							legend: {
								display: true,
								position: 'top',
							},
							title: {
								display: true,
								text: 'Distribución de Tareas Por Equipo',
								padding: {
									top: 10,
									bottom: 30,
								},
								font: {
									size: 20,
								},
								color: '#333',
							},
						},
						scales: {
							x: {
								title: {
									display: true,
									text: 'Equipos',
								},
								stacked: true,
							},
							y: {
								title: {
									display: true,
									text: 'Número de Tareas',
								},
								stacked: true,
								beginAtZero: true,
							},
						},
					},
				})

				return () => {
					barChart.destroy()
				}
			}
		}
	}, [data])

	return <canvas ref={chartRef} />
}

export default BarChart
