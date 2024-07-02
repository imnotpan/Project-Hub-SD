import React, { useState } from 'react'
import Avatar from 'react-avatar'
import { UserCardProps } from '../../types/types'

const UserCard: React.FC<UserCardProps> = ({
	user_name,
	user_email,
	user_status,
	colorRow,
}) => {
	const [hover, setHover] = useState(false)

	return (
		<div
			className="position-relative"
			style={{ backgroundColor: colorRow, cursor: 'pointer' }}
			onMouseOver={(e) => (
				(e.currentTarget.style.backgroundColor = '#dde8ff'), setHover(true)
			)}
			onMouseOut={(e) => (
				(e.currentTarget.style.backgroundColor = colorRow), setHover(false)
			)}>
			<div>
				<div className="card-body d-flex align-items-center p-2 ">
					<div
						className=" me-2"
						style={{ transform: hover ? 'scale(1.1)' : 'scale(1)' }}>
						<Avatar name={user_name} size="46" round={true} />
					</div>
					<div className="mx-2 w-100">
						<p className="fw-bold m-0 p-0">{user_name}</p>
						<p className="text-secondary m-0 p-0">{user_email}</p>
						<p className="text-center fw-bold m-0 p-0 ">{user_status}</p>
					</div>
				</div>
			</div>
		</div>
	)
}

export default UserCard
