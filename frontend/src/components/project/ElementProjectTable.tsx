import React from 'react'
import { toast } from 'sonner'
import Copy from '../../assets/Copy'
import Avatar from 'react-avatar'
import { formatDate } from '../../services/functions'
import { ElementProjectTableProps } from '../../types/types'

// Componente para mostrar un proyecto en la tabla
const ElementProjectTable: React.FC<ElementProjectTableProps> = ({
	name,
	description,
	project_id,
	project_creation_date,
}) => {
	const [hover, setHover] = React.useState(false)

	const copyClick = (e: React.MouseEvent<HTMLDivElement>) => {
		toast.info('ID copiada!')
		navigator.clipboard.writeText(e.currentTarget.textContent || '')
	}

	const toggleHover = (
		e: React.MouseEvent<HTMLDivElement>,
		isHover: boolean
	) => {
		e.currentTarget.style.color = isHover ? '#a1a5a7' : '#333'
		setHover(isHover)
	}

	return (
		<tr>
			<td className="d-flex align-items-center">
				<div className="d-flex justify-content-center align-items-center text-uppercase fw-bold text-white mx-2 me-4">
					<Avatar name={name} size="46" round={true} />
				</div>
				<div>
					<p className="fw-bold m-0">{name}</p>
					<p className="m-0 d-none d-md-table-cell">
						<strong>Descripcion: </strong>
						{description.length < 41
							? description
							: `${description.slice(0, 47)}...`}
					</p>
				</div>
			</td>
			<td className="align-content-center" onClick={copyClick} data-type="id">
				<div
					className="d-flex align-items-center justify-content-between border-1 rounded-5 p-1 px-2"
					style={{ backgroundColor: '#f6f8fa', cursor: 'pointer' }}
					onMouseOver={(e) => toggleHover(e, true)}
					onMouseOut={(e) => toggleHover(e, false)}>
					<p className="m-0 text-center px-2">{project_id}</p>
					<Copy color={hover ? '#a1a5a7' : '#333'} size="20" />
				</div>
			</td>
			<td className="align-content-center d-none d-md-table-cell">
				{formatDate(project_creation_date)}
			</td>
		</tr>
	)
}

export default ElementProjectTable
