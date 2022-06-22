<template>
  <div class="main">
    <div class="wrapper wrapper-content">
      <div>
        <el-button icon="el-icon-plus" type="primary" @click="add">新增脚本</el-button>
        <el-button icon="el-icon-back" type="primary" @click="goback">返回</el-button>
      </div>
      <el-table :data="resComponentnameSls" style="width: 100%" border>
        <el-table-column label="组件名">
          <template slot-scope="scope">
            {{ scope.row.sls_name.component_name }}
          </template>
        </el-table-column>
        <el-table-column label="脚本内容">
          <template slot-scope="scope">
            {{ scope.row.sls_content }}
          </template>
        </el-table-column>
        <el-table-column label="脚本优先级">
          <template slot-scope="scope">
            {{ scope.row.sls_priority }}
          </template>
        </el-table-column>
        <el-table-column label="创建时间">
          <template slot-scope="scope">
            {{ scope.row.create_time }}
          </template>
        </el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
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
      <el-dialog class="time-dialog" title="增加组件脚本" :visible.sync="addGroup.visible" width="34%">
        <el-form :model="addGroup.form" ref="addForm" labelWidth="100px">
          <el-form-item prop="create_by" label="组件脚本内容">
            <el-input v-model="addGroup.form.content" placeholder="请输入创建人"></el-input>
          </el-form-item>
          <el-form-item prop="create_by" label="脚本优先级">
            <el-input v-model="addGroup.form.priority" placeholder="请输入脚本优先级"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="addConfirm">确 定</el-button>
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
        type_environment_name_id: '',
        roleId: '',
        roleList: [],
        initedHost: [],
        resComponentnameSls: [],
        sls_name: '',
        condition: null,
        groupId: '',
        groupName: '',
        editGroup: {visible: false, form: {id: '', groupName: '', description: '', groupId: ''}},
        addGroup: {visible: false, form: {content: '', priority: ''}},
        showDetail: false,
        detailId: '',
        detailName: '',
        activeName: ''
      }
    },
    created () {
      this.sls_name = this.$route.params.id
      this.type_environment_name_id = this.$route.params.type_environment_name_id
      this.getComponentSlsList()
    },
    methods: {
      async addConfirm () {
        const param = {
          'sls_name': this.sls_name,
          'sls_content': this.addGroup.form.content,
          'sls_priority': this.addGroup.form.priority,
          'type_enviroment_name_id': this.type_environment_name_id
        }
        console.log(param)
        await this.$http.add_componentname_sls(param)
        this.addGroup.visible = false
        this.getComponentSlsList()
      },
      selsChange (sels) {
        this.sels = sels
      },
      handleCurrentChange (row, event, column) {
        this.$refs.table.toggleRowSelection(row)
      },
      async onSelectChangeRole (callback) {
        this.roleList = [{'id': '1', 'name': 'controller'}, {'id': '2', 'name': 'ceph'}, {'id': '3', 'name': 'compute'}]
      },
      async goback () {
        this.$router.push({name: '部署组件'})
      },
      async getComponentSlsList () {
        let resComponentnameSls = await this.$http.get_componentname_sls({'sls_name': this.sls_name})
        console.log('resComponentnameSls', resComponentnameSls)
        this.resComponentnameSls = resComponentnameSls.results
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
          await this.$http.delete_componentname_sls({id: id})
          this.$message.success('删除成功')
          this.getComponentSlsList()
        })
      },
      async add () {
        this.addGroup.visible = true
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
