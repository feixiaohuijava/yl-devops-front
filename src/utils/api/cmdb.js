import http from '@/utils/request'

export default {
  selectCloudInstanceApi (param) {
    return http.get(`/api/cmdb/cloudinstance/`, param)
  },
  getProjectApi (param) {
    return http.get(`/api/cmdb/project/`, param)
  },
  getAreaApi () {
    return http.get(`/api/cmdb/area/`)
  },
  getEnvironmentApi (param) {
    return http.get(`/api/cmdb/environment/`, param)
  },
  getClusterApi () {
    return http.get(`/api/cmdb/kubernetescluster/`)
  },
  getDetailProjectApi (param) {
    return http.get(`/api/cmdb/project/${param.id}/`)
  },
  searchApplicationApi (param) {
    return http.get(`/api/cmdb/applicationinstance/`, param)
  },
  searchSubsystemApi (param) {
    return http.get(`/api/cmdb/subsystem/`, param)
  },
  searchNoticeMatchApi (param) {
    return http.get(`/api/cmdb/noticematchviewset/`, param)
  },
  searchNoticetypeApi () {
    return http.get(`/api/cmdb/noticetypeviewset/`)
  },
  multiplePatchSlbBsApi (param) {
    return http.post(`/api/cmdb/multipleslbbs/`, param)
  },
  getApplicationApi (param) {
    return http.get(`/api/cmdb/applicationinstance/`, param)
  },
  getDetailApplicationApi (param) {
    return http.get(`/api/cmdb/applicationinstance/${param.id}/`, param)
  },
  getDetailSubsystemApi (param) {
    return http.get(`/api/cmdb/subsystem/${param.id}/`, param)
  },
  syncSlbApi () {
    return http.post(`/api/cmdb/synchronizeslbviewset/`)
  },
  getsubsystemapi (param) {
    return http.get(`/api/cmdb/subsystem/`, param)
  },
  getSubsystemTreeApi (param) {
    return http.get(`/api/cmdb/subsystemtreeviewset/`, param)
  },
  getBsslbApi (param) {
    return http.get(`/api/cmdb/aliyunslbbs/`, param)
  },
  //  create
  addsubsystemapi (param) {
    return http.post(`/api/cmdb/subsystem/`, param)
  },
  publishapplyviewsetapi (param) {
    return http.post(`/api/cmdb/publishapplyviewset/`, param)
  },
  multipleapplypublishapi (param) {
    return http.post(`/api/publishmodule/multiplepublishviewset/`, param)
  },
  applyPublishApi (param) {
    return http.post(`/api/publishmodule/applypublishviewset/`, param)
  },
  syncApplicationInstanceApi (param) {
    return http.post(`/api/cmdb/refreshkubernetespod/`, param)
  },
  addNoticeMatchApi (param) {
    return http.post(`/api/cmdb/noticematchviewset/`, param)
  },
  // patch
  patchProjectApi (param) {
    return http.patch(`/api/cmdb/project/${param.id}/`, param)
  },
  patchSubsystemApi (param) {
    return http.patch(`/api/cmdb/subsystem/${param.id}/`, param)
  },
  patchApplicationApi (param) {
    return http.patch(`/api/cmdb/applicationinstance/${param.id}/`, param)
  },
  // delete
  deleteProjectApi (param) {
    return http.delete(`/api/cmdb/project/${param.id}/`, param)
  },
  deleteNoticeMatchApi (param) {
    return http.delete(`/api/cmdb/noticematchviewset/${param.id}/`, param)
  },
  deleteSubsystemApi (param) {
    return http.delete(`/api/cmdb/subsystem/${param.id}/`, param)
  },
  deleteDraftPublishApi (param) {
    return http.delete(
      `/api/publishmodule/draftpublishsubsystem/${param.id}/`,
      param
    )
  },
  deleteApplicationIns (param) {
    return http.delete(`/api/cmdb/applicationinstance/${param.id}/`, param)
  }
}
