import axios from 'axios'
import { baseURL } from '../../data/AppConstants';

export async function HandleAPI(apiUrl, method, token, data) {
    const config = {
        baseURL: baseURL,
        method: method,
        url: apiUrl,
        data: data,
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }

    try {
        const response = await axios(config);
        return response.data
    }
    catch (err) {
        console.error('API Request Error:', err.response.status, err.response.data);
        throw (err.response.data)
    }
}
