import React from 'react'
import { IconProps } from '../types/types'

const Close: React.FC<IconProps> = ({ size, color }) => {
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill="none"
			stroke={color}
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round">
			<path d="M6 6l12 12M6 18L18 6" />
		</svg>
	)
}

export default Close
