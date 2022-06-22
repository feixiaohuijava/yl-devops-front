import http from '@/utils/request'

export default {
  // selectrediskey (param) { return http.post(`/api/dbaudit/redisoperationviewset/`, param) },
  addworkorder (param) { return http.post(`/api/dbaudit/workorderviewset/`, param) },
  rediscommand (param) { return http.post(`/api/dbaudit/rediscommandviewset/`, param) },
  syncRedisApi () { return http.post(`/api/dbaudit/redisviewset/`) }
}
