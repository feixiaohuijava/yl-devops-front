import http from '@/utils/request'

export default {
  searchJenkinBuildLogApi (param) { return http.get('/api/publishmodule/jenkinsbuildlogviewset/', param) },
  getdetailpublishorderapi (param) { return http.get(`/api/publishmodule/publishorderviewset/${param.id}/`, param) },
  getpublishorderdblistapi () { return http.get(`/api/publishmodule/publishorderviewset/`) },
  publishOrderDetailApi (param) { return http.get(`/api/publishmodule/publishorderviewset/${param.id}/`, param) },
  updatepublishorderapi (param) { return http.patch(`/api/publishmodule/publishorderviewset/${param.id}/`, param) },
  publishOrderPatchApi (param) { return http.post(`/api/publishmodule/publishorderpatchviewset/`, param) },
  deletepublishorderapi (param) { return http.delete(`/api/publishmodule/publishorderviewset/${param.id}/`, param) },
  deletepublishsubsystemapi (param) { return http.delete(`/api/publishmodule/publishordersystemviewset/${param.id}/`, param) },
  jenkinsbuildapi (param) { return http.patch(`/api/publishmodule/publishordersystemviewset/${param.id}/`, param) },
  getpublishsubsystemapi (param) { return http.get(`/api/publishmodule/publishordersystemviewset/`, param) },
  getJenkinsBuildLogapi (param) { return http.get(`/api/publishmodule/jenkinsprojobconsoleviewset/${param.id}/`, param) },
  buildapplicationapi (param) { return http.post(`/api/publishmodule/jenkinsbuildviewset/`, param) },
  getlastbuildnumberapi (param) { return http.post(`/api/publishmodule/jenkinsbuildnumberviewset/`, param) }
}
