<template>
  <div class="documentation-container">
    <div class="title">
      <h1>部署中间件:</h1>
      <router-link class="document-btn" :to="{ name: '' }">nginx</router-link>
      <router-link class="document-btn" :to="{ name: '' }">jenkins</router-link>
    </div>
    <div class="title">
      <h1>日志组件:</h1>
      <router-link class="document-btn" :to="{ name: '' }">es</router-link>
      <router-link class="document-btn" :to="{ name: '' }"
        >logstash</router-link
      >
      <router-link class="document-btn" :to="{ name: '' }">kibana</router-link>
    </div>
    <div class="title">
      <h1>消息中间件:</h1>
      <router-link
        class="document-btn"
        :to="{ name: 'servicecomponent_rabbitmq' }"
        >rabbitmq</router-link
      >
      <router-link class="document-btn" :to="{ name: '' }">kafka</router-link>
      <router-link class="document-btn" :to="{ name: '' }"
        >rocketmq</router-link
      >
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {}
  }
}
</script>

<style lang="less" scoped>
.documentation-container {
  margin: 50px;
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  justify-content: space-evenly;

  .document-btn {
    flex-shrink: 0;
    display: block;
    cursor: pointer;
    background: grey;
    color: white;
    height: 60px;
    width: 200px;
    margin-left: 30px;
    line-height: 60px;
    font-size: 20px;
    text-align: center;
  }
  .title {
    display: flex;
    margin-bottom: 30px;
    h1 {
      margin: 0px;
      line-height: 60px;
    }
  }
}
</style>
