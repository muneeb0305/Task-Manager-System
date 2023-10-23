import axios from 'axios'

export async function PutData(apiUrl, data, token) {
    try {
        const response = await axios.put(apiUrl, data, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
        return response.data
    }
    catch (err) {
        throw (err.response.data)
    }
}
