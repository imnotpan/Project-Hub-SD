export type ProjectCardProps = {
	project_creation_date: string
	project_description: string
	project_id: string
	project_name: string
	project_password: string
}

export type IconProps = {
	size: string
	color: string
}

export type ElementPageProps = {
	description: string
	image: string
	title: string
}

export type LoginProps = {
	email: string
	password: string
}
export type RegisterProps = {
	username: string
	email: string
	password: string
}

export type CardServiceProps = {
	description: string
	image: string
}

export type TeamsCardProps = {
	team_description: string
	team_id: number
	team_name: string
	team_private: boolean
}

type MessageProps = {
	message_id: number
	app_user_name: string
	app_user_email: string
	message_content: string
	message_date: string
}

export type UserProps = {
	app_user_email: string
	app_user_id: string
	app_user_name: string
	user_status: string
}

export interface Todo {
	task_id: number
	task_description: string
	task_creation_date: string
	task_end_date: string
	task_deadline_date: string
	task_difficult: number
	task_state: string
	team_id: number
}

export interface ToDoCardProps {
	todo: Todo
	onDelete: (id: number) => void
	status: string
}

export interface ToDoContentProps {
	onClose: () => void
	status: string
	name: string
	todo: Todo
}

export type ToDoProps = {
	color: string
	title: string
	tasks?: Todo[]
	status: string
}
