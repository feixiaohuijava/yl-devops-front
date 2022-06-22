<template>
  <div class="app-container documentation-container">
    <router-link class="document-btn" :to="{name:'servicecomponent_prometheus'}">prometheus</router-link>
    <router-link class="document-btn" :to="{name:'servicecomponent_alertmanager'}">alertmanager</router-link>
    <router-link class="document-btn" :to="{name:'servicecomponent_grafana'}">grafana</router-link>
  </div>
</template>

<script>
    export default {
        data() {
            return {}
        }
    }
</script>

<style lang="less" scoped>
  .documentation-container {
    margin: 50px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;

    .document-btn {
      flex-shrink: 0;
      display: block;
      cursor: pointer;
      background: grey;
      color: white;
      height: 60px;
      width: 200px;
      margin-bottom: 16px;
      line-height: 60px;
      font-size: 20px;
      text-align: center;
    }
  }
</style>