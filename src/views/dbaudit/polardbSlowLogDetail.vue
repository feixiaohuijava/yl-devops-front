<template>
  <div class="main">
    <div class="wrapper wrapper-content">
      <el-table :data="tableData" >
        <el-table-column prop="DBName" label="库名" width="150">
        </el-table-column>
        <el-table-column prop="SQLText" label="SQL语句" width="1040px">
        </el-table-column>
        <el-table-column prop="MaxExecutionTime" label="执行时间" width="150px">
        </el-table-column>
        <el-table-column prop="project" label="项目组" width="150px">
        </el-table-column>
        <el-table-column prop="principal" label="负责人" width="150px">
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
    export default {
        data() {
            return {
                tableData: []
            }
        },
        created() {
            this.tableData = this.$route.params.topTenSlowLogs
            console.log(this.tableData)
        },
        methods: {}
    }
</script>
<style scoped lang="less">
  .group-id {
    color: #409EFF;
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
