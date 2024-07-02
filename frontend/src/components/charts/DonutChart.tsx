import React, { useEffect, useRef } from 'react'
import {
	Chart,
	ArcElement,
	Title,
	Tooltip,
	Legend,
	DoughnutController,
} from 'chart.js'

Chart.register(ArcElement, Title, Tooltip, Legend, DoughnutController)

interface Team {
	nombre_team: string
	tamaño_team: number
	tareas_finalizadas_team: number
	tareas_pendientes: number
	tareas_activas_team: number
	tareas_sin_asignar_team?: number
}

interface DonutChartProps {
	data: Team[]
}

const DonutChart: React.FC<DonutChartProps> = ({ data }) => {
	const chartRef = useRef<HTMLCanvasElement>(null)

	useEffect(() => {
		if (chartRef.current && data) {
			const context = chartRef.current.getContext('2d')

			if (context) {
				const totalFinalizadas = data.reduce(
					(sum, team) => sum + team.tareas_finalizadas_team,
					0
				)
				const totalPendientes = data.reduce(
					(sum, team) => sum + team.tareas_pendientes,
					0
				)
				const totalActivas = data.reduce(
					(sum, team) => sum + team.tareas_activas_team,
					0
				)
				const totalSinAsignar = data.reduce(
					(sum, team) => sum + (team.tareas_sin_asignar_team || 0),
					0
				)

				const donutChart = new Chart(context, {
					type: 'doughnut',
					data: {
						labels: [
							'Tareas Terminadas',
							'Tareas En Proceso',
							'Tareas Sin iniciar',
							'Tareas Sin Asignar',
						],
						datasets: [
							{
								data: [
									totalFinalizadas,
									totalPendientes,
									totalActivas,
									totalSinAsignar,
								],
								backgroundColor: ['#4CD964', '#F3D32F', '#FF5F56', '#BBB'],
								borderWidth: 1,
							},
						],
					},
					options: {
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
					donutChart.destroy()
				}
			}
		}
	}, [data])

	return <canvas ref={chartRef} />
}

export default DonutChart
