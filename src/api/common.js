import request from '@/utils/request'

export function getQiniuToken() {
  return request({
    url: '/api/common/upload/token',
    method: 'get',
    params: {}
  })
}

export function getVerifyCode(key) {
  return request({
    url: '/api/common/verify/code',
    method: 'get',
    params: {
      key: key
    }
  })
}

export function sendSmsCode(phone) {
  return request({
    url: '/api/common/sms/code',
    method: 'get',
    params: {
      phone: phone
    }
  })
}
