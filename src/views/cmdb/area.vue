<template>
  <div class="main">
    <div class="wrapper wrapper-content">
      <d-table
        url="/api/cmdb/area/"
        ref="areaList"
        v-if="!showDetail"
        :conditionForm="condition"
      >
        <template slot="headerRight">
          <el-form-item class="el-icon-plus-btn">
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
          <el-table-column label="区域">
            <template slot-scope="scope">
              {{ scope.row.name }}
            </template>
          </el-table-column>
          <el-table-column label="平台">
            <template slot-scope="scope">
              {{ scope.row.description }}
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
    </div>
    <!-- 添加应用 -->
    <el-dialog title="添加区域" :visible.sync="addGroup.visible" width="40%">
      <el-form :model="addGroup.form" ref="addForm" labelWidth="110px">
        <el-form-item prop="name" label="区域">
          <el-input
            v-model="addGroup.form.name"
            style="width: 200px"
          ></el-input>
        </el-form-item>
        <el-form-item prop="description" label="平台">
          <el-input
            v-model="addGroup.form.description"
            style="width: 200px"
          ></el-input>
        </el-form-item>
        <el-form-item label="前缀" prop="prefix">
          <el-input
            v-model="addGroup.form.prefix"
            style="width: 200px"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addConfirm">确 定</el-button>
        <el-button @click="cancelEdit('add')">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      showDetail: false,
      condition: null,
      addGroup: {
        visible: false,
        form: {
          name: null,
          prefix: null,
          description: null
        }
      }
    }
  },
  created () {
    // this.getPerm()
  },
  methods: {
    // 添加
    add () {
      this.addGroup.visible = true
      this.addGroup.form = {
        name: null,
        prefix: null,
        description: null
      }
    },
    async addConfirm () {
      const param = {
        name: this.addGroup.form.name,
        prefix: this.addGroup.form.prefix,
        description: this.addGroup.form.description
      }
      let res = await this.$http.add_area(param)
      this.addGroup.visible = false
      this.$refs.areaList.getData()
    },
    cancelEdit () {
      this.addGroup.visible = false
    },
    // 删除
    handleCommand (command) {
      let list = command.split('.')
      if (list[0] === 'delete') {
        this.deleteSafeGroup(list[1])
      }
    },
    deleteSafeGroup (id) {
      this.$confirm('确认删除?', '提示', { type: 'warning' })
        .then(async () => {
          let res = await this.$http.delete_area({ id: id })
          if (res.hasOwnProperty('results')) {
            this.$message.success('删除成功')
          } else {
            this.$message.error('删除失败!')
          }
          this.$refs.areaList.getData()
        })
        .catch(_ => {})
    },
    // 进入详情
    edit () {}
    // async querySearch (queryString, cb) {
    //   this.reuserList = []
    //   let resAccount = await this.$http.getaccountuserapi()
    //   this.userList = resAccount.results
    //   this.userList.forEach(val => {
    //     this.reuserList.push({
    //       value: val.username,
    //       id: val.id
    //     })
    //   })
    //   console.log(this.reuserList)
    //   var restaurants = this.reuserList
    //   var results = queryString
    //     ? this.reuserList.filter(this.createFilter(queryString))
    //     : this.reuserList
    //   // 调用 callback 返回建议列表的数据
    //   cb(results)
    // },
    // createFilter (queryString) {
    //   return restaurant => {
    //     return (
    //       restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) > -1
    //     )
    //   }
    // },
    // async handleSelect (item, type) {
    //   if (type === 'dev') {
    //     this.devuser = item.value
    //   }
    //   if (type === 'op') {
    //     this.opsuser = item.value
    //   }
    // },
    // handleDevGroupClose (tag) {
    //   this.editGroup.form.devGroup.splice(
    //     this.editGroup.form.devGroup.findIndex(item => item === tag),
    //     1
    //   )
    // },
    // handleOpGroupClose (tag) {
    //   this.editGroup.form.opGroup.splice(
    //     this.editGroup.form.opGroup.findIndex(item => item === tag),
    //     1
    //   )
    // },
    // addDevGroup () {
    //   this.editGroup.form.devGroup.push(this.devuser)
    //   this.devuser = null
    // },
    // addOpGroup () {
    //   this.editGroup.form.opGroup.push(this.opsuser)
    //   this.opsuser = null
    // },
    // closeDetail () {
    //   this.showDetail = false
    // },
    // showSafeDetail (item, active) {
    //   this.detailId = item.SecurityGroupId
    //   this.detailName = item.SecurityGroupName
    //   this.showDetail = true
    //   this.activeName = active
    // },
    // deleteSafeGroup (id) {
    //   this.$confirm('确认删除?', '提示', { type: 'warning' })
    //     .then(async () => {
    //       await this.$http.deleteProjectApi({ id: id })
    //       this.$message.success('删除成功')
    //       this.$refs.projectList.getData()
    //     })
    //     .catch(_ => {})
    // },
    // add () {
    //   this.addGroup.visible = true
    // },
    // addConfirm () {
    //   this.$refs.addForm.validate(async v => {
    //     if (v) {
    //       const param = {
    //         name: this.addGroup.form.name,
    //         comment: this.addGroup.form.comment
    //       }
    //       let res = await this.$http.add_brand(param)
    //       this.addGroup.visible = false
    //       this.$refs.brandList.getData()
    //     }
    //   })
    // },
    // async edit (item) {
    //   this.editGroup.visible = true
    //   let res = await this.$http.getDetailProjectApi({ id: item.id })
    //   this.editGroup.form = res.results
    // },
    // editConfirm () {
    //   this.$refs.editForm.validate(async v => {
    //     if (v) {
    //       const param = {
    //         id: this.editGroup.form.id,
    //         projectName: this.editGroup.form.projectName,
    //         manager: this.editGroup.form.manager,
    //         devGroup: this.editGroup.form.devGroup,
    //         opGroup: this.editGroup.form.opGroup,
    //         description: this.editGroup.form.description
    //       }
    //       let res = await this.$http.patchProjectApi(param)
    //       if (res.hasOwnProperty('results')) {
    //         this.$message.success('修改成功!')
    //         this.editGroup.visible = false
    //         this.$refs.projectList.getData()
    //       } else {
    //         this.$message.error('修改失败!')
    //       }
    //     }
    //   })
    // },
    // cancelEdit () {
    //   this.editGroup = {
    //     visible: false,
    //     form: { groupName: '', description: '', groupId: '' }
    //   }
    //   this.addGroup = { visible: false, form: { name: '', comment: '' } }
    // },
    // async getBrandList (key) {
    //   let res = await this.$http.get('/asset/brand/')
    //   this.$refs.brandList.setData(res.results, res.count)
    // },
    // getPerm () {
    //   let perm = JSON.parse(window.sessionStorage.getItem('permission'))
    //   if (perm.includes('update_project')) {
    //     this.button_project_patch = true
    //   }
    //   if (perm.includes('delete_project')) {
    //     this.button_project_delete = true
    //   }
    // },
    // handleCommand (command) {
    //   let list = command.split('.')
    //   if (list[0] === 'delete') {
    //     this.deleteSafeGroup(list[1])
    //   }
    // }
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
