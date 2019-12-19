import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'

export function getToken() {
  return sessionStorage.getItem(TokenKey) || Cookies.get(TokenKey)
}

export function setToken(token, keepLogin) {
  if (keepLogin) {
    // 保持登录，token在15天内有效
    return Cookies.set(TokenKey, token, { expires: 15 })
  }
  // 不保持登录，token在session周期内有效
  return sessionStorage.setItem(TokenKey, token)
}

export function removeToken() {
  sessionStorage.removeItem(TokenKey)
  Cookies.remove(TokenKey)
  return
}
