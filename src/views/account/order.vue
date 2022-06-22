<template>
  <div class="main">
    <div class="wrapper wrapper-content">
      <el-button @click="toJurisdiction" type="primary" class="jurisdiction-btn"
        >权限</el-button
      >
      <d-table
        url="/api/account/menu/"
        ref="menuList"
        v-if="!showDetail"
        :conditionForm="condition"
        :order="true"
      >
        <template slot="headerRight">
          <!-- <el-form-item>
            <el-input
              placeholder="菜单搜索"
              v-model="searchMenuName"
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
          </el-form-item> -->
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
          <el-table-column label="菜单名称">
            <template
              slot-scope="scope"
              :class="{
                chartreuse: scope.row.parent ? false : true,
                red: scope.row.parent ? true : false
              }"
            >
              {{ scope.row.name }}
            </template>
          </el-table-column>
          <el-table-column label="路径">
            <template slot-scope="scope">
              {{ scope.row.path }}
            </template>
          </el-table-column>
          <el-table-column label="上一级菜单">
            <template slot-scope="scope">
              {{ scope.row.parent ? scope.row.parent.name : '无' }}
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
                    >删除</el-dropdown-item
                  >
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </template>
      </d-table>
      <el-dialog title="新建菜单" :visible.sync="addGroup.visible" width="40%">
        <el-form :model="addGroup.form" ref="addForm" labelWidth="100px">
          <el-form-item prop="name" label="菜单">
            <el-input
              v-model="addGroup.form.name"
              style="width: 95%"
            ></el-input>
          </el-form-item>
          <el-form-item prop="path" label="路径">
            <el-input
              v-model="addGroup.form.path"
              style="width: 95%"
            ></el-input>
          </el-form-item>
          <el-form-item prop="order" label="排序">
            <el-input
              v-model="addGroup.form.order"
              style="width: 95%"
            ></el-input>
          </el-form-item>
          <el-form-item prop="parent" label="父级">
            <el-select
              placeholder="请选择父级"
              clearable
              @visible-change="onSelectChangeParent($event, 'add')"
              v-model="addGroup.form.parent"
              style="width:400px"
            >
              <el-option
                v-for="(item, index) in addParentList"
                :key="index"
                :value="item.id"
                :label="item.name"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="group" label="角色">
            <el-tag
              style="margin-right:10px"
              :key="tag.id"
              v-for="tag in addGroup.form.group"
              closable
              :disable-transitions="false"
              @close="handleTagClose(tag, 'add')"
            >
              {{ tag }}
            </el-tag>
            <el-input
              style="width:200px"
              class="input-new-tag"
              v-if="inputVisible"
              v-model="addInputValue"
              ref="menuTagInput"
              size="small"
              @keyup.enter.native="handleInputConfirm('add')"
              @blur="handleInputConfirm('add')"
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
          <el-button type="primary" @click="addConfirm" disabled
            >确 定</el-button
          >
          <el-button @click="cancelEdit">取 消</el-button>
        </span>
      </el-dialog>
      <el-dialog title="菜单详情" :visible.sync="editGroup.visible" width="40%">
        <el-form :model="editGroup.form" ref="editForm" labelWidth="100px">
          <el-form-item prop="id" label="id">
            <el-input
              v-model="editGroup.form.id"
              style="width: 95%"
              readonly
            ></el-input>
          </el-form-item>
          <el-form-item prop="name" label="菜单">
            <el-input
              v-model="editGroup.form.name"
              style="width: 95%"
            ></el-input>
          </el-form-item>
          <el-form-item prop="path" label="路径">
            <el-input
              v-model="editGroup.form.path"
              style="width: 95%"
            ></el-input>
          </el-form-item>
          <el-form-item prop="order" label="排序">
            <el-input
              v-model="editGroup.form.order"
              style="width: 95%"
            ></el-input>
          </el-form-item>
          <el-form-item prop="parent" label="父级">
            <el-select
              placeholder="请选择父级"
              clearable
              @visible-change="onSelectChangeParent($event, 'edit')"
              v-model="editGroup.form.parent"
              style="width:400px"
            >
              <el-option
                v-for="(item, index) in editParentList"
                :key="index"
                :value="item.id"
                :label="item.name"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="group" label="角色">
            <el-tag
              style="margin-right:10px"
              :key="tag.id"
              v-for="tag in editGroupList"
              closable
              :disable-transitions="false"
              @close="handleTagClose(tag, 'edit')"
            >
              {{ tag.name }}
            </el-tag>
            <el-input
              class="input-new-tag"
              v-if="inputVisible"
              v-model="editInputValue"
              ref="menuTagInput"
              size="small"
              @keyup.enter.native="handleInputConfirm('edit')"
              @blur="handleInputConfirm('edit')"
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
      editGroupList: [],
      searchMenuName: null,
      condition: null,
      addInputValue: '',
      editInputValue: '',
      inputVisible: false,
      addParentList: [],
      editParentList: [],
      groupId: '',
      groupName: '',
      editGroup: {
        visible: false,
        form: {
          name: '',
          path: '',
          order: null,
          parent: null,
          group: []
        }
      },
      addGroup: {
        visible: false,
        form: {
          name: '',
          path: '',
          order: null,
          parent: null,
          group: []
        }
      },
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
    toJurisdiction () {
      this.$router.push({
        path: '/jurisdiction/'
      })
    },
    // 新建角色输入角色名
    handleInputConfirm (type) {
      if (type === 'add') {
        let addInputValue = this.addInputValue
        if (addInputValue) {
          this.addGroup.form.group.push(addInputValue)
          console.log(this.addGroup.form.group)
        }
        this.inputVisible = false
        this.addInputValue = ''
      }
    },
    // 新建角色按钮
    showInput () {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.menuTagInput.$refs.input.focus()
      })
    },
    // 详情角色删除
    handleTagClose (tag, type) {
      if (type === 'edit') {
        this.editGroupList.splice(this.editGroupList.indexOf(tag), 1)
      } else {
        this.addGroup.form.group.splice(
          this.addGroup.form.group.indexOf(tag),
          1
        )
      }
    },
    // 查询
    // async onSearchValue () {
    //   const param = {
    //     parent__isnull: this.searchMenuName
    //   }
    //   if (this.searchMenuName) {
    //     let res = await this.$http.searchMenurApi(param)
    //     this.$refs.menuList.setData(res.results, res.count)
    //     this.condition = param
    //   }
    // },
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
          await this.$http.delete_menu({ id: id })
          this.$message.success('删除成功')
          this.$refs.menuList.getData()
        })
        .catch(_ => {})
    },
    // 获取父级信息
    async onSelectChangeParent (callback, type) {
      if (callback) {
        if (type === 'add') {
          const param = {
            parent__isnull: true
          }
          let res = await this.$http.searchMenurApi(param)
          res.results.forEach(item => {
            this.addParentList.push({
              name: item.name,
              id: item.id
            })
          })
        } else {
          const param = {
            parent__isnull: true
          }
          let res = await this.$http.searchMenurApi(param)
          res.results.forEach(item => {
            this.editParentList.push({
              name: item.name,
              id: item.id
            })
          })
        }
      }
    },
    // 点击添加按钮
    add () {
      this.addGroup.visible = true
      this.addGroup.form.name = ''
      this.addGroup.form.path = ''
      this.addGroup.form.order = null
      this.addGroup.form.parent = null
      this.addGroup.form.group = []
      this.$nextTick(() => {
        this.$refs.addForm.resetFields()
      })
    },
    // 点击添加确认按钮
    addConfirm () {
      this.$refs.addForm.validate(async v => {
        if (v) {
          const param = {
            name: this.addGroup.form.name,
            path: this.addGroup.form.path,
            order: Number(this.addGroup.form.order),
            parent: this.addGroup.form.parent,
            group: this.addGroup.form.group
          }
          console.log(param)
          let res = await this.$http.add_menu(param)
          this.addGroup.visible = false
          this.$refs.menuList.getData()
        }
      })
    },
    // 详情按钮
    edit (item) {
      this.onSelectChangeParent(true, 'edit')
      this.editGroupList = item.group
      this.editGroup = {
        visible: true,
        form: {
          id: item.id,
          name: item.name,
          path: item.path,
          order: item.order,
          parent: item.parent.id
        }
      }
    },
    // 点击编辑确认按钮
    editConfirm () {
      this.$refs.editForm.validate(async v => {
        let arr = 123
        if (v) {
          const param = {
            id: this.editGroup.form.id,
            name: this.editGroup.form.name,
            path: this.editGroup.form.path,
            order: Number(this.editGroup.form.order),
            parent: this.editGroup.form.parent,
            group: arr
          }
          console.log(param)
          let res = await this.$http.patchuserapi(param)
          this.$message.success('修改成功')
          this.editGroup.visible = false
          this.$refs.menuList.getData()
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
.jurisdiction-btn {
  margin-left: 20px;
}
</style>
