<template>
  <div class="main">
    <div class="wrapper wrapper-content">
      <d-table
        url="/api/cmdb/subsystem/"
        ref="subsystemlist"
        v-if="!showDetail"
        :conditionForm="condition"
        :retainPageNum="true"
      >
        <!--    @visible-change="onSelectChangeArea($event)"-->
        <template slot="headerRight">
          <el-form-item>
            <el-select
              placeholder="请输入区域"
              clearable
              v-model="searchArea"
              style="width:160px"
            >
              <el-option
                v-for="item in areaList"
                :key="item.id"
                :value="item.id"
                :label="item.name"
              ></el-option>
            </el-select>
          </el-form-item>
          <!-- @visible-change="onSelectChangeProject($event)" -->
          <el-form-item>
            <el-select
              placeholder="请输入项目"
              clearable
              v-model="searchProject"
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
          <el-form-item>
            <el-input
              placeholder="子系统模糊搜索"
              v-model="searchsubsystem"
              class="input-search"
              style="width: 200px"
            >
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-input
              placeholder="子系统中文名模糊搜索"
              v-model="searchsubsystemNick"
              class="input-search"
              style="width: 200px"
            >
            </el-input>
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
            <el-button
              icon="el-icon-plus"
              type="primary"
              v-if="buttonNew"
              @click="add"
              >添加</el-button
            >
          </el-form-item>
          <el-form-item>
            <el-button type="primary" v-if="buttonNew">
              <router-link :to="{ name: 'cmdb_noticematch' }">告警</router-link>
            </el-button>
          </el-form-item>
        </template>
        <template slot="column">
          <el-table-column
            type="selection"
            width="55"
            :reserve-selection="true"
          >
          </el-table-column>
          <el-table-column label="id" width="100px">
            <template slot-scope="scope">
              {{ scope.row.id }}
            </template>
          </el-table-column>
          <el-table-column label="子系统" width="200px">
            <template slot-scope="scope">
              <a href="javascript:;" @click="toEditGroup(scope.row.id)">{{
                scope.row.subsystemname
              }}</a>
            </template>
          </el-table-column>
          <el-table-column label="子系统中文名" width="200px">
            <template slot-scope="scope">
              {{ scope.row.subsystemNick }}
            </template>
          </el-table-column>
          <el-table-column label="区域" width="90px">
            <template slot-scope="scope" v-if="scope.row.area">
              {{ scope.row.area.name }}
            </template>
          </el-table-column>
          <el-table-column label="项目">
            <template slot-scope="scope">
              <div v-if="scope.row.project === null"></div>
              <div v-else>
                项目名: {{ scope.row.project.projectName }}
                <br />
                项目负责人: {{ scope.row.project.manager }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="备注">
            <template slot-scope="scope">
              <div class="group-name">
                {{ scope.row.description }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="仓库地址">
            <template slot-scope="scope">
              {{ scope.row.gitlabUrl }}
            </template>
          </el-table-column>
          <el-table-column label="类型">
            <template slot-scope="scope">
              {{
                scope.row.microFront === true && scope.row.kind === '前端'
                  ? '微' + scope.row.kind
                  : scope.row.kind
              }}
            </template>
          </el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">
              <div v-if="scope.row.online === true">
                <el-tag type="primary">上线</el-tag>
              </div>
              <div v-else>
                <el-tag type="danger">下线</el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="修改时间">
            <template slot-scope="scope">
              {{ scope.row.updateTime }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150px">
            <template slot-scope="scope">
              <el-dropdown
                split-button
                trigger="click"
                type="primary"
                @click="edit(scope.row.id, scope.row.subsystemname)"
                @command="handleCommand"
                >维护人员
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    :disabled="!buttonDelete"
                    :command="'delete.' + scope.row.id"
                    >删除</el-dropdown-item
                  >
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </template>
      </d-table>
      <!-- 添加 -->
      <el-dialog
        title="新建子系统"
        :visible.sync="addGroup.visible"
        width="40%"
      >
        <el-form :model="addGroup.form" ref="addForm" labelWidth="100px">
          <el-form-item prop="name" label="子系统名">
            <el-input
              v-model="addGroup.form.subsystemname"
              style="width: 95%"
            ></el-input>
          </el-form-item>
          <el-form-item prop="name" label="子系统中文名">
            <el-input
              v-model="addGroup.form.subsystemNick"
              style="width: 95%"
            ></el-input>
          </el-form-item>
          <el-form-item prop="name" label="区域-项目">
            <!-- 二级联动选择器 -->
            <el-cascader
              v-model="areaProject"
              :props="props"
              placeholder="请选择"
              clearable
              :show-all-levels="true"
              style="width:400px"
            ></el-cascader>
            <!-- <el-select
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
            </el-select> -->
          </el-form-item>
          <el-form-item prop="kind" label="类型">
            <el-select v-model="addGroup.form.kind">
              <el-option value="backend" label="后端"></el-option>
              <el-option value="front" label="前端"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            prop="microFront"
            label="微前端"
            v-if="addGroup.form.kind == 'front'"
          >
            <el-switch v-model="addGroup.form.microFront"></el-switch>
          </el-form-item>
          <el-form-item prop="gitlabUrl" label="仓库地址">
            <el-input
              v-model="addGroup.form.gitlabUrl"
              type="textarea"
              :rows="2"
              placeholder="请输入内容"
              style="width: 95%"
            ></el-input>
          </el-form-item>
          <el-form-item prop="description" label="备注">
            <el-input
              v-model="addGroup.form.description"
              type="textarea"
              :rows="2"
              placeholder="请输入内容"
              style="width: 95%"
            ></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="addConfirmSubsystem"
            >确 定</el-button
          >
          <el-button @click="cancelEdit">取 消</el-button>
        </span>
      </el-dialog>
      <!-- 子系统详情 -->
      <el-dialog
        title="子系统详情"
        :visible.sync="editGroup.visible"
        width="40%"
      >
        <el-form :model="editGroup.form" ref="editForm" labelWidth="100px">
          <el-form-item prop="subsystemname" label="子系统名">
            <el-input
              v-model="editGroup.form.subsystemname"
              readonly
              style="width: 300px"
            ></el-input>
          </el-form-item>
          <el-form-item prop="subsystemNick" label="子系统中文名">
            <el-input
              v-model="editGroup.form.subsystemNick"
              style="width: 300px"
            ></el-input>
          </el-form-item>
          <el-form-item label="区域-项目">
            <div v-if="editGroup.form.area !== null">
              <el-select
                placeholder="请选择区域"
                clearable
                @visible-change="onSelectChangeArea($event)"
                v-model="editGroup.form.area.id"
                style="width:300px"
              >
                <el-option
                  v-for="item in areaList"
                  :key="item.id"
                  :value="item.id"
                  :label="item.name"
                ></el-option>
              </el-select>
              +
              <el-select
                placeholder="请选择项目"
                clearable
                @visible-change="onUpdateSelectChangeProject($event)"
                v-model="editGroup.form.project.id"
                style="width:300px"
              >
                <el-option
                  v-for="item in projectList"
                  :key="item.id"
                  :value="item.id"
                  :label="item.projectName"
                ></el-option>
              </el-select>
              <!-- <el-select
                clearable
                @visible-change="onUpdateSelectChangeProject($event)"
                v-model="editGroup.form.project.id"
                style="width:160px"
              >
                <el-option
                  v-for="item in projectList"
                  :key="item.id"
                  :value="item.id"
                  :label="item.projectName"
                ></el-option>
              </el-select> -->
            </div>
          </el-form-item>
          <el-form-item prop="kind" label="类型">
            <el-select v-model="editGroup.form.kind">
              <el-option value="backend" label="后端"></el-option>
              <el-option value="front" label="前端"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            prop="microFront"
            label="微前端"
            v-if="editGroup.form.kind == 'front'"
          >
            <el-switch v-model="editGroup.form.microFront"></el-switch>
          </el-form-item>
          <el-form-item prop="online" label="状态">
            <el-switch v-model="editGroup.form.online"></el-switch>
          </el-form-item>
          <el-form-item prop="gitlabUrl" label="仓库地址">
            <el-input
              v-model="editGroup.form.gitlabUrl"
              type="textarea"
              :rows="2"
              placeholder="请输入内容"
              style="width: 95%"
            ></el-input>
          </el-form-item>
          <el-form-item prop="description" label="备注">
            <el-input
              v-model="editGroup.form.description"
              type="textarea"
              :rows="2"
              placeholder="请输入内容"
              style="width: 95%"
            ></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button
            type="primary"
            :disabled="!buttonChange"
            @click="editConfirm"
            >确 定</el-button
          >
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
      kindList: [
        { id: 'backend', name: '后端' },
        { id: 'front', name: '前端' }
      ],
      checkList: [],
      contactCheck: {
        visible: false,
        contactCheckList: ['打电话', '短信'],
        select: []
      },
      pageNum: false,
      projectId: '',
      areaProject: '',
      searchIndex: '',
      searchArea: '',
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
      condition: null,
      groupId: '',
      groupName: '',
      props: {
        expandTrigger: 'click',
        lazy: true,
        lazyLoad: this.lazyLoad
      },
      editGroup: {
        visible: false,
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
          selectList: [],
          microFront: false,
          area: null
        }
      },
      addGroup: {
        visible: false,
        form: {
          subsystemname: '',
          subsystemNick: '',
          project: null,
          devGroup: [],
          opGroup: [],
          testGroup: [],
          productGroup: [],
          kind: null,
          gitlabUrl: null,
          description: null,
          microFront: false,
          area: null
        }
      },
      showDetail: false,
      detailId: '',
      detailName: '',
      activeName: '',
      buttonNew: false,
      buttonDelete: false,
      buttonChange: false,
      areaList: []
    }
  },
  created () {
    this.onSelectChangeArea(true)
    this.onSelectChangeProject(true)
    if (window.localStorage.getItem('jump') === '1') {
      if (
        JSON.parse(window.localStorage.getItem('paramData'))
          .subsystemname__contains ||
        JSON.parse(window.localStorage.getItem('paramData'))
          .subsystemNick__contains
      ) {
        window.localStorage.setItem('retainPageNum', 1)
      }
      window.localStorage.setItem('retainPage', 1)
    } else {
      window.localStorage.setItem('paramData', JSON.stringify({}))
      window.localStorage.setItem('retainPageNum', 1)
    }
    this.searchArea = JSON.parse(window.localStorage.getItem('paramData')).area

    this.searchProject = JSON.parse(
      window.localStorage.getItem('paramData')
    ).project

    this.searchsubsystem = JSON.parse(
      window.localStorage.getItem('paramData')
    ).subsystemname__contains
    this.searchsubsystemNick = JSON.parse(
      window.localStorage.getItem('paramData')
    ).subsystemNick__contains
    this.getPerm()
    window.localStorage.setItem('jump', 0)
  },
  mounted () {
    document.onkeydown = event => {
      var code = event.keyCode
      if (code === 13) {
        //这是键盘的enter监听事件
        this.onSearchValue()
      }
    }
  },
  methods: {
    // 获取area列表
    async onSelectChangeArea (callback) {
      this.areaList = []
      if (callback) {
        this.editGroup.form.project.id = ''
        let resCluster = await this.$http.getAreaApi()
        this.areaList = resCluster.results
      }
    },
    // 详情area列表
    // async onUpdateSelectChangeArea (callback) {
    //   if (callback) {
    //     this.editGroup.form.project.id = ''
    //     let reaAreac = await this.$http.getAreaApi()
    //     this.areaList = reaAreac.results
    //   }
    // },
    // 二级联动选择器
    lazyLoad (node, resolve) {
      this.getAreaData(node, resolve)
    },
    async getAreaData (node, resolve) {
      const level = node.level
      let result = []
      if (level === 0) {
        let resAreac = await this.$http.getAreaApi()
        resAreac.results.forEach(item => {
          result.push({
            value: item.id,
            label: item.name
          })
        })
      }
      if (level === 1) {
        const param = { area: node.data.value }
        let resChildren = await this.$http.getProjectApi(param)
        resChildren.results.forEach(item => {
          result.push({
            value: item.id,
            label: item.projectName
          })
        })
      }
      resolve(result)
    },
    // 点击子系统跳转到编辑
    async toEditGroup (id) {
      let reaAreac = await this.$http.getAreaApi()
      this.areaList = reaAreac.results
      let resProject = await this.$http.getProjectApi()
      this.projectList = resProject.results
      const param = { id: id }
      let res = await this.$http.getDetailSubsystemApi(param)
      console.log(res.results)
      this.editGroup.form = res.results
      this.kindList.forEach(value => {
        if (value.name === this.editGroup.form.kind) {
          this.editGroup.form.kind = value.id
        }
      })
      if (this.editGroup.form.project === null) {
        this.editGroup.form.project = { id: '', projectName: '' }
      }
      if (this.editGroup.form.area === null) {
        this.editGroup.form.area = { id: '' }
      }
      this.editGroup.visible = true
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
    async getCheckList (val) {
      this.checkList = []
      val.map(item => {
        this.checkList.push(item.id)
      })
    },
    handleDevGroupClose (tag, operate) {
      console.log(tag)
      console.log(operate)
      if (operate === 'create') {
        this.addGroup.form.devGroup.splice(
          this.addGroup.form.devGroup.findIndex(item => item === tag),
          1
        )
        console.log(this.addGroup.form.devGroup)
      } else if (operate === 'patch') {
        this.editGroup.form.devGroup.splice(
          this.editGroup.form.devGroup.findIndex(item => item === tag),
          1
        )
      }
    },
    handleTestGroupClose (tag, operate) {
      if (operate === 'create') {
        this.addGroup.form.testGroup.splice(
          this.addGroup.form.testGroup.findIndex(item => item === tag),
          1
        )
      }
      if (operate === 'patch') {
        this.editGroup.form.testGroup.splice(
          this.editGroup.form.testGroup.findIndex(item => item === tag),
          1
        )
      }
    },
    handleOpGroupClose (tag, operate) {
      if (operate === 'create') {
        this.addGroup.form.opGroup.splice(
          this.addGroup.form.opGroup.findIndex(item => item === tag),
          1
        )
      }
      if (operate === 'patch') {
        this.editGroup.form.opGroup.splice(
          this.editGroup.form.opGroup.findIndex(item => item === tag),
          1
        )
      }
    },
    handleProductGroupClose (tag, operate) {
      if (operate === 'create') {
        this.addGroup.form.productGroup.splice(
          this.addGroup.form.productGroup.findIndex(item => item === tag),
          1
        )
      }
      if (operate === 'patch') {
        this.editGroup.form.productGroup.splice(
          this.editGroup.form.productGroup.findIndex(item => item === tag),
          1
        )
      }
    },
    addDevGroup (operate) {
      if (operate === 'create') {
        this.addGroup.form.devGroup.push(this.adddevuser)
        this.adddevuser = null
      }
      if (operate === 'patch') {
        this.contactCheck.select = []
        this.contactCheck.visible = true
        this.editGroup.form.devGroup.push(this.patchdevuser)
        this.patchdevuser = null
      }
    },
    addOpGroup (operate) {
      if (operate === 'create') {
        this.addGroup.form.opGroup.push(this.addopsuser)
        this.addopsuser = null
      }
      if (operate === 'patch') {
        this.contactCheck.select = []
        this.contactCheck.visible = true
        this.editGroup.form.opGroup.push(this.patchopsuser)
        this.patchopsuser = null
      }
    },
    addtestGroup (operate) {
      if (operate === 'create') {
        this.addGroup.form.testGroup.push(this.addtestuser)
        this.addtestuser = null
      }
      if (operate === 'patch') {
        this.contactCheck.select = []
        this.contactCheck.visible = true
        this.editGroup.form.testGroup.push(this.patchtestuser)
        this.patchtestuser = null
      }
    },
    addProductGroup (operate) {
      if (operate === 'create') {
        this.addGroup.form.productGroup.push(this.addproductuser)
        this.addproductuser = null
      }
      if (operate === 'patch') {
        this.contactCheck.select = []
        this.contactCheck.visible = true
        this.editGroup.form.productGroup.push(this.patchproductuser)
        this.patchproductuser = null
      }
    },
    async onUpdateSelectChangeProject (callback) {
      if (callback) {
        let resProject = await this.$http.getProjectApi({
          area: this.editGroup.form.area.id
        })
        this.projectList = resProject.results
        this.editGroup.form.project.id = ''
      }
    },
    async onSelectChangeProject (callback) {
      this.projectList = []
      if (callback) {
        let resProject = await this.$http.getProjectApi()
        this.projectList = resProject.results
      }
    },
    async onSearchValue () {
      console.log('page查询')
      const paramData = {
        subsystemname__contains: this.searchsubsystem,
        subsystemNick__contains: this.searchsubsystemNick,
        project: this.searchProject,
        area: this.searchArea
      }
      const param = {
        subsystemname__contains: this.searchsubsystem,
        subsystemNick__contains: this.searchsubsystemNick,
        project: this.searchProject,
        page: 1,
        area: this.searchArea
      }
      if (
        this.searchsubsystem ||
        this.searchsubsystemNick ||
        this.searchProject ||
        this.searchArea
      ) {
        let res = await this.$http.searchSubsystemApi(param)
        this.$refs.subsystemlist.setData(res.results, res.count)
        this.condition = param
      }
      window.localStorage.setItem('retainPageNum', 1)
      localStorage.setItem('paramData', JSON.stringify(paramData))
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
    // 删除
    deleteSafeGroup (id) {
      this.$confirm('确认删除?', '提示', { type: 'warning' })
        .then(async () => {
          await this.$http.deleteSubsystemApi({ id: id })
          this.$message.success('删除成功')
          this.$refs.subsystemlist.getData()
        })
        .catch(_ => {})
    },
    // 点击新增按钮
    add () {
      this.addGroup.visible = true
      this.areaProject = []
      this.addGroup.form = {
        devGroup: [],
        opGroup: [],
        testGroup: [],
        productGroup: []
      }
    },
    // 新增确认
    addConfirmSubsystem () {
      this.$refs.addForm.validate(async v => {
        if (v) {
          const param = {
            subsystemname: this.addGroup.form.subsystemname,
            subsystemNick: this.addGroup.form.subsystemNick,
            project: this.areaProject[1] ? this.areaProject[1] : '',
            devGroup: this.addGroup.form.devGroup,
            testGroup: this.addGroup.form.testGroup,
            opGroup: this.addGroup.form.opGroup,
            productGroup: this.addGroup.form.productGroup,
            description: this.addGroup.form.description,
            gitlabUrl: this.addGroup.form.gitlabUrl,
            kind: this.addGroup.form.kind,
            microFront: this.addGroup.form.microFront,
            area: this.areaProject[0]
          }
          let res = await this.$http.addsubsystemapi(param)
          this.addGroup.visible = false
          this.$refs.subsystemlist.getData('add')
        }
      })
    },
    // 进入通知详情
    async edit (id, subsystemname) {
      localStorage.setItem('id', id)
      localStorage.setItem('subsystemName', subsystemname)
      let resProject = await this.$http.getProjectApi()
      this.projectList = resProject.results
      const param = { id: id }
      let res = await this.$http.getDetailSubsystemApi(param)
      this.editGroup.form = res.results
      this.$router.push({
        name: 'cmdb_communicationMode',
        params: {
          Info: res.results,
          projectList: resProject.results,
          id: id
        }
      })
    },
    // 编辑点击确定
    editConfirm () {
      this.$refs.editForm.validate(async v => {
        if (v) {
          const param = {
            id: this.editGroup.form.id,
            subsystemname: this.editGroup.form.subsystemname,
            subsystemNick: this.editGroup.form.subsystemNick,
            devGroup: this.editGroup.form.devGroup,
            testGroup: this.editGroup.form.testGroup,
            opGroup: this.editGroup.form.opGroup,
            productGroup: this.editGroup.form.productGroup,
            project: this.editGroup.form.project.id,
            gitlabUrl: this.editGroup.form.gitlabUrl,
            kind: this.editGroup.form.kind,
            description: this.editGroup.form.description,
            online: this.editGroup.form.online,
            microFront: this.editGroup.form.microFront,
            area: this.editGroup.form.area.id
          }
          let res = await this.$http.patchSubsystemApi(param)
          this.$message.success('修改成功')
          this.editGroup.visible = false
          this.$refs.subsystemlist.getData()
        }
      })
    },
    checkConfirm () {
      this.editGroup.form.selectList = this.contactCheck.select
      console.log('contactCheck', this.editGroup.form.selectList)
      this.contactCheck.visible = false
    },
    cancelEdit () {
      this.editGroup.visible = false
      this.addGroup.visible = false
    },
    checkCancelEdit () {
      this.contactCheck.visible = false
    },
    getPerm () {
      let perm = JSON.parse(window.sessionStorage.getItem('permission'))
      if (perm.includes('add_subsystem')) {
        this.buttonNew = true
      }
      if (perm.includes('update_subsystem')) {
        this.buttonDelete = true
      }
      if (perm.includes('delete_subsystem')) {
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
</style>
