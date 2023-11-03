import axios from 'axios'
import { API_BASE_URL } from '../../data/AppConstants';

export async function apiRequest(url, method, token, data) {
    const config = {
        baseURL: API_BASE_URL,                  // API base URL
        method,                                 // Method Name [GET, POST, PUT, DELETE]
        url,                                    // API End Point URl
        data,                                   // Data to send with request (optional)
        headers: {                              // Authentication Token
            Authorization: `Bearer ${token}`,
        },
    }

    try {
        const response = await axios(config);
        return response.data
    }
    catch (err) {
        console.error('API Request Error:', err.response.status, err.response.data);
        if (err.response.status === 401) {
            sessionStorage.removeItem('token');
            localStorage.clear()
            throw (err.response.data)
        }
        throw (err.response.data)
    }
}
