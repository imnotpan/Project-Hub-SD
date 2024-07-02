import React from 'react'
import { MessagesProps } from '../../types/types'

const Message: React.FC<MessagesProps> = ({
	message_text,
	user_name,
	user_email,
	date,
	colorRow,
}) => {
	return (
		<div
			className=" mt-2 p-2 pb-0 align-content-center "
			style={{
				backgroundColor: colorRow,
				borderTop: '0.3px solid rgba(255,255,255,0.5)',
			}}>
			<div className="pb-2">
				<span className="me-2">
					<strong style={{ color: '#404fed' }}>{user_name}</strong>
					<strong className="mx-3">{user_email}</strong>
				</span>
				<span className="">{date}</span>
			</div>
			<div className="">
				<p>{message_text}</p>
			</div>
		</div>
	)
}

export default Message
