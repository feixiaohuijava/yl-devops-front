<template>
  <div class="main">
    <div class="wrapper wrapper-content">
      <el-button
        icon="el-icon-back"
        type="primary"
        @click="routerBack"
        class="back-btn"
        >返回</el-button
      >
      <el-form :inline="true" :model="publishorderdetail">
        <el-form-item label="工单id:" style="width: 300px">
          <el-input readonly v-model="publishorderdetail.id"></el-input>
        </el-form-item>
        <el-form-item label="标题:" style="width: 400px">
          <el-input
            readonly
            v-model="publishorderdetail.title"
            style="width: 300px"
          ></el-input>
        </el-form-item>
        <el-form-item label="创建时间:" style="width: 300px">
          <el-input
            readonly
            v-model="publishorderdetail.createdTime"
          ></el-input>
        </el-form-item>
        <el-form-item label="修改时间:" style="width: 300px">
          <el-input readonly v-model="publishorderdetail.updateTime"></el-input>
        </el-form-item>
        <el-form-item label="创建人:">
          <el-input
            readonly
            v-model="publishorderdetail.orderCreater.username"
          ></el-input>
        </el-form-item>
        <br />
        <el-form-item label="变更内容:" style="width: 1300px">
          <textarea
            v-model="publishorderdetail.description"
            style="width: 1200px;height:150px"
          ></textarea>
        </el-form-item>
      </el-form>

      <d-table
        :url="url"
        ref="publishOrderSubsytemList"
        style="width: 100%"
        :publishOrderPage="true"
      >
        <template slot="column">
          <el-table-column label="发版id" width="60">
            <template slot-scope="scope">
              {{ scope.row.id }}
            </template>
          </el-table-column>
          <el-table-column label="子系统id" width="70">
            <template slot-scope="scope">
              {{ scope.row.subsystemId }}
            </template>
          </el-table-column>
          <el-table-column prop="subsystem" label="子系统" width="110">
            <template slot-scope="scope">
              {{ scope.row.subsystemname }}
            </template>
          </el-table-column>
          <el-table-column prop="subsystemNick" label="中文名" width="90">
            <template slot-scope="scope">
              {{ scope.row.subsystemNick }}
            </template>
          </el-table-column>
          <el-table-column prop="kind" label="类型" width="50">
            <template slot-scope="scope">
              {{ scope.row.kind }}
            </template>
          </el-table-column>
          <el-table-column prop="applicationName" label="应用名" width="110">
            <template slot-scope="scope">
              {{ scope.row.applicationName }}
            </template>
          </el-table-column>
          <el-table-column prop="projectName" label="项目名" width="80px">
            <template slot-scope="scope">
              {{ scope.row.projectName }}
            </template>
          </el-table-column>
          <el-table-column prop="deployType" label="部署类型" width="120px">
            <template slot-scope="scope">
              <div v-if="scope.row.deployType === 'master'">
                <el-tag type="success">日常发布(master)</el-tag>
              </div>
              <div v-else-if="scope.row.deployType === 'hotfix'">
                <el-tag type="danger">紧急发布(hotfix)</el-tag>
                <br />
                commitId: {{ scope.row.commitId }}
              </div>
              <div v-else></div>
            </template>
          </el-table-column>
          <el-table-column prop="newSubsystemFlag" label="新系统" width="80px">
            <template slot-scope="scope">
              <div v-if="scope.row.newSubsystemFlag === true">
                <el-tag type="danger">是</el-tag>
              </div>
              <div v-else-if="scope.row.newSubsystemFlag === false">
                <el-tag type="success">否</el-tag>
              </div>
              <div v-else>{{ scope.row.newSubsystemFlag }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="apolloFlag" label="apollo变更" width="130">
            <template slot-scope="scope">
              <div v-if="scope.row.apolloFlag === 'yes'">
                <el-tag type="danger">申请变更</el-tag>
              </div>
              <div v-else-if="scope.row.apolloFlag === 'no'">
                <el-tag type="success">不申请变更</el-tag>
              </div>
              <div v-else></div>
              <br />
              <el-tag v-if="scope.row.apolloFlag === 'yes'" type="primary"
                >发布结果: {{ releaseFlag }}</el-tag
              >
            </template>
          </el-table-column>
          <!-- width="100" -->
          <el-table-column prop="buildResult" label="发布结果">
            <template slot-scope="scope">
              <div v-if="scope.row.buildResult === 'ready'">
                <el-tag type="info">未发布</el-tag>
              </div>
              <div v-else-if="scope.row.buildResult === 'publishing'">
                <el-tag type="primary">发布中</el-tag>
              </div>
              <div v-else-if="scope.row.buildResult === 'success'">
                <el-tag type="success">发布成功</el-tag>
              </div>
              <div v-else-if="scope.row.buildResult === 'failed'">
                <el-tag type="danger">发布失败</el-tag>
              </div>
              <div v-else-if="scope.row.buildResult === 'delete'">
                <el-tag type="danger">已删除</el-tag>
              </div>
              <div v-else-if="scope.row.buildResult === 'break'">
                <el-tag type="danger">已终止</el-tag>
              </div>
              <div v-else>
                <el-tag type="danger">异常状况</el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="applicationName" label="状态" width="90">
            <template slot-scope="scope">
              <div v-if="scope.row.deleteFlag === true">
                <el-tag type="danger">已删除</el-tag>
              </div>
              <div v-else>
                <el-tag type="success">正常</el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="subsystemNick" label="构建日志" width="130">
            <template slot-scope="scope">
              <div>
                <el-button
                  type="primary"
                  @click="openJenkinsBuildLog(scope.row)"
                  >查看</el-button
                >
              </div>
              <div>
                <label>构建number: {{ scope.row.buildNumber }}</label>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="subsystemNick" label="发布Apollo" width="120">
            <template slot-scope="scope">
              <el-button
                type="primary"
                v-if="scope.row.deleteFlag === false"
                @click="detailPublishApollo(scope.row)"
                >Apollo详情</el-button
              >
            </template>
          </el-table-column>
          <!-- width="150px" -->
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-dropdown
                v-if="scope.row.deleteFlag === false"
                split-button
                trigger="click"
                type="primary"
                @click="openDetailPublishSubsystemApi(scope.row)"
                @command="handleCommand"
                >详情
                <el-dropdown-menu
                  slot="dropdown"
                  v-if="scope.row.deleteFlag === false"
                >
                  <el-dropdown-item
                    :command="'publish.' + scope.row.id"
                    :disabled="!button_partialupdate_publishsubsystem"
                    >发布
                  </el-dropdown-item>
                  <el-dropdown-item
                    :command="'break.' + scope.row.id"
                    :disabled="!button_partialupdate_publishsubsystem"
                  >
                    终止发布
                  </el-dropdown-item>
                  <el-dropdown-item
                    :command="'delete.' + scope.row.id"
                    :disabled="!button_delete_publishsubsystem"
                    >删除
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <el-button
                style="margin-top: 10px"
                type="primary"
                v-if="scope.row.deleteFlag === false"
                :disabled="!button_partialupdate_publishsubsystem"
                @click="handleCommand('publish.' + scope.row.id)"
                >发布</el-button
              >
            </template>
          </el-table-column>
        </template>
      </d-table>
      <el-dialog
        title="构建日志"
        :visible.sync="jenkinsGroupVisible"
        style="width: 100%; height: 900px"
      >
        <el-form :model="jenkinsGroup.form">
          <el-form-item label="构建url" style="width: 700px">
            <a :href="jenkinsGroup.form.consoleUrL" target="_blank">{{
              jenkinsGroup.form.consoleUrL
            }}</a>
          </el-form-item>
          <el-form-item prop="buildConsole" label="构建日志">
            <textarea
              readonly
              v-model="jenkinsGroup.form.console_result"
              style="width: 80%; height: 500px"
            ></textarea>
          </el-form-item>
        </el-form>
      </el-dialog>
      <el-dialog
        v-loading="apolloLoading"
        title="发布Apollo"
        :visible.sync="apolloGroup.visible"
        width="80%"
      >
        <el-form :inline="true">
          <el-form-item label="id:">{{ apolloGroup.id }}</el-form-item>
          <el-form-item label="apolloId:">{{
            apolloGroup.apolloId
          }}</el-form-item>
          <el-form-item label="appId:">{{ apolloGroup.appId }}</el-form-item>
          <el-form-item label="apolloCenterName:">{{
            apolloGroup.apolloCenterName
          }}</el-form-item>
        </el-form>
        <el-table :data="apolloGroup.form.namespace_list" style="width: 100%">
          <el-table-column prop="namespaceName" label="命名空间" width="180">
            <template slot-scope="scope">
              {{ scope.row.namespaceName }}
            </template>
          </el-table-column>
          <el-table-column label="上次发布配置" width="500">
            <template slot-scope="scope">
              <div v-if="scope.row.configurations.hasOwnProperty('content')">
                <yaml-editor
                  v-model="scope.row.configurations.content"
                ></yaml-editor>
              </div>
              <div v-else>
                <vue-json-pretty
                  :path="'res'"
                  :deep="3"
                  :showLength="true"
                  :highlightSelectedNode="true"
                  :showDoubleQuotes="false"
                  :data="scope.row.configurations"
                >
                </vue-json-pretty>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="最后修改" width="500">
            <template slot-scope="scope">
              <div v-if="scope.row.publish_after.hasOwnProperty('content')">
                <yaml-editor
                  v-model="scope.row.publish_after.content"
                ></yaml-editor>
              </div>
              <div v-else>
                <vue-json-pretty
                  :path="'res'"
                  :deep="3"
                  :showLength="true"
                  :highlightSelectedNode="true"
                  :showDoubleQuotes="false"
                  :data="scope.row.publish_after"
                >
                </vue-json-pretty>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="release_necessary_flag"
            label="修改"
            width="180"
          >
            <template slot-scope="scope">
              <div v-if="scope.row.release_necessary_flag === true">
                <el-tag type="danger">是</el-tag>
              </div>
              <div v-else>
                <el-tag type="success">否</el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100px">
            <template slot-scope="scope">
              <el-button
                v-if="
                  scope.row.release_necessary_flag === true &&
                    button_partialupdate_publishapollo
                "
                @click="publishNamespace(scope.row)"
                type="primary"
                >发布
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import YamlEditor from '../../components/YamlEditor'
import VueJsonPretty from 'vue-json-pretty'

export default {
  components: { YamlEditor, VueJsonPretty },
  data () {
    return {
      timer: '',
      apolloLoading: false,
      releaseFlag: '未发布',
      timer: null,
      button_partialupdate_publishapollo: false,
      button_partialupdate_publishsubsystem: false,
      button_delete_publishsubsystem: false,
      url: null,
      subsystemIds: [],
      publishorderid: null,
      publishorderdetail: {
        orderCreater: ''
      },
      jenkinsGroupVisible: false,
      jenkinsGroup: {
        visible: false,
        form: { console_result: null, consoleUrL: null }
      },
      apolloGroup: {
        visible: false,
        apolloId: null,
        id: null,
        appId: null,
        apolloCenterName: null,
        form: {}
      }
    }
  },
  created () {
    window.localStorage.setItem('publishOrderPage', 1)
    this.publishorderid = localStorage.getItem('publishId')
    this.url = `/api/publishmodule/publishordersystemviewset/?publishOrder=${this.publishorderid}`
    this.getPerm()
    this.getdetailpublishorder()
  },
  watch: {
    jenkinsGroupVisible () {
      if (this.jenkinsGroupVisible === false) {
        clearInterval(this.timer)
      }
    }
  },
  methods: {
    // 返回上一级
    routerBack () {
      window.localStorage.setItem('publiPageChange', 1)
      window.localStorage.setItem('retainPage', 1)
      this.$router.go(-1)
    },
    openDetailPublishSubsystemApi (row) {},
    async publishNamespace (row) {
      this.$confirm('确认发布?', '提示', { type: 'warning' }).then(async () => {
        let res = await this.$http.publishNamespaceApi({
          id: this.apolloGroup.id,
          namespaceName: row.namespaceName
        })
        if (res.hasOwnProperty('results')) {
          this.$message.success('发布成功!')
          let res = await this.$http.apolloPublishCheckApi({
            apolloId: this.apolloGroup.apolloId
          })
          this.apolloGroup.form = res.results
        } else {
          this.$message.error('发布失败!')
        }
      })
    },
    async detailPublishApollo (row) {
      if (row.apolloFlag === 'yes') {
        this.apolloLoading = true
        this.apolloGroup.visible = true
        this.apolloGroup.form = {}
        this.apolloGroup.apolloCenterName = null
        this.apolloGroup.id = null
        this.apolloGroup.appId = null
        this.apolloGroup.apolloId = null
        let resPublishApollo = await this.$http.getPublishApolloApi({
          publishSubsystem: row.id
        })
        console.log('resPublishApollo', resPublishApollo)
        this.apolloGroup.apolloCenterName =
          resPublishApollo.results[0].apolloCenterName
        this.apolloGroup.id = resPublishApollo.results[0].id
        this.apolloGroup.appId = resPublishApollo.results[0].appId
        this.apolloGroup.apolloId = resPublishApollo.results[0].apolloId
        let res = await this.$http.apolloPublishCheckApi({
          apolloId: resPublishApollo.results[0].apolloId
        })
        this.apolloGroup.form = res.results
        console.log('this.apolloGroup.form', this.apolloGroup.form)
        this.apolloLoading = false
      } else {
        this.$message.error('非法操作!')
      }
    },
    openJenkinsBuildLog (row) {
      if (row.buildResult !== 'ready') {
        this.jenkinsGroupVisible = true
        this.timer = setInterval(this.getJenkinsBuildLog, 1000, row)
        // this.getJenkinsBuildLog(row)
      } else {
        this.$message.error('非法操作!')
      }
    },
    async getJenkinsBuildLog (row) {
      console.log('row', row)
      const param = { id: row.id }
      let res = await this.$http.getJenkinsBuildLogapi(param)
      this.jenkinsGroup.form = res.results
    },
    async handleCommand (command) {
      let list = command.split('.')
      if (list[0] === 'break') {
        this.$message.error('此功能暂未上线!')
      } else if (list[0] === 'publish') {
        this.$confirm('确认发布?', '提示', { type: 'warning' }).then(
          async () => {
            const param = {
              publishOrderId: this.publishorderdetail.id,
              id: list[1],
              subsystemOperate: 'publish'
            }
            let res = await this.$http.jenkinsbuildapi(param)
            if (res.hasOwnProperty('results')) {
              this.$message.success(res.results)
            }
            this.getpublishsubsystem()
          }
        )
      } else if (list[0] === 'delete') {
        this.$confirm('确认删除?', '提示', { type: 'warning' })
          .then(async () => {
            const param = { id: list[1] }
            let res = await this.$http.deletepublishsubsystemapi(param)
            if (res.hasOwnProperty('results')) {
              this.$message.success('删除成功!')
            }
            this.getpublishsubsystem()
          })
          .catch(_ => {})
      }
    },
    async getpublishsubsystem () {
      let page = Number(window.localStorage.getItem('publishOrderPage'))
        ? Number(window.localStorage.getItem('publishOrderPage'))
        : 1
      const param = { publishOrder: this.publishorderid, page: page }
      let res = await this.$http.getpublishsubsystemapi(param)
      this.$refs.publishOrderSubsytemList.setData(res.results, res.count, 1)
    },
    async getdetailpublishorder () {
      let res = await this.$http.getdetailpublishorderapi({
        id: this.publishorderid
      })
      this.publishorderdetail = res.results
    },
    getPerm () {
      let perm = JSON.parse(window.sessionStorage.getItem('permission'))
      if (perm.includes('update_publish_order')) {
        this.button_partialupdate_publishsubsystem = true
      }
      if (perm.includes('delete_publish_order')) {
        this.button_delete_publishsubsystem = true
      }
      if (perm.includes('update_publish_apollo')) {
        this.button_partialupdate_publishapollo = true
      }
    }
  }
}
</script>
<style scoped lang="less">
.group-id {
  color: #409eff;
  cursor: pointer;
}

.group-name {
  i {
    font-size: 16px;
    color: #f99;

    &:hover {
      color: #f00;
      font-size: 20px;
    }
  }
}

.warning {
  font-size: 12px;
  color: #999;
}

.transfer-footer {
  margin-left: 20px;
  padding: 6px 5px;
}
.back-btn {
  margin-bottom: 20px;
}
</style>
<style>
.el-dialog__body {
  height: 100%;
}
</style>
