// 权限拦截 导航守卫 路由守卫  router
import router from './router'
// 引入store 因为里面有token
import store from './store'

import NProgress from 'nprogress' // 引入一份进度条插件
import 'nprogress/nprogress.css' // 引入进度条样式
// 白名单
const loginPath = '/login'
const notFoundPath = '/404'
const whitelist = [loginPath, notFoundPath]
// 监听路由变化
router.beforeEach(async(to, from, next) => {
  NProgress.start() // 开启进度条
  // 获取到token
  const token = store.getters.token
  // console.log(token)
  // 1:是否有token（是否登录）
  if (token) {
    // 只有有token 我就获取用户信息 -->只有页面跳转  就会发请求获取用户信息
    // 第一次进去界面的获取，路由发生的跳转的时候就不用获取

    // 只要token
    // 没有用户信息的时候
    if (!store.getters.userId) {
      await store.dispatch('user/getUserInfo')
    }
    // 判断是否去登录页面
    if (to.path === loginPath) {
      next('/') // 跳转到首页
    } else {
      next() // 直接放行
    }
  } else {
    // 判断是否在白名单/login
    if (whitelist.includes(to.path)) {
      next()
    } else {
      // 如果没有token 同时要去界面不是白名单界面（要去有权限的界面） -->重定向登录界面
      next(loginPath)
    }
  }
})

// 后置守卫
router.afterEach(function() {
  setTimeout(() => {
    NProgress.done() // 关闭进度条
  }, 2000)
})
