<template>
  <div id="wrapper">
    <e-sider :data="data"></e-sider>
    <div id="page-wrapper" class="gray-bg">
      <e-topbar></e-topbar>
      <!-- <e-tags></e-tags> -->
      <router-view></router-view>
      <e-footer></e-footer>
    </div>
  </div>
</template>

<script>
import { menusApi } from '../api'
export default {
  name: 'layout',
  data: () => {
    return {
      data: []
    }
  },
  components: {
    'e-topbar': require('./layout/topbar').default,
    'e-footer': require('./layout/footer').default,
    'e-sider': require('./layout/sider').default,
    'e-tags': require('../components/Tags').default
  },
  created () {
    menusApi().then(resp => {
      this.data = resp
    })
  }
}
</script>

<style scoped></style>
