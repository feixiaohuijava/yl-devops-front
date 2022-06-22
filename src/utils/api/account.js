import http from '@/utils/request'

export default {
  getaccountuserapi (param) {
    return http.get(`/api/account/user/`, param)
  },
  getcurrentdutyapi () {
    return http.get(`/api/account/dutyviewset/`)
  },
  patchuserapi (param) {
    return http.patch(`/api/account/user/${param.id}/`, param)
  },
  searchUserApi (param) {
    return http.get(`/api/account/user/`, param)
  },
  getPermissionApi (param) {
    return http.get(`/api/account/permission/`, param)
  },
  searchMenurApi (param) {
    return http.get(`/api/account/menu/`, param)
  },
  delete_menu (param) {
    return http.delete(`/api/account/menu/${param.id}/`, param)
  },
  add_menu (param) {
    return http.post(`/api/account/menu/`, param)
  }
}
