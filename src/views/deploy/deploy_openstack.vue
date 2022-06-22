<template>
  <div class="main">
    <div class="wrapper wrapper-content">
      <el-tabs type="border-card" style="margin: 10px" @tab-click="">
        <el-tab-pane label="组件列表">
          <div style="display: flex">
            <div v-if="tree.show" style="width: 20%;border-right: 1px solid #ebeef5;height: calc(100vh - 77px);">
              <el-scrollbar :noresize="true" wrap-style="height: calc(100vh - 100px);">
                <ul style="padding: 0">
                  <li v-if="componentNameList.length==0" style="color: #e3e3e3;text-align: center;font-size: 10px">
                    暂无数据
                  </li>
                  <li v-for="item in componentNameList" :key="item.id"
                      style="line-height: 30px;font-size: 14px;border-bottom: 1px solid #e3e3e3;margin: 10px 10px;">
                    <div>
                      <el-button size="medium" type="text" @click="changeComponentName(item.component_name, item.id)">
                        {{item.component_name}}
                      </el-button>
                    </div>
                  </li>
                </ul>
              </el-scrollbar>
            </div>
            <div :style="spanss">
              <div :span="1" class="leftWindows-button">
                <i v-if="tree.show" class="el-icon-d-arrow-left" title="隐藏" @click="tree.show=false"></i>
                <i v-else class="el-icon-d-arrow-right" title="显示" @click="tree.show=true"></i>
              </div>
              <router-view/>
              <div>
                <el-form ref="form" :model="form" label-width="150px">
                  <el-form-item label="部署环境:" prop="typeenvironment"> {{ form.typeenvironmentname }}</el-form-item>
                  <el-form-item prop="componentname" label="组件名称:"> {{ form.componentname }}</el-form-item>
                </el-form>
                <el-table :data="componentNameSlsList" style="width: 1200px" border>
                  <el-table-column label="脚本名">
                    <template slot-scope="scope" style="width: 500px">
                      {{ scope.row.sls_content }}
                    </template>
                  </el-table-column>
                  <el-table-column label="部署状态">
                    <template slot-scope="scope">
                      <el-tag v-if="scope.row.related_deploySls.flag_deploy===0" type="info">未部署</el-tag>
                      <el-tag v-if="scope.row.related_deploySls.flag_deploy===1" type="warning">部署中</el-tag>
                      <el-tag v-if="scope.row.related_deploySls.flag_deploy===2" type="danger">部署失败</el-tag>
                      <el-tag v-if="scope.row.related_deploySls.flag_deploy===3" type="success">部署成功</el-tag>
                      <el-tag v-if="scope.row.related_deploySls.flag_deploy===4" type="success">取消部署</el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column label="部署">
                    <template slot-scope="scope">
                      <el-button size="mini" type="success" @click="startDeploy(scope.row)">开始部署</el-button>
                      <el-button size="mini" type="info" @click="detailDeploy(scope.row)">查看部署</el-button>
                      <el-button size="mini" type="danger" @click="stopDeploy(scope.row)">取消部署</el-button>
                    </template>
                  </el-table-column>
                </el-table>

              </div>
              <el-dialog title="部署展示" :visible.sync="showDeploy.visible" width="50%" @close="closeShowDeploy()">
                <div class="logs" ref="logs" id="data-list-content">
                  <pre class="log" v-for="(item, index) in logs" :key="index">{{item}}</pre>
                  <div class="blank"></div>
                </div>
              </el-dialog>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        showDeploy: {visible: false},
        tree: {show: true},
        componentNameList: [],
        form: {componentname: '', sls_name: '', typeenvironmentname: '', type_environment_name_id: ''},
        componentNameSlsList: [],
        socket: null,
        websock: null,
        logs: [],
        componentNameSls_id: '',
        locationCursor: { componentName: '', id: '' },
        flagDeploy: ''
      }
    },
    computed: {
      spanss: vm => {
        return vm.tree.show ? 'display:flex; margin-top: 20px;width: 78%' : 'display:flex; margin-top: 20px;width: 98%'
      }
    },
    methods: {
      closeShowDeploy () {
        if (this.websock != null) {
          this.websock.close()
        }
      },
      async startDeploy (row) {
        console.log('startDeploy')
        let res = await this.$http.salt_openstack_install_service({componentName_sls_id: row.id})
        if (res.hasOwnProperty('msg') !== true) {
          console.log('res', res)
          this.$message.success('开始部署下发成功!')
          this.changeComponentName(this.locationCursor.componentName, this.locationCursor.id)
        }
      },
      async stopDeploy (row) {
        let res = await this.$http.salt_openstack_cancel_deploy({componentName_sls_id: row.id})
        if (res.hasOwnProperty('msg') !== true) {
          this.$message.success('取消部署成功!')
          this.changeComponentName(this.locationCursor.componentName, this.locationCursor.id)
        }
      },
      async detailDeploy (row) {
        console.log('detailDeploy')
        console.log('detailDeploy row.id', row.id)
        this.showDeploy.visible = true
        this.logs = []
        let res = await this.$http.detail_deploySlsRecord({deploySls_name: row.id})
        console.log('res', res)
        console.log('res.flag_deploy', res.results[0].flag_deploy)
        this.flagDeploy = res.results[0].flag_deploy
        if (this.flagDeploy === 1) {
          this.initWebSocket(row.id)
        } else {
          this.logs.push(res.results[0].deploy_log)
        }
      },
      initWebSocket (id) {
        this.componentNameSls_id = id
        if (!window.WebSocket) {
          if (window.MozWebSocket) {
            window.WebSocket = window.MozWebSocket
          } else {
            this.logs.push('你的浏览器不支持webSocket')
          }
        }
        const wsurl = 'ws://192.168.126.100:8000/get_websocket_data/'
        console.log(wsurl)
        this.websock = new WebSocket(wsurl)
        this.websock.onopen = this.websocketOnOpen
        this.websock.onerror = this.websocketOnerror
        this.websock.onmessage = this.websocketOnmessage
        this.websock.onclose = this.websocetClose
      },
      websocketOnOpen (e) {
        console.log('this.componentNameSls_id', this.componentNameSls_id)
        this.websock.send(this.componentNameSls_id)
        console.log('websocketOnopen e', e)
        console.log('建立连接')
      },
      websocketOnerror (e) {
        console.log('websocketOnerror e', e)
        console.log('连接错误')
      },
      websocketOnmessage (e) {
        console.log('websocketOnmessage e', e)
        console.log('websocketOnmessage data', typeof (e.data))
        const redata = JSON.parse(e.data)
        this.logs.push(redata.result)
      },
      websocetClose (e) {
        console.log('websocket connection closed ', e)
        this.changeComponentName(this.locationCursor.componentName, this.locationCursor.id)
      },
      async changeComponentName (componentName, id) {
        this.locationCursor = {componentName: componentName, id: id}
        this.form.componentname = componentName
        this.form.sls_name = id
        const params = {
          'sls_name': this.form.sls_name
        }
        let rescomponentNameSlsList = await this.$http.get_componentname_sls(params)
        this.componentNameSlsList = rescomponentNameSlsList.results
        console.log('this.componentNameSlsList', this.componentNameSlsList)
      },
      async getComponentList_a () {
        this.loading = false
        let res = await this.$http.componentlist()
        console.log('res.result', res.results)
        this.componentNameList = res.results
        if (this.componentNameList.length !== 0) {
          this.form.componentname = this.componentNameList[0].component_name
          this.form.sls_name = this.componentNameList[0].id
          this.locationCursor.componentName = this.componentNameList[0].component_name
          this.locationCursor.id = this.componentNameList[0].id
        } else {
          this.form.componentname = ''
          this.form.sls_name = ''
        }
        this.form.typeenvironmentname = this.$route.params.row.type_environment_name
        const params = {
          'sls_name': this.form.sls_name
        }
        let rescomponentNameSlsList = await this.$http.get_componentname_sls(params)
        this.componentNameSlsList = rescomponentNameSlsList.results
        console.log('this.componentNameSlsList', this.componentNameSlsList)
      }
    },
    created () {
      this.getComponentList_a()
    },
    destroyed () {
      if (this.websock != null) {
        this.websock.close()
      }
    }
  }
</script>

<style>
  .leftWindows-button {
    width: 20px;
    float: left;
    min-height: calc(100vh - 120px);
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
