import http from '@/utils/request'

export default {
  getHostCount () { return http.get('/asset/hostcount/') },
  getClusterCount () { return http.get('/asset/clustercount/') },
  getIdcCount () { return http.get('/asset/idccount/') },
  getRoomCount () { return http.get('/asset/machineroomcount/') },
  getCabinetCount () { return http.get('/asset/cabinetcount/') }
}
