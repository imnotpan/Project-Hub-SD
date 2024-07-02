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
	nombre_team: string
	tamaño_team: number
	tareas_finalizadas_team: number
	tareas_pendientes: number
	tareas_activas_team: number
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
						labels: data.map((team) => team.nombre_team),
						datasets: [
							{
								label: 'Tareas Terminadas',
								data: data.map((team) => team.tareas_finalizadas_team),
								backgroundColor: '#4CD964',
								stack: 'Stack 0',
							},
							{
								label: 'Tareas En Proceso',
								data: data.map((team) => team.tareas_activas_team),
								backgroundColor: '#F3D32F',
								stack: 'Stack 0',
							},
							{
								label: 'Tareas Sin Iniciar',
								data: data.map((team) => team.tareas_pendientes),
								backgroundColor: '#FF5F56',
								stack: 'Stack 0',
							},
							{
								label: 'Tareas Sin Asignar',
								data: data.map((team) => team.tareas_activas_team),
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
