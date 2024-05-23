//const BASE_URL = `${import.meta.env.VITE_API_URL}`;
const BASE_URL = `http://127.0.0.1:8000`

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
