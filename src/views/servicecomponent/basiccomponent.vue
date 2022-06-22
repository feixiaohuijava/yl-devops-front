<template>
  <div class="app-container documentation-container">
    <div class="title">
      <h1>cdn:</h1>
      <router-link class="document-btn" :to="{ name: 'servicecomponent_cdn' }"
        >cdn</router-link
      >
    </div>
    <div class="title">
      <h1>负载均衡:</h1>
      <router-link class="document-btn" :to="{ name: 'servicecomponent_slb' }"
        >slb</router-link
      >
      <router-link
        class="document-btn"
        :to="{ name: 'servicecomponent_slbbackservers' }"
        >slbbackservers</router-link
      >
    </div>
    <div class="title">
      <h1>弹性伸缩:</h1>
      <router-link
        class="document-btn"
        :to="{ name: 'servicecomponent_autoscaling' }"
        >弹性伸缩</router-link
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
    line-height: 60px;
    font-size: 20px;
    text-align: center;
    margin-left: 30px;
  }
  .title {
    margin-bottom: 30px;
    display: flex;
    text-align: center;
    h1 {
      line-height: 60px;
      margin: 0px;
    }
  }
}
</style>
