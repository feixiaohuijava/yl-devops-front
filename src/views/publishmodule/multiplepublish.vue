<template>
  <div class="main">
    <div class="wrapper wrapper-content">
      <el-form v-loading="loadingApplyPublish" labelWidth="100px">
        <el-form-item label="标题:">
          <el-input v-model="title" style="width: 500px"></el-input>
        </el-form-item>
        <el-form-item label="变更内容:" style="width: 1300px">
          <textarea
            v-model="description"
            style="width: 1200px;height:150px"
          ></textarea>
        </el-form-item>
        <el-form-item>
          <el-button
            icon="el-icon-plus"
            type="primary"
            @click="addpublishsubsystem()"
            >添加发布子系统</el-button
          >
          <label style="color: #9f191f"
            >如有新系统上线,请先报备运维,否则将无法提单!</label
          >
        </el-form-item>
        <d-table
          url="/api/publishmodule/draftpublishsubsystem/"
          ref="draftpublishlist"
          style="width: 100%"
        >
          <template slot="column">
            <el-table-column label="子系统id" width="80">
              <template slot-scope="scope">
                {{ scope.row.subsystemId }}
              </template>
            </el-table-column>
            <el-table-column label="应用名" width="120">
              <template slot-scope="scope">
                {{ scope.row.applicationName }}
              </template>
            </el-table-column>
            <el-table-column label="子系统名" width="120">
              <template slot-scope="scope">
                {{ scope.row.subsystemname }}
              </template>
            </el-table-column>
            <el-table-column label="子系统中文名" width="180">
              <template slot-scope="scope">
                {{ scope.row.subsystemNick }}
              </template>
            </el-table-column>
            <el-table-column label="项目" width="180">
              <template slot-scope="scope">
                {{ scope.row.projectName }}
              </template>
            </el-table-column>
            <el-table-column label="类型" width="100">
              <template slot-scope="scope">
                {{ scope.row.kind }}
              </template>
            </el-table-column>
            <el-table-column label="发版类型" width="100">
              <template slot-scope="scope">
                {{ scope.row.deployType }}
              </template>
            </el-table-column>
            <el-table-column label="commitId" width="180">
              <template slot-scope="scope">
                {{ scope.row.commitId }}
              </template>
            </el-table-column>
            <el-table-column label="apollo变更" width="100">
              <template slot-scope="scope">
                <div v-if="scope.row.apolloFlag === 'yes'">
                  <el-tag type="danger">是</el-tag>
                </div>
                <div v-else-if="scope.row.apolloFlag === 'no'">
                  <el-tag type="success">否</el-tag>
                </div>
                <div v-else>
                  {{ scope.row.apolloFlag }}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="新系统" width="100">
              <template slot-scope="scope">
                <div v-if="scope.row.newSubsystemFlag === true">
                  <el-tag type="danger">是</el-tag>
                </div>
                <div v-else-if="scope.row.newSubsystemFlag === false">
                  <el-tag type="success">否</el-tag>
                </div>
                <div v-else>
                  {{ scope.row.newSubsystemFlag }}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="创建时间" width="150">
              <template slot-scope="scope">
                {{ scope.row.createdTime }}
              </template>
            </el-table-column>
            <el-table-column label="操作" width="180">
              <template slot-scope="scope">
                <el-button type="danger" @click="deleteDraftPublish(scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </template>
        </d-table>
        <el-form-item>
          <el-button type="primary" @click="applypublish()">提交申请</el-button>
        </el-form-item>
      </el-form>
      <el-dialog
        v-loading="addPublishSubsystemloading"
        title="添加发布子系统"
        :visible.sync="applypublishGroup.visible"
        width="40%"
      >
        <el-form labelWidth="100px">
          <el-form-item prop="subsystem" label="子系统名">
            <el-autocomplete
              :loading="autocompleteloading"
              class="inline-input"
              v-model="applypublishGroup.form.subsystemname"
              :fetch-suggestions="querySearch"
              placeholder="模糊搜索"
              @select="handleSelect"
              style="width: 500px"
            ></el-autocomplete>
          </el-form-item>
          <el-form-item prop="project" label="项目名">
            <el-input
              class="readonlycss"
              readonly
              v-model="applypublishGroup.form.projectName"
              style="width: 300px"
            >
              {{ applypublishGroup.form.projectName }}
            </el-input>
          </el-form-item>
          <el-form-item prop="kind" label="类型">
            <el-input
              class="readonlycss"
              readonly
              v-model="applypublishGroup.form.kind"
              style="width: 300px"
            >
              {{ applypublishGroup.form.kind }}
            </el-input>
          </el-form-item>
          <el-form-item prop="subsystemId" label="子系统id">
            <el-input
              class="readonlycss"
              readonly
              v-model="applypublishGroup.form.subsystemId"
              style="width: 300px"
            >
              {{ applypublishGroup.form.subsystemId }}
            </el-input>
          </el-form-item>
          <el-form-item prop="subsystemNick" label="子系统中文">
            <el-input
              class="readonlycss"
              readonly
              v-model="applypublishGroup.form.subsystemNick"
              style="width: 300px"
            >
              {{ applypublishGroup.form.subsystemNick }}
            </el-input>
          </el-form-item>
          <el-form-item
            v-if="applypublishGroup.form.kind !== '前端'"
            prop="subsystemNick"
            label="apollo环境"
          >
            <el-input
              class="readonlycss"
              readonly
              v-model="applypublishGroup.form.apolloCenterName"
              style="width: 300px"
            >
              {{ applypublishGroup.form.apolloCenterName }}
            </el-input>
          </el-form-item>
          <el-form-item
            v-if="applypublishGroup.form.kind !== '前端'"
            prop="subsystemNick"
            label="apolloId"
          >
            <el-input
              class="readonlycss"
              readonly
              v-model="applypublishGroup.form.apolloId"
              style="width: 300px"
            >
              {{ applypublishGroup.form.apolloId }}
            </el-input>
          </el-form-item>
          <el-form-item
            v-if="applypublishGroup.form.kind !== '前端'"
            prop="subsystemNick"
            label="appId"
          >
            <el-input
              class="readonlycss"
              readonly
              v-model="applypublishGroup.form.appId"
              style="width: 300px"
            >
              {{ applypublishGroup.form.appId }}
            </el-input>
          </el-form-item>
          <el-form-item prop="newSubsystemFlag" label="新系统">
            <el-switch
              v-model="applypublishGroup.form.newSubsystemFlag"
            ></el-switch>
          </el-form-item>
          <el-form-item
            prop="生产应用名"
            label="生产应用名:"
            v-if="applypublishGroup.form.kind !== '前端'"
          >
            <el-select
              clearable
              @visible-change="selectApplicationPro($event)"
              v-model="applicationProObj"
              style="width: 400px"
            >
              <el-option
                v-for="item in applicationProList"
                :key="item.id"
                :value="item.id"
                :label="item.applicationName"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="deployType" label="发版类型">
            <el-select clearable v-model="applypublishGroup.form.deployType">
              <el-option
                value="master"
                label="日常变更(master分支)"
              ></el-option>
              <el-option
                value="hotfix"
                label="紧急变更(hotfix分支)"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="applypublishGroup.form.deployType === 'hotfix'"
            prop="commitId"
            label="commitId"
          >
            <el-input
              v-model="applypublishGroup.form.commitId"
              placeholder="支持前七位或所有"
              style="width: 300px"
            ></el-input>
          </el-form-item>
          <el-form-item
            v-if="applypublishGroup.form.kind !== '前端'"
            prop="apolloFlag"
            label="apollo变更"
          >
            <el-switch v-model="applypublishGroup.form.apolloFlag"></el-switch>
            <el-button
              v-loading="loadingChekApollo"
              :type="typeApolloCheck"
              @click="onSelectApolloPublish"
              >检测Apollo变更:
              {{ checkApollo }}
            </el-button>
          </el-form-item>
          <el-button type="primary" @click="addapplypublish">确 定</el-button>
          <el-button @click="cancelEdit">取 消</el-button>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      applicationProObj: null,
      applicationProList: [],
      typeApolloCheck: 'primary',
      checkApollo: null,
      loadingChekApollo: false,
      autocompleteloading: false,
      loadingApplyPublish: false,
      addPublishSubsystemloading: false,
      title: null,
      description: null,
      projectList: [],
      subsystemList: [],
      resubsystemList: [],
      applypublishGroup: {
        visible: false,
        form: {
          projectId: null,
          projectName: null,
          kind: null,
          subsystemname: null,
          subsystemNick: null,
          subsystemId: null,
          apolloCenterName: null,
          apolloId: null,
          appId: null,
          commitId: null,
          deployType: null,
          newSubsystemFlag: false,
          apolloFlag: null,
          precheck: false,
          applicationProId: null,
          applicationName: null
        }
      },
      checkList: [],
      detailGroups: [],
      buttonChange: false
    }
  },
  created () {
    this.onSelectChangeProject(true)
  },
  watch: {
    applicationProObj () {
      this.applypublishGroup.form.applicationProId = this.applicationProObj
      this.applicationProList.forEach(value => {
        if (value.id === this.applicationProObj) {
          this.applypublishGroup.form.applicationName = value.applicationName
        }
      })
    }
  },
  methods: {
    async deleteDraftPublish (row) {
      this.$confirm('确认删除?', '提示', { type: 'warning' }).then(async () => {
        let res = await this.$http.deleteDraftPublishApi({ id: row.id })
        if (res.hasOwnProperty('results')) {
          this.$message.success('删除成功!')
        } else {
          this.$message.error('删除失败!')
        }
        this.$refs.draftpublishlist.getData()
      })
    },
    async selectApplicationPro (callback) {
      if (callback) {
        if (this.applypublishGroup.form.subsystemId !== undefined) {
          this.applicationProList = []
          console.log(
            'this.applypublishGroup.form.subsystemId',
            this.applypublishGroup.form.subsystemId
          )
          const param = {
            subsystem: this.applypublishGroup.form.subsystemId,
            environmentName: 'pro'
          }
          console.log('param', param)
          let res = await this.$http.getApplicationApi(param)
          console.log(res.results)
          if (res.hasOwnProperty('results')) {
            if (res.results.length > 0) {
              res.results.forEach(value => {
                this.applicationProList.push({
                  id: value.id,
                  applicationName: value.applicationName
                })
              })
            } else {
              this.$message.error('无应用!')
            }
          }
          console.log(
            'this.applypublishGroup.form.applicationName',
            this.applypublishGroup.form.applicationName
          )
          console.log(
            'this.applypublishGroup.form.applicationProId',
            this.applypublishGroup.form.applicationProId
          )
        } else {
          this.$message.error('子系统不存在!')
        }
      }
    },
    async onSelectApolloPublish () {
      this.loadingChekApollo = true
      this.checkApollo = null
      if (this.applypublishGroup.form.apolloId) {
        let res = await this.$http.apolloPublishCheckApi({
          apolloId: this.applypublishGroup.form.apolloId
        })
        if (res.hasOwnProperty('results')) {
          if (res.results.flag === true) {
            this.checkApollo = '是'
            this.typeApolloCheck = 'danger'
          } else {
            this.checkApollo = '否'
            this.typeApolloCheck = 'success'
          }
        } else {
          this.$message.error('检测apollo失败!')
        }
      } else {
        this.$message.error('apolloId为空!')
      }
      this.loadingChekApollo = false
    },
    async querySearch (queryString, cb) {
      this.resubsystemList = []
      this.subsystemList = []
      this.applypublishGroup.form.applicationProId = null
      // 请求需要时间等待
      let resSubsystem = await this.$http.getsubsystemapi({
        ordering: 'subsystemname'
      })
      this.subsystemList = resSubsystem.results
      if (this.resubsystemList.length === 0) {
        this.subsystemList.forEach(val => {
          this.resubsystemList.push({
            value: val.subsystemname,
            id: val.id,
            subsystemNick: val.subsystemNick,
            kind: val.kind,
            projectName: val.project !== null ? val.project.projectName : null
          })
        })
      }
      var restaurants = this.resubsystemList
      var results = queryString
        ? this.resubsystemList.filter(
            this.createFilter(queryString.replace(/(^\s*)|(\s*$)/g, ''))
          )
        : this.resubsystemList
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    async handleSelect (item) {
      console.log('item', item)
      this.autocompleteloading = true
      this.applypublishGroup.form.projectName = item.projectName
      this.applypublishGroup.form.kind = item.kind
      if (this.applypublishGroup.form.kind === '前端') {
        this.applypublishGroup.form.apolloCenterName = null
        this.applypublishGroup.form.appId = null
      } else {
        this.applypublishGroup.form.apolloCenterName = 'uat-pro-apollo'
        let resapolloCenter = await this.$http.getapolloCenterApi({
          subsystem: item.id,
          apolloCenterName: 'uat-pro-apollo'
        })
        if (resapolloCenter.hasOwnProperty('results')) {
          if (resapolloCenter.results.length > 0) {
            this.applypublishGroup.form.appId = resapolloCenter.results[0].appId
            this.applypublishGroup.form.apolloId = resapolloCenter.results[0].id
          } else {
            this.applypublishGroup.form.appId = null
            this.applypublishGroup.form.apolloId = null
          }
        }
      }
      this.applypublishGroup.form.subsystemNick = item.subsystemNick
      this.applypublishGroup.form.subsystemId = item.id
      this.applypublishGroup.form.kind = item.kind
      this.autocompleteloading = false
    },
    createFilter (queryString) {
      return restaurant => {
        return (
          restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) > -1
        )
      }
    },
    deleteGroup (row) {
      this.detailGroups.forEach(value => {
        if (value.subsystemId === row.subsystemId) {
          var index = this.detailGroups.indexOf(value)
          this.detailGroups.splice(index, 1)
        }
      })
    },
    cancelEdit () {
      this.applypublishGroup.visible = false
      console.log('23423')
    },
    async addapplypublish () {
      this.projectChange()
      console.log('this.applypublishGroup.form', this.applypublishGroup.form)
      this.addPublishSubsystemloading = true
      if (
        this.applypublishGroup.form.deployType === 'hotfix' &&
        !this.applypublishGroup.form.commitId
      ) {
        this.$message.error('数据不可为空!')
        this.addPublishSubsystemloading = false
        return
      }
      // 前端
      if (this.applypublishGroup.form.kind === '前端') {
        if (
          this.applypublishGroup.form.deployType &&
          this.applypublishGroup.form.subsystemname &&
          this.applypublishGroup.form.projectName &&
          this.applypublishGroup.form.kind
        ) {
        } else {
          this.$message.error('数据不可为空!')
          this.addPublishSubsystemloading = false
          return
        }
      }
      // 后端
      else {
        if (
          this.applypublishGroup.form.applicationProId &&
          this.applypublishGroup.form.applicationName &&
          this.applypublishGroup.form.deployType &&
          this.applypublishGroup.form.subsystemname &&
          this.applypublishGroup.form.projectName &&
          this.applypublishGroup.form.kind
        ) {
          if (!this.applypublishGroup.form.hasOwnProperty('apolloFlag')) {
            this.applypublishGroup.form['apolloFlag'] = 'no'
          } else {
            this.applypublishGroup.form['apolloFlag'] = 'yes'
          }
        } else {
          this.$message.error('数据不可为空!')
          this.addPublishSubsystemloading = false
          return
        }
      }
      console.log('form', this.applypublishGroup.form)
      if (!this.applypublishGroup.form.hasOwnProperty('newSubsystemFlag')) {
        this.applypublishGroup.form['newSubsystemFlag'] = false
      }
      let res = await this.$http.applyPublishApi({
        applySubsystem: this.applypublishGroup.form
      })
      if (res.hasOwnProperty('results')) {
        // this.detailGroups.push(this.applypublishGroup.form)
        this.applypublishGroup.visible = false
        this.$message.success('预检测成功!')
        this.$refs.draftpublishlist.getData()
      } else {
        this.$message.error('预检测失败!')
      }
      this.addPublishSubsystemloading = false
    },
    subsystemChange () {
      this.subsystemList.forEach(val => {
        if (val.id === this.applypublishGroup.form.subsystemId) {
          this.applypublishGroup.form.subsystemNick = val.subsystemNick
          this.applypublishGroup.form.subsystemId = val.id
          this.applypublishGroup.form.subsystemname = val.subsystemname
        }
      })
    },
    projectChange () {
      this.projectList.forEach(val => {
        if (val.projectName === this.applypublishGroup.form.projectName) {
          this.applypublishGroup.form.projectId = val.id
        }
      })
    },
    async onSelectChangeSubsystem () {
      this.subsystemList = []
      let resSubsystem = await this.$http.getsubsystemapi({
        project: this.applypublishGroup.form.projectName
      })
      this.subsystemList = resSubsystem.results
      return this.subsystemList
    },
    async onSelectChangeProject (callback) {
      if (callback) {
        this.applypublishGroup.form = {
          projectId: null,
          projectName: null,
          subsystemname: null,
          subsystemNick: null,
          subsystemId: null,
          commitId: null,
          deployType: null,
          newSubsystemFlag: null,
          apolloFlag: null
        }
        this.projectList = []
        let resProject = await this.$http.getProjectApi()
        this.projectList = resProject.results
      }
    },
    addpublishsubsystem () {
      this.applypublishGroup.visible = true
      this.applypublishGroup.form = {}
      this.applicationProObj = null
      this.checkApollo = null
      this.typeApolloCheck = 'success'
    },
    // async getsubsystem() {
    //     let res = await this.$http.getsubsystemapi({id: this.checkList.join(',')})
    //     this.detailGroups = res.results
    //     console.log(res.results)
    // },
    applypublish () {
      this.$confirm('确认申请?', '提示', { type: 'warning' })
        .then(async () => {
          this.loadingApplyPublish = true
          if (this.title !== null && this.description !== null) {
            let res = await this.$http.multipleapplypublishapi({
              applySubsystems: this.detailGroups,
              title: this.title,
              description: this.description
            })
            if (res.hasOwnProperty('results')) {
              this.loadingApplyPublish = false
              this.$router.push({ name: 'publish_order' })
            } else {
              this.$message.error('申请失败!')
              this.loadingApplyPublish = false
            }
          } else {
            this.$message.error('数据不可为空!')
            this.loadingApplyPublish = false
          }
        })
        .catch(_ => {})
    },
    getPerm () {
      let perm = JSON.parse(window.sessionStorage.getItem('permission'))
      if (perm.includes('add_brand')) {
        this.buttonNew = true
      }
      if (perm.includes('delete_brand')) {
        this.buttonDelete = true
      }
      if (perm.includes('change_brand')) {
        this.buttonChange = true
      }
    },
    handleCommand (command) {
      let list = command.split('.')
      if (list[0] === 'delete') {
        this.deleteSafeGroup(list[1])
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

.readonlycss /deep/ .el-input__inner {
  background: #9ea6b9;
}
</style>
