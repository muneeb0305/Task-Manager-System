import axios from 'axios'

export async function PostData(apiUrl, data, token) {
    try {
        const response = await axios.post(apiUrl, data, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
        return response.data
    }
    catch (err) {
        if(err.response.status === 401){
            throw (err.response.data.message)
        } else{
            throw (err.response.data)
        }
    }
}
