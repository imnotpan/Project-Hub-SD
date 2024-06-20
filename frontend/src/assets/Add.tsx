import React from 'react'
import { IconProps } from '../types/types'

const Add: React.FC<IconProps> = ({ size, color }) => {
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round">
			<path stroke="none" d="M0 0h24v24H0z" fill="none" />
			<path d="M20 6v4a1 1 0 0 1 -1 1h-14a1 1 0 0 1 -1 -1v-4a1 1 0 0 1 1 -1h14a1 1 0 0 1 1 1z" />
			<path d="M12 15l0 4" />
			<path d="M14 17l-4 0" />
		</svg>
	)
}

export default Add
