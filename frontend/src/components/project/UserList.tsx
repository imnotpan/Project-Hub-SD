import React, { useEffect } from 'react'
import user from './user.json'
import UserCard from '../cards/UserCard'

type UserProps = {
	showList: (bool: boolean) => void
}

const UserList: React.FC<UserProps> = ({ showList }) => {
	useEffect(() => {
		/* const fetchUsers = async () => {
			const response = await fetch('http://localhost:8000/api/users/')
			const data = await response.json()
			console.log(data)
		}
		fetchUsers() */
	}, [])

	return (
		<div
			className="d-flex justify-content-center align-items-center position-fixed top-0 start-0 w-100 h-100 bg-white bg-opacity-75"
			style={{ zIndex: 9999 }}>
			<div
				className="bg-white rounded-3 p-3 mb-5 shadow-lg"
				style={{
					width: '80%',
					maxWidth: '400px',
					height: '80%',
					maxHeight: '600px',
					display: 'flex',
					flexDirection: 'column',
				}}>
				<div className="text-center mb-1">
					<h2 className="font-inter fs-3">Lista de usuarios</h2>
				</div>
				<div className="d-flex flex-column flex-grow-1 overflow-auto">
					<ul className="list-unstyled mb-0">
						{user.map((user, index) => (
							<li className="mb-3" key={index}>
								<UserCard
									user_name={user.user_name}
									user_email={user.user_email}
									user_status={user.user_status}
									colorRow={index % 2 ? '#fff' : '#f4f9ff'}
								/>
							</li>
						))}
					</ul>
				</div>
				<div className="d-flex pt-2">
					<button
						className="btn btn-dark w-100 mt-2"
						onClick={() => {
							showList(false)
						}}>
						Salir
					</button>
				</div>
			</div>
		</div>
	)
}

export default UserList
