import http from '@/utils/request'

export default {
  get_sign_token () { return http.post(`/api/thirdapp/tracedataviewset/`) }
}
