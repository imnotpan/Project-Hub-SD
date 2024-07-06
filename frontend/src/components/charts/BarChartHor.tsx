import React, { useEffect, useRef } from 'react'
import {
	Chart,
	BarElement,
	Title,
	Tooltip,
	Legend,
	BarController,
} from 'chart.js'

Chart.register(BarElement, Title, Tooltip, Legend, BarController)

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

interface BarChartProps {
	data: Team[]
}

const BarChartHor: React.FC<BarChartProps> = ({ data }) => {
	const chartRef = useRef<HTMLCanvasElement>(null)

	useEffect(() => {
		if (chartRef.current && data) {
			const context = chartRef.current.getContext('2d')

			if (context) {
				const totalFinalizadas = data.reduce(
					(sum, team) => sum + team.completed_tasks,
					0
				)
				const totalPendientes = data.reduce(
					(sum, team) => sum + team.in_process_tasks,
					0
				)
				const totalActivas = data.reduce(
					(sum, team) => sum + team.no_started_tasks,
					0
				)
				const totalSinAsignar = data.reduce(
					(sum, team) => sum + team.unassigned_tasks,
					0
				)

				const barChart = new Chart(context, {
					type: 'bar',
					data: {
						labels: [
							'Tareas Terminadas',
							'Tareas En Proceso',
							'Tareas Sin Iniciar',
							'Tareas Sin Asignar',
						],
						datasets: [
							{
								label: 'Total Tareas Terminadas',
								data: [
									totalFinalizadas,
									totalPendientes,
									totalActivas,
									totalSinAsignar,
								],
								backgroundColor: ['#4CD964', '#F3D32F', '#FF5F56', '#BBB'],
							},
						],
					},
					options: {
						indexAxis: 'y',
						plugins: {
							legend: { display: true, position: 'top' },
							title: {
								display: true,
								text: 'Distribución de Tareas En El Proyecto',
								font: {
									size: 20,
								},
								color: '#333',
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

export default BarChartHor
