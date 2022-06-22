<template>
  <div class="main">
    <div class="wrapper wrapper-content">
      <el-form :model="detailGroup" labelWidth="100px">
        <el-form-item prop="id" label="id">
          <el-input v-model="detailGroup.id" style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item prop="LoadBalancerId" label="slbId">
          <el-input v-model="detailGroup.LoadBalancerId" style="width: 400px"></el-input>
        </el-form-item>
        <el-form-item prop="LoadBalancerName" label="name">
          <el-input v-model="detailGroup.LoadBalancerName" style="width: 400px"></el-input>
        </el-form-item>
      </el-form>
      <el-table :data="detailGroup.BackendServers" style="width: 100%">
          <el-table-column label="id">
              <template slot-scope="scope">
                {{ scope.row.id }}
              </template>
          </el-table-column>
          <el-table-column label="ServerId">
            <template slot-scope="scope">
              {{ scope.row.ServerId }}
            </template>
          </el-table-column>
          <el-table-column label="Type">
            <template slot-scope="scope">
              {{ scope.row.Type }}
            </template>
          </el-table-column>
          <el-table-column label="Weight">
            <template slot-scope="scope">
               <el-input size="small" v-model="scope.row.Weight" placeholder="请输入内容" style="width: 100px">{{scope.row.Weight}}</el-input>
               <el-button type="primary" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
            </template>
          </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
    export default {
        data() {
            return {
                detailGroup: {id: null, LoadBalancerId: null, LoadBalancerName: null, BackendServers: null},
                buttonChange: false,
                Weight: null,
            }
        },
        created() {
            this.detailGroup.id = this.$route.params.row.id
            this.detailGroup.LoadBalancerId = this.$route.params.row.LoadBalancerId
            this.detailGroup.LoadBalancerName = this.$route.params.row.LoadBalancerName
            this.getDetailSlbAttribute(this.detailGroup.id)
        },
        methods: {
            async handleEdit (index, row){
                if (row.Weight === this.Weight) {
                    this.$message.info("没有修改!")
                } else {
                    this.$confirm('确认修改?', '提示', {type: 'warning'}).then(async () => {
                        const param = {id: row.id, ServerId: row.ServerId, Weight: row.Weight}
                        let res = await this.$http.patchslbbsweight(param)
                        this.$message.success("修改成功!")
                    })
                }
            },
            async getDetailSlbAttribute(id) {
                const param = {cloudSlb: id}
                let res = await this.$http.getslbattributeapi(param)
                this.detailGroup.BackendServers = res.results
            },
            getPerm() {
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
            handleCommand(command) {
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
