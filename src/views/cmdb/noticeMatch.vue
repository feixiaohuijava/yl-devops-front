<template>
  <div class="main">
    <div class="wrapper wrapper-content">
      <d-table
        url="/api/cmdb/noticematchviewset/"
        ref="noticeMatchList"
        v-if="!showDetail"
        :conditionForm="condition"
      >
        <template slot="headerRight">
          <el-form-item label="项目:">
            <el-select
              clearable
              @visible-change="onSelectChangeProject($event)"
              v-model="searchProject"
              style="width:160px"
            >
              <el-option
                v-for="item in projectList"
                :key="item.id"
                :value="item.projectName"
                :label="item.projectName"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input
              placeholder="子系统模糊搜索"
              v-model="searchsubsystem"
              class="input-search"
              @keyup.native.enter="onSearch"
              style="width: 200px"
            >
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-select clearable v-model="role">
              <el-option value="dev" label="dev"></el-option>
              <el-option value="ops" label="ops"></el-option>
              <el-option value="test" label="test"></el-option>
              <el-option value="product" label="product"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input
              placeholder="用户模糊搜索"
              v-model="searchUser"
              class="input-search"
              @keyup.native.enter="onSearch"
              style="width: 200px"
            >
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-select clearable v-model="noticeType">
              <el-option value="电话" label="电话"></el-option>
              <el-option value="短信" label="短信"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button
              icon="el-icon-search"
              type="primary"
              @click="onSearchValue"
              >查询</el-button
            >
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-plus" type="primary" @click="add"
              >添加</el-button
            >
          </el-form-item>
        </template>
        <template slot="column">
          <el-table-column label="id">
            <template slot-scope="scope">
              {{ scope.row.id }}
            </template>
          </el-table-column>
          <el-table-column label="项目组">
            <template slot-scope="scope">
              <div v-if="scope.row.project">
                {{ scope.row.project.projectName }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="子系统">
            <template slot-scope="scope">
              <div v-if="scope.row.subsystem">
                {{ scope.row.subsystem.subsystemname }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="角色">
            <template slot-scope="scope">
              {{ scope.row.role }}
            </template>
          </el-table-column>
          <el-table-column label="用户">
            <template slot-scope="scope">
              <div v-if="scope.row.user">
                {{ scope.row.user.username }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="通知类型">
            <template slot-scope="scope">
              <div v-if="scope.row.noticeType">
                {{ scope.row.noticeType.name }}
              </div>
            </template>
          </el-table-column>

          <el-table-column label="创建时间">
            <template slot-scope="scope">
              {{ scope.row.createTime }}
            </template>
          </el-table-column>
          <el-table-column label="修改时间">
            <template slot-scope="scope">
              {{ scope.row.updateTime }}
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-dropdown
                split-button
                trigger="click"
                type="primary"
                @click="edit(scope.row)"
                @command="handleCommand"
                >详情
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item :command="'delete.' + scope.row.id"
                    >删除
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </template>
      </d-table>
      <el-dialog
        title="新建告警通知"
        :visible.sync="addGroup.visible"
        width="40%"
      >
        <el-form :model="addGroup.form" ref="addForm" labelWidth="100px">
          <el-form-item prop="name" label="项目名">
            <el-select
              clearable
              @visible-change="onSelectChangeProject($event)"
              v-model="addGroup.form.project"
              style="width:160px"
            >
              <el-option
                v-for="item in projectList"
                :key="item.id"
                :value="item.id"
                :label="item.projectName"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="subsystem" label="子系统名">
            <el-autocomplete
              :loading="autocompleteloading"
              class="inline-input"
              v-model="addGroup.form.subsystemname"
              :fetch-suggestions="querySearchSubsystem"
              placeholder="模糊搜索"
              @select="handleSelectSubystem"
              style="width: 500px"
            ></el-autocomplete>
          </el-form-item>
          <el-form-item prop="kind" label="角色">
            <el-select v-model="addGroup.form.role">
              <el-option value="dev" label="dev"></el-option>
              <el-option value="test" label="test"></el-option>
              <el-option value="product" label="product"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="devGroup" label="开发">
            <el-autocomplete
              :loading="autocompleteloading"
              class="inline-input"
              v-model="addGroup.form.username"
              :fetch-suggestions="querySearch"
              placeholder="模糊搜索"
              @select="handleSelect"
              style="width: 500px"
            ></el-autocomplete>
          </el-form-item>
          <!-- <el-form-item prop="kind" label="通知类型">
            <el-select v-model="addGroup.form.noticeType">
              <el-option value="1" label="电话"></el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item prop="kind" label="通知类型">
            <el-select
              v-model="addGroup.form.noticeType"
              @visible-change="onSelectChangeCommunication($event)"
            >
              <el-option
                :value="item.id"
                :label="item.name"
                v-for="(item, index) in contactCheckList"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="addConfirm">确 定</el-button>
          <el-button @click="cancelEdit">取 消</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      role: null,
      noticeType: null,
      projectList: [],
      subsystemList: [],
      searchUser: null,
      searchsubsystem: null,
      searchProject: null,
      url: null,
      userList: [],
      reuserList: [],
      contactCheckList: [],
      autocompleteloading: false,
      condition: null,
      groupId: '',
      groupName: '',
      devuser: null,
      opsuser: null,
      editGroup: {
        visible: false,
        form: {
          id: '',
          projectName: '',
          manager: '',
          description: '',
          devGroup: []
        }
      },
      addGroup: {
        visible: false,
        form: {
          project: null,
          subsystem: null,
          subsystemname: null,
          role: null,
          user: null,
          username: null,
          noticeType: null
        }
      },
      showDetail: false,
      detailId: '',
      detailName: '',
      activeName: '',
      button_project_patch: false,
      button_project_delete: false
    }
  },
  created () {},
  mounted () {
    document.onkeydown = event => {
      var code = event.keyCode
      if (code == 13) {
        //这是键盘的enter监听事件
        this.onSearchValue()
      }
    }
  },
  methods: {
    async onSearchValue () {
      const param = {
        subsystem: this.searchsubsystem,
        project: this.searchProject,
        role: this.role,
        user: this.searchUser,
        noticeName: this.noticeType
      }
      let res = await this.$http.searchNoticeMatchApi(param)
      this.$refs.noticeMatchList.setData(res.results, res.count)
      this.condition = param
    },
    async onSelectChangeProject (callback) {
      this.projectList = []
      if (callback) {
        let resProject = await this.$http.getProjectApi()
        this.projectList = resProject.results
      }
    },
    async onSelectChangeSubsystem (callback) {
      this.subsystemList = []
      if (callback) {
        let resProject = await this.$http.getsubsystemapi()
        this.subsystemList = resProject.results
      }
    },
    async onSelectChangeUser (callback) {
      this.subsystemList = []
      if (callback) {
        let resProject = await this.$http.getsubsystemapi()
        this.subsystemList = resProject.results
      }
    },
    async querySearchSubsystem (queryString, cb) {
      this.resubsystemList = []
      this.subsystemList = []
      let resSubsystem = await this.$http.getsubsystemapi({
        ordering: 'subsystemname'
      })
      this.subsystemList = resSubsystem.results
      this.subsystemList.forEach(val => {
        this.resubsystemList.push({
          value: val.subsystemname,
          id: val.id,
          subsystemNick: val.subsystemNick,
          kind: val.kind,
          projectName: val.project !== null ? val.project.projectName : null
        })
      })
      var restaurants = this.resubsystemList
      var results = queryString
        ? this.resubsystemList.filter(
            this.createFilter(queryString.replace(/(^\s*)|(\s*$)/g, ''))
          )
        : this.resubsystemList
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    // 通知类型数据
    async onSelectChangeCommunication (callback) {
      if (callback) {
        let resProject = await this.$http.searchNoticetypeApi()
        this.contactCheckList = resProject.results
      }
    },
    async querySearch (queryString, cb) {
      this.reuserList = []
      let resAccount = await this.$http.getaccountuserapi()
      this.userList = resAccount.results
      this.userList.forEach(val => {
        this.reuserList.push({
          value: val.username,
          id: val.id
        })
      })
      console.log(this.reuserList)
      var restaurants = this.reuserList
      var results = queryString
        ? this.reuserList.filter(this.createFilter(queryString))
        : this.reuserList
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter (queryString) {
      return restaurant => {
        return (
          restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) > -1
        )
      }
    },
    async handleSelectSubystem (item) {
      this.addGroup.form.subsystemname = item.value
      this.addGroup.form.subsystem = item.id
    },
    async handleSelect (item) {
      this.addGroup.form.username = item.value
      this.addGroup.form.user = item.id
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
          await this.$http.deleteNoticeMatchApi({ id: id })
          this.$message.success('删除成功')
          this.$refs.noticeMatchList.getData()
        })
        .catch(_ => {})
    },
    add () {
      this.addGroup.visible = true
      this.addGroup.form = {
        project: null,
        subsystem: null,
        subsystemname: null,
        role: null,
        user: null,
        username: null,
        noticeType: null
      }
    },
    addConfirm () {
      this.$refs.addForm.validate(async v => {
        if (v) {
          const param = {
            project: this.addGroup.form.project,
            subsystem: this.addGroup.form.subsystem,
            role: this.addGroup.form.role,
            user: this.addGroup.form.user,
            noticeType: this.addGroup.form.noticeType
          }
          let res = await this.$http.addNoticeMatchApi(param)
          this.addGroup.visible = false
          this.$refs.noticeMatchList.getData()
        }
      })
    },
    async edit (item) {
      // this.editGroup.visible = true
      // let res = await this.$http.getDetailProjectApi({id: item.id})
      // this.editGroup.form = res.results
    },
    editConfirm () {
      this.$refs.editForm.validate(async v => {
        if (v) {
          const param = {
            id: this.editGroup.form.id,
            projectName: this.editGroup.form.projectName,
            manager: this.editGroup.form.manager,
            devGroup: this.editGroup.form.devGroup,
            opGroup: this.editGroup.form.opGroup,
            description: this.editGroup.form.description
          }
          let res = await this.$http.patchProjectApi(param)
          if (res.hasOwnProperty('results')) {
            this.$message.success('修改成功!')
            this.editGroup.visible = false
            this.$refs.projectList.getData()
          } else {
            this.$message.error('修改失败!')
          }
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
      console.log('perm', perm)
      if (perm.includes('update_project')) {
        this.button_project_patch = true
      }
      if (perm.includes('delete_project')) {
        this.button_project_delete = true
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
</style>
