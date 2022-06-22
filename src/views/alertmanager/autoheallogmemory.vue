<template>
  <div class="main">
    <div class="wrapper wrapper-content">
      <d-table url="/api/webhookmanager/autohealviewset/" ref="brandList" v-if="!showDetail" :conditionForm="condition">
        <template slot="headerRight">
          <el-form-item>
            <el-button icon="el-icon-plus" type="primary" @click="add" v-if="buttonNew">新建</el-button>
          </el-form-item>
        </template>
        <template slot="column">
          <el-table-column label="id" width="80px">
            <template slot-scope="scope">
              {{ scope.row.id }}
            </template>
          </el-table-column>
          <el-table-column label="alerts" width="700px">
            <template slot-scope="scope">
              {{ scope.row.alerts }}
            </template>
          </el-table-column>
          <el-table-column label="套餐名" width="100px">
            <template slot-scope="scope">
              {{ scope.row.autohealPackage.healName }}
            </template>
          </el-table-column>
          <el-table-column label="状态" width="80px">
            <template slot-scope="scope">
              <div v-if="scope.row.heal_flag === 'success'">
                <el-tag type="success"> 成功</el-tag>
              </div>
              <div v-if="scope.row.heal_flag ==='failed'">
                <el-tag type="danger">失败</el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="healResult" width="420px">
            <template slot-scope="scope">
              {{ scope.row.healResult }}
            </template>
          </el-table-column>
          <el-table-column label="createdTime" width="150px">
            <template slot-scope="scope">
              {{ scope.row.createdTime }}
            </template>
          </el-table-column>
<!--          <el-table-column label="操作" width="180px">-->
<!--            <template slot-scope="scope">-->
<!--              <el-dropdown split-button trigger="click" type="primary" @click="edit(scope.row)" @command="handleCommand">详情-->
<!--                <el-dropdown-menu slot="dropdown">-->
<!--                  <el-dropdown-item :command="'delete.' + scope.row.id" :disabled="!buttonDelete">删除</el-dropdown-item>-->
<!--                </el-dropdown-menu>-->
<!--              </el-dropdown>-->
<!--            </template>-->
<!--          </el-table-column>-->
        </template>
      </d-table>
      <el-dialog title="新建品牌" :visible.sync="addGroup.visible" width="40%">
        <el-form :model="addGroup.form" ref="addForm" labelWidth="100px">
          <el-form-item prop="name" label="品牌名" :rules="$newrules.empty">
            <el-input v-model="addGroup.form.name" style="width: 95%"></el-input>
          </el-form-item>
          <el-form-item prop="comment" label="备注">
            <el-input v-model="addGroup.form.comment" type="textarea" :rows="2" placeholder="请输入内容" style="width: 95%"></el-input>
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
            <el-input v-model="editGroup.form.name" style="width: 95%"></el-input>
          </el-form-item>
          <el-form-item prop="comment" label="备注">
            <el-input v-model="editGroup.form.comment" type="textarea" :rows="2" placeholder="请输入内容" style="width: 95%"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="editConfirm" v-if="buttonChange">确 定</el-button>
          <el-button @click="cancelEdit">取 消</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  // import SafeDetail from './SaveDetail.vue'
  export default {
    data () {
      return {
        idcId: '',
        machineroomId: '',
        cabinetId: '',
        idcList: [],
        machineroomList: [],
        cabinetList: [],
        condition: null,
        groupId: '',
        groupName: '',
        editGroup: {visible: false, form: {id: '', groupName: '', description: '', groupId: ''}},
        addGroup: {visible: false, form: {name: '', comment: ''}},
        showDetail: false,
        detailId: '',
        detailName: '',
        activeName: '',
        buttonNew: false,
        buttonDelete: false,
        buttonChange: false
      }
    },
    created () {
      // this.getPerm()
    },
    methods: {
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
          await this.$http.delete_brand({id: id})
          this.$message.success('删除成功')
          this.$refs.brandList.getData()
        }).catch(_ => {})
      },
      add () {
        this.addGroup.visible = true
      },
      addConfirm () {
        this.$refs.addForm.validate(async v => {
          if (v) {
            const param = {
              'name': this.addGroup.form.name,
              'comment': this.addGroup.form.comment
            }
            let res = await this.$http.add_brand(param)
            this.addGroup.visible = false
            this.$refs.brandList.getData()
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
            this.$refs.brandList.getData()
          }
        })
      },
      cancelEdit () {
        this.editGroup = {visible: false, form: {groupName: '', description: '', groupId: ''}}
        this.addGroup = {visible: false, form: {name: '', comment: ''}}
      },
      async getBrandList (key) {
        let res = await this.$http.get('/asset/brand/')
        this.$refs.brandList.setData(res.results, res.count)
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
