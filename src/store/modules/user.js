import { getToken, setToken, removeToken, setTime } from '@/utils/auth'
import { login, getUserInfo, getUserDetailById } from '@/api/user'

// 状态
const state = {
  token: getToken(),
  UserInfo: {}
}
// 修改状态
const mutations = {
  setUser(state, UserInfo) {
    state.UserInfo = UserInfo
  },
  // 修改token的方法
  setToken(state, token) {
    state.token = token // 修改了vuex状态
    setToken(token) // 这里的setToken是从utils里面的auth.js文件里面调用的
  },
  removeToken(state) {
    state.token = null
    removeToken()
  },
  removeUserInfo(state) {
    state.UserInfo = {}
  }
}
// 执行异步
const actions = {
  // 登录请求-->commit-->mutations
  async login(context, data) {
    // 调用登录的请求接口
    const res = await login(data)
    setTime()
    // 打印接口调用结果
    // console.log(res.data.data)

    // 获取到token存储到vuex/cookie
    context.commit('setToken', res)
  },
  // 获取用户资料action
  async getUserInfo(context) {
    const res = await getUserInfo()
    const baseInfo = await getUserDetailById(res.userId)
    context.commit('setUser', { ...res, ...baseInfo })
  },
  logout(context) {
    context.commit('removeToken')
    context.commit('removeUserInfo')
  }
}
const getters = {}
export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
