var axios = require('axios')

export function findRecord (params) {
    // 可用
    var config = {
        method: 'post',
        // url: 'http://127.0.0.1:4523/m1/4444180-4090006-default/book/get_history',
        url: '/api/book/get_history',
        headers: {
            'User-Agent': 'Apifox/1.0.0 (https://apifox.com)',
            'Content-Type': 'application/json'
        },
        data: params
    }
    return axios(config)
}

export function checkIn (params) {
    var config = {
        method: 'post',
        // url: 'http://127.0.0.1:4523/m1/4444180-4090006-default/book/assign',
        url: '/api/book/assign',
        headers: {
            'User-Agent': 'Apifox/1.0.0 (https://apifox.com)',
            'Content-Type': 'application/json'
        },
        data: params
    }
    return axios(config)
}

export function cancelCheckIn (params) {
    var config = {
        method: 'post',
        // url: 'http://127.0.0.1:4523/m1/4444180-4090006-default/book/alter_status',
        url: '/api/book/alter_status',
        headers: {
            'User-Agent': 'Apifox/1.0.0 (https://apifox.com)',
            'Content-Type': 'application/json'
        },
        data: params
    }
    return axios(config)
}

export function recordAddress (params) {
    var config = {
        method: 'post',
        // url: 'http://127.0.0.1:4523/m1/4444180-4090006-default/book/alter_status',
        url: '/api/book/record_address',
        headers: {
            'User-Agent': 'Apifox/1.0.0 (https://apifox.com)',
            'Content-Type': 'application/json'
        },
        data: params
    }
    return axios(config)
}
