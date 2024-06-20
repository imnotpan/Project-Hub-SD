import React from 'react'
import Todo from './ToDo'

const ToDoContainer: React.FC = () => {
	return (
		<div className="container">
			<div className="row justify-content-center text-center ">
				<div className="col-md m-2">
					<Todo color="" title="Sin asignar" />
				</div>
				<div className="col-md m-2">
					<Todo color="#ffe2dd" title="Sin iniciar" />
				</div>
				<div className="col-md m-2">
					<Todo color="#fdecc8" title="En proceso" />
				</div>
				<div className="col-md m-2">
					<Todo color="#dbeddb" title="Terminada" />
				</div>
			</div>
		</div>
	)
}

export default ToDoContainer
