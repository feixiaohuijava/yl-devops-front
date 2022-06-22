<template>
  <div class="main">
    <div class="wrapper wrapper-content">
      <div>
        <d-table url="/asset/host/?initial_status__lt=5" v-if="!showDetail" :conditionForm="condition">
          <template slot="column">
            <el-table-column label="主机名称">
              <template slot-scope="scope">
                {{ scope.row.name }}
              </template>
            </el-table-column>
            <el-table-column label="管理IP">
              <template slot-scope="scope">
                {{ scope.row.ip }}
              </template>
            </el-table-column>
            <el-table-column label="状态">
              <template slot-scope="scope">
                <div v-if="scope.row.initial_status === 0">未初始化</div>
                <div v-if="scope.row.initial_status === 1">已配置主机名</div>
                <div v-if="scope.row.initial_status === 2">已配置Repo</div>
                <div v-if="scope.row.initial_status === 3">已配置网络</div>
                <div v-if="scope.row.initial_status === 4">已安装saltstack</div>
                <div v-if="scope.row.initial_status === 5">已授权salt-minion</div>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="250">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" @click="startInit(scope.row)">初始化</el-button>
              </template>
            </el-table-column>
          </template>
        </d-table>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        condition: null,
        showDetail: false
      }
    },
    methods: {
      startInit (row) {
        if (row.initial_status === 0) {
          this.$router.push({name: '更改主机', params: {id: row.id, name: row.name}})
        } else if (row.initial_status === 1) {
          this.$router.push({name: '更改Repo', params: {id: row.id, name: row.name}})
        } else if (row.initial_status === 2) {
          this.$router.push({name: '网卡配置', params: {id: row.id, name: row.name}})
        } else if (row.initial_status === 3) {
          this.$router.push({name: '安装salt', params: {id: row.id, name: row.name}})
        } else if (row.initial_status === 4) {
          this.$router.push({name: 'salt授权', params: {id: row.id, name: row.name}})
        }
      }
    }
  }
</script>
<style>
</style>
