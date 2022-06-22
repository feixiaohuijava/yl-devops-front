<template>
  <div class="main">
    <div class="wrapper wrapper-content">
      <h1 >公告:</h1>
      <h3>平台bug或者建议改进,请联系运维费晓晖</h3>
      <h3>账号授权,请联系费晓晖, 陈贵珍</h3>
      <br>
      <h1 >FAQ:</h1>
      <h1>1 如果授权之后,为啥还没有出现菜单栏?</h1>
      <h3> 授权之后需要重新退出方可获取相应权限</h3>
      <h1>2 运维平台升级之后,发现页面不一致</h1>
      <h3> 运维平台升级之后,需要本地浏览器重新加载js,css等文件,需要用户手动刷新地址栏页面即可！</h3>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
      }
    },
    created () {
    },
    methods: {
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
