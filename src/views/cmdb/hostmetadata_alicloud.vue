<template>
  <div class="main">
    <div class="wrapper wrapper-content">
      <el-form ref="form" :model="form" label-width="80px" v-loading="loading">
        <el-form-item label="实例ID:" >
          <label>{{form.id}}</label>
        </el-form-item>
        <el-form-item label="实例名:" >
          <label>{{form.InstanceName}}</label>
        </el-form-item>
        <el-form-item label="Cpu:" >
          <label>{{form.Cpu}}</label>
        </el-form-item>
        <el-form-item label="镜像ID:" >
          <label>{{form.ImageId}}</label>
        </el-form-item>
        <el-form-item label="Memory:" >
          <label>{{form.Memory}}</label>
        </el-form-item>
        <el-form-item label="区域ID:" >
          <label>{{form.ZoneId}}</label>
        </el-form-item>
        <el-form-item label="状态:" >
          <label>{{form.Status}}</label>
        </el-form-item>
        <el-form-item label="主机名:" >
          <label>{{form.HostName}}</label>
        </el-form-item>
        <el-form-item label="OSName:" >
          <label>{{form.OSName}}</label>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        form: {},
        loading: true
      }
    },
    created () {
      this.gethostmetadata(this.$route.params.id)
    },
    methods: {
      async gethostmetadata (id) {
        this.loading = true
        const param = {id: id}
        let res = await this.$http.get(`/api/cmdb/cloudinstance/${param.id}/`, param)
        this.form = res.results
        this.loading = false
      }
    }
  }
</script>
<style scoped lang="less">
  .group-id{
    color: #409EFF;
    cursor: pointer;
  }
  .group-name{
    i{
      font-size: 16px;
      color: #f99;
      &:hover{
        color: #f00;
        font-size: 20px;
      }
    }
  }
  .warning{
    font-size: 12px;
    color: #999;
  }
</style>
