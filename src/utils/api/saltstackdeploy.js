import http from '@/utils/request'

export default {
  // 获取负责人和开发者
  // componentlist (param) { return http.get('/salt_openstack/get_all_component_name/', param) },
  detail_deploySlsRecord (param) {
    return http.get('/salt_openstack/deployslsrecord/', param)
  },
  salt_openstack_cancel_deploy (param) {
    return http.post('/salt_openstack/cancel_deploy/', param)
  },
  salt_openstack_install_service (param) {
    return http.post('/salt_openstack/install_service/', param)
  },
  get_environment_host (param) {
    return http.get('/salt_openstack/environmenthost/', param)
  },
  add_environment_host (param) {
    return http.post('/salt_openstack/environmenthost/', param)
  },
  add_typeenvironment (param) {
    return http.post('/salt_openstack/typeenvironment/', param)
  },
  componentlist (param) {
    return http.get('/salt_openstack/componentname/', param)
  },
  get_componentname_sls (param) {
    return http.get('/salt_openstack/componentnamesls/', param)
  },
  add_componentname_sls (param) {
    return http.post('/salt_openstack/componentnamesls/', param)
  },
  add_component_name (param) {
    return http.post('/salt_openstack/componentname/', param)
  },
  delete_component_name (param) {
    return http.delete(`/salt_openstack/componentname/${param.id}/`, param)
  },
  patch_component_name (param) {
    return http.patch(`/salt_openstack/componentname/${param.id}/`, param)
  },
  get_detail_component (param) {
    return http.get(`/salt_openstack/componentname/${param.id}/`, param)
  },
  get_detail_typeenvironmentname (param) {
    return http.get(`/salt_openstack/typeenvironment/${param.id}/`, param)
  },
  get_idc_list () {
    return http.get('/asset/idc/')
  },
  get_host_list (param) {
    return http.get('/asset/host/', param)
  },
  get_host_brief (param) {
    return http.get('/salt_openstack/hostbrief/', param)
  },
  get_typeEnvironment (param) {
    return http.get('/salt_openstack/typeenvironment/', param)
  },
  get_machineroom_list (param) {
    return http.get('/asset/machineroom/', param)
  },
  get_cabinets_list (param) {
    return http.get('/asset/cabinet/', param)
  },
  get_brand_list () {
    return http.get('/asset/brand/')
  },
  get_kubernetesnamespace (param) {
    return http.get('/api/cmdb/kubernetesnamespace/', param)
  },
  get_elasticsearchviewset () {
    return http.get('/api/servicecom/elasticsearchviewset/')
  },
  get_searchindexviewset (param) {
    return http.get('/api/servicecom/searchindexviewset/', param)
  },
  patch_host (param) {
    return http.patch(`/asset/host/${param.id}/`, param)
  },
  patch_idc (param) {
    return http.patch(`/asset/idc/${param.id}/`, param)
  },
  patch_machineroom (param) {
    return http.patch(`/asset/machineroom/${param.id}/`, param)
  },
  patch_cabinet (param) {
    return http.patch(`/asset/cabinet/${param.id}/`, param)
  },
  patch_brand (param) {
    return http.patch(`/asset/brand/${param.id}/`, param)
  },
  get_detail_host (param) {
    return http.get(`/asset/host/${param.id}/`, param)
  },
  get_detail_machineroom (param) {
    return http.get(`/asset/machineroom/${param.id}/`, param)
  },
  get_detail_cabinet (param) {
    return http.get(`/asset/cabinet/${param.id}/`, param)
  },
  get_detail_idc (param) {
    return http.get(`/asset/idc/${param.id}/`, param)
  },
  add_host (param) {
    return http.post('/asset/host/', param)
  },
  add_brand (param) {
    return http.post('/api/cmdb/brand/', param)
  },
  add_project (param) {
    return http.post('/api/cmdb/project/', param)
  },
  add_idc (param) {
    return http.post('/asset/idc/', param)
  },
  add_machine (param) {
    return http.post('/asset/machineroom/', param)
  },
  add_cabinet (param) {
    return http.post('/asset/cabinet/', param)
  },
  add_applicationinstance (param) {
    return http.post('/api/cmdb/applicationinstance/', param)
  },
  add_area (param) {
    return http.post('/api/cmdb/area/', param)
  },
  delete_area (param) {
    return http.delete(`/api/cmdb/area/${param.id}/`, param)
  },
  delete_idc (param) {
    return http.delete(`/asset/idc/${param.id}/`, param)
  },
  delete_machine_room (param) {
    return http.delete(`/asset/machineroom/${param.id}/`, param)
  },
  delete_cabinet_room (param) {
    return http.delete(`/asset/cabinet/${param.id}/`, param)
  },
  delete_brand (param) {
    return http.delete(`/asset/brand/${param.id}/`, param)
  },
  delete_host (param) {
    return http.delete(`/asset/host/${param.id}/`, param)
  },
  delete_typeenvironment (param) {
    return http.delete(`/salt_openstack/typeenvironment/${param.id}/`, param)
  },
  delete_environmenthost (param) {
    return http.delete(`/salt_openstack/environmenthost/${param.id}/`, param)
  },
  delete_componentname_sls (param) {
    return http.delete(`/salt_openstack/componentnamesls/${param.id}/`, param)
  },
  userLogin (param) {
    return http.post(`/api/account/login/`, param)
  },
  // jtexpress
  searchMachineApi (param) {
    return http.get(`/api/asset/machine/`, param)
  }
}
