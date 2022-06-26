import Vue from 'vue'
import Router from 'vue-router'
import layout from '@/views/layout'

// const originalPush = Router.prototype.push
// Router.prototype.push = function push(location) {
//   return originalPush.call(this, location).catch(err => err)
// }

Vue.use(Router)
const routes = [
  {
    path: '/login',
    component: require('../views/login.vue').default
  },
  {
    path: '/',
    component: layout,
    redirect: '/home',
    children: [
      {
        path: '/home/',
        component: require('../views/home/home.vue').default,
        meta: {
          title: '首页展示'
        }
      },
      // assert
      {
        path: '/asset_machine/',
        name: 'asset_machine',
        component: require('../views/assetmanagement/machine').default,
        meta: {
          title: '物理机'
        }
      },
      {
        path: '/machine_metadata/',
        name: 'machine_metadata',
        component: require('../views/assetmanagement/machine_metadata').default
      },
      // cmdb
      {
        path: '/area/',
        name: 'area',
        component: require('../views/cmdb/area').default,
        meta: {
          title: '区域'
        }
      },
      {
        path: '/cmdb_project/',
        name: 'cmdb_project',
        component: require('../views/cmdb/project').default,
        meta: {
          title: '项目'
        }
      },
      {
        path: '/cmdb_noticematch/',
        name: 'cmdb_noticematch',
        component: require('../views/cmdb/noticeMatch').default,
        meta: {
          title: '告警'
        }
      },
      {
        path: '/cmdb_communicationMode/',
        name: 'cmdb_communicationMode',
        component: require('../views/cmdb/communicationMode').default
      },
      {
        path: '/cmdb_subsystem/',
        name: 'cmdb_subsystem',
        component: require('../views/cmdb/subsystem').default,
        meta: {
          title: '子系统'
        }
      },
      {
        path: '/cmdb_environment/',
        name: 'cmdb_environment',
        component: require('../views/cmdb/environment').default,
        meta: {
          title: '环境'
        }
      },
      {
        path: '/cmdb_host/',
        name: 'cmdb_host',
        component: require('../views/cmdb/host').default,
        meta: {
          title: '主机'
        }
      },
      {
        path: '/hostmetadata_alicloud/',
        name: 'hostmetadata_alicloud',
        component: require('../views/cmdb/hostmetadata_alicloud').default
      },
      {
        path: '/cmdb_instance/',
        name: 'cmdb_instance',
        component: require('../views/cmdb/applicationinstance').default,
        meta: {
          title: '应用'
        }
      },
      {
        path: '/cmdb_applicationinDetails/',
        name: 'cmdb_applicationinDetails',
        component: require('../views/cmdb/applicationinDetails').default
      },
      {
        path: '/cmdb_applicationinstance_detail/',
        name: 'cmdb_applicationinstance_detail',
        component: require('../views/cmdb/applicationinstanceDetail').default
      },
      {
        path: '/cmdb_cluster/',
        name: 'cmdb_cluster',
        component: require('../views/cmdb/kubernetescluster').default,
        meta: {
          title: 'k8s集群'
        }
      },
      {
        path: '/cmdb_namespace/',
        name: 'cmdb_namespace',
        component: require('../views/cmdb/kubernetesnamespace').default,
        meta: {
          title: 'k8s命名空间'
        }
      },
      {
        path: '/cmdb_kubernetesapplication/',
        name: 'cmdb_kubernetesapplication',
        component: require('../views/cmdb/kubernetesapplication').default
      },
      {
        path: '/cmdb_ingress/',
        name: 'cmdb_ingress',
        component: require('../views/cmdb/kubernetesingress').default,
        meta: {
          title: 'k8singress'
        }
      },
      {
        path: '/cmdb_service/',
        name: 'cmdb_service',
        component: require('../views/cmdb/kubernetesservice').default,
        meta: {
          title: 'k8sservice'
        }
      },
      // servicecomponent
      {
        path: '/servicecomponent_basic/',
        name: 'servicecomponent_basic',
        component: require('../views/servicecomponent/basiccomponent').default,
        meta: {
          title: '基础组件'
        }
      },
      {
        path: '/servicecomponent_middle/',
        name: 'servicecomponent_middle',
        component: require('../views/servicecomponent/middle').default,
        meta: {
          title: '中间件'
        }
      },
      {
        path: '/servicecomponent_db/',
        name: 'servicecomponent_db',
        component: require('../views/servicecomponent/dbcomponent').default,
        meta: {
          title: 'db组件'
        }
      },
      {
        path: '/servicecomponent_prometheus/',
        name: 'servicecomponent_prometheus',
        component: require('../views/servicecomponent/prometheus').default
      },
      {
        path: '/servicecomponent_alertmanager/',
        name: 'servicecomponent_alertmanager',
        component: require('../views/servicecomponent/alertmanager').default
      },
      {
        path: '/servicecomponent_grafana/',
        name: 'servicecomponent_grafana',
        component: require('../views/servicecomponent/grafana').default
      },
      {
        path: '/servicecomponent_monitor/',
        name: 'servicecomponent_monitor',
        component: require('../views/servicecomponent/monitorcmdb').default,
        meta: {
          title: '监控告警组件'
        }
      },
      {
        path: '/servicecomponent_slb/',
        name: 'servicecomponent_slb',
        component: require('../views/servicecomponent/slb').default
      },
      {
        path: '/servicecomponent_slb_attribute/',
        name: 'servicecomponent_slb_attribute',
        component: require('../views/servicecomponent/slb_attribute').default
      },
      {
        path: '/servicecomponent_slb_nginx/',
        name: 'servicecomponent_slb_nginx',
        component: require('../views/servicecomponent/slbnginx').default
      },
      {
        path: '/servicecomponent_slbbackservers/',
        name: 'servicecomponent_slbbackservers',
        component: require('../views/servicecomponent/slbbackservers').default
      },
      {
        path: '/servicecomponent_autoscaling/',
        name: 'servicecomponent_autoscaling',
        component: require('../views/servicecomponent/autoscaling').default
      },
      {
        path: '/servicecomponent_cdn/',
        name: 'servicecomponent_cdn',
        component: require('../views/servicecomponent/cdn').default
      },
      {
        path: '/servicecomponent_polardb/',
        name: 'servicecomponent_polardb',
        component: require('../views/servicecomponent/polardb').default
      },
      {
        path: '/servicecomponent_redis/',
        name: 'servicecomponent_redis',
        component: require('../views/servicecomponent/redis').default
      },
      {
        path: '/servicecomponent_mongodb/',
        name: 'servicecomponent_mongodb',
        component: require('../views/servicecomponent/mongodb').default
      },
      {
        path: '/servicecomponent_configcenter/',
        name: 'servicecomponent_configcenter',
        component: require('../views/servicecomponent/configcenter').default,
        meta: {
          title: '配置中心'
        }
      },
      {
        path: '/servicecomponent_rabbitmq/',
        name: 'servicecomponent_rabbitmq',
        component: require('../views/servicecomponent/rabbitmq/rabbitmq')
          .default
      },
      {
        path: '/servicecomponent_rabbitmq_queue/',
        name: 'servicecomponent_rabbitmq_queue',
        component: require('../views/servicecomponent/rabbitmq/rabbitmqQueue')
          .default
      },
      // publish
      {
        path: '/publish_order/',
        name: 'publish_order',
        component: require('../views/publishmodule/publishorder').default,
        meta: {
          title: '发布工单'
        }
      },
      {
        path: '/multiple_publish/',
        name: 'multiple_publish',
        component: require('../views/publishmodule/multiplepublish').default,
        meta: {
          title: '申请发版'
        }
      },
      {
        path: '/publish_order_detail/',
        name: 'publish_order_detail',
        component: require('../views/publishmodule/publishorder').default
      },
      {
        path: '/publish_today/',
        name: 'publish_today',
        component: require('../views/publishmodule/publishtoday').default,
        meta: {
          title: '今日发版'
        }
      },
      // alertmanager
      {
        path: '/alertmanagergroup/',
        name: 'alertmanagergroup',
        component: require('../views/alertmanager/alertmanagergroup').default,
        meta: {
          title: '监控组'
        }
      },
      {
        path: '/alertmanagerrule/',
        name: 'alertmanagerrule',
        component: require('../views/alertmanager/alertmanagerrule').default,
        meta: {
          title: '监控规则'
        }
      },
      {
        path: '/alertmanager_alirule/',
        name: 'alertmanager_alirule',
        component: require('../views/alertmanager/alirule').default,
        meta: {
          title: '阿里云监控'
        }
      },
      {
        path: '/robot/',
        name: 'robot',
        component: require('../views/alertmanager/robot').default,
        meta: {
          title: '机器人'
        }
      },
      {
        path: '/autoheal/',
        name: 'autoheal',
        component: require('../views/alertmanager/autoheal').default,
        meta: {
          title: '自愈套餐'
        }
      },
      {
        path: '/autoheallogmemory/',
        name: 'autoheallogmemory',
        component: require('../views/alertmanager/autoheallogmemory').default
      },
      {
        path: '/autoheallograbbitmq/',
        name: 'autoheallograbbitmq',
        component: require('../views/alertmanager/autoheallograbbitmq').default
      },
      {
        path: '/ali_trace/',
        name: 'ali_trace',
        component: require('../views/third_web/trace').default,
        meta: {
          title: '阿里云链路追踪'
        }
      },
      {
        path: '/grafana/',
        name: 'grafana',
        component: require('../views/monitor/grafana').default
      },
      {
        path: '/workflow/',
        name: 'workflow',
        component: require('../views/workorder/workflow').default
      },
      {
        path: '/domain_slb/',
        name: 'domain_slb',
        component: require('../views/operateconfig/domainslb').default,
        meta: {
          title: '域名slb'
        }
      },
      {
        path: '/domain/',
        name: 'domain',
        component: require('../views/operateconfig/domain').default,
        meta: {
          title: '域名'
        }
      },
      {
        path: '/jenkinsbuildlog/',
        name: 'jenkinsbuildlog',
        component: require('../views/publishmodule/jenkinsbuildlog').default,
        meta: {
          title: 'CI/CD记录'
        }
      },
      {
        path: '/publishmodule_appinstance/',
        name: 'publishmodule_appinstance',
        component: require('../views/publishmodule/applicationinstance')
          .default,
        meta: {
          title: 'CI/CD'
        }
      },
      {
        path: '/publishmodule_appinstance_detail/',
        name: 'publishmodule_appinstance_detail',
        component: require('../views/publishmodule/applicationinstanceDetail')
          .default
      },
      {
        path: '/alertrecord/',
        name: 'alertrecord',
        component: require('../views/alertmanager/alertrecord').default,
        meta: {
          title: '告警记录'
        }
      },
      {
        path: '/alertmanager_silence/',
        name: 'alertmanager_silence',
        component: require('../views/alertmanager/silence').default,
        meta: {
          title: '告警沉默'
        }
      },
      {
        path: '/alertanalysis/',
        name: 'alertanalysis',
        component: require('../views/alertmanager/alertanalysis').default,
        meta: {
          title: '核心接口分析'
        }
      },
      // dbaudit
      {
        path: '/db_redis/',
        name: 'dbredis',
        component: require('../views/dbaudit/redisEdit').default,
        meta: {
          title: 'redis'
        }
      },
      {
        path: '/db_redis_edit/',
        name: 'db_redis_edit',
        component: require('../views/dbaudit/redisEdit').default
      },
      {
        path: '/db_redis_see/',
        name: 'db_redis_see',
        component: require('../views/dbaudit/redisEdit').default
      },
      {
        path: '/workorder_db/',
        name: 'workorder_db',
        component: require('../views/workorder/orderdb').default,
        meta: {
          title: 'db工单'
        }
      },
      {
        path: '/db_polardbSlowLog/',
        name: 'db_polardbSlowLog',
        component: require('../views/dbaudit/polardbSlowLog').default,
        meta: {
          title: '慢日志'
        }
      },
      {
        path: '/db_polardbSlowLog_detail/',
        name: 'db_polardbSlowLog_detail',
        component: require('../views/dbaudit/polardbSlowLogDetail').default
      },
      {
        path: '/db_polardbDatabase/',
        name: 'db_polardbDatabase',
        component: require('../views/servicecomponent/polardbDatabase').default
      },
      // 工单
      {
        path: '/order_alert/',
        name: 'order_alert',
        component: require('../views/workorder/alertorder').default,
        meta: {
          title: '告警工单'
        }
      },
      //  系统管理
      {
        path: '/system_permission/',
        name: 'system_permission',
        component: require('../views/systemmanager/systempermission').default
      },
      // 定时任务
      {
        path: '/scheduled_periodtask/',
        name: 'scheduled_periodtask',
        component: require('../views/scheduled/scheduled_periodtask').default,
        meta: {
          title: '定时任务'
        }
      },
      // 运维公告
      {
        path: '/ops_feedback/',
        name: 'ops_feedback',
        component: require('../views/opsAnnocement/annocement').default,
        meta: {
          title: '反馈'
        }
      },
      {
        path: '/ops_duty/',
        name: 'ops_duty',
        component: require('../views/opsAnnocement/duty').default,
        meta: {
          title: '值班'
        }
      },
      // 系统管理
      {
        path: '/account_user/',
        name: 'account_user',
        component: require('../views/account/user').default,
        meta: {
          title: '用户'
        }
      },
      {
        path: '/role/',
        name: 'role',
        component: require('../views/account/role').default,
        meta: {
          title: '角色'
        }
      },
      {
        path: '/order/',
        name: 'order',
        component: require('../views/account/order').default,
        meta: {
          title: '菜单'
        }
      },
      {
        path: '/jurisdiction/',
        name: 'jurisdiction',
        component: require('../views/account/jurisdiction').default,
        meta: {
          title: '权限'
        }
      },
      {
        path: '/order_jurisdiction/',
        name: 'order_jurisdiction',
        component: require('../views/account/orderJurisdiction').default
      }
    ]
  }
]

const router = new Router({
  routes
})

router.beforeEach((to, from, next) => {
  if (window.sessionStorage.getItem('token')) {
    if (to.fullPath === '/login') {
      next({
        path: '/home'
      })
    } else {
      next()
    }
  } else {
    if (to.fullPath === '/login') {
      next()
    } else {
      next({
        path: '/login'
      })
    }
  }
})

export default router
