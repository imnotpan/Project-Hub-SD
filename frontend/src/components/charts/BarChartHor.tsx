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
	nombre_team: string
	tamaño_team: number
	tareas_finalizadas_team: number
	tareas_pendientes: number
	tareas_activas_team: number
	tareas_sin_asignar_team?: number
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
