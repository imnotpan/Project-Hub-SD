import { create } from 'zustand'

type AuthState = {
	state: boolean
	setState: (state: boolean) => void
}

export const userAuthStore = create<AuthState>((set) => ({
	state: false,
	setState: (state) => set({ state }),
}))

type ProjectState = {
	project_name: string
	token_project: string
	project_id: string
	state: boolean
	owner: boolean | null
	setProjectName: (project_name: string) => void
	setProjectId: (project_id: string) => void
	setOwner: (owner: boolean) => void
	setToken: (token_project: string) => void
	setState: (state: boolean) => void
}

export const projectAuthStore = create<ProjectState>((set) => ({
	project_name: '',
	token_project: '',
	project_id: '',
	state: false,
	owner: null,
	setProjectName: (project_name) => set({ project_name }),
	setOwner: (owner) => set({ owner }),
	setProjectId: (project_id) => set({ project_id }),
	setToken: (token_project) => set({ token_project }),
	setState: (state) => set({ state }),
}))

type TeamState = {
	team_name: string
	team_id: number | null
	token: string | null
	tokenType: string | null
	state: boolean
	setTeamName: (team_name: string) => void
	setTeamId: (team_id: number) => void
	setToken: (token: string) => void
	setTokenType: (tokenType: string) => void
	setState: (state: boolean) => void
}

export const teamAuthStore = create<TeamState>((set) => ({
	team_name: '',
	team_id: null,
	token: null,
	tokenType: null,
	state: false,
	setTeamName: (team_name) => set({ team_name }),
	setTeamId: (team_id) => set({ team_id }),
	setToken: (token) => set({ token }),
	setTokenType: (tokenType) => set({ tokenType }),
	setState: (state) => set({ state }),
}))
