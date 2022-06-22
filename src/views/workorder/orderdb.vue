<template>
  <div class="main">
    <div class="wrapper wrapper-content">
      <d-table
        url="/api/dbaudit/workorderviewset/"
        ref="workorderlist"
        v-if="!showDetail"
        :conditionForm="condition"
      >
        <template slot="headerRight"> </template>
        <template slot="column">
          <el-table-column label="工单Id" width="70px">
            <template slot-scope="scope">
              {{ scope.row.id }}
            </template>
          </el-table-column>
          <el-table-column label="redis" width="240px">
            <template slot-scope="scope">
              <el-tag type="success">redisId:</el-tag>
              {{ scope.row.orderContent.redisId }}
              <br />
              <el-tag type="success">name:</el-tag>
              {{ scope.row.redisName }}
            </template>
          </el-table-column>
          <el-table-column label="工单状态" width="140px">
            <template slot-scope="scope">
              <el-tag type="primary" v-if="scope.row.orderFinishFlag === 0"
                >未处理</el-tag
              >
              <el-tag type="success" v-if="scope.row.orderFinishFlag === 1"
                >已处理</el-tag
              >
              <el-tag type="danger" v-if="scope.row.orderFinishFlag === 2"
                >已处理(存在无效key)</el-tag
              >
              <el-tag type="danger" v-if="scope.row.orderFinishFlag === 3"
                >驳回</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column label="操作类型" width="70px">
            <template slot-scope="scope">
              {{ scope.row.operateType }}
            </template>
          </el-table-column>
          <el-table-column label="工单内容" width="400px">
            <template slot-scope="scope">
              <div v-if="scope.row.orderContent.operateType === 'delete'">
                <el-tag type="primary"
                  >redis keys总量:
                  {{ scope.row.orderContent.rediskeyarray.length }}</el-tag
                >
                <br />
                <el-tag type="danger"
                  >失败总量:
                  {{ scope.row.orderContent.failrediskeyarray.length }}</el-tag
                >
              </div>
              <div v-if="scope.row.orderContent.operateType === 'update'">
                redis 修改操作: {{ scope.row.orderContent.redisUpdateCommand }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" width="140px">
            <template slot-scope="scope">
              {{ scope.row.createdTime }}
            </template>
          </el-table-column>
          <el-table-column label="修改时间" width="140px">
            <template slot-scope="scope">
              {{ scope.row.updateTime }}
            </template>
          </el-table-column>
          <el-table-column label="创建人" width="140px">
            <template slot-scope="scope">
              <div v-if="scope.row.orderCreater !== null">
                {{ scope.row.orderCreater.username }}
              </div>
              <div v-else></div>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-dropdown
                split-button
                trigger="click"
                type="primary"
                @click="openDetail(scope.row)"
                @command="handleCommand"
                >详情
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    :command="'agree.' + scope.row.id"
                    :disabled="!button_partialupdate_workorder"
                    >执行
                  </el-dropdown-item>
                  <el-dropdown-item
                    :command="'reject.' + scope.row.id"
                    :disabled="!button_partialupdate_workorder"
                    >驳回
                  </el-dropdown-item>
                  <el-dropdown-item
                    :command="'delete.' + scope.row.id"
                    :disabled="!button_delete_workorder"
                    >删除
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </template>
      </d-table>
      <el-dialog
        title="工单详情"
        :visible.sync="detailGroup.visible"
        width="100%"
      >
        <el-form :model="detailGroup.form" labelWidth="100px">
          <el-form-item prop="name" label="工单Id">
            <el-input
              v-model="detailGroup.form.id"
              readonly
              style="width: 30%"
            ></el-input>
          </el-form-item>
          <el-form-item prop="name" label="redisId">
            <el-input
              v-model="detailGroup.form.redisId"
              readonly
              style="width: 30%"
            ></el-input>
          </el-form-item>
          <el-form-item prop="comment" label="redisKey">
            <el-tag>总量:{{ detailGroup.form.rediskeyarray.length }}</el-tag>
            <br />
            <el-tag
              type="success"
              v-for="tag in detailGroup.form.rediskeyarray"
              :key="tag"
              >{{ tag }}</el-tag
            >
          </el-form-item>
          <el-form-item prop="comment" label="删除失败key:">
            <el-tag
              >总量: {{ detailGroup.form.failrediskeyarray.length }}</el-tag
            >
            <br />
            <el-tag
              type="danger"
              v-for="tag in detailGroup.form.failrediskeyarray"
              :key="tag"
              >{{ tag }}</el-tag
            >
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import JsonViewer from 'vue-json-viewer'

export default {
  comments: {
    JsonViewer
  },
  data () {
    return {
      rediskeyarray: [],
      redisValue: '',
      rediskey: '',
      currentRedis: '',
      rediskeys: [1, 2, 3, 4],
      rediskeydeletings: [],
      idcId: '',
      machineroomId: '',
      cabinetId: '',
      idcList: [],
      machineroomList: [],
      cabinetList: [],
      condition: null,
      groupId: '',
      groupName: '',
      operateGroup: { visible: false, form: { redisId: '', redisKeys: [] } },
      detailGroup: {
        visible: false,
        form: { id: '', rediskeyarray: [], redisId: '', failrediskeyarray: [] }
      },
      showDetail: false,
      detailId: '',
      detailName: '',
      activeName: '',
      button_partialupdate_workorder: false,
      button_delete_workorder: false
    }
  },
  created () {
    this.getPerm()
  },
  methods: {
    async openDetail (each) {
      if (each.operateType === 'delete') {
        this.detailGroup.form = {
          id: '',
          rediskeyarray: [],
          redisId: '',
          failrediskeyarray: []
        }
        this.detailGroup.visible = true
        this.detailGroup.form.id = each.id
        const param = { id: this.detailGroup.form.id }
        let res = await this.$http.getorderdbdetailapi(param)
        this.detailGroup.form.redisId = res.orderContent.redisId
        this.detailGroup.form.rediskeyarray = res.orderContent.rediskeyarray
        if (res.orderContent.hasOwnProperty('failrediskeyarray')) {
          this.detailGroup.form.failrediskeyarray =
            res.orderContent.failrediskeyarray
        } else {
          this.detailGroup.form.failrediskeyarray = []
        }
      }
    },
    async handleCommand (command) {
      let list = command.split('.')
      if (list[0] === 'agree' || list[0] === 'reject') {
        const param = { id: list[1] }
        const workeroperate = list[0]
        let res = await this.$http.getorderdbdetailapi(param)
        const item = res
        this.updateWorkorder(item, workeroperate)
      } else if (list[0] === 'delete') {
        this.$confirm('确认删除?', '提示', { type: 'warning' })
          .then(async () => {
            const param = { id: list[1] }
            let res = await this.$http.deleteorderapi(param)
            this.$message.success('删除成功')
            this.getorderdblist()
          })
          .catch(_ => {})
      }
    },
    async getorderdblist () {
      const param = { page: 1 }
      let res = await this.$http.getorderdblistapi(param)
      this.$refs.workorderlist.setData(res.results, res.count)
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
    updateWorkorder (item, workeroperate) {
      this.$confirm('确认操作?', '提示', { type: 'warning' })
        .then(async () => {
          if (item.orderContent.redisId) {
            const param = {
              workorderId: item.id,
              redisId: item.orderContent.redisId,
              workeroperate: workeroperate,
              operateType: item.operateType
            }
            let res = await this.$http.updateWorkorderapi(param)
            if (item.operateType === 'delete') {
              if (res.results.length !== 0 && workeroperate === 'agree') {
                this.$message.error('失败!')
              } else {
                this.$message.success('操作成功!')
              }
            } else if (item.operateType === 'update') {
              if (res.hasOwnProperty('results')) {
                this.$message.success('操作成功!')
              } else {
                this.$message.error('操作失败!')
              }
            }
          } else {
            this.$message.error('redisId为空')
          }
          this.getorderdblist()
        })
        .catch(_ => {})
    },
    cancelEdit () {
      this.operateGroup = {
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
      if (perm.includes('partialupdate_workorder')) {
        this.button_partialupdate_workorder = true
      }
      if (perm.includes('delete_workorder')) {
        this.button_delete_workorder = true
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

.transfer-footer {
  margin-left: 20px;
  padding: 6px 5px;
}
</style>
<style>
.el-dialog__body {
  height: 100%;
}
</style>
