import http from '@/utils/request'
import saltstackdeploy from './saltstackdeploy'
import inithost from './inithost'
import operationlog from './operationlog'
import remotemanagement from './remotemanagement'
import alertmanager from './alertmanager'
import home from './home'
import dbaudit from './dbaudit'
import workorder from './workorder'
import thirdapp from './thirdapp'
import operateconfig from './operateconfig'
import publishmodule from './publishmodule'
import cmdb from './cmdb'
import servicecomponent from './servicecomponent'
import account from './account'

const api = Object.assign({}, remotemanagement, operationlog, saltstackdeploy, inithost, http, home, alertmanager, dbaudit, workorder, thirdapp, operateconfig, publishmodule, cmdb, servicecomponent, account)
export default api
