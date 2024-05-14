var axios = require('axios')

var config = {
    method: 'post',
    url: 'http://127.0.0.1:4523/m1/4444180-4090006-default/address/findall',
    headers: {
        'User-Agent': 'Apifox/1.0.0 (https://apifox.com)'
    }
}
export function findAll () {
    return axios(config)
}
