<template>
    <e-sider :data="data"></e-sider>
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
    'e-sider': require('./layout/sider').default
  },
  created () {
    menusApi().then((resp) => {
      this.data = resp.data
    })
  }
}
</script>

<style scoped>

</style>

