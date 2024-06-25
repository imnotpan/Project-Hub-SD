const BASE_URL = `${import.meta.env.VITE_API_URL}`

interface Headers {
	[key: string]: string
}

const apiRequest = async (
	route: string,
	method: string,
	header: Headers,
	body?: string
): Promise<Response> => {
	try {
		const options: RequestInit = {
			method,
			headers: header,
		}
		if (body) {
			options.body = body
		}
		const response = await fetch(BASE_URL + route, options)
		return response
	} catch (error) {
		console.error('Error', error)
		throw error
	}
}

export const apiSendData = (
	route: string,
	header: Headers,
	body?: string
): Promise<Response> => {
	return apiRequest(route, 'POST', header, body ? body : JSON.stringify({}))
}

export const apiGetData = (
	route: string,
	header: Headers
): Promise<Response> => {
	return apiRequest(route, 'GET', header)
}

export const apiDeleteData = (
	route: string,
	header: Headers
): Promise<Response> => {
	return apiRequest(route, 'DELETE', header)
}

export const apiPatchData = (
	route: string,
	header: Headers
): Promise<Response> => {
	return apiRequest(route, 'PATCH', header)
}
