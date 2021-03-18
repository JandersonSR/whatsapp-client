import axios from 'axios'
const api = axios.create({
    // baseURL:'http://localhost:4000',
    baseURL:'https://sms-development-server.herokuapp.com/',
    headers:{
        'Access-Control-Allow-Origin': '*'
    }
})
api.defaults.headers.common.Authorization = "Bearer "+process.env.REACT_APP_WHATS_TOKEN
export default api
