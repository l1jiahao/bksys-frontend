var axios = require('axios')

export function getAllRecord () {
    // 可用
    var config = {
        method: 'get',
        // url: 'http://127.0.0.1:4523/m1/4444180-4090006-default/book/get_all',
        url: '/api/book/get_all',
        headers: {
            'User-Agent': 'Apifox/1.0.0 (https://apifox.com)'
        }
    }
    return axios(config)
}

export function getAllClassroomRecord () {
    // 可用
    var config = {
        method: 'get',
        // url: 'http://127.0.0.1:4523/m1/4444180-4090006-default/classroom/get_all_record',
        url: '/api/classroom/get_all_record',
        headers: {
            'User-Agent': 'Apifox/1.0.0 (https://apifox.com)'
        }
    }
    return axios(config)
}
