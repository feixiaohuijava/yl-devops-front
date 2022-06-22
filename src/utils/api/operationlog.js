import http from '@/utils/request'

export default {
  operationlogsearch (param) { return http.get('/account/operationlog/', param) }
}
