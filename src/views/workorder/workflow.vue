<template>
  <div class="main">
    <div class="wrapper wrapper-content">
      <el-steps :active="2" align-center>
        <el-step title="步骤1" description="rediskey创建"></el-step>
        <el-step title="步骤2" description="rediskey审核"></el-step>
        <el-step title="步骤3" description="rediskey删除"></el-step>
        <el-step title="步骤4" description="rediskey完成"></el-step>
      </el-steps>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        rediskeyarray: [],
        redisValue: '',
        rediskey: '',
        currentRedis: '',
        rediskeys: [1, 2, 3, 4],
        rediskeydeletings: [],
        idcId: '',
        machineroomId: '',
        cabinetId: '',
        idcList: [],
        machineroomList: [],
        cabinetList: [],
        condition: null,
        groupId: '',
        groupName: '',
        operateGroup: {visible: false, form: {redisId: '', redisKeys: []}},
        detailGroup: {visible: false, form: {id: '', rediskeyarray: [], redisId: '', failrediskeyarray: []}},
        showDetail: false,
        detailId: '',
        detailName: '',
        activeName: '',
        button_partialupdate_workorder: false,
        button_delete_workorder: false
      }
    },
    created () {
      this.getPerm()
    },
    methods: {
      async getBrandList (key) {
        let res = await this.$http.get('/asset/brand/')
        this.$refs.brandList.setData(res.results, res.count)
      },
      getPerm () {
        console.log('start')
        let perm = JSON.parse(window.sessionStorage.getItem('permission'))
        console.log(perm)
        if (perm.includes('partialupdate_workorder')) {
          this.button_partialupdate_workorder = true
        }
        if (perm.includes('delete_workorder')) {
          this.button_delete_workorder = true
        }
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
  .transfer-footer {
    margin-left: 20px;
    padding: 6px 5px;
  }

</style>
<style>
  .el-dialog__body {
    height: 100%;
  }
</style>

