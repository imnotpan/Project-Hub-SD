import { create } from 'zustand'

type AuthState = {
	username: string
	email: string
	token: string | null
	tokenType: string | null
	state: boolean
	setUsername: (username: string) => void
	setEmail: (email: string) => void
	setToken: (token: string) => void
	setTokenType: (tokenType: string) => void
	setState: (state: boolean) => void
}

export const userAuthStore = create<AuthState>((set) => ({
	username: '',
	email: '',
	token: null,
	tokenType: null,
	state: false,
	setUsername: (username) => set({ username }),
	setEmail: (email) => set({ email }),
	setToken: (token) => set({ token }),
	setTokenType: (tokenType) => set({ tokenType }),
	setState: (state) => set({ state }),
}))

type ProjectState = {
	project_name: string
	token: string | null
	tokenType: string | null
	state: boolean
	setProjectName: (project_name: string) => void
	setToken: (token: string) => void
	setTokenType: (tokenType: string) => void
	setState: (state: boolean) => void
}

export const projectAuthStore = create<ProjectState>((set) => ({
	project_name: '',
	token: null,
	tokenType: null,
	state: false,
	setProjectName: (project_name) => set({ project_name }),
	setToken: (token) => set({ token }),
	setTokenType: (tokenType) => set({ tokenType }),
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
