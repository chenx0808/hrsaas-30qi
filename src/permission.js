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
router.beforeEach((to, from, next) => {
  NProgress.start()
  // 获取到token
  const token = store.state.user.token
  console.log(token)
  // 1:是否有token（是否登录）
  if (token) {
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

// 路由结束
router.afterEach(function() {
  setTimeout(() => {
    NProgress.done()
  }, 2000)
})
