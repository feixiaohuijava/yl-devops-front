import http from '@/utils/request'

export default {
  inspection (param) { return http.get(`/rac/inspect/${param.id}/`, param) },
  inspectionCpu (param) { return http.get(`/rac/cpu/${param.id}/`, param) },
  inspectionHarddisk (param) { return http.get(`/rac/harddisk/${param.id}/`, param) },
  inspectionMemory (param) { return http.get(`/rac/memory/${param.id}/`, param) },
  inspectionNic (param) { return http.get(`/rac/nic/${param.id}/`, param) },
  inspectionPower (param) { return http.get(`/rac/power/${param.id}/`, param) },
  inspectionThemal (param) { return http.get(`/rac/thermal/${param.id}/`, param) },
  historyInspection (param) { return http.get('/rac/inspection/', param) },
  racPoweroff (param) { return http.post('/rac/poweroff/', param) },
  racPoweron (param) { return http.post('/rac/poweron/', param) },
  racPushpowerbutton (param) { return http.post('/rac/pushpowerbutton/', param) },
  racRestart (param) { return http.post('/rac/restart/', param) },
  clustercount (param) { return http.get('/asset/clustercount/', param) },
  cabinetcount (param) { return http.get('/asset/cabinetcount/', param) },
  hostcount (param) { return http.get('/asset/hostcount/', param) },
  idccount (param) { return http.get('/asset/idccount/', param) },
  machineroomcount (param) { return http.get('/asset/machineroomcount/', param) }
}
