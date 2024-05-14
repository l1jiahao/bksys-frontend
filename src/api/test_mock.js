var axios = require('axios')

export function findAll () {
    var config = {
        method: 'get',
        url: 'http://127.0.0.1:4523/m1/4444180-4090006-default/address/findall',
        headers: {
           'User-Agent': 'Apifox/1.0.0 (https://apifox.com)'
        }
     }
    return axios(config)
}
