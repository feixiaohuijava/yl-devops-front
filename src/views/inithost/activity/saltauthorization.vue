<template>
  <div class="main">
    <div class="wrapper wrapper-content">
      <el-tabs type="border-card">
        <el-tab-pane label="stack授权">
          <el-col :span="16" :offset="3">
            <el-form label-width="100px" class="form-group bmd-form-group">
              <el-form-item label="主机名:">
                <el-input v-model="name" :disabled="true"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="saltAuthorization">授权</el-button>
              </el-form-item>
              <el-form-item style="text-align: right;padding-top: 10px">
                <el-button type="primary" @click="lastStep" plain>上一步</el-button>
                <el-button type="primary" @click="finish" plain>完成</el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
  import { Loading } from 'element-ui'

  export default {
    data () {
      return {
        submitStatus: false,
        name: '',
        id: '',
        options: {
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        }
      }
    },
    created () {
      if (this.$route.params.id === undefined) {
        this.$router.push({path: '/init/'})
      } else {
        this.id = this.$route.params.id
        this.name = this.$route.params.name
      }
    },
    methods: {
      async saltAuthorization () {
        let loadingInstance = Loading.service(this.options)
        let res = await this.$http.saltAuthorize({minion: this.name})
        loadingInstance.close()
        if (res.hasOwnProperty('msg') !== true) {
          this.$message.success('主机的salt-key授权成功。')
        }
      },
      lastStep () {
        this.$router.push({name: '安装salt', params: {id: this.id, name: this.name}})
      },
      async finish () {
        let res = this.$http.initComplete({'host_id': this.id})
        if (res.hasOwnProperty('msg') !== true) {
          this.$message.success('服务器初始化完成。')
          this.$router.push({path: '/init/'})
        }
      }
    }
  }
</script>

<style scoped>

</style>
