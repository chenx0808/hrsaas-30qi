
import store from '@/store'
import axios from 'axios'
import { Message } from 'element-ui'
import { getTime } from '@/utils/auth'
import router from '@/router'

const request = axios.create({
  baseURL: process.env.VUE_APP_BASE_API
}) // 创建axios实例

// token过期时间
const timeOut = 600000
// 如果没有过期返回token
// 如果过期了返回false
function isCheckTime() {
  return Date.now() - getTime() < timeOut
}

// 请求拦截器
request.interceptors.request.use((config) => {
  // 如果token存在需要把token携带到请求头里
  const token = store.getters.token
  // console.log(token)
  if (token) {
    // token携带到请求头
    if (isCheckTime()) {
      config.headers.Authorization = `Bearer ${token}`
    } else {
      Message.error('登录过期,请重新登录')
      store.dispatch('user/logout')
      router.push('/')
      return Promise.reject('')
    }
  }
  return config
}, error => Promise.reject(error))

// 响应拦截器
request.interceptors.response.use(response => {
  // 解构从后端返回的数据和状态
  const { data: { success, message, data }} = response
  // 判断success是否为true
  // trur--》请求才是成功-->data可以用
  if (success) {
    return data
  }
  // 如果代码走到这里 证明success不存在 -->接口请求有问题
  // 运行错误提示
  Message.error(message || '服务器出错')

  // 失败的promise-->接口请求的地方报错
  return Promise.reject(message || '服务器出错')
}, error => {
  if (error.response.status === 401) {
    store.dispatch('user/logout')
    router.push('/login')
  }
  Message.error(error.response?.data?.message || '系统出错')
  return Promise.reject(error)
})

export default request // 默认导出request请求
