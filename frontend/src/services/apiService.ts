const BASE_URL = `${import.meta.env.VITE_API_URL}`

export const apiSendData = async (
	route: string,
	header: any,
	body?: string
): Promise<Response> => {
	try {
		const response = await fetch(BASE_URL + route, {
			method: 'POST',
			headers: header,
			body: body ? body : JSON.stringify({}),
		})
		return response
	} catch (error) {
		console.error('Error', error)
		throw error
	}
}

export const apiGetData = async (
	route: string,
	header: any
): Promise<Response> => {
	try {
		const response = await fetch(BASE_URL + route, {
			method: 'GET',
			headers: header,
		})
		return response
	} catch (error) {
		console.error('Error', error)
		throw error
	}
}

export const apiDeleteData = async (
	route: string,
	header: any
): Promise<Response> => {
	try {
		const response = await fetch(BASE_URL + route, {
			method: 'DELETE',
			headers: header,
		})
		return response
	} catch (error) {
		console.error('Error', error)
		throw error
	}
}

export const apiPatchData = async (
	route: string,
	header: any
): Promise<Response> => {
	try {
		const response = await fetch(BASE_URL + route, {
			method: 'PATCH',
			headers: header,
		})
		return response
	} catch (error) {
		console.error('Error', error)
		throw error
	}
}
