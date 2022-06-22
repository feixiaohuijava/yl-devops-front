<template>
  <div class="main">
    <div class="wrapper wrapper-content">
      <h3 class="subsystem-personnel">子系统人员</h3>
      <el-button
        icon="el-icon-back"
        type="primary"
        @click="routerBack"
        class="back-btn"
        >返回</el-button
      >
      <span>当前子系统：{{ subsystemName }}</span>
      <d-table
        url="/api/cmdb/noticematchviewset/"
        ref="communicationMode"
        v-if="!showDetail"
        :conditionForm="condition"
        :isCommunicationMode="true"
      >
        <template slot="headerLeft">
          <el-form-item>
            <el-select clearable v-model="role" placeholder="角色搜索">
              <el-option value="dev" label="开发"></el-option>
              <el-option value="product" label="产品"></el-option>
              <el-option value="ops" label="运维"></el-option>
              <el-option value="test" label="测试"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input
              placeholder="用户搜索"
              v-model="searchUser"
              class="input-search"
              style="width: 200px"
            >
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-select
              clearable
              v-model="communication"
              placeholder="选择通知类型"
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
          <el-form-item>
            <el-button
              icon="el-icon-search"
              type="primary"
              @click="onSearchValue()"
              >查询</el-button
            >
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-plus" @click="add"
              >添加</el-button
            >
          </el-form-item>
        </template>
        <template slot="column">
          <el-table-column label="id" width="200px">
            <template slot-scope="scope">
              {{ scope.row.id }}
            </template>
          </el-table-column>
          <el-table-column label="角色" sortable="custom" prop="role">
            <template slot-scope="scope"> {{ scope.row.role }} </template>
          </el-table-column>
          <el-table-column label="用户" sortable="custom" prop="user">
            <template slot-scope="scope">
              <div v-if="scope.row.user">
                {{ scope.row.user.username }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="通知类型" width="400px">
            <template slot-scope="scope">
              <div v-if="scope.row.noticeType">
                {{ scope.row.noticeType.name }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="250px">
            <template slot-scope="scope">
              <el-dropdown
                split-button
                trigger="click"
                type="primary"
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
      <!-- 新建 -->
      <el-dialog
        title="新建子系统人员"
        :visible.sync="addGroup.visible"
        width="40%"
      >
        <el-form :model="addGroup.form" ref="addForm" labelWidth="100px">
          <el-form-item prop="role" label="角色">
            <el-select v-model="addGroup.form.role">
              <el-option value="dev" label="开发"></el-option>
              <el-option value="product" label="产品"></el-option>
              <el-option value="ops" label="运维"></el-option>
              <el-option value="test" label="测试"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="username" label="用户名">
            <el-autocomplete
              :loading="autocompleteloading"
              class="inline-input"
              v-model="addGroup.form.username"
              :fetch-suggestions="userQuerySearch"
              placeholder="模糊搜索"
              @select="userHandleSelect"
              style="width: 500px"
            ></el-autocomplete>
            <el-button type="primary" @click="addDevGroup('add')"
              >添加</el-button
            >
            <br />
            <el-tag
              class="user-tag"
              closable
              @close="handleDevGroupClose(tag, 'add')"
              v-for="tag in addGroup.form.usernameList"
              :key="tag"
            >
              {{ tag }}
            </el-tag>
          </el-form-item>
          <el-form-item prop="noticeType" label="通知类型">
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
      subsystemName: '',
      role: null,
      searchUser: null,
      condition: {
        id: ''
      },
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
          subsystem: null,
          role: null,
          user: null,
          username: null,
          noticeType: null,
          usernameList: [],
          userList: []
        }
      },
      communication: '',
      contactCheckList: [],
      checkList: [],
      contactCheck: {
        visible: false,
        contactCheckList: ['打电话', '短信'],
        select: []
      },
      projectId: '',
      projectList: [],
      searchsubsystem: null,
      searchsubsystemNick: null,
      searchProject: null,
      userList: [],
      reuserList: [],
      autocompleteloading: false,
      adddevuser: null,
      addopsuser: null,
      addtestuser: null,
      addproductuser: null,
      patchdevuser: null,
      patchopsuser: null,
      patchtestuser: null,
      patchproductuser: null,
      infoGroup: {
        devGroup: [],
        opGroup: null,
        testGroup: null,
        productGroup: null,
        form: {
          id: '',
          subsystemname: '',
          subsystemNick: '',
          project: { id: null, projectName: null },
          devGroup: [],
          testGroup: [],
          opGroup: [],
          kind: null,
          productGroup: [],
          description: null,
          gitlabUrl: null,
          selectList: []
        }
      },
      kindList: [
        { id: 'backend', name: '后端' },
        { id: 'front', name: '前端' }
      ],
      showDetail: false,
      tableSort: false
    }
  },
  created () {
    this.condition.id = localStorage.getItem('id')
    this.subsystemName = localStorage.getItem('subsystemName')
    this.infoGroup.form = this.$route.params.Info
    this.projectList = this.$route.params.projectList
    if (this.infoGroup.form) {
      this.kindList.forEach(value => {
        if (value.name === this.infoGroup.form.kind) {
          this.infoGroup.form.kind = value.id
        }
      })
    }
  },
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
    // 排序
    sortByDate (obj1, obj2) {
      this.tableSort = !this.tableSort
      if (this.tableSort) {
        // 向下排序
        return obj1.role.localeCompare(obj2.role)
      } else {
        // 向上排序
        return obj2.role.localeCompare(obj1.role)
      }
    },
    // 返回上一级
    routerBack () {
      window.localStorage.setItem('jump', 1)
      window.localStorage.setItem('retainPage', 1)
      this.$router.go(-1)
    },
    // 获取模糊搜索数据
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
      var restaurants = this.reuserList
      var results = queryString
        ? this.reuserList.filter(this.createFilter(queryString))
        : this.reuserList
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    // 项目名数据
    async onUpdateSelectChangeProject (callback) {
      if (callback) {
        let resProject = await this.$http.getProjectApi()
        this.projectList = resProject.results
        this.infoGroup.form.project.id = ''
      }
    },
    // 通知类型数据
    async onSelectChangeCommunication (callback) {
      if (callback) {
        let resProject = await this.$http.searchNoticetypeApi()
        this.contactCheckList = resProject.results
      }
    },
    // 搜索
    async handleSelect (item, type, operate) {
      console.log(item.value != '')
      if (type === 'dev') {
        if (operate === 'create') {
          this.adddevuser = item.value
        }
        if (operate === 'patch') {
          this.patchdevuser = item.value
        }
      }
      if (type === 'ops') {
        if (operate === 'create') {
          this.addopsuser = item.value
        }
        if (operate === 'patch') {
          this.patchopsuser = item.value
        }
      }
      if (type === 'test') {
        if (operate === 'create') {
          this.addtestuser = item.value
        }
        if (operate === 'patch') {
          this.patchtestuser = item.value
        }
      }
      if (type === 'product') {
        if (operate === 'create') {
          this.addproductuser = item.value
        }
        if (operate === 'patch') {
          this.patchproductuser = item.value
        }
      }
    },
    // 开发添加
    addDevGroup (operate) {
      if (operate === 'patch') {
        this.infoGroup.form.devGroup.push(this.patchdevuser)
        this.patchdevuser = null
      } else if (operate === 'add') {
        let isIncludes = this.addGroup.form.usernameList.includes(
          this.addGroup.form.username
        )
        if (!isIncludes) {
          this.addGroup.form.usernameList.unshift(this.addGroup.form.username)
          this.addGroup.form.userList.unshift(this.addGroup.form.user)
          this.addGroup.form.username = null
        } else {
          this.$message({
            message: '该用户名已经选过了，请重新选择',
            type: 'warning'
          })
        }
      }
    },
    // 产品添加
    addProductGroup (operate) {
      if (operate === 'patch') {
        this.infoGroup.form.productGroup.push(this.patchproductuser)
        this.patchproductuser = null
      }
    },
    // 运维添加
    addOpGroup (operate) {
      if (operate === 'patch') {
        this.infoGroup.form.opGroup.push(this.patchopsuser)
        this.patchopsuser = null
      }
    },
    // 测试添加
    addtestGroup (operate) {
      if (operate === 'patch') {
        this.infoGroup.form.testGroup.push(this.patchtestuser)
        this.patchtestuser = null
      }
    },
    // 删除
    handleDevGroupClose (tag, operate) {
      console.log(tag)
      if (operate === 'patch') {
        this.infoGroup.form.devGroup.splice(
          this.infoGroup.form.devGroup.findIndex(item => item === tag),
          1
        )
      } else if (operate === 'add') {
        this.addGroup.form.usernameList.splice(
          this.addGroup.form.usernameList.findIndex(item => item === tag),
          1
        )
      }
    },
    handleTestGroupClose (tag, operate) {
      if (operate === 'patch') {
        this.infoGroup.form.testGroup.splice(
          this.infoGroup.form.testGroup.findIndex(item => item === tag),
          1
        )
      }
    },
    handleOpGroupClose (tag, operate) {
      if (operate === 'patch') {
        this.infoGroup.form.opGroup.splice(
          this.infoGroup.form.opGroup.findIndex(item => item === tag),
          1
        )
      }
    },
    handleProductGroupClose (tag, operate) {
      if (operate === 'patch') {
        this.infoGroup.form.productGroup.splice(
          this.infoGroup.form.productGroup.findIndex(item => item === tag),
          1
        )
      }
    },
    // 删除列表
    deleteSafeGroup (id) {
      this.$confirm('确认删除?', '提示', { type: 'warning' })
        .then(async () => {
          await this.$http.deleteNoticeMatchApi({ id: id })
          this.$message.success('删除成功')
          this.$refs.communicationMode.getData()
        })
        .catch(_ => {})
    },
    handleCommand (command) {
      let list = command.split('.')
      if (list[0] === 'delete') {
        this.deleteSafeGroup(list[1])
      }
    },
    // 删除tag
    handleCloseTag (noticeTypeList, tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1)
    },
    // 搜索
    async onSearchValue () {
      const param = {
        subsystem: this.condition.id,
        role: this.role,
        user: this.searchUser,
        noticeType: this.communication,
        id: this.condition.id
      }
      let res = await this.$http.searchNoticeMatchApi(param)
      res.results.forEach(item => {
        if (item.role == 'dev') {
          item.role = `${item.role}(开发)`
        } else if (item.role == 'product') {
          item.role = `${item.role}(产品)`
        } else if (item.role == 'ops') {
          item.role = `${item.role}(运维)`
        } else if (item.role == 'test') {
          item.role = `${item.role}(测试)`
        }
      })
      this.$refs.communicationMode.setData(res.results, res.count)
      this.condition = param
    },
    add () {
      this.addGroup.visible = true
      this.addGroup.form = {
        role: null,
        user: null,
        username: null,
        noticeType: null,
        usernameList: [],
        userList: []
      }
    },
    // 新建点击确定
    addConfirm () {
      this.$refs.addForm.validate(async v => {
        if (v) {
          const param = {
            subsystem: this.condition.id,
            role: this.addGroup.form.role,
            // user: this.addGroup.form.user,
            user: this.addGroup.form.userList,
            noticeType: this.addGroup.form.noticeType
          }
          console.log('param', param)
          let res = await this.$http.addNoticeMatchApi(param)
          this.addGroup.visible = false
          this.$refs.communicationMode.getData()
        }
      })
    },
    async onSelectChangeProject (callback) {
      this.projectList = []
      if (callback) {
        let resProject = await this.$http.getProjectApi()
        this.projectList = resProject.results
      }
    },
    /*     async onSelectChangeSubsystem (callback) {
      this.subsystemList = []
      if (callback) {
        let resProject = await this.$http.getsubsystemapi()
        this.subsystemList = resProject.results
      }
    }, */
    /*     async onSelectChangeUser (callback) {
      this.subsystemList = []
      if (callback) {
        let resProject = await this.$http.getsubsystemapi()
        this.subsystemList = resProject.results
      }
    }, */
    // 子系统名
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
    // 获取用户名数据列表
    // async onSelectChangeUsername () {
    //   this.reuserList = []
    //   let resAccount = await this.$http.getaccountuserapi()
    //   this.userList = resAccount.results
    //   this.userList.forEach(val => {
    //     this.reuserList.push({
    //       value: val.username,
    //       id: val.id
    //     })
    //   })
    // },
    async handleSelectSubystem (item) {
      this.addGroup.form.subsystemname = item.value
      this.addGroup.form.subsystem = item.id
    },
    async userQuerySearch (queryString, cb) {
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
    // 新建取消
    cancelEdit () {
      this.addGroup = { visible: false, form: { name: '', comment: '' } }
    },
    createFilter (queryString) {
      return restaurant => {
        return (
          restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) > -1
        )
      }
    },

    async userHandleSelect (item) {
      this.addGroup.form.username = item.value
      this.addGroup.form.user = item.id
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
.communicationTag {
  margin-right: 10px;
}
.infoForm {
  display: flex;
  flex-wrap: wrap;
  align-content: center;
}
.top {
  padding: 30px;
  width: 100%;
  height: 180px;
  background-color: #fff;
  margin-bottom: 30px;
}
.back-btn {
  margin-left: 20px;
}
.subsystem-personnel {
  font-size: 30px;
  text-align: center;
}
.user-tag {
  margin-right: 10px;
}
</style>
