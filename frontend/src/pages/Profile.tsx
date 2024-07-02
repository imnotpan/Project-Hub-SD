import React, { useEffect, useState } from 'react'
import profileimg from '../assets/images/background_home.jpg'

import { getUserSession } from '../services/login'
import { UserSession } from '../types/types'

const Profile: React.FC = () => {
	const [userData, setUserData] = useState<UserSession>({
		user_name: '',
		user_email: '',
		access_token: '',
		token_type: '',
	})
	useEffect(() => {
		const data = getUserSession()
		setUserData(data)
	}, [])

	return (
		<div style={{ height: 'calc(100vh - 58px)', marginTop: '58px' }}>
			<div className="container-fluid p-3">
				<div className="row justify-content-center">
					<div className="col-md-12 col-sm-12 col-lg-6">
						<div className="card shadow">
							<div className="card-body">
								<div className="text-center mb-4">
									<img
										src={profileimg}
										className="rounded-circle"
										alt="Imagen de perfil"
										width="150"
										style={{
											borderRadius: '50%',
											height: '300px',
											width: '300px',
											objectFit: 'cover',
											margin: '20px auto',
										}}
									/>
								</div>
								<h1 className="card-title text-center mb-4">
									Perfil de Usuario
								</h1>
								<hr />
								<div className="mb-3">
									<label htmlFor="username" className="form-label">
										Nombre de usuario:
									</label>
									<input
										type="text"
										id="username"
										className="form-control"
										readOnly
										value={userData?.user_name}
										style={{ backgroundColor: '#f5f5f5', color: '#333' }}
									/>
								</div>
								<div className="mb-3">
									<label htmlFor="email" className="form-label">
										Correo electrónico:
									</label>
									<input
										type="email"
										id="email"
										className="form-control"
										readOnly
										value={userData?.user_email}
										style={{ backgroundColor: '#f5f5f5', color: '#333' }}
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Profile
