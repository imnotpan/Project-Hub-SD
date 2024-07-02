import React from 'react'
import team_video from '../assets/images/team_video.mp4'
import CardService from '../components/cards/CardService'
import { Link } from 'react-router-dom'
import services from '../assets/ServicesData'
import { userAuthStore } from '../authStore'

const Home: React.FC = () => {
	const login = userAuthStore((state) => state.state)

	return (
		<div
			className="container-fluid"
			style={{
				height: 'calc(100vh - 58px)',
				marginTop: '58px',
			}}>
			<div className="row align-items-center">
				<div className="col-md-6 p-0">
					<video className="videoTag w-100" autoPlay loop muted>
						<source src={team_video} type="video/mp4" />
					</video>
				</div>
				<div className="col-md-6">
					<div className="p-3">
						<p className="border d-inline-flex rounded-pill text-black">
							<strong className="mx-3 my-2">hey!...</strong>
						</p>
						<h1
							className="font-inter"
							style={{
								fontSize: '3rem',
								lineHeight: '1',
								wordWrap: 'break-word',
								whiteSpace: 'normal',
							}}>
							<strong>
								Gestiona de manera
								<span
									className="text-white mx-2"
									style={{ backgroundColor: '#74bff6' }}>
									eficaz
								</span>
								tus proyectos
							</strong>
						</h1>
						<p className=" roboto-light w-75 pt-3">
							Project Hub es una plataforma que te permite encontrar y colaborar
							en proyectos emocionantes con personas de ideas afines en todo el
							mundo.
						</p>
						<Link
							to={login ? '/project-options' : '/login'}
							className="nav-link">
							<button
								className="border-0 rounded-pill text-white d-inline-flex nunito-sans-regular fw-bold p-2 nav-button"
								onMouseOver={(e) =>
									(e.currentTarget.style.background = '#74bff6')
								}
								onMouseOut={(e) => (e.currentTarget.style.background = '#000')}
								style={{
									background: '#000',
									fontSize: '1.3rem',
									transition: 'all 0.3s ease',
								}}>
								{login ? 'Opciones de proyecto' : 'Comienza Ahora'}
							</button>
						</Link>
					</div>
				</div>
			</div>
			<div className="bg-black row justify-content-center">
				<h1
					className="p-2 text-center roboto-light text-white pt-4"
					style={{
						fontSize: '3rem',
						lineHeight: '1',
						wordWrap: 'break-word',
						whiteSpace: 'normal',
					}}>
					<strong>Servicios</strong>
				</h1>
				<div className="row p-4">
					{services.map((service, index) => (
						<div
							className="col-md-6 col-sm-12 col-lg-3 mb-4 font-inter"
							key={index}
							style={{ overflow: 'hidden' }}>
							<div className="card bg-transparent align-items-center">
								<CardService
									description={service.description}
									image={service.image}
								/>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	)
}

export default Home
