import React, { useEffect } from 'react'
import services from '../assets/ServicesData'
import { ElementPageProps } from '../types/types'
import { userAuthStore } from '../authStore'

const ElementPage: React.FC<ElementPageProps> = ({
	image,
	title,
	description,
}) => {
	useEffect(() => {
		const userDataLogin = window.localStorage.getItem('userDataLogin')
		if (userDataLogin) {
			const userData = JSON.parse(userDataLogin)
			userAuthStore.setState({ state: true })
			userAuthStore.setState({ token: userData.token_user })
		}
	}, [])

	return (
		<div className="col-lg-12 col-md-12 mb-4">
			<div className="card" style={{ border: 'none', textAlign: 'center' }}>
				<img
					src={image}
					className="card-img-top"
					alt={title}
					onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.03)')}
					onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
					style={{
						borderRadius: '50%',
						height: '400px',
						width: '400px',
						objectFit: 'cover',
						margin: '20px auto',
					}}
				/>
				<div className="card-body">
					<h5
						className="card-title"
						style={{
							fontSize: '1.2em',
							fontWeight: 'bold',
							marginBottom: '15px',
						}}>
						{title}
					</h5>
					<p className="card-text">{description}</p>
				</div>
			</div>
		</div>
	)
}

const AboutPage: React.FC = () => {
	return (
		<div
			className="container-fluid p-2"
			style={{
				display: 'flex',
				height: 'calc(100vh - 58px)',
				marginTop: '58px',
			}}>
			<div className="container">
				<div className="row">
					<div className="col-12 text-center mb-4">
						<h2>Acerca de Project Hub</h2>
					</div>
				</div>
				<div className="row justify-content-center ">
					{services.map((service, index) => (
						<div
							key={index}
							className={`col-lg-6 col-md-12 mb-4 ${
								index % 2 === 0 ? 'order-md-1' : 'order-md-2'
							}`}>
							<ElementPage
								image={service.image}
								description={service.description}
								title={service.title}
							/>
						</div>
					))}
				</div>
			</div>
		</div>
	)
}

export default AboutPage
