<template>
  <div class="main">
    <div class="wrapper wrapper-content">
      <d-table
        url="/api/cmdb/project/"
        ref="projectList"
        v-if="!showDetail"
        :conditionForm="condition"
      >
        <template slot="headerRight">
          <el-form-item>
            <!-- <el-select
              placeholder="请输入区域"
              clearable
              @visible-change="onSelectChangeArea($event)"
              v-model="searchArea"
              style="width:160px"
            >
              <el-option
                v-for="item in areaList"
                :key="item.id"
                :value="item.id"
                :label="item.name"
              ></el-option>
            </el-select> -->
            <e-select
              width="160px"
              url="/api/cmdb/area/"
              placeholder="请输入区域"
              @onValue="getAreaValue"
              chang-list="area"
            ></e-select>
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
          <el-table-column label="项目名">
            <template slot-scope="scope">
              {{ scope.row.projectName }}
            </template>
          </el-table-column>
          <el-table-column label="区域">
            <template slot-scope="scope" v-if="scope.row.area">
              {{ scope.row.area.name }}
            </template>
          </el-table-column>
          <el-table-column label="项目负责人">
            <template slot-scope="scope">
              {{ scope.row.manager }}
            </template>
          </el-table-column>
          <el-table-column label="地标">
            <template slot-scope="scope" v-if="scope.row.projectLocation">
              {{ scope.row.projectLocation.locationName }}
            </template>
          </el-table-column>
          <el-table-column label="备注">
            <template slot-scope="scope">
              <div class="group-name">
                {{ scope.row.description }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="创建时间">
            <template slot-scope="scope">
              {{ scope.row.createdTime }}
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
                  <el-dropdown-item
                    :command="'delete.' + scope.row.id"
                    :disabled="!button_project_delete"
                    >删除
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </template>
      </d-table>
      <!-- 添加 -->
      <el-dialog title="新建项目" :visible.sync="addGroup.visible" width="40%">
        <el-form :model="addGroup.form" ref="addForm" labelWidth="100px">
          <el-form-item prop="projectName" label="项目名">
            <el-input
              placeholder="请输入项目名"
              v-model="addGroup.form.projectName"
              style="width: 400px"
            ></el-input>
          </el-form-item>
          <el-form-item prop="area" label="区域">
            <el-select
              placeholder="请选择区域"
              clearable
              @visible-change="onSelectChangeArea($event)"
              v-model="addGroup.form.area"
              style="width:400px"
            >
              <el-option
                v-for="item in areaList"
                :key="item.id"
                :value="item.id"
                :label="item.name"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="addConfirm">确 定</el-button>
          <el-button @click="cancelEdit">取 消</el-button>
        </span>
      </el-dialog>
      <!-- 详情 -->
      <el-dialog title="项目详情" :visible.sync="editGroup.visible" width="40%">
        <el-form :model="editGroup.form" ref="editForm" labelWidth="100px">
          <el-form-item prop="projectName" label="项目名">
            <el-input
              v-model="editGroup.form.projectName"
              style="width: 95%"
            ></el-input>
          </el-form-item>
          <el-form-item prop="manager" label="项目负责人">
            <el-input
              v-model="editGroup.form.manager"
              style="width: 95%"
            ></el-input>
          </el-form-item>
          <el-form-item prop="devGroup" label="开发">
            <el-autocomplete
              :loading="autocompleteloading"
              class="inline-input"
              v-model="devuser"
              :fetch-suggestions="querySearch"
              placeholder="模糊搜索"
              @select="handleSelect($event, 'dev')"
              style="width: 500px"
            ></el-autocomplete>
            <el-button type="primary" @click="addDevGroup">添加</el-button>
            <br />
            <el-tag
              closable
              @close="handleDevGroupClose(tag)"
              v-for="tag in editGroup.form.devGroup"
              :key="tag"
            >
              {{ tag }}
            </el-tag>
          </el-form-item>
          <el-form-item prop="opGroup" label="运维">
            <el-autocomplete
              :loading="autocompleteloading"
              class="inline-input"
              v-model="opsuser"
              :fetch-suggestions="querySearch"
              placeholder="模糊搜索"
              @select="handleSelect($event, 'op')"
              style="width: 500px"
            ></el-autocomplete>
            <el-button type="primary" @click="addOpGroup">添加</el-button>
            <br />
            <el-tag
              closable
              @close="handleOpGroupClose(tag)"
              v-for="tag in editGroup.form.opGroup"
              :key="tag"
            >
              {{ tag }}
            </el-tag>
          </el-form-item>
          <el-form-item prop="comment" label="备注">
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
            :disabled="!button_project_patch"
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
      areaValue: '',
      userList: [],
      reuserList: [],
      searchArea: '',
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
          projectName: '',
          projectLocation: '',
          area: ''
        }
      },
      showDetail: false,
      detailId: '',
      detailName: '',
      activeName: '',
      button_project_patch: false,
      button_project_delete: false,
      areaList: []
    }
  },
  created () {
    this.getPerm()
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
    // 获取区域列表域数据
    async onSelectChangeArea (callback) {
      this.areaList = []
      if (callback) {
        let resCluster = await this.$http.getAreaApi()
        this.areaList = resCluster.results
      }
    },
    getAreaValue (val) {
      this.searchArea = val
    },
    // 搜索
    async onSearchValue () {
      const param = {
        area: this.searchArea,
        page: 1
      }
      let res = await this.$http.getProjectApi(param)
      this.$refs.projectList.setData(res.results, res.count)
      this.condition = param
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
    async handleSelect (item, type) {
      if (type === 'dev') {
        this.devuser = item.value
      }
      if (type === 'op') {
        this.opsuser = item.value
      }
    },
    handleDevGroupClose (tag) {
      this.editGroup.form.devGroup.splice(
        this.editGroup.form.devGroup.findIndex(item => item === tag),
        1
      )
    },
    handleOpGroupClose (tag) {
      this.editGroup.form.opGroup.splice(
        this.editGroup.form.opGroup.findIndex(item => item === tag),
        1
      )
    },
    addDevGroup () {
      this.editGroup.form.devGroup.push(this.devuser)
      this.devuser = null
    },
    addOpGroup () {
      this.editGroup.form.opGroup.push(this.opsuser)
      this.opsuser = null
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
          await this.$http.deleteProjectApi({ id: id })
          this.$message.success('删除成功')
          this.$refs.projectList.getData()
        })
        .catch(_ => {})
    },
    add () {
      this.addGroup.visible = true
      this.addGroup.form = {
        projectName: '',
        projectLocation: '',
        area: ''
      }
    },
    // 新增确认
    addConfirm () {
      this.$refs.addForm.validate(async v => {
        if (v) {
          const param = {
            area: this.addGroup.form.area,
            projectName: this.addGroup.form.projectName
          }
          let res = await this.$http.add_project(param)
          this.addGroup.visible = false
          this.$refs.projectList.getData()
        }
      })
    },
    async edit (item) {
      this.editGroup.visible = true
      let res = await this.$http.getDetailProjectApi({ id: item.id })
      this.editGroup.form = res.results
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
