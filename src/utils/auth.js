import Cookies from 'js-cookie'

const TokenKey = 'hrsass-token' // token存储到本地储存-->key

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

const timeKey = 'time_key' // 设置一个独一无二的key

// 获取时间戳
export function getTime() {
  return Cookies.get(timeKey)
}
// 设置时间戳
export function setTime() {
  Cookies.set(timeKey, Date.now())
}
