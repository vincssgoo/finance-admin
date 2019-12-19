import {
  login,
  logout,
  getInfo
} from '@/api/login'
import {
  getToken,
  setToken,
  removeToken
} from '@/utils/auth'

const user = {
  state: {
    token: getToken(),
    username: '',
    avatar: '',
    roles: [],
    permissions: [],
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, username) => {
      state.username = username
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_PERMISSIONS: (state, permissions) => {
      state.permissions = permissions
    }
  },

  actions: {
    // 登录
    Login({
      commit
    }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        login(username, userInfo.password).then(response => {
          const data = response.data
          setToken(data.token, userInfo.keepLogin)
          commit('SET_TOKEN', data.token)
          commit('SET_NAME', data.user.username)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    login({
      commit
    }, userInfo) {
      const {
        username,
        password
      } = userInfo
      return new Promise((resolve, reject) => {
        login({
          username: username.trim(),
          password: password
        }).then(response => {
          const {
            data
          } = response
          commit('SET_TOKEN', data.token)
          setToken(data.token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 获取用户信息
    GetInfo({
      commit,
      state
    }) {
      return new Promise((resolve, reject) => {
        getInfo(state.token).then(response => {
          const data = response.data
          if (data.permissions && data.permissions.length > 0) { // 验证返回的roles是否是一个非空数组
            commit('SET_NAME', data.user.username)
            commit('SET_PERMISSIONS', data.permissions)
          } else {
            reject('抱歉，您无权限访问');
          }
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    // LogOut({ commit, state }) {
    //   return new Promise((resolve, reject) => {
    //     logout(state.token).then(() => {
    //       commit('SET_TOKEN', '')
    //       commit('SET_ROLES', [])
    //       removeToken()
    //       resolve()
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },

    // 前端 登出
    FedLogOut({
      commit
    }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        commit('SET_PERMISSIONS', [])
        removeToken()
        resolve()
      })
    }
  }
}

export default user
