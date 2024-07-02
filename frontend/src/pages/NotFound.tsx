import React from 'react'
import error_page from '../assets/images/error_page.gif'
import { Link } from 'react-router-dom'

const NotFound: React.FC = () => {
	return (
		<div
			className="container-fluid"
			style={{ height: 'calc(100vh - 58px)', marginTop: '58px' }}>
			<div className="row justify-content-center h-100 align-content-center ">
				<div className="col-md-6 text-center">
					<h2
						className="mb-4 font-inter"
						style={{
							fontSize: '3rem',
							lineHeight: '1',
							wordWrap: 'break-word',
							whiteSpace: 'normal',
						}}>
						<strong>¡Ups!</strong> Página no encontrada
					</h2>

					<p className="roboto-light">
						Lo sentimos, parece que la página que estás buscando no existe.
					</p>
					<img
						src={error_page}
						alt="Error 404"
						className="img-fluid mb-4 w-100"
						style={{ maxHeight: '50vh' }}
					/>

					<Link
						to="/"
						className="btn bg-black btn-lg btn-block border-0 rounded-pill text-white d-inline-flex nunito-sans-regular fw-bold p-2  ">
						Volver a la página de inicio
					</Link>
				</div>
			</div>
		</div>
	)
}

export default NotFound
