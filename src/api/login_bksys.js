var axios = require('axios')

export function login (parameter) {
   var config = {
      method: 'post',
      url: '/api/user/login',
      // url: 'http://127.0.0.1:4523/m1/4444180-4090006-default/user/login',
      headers: {
         'User-Agent': 'Apifox/1.0.0 (https://apifox.com)',
         'Content-Type': 'application/json'
      },
      data: parameter
   }
   return axios(config)
}

export function register (parameter) {
   var config = {
      method: 'post',
      url: '/api/user/sign_up',
      // url: 'http://127.0.0.1:4523/m1/4444180-4090006-default/user/login',
      headers: {
         'User-Agent': 'Apifox/1.0.0 (https://apifox.com)',
         'Content-Type': 'application/json'
      },
      data: parameter
   }
   return axios(config)
}
