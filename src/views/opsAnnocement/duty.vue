<template>
  <div class="main">
    <div class="wrapper wrapper-content">
      <el-form>
        <el-form-item label="运维值班人员:">
          <el-input v-model="currentDutyMember" style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item label="电话:">
          <el-input v-model="phone" style="width: 200px"></el-input>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
          currentDutyMember: null,
          phone: null,
      }
    },
    created () {
        this.getCurrentDuty()
    },
    methods: {
        async getCurrentDuty (){
            let res = await this.$http.getcurrentdutyapi()
            this.currentDutyMember = res.results[0].username
            this.phone = res.results[0].phone
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
