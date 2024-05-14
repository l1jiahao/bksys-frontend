var axios = require('axios')

export function findClassroom (params) {
    var config = {
        method: 'post',
        url: 'http://127.0.0.1:4523/m1/4444180-4090006-default/classroom/find',
        headers: {
            'User-Agent': 'Apifox/1.0.0 (https://apifox.com)',
            'Content-Type': 'application/json'
        },
        data: params
    }
    return axios(config)
}

export function findAllAddress () {
    var config = {
        method: 'get',
        url: 'http://127.0.0.1:4523/m1/4444180-4090006-default/address/findall',
        headers: {
            'User-Agent': 'Apifox/1.0.0 (https://apifox.com)'
        }
    }
    return axios(config)
}
