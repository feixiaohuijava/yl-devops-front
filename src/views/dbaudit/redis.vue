<template>
  <div class="main">
    <div class="wrapper wrapper-content">
      <d-table
        :url="redisUrl"
        ref="brandList"
        v-if="!showDetail"
        :conditionForm="condition"
      >
        <!--        <template slot="headerRight">-->
        <!--          <el-form-item >-->
        <!--            <el-button  type="primary" @click="syncRedis" v-if="buttonRedisCreate">同步</el-button>-->
        <!--          </el-form-item>-->
        <!--        </template>-->
        <template slot="column">
          <el-table-column label="redisId">
            <template slot-scope="scope">
              {{ scope.row.redisId }}
            </template>
          </el-table-column>
          <el-table-column label="name">
            <template slot-scope="scope">
              {{ scope.row.name }}
            </template>
          </el-table-column>
          <el-table-column label="redisType">
            <template slot-scope="scope">
              {{ scope.row.redisType }}
            </template>
          </el-table-column>
          <el-table-column label="env">
            <template slot-scope="scope" v-if="scope.row.environment != null">
              {{ scope.row.environment.name }}
            </template>
          </el-table-column>
          <el-table-column label="项目组">
            <template slot-scope="scope" v-if="scope.row.project != null">
              {{ scope.row.project.projectName }}
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-dropdown
                split-button
                trigger="click"
                type="primary"
                @click="operate(scope.row)"
                @command="handleCommand"
                >详情
                <el-dropdown-menu slot="dropdown">
                  <!-- <el-dropdown-item
                    :command="
                      'select.' + scope.row.redisId + '.' + scope.row.name
                    "
                    >查看</el-dropdown-item
                  >
                  <el-dropdown-item
                    :command="
                      'update.' + scope.row.redisId + '.' + scope.row.name
                    "
                    >修改</el-dropdown-item
                  > -->
                  <el-dropdown-item
                    :command="
                      'delete.' + scope.row.redisId + '.' + scope.row.name
                    "
                    >删除</el-dropdown-item
                  >
                </el-dropdown-menu>
              </el-dropdown>
              <el-button
                type="success"
                @click="toSee(scope.row.redisId, scope.row.name)"
                >查看</el-button
              >
              <el-button
                type="warning"
                @click="toEdit(scope.row.redisId, scope.row.name)"
                >修改</el-button
              >
            </template>
          </el-table-column>
        </template>
      </d-table>
      <!-- <el-dialog
        v-loading="loadingRedisGet"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        title="redis查看操作"
        :visible.sync="operateSelectGroup.visible"
        width="80%"
      >
        <el-form :inline="true" ref="adddeleteform">
          <el-form-item label="当前redis库:" style="width: 100%">
            <el-input
              v-model="operateSelectGroup.form.name"
              readonly
            ></el-input>
          </el-form-item>
          <el-form-item
            prop="command"
            label="请输入redis查看操作:"
            style="width: 100%"
            :rules="$newrules.empty"
          >
            <textarea v-model="command" style="width: 500%"></textarea>
          </el-form-item>
          <el-form-item>
            <el-button type="success" @click="executerediscommand"
              >执行redis操作</el-button
            >
          </el-form-item>
          <el-form-item label="redis查看操作结果:" style="width: 100%">
            <vue-json-pretty
              :path="'res'"
              :deep="3"
              :showLength="true"
              :highlightSelectedNode="true"
              :showDoubleQuotes="false"
              :data="comamndresult"
            >
            </vue-json-pretty>
          </el-form-item>
          <el-form-item>
            <el-button type="success" @click="exportdata"
              >导出redis操作结果</el-button
            >
          </el-form-item>
        </el-form>
      </el-dialog> -->
      <!-- <el-dialog
        title="redis修改操作"
        :visible.sync="operateUpdateGroup.visible"
        width="80%"
      >
        <el-form :inline="true" ref="adddeleteform">
          <el-form-item label="当前redis库:" style="width: 100%">
            <el-input
              v-model="operateUpdateGroup.form.name"
              readonly
            ></el-input>
          </el-form-item>
          <el-form-item label="请输入修改命令:" style="width: 100%">
            <textarea
              v-model="redisUpdateCommand"
              style="width: 500%"
            ></textarea>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="addupdateConfirm">确 定</el-button>
          <el-button @click="cancelUpdte">取 消</el-button>
        </span>
      </el-dialog> -->
      <el-dialog
        title="redis删除key操作"
        :visible.sync="operateDeleteGroup.visible"
        width="80%"
      >
        <el-form :inline="true" ref="adddeleteform">
          <el-form-item label="当前redis库:" style="width: 100%">
            <el-input
              v-model="operateDeleteGroup.form.name"
              readonly
            ></el-input>
          </el-form-item>
          <el-form-item label="请输入要删除的key:" style="width: 100%">
            <textarea v-model="rediskey" style="width: 500%"></textarea>
          </el-form-item>
          <el-form-item>
            <el-button type="danger" @click="addeletekey">添加删除</el-button>
          </el-form-item>
        </el-form>
        <el-row style="width: 80%" label="已选中要删除key:">
          <el-tag
            v-for="tag in rediskeyarray"
            :key="tag"
            closable
            :type="tag"
            @close="handleClose(tag)"
          >
            {{ tag }}
          </el-tag>
        </el-row>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="adddeleteConfirm">确 定</el-button>
          <el-button @click="cancelDelete">取 消</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import FileSaver from 'file-saver'
