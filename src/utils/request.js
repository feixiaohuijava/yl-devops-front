/*
 *  axios 二次封装
 *
 * */
import axios from 'axios'
import router from '../router'
import { MessageBox, Message } from 'element-ui'

let loginUrl = '/login'
axios.defaults.baseURL = process.env.API_URL
axios.defaults.headers = { 'X-Requested-With': 'XMLHttpRequest' }
axios.defaults.timeout = 60000

// 请求拦截器
axios.interceptors.request.use(
  config => {
    if (router.history.current.path !== loginUrl) {
      let token = window.sessionStorage.getItem('token')
      if (token == null) {
        router.replace({
          path: loginUrl,
          query: { redirect: router.currentRoute.fullPath }
        })
        return false
      } else {
        config.headers['Authorization'] = 'JWT ' + token
      }
    }
    return config
  },
  error => {
    Message.warning(error)
    return Promise.reject(error)
  }
)
// 响应拦截器即异常处理
axios.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    // store.dispatch('setLoading', false)
    if (error.response !== undefined) {
      switch (error.response.status) {
        case 400:
          let keys = Object.keys(error.response.data)
          if (error.response.data.hasOwnProperty('msg')) {
            MessageBox.alert(error.response.data.msg, '错误信息')
          } else if (keys.length > 0) {
            MessageBox.alert(
              keys[0] + ':' + error.response.data[keys[0]],
              '错误信息'
            )
          } else {
            MessageBox.alert('400 错误的请求', '错误信息')
          }
          break
        case 401:
          if (router.currentRoute.fullPath === '/login') {
            Message.error('401 认证失败。')
          } else {
            if (window.sessionStorage.getItem('token') === null) {
              MessageBox.confirm('401 请先登录', '提示', {
                confirmButtonText: '登录',
                cancelButtonText: '取消',
                type: 'warning'
              })
                .then(() => {
                  window.sessionStorage.clear()
                  router.replace({ path: loginUrl })
                })
                .catch(() => {
                  window.sessionStorage.clear()
                  router.replace({ path: loginUrl })
                })
            } else {
              MessageBox.confirm('401 会话已失效! 请重新登录', '提示', {
                confirmButtonText: '重新登录',
                cancelButtonText: '取消',
                type: 'warning'
              })
                .then(() => {
                  window.sessionStorage.clear()
                  router.replace({ path: loginUrl })
                })
                .catch(() => {
                  window.sessionStorage.clear()
                  router.replace({ path: loginUrl })
                })
            }
          }
          break
        case 402:
          MessageBox.confirm('402 登陆超时 ！', '提示', {
            confirmButtonText: '重新登录',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            router.replace({
              path: loginUrl,
              query: { redirect: router.currentRoute.fullPath }
            })
          })
          break
        case 403:
          MessageBox.alert('403 没有权限！', '错误信息')
          break
        case 404:
          if (error.response.data.hasOwnProperty('msg')) {
            MessageBox.alert(error.response.data.msg, '错误信息')
          } else {
            MessageBox.alert('404 找不到该网页', '错误信息')
          }
          break
        case 405:
          MessageBox.alert('405 请求方法未允许', '错误信息')
          break
        case 408:
          MessageBox.alert('408 请求超时', '错误信息')
          break
        case 500:
          if (error.response.data.hasOwnProperty('msg')) {
            let str = error.response.data.msg
            if (str.indexOf('Exception:') !== -1) {
              let arr = str.split('Exception:')
              arr[1] = `<span style="color:#f00">${arr[1]}</span>`
              str = arr.join('Exception:')
              MessageBox.alert(str, '错误信息', {
                dangerouslyUseHTMLString: true
              })
            } else {
              MessageBox.alert(str, '错误信息')
            }
          } else {
            MessageBox.alert('500 服务器端出错', '错误信息')
          }
          break
        case 501:
          MessageBox.alert('501 网络未实现', '错误信息')
          break
        case 502:
          MessageBox.alert('502 网络错误', '错误信息')
          break
        case 503:
          MessageBox.alert('503 服务不可用', '错误信息')
          break
        case 504:
          MessageBox.alert('504 网络超时', '错误信息')
          break
        case 505:
          MessageBox.alert('505 http版本不支持该请求', '错误信息')
          break
        default:
          MessageBox.alert(`连接错误${error.response.status}`, '错误信息')
      }
      if (error.response.data.hasOwnProperty('msg')) {
        return Promise.resolve(error.response.data)
      } else {
        return Promise.resolve({ msg: '' })
      }
    } else {
      console.log(error)
      return false
    }
    // return Promise.resolve(error)
  }
)

export default {
  get (url, param) {
    if (param !== undefined) {
      Object.assign(param, { _t: new Date().getTime() })
    } else {
      param = { _t: new Date().getTime() }
    }
    return new Promise((resolve, reject) => {
      axios({ method: 'get', url, params: param }).then(res => {
        resolve(res)
      })
    })
  },
  getData (url, param) {
    return new Promise((resolve, reject) => {
      axios({ method: 'get', url, params: param }).then(res => {
        if (res.code === 4000) {
          resolve(res.data)
        } else {
          Message.warning(res.msg)
        }
      })
    })
  },
  post (url, param, config) {
    return new Promise((resolve, reject) => {
      axios.post(url, param, config).then(res => {
        resolve(res)
      })
    })
  },
  patch (url, param) {
    return new Promise((resolve, reject) => {
      axios.patch(url, param).then(res => {
        resolve(res)
      })
    })
  },
  put (url, param) {
    return new Promise((resolve, reject) => {
      axios.put(url, param).then(res => {
        resolve(res)
      })
    })
  },
  delete (url, param) {
    return new Promise((resolve, reject) => {
      axios.delete(url, { data: param }).then(res => {
        resolve(res)
      })
    })
  }
  // put: axios.put,
  // _delete: axios.delete
}
