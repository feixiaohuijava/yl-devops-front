import api from './api/index'
const email = (rule, value, callback) => {
  if (!!value && /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/.test(value)) {
    callback()
  } else if (!value) {
    callback()
  } else {
    callback(new Error('邮箱格式不正确'))
  }
}
const email2 = (rule, value, callback) => {
  if (!!value && /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/.test(value)) {
    callback()
  } else if (!value) {
    callback(new Error('邮箱不能为空'))
  } else {
    callback(new Error('邮箱格式不正确'))
  }
}
const phone = (rule, value, callback) => {
  if (!!value && /^1\d{10}$/.test(value)) {
    callback()
  } else if (!value) {
    callback(new Error('不能为空'))
  } else {
    callback(new Error('手机号格式不正确'))
  }
}
// 身份证
export function checkIdNum (rule, value, callback) {
  const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
  if (!value) {
    return callback(new Error('证件号码不能为空'))
  } else if (!reg.test(value)) {
    return callback(new Error('证件号码不正确'))
  } else {
    callback()
  }
}

// 整数
export function checkInterNum (rule, value, callback) {
  const reg = /^[0-9]*[1-9][0-9]*$/
  if (!value) {
    return callback(new Error('请填写整数'))
  } else if (!reg.test(value)) {
    return callback(new Error('请输入整数'))
  } else {
    callback()
  }
}
// Ip校验
export function checkIP (rule, value, callback) {
  const reg = /^(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])$/
  if (!value) {
    return callback(new Error('不能为空'))
  } else if (!reg.test(value)) {
    return callback(new Error('请输入正确的IP格式'))
  } else {
    callback()
  }
}
// 端口校验
export function checkPort (rule, value, callback) {
  const reg = /^([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-4]\d{4}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/
  if (!value) {
    return callback(new Error('不能为空'))
  } else if (!reg.test(value)) {
    return callback(new Error('请输入正确的端口格式'))
  } else {
    callback()
  }
}
// 路径校验
export function checkPath (rule, value, callback) {
  const reg = /^\/[a-zA-Z0-9-_./]+$/
  if (!value) {
    callback()
  } else if (!reg.test(value)) {
    return callback(new Error('请输入正确的路径格式'))
  } else {
    callback()
  }
}
// IP
const validateIp = (rule, value, callback) => {
  console.log(value)
  const params = {
    PrivateIp: value
  }
  api.getPrivateIp(params).then(function (data) {
    console.log(data)
    if (data.code === 4000) {
      callback()
    } else {
      callback(new Error(`${data.msg}`))
    }
  })
}

// connection_name
const connectName = (rule, value, callback) => {
  console.log(value)
  const params = {
    connection_name: value
  }
  api.checkConnectName(params).then(function (res) {
    console.log(res)
    if (res.data === 0) {
      callback()
    } else {
      callback(new Error('该连接名已使用'))
    }
  })
}
// connection_name
const host = (rule, value, callback) => {
  console.log(value)
  const params = {
    host: value
  }
  api.checkHost(params).then(function (res) {
    console.log(res)
    if (res.data === 0) {
      callback()
    } else {
      callback(new Error('该连接名已使用'))
    }
  })
}

const url = (rule, value, callback) => {
  if (!!value && /[\u4E00-\u9FA5]/g.test(value)) {
    callback(new Error('URL不支持输入汉字'))
  } else if (!value) {
    callback(new Error('URL不能为空'))
  } else {
    callback()
  }
}

const checkVersion = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入版本号'))
  } else {
    let objRegExp = /^\d+\.\d+\.\d+$/
    objRegExp.test(value) ? callback() : callback(new Error('版本号格式错误'))
  }
}

export default {
  empty: [{required: true, message: '不能为空', trigger: 'blur'}],
  email: [{ required: true, validator: email, trigger: 'blur' }],
  email2: [{ required: true, validator: email2, trigger: 'blur' }],
  phoneNum: [{ required: false, validator: phone, trigger: 'blur' }],
  InterNum: [{ required: true, validator: checkInterNum, trigger: 'blur' }],
  validateIp: [{ required: true, validator: validateIp, trigger: 'blur' }],
  connectName: [{ required: true, validator: connectName, trigger: 'blur' }],
  host: [{ required: true, validator: host, trigger: 'blur' }],
  url: [{ required: true, validator: url, trigger: 'blur' }],
  version: [{ required: true, validator: checkVersion, trigger: 'blur' }],
  gitlab_url: [{ required: true, message: 'Git仓库地址不能为空', trigger: 'blur' }],
  checkIP: [{ required: true, validator: checkIP, trigger: 'blur' }],
  checkPort: [{ required: true, validator: checkPort, trigger: 'blur' }],
  checkPath: [{ required: false, validator: checkPath, trigger: 'blur' }]
}
