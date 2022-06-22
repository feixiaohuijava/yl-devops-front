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
      redisId: '',
      name: '',
      command: '',
      tableData: [],
      comamndresult: {}
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
    //执行redis操作
    async executerediscommand () {
      if (this.command) {
        const param = {
          command: this.command,
          redisId: this.redisId
        }
        let res = await this.$http.rediscommand(param)
        if (res.file_flag) {
          const data = res.filedata
          const blob = new Blob([data], { type: '' })
          FileSaver.saveAs(blob, 'redis结果.json')
        } else {
          this.comamndresult = res.results
        }
      }
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
</style>
