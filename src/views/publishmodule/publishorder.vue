<template>
  <div class="main">
    <div class="wrapper wrapper-content">
      <d-table
        url="/api/publishmodule/publishorderviewset/"
        ref="publishorderlist"
        v-if="!showDetail"
        :conditionForm="condition"
        :publiPageNum="true"
      >
        <template slot="headerRight">
          <el-button type="primary" @click="toPublishorder"
            >今日发版</el-button
          ></template
        >
        <template slot="column">
          <el-table-column prop="id" label="工单id" width="130px">
            <template slot-scope="scope">
              {{ scope.row.id }}
            </template>
          </el-table-column>
          <el-table-column label="标题" width="450px">
            <template slot-scope="scope">
              <a href="javascript:;" @click="toEditGroup(scope.row.id)"
                >{{ scope.row.title }}
              </a>
            </template>
          </el-table-column>
          <el-table-column label="工单状态" width="100px">
            <template slot-scope="scope">
              <div v-if="scope.row.orderStatus === '驳回'">
                <el-tag type="danger">{{ scope.row.orderStatus }}</el-tag>
              </div>
              <div v-else-if="scope.row.orderStatus === '待发版'">
                <el-tag type="info">{{ scope.row.orderStatus }}</el-tag>
              </div>
              <div v-else-if="scope.row.orderStatus === '已完成'">
                <el-tag type="success">{{ scope.row.orderStatus }}</el-tag>
              </div>
              <div v-else-if="scope.row.orderStatus === '失败'">
                <el-tag type="danger">{{ scope.row.orderStatus }}</el-tag>
              </div>
              <div v-else>
                <el-tag>异常状态</el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="钉钉工单id" width="230px">
            <template slot-scope="scope">
              {{ scope.row.dingdingOrderId }}
            </template>
          </el-table-column>
          <el-table-column label="创建人" width="120px">
            <template slot-scope="scope">
              <div v-if="scope.row.orderCreater !== null">
                {{ scope.row.orderCreater.username }}
              </div>
              <div v-else>
                {{ scope.row.orderCreater }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" width="150px">
            <template slot-scope="scope">
              {{ scope.row.createdTime }}
            </template>
          </el-table-column>
          <el-table-column label="修改时间" width="150px">
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
                @click="publishOrderDetail(scope.row)"
                @command="handleCommand"
                >编辑
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    :command="'reject.' + scope.row.id"
                    :disabled="!button_partialupdate_publishorder"
                  >
                    驳回
                  </el-dropdown-item>
                  <el-dropdown-item
                    :command="'delete.' + scope.row.id"
                    :disabled="!button_delete_publishorder"
                    >删除
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </template>
      </d-table>
      <el-dialog
        title="发布工单编辑"
        :visible.sync="editGroup.visible"
        width="50%"
      >
        <el-form
          :model="editGroup.form"
          label-position="left"
          label-width="100px"
        >
          <el-form-item label="id:">
            <el-input
              readonly
              v-model="editGroup.form.id"
              style="width: 200px"
            ></el-input>
          </el-form-item>
          <el-form-item label="标题:">
            <el-input
              readonly
              v-model="editGroup.form.title"
              style="width: 200px"
            ></el-input>
          </el-form-item>
          <el-form-item label="状态:">
            <el-select v-model="editGroup.form.orderStatus">
              <el-option
                v-for="tag in orderStatusList"
                :key="tag.value"
                :value="tag.value"
                :label="tag.label"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="钉钉工单id:">
            <el-input
              v-model="editGroup.form.dingdingOrderId"
              style="width: 200px"
            ></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button
            type="primary"
            :disabled="!button_partialupdate_publishorder"
            @click="editConfirm()"
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
      orderStatusList: [
        { value: 0, label: '待发版' },
        { value: 1, label: '已完成' },
        { value: 2, label: '驳回' },
        { value: 3, label: '失败' }
      ],
      button_partialupdate_publishorder: false,
      button_delete_publishorder: false,
      searchenv: '',
      searchModule: '',
      searchTime: '',
      condition: {},
      groupId: '',
      groupName: '',
      editGroup: {
        visible: false,
        form: {
          id: null,
          title: null,
          orderStatus: null,
          dingdingOrderId: undefined
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
    if (window.localStorage.getItem('publiPageChange') !== '1') {
      window.localStorage.setItem('publiPageNum', 1)
    }
    window.localStorage.setItem('publiPageChange', 0)
    this.getPerm()
  },
  methods: {
    // 跳转到今日发版
    toPublishorder () {
      this.$router.push({
        name: 'publish_today'
      })
    },
    // 跳转到详情
    toEditGroup (id) {
      window.localStorage.setItem('publishId', id)
      this.$router.push({
        name: 'publish_order_detail',
        params: {
          id: id
        }
      })
    },
    async publishOrderDetail (row) {
      this.editGroup.visible = true
      let res = await this.$http.publishOrderDetailApi({ id: row.id })
      this.editGroup.form = res.results
      this.orderStatusList.forEach(val => {
        if (this.editGroup.form.orderStatus === val.label) {
          this.editGroup.form.orderStatus = val.value
        }
      })
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
    editConfirm () {
      this.$confirm('确认修改?', '提示', { type: 'warning' }).then(async () => {
        console.log(this.editGroup.form)
        const param = {
          id: this.editGroup.form.id,
          orderStatus: this.editGroup.form.orderStatus,
          dingdingOrderId: this.editGroup.form.dingdingOrderId
        }
        let res = await this.$http.publishOrderPatchApi(param)
        if (res.hasOwnProperty('results')) {
          this.$message.success('修改成功!')
        } else {
          this.$message.error('修改失败!')
        }
        this.editGroup.visible = false
        this.getpublishorderdblist()
      })
    },
    cancelEdit () {
      this.editGroup = {
        visible: false,
        form: { groupName: '', description: '', groupId: '' }
      }
      this.addGroup = { visible: false, form: { name: '', comment: '' } }
    },
    async getpublishorderdblist () {
      const param = { page: 1 }
      let res = await this.$http.getpublishorderdblistapi()
      this.$refs.publishorderlist.setData(res.results, res.count)
    },
    async handleCommand (command) {
      let list = command.split('.')
      if (list[0] === 'agree' || list[0] === 'reject') {
        const param = { id: list[1], workeroperate: list[0] }
        let res = await this.$http.updatepublishorderapi(param)
        if (res.hasOwnProperty('results')) {
          this.$message.success('修改成功')
        }
        this.getpublishorderdblist()
      } else if (list[0] === 'delete') {
        this.$confirm('确认删除?', '提示', { type: 'warning' })
          .then(async () => {
            const param = { id: list[1] }
            let res = await this.$http.deletepublishorderapi(param)
            if (res.hasOwnProperty('results')) {
              this.$message.success('删除成功')
            }
            this.getpublishorderdblist()
          })
          .catch(_ => {})
      }
    },
    getPerm () {
      let perm = JSON.parse(window.sessionStorage.getItem('permission'))
      if (perm.includes('update_publish_order')) {
        this.button_partialupdate_publishorder = true
      }
      if (perm.includes('delete_publish_order')) {
        this.button_delete_publishorder = true
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
