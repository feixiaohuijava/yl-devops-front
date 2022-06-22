<template>
  <div class="main">
    <div class="wrapper wrapper-content">
      <d-table
        url="/api/account/user/"
        ref="userList"
        v-if="!showDetail"
        :conditionForm="condition"
      >
        <template slot="headerRight">
          <el-form-item>
            <el-input
              placeholder="用户名搜索"
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
          <!-- <el-form-item>
            <el-button icon="el-icon-plus" type="primary" @click="add"
              >添加</el-button
            >
          </el-form-item> -->
        </template>
        <template slot="column">
          <el-table-column label="id" width="120px">
            <template slot-scope="scope">
              {{ scope.row.id }}
            </template>
          </el-table-column>
          <el-table-column label="用户名" width="200px">
            <template slot-scope="scope">
              {{ scope.row.username }}
            </template>
          </el-table-column>
          <el-table-column label="电话" width="200px">
            <template slot-scope="scope">
              {{ scope.row.phone }}
            </template>
          </el-table-column>
          <el-table-column label="角色">
            <template slot-scope="scope">
              <el-tag
                v-for="item in scope.row.groups"
                :key="item.id"
                style="margin-right:10px"
                >{{ item.name }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200px">
            <template slot-scope="scope">
              <el-dropdown
                split-button
                trigger="click"
                type="primary"
                @click="edit(scope.row)"
                @command="handleCommand"
                >详情
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item :command="'delete.' + scope.row.id" disabled
                    >删除</el-dropdown-item
                  >
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </template>
      </d-table>
      <el-dialog title="新建用户" :visible.sync="addGroup.visible" width="40%">
        <el-form
          :model="addGroup.form"
          ref="addForm"
          :rules="rules"
          labelWidth="100px"
        >
          <el-form-item prop="name" label="用户名">
            <el-input
              v-model="addGroup.form.name"
              style="width: 95%"
            ></el-input>
          </el-form-item>
          <el-form-item prop="phone" label="电话">
            <el-input
              v-model="addGroup.form.phone"
              style="width: 95%"
            ></el-input>
          </el-form-item>
          <el-form-item prop="groups" label="角色">
            <el-input
              v-model="addGroup.form.groups"
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
          <el-button disabled type="primary" @click="addConfirm"
            >确 定</el-button
          >
          <el-button @click="cancelEdit">取 消</el-button>
        </span>
      </el-dialog>
      <el-dialog title="用户详情" :visible.sync="editGroup.visible" width="40%">
        <el-form :model="editGroup.form" ref="editForm" labelWidth="100px">
          <el-form-item prop="id" label="id">
            <el-input
              readonly
              v-model="editGroup.form.id"
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
          <el-form-item prop="phone" label="角色">
            <el-tag
              style="margin-right:10px"
              :key="tag.id"
              v-for="tag in editGroup.form.groups"
              closable
              :disable-transitions="false"
              @close="handleTagClose(tag)"
            >
              {{ tag.name }}
            </el-tag>
            <el-input
              class="input-new-tag"
              v-if="inputVisible"
              v-model="inputValue"
              ref="saveTagInput"
              size="small"
              @keyup.enter.native="handleInputConfirm"
              @blur="handleInputConfirm"
            >
            </el-input>
            <el-button
              v-else
              class="button-new-tag"
              size="small"
              @click="showInput"
              >+ 新建角色</el-button
            >
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button disabled type="primary" @click="editConfirm"
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
      editGroup: { visible: false, form: { id: '', username: '', groups: '' } },
      inputVisible: false,
      inputValue: '',
      addGroup: {
        visible: false,
        form: { name: '', phone: '', groups: '', comment: '' }
      },
      showDetail: false,
      detailId: '',
      detailName: '',
      activeName: '',
      buttonNew: false,
      buttonDelete: false,
      buttonChange: false,
      rules: {
        name: [{ required: true, message: '请输入用户名', trigger: 'blur' }]
      }
    }
  },
  created () {
    // this.getPerm()
  },
  methods: {
    // 新建角色输入角色名
    handleInputConfirm () {
      let inputValue = this.inputValue
      if (inputValue) {
        this.editGroup.form.groups.push(inputValue)
      }
      this.inputVisible = false
      this.inputValue = ''
    },
    // 新建角色按钮
    showInput () {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 详情角色删除
    handleTagClose (tag) {
      this.editGroup.form.groups.splice(
        this.editGroup.form.groups.indexOf(tag),
        1
      )
    },
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
    // 删除
    deleteSafeGroup (id) {
      this.$confirm('确认删除?', '提示', { type: 'warning' })
        .then(async () => {
          await this.$http.delete_brand({ id: id })
          this.$message.success('删除成功')
          this.$refs.brandList.getData()
        })
        .catch(_ => {})
    },
    // 点击新建按钮
    // add () {
    //   this.addGroup.visible = true
    //   this.addGroup.form.name = ''
    //   this.addGroup.form.comment = ''
    //   this.addGroup.form.groups = ''
    //   this.addGroup.form.phone = ''
    //   this.$nextTick(() => {
    //     this.$refs.addForm.resetFields()
    //   })
    // },
    // 点击新建确认
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
      this.editGroup = {
        visible: true,
        form: {
          id: item.id,
          username: item.username,
          phone: item.phone,
          groups: item.groups
        }
      }
    },
    // 点击编辑修改
    editConfirm () {
      this.$refs.editForm.validate(async v => {
        console.log(this.editGroup.form.groups)
        let groupsId = []
        this.editGroup.form.groups.forEach(item => {
          groupsId.push(item.id)
        })
        if (v) {
          const param = {
            id: this.editGroup.form.id,
            phone: this.editGroup.form.phone,
            username: this.editGroup.form.username,
            groups: groupsId
          }
          console.log(param)
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
