import http from '@/utils/request'

export default {
  getDetailConfigCenterApi (param) { return http.get(`/api/servicecom/apolloappviewset/${param.id}/`, param) },
  patchConfigCenterApi (param) { return http.patch(`/api/servicecom/apolloappviewset/${param.id}/`, param) },
  getapolloCenterApi (param) { return http.get(`/api/servicecom/apolloappviewset/`, param) },
  getPublishApolloApi (param) { return http.get(`/api/publishmodule/publishapolloviewset/`, param) },
  apolloPublishCheckApi (param) { return http.post(`/api/publishmodule/apollocheckpublishviewset/`, param) },
  publishNamespaceApi (param) { return http.patch(`/api/publishmodule/publishapolloviewset/${param.id}/`, param) },
  getApolloAppApi (param) { return http.get(`/api/servicecom/apolloappviewset/`, param) },
  syncApolloAppApi (param) { return http.post(`/api/servicecom/apolloappviewset/`, param) },
  getRabbitmqQueueApi (param) { return http.get(`/api/servicecom/rabbitmqconsumerviewset/`, param) }
}
