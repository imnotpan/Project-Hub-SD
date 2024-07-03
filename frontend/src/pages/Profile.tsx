import React, { useEffect, useState } from 'react'
import profileimg from '../assets/images/background_home.jpg'
import { getUserSession } from '../services/login'
import { UserSession } from '../types/types'
import Edit from '../assets/Edit'

const Profile: React.FC = () => {
	const [userData, setUserData] = useState<UserSession>({
		user_name: '',
		user_email: '',
		access_token: '',
		token_type: '',
	})

	const [hover, sethover] = useState(false)
	const [selectedImage, setSelectedImage] = useState<
		string | ArrayBuffer | null
	>(profileimg)

	useEffect(() => {
		const data = getUserSession()
		setUserData(data)
	}, [])

	const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0]
		if (file) {
			const reader = new FileReader()
			reader.onload = () => {
				setSelectedImage(reader.result)
			}
			reader.readAsDataURL(file)
		}
	}

	return (
		<div style={{ height: 'calc(100vh - 58px)', marginTop: '58px' }}>
			<div className="container-fluid p-3">
				<div className="row justify-content-center">
					<div className="col-md-12 col-sm-12 col-lg-6">
						<div className="card shadow">
							<div className="card-body">
								<div className="text-center mb-4">
									<div
										style={{ position: 'relative', display: 'inline-block' }}
										onMouseEnter={() => sethover(true)}
										onMouseLeave={() => sethover(false)}
										onClick={() =>
											document.getElementById('fileInput')?.click()
										}>
										<img
											src={selectedImage as string}
											className="rounded-circle"
											alt="Imagen de perfil"
											width="150"
											style={{
												borderRadius: '50%',
												height: '300px',
												width: '300px',
												objectFit: 'cover',
												margin: '20px auto',
												transition: 'opacity 0.3s ease',
												opacity: hover ? '70%' : '100%',
												cursor: 'pointer',
											}}
										/>
										<div
											style={{
												position: 'absolute',
												top: '50%',
												left: '50%',
												transform: 'translate(-50%, -50%)',
												backgroundColor: 'rgba(0, 0, 0, 0.8)',
												padding: '10px',
												borderRadius: '50%',
												transition: 'opacity 0.3s ease',
												opacity: hover ? 1 : 0,
												pointerEvents: 'none',
												color: '#fff',
											}}>
											<Edit size="22" color="" />
										</div>
									</div>
									<input
										id="fileInput"
										type="file"
										accept="image/*"
										style={{ display: 'none' }}
										onChange={handleImageChange}
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
