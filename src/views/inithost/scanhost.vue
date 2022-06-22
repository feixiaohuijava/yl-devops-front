<template>
  <div class="main">
    <div class="wrapper wrapper-content">
      <el-tabs type="border-card">
        <el-tab-pane label="主机列表">
          <el-table v-loading="loading" element-loading-text="拼命加载中"
                    element-loading-spinner="el-icon-loading"
                    element-loading-background="rgba(0, 0, 0, 0.8)" size="medium" :data="hostList" height="440"
                    style="width: 100%">
            <el-table-column prop="ip" label="IP"></el-table-column>
            <el-table-column prop="type" label="状态"></el-table-column>
          </el-table>
        </el-tab-pane>
        <div style="text-align: right;padding-top: 10px">
          <el-button type="success" icon="el-icon-refresh" @click="scan">扫描主机</el-button>
        </div>
      </el-tabs>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        hostList: [],
        loading: false
      }
    },
    created () {
    },
    methods: {
      async scan () {
        this.loading = true
        const param = {
          'method': 'sync'
        }
        let res = await this.$http.scanHostList(param)
        // loading.close()
        let existHost = res.exist_host
        let newHost = res.new_host
        var arr = []
        for (var i = 0; i < existHost.length; i++) {
          const resultsExistHost = {
            'ip': existHost[i],
            'type': '已存在'
          }
          arr.push(resultsExistHost)
        }
        for (var j = 0; j < newHost.length; j++) {
          const resultsNewHost = {
            'ip': newHost[i],
            'type': '新增'
          }
          arr.push(resultsNewHost)
        }
        this.hostList = arr
        this.loading = false
      }
    }
  }
</script>

<style></style>
