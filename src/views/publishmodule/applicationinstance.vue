<template>
  <div class="main">
    <div class="wrapper wrapper-content">
      <div class="search-input">
        <el-input
          class="input"
          placeholder="输入关键字进行过滤"
          v-model="filterText"
          style="width:300px;"
        >
        </el-input>
      </div>
      <el-row>
        <el-col :span="4">
          <el-tree
            class="filter-tree"
            :data="subsystemTree"
            :props="defaultProps"
            :default-expand-all="false"
            :filter-node-method="filterNode"
            ref="tree"
            @node-click="getApplicationIntance"
          ></el-tree>

          <!-- <el-tree
            :filter-node-method="filterNode"
            @node-click="getApplicationIntance"
            class="filter-tree"
            :load="loadNode"
            :props="defaultProps"
            :default-expand-all="false"
            highlight-current
            lazy
            ref="tree"
          ></el-tree> -->
        </el-col>
        <el-col :span="20">
          <el-form>
            <el-form-item label="环境:">
              <el-select
                @change="onSelectChangeEnvironment"
                v-model="applicationEnv"
                style="width: 100px"
              >
                <el-option value="dev" label="dev"></el-option>
                <el-option value="test" label="test"></el-option>
                <el-option value="uat" label="uat"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <el-table :data="applicationInstance">
            <el-table-column label="id" width="60px">
              <template slot-scope="scope">
                {{ scope.row.id }}
              </template>
            </el-table-column>
            <el-table-column label="应用名" width="150px">
              <template slot-scope="scope">
                {{ scope.row.applicationName }}
              </template>
            </el-table-column>
            <el-table-column label="子系统" width="150px">
              <template slot-scope="scope">
                {{ scope.row.subsystem.subsystemname }}
              </template>
            </el-table-column>
            <el-table-column label="项目名" width="150px">
              <template slot-scope="scope">
                {{ scope.row.project.projectName }}
              </template>
            </el-table-column>
            <el-table-column label="命名空间" width="130px">
              <template slot-scope="scope">
                {{ scope.row.namespace.namespaceName }}
              </template>
            </el-table-column>
            <el-table-column label="类型" width="100px">
              <template slot-scope="scope">
                <div v-if="scope.row.subsystem.kind === 'backend'">
                  后端
                </div>
                <div v-else-if="scope.row.subsystem.kind === 'front'">
                  前端
                </div>
                <div></div>
              </template>
            </el-table-column>
            <el-table-column label="应用操做" width="250px">
              <template>
                <el-button type="success" style="margin-bottom: 10px"
                  >启动</el-button
                >
                <el-button type="danger" style="margin-bottom: 10px"
                  >停止</el-button
                >
                <br />
                <el-button type="danger" style="margin-bottom: 10px"
                  >重启</el-button
                >
              </template>
            </el-table-column>
            <el-table-column label="Jenkins操做" width="250px">
              <template slot-scope="scope">
                <el-button
                  v-loading="buildloading"
                  type="success"
                  @click="buildapplication(scope.row)"
                  style="margin-bottom: 10px"
                  >构建
                </el-button>
                <el-dropdown
                  split-button
                  trigger="click"
                  type="danger"
                  @command="getbuildconsole(scope.row)"
                  style="margin-bottom: 10px; margin-left: 10px"
                  >终止
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item :command="'select.'">1</el-dropdown-item>
                    <el-dropdown-item :command="'select.'">2</el-dropdown-item>
                    <el-dropdown-item :command="'select.'">3</el-dropdown-item>
                    <el-dropdown-item :command="'select.'">4</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
                <br />
                <el-button type="success" style="margin-bottom: 10px"
                  >回滚</el-button
                >
                <el-dropdown
                  split-button
                  trigger="click"
                  type="primary"
                  @command="getbuildconsole(scope.row, $event)"
                  style="margin-left: 10px"
                  @visible-change="getlastbuildnumber($event, scope.row)"
                  >日志
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                      v-for="tag in lastbuildnumber"
                      :key="tag"
                      :command="{ tag }"
                      >{{ tag.number }}
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
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
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      filterText: '',
      jenkinsGroupVisible: false,
      jenkinsGroup: {
        form: { consoleUrL: undefined, console_result: undefined }
      },
      lastbuildnumber: [],
      buildloading: false,
      currentSubsystem: null,
      applicationEnv: 'dev',
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      // defaultProps: {
      //   children: [],
      //   label: 'name',
      //   isLeaf: 'leaf'
      // },
      // applicationInstance: {
      //   id: null,
      //   createdTime: null,
      //   updateTime: null,
      //   cluster: { clusterName: null },
      //   namespace: { namespaceName: null },
      //   project: { projectName: null },
      //   applicationName: null
      // },
      applicationInstance: [],
      subsystemTree: [],
      activeNames: ['1'],
      checkList: [],
      environmentList: [],
      projectList: [],
      projectMenu: '',
      searchApplicationname: null,
      searchProject: null,
      searchEnvironment: null,
      condition: null,
      groupId: '',
      groupName: '',
      editGroup: {
        visible: false,
        form: { id: '', groupName: '', description: '', groupId: '' }
      },
      publishGroup: { visible: false, form: { name: '', comment: '' } },
      showDetail: false,
      detailId: '',
      detailName: '',
      activeName: '',
      buttonNew: false,
      buttonDelete: false,
      buttonChange: false
    }
  },
  created () {
    this.getSubsystemTree()
  },
  watch: {
    filterText (val) {
      this.$refs.tree.filter(val)
    }
  },
  methods: {
    // 树形
    // loadNode (node, resolve) {
    //   // 一级节点处理
    //   if (node.level === 0) {
    //     this.requestTree(resolve)
    //   }
    //   // 二级节点处理
    //   if (node.level === 1) {
    //     this.getProject(node, resolve)
    //   }
    //   // 三级节点处理
    //   if (node.level === 2) {
    //     this.getSubsystem(node, resolve)
    //   }
    // },
    // 首次加载一级节点数据函数(区域)
    // async requestTree (resolve) {
    //   let areaData = await this.$http.getAreaApi()
    //   areaData.results.forEach(value => {
    //     value.leaf = false
    //   })
    //   let data = areaData.results
    //   resolve(data)
    // },
    // 异步加载叶子节点数据函数（项目）
    // async getProject (node, resolve) {
    //   let projectData = await this.$http.getProjectApi({
    //     area: node.data.id
    //   })
    //   projectData.results.forEach(value => {
    //     value.leaf = false
    //     value.name = value.projectName
    //   })
    //   let data = projectData.results
    //   resolve(data)
    // },
    // 异步加载叶子节点数据函数（子系统）
    // async getSubsystem (node, resolve) {
    //   const param = { project: node.data.id, ordering: 'subsystemname' }
    //   let subsystemData = await this.$http.getsubsystemapi(param)
    //   subsystemData.results.forEach(value => {
    //     value.leaf = true
    //     value.name = value.subsystemname
    //   })
    //   let data = subsystemData.results
    //   resolve(data)
    // },
    // //树-转换
    // handleNodeClick (value) {
    //   if (value.flag == '2') {
    //     this.componyId = value.id
    //     this.getAllList()
    //   }
    // },
    renderContent: function (h, { node, data, store }) {
      if (data.flag == '2') {
        return (
          <span>
            {' '}
            <i class='el-icon-office-building' style='color: #409EFF;'>
              {' '}
            </i>
            <span title={data.name} class='style-demo'>
              {data.name}
            </span>{' '}
          </span>
        )
      } else if (data.flag == '1') {
        return (
          <span>
            {' '}
            <i class='el-icon-folder-opened' style='color: #FFB427;'>
              {' '}
            </i>
            <span title={data.name} class='style-demo'>
              {data.name}
            </span>{' '}
          </span>
        )
      }
    },
    async getlastbuildnumber (callback, row) {
      if (callback) {
        this.lastbuildnumber = []
        // 出现时展top 10日志
        const param = {
          env: this.applicationEnv,
          subsystemname: row.subsystem.subsystemname,
          kind: row.subsystem.kind
        }
        let res = await this.$http.getlastbuildnumberapi(param)
        if (res.hasOwnProperty('results')) {
          res.results.forEach(value => {
            this.lastbuildnumber.push({ number: value.number, url: value.url })
          })
        } else {
          this.$message.error('获取数据出错!')
        }
      }
    },
    async getbuildconsole (row, command) {
      this.$confirm('确认打开?', '提示', { type: 'warning' }).then(async () => {
        console.log(row)
        console.log(command)
        this.jenkinsGroupVisible = true
        let res = await this.$http.get(command.tag.url + 'consoleText')
        console.log(res)
      })
    },
    async buildapplication (row) {
      this.$confirm('确认构建?', '提示', { type: 'warning' }).then(async () => {
        const param = {
          env: this.applicationEnv,
          subsystemname: row.subsystem.subsystemname,
          kind: row.subsystem.kind
        }
        this.buildloading = true
        let res = await this.$http.buildapplicationapi(param)
        if (res.hasOwnProperty('results')) {
          const queue_number = res.results
          this.$message.success('开始构建中!' + queue_number)
        } else {
          this.$message.error('构建失败!')
        }
        this.buildloading = false
      })
    },
    filterNode (value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    // 搜索查询
    async onSearchValue () {
      const param = {
        applicationType: this.searchApplicationType
      }
      let res = await this.$http.searchApplicationApi(param)
    },
    async getApplicationIntance (obj, node, event) {
      if (obj.hasOwnProperty('subsystemId')) {
        this.currentSubsystem = obj.subsystemId
        const param = {
          subsystem: obj.subsystemId,
          environmentName: this.applicationEnv
        }
        let res = await this.$http.getApplicationApi(param)
        console.log(res.results)
        if (res.hasOwnProperty('results')) {
          this.applicationInstance = res.results
          console.log(this.applicationInstance)
        } else {
          this.$message.error('数据有误!')
        }
      }
    },
    async getSubsystemTree () {
      let res = await this.$http.getSubsystemTreeApi()
      console.log('res', res.results)
      if (res.hasOwnProperty('results')) {
        this.subsystemTree = res.results
      }
    },
    handleChange (val) {
      console.log(val)
    },
    async multipleapply () {
      if (this.checkList.length !== 0) {
        let res = this.$http.multipleapplypublishapi({
          application_ids: this.checkList
        })
        // this.$router.push({name: 'multiple_publish', params:{checkList: this.checkList}})
      } else {
        this.$message.error('请先添加!')
      }
    },
    async getCheckList (val) {
      this.checkList = []
      val.map(item => {
        this.checkList.push(item.id)
      })
    },
    async onSelectChangeProject (callback) {
      this.projectList = []
      if (callback) {
        let resProject = await this.$http.getProjectApi()
        this.projectList = resProject.results
      }
    },
    async onSelectChangeEnvironment () {
      const param = {
        subsystem: this.currentSubsystem,
        environmentName: this.applicationEnv
      }
      let res = await this.$http.getApplicationApi(param)
      if (res.hasOwnProperty('results')) {
        this.applicationInstance = res.results
        console.log(this.applicationInstance)
      } else {
        this.$message.error('数据有误!')
      }
    },
    async onSearchValue () {
      const param = {
        applicationName__contains: this.searchApplicationname,
        project: this.searchProject,
        environment: this.searchEnvironment
      }
      let res = await this.$http.searchApplicationApi(param)
      this.$refs.applicationinstancelist.setData(res.results, res.count)
      this.condition = param
    },
    closeDetail () {
      this.showDetail = false
    },
    showSafeDetail (item, active) {
      this.detailId = item.SecurityGroupId
      this.detailName = item.SecurityGroupName
      this.showDetail = true
      this.activeName = active
    },
    deleteSafeGroup (id) {
      this.$confirm('确认删除?', '提示', { type: 'warning' })
        .then(async () => {
          await this.$http.delete_brand({ id: id })
          this.$message.success('删除成功')
          this.$refs.brandList.getData()
        })
        .catch(_ => {})
    },
    add () {
      this.addGroup.visible = true
    },
    addConfirm () {
      this.$refs.addForm.validate(async v => {
        if (v) {
          const param = {
            name: this.addGroup.form.name,
            comment: this.addGroup.form.comment
          }
          let res = await this.$http.add_brand(param)
          this.addGroup.visible = false
          this.$refs.brandList.getData()
        }
      })
    },
    edit (item) {
      this.editGroup = {
        visible: true,
        form: { id: item.id, name: item.name, comment: item.comment }
      }
    },
    editConfirm () {
      this.$refs.editForm.validate(async v => {
        if (v) {
          const param = {
            id: this.editGroup.form.id,
            name: this.editGroup.form.name,
            comment: this.editGroup.form.comment
          }
          let res = await this.$http.patch_brand(param)
          this.$message.success('修改成功')
          this.editGroup.visible = false
          this.$refs.brandList.getData()
        }
      })
    },
    cancelEdit () {
      this.editGroup = {
        visible: false,
        form: { groupName: '', description: '', groupId: '' }
      }
      this.addGroup = { visible: false, form: { name: '', comment: '' } }
    },
    async getBrandList (key) {
      let res = await this.$http.get('/asset/brand/')
      this.$refs.brandList.setData(res.results, res.count)
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
.search-input {
  display: flex;
  margin-bottom: 30px;
}
.input {
  margin-right: 30px;
}
.filter-tree {
  margin-right: 30px;
}
</style>
