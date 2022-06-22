<template>
  <div class="main">
    <div class="wrapper wrapper-content">
      <el-button
        icon="el-icon-back"
        type="primary"
        @click="routerBack"
        class="back-btn"
        >返回</el-button
      >
      <d-table
        url="/api/servicecom/rabbitmqconsumerviewset/"
        ref="rabbitmqconsumerList"
        v-if="!showDetail"
        :conditionForm="condition"
      >
        <template slot="headerLeft">
          <el-form-item>
            <el-input
              placeholder="根据队列名模糊搜索"
              v-model="searchQueuename"
              class="input-search"
              @keyup.native.enter="onSearchRabbitmqConsumer"
              style="width: 300px"
            >
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              icon="el-icon-search"
              type="primary"
              @click="onSearchRabbitmqConsumer"
              >查询</el-button
            >
          </el-form-item>
        </template>
        <template slot="column">
          <el-table-column label="id" width="80px">
            <template slot-scope="scope">
              {{ scope.row.id }}
            </template>
          </el-table-column>
          <el-table-column label="队列名" width="400px">
            <template slot-scope="scope">
              {{ scope.row.queuename }}
            </template>
          </el-table-column>
          <el-table-column label="应用" width="150px">
            <template slot-scope="scope">
              {{ scope.row.app }}
            </template>
          </el-table-column>
          <el-table-column label="环境" width="150px">
            <template slot-scope="scope">
              {{ scope.row.env }}
            </template>
          </el-table-column>
          <el-table-column label="rabbitmq" width="300px">
            <template slot-scope="scope">
              id: {{ scope.row.rabbitmq.id }}
              <br />
              命名空间: {{ scope.row.rabbitmq.namespace }}
              <br />
              集群名: {{ scope.row.rabbitmq.cluster.clusterName }}
            </template>
          </el-table-column>
          <el-table-column label="pod_ip" width="150px">
            <template slot-scope="scope">
              {{ scope.row.pod_ip }}
            </template>
          </el-table-column>
          <el-table-column label="创建时间" width="150px">
            <template slot-scope="scope">
              {{ scope.row.createdTime }}
            </template>
          </el-table-column>
        </template>
      </d-table>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      searchQueuename: null,
      condition: null,
      groupId: '',
      groupName: '',
      editGroup: {
        visible: false,
        form: { id: '', groupName: '', description: '', groupId: '' }
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
    // 返回上一页
    routerBack () {
      window.localStorage.setItem('retainPage', 1)
      window.localStorage.setItem('jump', 1)
      this.$router.go(-1)
    },
    // 查询
    async onSearchRabbitmqConsumer () {
      const param = {}
      if (this.searchQueuename) {
        param['queuename__contains'] = this.searchQueuename
      }
      let res = await this.$http.getRabbitmqQueueApi(param)
      this.$refs.rabbitmqconsumerList.setData(res.results, res.count)
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
        form: { id: item.id, name: item.name, comment: item.comment }
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
      console.log(perm)
      if (perm.includes('add_redis')) {
        this.buttonRedisCreate = true
        console.log('has')
        console.log(this.buttonRedisCreate)
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
.back-btn {
  margin-left: 20px;
}
</style>
