<template>
  <div class="main">
    <div class="wrapper wrapper-content">
      <el-form :model="detailGroup" labelWidth="100px">
        <el-form-item prop="id" label="id">
          <el-input v-model="detailGroup.id" style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item prop="applicationName" label="应用名">
          <el-input
            v-model="detailGroup.applicationName"
            style="width: 200px"
          ></el-input>
        </el-form-item>
        <el-form-item prop="environment" label="环境">
          <div v-if="detailGroup.environment !== null">
            <el-input
              v-model="detailGroup.environment.name"
              style="width: 200px"
            ></el-input>
          </div>
        </el-form-item>
        <el-form-item prop="namespace" label="命名空间">
          <div v-if="detailGroup.namespace !== null">
            <el-input
              readonly
              v-model="detailGroup.namespace.namespaceName"
              style="width: 200px"
            ></el-input>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      application_id: null,
      detailGroup: {
        id: null,
        applicationName: null,
        environment: null,
        namespace: null
      },
      buttonChange: false
    }
  },
  created () {
    this.application_id = this.$route.params.id
    this.getDetailApplicationIntance()
  },
  methods: {
    async getDetailApplicationIntance () {
      const param = { id: this.application_id }
      let res = await this.$http.getDetailApplicationApi(param)
      this.detailGroup = res.results
      console.log(this.detailGroup)
    },
    getPerm () {
      let perm = JSON.parse(window.sessionStorage.getItem('permission'))
      if (perm.includes('add_brand')) {
        this.buttonNew = true
      }
      if (perm.includes('delete_brand')) {
        this.buttonDelete = true
      }
      if (perm.includes('change_brand')) {
        this.buttonChange = true
      }
    },
    handleCommand (command) {
      let list = command.split('.')
      if (list[0] === 'delete') {
        this.deleteSafeGroup(list[1])
      }
    }
  }
}
</script>
<style scoped lang="less">
.group-id {
  color: #409eff;
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
