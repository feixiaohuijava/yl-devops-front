import http from '@/utils/request'

export default {
  scanHostList (param) { return http.post('/init/scan/', param) },
  updateRepo (param) { return http.post('/init/repo/', param) },
  bondCreate (param) { return http.post('/init/bond/', param) },
  bridgeCreate (param) { return http.post('/init/bridge/', param) },
  vlanCreate (param) { return http.post('/init/vlan/', param) },
  saltAuthorize (param) { return http.post('/init/salt/key/', param) },
  getNicList (param) { return http.get(`/init/network/${param.host_id}/`, param) },
  getDetailNetwork (param) { return http.get(`/init/network/${param.host_id}/${param.id}/`, param) },
  updateNetwork (param) { return http.put(`/init/network/${param.host_id}/${param.id}/`, param) },
  getSaltkeyList (param) { return http.get('/init/salt/key/', param) },
  deleteSaltKey (param) { return http.delete(`/init/salt/key/${param.id}`, param) },
  bondGetDevice (param) { return http.get(`/init/canbond/${param.host_id}/`, param) },
  deleteDevice (param) { return http.delete(`/init/network/${param.host_id}/${param.name}/`) },
  bridgeGetDevice (param) { return http.get(`/init/canbridge/${param.host_id}/`, param) },
  vlanGetDevice (param) { return http.get(`/init/canvlan/${param.host_id}/`) },
  updateVlan (param) { return http.put(`/init/vlan/${param.host_id}/${param.id}/`) },
  networkDone (param) { return http.post(`/init/networkdone/`, param) },
  installSaltMaster (param) { return http.post(`/init/salt/master/`, param) },
  installSaltMinion (param) { return http.post(`/init/salt/minion/`, param) },
  initComplete (param) { return http.post(`/init/saltkeydone/`, param) },
  changeHostName (param) { return http.post(`/init/hostname/`, param) }
}
