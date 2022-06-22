<template>
  <div class="main">
    <div class="wrapper wrapper-content">
      <d-table url="/salt_openstack/typeenvironment/" ref="typeEnvironmenList" v-if="!showDetail"
               :conditionForm="condition">
        <template slot="headerRight">
          <el-form-item>
            <el-button icon="el-icon-plus" type="primary" @click="add">新建</el-button>
          </el-form-item>
        </template>
        <template slot="column">
          <el-table-column label="环境名称">
            <template slot-scope="scope">
              {{ scope.row.type_environment_name }}
            </template>
          </el-table-column>
          <el-table-column label="创建人">
            <template slot-scope="scope">
              {{ scope.row.create_by }}
            </template>
          </el-table-column>
          <el-table-column label="创建时间">
            <template slot-scope="scope">
              {{ scope.row.create_time }}
            </template>
          </el-table-column>
          <el-table-column label="修改时间">
            <template slot-scope="scope">
              {{ scope.row.update_time }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="400px">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="pathToComponentName(scope.row.id)">组件列表</el-button>
              <el-button size="mini" type="primary" @click="pathToHost(scope.row.id)">主机列表</el-button>
              <el-button size="mini" type="primary" @click="startDeploy(scope.row)">部署</el-button>
              <!--<el-button size="mini" type="primary" @click="edit(scope.row.id)">详情</el-button>-->
              <el-button size="mini" type="danger" @click="deleteSafeGroup(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </template>
      </d-table>
      <el-dialog title="新建openstack环境" :visible.sync="addGroup.visible" width="40%">
        <el-form :model="addGroup.form" ref="addForm" labelWidth="100px">
          <el-form-item prop="type_environment_name" label="环境名" :rules="$newrules.empty">
            <el-input v-model="addGroup.form.type_environment_name"></el-input>
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
        condition: null,
        groupId: '',
        groupName: '',
        editGroup: {visible: false, form: {id: '', groupName: '', description: '', groupId: ''}},
        addGroup: {visible: false, form: {type_environment_name: ''}},
        showDetail: false,
        detailId: '',
        detailName: '',
        activeName: ''
      }
    },
    created () {
      // this.getLocationList()
    },
    methods: {
      startDeploy (row) {
        this.$router.push({name: '部署', params: {row: row}})
      },
      pathToComponentName (id) {
        this.$router.push({name: '部署组件', params: {type_environment_name: id}})
      },
      pathToHost (id) {
        this.$router.push({name: '环境主机', params: {type_environment_name: id}})
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
          await this.$http.delete_typeenvironment({id: id})
          this.$message.success('删除成功')
          this.$refs.typeEnvironmenList.getData()
        })
      },
      add () {
        this.addGroup.visible = true
        this.addGroup.form = {'type_environment_name': ''}
      },
      addConfirm () {
        this.$refs.addForm.validate(async v => {
          if (v) {
            const param = {
              'type_environment_name': this.addGroup.form.type_environment_name,
              'create_by': window.sessionStorage.getItem('username')
            }
            let res = await this.$http.add_typeenvironment(param)
            this.addGroup.visible = false
            this.$refs.typeEnvironmenList.getData()
          }
        })
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
