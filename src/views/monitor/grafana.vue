<template>
  <div class="main">
    <div class="wrapper wrapper-content">
      <iframe :src="src" ref="iframe" height="900px" width="100%"></iframe>
    </div>
  </div>
</template>




<script>
  // import SafeDetail from './SaveDetail.vue'
  export default {
    data () {
      return {
        src: '',
        iframeWin: {}
      }
    },
    created () {
      this.get_trace_sign_token()
    },
    mounted () {
      this.iframeWin = this.$refs.iframe.contentWindow
      this.$nextTick(() => {
        // 在外部 Vue 的 window 上添加 postMessage 的监听，并且绑定处理函数 handleMessage
        window.addEventListener('message', this.handleMessage)
      })
    },
    destroyed () {
      // 注意移除监听！注意移除监听！注意移除监听！
      window.removeEventListener('message', this.handleMessage)
    },
    methods: {
      async get_trace_sign_token () {
        this.src = 'http://192.168.1.250:3000/login'
        console.log(this.src)
      },
      sendMessage () {
        // 外部vue向iframe内部传数据
        this.iframeWin.postMessage({
          cmd: 'doSomething',
          params: {}
        }, '*')
      },
      handleMessage (event) {
      // 根据上面制定的结构来解析 iframe 内部发回来的数据
        const data = event.data
        console.log('data', data)
        switch (data.cmd) {
          case 'ready-for-receiving':
            // 业务逻辑
            break
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
</style>
