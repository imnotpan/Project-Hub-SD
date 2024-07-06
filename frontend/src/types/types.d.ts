interface UserProps {
	username: string
	email: string
	password: string
}

export type UserSession = {
	user_name: string
	user_email: string
	access_token: string
	token_type: string
}

export type LoginProps = Pick<UserProps, 'email' | 'password'>
export type RegisterProps = Pick<UserProps, 'username' | 'email' | 'password'>

export type ElementPageProps = {
	description: string
	image: string
	title: string
}

export type IconProps = {
	size: string
	color: string
}

export type ProjectCardProps = {
	project_creation_date: string
	project_description: string
	project_id: string
	project_name: string
	project_password: string
}

export type CardServiceProps = {
	description: string
	image: string
}

export type TeamsCardProps = {
	team: {
		team_description: string
		team_id: number
		team_name: string
		team_private: boolean
	}
	colorRow: string
}

export type TeamsProps = {
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

export interface TodoType {
	task_id: number
	task_name: string
	task_description: string
	task_creation_date: string
	task_end_date: string
	task_deadline_date: string
	task_difficult: number
	task_state: string
	team_id: number
}

export interface ToDoCardProps {
	todo: TodoType
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
	tasks?: TodoType[]
	status: string
}

export type ProjectOptionsPageButtonProps = {
	type: string
	onClick: () => void
}

export interface UserMessageProps {
	app_user_name: string
	app_user_email: string
	app_user_id: string
	user_status: string
}

export interface UserCardProps {
	app_user_name: string
	app_user_email: string
	user_status: string
	app_user_id?: string
	colorRow?: string
}

export type MessagesProps = {
	message_text: string
	user_name: string
	user_email: string
	date: string
	colorRow: string
}

export type MessageListProps = {
	messages: MessageProps[]
}

export type ElementProjectTableProps = {
	// Define las propiedades de la tabla de proyectos
	name: string
	description: string
	project_id: string
	project_creation_date: string
	project_password: string
}

export interface CreateTeamPopupProps {
	createNewTeam: (e: React.FormEvent) => void
	newTeamData: {
		team_name: string
		team_description: string
		team_password: string
	}
	setNewTeamData: React.Dispatch<
		React.SetStateAction<{
			team_name: string
			team_description: string
			team_password: string
		}>
	>
	setShowCreateTeamPopup: React.Dispatch<React.SetStateAction<boolean>>
}
