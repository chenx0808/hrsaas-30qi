import store from '@/store'
export const mixins = {
  // beforcreated() {
  //   console.log('我是混入进来的created')
  // },
  // mounted() {
  //   console.log('我是混入进来的mounted')
  // },
  methods: {
    checkPermission(key) {
      // console.log(store.state.user.UserInfo.roles.points)
      return !store.state.user.UserInfo.roles.points.includes(key)
    }
  }
}
