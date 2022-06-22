<template>
  <div class="main">
    <div class="wrapper wrapper-content">
      <d-table
        url="/api/account/group/"
        ref="userList"
        v-if="!showDetail"
        :conditionForm="condition"
      >
        <template slot="headerRight">
          <el-form-item>
            <el-input
              placeholder="角色搜索"
              v-model="searchusername"
              class="input-search"
              @keyup.native.enter="onSearchValue"
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
          <el-table-column label="角色">
            <template slot-scope="scope">
              {{ scope.row.name }}
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
                >权限
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item :command="'delete.' + scope.row.id"
                    >删除</el-dropdown-item
                  >
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </template>
      </d-table>
      <el-dialog title="新建角色" :visible.sync="addGroup.visible" width="40%">
        <el-form :model="addGroup.form" ref="addForm" labelWidth="100px">
          <el-form-item prop="name" label="角色" :rules="$newrules.empty">
            <el-input
              v-model="addGroup.form.name"
              style="width: 95%"
            ></el-input>
          </el-form-item>
          <el-form-item prop="comment" label="备注">
            <el-input
              v-model="addGroup.form.comment"
              type="textarea"
              :rows="2"
              placeholder="请输入内容"
              style="width: 95%"
            ></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="addConfirm" disabled
            >确 定</el-button
          >
          <el-button @click="cancelEdit">取 消</el-button>
        </span>
      </el-dialog>
      <el-dialog title="用户详情" :visible.sync="editGroup.visible" width="40%">
        <el-form :model="editGroup.form" ref="editForm" labelWidth="100px">
          <el-form-item prop="id" label="id">
            <el-input
              v-model="editGroup.form.id"
              readonly
              style="width: 95%"
            ></el-input>
          </el-form-item>
          <el-form-item prop="username" label="用户名">
            <el-input
              v-model="editGroup.form.username"
              style="width: 95%"
            ></el-input>
          </el-form-item>
          <el-form-item prop="phone" label="电话">
            <el-input
              v-model="editGroup.form.phone"
              style="width: 95%"
            ></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="editConfirm" disabled
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
      searchusername: null,
      condition: null,
      groupId: '',
      groupName: '',
      editGroup: { visible: false, form: { id: '', username: '', phone: '' } },
      addGroup: { visible: false, form: { name: '', comment: '' } },
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
    // this.getPerm()
  },
  methods: {
    // 查询
    async onSearchValue () {
      const param = {
        username: this.searchusername
      }
      if (this.searchusername) {
        let res = await this.$http.searchUserApi(param)
        this.$refs.userList.setData(res.results, res.count)
        this.condition = param
      }
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
      this.addGroup.form.name = ''
      this.addGroup.form.comment = ''
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
          this.$refs.userList.getData()
        }
      })
    },
    edit (item) {
      // window.localStorage.setItem(
      //   'permissions',
      //   JSON.stringify(item.permissions)
      // )
      this.$router.push({
        name: 'order_jurisdiction',
        params: {
          permission: item.permissions
        }
      })
    },
    editConfirm () {
      this.$refs.editForm.validate(async v => {
        if (v) {
          const param = {
            id: this.editGroup.form.id,
            phone: this.editGroup.form.phone
          }
          let res = await this.$http.patchuserapi(param)
          this.$message.success('修改成功')
          this.editGroup.visible = false
          this.$refs.userList.getData()
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
</style>
