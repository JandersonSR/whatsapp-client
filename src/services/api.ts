import axios from 'axios'
const api = axios.create({
    baseURL:'http://localhost:3007',
    // baseURL:'http://10.10.0.109:5003',
    // baseURL:'https://sms-production-server.herokuapp.com/',
    headers:{
        'Access-Control-Allow-Origin': '*'
    }
})
api.defaults.headers.common.Authorization = "Bearer "+ process.env.REACT_APP_WHATS_TOKEN
export default api
