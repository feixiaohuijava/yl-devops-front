<template>
  <div class="main">
    <div class="wrapper wrapper-content">
      <el-tabs type="border-card">
        <el-tab-pane label="已授权">
          <el-table
            class="tb-edit"
            v-loading="loading"
            :data="accepted"
            size="small"
            height="500">
            <el-table-column
              prop="minionId"
              label="授权id">
              <template slot-scope="scope">
                <span>{{scope.row.minionId}}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="small" type="primary" @click="revodeSaltKey(scope.row.minionId)">取消授权</el-button>
                <!--<el-button size="small" type="danger" @click="rejectSaltKey(scope.row.minionId)">拒绝</el-button>-->
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="未授权">
          <el-table
            class="tb-edit"
            v-loading="loading"
            :data="unaccepted"
            size="small"
            height="500">

            <el-table-column
              prop="minionId"
              label="未授权id">
              <template slot-scope="scope">
                <span>{{scope.row.minionId}}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="small" type="primary" @click="saltKeyAuthorize(scope.row.minionId)">授权</el-button>
                <!--<el-button size="small" type="danger" @click="rejectSaltKey(scope.row.minionId)">拒绝</el-button>-->
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="已拒绝(自动)">
          <el-table
            class="tb-edit"
            v-loading="loading"
            :data="denied"
            size="small"
            height="500">

            <el-table-column
              prop="minionId"
              label="已拒绝ID">
              <template slot-scope="scope">
                <span>{{scope.row.minionId}}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <!--<el-button size="small" type="primary" @click="cancelReject(scope.row.minionId)">取消拒绝</el-button>-->
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="已拒绝(手动)">
          <el-table
            class="tb-edit"
            v-loading="loading"
            :data="rejected"
            size="small"
            height="500">

            <el-table-column
              prop="minionId"
              label="已拒绝ID">
              <template slot-scope="scope">
                <span>{{scope.row.minionId}}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <!--<el-button size="small" type="primary" @click="cancelReject(scope.row.minionId)">取消拒绝</el-button>-->
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <div style="text-align: right;padding-top: 10px">
          <el-button type="success" icon="el-icon-refresh" @click="getSaltkeyList">刷新</el-button>
        </div>
      </el-tabs>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        unaccepted: [],
        denied: [],
        rejected: [],
        accepted: [],
        loading: false
      }
    },
    created () {
      this.getSaltkeyList()
    },
    methods: {
      async revodeSaltKey (id) {
        this.$confirm('确认取消?', '提示', {type: 'warning'}).then(async () => {
          this.loading = true
          let res = await this.$http.deleteSaltKey({id: id})
          if (res.hasOwnProperty('msg') !== true) {
            this.$message.success('删除成功')
            this.getSaltkeyList()
          }
          this.loading = false
        })
      },
      async getSaltkeyList () {
        this.accepted = []
        this.unaccepted = []
        this.denied = []
        this.rejected = []
        this.loading = true
        let res = await this.$http.getSaltkeyList()
        if (res.hasOwnProperty('msg') !== true) {
          res.accepted.forEach(value => {
            this.accepted.push({'minionId': value})
          })
          res.unaccepted.forEach(value => {
            this.unaccepted.push({'minionId': value})
          })
          res.denied.forEach(value => {
            this.denied.push({'minionId': value})
          })
          res.rejected.forEach(value => {
            this.rejected.push({'minionId': value})
          })
        }
        this.loading = false
      },
      async saltKeyAuthorize (id) {
        this.loading = true
        let res = await this.$http.saltAuthorize({minion: id})
        if (res.hasOwnProperty('msg') !== true) {
          this.$message.success('授权成功。')
          this.getSaltkeyList()
        }
        this.loading = false
      }
      // async rejectSaltKey (id) {
      //   console.log(id)
      // },
      // async cancelReject (id) {
      //   console.log(id)
      // }
    }
  }
</script>
<style></style>
