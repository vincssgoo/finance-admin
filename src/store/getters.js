const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  language: state => state.app.language,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  username: state => state.user.username,
  roles: state => state.user.roles,
  permissions: state => state.user.permissions,
  routers: state => state.permissions.routers,
  addRouters: state => state.permissions.addRouters,
  user: state => state.user,
}
export default getters
