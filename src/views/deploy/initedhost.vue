<template>
  <div class="main">
    <div class="wrapper wrapper-content">
      <div>
        <el-button icon="el-icon-plus" type="primary" @click="add">新加主机</el-button>
        <el-button class="el-icon-back" icon="el-icon-back" type="primary" @click="goback">返回</el-button>
      </div>
      <el-table :data="environmentHostList" style="width: 100%" border>
        <el-table-column label="环境主机名">
          <template slot-scope="scope">
            {{ scope.row.environment_host.name }}
          </template>
        </el-table-column>
        <el-table-column label="环境类型">
          <template slot-scope="scope">
            {{ scope.row.environment_name.type_environment_name }}
          </template>
        </el-table-column>
        <el-table-column label="角色">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.role === 1" type="success">controller</el-tag>
            <el-tag v-if="scope.row.role === 2" type="warning">ceph</el-tag>
            <el-tag v-if="scope.row.role === 3" type="warning">compute</el-tag>
            <el-tag v-if="scope.row.role === 0" type="warning">saltmaster</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!--<el-button size="mini" type="primary" @click="edit(scope.row.id)">详情</el-button>-->
            <el-button size="mini" type="danger" @click="deleteSafeGroup(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <span class="demonstration"></span>
        <el-pagination
          layout="prev, pager, next"
          :total="50">
        </el-pagination>
      </div>
      <el-dialog title="主机列表" :visible.sync="addGroup.visible" width="80%">
        <el-table :data="initedHost" :fit="true" @row-click="handleCurrentChange" @selection-change="selsChange"
                  ref="table" style="width: 100%" border>
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column label="环境主机名">
            <template slot-scope="scope">
              {{ scope.row.name }}
            </template>
          </el-table-column>
          <el-table-column label="角色">
            <template slot-scope="scope">
              <el-select filterable clearable @visible-change="onSelectChangeRole($event)" v-model="scope.row.role"
                         style="width:160px">
                <el-option v-for="item in roleList" :key="item.id" :value="item.id" :label="item.name"></el-option>
              </el-select>
            </template>
          </el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="addConfirm()" :disabled="this.sels.length === 0">确定</el-button>
          <el-button @click="cancelEdit">取 消</el-button>
      </span>
      </el-dialog>
      <el-dialog title="品牌详情" :visible.sync="editGroup.visible" width="40%">
        <el-form :model="editGroup.form" ref="editForm" labelWidth="100px">
          <el-form-item prop="name" label="品牌名" :rules="$newrules.empty">
            <el-input v-model="editGroup.form.name"></el-input>
          </el-form-item>
          <el-form-item prop="comment" label="备注">
            <el-input v-model="editGroup.form.comment" type="textarea" :rows="2" placeholder="请输入内容"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="editConfirm">确 定</el-button>
          <el-button @click="cancelEdit">取 消</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        sels: [],
        roleId: '',
        roleList: [],
        initedHost: [],
        environmentHostList: [],
        environment_name: '',
        condition: null,
        groupId: '',
        groupName: '',
        editGroup: {visible: false, form: {id: '', groupName: '', description: '', groupId: ''}},
        addGroup: {visible: false, form: {name: '', role: ''}},
        showDetail: false,
        detailId: '',
        detailName: '',
        activeName: ''
      }
    },
    created () {
      this.environment_name = this.$route.params.type_environment_name
      this.getEnvironmentHost()
    },
    methods: {
      async addConfirm (id) {
        console.log('this.sels', this.sels)
        var param = {}
        this.sels.forEach((item) => {
          param = {
            'environment_host': item.id,
            'environment_name': this.environment_name,
            'role': item.role
          }
        })
        console.log('param', param)
        let res = await this.$http.add_environment_host(param)
        this.addGroup.visible = false
        this.getEnvironmentHost()
      },
      selsChange (sels) {
        this.sels = sels
      },
      handleCurrentChange (row, event, column) {
        this.$refs.table.toggleRowSelection(row)
      },
      async onSelectChangeRole (callback) {
        this.roleList = [{'id': '1', 'name': 'controller'}, {'id': '2', 'name': 'ceph'}, {'id': '3', 'name': 'compute'}, {id: '0', name: 'saltmaster'}]
      },
      async goback () {
        this.$router.push({name: '部署环境类型'})
      },
      async getEnvironmentHost () {
        let resEnvironmentHost = await this.$http.get_environment_host({'environment_name': this.environment_name})
        console.log('resEnvironmentHost', resEnvironmentHost)
        this.environmentHostList = resEnvironmentHost.results
      },
      addHost (id) {
        this.$router.push({name: '环境主机', params: {id: id}})
      },
      closeDetail () {
        this.showDetail = false
      },
      showSafeDetail (item, active) {
        this.detailId = item.SecurityGroupId
        this.detailName = item.SecurityGroupName
        this.showDetail = true
        this.activeName = active
      },
      deleteSafeGroup (id) {
        this.$confirm('确认删除?', '提示', {type: 'warning'}).then(async () => {
          await this.$http.delete_environmenthost({id: id})
          this.$message.success('删除成功')
          this.getEnvironmentHost()
        })
      },
      async add () {
        this.addGroup.visible = true
        let resInitedHost = await this.$http.get_host_brief()
        console.log('resInitedHost', resInitedHost)
        this.initedHost = resInitedHost.results
      },
      edit (item) {
        this.editGroup = {visible: true, form: {id: item.id, name: item.name, comment: item.comment}}
      },
      editConfirm () {
        this.$refs.editForm.validate(async v => {
          if (v) {
            const param = {
              'id': this.editGroup.form.id,
              'name': this.editGroup.form.name,
              'comment': this.editGroup.form.comment
            }
            let res = await this.$http.patch_brand(param)
            this.$message.success('修改成功')
            this.editGroup.visible = false
            this.$refs.typeEnvironmenList.getData()
          }
        })
      },
      cancelEdit () {
        this.editGroup = {visible: false, form: {groupName: '', description: '', groupId: ''}}
        this.addGroup = {visible: false, form: {name: '', comment: ''}}
      },
      async gettypeEnvironmenList (key) {
        let res = await this.$http.get_typeEnvironment()
        this.$refs.typeEnvironmenList.setData(res.results, res.count)
      }
    }
  }
</script>
<style scoped lang="less">
  .group-id{
    color: #409EFF;
    cursor: pointer;
  }
  .group-name{
    i{
      font-size: 16px;
      color: #f99;
      &:hover{
        color: #f00;
        font-size: 20px;
      }
    }
  }
  .warning{
    font-size: 12px;
    color: #999;
  }
</style>
