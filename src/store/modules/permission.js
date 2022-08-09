// 引入静态路由
import { constantRoutes, asyncRoutes } from '@/router'

const state = {
  // 储存了当前用户的所拥有的所有的路由权限  默认是静态路由
  routes: constantRoutes
}

const mutations = {
  // newRoutes动态路由
  // 请求到个人信息的时候 动态路由和静态路由进行合并
  setRoutes(state, newRoutes) {
    state.routes = [...constantRoutes, ...newRoutes]
  }
}
const actions = {
  filterRoutes(context, menus) {
    const resRoutes = asyncRoutes.filter((item) => {
      return menus.includes(item.name)
    })
    // console.log(resRoutes)
    context.commit('setRoutes', resRoutes)
    return resRoutes
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
