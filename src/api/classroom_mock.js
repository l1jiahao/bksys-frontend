var axios = require('axios')

export function findClassroom (params) {
    var config = {
        method: 'post',
        // url: 'http://127.0.0.1:4523/m1/4444180-4090006-default/classroom/find',
        url: '/api/classroom/find',
        headers: {
            'User-Agent': 'Apifox/1.0.0 (https://apifox.com)',
            'Content-Type': 'application/json'
        }
    }
    return axios(config)
}

export function findAllAddress () {
    // 可用
    var config = {
        method: 'get',
        // url: 'http://127.0.0.1:4523/m1/4444180-4090006-default/address/findall',
        url: '/api/address/findall',
        headers: {
            'User-Agent': 'Apifox/1.0.0 (https://apifox.com)'
        }
    }
    return axios(config)
}

export function avaliDesk (params) {
    // var data = JSON.stringify({
    // "room_id": 420000199512134500,
    // "start_time": "10:00",
    // "end_time": "12:00"
    // });

    var config = {
        method: 'post',
        // url: 'http://127.0.0.1:4523/m1/4444180-4090006-default/classroom/avali_desk',
        url: '/api/classroom/avali_desk',
        headers: {
            'User-Agent': 'Apifox/1.0.0 (https://apifox.com)',
            'Content-Type': 'application/json'
        },
        data: params
    }
    return axios(config)
}

export function bookDesk (params) {
    var config = {
        method: 'post',
        // url: 'http://127.0.0.1:4523/m1/4444180-4090006-default/book/do_book',
        url: '/api/book/do_book',
        headers: {
            'User-Agent': 'Apifox/1.0.0 (https://apifox.com)',
            'Content-Type': 'application/json'
        },
        data: params
    }

    return axios(config)
}

export function addAddress (params) {
    // 可用
    var config = {
        method: 'post',
        // url: 'http://127.0.0.1:4523/m1/4444180-4090006-default/address/findall',
        url: '/api/address/add',
        headers: {
            'User-Agent': 'Apifox/1.0.0 (https://apifox.com)'
        },
        data: params
    }
    return axios(config)
}

export function addClassroom (params) {
    // 可用
    var config = {
        method: 'post',
        // url: 'http://127.0.0.1:4523/m1/4444180-4090006-default/address/findall',
        url: '/api/classroom/create',
        headers: {
            'User-Agent': 'Apifox/1.0.0 (https://apifox.com)'
        },
        data: params
    }
    return axios(config)
}

export function getCaptcha (params) {
    // 可用
    var config = {
        method: 'post',
        // url: 'http://127.0.0.1:4523/m1/4444180-4090006-default/classroom/captcha',
        url: '/api/classroom/captcha',
        headers: {
            'User-Agent': 'Apifox/1.0.0 (https://apifox.com)',
            'Content-Type': 'application/json'
        },
        data: params
    }
    return axios(config)
}

export function alterTime (params) {
    // 可用
    var config = {
        method: 'post',
        // url: 'http://127.0.0.1:4523/m1/4444180-4090006-default/classroom/captcha',
        url: '/api/classroom/alter_time',
        headers: {
            'User-Agent': 'Apifox/1.0.0 (https://apifox.com)',
            'Content-Type': 'application/json'
        },
        data: params
    }
    return axios(config)
}

export function alterStatus (params) {
    // 可用
    var config = {
        method: 'post',
        url: '/api/classroom/alter_status',
        headers: {
            'User-Agent': 'Apifox/1.0.0 (https://apifox.com)',
            'Content-Type': 'application/json'
        },
        data: params
    }
    return axios(config)
}

export function alterDeskStatus (params) {
    // 可用
    var config = {
        method: 'post',
        url: '/api/seat/alter_bonus',
        headers: {
            'User-Agent': 'Apifox/1.0.0 (https://apifox.com)',
            'Content-Type': 'application/json'
        },
        data: params
    }
    return axios(config)
}
