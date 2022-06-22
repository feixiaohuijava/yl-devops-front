import Axios from 'axios'
import qs from 'qs'
import router from '../router'

const axios = Axios.create({
  baseURL: '/',
  transformRequest: [
    data => {
      data = qs.stringify(data)
      return data
    }
  ],
  // withCredentials: true,
  /**
   * 设置Content-Type
   */
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
})

// axios.interceptors.request.use(
//   config => {
//     const user = localStore.get('user')
//     if (user && user.token) { // 判断是否存在token，如果存在的话，则每个http header都加上token
//       config.headers.Authorization = `Token token=${user.token}`
//     }
//     return config
//   },
//   err => {
//     return Promise.reject(err)
//   }
// )

axios.interceptors.response.use(
  response => {
    return response
  },
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 返回 401清除token信息并跳转到登录页面
          router.replace({
            path: 'login',
            query: { redirect: router.currentRoute.fullPath }
          })
          break
      }
    }
    return Promise.reject(error.response.data) // 返回接口返回的错误信息
  }
)

let api = 'api'
export const login = params => {
  return axios.post(`${api}/admin/teacher/login`, params).then(resp => {
    return resp
  })
}

export const menusApi = () => {
  return new Promise(function (resolve, reject) {
    let menu = JSON.parse(window.sessionStorage.getItem('menu'))
    if (menu) {
      resolve(menu)
    } else {
      reject(error)
    }
  })
}

export const logout = params => {}
