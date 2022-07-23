const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  name: state => state.user.UserInfo.username,
  userId: state => state.user.UserInfo.userId,
  avatar: state => state.user.UserInfo.staffPhoto
  // token: state => state.user.token,
  // avatar: state => state.user.avatar,
  // name: state => state.user.name
}
export default getters
