var Mock = require('mockjs')
var menus = require('./menus.json')

Mock.mock('/api/config/menus', 'get', menus)
