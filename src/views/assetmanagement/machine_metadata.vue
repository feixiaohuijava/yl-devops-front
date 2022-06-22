<template>
  <div class="main">
    <div class="wrapper wrapper-content">
      <el-form ref="form" :inline="true" :model="form" label-width="80px" v-loading="loading">
        <el-form-item label="实例ID:">
          <label>{{form.id}}</label>
        </el-form-item>
        <el-form-item label="rac_ip:">
          <label>{{form.rac_ip}}</label>
        </el-form-item>
        <el-form-item label="sn:">
          <label>{{form.sn}}</label>
        </el-form-item>
        <el-form-item label="cpu:">
          <div v-for="tag in form.cpu">
            <el-tag>{{tag.name}}</el-tag>
            :
            <el-tag>{{tag.TotalCores}}</el-tag>
          </div>
        </el-form-item>
        <el-form-item label="memory:">
          <div v-for="tag in form.memory">
            <el-tag>{{tag.name}}</el-tag>
            :
            <el-tag>{{tag.CapacityMiB}}</el-tag>
          </div>
        </el-form-item>
        <el-form-item label="disk:">
          <div v-for="tag in form.disk">
            <el-tag>{{tag.name}}</el-tag>
            :
            <el-tag>{{tag.value}}</el-tag>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
    export default {
        data() {
            return {
                form: {},
                loading: true
            }
        },
        created() {
            this.getmachinemetadata(this.$route.params.id)
        },
        methods: {
            async getmachinemetadata(id) {
                this.loading = true
                const param = {id: id}
                let res = await this.$http.get(`/api/asset/machine/${param.id}/`, param)
                this.form = res.results
                console.log(this.form)
                console.log(this.form.cpu)
                this.loading = false
            }
        }
    }
</script>
<style scoped lang="less">
  .group-id {
    color: #409EFF;
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
