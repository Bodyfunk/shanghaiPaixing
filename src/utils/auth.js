import Cookies from 'js-cookie'

const TokenKey = 'sid'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function remove(key) {
  return Cookies.remove(key)
}
