import axios from 'axios'

const api = axios.create({
    // baseURL:'http://localhost:5000'
    baseURL:'https://sms-development-server.herokuapp.com/'

})

export default api