import VueJsonPretty from 'vue-json-pretty'
export default {
  components: {
    VueJsonPretty
  },
  data () {
    return {
      redisUrl: '',
      loadingRedisGet: false,
      redisUpdateCommand: '',
      command: '',
      comamndresult: {},
      jsonData: [1, 2, 3, 4],
      rediskeyarray: [],
      redisValue: {},
      rediskey: '',
      currentRedis: '',
      rediskeys: [1, 2, 3, 4],
      rediskeydeletings: [],
      condition: null,
      groupId: '',
      groupName: '',
      operateSelectGroup: { visible: false, form: { redisId: '', name: '' } },
      operateUpdateGroup: { visible: false, form: { redisId: '', name: '' } },
      operateDeleteGroup: { visible: false, form: { redisId: '', name: '' } },
      addGroup: { visible: false, form: { name: '', comment: '' } },
      showDetail: false,
      detailId: '',
      detailName: '',
      activeName: '',
      buttonNew: false,
      buttonDelete: false,
      buttonChange: false
      // buttonRedisCreate: false
    }
  },
  created () {
    this.redisUrl = `/api/dbaudit/redisviewset/?showflag=True`
    this.getPerm()
  },
  methods: {
    // 删除key tag
    handleClose (tag) {
      this.rediskeyarray.splice(this.rediskeyarray.indexOf(tag), 1)
    },
    // 点击详情
    operate (item) {
      this.operateGroup = {
        visible: true,
        form: { redisId: item.redisId, name: item.name }
      }
      this.rediskey = ''
      this.redisValue = ''
      this.rediskeyarray = []
      this.command = ''
      this.comamndresult = {}
    },
    // 导出redis操作结果
    async exportdata () {
      if (JSON.stringify(this.comamndresult) !== '{}') {
        const data = this.comamndresult
        const blob = new Blob([data], { type: '' })
        FileSaver.saveAs(blob, '导出结果')
      } else {
        this.$message.error('redis操作结果为空')
      }
    },
    // 执行redis操作
    async executerediscommand () {
      if (this.command) {
        this.loadingRedisGet = true
        const param = {
          command: this.command,
          redisId: this.operateSelectGroup.form.redisId
        }
        let res = await this.$http.rediscommand(param)
        if (res.file_flag) {
          const data = res.filedata
          const blob = new Blob([data], { type: '' })
          FileSaver.saveAs(blob, 'redis结果.json')
        } else {
          this.comamndresult = res.results
        }
        this.loadingRedisGet = false
      }
    },
    //添加删除
    addeletekey () {
      if (this.rediskey) {
        const splitdata = this.rediskey.split(',')
        splitdata.forEach(eachRediskey => {
          const reeachRediskey = eachRediskey.trim()
          const containflag = this.rediskeyarray.indexOf(reeachRediskey)
          if (containflag > -1) {
            this.$message.error('元素' + reeachRediskey + '已经添加!')
            return false
          } else {
            this.rediskeyarray.push(reeachRediskey)
          }
        })
      } else {
        this.$message.error('请添加删除元素!')
      }
    },
    // 无
    closeDetail () {
      this.showDetail = false
    },
    // 无
    showSafeDetail (item, active) {
      this.detailId = item.SecurityGroupId
      this.detailName = item.SecurityGroupName
      this.showDetail = true
      this.activeName = active
    },
    // 无
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
    // 无
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
    // redis修改操作确认按钮
    addupdateConfirm () {
      this.$confirm('确认提交命令?', '提示', { type: 'warning' })
        .then(async () => {
          if (this.redisUpdateCommand !== '') {
            const param = {
              orderType: 'redis',
              orderContent: {
                redisId: this.operateUpdateGroup.form.redisId,
                redisUpdateCommand: this.redisUpdateCommand,
                operateType: 'update'
              },
              orderFinishFlag: '',
              orderCreater: ''
            }
            let res = await this.$http.addworkorder(param)
            this.$message.success('已经添加入工单!')
            this.operateUpdateGroup.visible = false
          } else {
            this.$message.error('没有添加任何命令')
          }
        })
        .catch(_ => {})
    },
    // redis删除key操作确认按钮
    adddeleteConfirm () {
      this.$confirm('确认添加?', '提示', { type: 'warning' })
        .then(async () => {
          if (this.rediskeyarray.length > 0) {
            const param = {
              orderType: 'redis',
              orderContent: {
                redisId: this.operateDeleteGroup.form.redisId,
                rediskeyarray: this.rediskeyarray,
                operateType: 'delete'
              },
              orderFinishFlag: '',
              orderCreater: ''
            }
            let res = await this.$http.addworkorder(param)
            this.$message.success('已经添加入工单!')
            this.operateDeleteGroup.visible = false
          } else {
            this.$message.error('没有添加任何key')
          }
        })
        .catch(_ => {})
    },
    // redis删除key操作取消按钮
    cancelDelete () {
      this.operateDeleteGroup = {
        visible: false,
        form: { groupName: '', description: '', groupId: '' }
      }
    },
    // redis修改操作取消按钮
    cancelUpdte () {
      this.operateUpdateGroup = {
        visible: false,
        form: { groupName: '', description: '', groupId: '' }
      }
    },
    // 跳转到查看
    toSee (redisId, name) {
      this.$router.push({
        name: 'db_redis_see',
        params: {
          redisId: redisId,
          name: name
        }
      })
      this.rediskey = ''
      this.redisValue = ''
      this.rediskeyarray = []
      this.command = ''
      this.comamndresult = {}
      this.redisUpdateCommand = ''
    },
    // 跳转到修改
    toEdit (redisId, name) {
      this.$router.push({
        name: 'db_redis_edit',
        params: {
          redisId: redisId,
          name: name
        }
      })
      this.rediskey = ''
      this.redisValue = ''
      this.rediskeyarray = []
      this.command = ''
      this.comamndresult = {}
      this.redisUpdateCommand = ''
    },
    // 详情下拉菜单对于点击事件
    handleCommand (command) {
      let list = command.split('.')
      console.log(list)
      if (list[0] === 'select') {
        this.operateSelectGroup = {
          visible: true,
          form: { redisId: list[1], name: list[2] }
        }
        this.operateUpdateGroup.visible = false
        this.operateDeleteGroup.visible = false
        this.rediskey = ''
        this.redisValue = ''
        this.rediskeyarray = []
        this.command = ''
        this.comamndresult = {}
        this.redisUpdateCommand = ''
      }
      if (list[0] === 'update') {
        this.operateSelectGroup.visible = false
        this.operateUpdateGroup = {
          visible: true,
          form: { redisId: list[1], name: list[2] }
        }
        this.operateDeleteGroup.visible = false
        this.rediskey = ''
        this.redisValue = ''
        this.rediskeyarray = []
        this.command = ''
        this.comamndresult = {}
        this.redisUpdateCommand = ''
      }
      if (list[0] === 'delete') {
        this.operateSelectGroup.visible = false
        this.operateUpdateGroup.visible = false
        this.operateDeleteGroup = {
          visible: true,
          form: { redisId: list[1], name: list[2] }
        }
        this.rediskey = ''
        this.redisValue = ''
        this.rediskeyarray = []
        this.command = ''
        this.comamndresult = {}
        this.redisUpdateCommand = ''
      }
    },
    // 初始化
    getPerm () {
      let perm = JSON.parse(window.sessionStorage.getItem('permission'))
      console.log(perm)
      if (perm.includes('add_redis')) {
        this.buttonRedisCreate = true
        console.log('has')
        console.log(this.buttonRedisCreate)
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
<style>
.el-dialog__body {
  height: 100%;
}
</style>
