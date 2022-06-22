<template>
  <div class="main">
    <div class="wrapper wrapper-content">
      <el-tabs type="border-card">
        <el-tab-pane label="修改主机名">
          <el-col :span="16" :offset="3">
            <el-form label-width="100px" class="form-group bmd-form-group">
              <el-form-item label="主机名">
                <el-input v-model="name"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="updateHost">修改</el-button>
              </el-form-item>
              <div style="text-align: right;padding-top: 10px">
                <el-button type="primary" @click="lastStep" plain>上一步</el-button>
                <el-button type="primary" @click="nextStep" plain>下一步</el-button>
              </div>
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
      lastStep () {
        this.$router.push({path: '/init/'})
      },
      nextStep () {
        this.$router.push({name: '更改Repo', params: {id: this.id, name: this.name}})
      },
      async updateHost () {
        const param = {
          'host_id': this.id,
          'name': this.name
        }
        let loadingInstance = Loading.service(this.options)
        let res = await this.$http.changeHostName(param)
        loadingInstance.close()
        if (res.hasOwnProperty('msg') !== true) {
          this.$message.success('主机名修改成功')
        }
      }
    }
  }
</script>

<style scoped>

</style>
