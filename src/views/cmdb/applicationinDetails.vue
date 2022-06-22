<template>
  <div class="main">
    <el-button
      icon="el-icon-back"
      type="primary"
      @click="routerBack"
      class="back-btn"
      >返回</el-button
    >
    <div class="wrapper wrapper-content" v-loading="editGroupLoading">
      <el-form class="form-details" labelWidth="50px">
        <!--@visible-change="onSelectChangeProject($event)" -->
        <el-form-item label="项目名">
          <el-select
            placeholder="请选择项目"
            clearable
            v-model="searchProject"
            style="width:200px"
          >
            <el-option
              v-for="item in projectList"
              :key="item.id"
              :value="item.id"
              :label="item.projectName"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="环境">
          <el-select
            placeholder="请选择环境"
            clearable
            @visible-change="onSelectChnageEnvironment($event)"
            v-model="searchEnvironment"
            style="width:160px"
          >
            <el-option
              v-for="item in environmentListSelect"
              :key="item.id"
              :value="item.id"
              :label="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" type="primary" @click="onSearchValue"
            >查询</el-button
          >
        </el-form-item>
        <el-form-item prop="choiceEs" label="ES" class="es-form-item">
          <!-- 二级联动选择器 -->
          <el-cascader
            v-model="searchIndex"
            :props="props"
            placeholder="请选择ES"
            clearable
            :show-all-levels="true"
            style="width:400px"
          ></el-cascader>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" type="primary" @click="onSearchValue"
            >查询</el-button
          >
        </el-form-item>
      </el-form>
      <div class="edit_dev">
        <el-transfer
          v-model="transferValue"
          :data="transferData"
          @change="onTransfer"
        ></el-transfer>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      transferValue: [],
      transferData: [],
      searchProject: 6,
      searchEnvironment: null,
      showDetail: false,
      editGroupLoading: false,
      condition: null,
      projectList: [],
      environmentListSelect: [],
      searchIndex: '',
      props: {
        expandTrigger: 'hover',
        lazy: true,
        lazyLoad: this.lazyLoad
      }
    }
  },
  created () {
    this.onSelectChangeProject(true)
    // this.getApplication()
    this.onSearchValue()
  },
  mounted () {
    document.onkeydown = event => {
      var code = event.keyCode
      if (code === 13) {
        this.onSearchValue()
      }
    }
  },
  methods: {
    // 二级联动选择器
    lazyLoad (node, resolve) {
      this.getData(node, resolve)
    },
    async getData (node, resolve) {
      const level = node.level
      let result = []
      if (level === 0) {
        let elasticList = await this.$http.get_elasticsearchviewset()
        elasticList.results.forEach(item => {
          result.push({
            value: item.id,
            label: item.name
          })
        })
      }
      if (level === 1) {
        const param = { elasticSearch: node.label }
        let resChildren = await this.$http.get_searchindexviewset(param)
        resChildren.results.forEach(item => {
          result.push({
            value: item.id,
            label: item.name
          })
        })
      }
      resolve(result)
    },
    // 项目列表
    async onSelectChangeProject (callback) {
      this.projectList = []
      if (callback) {
        let resProject = await this.$http.getProjectApi()
        this.projectList = resProject.results
      }
    },
    //环境列表
    async onSelectChnageEnvironment (callback) {
      this.environmentListSelect = []
      if (callback) {
        const param = { type: '应用' }
        let resEnvironment = await this.$http.getEnvironmentApi(param)
        this.environmentListSelect = resEnvironment.results
      }
    },
    async getCheckList (val) {
      this.checkList = []
      val.map(item => {
        this.checkList.push(item.id)
      })
    },
    // 筛选
    async onSearchValue () {
      let param = {}
      this.transferData = []
      param = {
        project: this.searchProject,
        environment: this.searchEnvironment
      }
      let res = await this.$http.searchApplicationApi(param)
      res.results = res.results.sort((a, b) =>
        a.applicationName.localeCompare(b.applicationName)
      )
      res.results.forEach(item => {
        this.transferData.push({
          key: item.id,
          label: item.applicationName
        })
      })
    },
    // 返回上一级
    routerBack () {
      this.$router.back()
    },
    // 选中
    onTransfer (val) {
      console.log(this.transferValue)
    }
  }
}
</script>
<style scoped>
.form-details {
  display: flex;
}
.back-btn {
  margin-top: 20px;
  margin-left: 20px;
}
.es-form-item {
  margin-left: 100px;
}
.edit_dev >>> .el-transfer-panel {
  width: 700px;
  height: 800px;
}
.edit_dev >>> .el-transfer-panel__body {
  width: 700px;
  height: 800px;
}
.edit_dev >>> .el-transfer-panel__list {
  width: 700px;
  height: 800px;
}
</style>
