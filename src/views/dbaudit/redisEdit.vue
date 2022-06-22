<template>
  <div class="main">
    <el-button
      icon="el-icon-back"
      type="primary"
      @click="routerBack"
      class="back-btn"
      >返回</el-button
    >
    <div class="wrapper wrapper-content">
      <el-form :inline="true" ref="adddeleteform">
        <el-form-item label="当前redis库:" style="width: 100%">
          <el-input v-model="name" readonly></el-input>
        </el-form-item>
        <el-form-item label="请输入修改命令:" style="width: 100%">
          <textarea v-model="redisUpdateCommand" style="width: 500%"></textarea>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addupdateConfirm">确 定</el-button>
        <el-button @click="cancelUpdte">取 消</el-button>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      redisId: '',
      name: '',
      redisUpdateCommand: ''
    }
  },
  created () {
    // this.tableData = this.$route.params.topTenSlowLogs
    this.redisId = this.$route.params.redisId
    this.name = this.$route.params.name
  },
  methods: {
    // 返回
    routerBack () {
      this.$router.go(-1)
    },
    // 确认
    addupdateConfirm () {
      this.$confirm('确认提交命令?', '提示', { type: 'warning' })
        .then(async () => {
          if (this.redisUpdateCommand !== '') {
            const param = {
              orderType: 'redis',
              orderContent: {
                redisId: this.redisId,
                redisUpdateCommand: this.redisUpdateCommand,
                operateType: 'update'
              },
              orderFinishFlag: '',
              orderCreater: ''
            }
            let res = await this.$http.addworkorder(param)
            this.$message.success('已经添加入工单!')
            this.$router.go(-1)
          } else {
            this.$message.error('没有添加任何命令')
          }
        })
        .catch(_ => {})
    },
    // 取消
    cancelUpdte () {
      this.redisUpdateCommand = ''
      this.$router.go(-1)
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
  margin-top: 30px;
  margin-left: 10px;
}
.wrapper-content {
  margin-left: 50%;
  transform: translateX(-50%);
}
.dialog-footer {
  margin-left: 50%;
  transform: translateX(-50%);
}
</style>
