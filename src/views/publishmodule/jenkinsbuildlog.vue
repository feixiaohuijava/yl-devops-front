<template>
  <div class="main">
    <div class="wrapper wrapper-content">
      <d-table
        url="/api/publishmodule/jenkinsbuildlogviewset/"
        ref="jenkinsbuildloglist"
        v-if="!showDetail"
        :conditionForm="condition"
      >
        <template slot="headerRight">
          <el-form-item>
            <el-input
              placeholder="根据module搜索"
              v-model="searchModule"
              class="input-search"
              @keyup.native.enter="onSearchValue"
              style="width: 200px"
            >
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-input
              placeholder="根据环境搜索"
              v-model="searchenv"
              class="input-search"
              @keyup.native.enter="onSearchValue"
              style="width: 200px"
            >
            </el-input>
          </el-form-item>
          <el-form-item label="按照时间:">
            <el-date-picker
              v-model="searchTime"
              type="datetimerange"
              align="right"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :default-time="['01:00:00', '23:00:00']"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button
              icon="el-icon-search"
              type="primary"
              @click="onSearchValue"
              >查询</el-button
            >
          </el-form-item>
        </template>
        <template slot="column">
          <el-table-column prop="id" label="id" width="50px">
            <template slot-scope="scope">
              {{ scope.row.id }}
            </template>
          </el-table-column>
          <el-table-column label="环境" width="50px">
            <template slot-scope="scope">
              {{ scope.row.env }}
            </template>
          </el-table-column>
          <el-table-column label="结果" width="80px">
            <template slot-scope="scope">
              <div v-if="scope.row.buildResult === 'success'">
                <el-tag type="success">成功</el-tag>
              </div>
              <div v-if="scope.row.buildResult === 'failed'">
                <el-tag type="danger">失败</el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="build_url" width="150px">
            <template slot-scope="scope">
              {{ scope.row.build_url }}
            </template>
          </el-table-column>
          <el-table-column label="branch" width="80px">
            <template slot-scope="scope">
              {{ scope.row.branch }}
            </template>
          </el-table-column>
          <el-table-column label="模块" width="150px">
            <template slot-scope="scope">
              {{ scope.row.module }}
            </template>
          </el-table-column>
          <el-table-column label="build_number" width="100px">
            <template slot-scope="scope">
              {{ scope.row.build_number }}
            </template>
          </el-table-column>
          <el-table-column label="git_commit_id" width="100px">
            <template slot-scope="scope">
              {{ scope.row.git_commit_id }}
            </template>
          </el-table-column>
          <el-table-column label="commitby" width="90px">
            <template slot-scope="scope">
              {{ scope.row.commitby }}
            </template>
          </el-table-column>
          <!--  width="150px" -->
          <el-table-column label="commitmessage">
            <template slot-scope="scope">
              {{ scope.row.commitmessage }}
            </template>
          </el-table-column>
          <el-table-column label="now_run_ver" width="110px">
            <template slot-scope="scope">
              {{ scope.row.now_run_ver }}
            </template>
          </el-table-column>
          <el-table-column label="update_ver" width="110px">
            <template slot-scope="scope">
              {{ scope.row.update_ver }}
            </template>
          </el-table-column>
          <el-table-column label="es检查" width="80px">
            <template slot-scope="scope">
              <div v-if="scope.row.deploy_es_check_type === 0">
                <el-tag type="success">成功</el-tag>
              </div>
              <div v-else-if="scope.row.deploy_es_check_type === 1">
                <el-tag type="danger">失败</el-tag>
              </div>
              <div v-else-if="scope.row.deploy_es_check_type === 2">
                <el-tag>检测中</el-tag>
              </div>
              <div v-else>
                {{ scope.row.deploy_es_check_type }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="创建时间">
            <template slot-scope="scope">
              {{ scope.row.createdTime }}
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-dropdown
                :disabled="true"
                split-button
                trigger="click"
                type="primary"
                @click="edit(scope.row)"
                @command="handleCommand"
                >详情
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item disabled>删除</el-dropdown-item>
                </el-dropdown-menu>
                <!--   <el-dropdown-menu slot="dropdown">-->
                <!--     <el-dropdown-item :command="'delete.' + scope.row.id" :disabled="!buttonDelete">删除</el-dropdown-item>-->
                <!--   </el-dropdown-menu>-->
              </el-dropdown>
            </template>
          </el-table-column>
        </template>
      </d-table>
      <el-dialog
        title="构建/部署详情"
        :visible.sync="editGroup.visible"
        width="40%"
      >
        <el-form :model="editGroup.form" ref="editForm" labelWidth="100px">
          <el-form-item prop="id" label="id:">
            <el-input
              v-model="editGroup.form.id"
              readonly
              style="width: 100px"
            ></el-input>
          </el-form-item>
          <el-form-item prop="env" label="环境:">
            <el-input
              v-model="editGroup.form.env"
              readonly
              style="width: 200px"
            ></el-input>
          </el-form-item>
          <el-form-item prop="module" label="module:">
            <el-input
              v-model="editGroup.form.module"
              readonly
              style="width: 200px"
            ></el-input>
          </el-form-item>
          <el-form-item prop="deploy_es_detail" label="部署es检查:">
            <div v-if="editGroup.form.deploy_es_detail !== null">
              <div
                v-for="(index, tag) in editGroup.form.deploy_es_detail"
                :key="tag"
              >
                <el-input
                  type="textarea"
                  v-model="editGroup.form.deploy_es_detail[tag]"
                  rows="6"
                ></el-input>
              </div>
            </div>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  data () {
    return {
      searchenv: '',
      searchModule: '',
      searchTime: '',
      condition: {},
      groupId: '',
      groupName: '',
      editGroup: {
        visible: false,
        form: {
          id: '',
          env: '',
          module: '',
          deploy_es_detail: '',
          jenkins_build_error_log: ''
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
  created () {},
  methods: {
    async onSearchValue () {
      if (!(this.searchTime instanceof Array)) {
        this.searchTime = null
      } else {
        this.searchTime =
          moment(this.searchTime[0]).format('YYYY-MM-DD HH:mm:ss') +
          ',' +
          moment(this.searchTime[1]).format('YYYY-MM-DD HH:mm:ss')
      }
      const param = {
        env: this.searchenv,
        module: this.searchModule,
        createdTime__range: this.searchTime
      }
      let res = await this.$http.searchJenkinBuildLogApi(param)
      this.$refs.jenkinsbuildloglist.setData(res.results, res.count)
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
        form: {
          id: item.id,
          env: item.env,
          module: item.module,
          deploy_es_detail: item.deploy_es_detail,
          jenkins_build_error_log: item.jenkins_build_error_log
        }
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
</style>
