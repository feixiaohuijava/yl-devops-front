<template>
  <div class="main">
    <div class="wrapper wrapper-content">
      <d-table url="/asset/idc/" ref="idcList" v-if="!showDetail" :conditionForm="condition">
        <template slot="headerRight">
          <el-form-item>
            <el-button icon="el-icon-plus" type="primary" @click="add" v-if="buttonNew">新建</el-button>
          </el-form-item>
        </template>
        <template slot="column">
          <el-table-column label="数据中心">
            <template slot-scope="scope">
              {{ scope.row.name }}
            </template>
          </el-table-column>
          <el-table-column label="备注">
            <template slot-scope="scope">
              {{ scope.row.comment }}
            </template>
          </el-table-column>
          <el-table-column label="创建时间">
            <template slot-scope="scope">
              {{ scope.row.create_at }}
            </template>
          </el-table-column>
          <el-table-column label="修改时间">
            <template slot-scope="scope">
              {{ scope.row.update_at }}
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-dropdown split-button trigger="click" type="primary" @click="getDetailIdc(scope.row.id)" @command="handleCommand">详情
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item :command="'delete.' + scope.row.id" :disabled="!buttonDelete">删除</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </template>
      </d-table>
      <el-dialog title="新建数据中心" :visible.sync="addIdc.visible" width="40%">
        <el-form :model="addIdc.form" ref="addForm" labelWidth="100px">
          <el-form-item prop="name" label="数据中心名" :rules="$newrules.empty">
            <el-input v-model="addIdc.form.name" style="width: 95%"></el-input>
          </el-form-item>
          <el-form-item prop="comment" label="备注">
            <el-input v-model="addIdc.form.comment" type="textarea" :rows="2" placeholder="请输入内容" style="width: 95%"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="addConfirm">确 定</el-button>
          <el-button @click="cancelEdit">取 消</el-button>
        </span>
      </el-dialog>
      <el-dialog title="数据中心详情" :visible.sync="detailGroup.visible" width="40%">
        <el-form :model="detailGroup.form" ref="addForm" labelWidth="100px">
          <el-form-item prop="name" label="数据中心名">
            <el-input v-model=detailIdc.name style="width: 95%"></el-input>
          </el-form-item>
          <el-form-item prop="description" label="备注">
            <el-input v-model=detailIdc.comment type="textarea" :rows="2" placeholder="请输入内容" style="width: 95%"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="updateIdc()" v-if="buttonChange">确 定</el-button>
          <el-button @click="detailGroup.visible = false">取 消</el-button>
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
        editGroup: {visible: false, form: {groupName: '', description: '', groupId: ''}},
        addIdc: {visible: false, form: {name: '', comment: ''}},
        showDetail: false,
        detailId: '',
        detailName: '',
        activeName: '',
        detailGroup: {visible: false, form: {idcName: '', description: '', idcId: ''}},
        detailIdc: '',
        buttonNew: false,
        buttonDelete: false,
        buttonChange: false
      }
    },
    created () {
      this.getPerm()
    },
    methods: {
      async updateIdc () {
        console.log('start updateIdc')
        const param = {
          'id': this.detailIdc.id,
          'name': this.detailIdc.name,
          'comment': this.detailIdc.comment
        }
        let res = await this.$http.patch_idc(param)
        this.detailGroup.visible = false
        this.getIdcList()
      },
      async getDetailIdc (id) {
        this.detailGroup.visible = true
        const param = {
          'id': id
        }
        let res = await this.$http.get_detail_idc(param)
        this.detailIdc = res
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
      deleteIDC (id) {
        this.$confirm('确认删除?', '提示', {type: 'warning'}).then(async () => {
          let res = await this.$http.delete_idc({'id': id})
          if (res.hasOwnProperty('msg') !== true) {
            this.$message.success('删除成功')
          }
          this.getIdcList()
        }).catch(_ => {})
      },
      add () {
        this.addIdc.visible = true
        this.addIdc.form = {name: '', comment: ''}
      },
      addConfirm () {
        this.$refs.addForm.validate(async v => {
          if (v) {
            let res = await this.$http.add_idc(this.addIdc.form)
            this.$message.success('新增成功')
            this.addIdc.visible = false
            this.getIdcList()
            // if (res.code === 4000) {
            //   this.$message.success('新增成功')
            //   this.addGroup.visible = false
            //   this.$refs.tableList.getData()
            // } else {
            //   this.$message.warning(res.msg)
            // }
          }
        })
      },
      edit (item) {
        this.editGroup = {visible: true, form: {groupName: item.SecurityGroupName, description: item.SecurityGroupDesc, groupId: item.SecurityGroupId}}
      },
      editConfirm () {
        this.$refs.editForm.validate(async v => {
          if (v) {
            let res = await this.$http.updateSafeGroup(this.editGroup.form)
            if (res.code === 4000) {
              this.$message.success(res.data.msg)
              this.editGroup.visible = false
              this.$refs.tableList.getData()
            } else {
              this.$message.warning(res.msg)
            }
          }
        })
      },
      cancelEdit () {
        this.addIdc.visible = false
      },
      async getIdcList (key) {
        let res = await this.$http.get('/asset/idc/')
        console.log('res getIdcList', res.results)
        this.$refs.idcList.setData(res.results, res.count)
      },
      getPerm () {
        let perm = JSON.parse(window.sessionStorage.getItem('permission'))
        if (perm.includes('add_idc')) {
          this.buttonNew = true
        }
        if (perm.includes('delete_idc')) {
          this.buttonDelete = true
        }
        if (perm.includes('change_idc')) {
          this.buttonChange = true
        }
      },
      handleCommand (command) {
        let list = command.split('.')
        if (list[0] === 'delete') {
          this.deleteIDC(list[1])
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
