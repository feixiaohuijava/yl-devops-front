<template>
  <div class="main">
    <div class="wrapper wrapper-content">
      <d-table
        url="/api/servicecom/apolloappviewset/"
        ref="configcenterlist"
        v-if="!showDetail"
        :conditionForm="condition"
      >
        <template slot="headerRight">
          <el-form-item>
            <el-input
              placeholder="根据appId模糊搜索"
              v-model="searchAppId"
              class="input-search"
              @keyup.native.enter="onSearchApolloApp"
              style="width: 220px"
            >
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-input
              placeholder="根据子系统名模糊搜索"
              v-model="searchSubsystemName"
              class="input-search"
              @keyup.native.enter="onSearchApolloApp"
              style="width: 220px"
            >
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              icon="el-icon-search"
              type="primary"
              @click="onSearchApolloApp"
              >查询</el-button
            >
          </el-form-item>
          <el-form-item>
            <el-button
              v-loading="loadingApolloApp"
              type="primary"
              @click="syncApolloApp"
              >同步</el-button
            >
          </el-form-item>
          <el-form-item>
            <el-button
              icon="el-icon-plus"
              type="primary"
              @click="add"
              v-if="buttonNew"
              >新建</el-button
            >
          </el-form-item>
        </template>
        <template slot="column">
          <el-table-column label="id" width="50px">
            <template slot-scope="scope">
              {{ scope.row.id }}
            </template>
          </el-table-column>
          <el-table-column label="appId">
            <template slot-scope="scope">
              {{ scope.row.appId }}
            </template>
          </el-table-column>
          <el-table-column label="name">
            <template slot-scope="scope">
              {{ scope.row.name }}
            </template>
          </el-table-column>
          <el-table-column label="orgId">
            <template slot-scope="scope">
              {{ scope.row.orgId }}
            </template>
          </el-table-column>
          <el-table-column label="orgName">
            <template slot-scope="scope">
              {{ scope.row.orgName }}
            </template>
          </el-table-column>
          <el-table-column label="ownerName">
            <template slot-scope="scope">
              {{ scope.row.ownerName }}
            </template>
          </el-table-column>
          <el-table-column label="子系统">
            <template slot-scope="scope">
              <div class="group-name" v-if="scope.row.subsystem !== null">
                {{ scope.row.subsystem.id }}
                <br />
                {{ scope.row.subsystem.subsystemname }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="apolloCenter">
            <template slot-scope="scope">
              <div class="group-name" v-if="scope.row.apolloCenter !== null">
                {{ scope.row.apolloCenter.apolloCenterName }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="createdTime">
            <template slot-scope="scope">
              <div class="group-name">
                {{ scope.row.createdTime }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="updateTime">
            <template slot-scope="scope">
              <div class="group-name">
                {{ scope.row.updateTime }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="备注">
            <template slot-scope="scope">
              <div class="group-name">
                {{ scope.row.comment }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-dropdown
                split-button
                trigger="click"
                type="primary"
                @click="edit(scope.row.id)"
                @command="handleCommand"
                >详情
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    :command="'delete.' + scope.row.id"
                    :disabled="!buttonDelete"
                    >删除</el-dropdown-item
                  >
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </template>
      </d-table>
      <el-dialog
        title="配置中心详情"
        :visible.sync="editGroup.visible"
        width="40%"
      >
        <el-form :model="editGroup.form" ref="editForm" labelWidth="100px">
          <el-form-item prop="name" label="name">
            <el-input
              readonly
              v-model="editGroup.form.name"
              style="width: 300px"
            ></el-input>
          </el-form-item>
          <el-form-item prop="appId" label="appId">
            <el-input
              readonly
              v-model="editGroup.form.appId"
              style="width: 300px"
            ></el-input>
          </el-form-item>
          <el-form-item prop="subsystem" label="子系统">
            <el-select
              clearble
              @visible-change="onUpdateSelectChangeSubsystem($event)"
              v-model="editGroup.form.subsystem.id"
            >
              <el-option
                v-for="item in subsystemList"
                :key="item.id"
                :value="item.id"
                :label="item.subsystemname"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="comment" label="备注">
            <textarea
              v-model="editGroup.form.comment"
              style="width: 300px"
            ></textarea>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="editConfirm">确 定</el-button>
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
      loadingApolloApp: false,
      autocompleteloading: false,
      searchAppId: null,
      searchSubsystemName: null,
      subsystemList: [],
      machineroomList: [],
      cabinetList: [],
      condition: null,
      groupId: '',
      groupName: '',
      editGroup: {
        visible: false,
        form: {
          id: '',
          groupName: '',
          groupId: null,
          subsystem: { id: undefined, subsystemname: undefined }
        }
      },
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
    async syncApolloApp () {
      this.$confirm('确认同步?', '提示', { type: 'warning' }).then(async () => {
        this.loadingApolloApp = true
        let res = await this.$http.syncApolloAppApi({ ApolloCenterId: 1 })
        if (res.hasOwnProperty('results')) {
          this.$message.success('同步成功!')
        } else {
          this.$message.error('同步失败!')
        }
        this.loadingApolloApp = false
      })
    },
    async onSearchApolloApp () {
      const param = {}
      if (this.searchAppId) {
        param['appId__contains'] = this.searchAppId
      }
      if (this.searchSubsystemName) {
        param['subsystemName'] = this.searchSubsystemName
      }
      let res = await this.$http.getApolloAppApi(param)
      this.$refs.configcenterlist.setData(res.results, res.count)
      this.condition = param
    },
    async onUpdateSelectChangeSubsystem (callback) {
      if (callback) {
        let resSubsystem = await this.$http.getsubsystemapi({
          ordering: 'subsystemname'
        })
        this.subsystemList = resSubsystem.results
        this.editGroup.form.subsystem.id = ''
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
          this.$refs.configcenterlist.getData()
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
    async edit (id) {
      let res = await this.$http.getDetailConfigCenterApi({ id: id })
      this.editGroup.form = res.results
      if (this.editGroup.form.subsystem === null) {
        this.editGroup.form.subsystem = { id: null, subsystemname: null }
      }
      let resSubsystem = await this.$http.getsubsystemapi()
      this.subsystemList = resSubsystem.results
      this.editGroup.visible = true
    },
    editConfirm () {
      this.$refs.editForm.validate(async v => {
        if (v) {
          const param = {
            id: this.editGroup.form.id,
            subsystem: this.editGroup.form.subsystem.id,
            comment: this.editGroup.form.comment
          }
          let res = await this.$http.patchConfigCenterApi(param)
          if (res.hasOwnProperty('results')) {
            this.$message.success('修改成功')
            this.editGroup.visible = false
            this.$refs.configcenterlist.getData()
          }
        }
      })
    },
    cancelEdit () {
      this.editGroup.visible = false
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
