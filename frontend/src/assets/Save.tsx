import { IconProps } from '../types/types'

const Save: React.FC<IconProps> = ({ size, color }) => {
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round">
			<path stroke="none" d="M0 0h24v24H0z" fill="none" />
			<path d="M6 4h10l4 4v10a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2" />
			<path d="M12 14m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
			<path d="M14 4l0 4l-6 0l0 -4" />
		</svg>
	)
}

export default Save
