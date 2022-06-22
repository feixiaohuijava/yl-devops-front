<template>
  <div class="main">
    <div class="wrapper wrapper-content">
      <el-tabs type="border-card">
        <el-tab-pane label="安装saltstack">
          <el-col :span="16" :offset="3">
            <el-form label-width="100px" class="form-group bmd-form-group">
              <el-form-item label="主机名">
                <el-input v-model="name" :disabled="true"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="installMaster">安装salt-master</el-button>
                <el-button type="primary" @click="installMinion">安装salt-minion</el-button>
              </el-form-item>
              <el-form-item style="text-align: right;padding-top: 10px">
                <el-button type="primary" @click="lastStep" plain>上一步</el-button>
                <el-button type="primary" @click="nextStep" plain>下一步</el-button>
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
      async installMaster () {
        let loadingInstance = Loading.service(this.options)
        let res = await this.$http.installSaltMaster({'host_id': this.id})
        loadingInstance.close()
        if (res.hasOwnProperty('msg') !== true) {
          this.$message.success('安装Salt-master成功。')
        }
      },
      async installMinion () {
        let loadingInstance = Loading.service(this.options)
        let res = await this.$http.installSaltMinion({'host_id': this.id})
        loadingInstance.close()
        if (res.hasOwnProperty('msg') !== true) {
          this.$message.success('安装Salt-minion成功。')
        }
      },
      lastStep () {
        this.$router.push({name: '网卡配置', params: {id: this.id, name: this.name}})
      },
      nextStep () {
        this.$router.push({name: 'salt授权', params: {id: this.id, name: this.name}})
      }
    }
  }
</script>

<style scoped>

</style>
