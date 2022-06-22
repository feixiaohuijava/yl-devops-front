<template>
  <div class="main">
    <div class="wrapper wrapper-content">
      <d-table
        url="/api/servicecom/rabbitmqviewset/"
        ref="brandList"
        v-if="!showDetail"
        :conditionForm="condition"
        :retainPageNum="true"
      >
        <template slot="headerRight">
          <el-form-item>
            <el-button type="primary" @click="toRabbitmqQueue">
              队列
              <!-- <router-link :to="{name: 'servicecomponent_rabbitmq_queue'}">队列</router-link> -->
            </el-button>
          </el-form-item>
        </template>
        <template slot="column">
          <el-table-column label="id" width="80px">
            <template slot-scope="scope">
              {{ scope.row.id }}
            </template>
          </el-table-column>
          <el-table-column label="name" width="80px">
            <template slot-scope="scope">
              {{ scope.row.name }}
            </template>
          </el-table-column>
          <el-table-column label="namespace" width="150px">
            <template slot-scope="scope">
              {{ scope.row.namespace }}
            </template>
          </el-table-column>
          <el-table-column label="manageUrl" width="400px">
            <template slot-scope="scope">
              {{ scope.row.manageUrl }}
            </template>
          </el-table-column>
          <el-table-column label="cluster">
            <template slot-scope="scope">
              {{ scope.row.cluster.clusterName }}
            </template>
          </el-table-column>
          <el-table-column label="createdTime">
            <template slot-scope="scope">
              {{ scope.row.createdTime }}
            </template>
          </el-table-column>
          <el-table-column label="updateTime">
            <template slot-scope="scope">
              {{ scope.row.updateTime }}
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
      buttonRedisCreate: false,
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
    if (window.localStorage.getItem('jump') === '1') {
    } else {
      window.localStorage.setItem('retainPageNum', 1)
    }
    window.localStorage.setItem('jump', 0)
  },
  methods: {
    // 跳转到队列里
    toRabbitmqQueue () {
      this.$router.push({
        name: 'servicecomponent_rabbitmq_queue'
      })
    },
    async syncRedis () {
      let res = await this.$http.syncRedisApi()
      this.$message.success('同步成功!')
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
</style>
