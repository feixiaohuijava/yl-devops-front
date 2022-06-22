<template>
  <div class="main">
    <div class="wrapper wrapper-content">
      <d-table
        :url="url"
        ref="brandList"
        v-if="!showDetail"
        :conditionForm="condition"
      >
        <template slot="headerLeft">
          <el-button
            icon="el-icon-back"
            type="primary"
            @click="routerBack"
            class="back-btn"
            >返回</el-button
          >
        </template>
        <template slot="column">
          <el-table-column label="id">
            <template slot-scope="scope">
              {{ scope.row.id }}
            </template>
          </el-table-column>
          <el-table-column label="应用名" width="100px">
            <template slot-scope="scope">
              {{ scope.row.applicationName }}
            </template>
          </el-table-column>
          <el-table-column label="子系统id" width="150px">
            <template slot-scope="scope">
              {{ scope.row.subsystemId }}
            </template>
          </el-table-column>
          <el-table-column label="子系统名" width="150px">
            <template slot-scope="scope">
              {{ scope.row.subsystemname }}
            </template>
          </el-table-column>
          <el-table-column label="子系统中文名" width="150px">
            <template slot-scope="scope">
              {{ scope.row.subsystemNick }}
            </template>
          </el-table-column>
          <el-table-column label="发布工单ID">
            <template slot-scope="scope">
              {{ scope.row.publishOrder }}
            </template>
          </el-table-column>
          <el-table-column label="项目名" width="150px">
            <template slot-scope="scope">
              {{ scope.row.projectName }}
            </template>
          </el-table-column>
          <el-table-column label="Apollo" width="100px">
            <template slot-scope="scope">
              {{ scope.row.apolloFlag }}
            </template>
          </el-table-column>
          <el-table-column label="部署类型" width="100px">
            <template slot-scope="scope">
              {{ scope.row.deployType }}
            </template>
          </el-table-column>
          <el-table-column label="类型" width="100px">
            <template slot-scope="scope">
              {{ scope.row.kind }}
            </template>
          </el-table-column>
          <el-table-column label="创建时间" width="150px">
            <template slot-scope="scope">
              {{ scope.row.createdTime }}
            </template>
          </el-table-column>
          <el-table-column label="修改时间" width="150px">
            <template slot-scope="scope">
              {{ scope.row.updateTime }}
            </template>
          </el-table-column>
        </template>
      </d-table>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      showDetail: false,
      condition: null,
      url: null
    }
  },
  created () {
    this.url =
      '/api/publishmodule/publishordersystemviewset/?publishDuplicate=duplicate'
  },
  methods: {
    // 返回
    routerBack () {
      window.localStorage.setItem('publiPageChange', 1)
      window.localStorage.setItem('retainPage', 1)
      this.$router.go(-1)
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
