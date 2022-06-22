<template>
  <div class="main">
    <el-button
      icon="el-icon-back"
      type="primary"
      @click="routerBack"
      class="back-btn"
      >返回</el-button
    >
    <div class="wrapper wrapper-content" v-loading="editGroupLoading">
      <div class="edit_dev">
        <el-transfer
          v-model="transferValue"
          :data="transferData"
          @change="onTransfer"
        ></el-transfer>
        <!-- <el-transfer
          v-model="transferValue"
          :data="transferData"
          @change="onTransfer"
        >
          <span slot-scope="{ option }">{{ option.label }} </span>
          <span slot-scope="{ option }">{{ option.label }} </span>
        </el-transfer> -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      editGroupLoading: false,
      transferValue: [],
      transferData: [],
      showDetail: false
    }
  },
  created () {
    // JSON.parse(window.localStorage.getItem('permissions'))
    this.getJurisdiction()
    this.$route.params.permission.forEach(item => {
      this.transferValue.push(item.id)
    })
  },
  methods: {
    // 获取所有权限列表数据
    async getJurisdiction () {
      this.transferData = []
      let res = await this.$http.getPermissionApi()
      res.results = res.results.sort((a, b) => a.name.localeCompare(b.name))
      res.results.forEach(item => {
        this.transferData.push({
          key: item.id,
          label: item.name.split('/')[2]
        })
      })
    },
    // 返回上一级
    routerBack () {
      this.$router.back()
    },
    // 选中
    onTransfer (val) {
      console.log(this.transferValue)
    }
  }
}
</script>
<style scoped>
.form-details {
  display: flex;
}
.back-btn {
  margin-top: 20px;
  margin-left: 20px;
}
.es-form-item {
  margin-left: 100px;
}
.edit_dev >>> .el-transfer-panel {
  width: 700px;
  height: 800px;
}
.edit_dev >>> .el-transfer-panel__body {
  width: 700px;
  height: 800px;
}
.edit_dev >>> .el-transfer-panel__list {
  width: 700px;
  height: 800px;
}
</style>
