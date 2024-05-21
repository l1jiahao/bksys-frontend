var axios = require('axios')

export function editInfo (params) {
    var config = {
        method: 'post',
        url: 'http://127.0.0.1:4523/m1/4444180-4090006-default/user/alter',
        headers: {
            'User-Agent': 'Apifox/1.0.0 (https://apifox.com)',
            'Content-Type': 'application/json'
        },
        data: params
    }
    return axios(config)
}
