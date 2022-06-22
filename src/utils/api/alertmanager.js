import http from '@/utils/request'

export default {
  get_alertRule (param) { return http.get('/api/webhookmanager/alertruleviewset/', param) },
  get_prometheus_url () { return http.get('/api/servicecom/prometheusviewset/') },
  get_ali_alertRule (param) { return http.get('/api/webhookmanager/aliruleviewset/', param) },
  collectrulesviewset (param) { return http.post('/api/webhookmanager/collectrulesviewset/', param) },
  addCluster (param) { return http.post('/api/cmdb/kubernetescluster/', param) },
  syncalertrulerobotapi () { return http.post('/api/webhookmanager/alertruleaddrobotviewset/') },
  syncalialertrulerobotapi () { return http.post('/api/webhookmanager/aliruleviewset/') },
  deleteUnuseeRuleApi () { return http.post('/api/webhookmanager/deleteunuseruleviewset/') },
  multipleaddrobot (param) { return http.post('/api/webhookmanager/multipleaddrobot/', param) },
  deleteAlertruleRobotApi (param) { return http.delete(`/api/webhookmanager/multipleaddrobot/${param.id}/`, param) },
  deleteAlertruleApi (param) { return http.delete(`/api/webhookmanager/alertruleviewset/${param.id}/`, param) },
  searchAlertLogApi (param) { return http.get('/api/webhookmanager/alertrecordviewset/', param) },
  getAliAlertRuleApi (param) { return http.get(`/api/webhookmanager/aliruleviewset/${param.id}/`) },
  getRobotListApi () { return http.get(`/api/webhookmanager/robotviewset/`) },
  getGroupLabelKeyApi () { return http.get(`/api/webhookmanager/grouplabelkeyviewset/`) },
  patchAliAlertRuleApi (param) { return http.patch(`/api/webhookmanager/aliruleviewset/${param.id}/`, param) },
  silenceAlertApi (param) { return http.post(`/api/webhookmanager/silenceviewset/`, param) },
  getAlertOrderApi (param) { return http.get(`/api/webhookmanager/alertorderviewset/${param.id}/`, param) },
  // list
  get_alertGroup (param) { return http.get('/api/webhookmanager/alertgroupviewset/', param) },
  get_alertanalysis (param) { return http.get('/api/alertanalysis/apidataviewset/', param) },
  // retrieve
  getDetailAlertRuleApi (param) { return http.get(`/api/webhookmanager/alertruleviewset/${param.id}/`, param) },
  // create
  createAlertRuleApi (param) { return http.post(`/api/webhookmanager/alertruleviewset/`, param) },
  createAlertGroupApi (param) { return http.post(`/api/webhookmanager/alertgroupviewset/`, param) },
  // patch
  patchAlertOrderApi (param) { return http.patch(`/api/webhookmanager/alertorderviewset/${param.id}/`, param) },
  patchAlertRuleApi (param) { return http.patch(`/api/webhookmanager/alertruleviewset/${param.id}/`, param) },
  patchMonitoringAlertRuleApi (param) { return http.patch(`/api/webhookmanager/alertrulemetadataviewset/${param.id}/`, param) },
  // destory
  delteAlertGroupApi (param) { return http.delete(`/api/webhookmanager/alertgroupviewset/${param.id}/`, param) }
}
