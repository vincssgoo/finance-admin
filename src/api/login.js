import request from '@/utils/request'

export function login(username, password) {
  return request({
    url: '/api/backend/login',
    method: 'post',
    data: {
      username,
      password
    }
  })
}

export function getInfo(token) {
  return request({
    url: '/api/backend/admin/info',
    method: 'get',
    params: { }
  })
}

// export function logout() {
//   return request({
//     url: '/api/backend/user/logout',
//     method: 'post'
//   })
// }
