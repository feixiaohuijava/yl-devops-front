import http from '@/utils/request'

export default {
  updateWorkorderapi (param) { return http.patch(`/api/dbaudit/workorderviewset/${param.redisId}/`, param) },
  getorderdblistapi (param) { return http.get(`/api/dbaudit/workorderviewset/`, param) },
  getorderdbdetailapi (param) { return http.get(`/api/dbaudit/workorderviewset/${param.id}/`) },
  deleteorderapi (param) { return http.delete(`/api/dbaudit/workorderviewset/${param.id}/`) }
}
