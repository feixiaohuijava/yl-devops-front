import http from '@/utils/request'

export default {
  get_domainslb (param) { return http.get('/api/servicecom/nginxdomainviewset/', param) },
  syncnginxdomainapi () { return http.post('/api/servicecom/syncnginxdomainviewset/') },
  syncdomainrecordsapi () { return http.post('/api/servicecom/syncdomainrecordsviewset/') },
  synccdnapi () { return http.post('/api/servicecom/syncdcdndomainviewset/') },
  getslbattributeapi (param) { return http.get(`/api/cmdb/aliyunslbbs/`, param) },
  patchslbbsweight (param) { return http.patch(`/api/cmdb/aliyunslbbs/${param.id}/`, param) }
}
