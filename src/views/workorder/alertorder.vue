<template>
  <div class="main">
    <div class="wrapper wrapper-content">
      <d-table
        url="/api/webhookmanager/alertorderviewset/"
        ref="alertorderlist"
        v-if="!showDetail"
        :conditionForm="condition"
      >
        <template slot="column">
          <el-table-column label="id" width="70px">
            <template slot-scope="scope">
              {{ scope.row.id }}
            </template>
          </el-table-column>
          <el-table-column label="告警名" width="100px">
            <template slot-scope="scope">
              {{ scope.row.alername }}
            </template>
          </el-table-column>
          <el-table-column label="类型" width="100px">
            <template slot-scope="scope">
              {{ scope.row.kind }}
            </template>
          </el-table-column>
          <el-table-column label="prometheus地址" width="180px">
            <template slot-scope="scope">
              <div v-if="scope.row.kind === 'alicloud'">
                阿里云监控
              </div>
              <div v-else>
                {{ scope.row.prometheusUrl }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="状态" width="80px">
            <template slot-scope="scope">
              <div v-if="scope.row.status === 'init'">
                <el-tag type="danger">需处理</el-tag>
              </div>
              <div v-else-if="scope.row.status === 'following'">
                <el-tag type="primary">跟进中</el-tag>
              </div>
              <div v-else-if="scope.row.status === 'end'">
                <el-tag type="success">已解决</el-tag>
              </div>
              <div v-else>
                异常数据
              </div>
            </template>
          </el-table-column>
          <el-table-column label="值班人" width="100px">
            <template slot-scope="scope">
              {{ scope.row.alertDuty }}
            </template>
          </el-table-column>
          <el-table-column label="处理人" width="100px">
            <template slot-scope="scope">
              {{ scope.row.principal }}
            </template>
          </el-table-column>
          <el-table-column label="创建时间" width="150px">
            <template slot-scope="scope">
              {{ scope.row.createdTime }}
            </template>
          </el-table-column>
          <el-table-column label="处理过程" width="450px">
            <template slot-scope="scope">
              {{ scope.row.comment }}
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
        title="告警工单详情"
        :visible.sync="editGroup.visible"
        width="80%"
      >
        <div style="margin-left: 500px">
          <el-steps
            :space="200"
            :active="editGroup.form.active"
            finish-status="success"
            style="width: 100%"
          >
            <el-step
              title="需处理"
              :description="editGroup.form.createdTime"
            ></el-step>
            <el-step
              title="跟进中"
              :description="editGroup.form.followingTime"
            ></el-step>
            <el-step
              title="已解决"
              :description="editGroup.form.endTime"
            ></el-step>
          </el-steps>
        </div>
        <div style="margin-top: 50px">
          <el-form
            :inline="true"
            v-if="editGroup.form.status === 'init'"
            :model="editGroup.form"
          >
            <el-form-item label="id: ">
              <el-input
                readonly
                v-model="editGroup.form.id"
                style="width: 100px"
              ></el-input>
            </el-form-item>
            <el-form-item label="告警名: ">
              <el-input
                readonly
                v-model="editGroup.form.alername"
                style="width: 200px"
              ></el-input>
            </el-form-item>
            <el-form-item label="类型: ">
              <el-input
                readonly
                v-model="editGroup.form.kind"
                style="width: 200px"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="prometheus地址: "
              v-if="editGroup.form.kind === 'alertmanager'"
            >
              <el-input
                readonly
                v-model="editGroup.form.prometheusUrl"
                style="width: 200px"
              ></el-input>
            </el-form-item>
            <el-form-item label="值班人: ">
              <el-input
                readonly
                v-model="editGroup.form.alertDuty"
                style="width: 200px"
              ></el-input>
            </el-form-item>
            <el-form-item label="告警标签" style="margin-left: 10px">
              <div v-for="(value, key) in editGroup.form.alertLabel" :key="key">
                <el-tag style="float: left">{{ key }}: {{ value }}</el-tag>
              </div>
            </el-form-item>
          </el-form>
          <el-form
            :inline="true"
            v-if="editGroup.form.status === 'following'"
            :model="editGroup.form"
          >
            <el-form-item label="id:">
              <el-input
                readonly
                v-model="editGroup.form.id"
                style="width: 100px"
              ></el-input>
            </el-form-item>
            <el-form-item label="告警名:">
              <el-input
                readonly
                v-model="editGroup.form.alername"
                style="width: 200px"
              ></el-input>
            </el-form-item>
            <el-form-item label="类型:">
              <el-input
                readonly
                v-model="editGroup.form.kind"
                style="width: 200px"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="prometheus地址:"
              v-if="editGroup.form.kind === 'alertmanager'"
            >
              <el-input
                readonly
                v-model="editGroup.form.prometheusUrl"
                style="width: 200px"
              ></el-input>
            </el-form-item>
            <el-form-item label="值班人:">
              <el-input
                readonly
                v-model="editGroup.form.alertDuty"
                style="width: 200px"
              ></el-input>
            </el-form-item>
            <el-form-item label="处理人:">
              <el-input
                readonly
                v-model="editGroup.form.principal"
                style="width: 200px"
              ></el-input>
            </el-form-item>
            <el-form-item label="告警标签:" style="margin-left: 10px">
              <div v-for="(value, key) in editGroup.form.alertLabel" :key="key">
                <el-tag style="float: left">{{ key }}: {{ value }}</el-tag>
              </div>
            </el-form-item>
            <el-form-item label="处理过程: ">
              <textarea
                v-model="editGroup.form.comment"
                style="width: 500px;height: 300px"
              ></textarea>
            </el-form-item>
          </el-form>
          <el-form
            :inline="true"
            v-if="editGroup.form.status === 'end'"
            :model="editGroup.form"
          >
            <el-form-item label="id: ">
              <el-input
                readonly
                v-model="editGroup.form.id"
                style="width: 100px"
              ></el-input>
            </el-form-item>
            <el-form-item label="告警名: ">
              <el-input
                readonly
                v-model="editGroup.form.alername"
                style="width: 200px"
              ></el-input>
            </el-form-item>
            <el-form-item label="类型: ">
              <el-input
                readonly
                v-model="editGroup.form.kind"
                style="width: 200px"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="prometheus地址: "
              v-if="editGroup.form.kind === 'alertmanager'"
            >
              <el-input
                readonly
                v-model="editGroup.form.prometheusUrl"
                style="width: 200px"
              ></el-input>
            </el-form-item>
            <el-form-item label="值班人:">
              <el-input
                readonly
                v-model="editGroup.form.alertDuty"
                style="width: 200px"
              ></el-input>
            </el-form-item>
            <el-form-item label="处理人:">
              <el-input
                readonly
                v-model="editGroup.form.principal"
                style="width: 200px"
              ></el-input>
            </el-form-item>
            <el-form-item label="告警标签" style="margin-left: 10px">
              <div v-for="(value, key) in editGroup.form.alertLabel" :key="key">
                <el-tag style="float: left">{{ key }}: {{ value }}</el-tag>
              </div>
            </el-form-item>
            <el-form-item label="处理过程: ">
              <textarea
                readonly
                v-model="editGroup.form.comment"
                style="width: 500px;height: 300px"
              ></textarea>
            </el-form-item>
          </el-form>
          <span style="margin-left: 80% ">
            <el-button
              type="primary"
              @click="editConfirm"
              v-if="editGroup.form.status !== 'end'"
              >下一步</el-button
            >
            <el-button @click="cancelEdit">取 消</el-button>
          </span>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      statusList: [
        { value: 'init', label: '需处理', active: 1 },
        { value: 'following', label: '跟进中', active: 2 },
        { value: 'end', label: '已解决', active: 3 }
      ],
      url: null,
      condition: null,
      groupId: '',
      groupName: '',
      editGroup: {
        visible: false,
        form: {
          id: undefined,
          status: undefined,
          comment: undefined,
          kind: undefined,
          alername: undefined,
          prometheusUrl: undefined,
          alertLabel: undefined,
          active: undefined
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
    async getAlerOrderDetail (id) {
      let res = await this.$http.getAlertOrderApi({ id: id })
      this.editGroup.form = res.results
      this.statusList.forEach(val => {
        if (val.value === this.editGroup.form.status) {
          console.log(val.active)
          this.editGroup.form['active'] = val.active
        }
      })
      console.log(this.editGroup.form.alertLabel)
      console.log(typeof this.editGroup.form.alertLabel)
      this.editGroup.form['alertLabel'] = JSON.parse(
        this.editGroup.form.alertLabel.replace(/'/g, '"')
      )
      console.log(this.editGroup.form)
    },
    edit (id) {
      this.editGroup.visible = true
      this.getAlerOrderDetail(id)
    },
    async editConfirm () {
      this.$confirm('确认下一步?', '提示', { type: 'warning' }).then(
        async () => {
          if (this.editGroup.form.status === 'init') {
            const param = {
              id: this.editGroup.form.id,
              statusOperater: 'following'
            }
            let res = await this.$http.patchAlertOrderApi(param)
            if (res.hasOwnProperty('results')) {
              this.editGroup.form.active = 2
              this.getAlerOrderDetail(this.editGroup.form.id)
            } else {
              this.$message.error('下一步失败!')
            }
          } else if (this.editGroup.form.status === 'following') {
            const param = {
              id: this.editGroup.form.id,
              statusOperater: 'end',
              comment: this.editGroup.form.comment
            }
            let res = await this.$http.patchAlertOrderApi(param)
            if (res.hasOwnProperty('results')) {
              this.editGroup.form.active = 3
              this.getAlerOrderDetail(this.editGroup.form.id)
              this.$refs.alertorderlist.getData()
            } else {
              this.$message.error('下一步失败!')
            }
          }
        }
      )
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
