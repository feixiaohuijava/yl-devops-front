const _expires = 60 * 1000 * 30

export default {

  set (key, value) {
    let expires = new Date().getTime() + _expires
    let data = JSON.stringify({ expires, value })
    localStorage.setItem(key, data)
  },

  get (key) {
    let expires = new Date().getTime() + _expires
    let data = localStorage.getItem(key)
    if (data) {
      let dataObj = JSON.parse(data)
      if (dataObj.expires > new Date().getTime()) {
        this.set(key, dataObj.value)
        return dataObj.value
      }
    }
    this.remove(key)
    return ''
  },

  remove (key) {
    let expires = new Date().getTime() + _expires
    localStorage.removeItem(key)
  },

  clear () {
    let expires = new Date().getTime() + _expires
    localStorage.clear()
  }
}
