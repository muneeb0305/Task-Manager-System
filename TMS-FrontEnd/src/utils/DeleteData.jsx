import axios from 'axios'

export async function DeleteData(apiUrl, token) {
    try {
        const response = await axios.delete(apiUrl, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
        return response.data
    }
    catch (err) {
        throw (err)
    }
}
