import axios from 'axios'

export async function FetchData(apiUrl, token) {
    try {
        const response = await axios.get(apiUrl, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
        return response.data
    }
    catch (err) {
        const error = 'Error in fetchiing'
        throw error
    }
}
