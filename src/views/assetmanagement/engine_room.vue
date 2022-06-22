<template>
  <div class="main">
    <div class="wrapper wrapper-content">
      <d-table url="/asset/machineroom/" ref="machineroomList" v-if="!showDetail" :conditionForm="condition">
        <template slot="headerRight">
          <el-form-item>
            <el-button icon="el-icon-plus" type="primary" @click="add" v-if="buttonNew">新建</el-button>
          </el-form-item>
        </template>
        <template slot="column">
          <el-table-column label="机房名称">
            <template slot-scope="scope">
              {{ scope.row.name }}
            </template>
          </el-table-column>
          <el-table-column label="数据中心">
            <template v-if="scope.row.idc != null" slot-scope="scope">
              {{ scope.row.idc.name }}
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
              <el-dropdown split-button trigger="click" type="primary" @click="openMashroomDetail(scope.row.id)" @command="handleCommand">详情
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item :command="'delete.' + scope.row.id" :disabled="!buttonDelete">删除</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </template>
      </d-table>
      <el-dialog title="新建机房" :visible.sync="addGroup.visible" width="40%">
        <el-form :model="addGroup.form" ref="addForm" labelWidth="100px">
          <el-form-item prop="name" label="机房名" :rules="$newrules.empty">
            <el-input v-model="addGroup.form.name" style="width: 95%"></el-input>
          </el-form-item>
          <el-form-item prop="数据中心" label="数据中心:">
            <el-select v-model="addGroup.form.idc" style="width:160px">
              <el-option v-for="item in idcList" :key="item.id" :value="item.id" :label="item.name"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="comment" label="备注">
            <el-input v-model="addGroup.form.comment" type="textarea" :rows="2" placeholder="请输入内容" style="width: 95%"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="addConfirm">确 定</el-button>
          <el-button @click="addGroup.visible = false">取 消</el-button>
        </span>
      </el-dialog>
      <el-dialog title="机房详情" :visible.sync="detailGroup.visible" width="40%">
        <el-form :model="detailGroup.form" ref="addForm" labelWidth="100px">
          <el-form-item prop="name" label="机房名" :rules="$newrules.empty">
            <el-input v-if="detailGroup.form.name != null" v-model="detailGroup.form.name" style="width: 95%"></el-input>
          </el-form-item>
          <el-form-item prop="数据中心" label="数据中心:">
            <el-select v-if="detailGroup.form.idc != null" v-model="detailGroup.form.idc.id"
                       style="width:160px">
              <el-option v-for="item in idcList" :key="item.id" :value="item.id" :label="item.name"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="comment" label="备注">
            <el-input v-if="detailGroup.form.comment != null" v-model="detailGroup.form.comment" type="textarea"
                      :rows="2" placeholder="请输入内容" style="width: 95%"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="updateConfirm()" v-if="buttonChange">确 定</el-button>
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
        detailGroup: {visible: false, form: {id: '', name: '', comment: '', idc: {id: '', name: ''}}},
        addGroup: {visible: false, form: {name: '', comment: '', idc: ''}},
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
      this.getPerm()
    },
    methods: {
      async deleteMashroomDetail (id) {
        this.$confirm('确认删除?', '提示', {type: 'warning'}).then(async () => {
          const param = {
            'id': id
          }
          let res = await this.$http.delete_machine_room(param)
          this.$message.success('删除成功')
          this.getMachineroomList()
        }).catch(_ => {})
      },
      async updateConfirm () {
        const param = {
          'id': this.detailGroup.form.id,
          'name': this.detailGroup.form.name,
          'comment': this.detailGroup.form.comment,
          'idc': this.detailGroup.form.idc.id
        }
        let res = await this.$http.patch_machineroom(param)
        this.detailGroup.visible = false
        this.$message.success('修改成功')
        this.getMachineroomList()
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
          let res = await this.$http.delSafeGroup({groupId: id})
          if (res.code === 4000) {
            this.$message.success('删除成功')
            this.$refs.tableList.getData()
          } else {
            this.$message.warning(res.msg)
          }
        })
      },
      async add () {
        this.addGroup.visible = true
        this.addGroup.form = {name: '', comment: '', idc: ''}
        let res = await this.$http.get_idc_list()
        this.idcList = res.results
      },
      addConfirm () {
        this.$refs.addForm.validate(async v => {
          if (v) {
            let res = await this.$http.add_machine(this.addGroup.form)
            this.$message.success('新增成功')
            this.addGroup.visible = false
            this.getMachineroomList()
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
        this.editGroup = {visible: false, form: {groupName: '', description: '', groupId: ''}}
        this.addGroup = {visible: false, form: {groupName: '', description: '', projectId: ''}}
      },
      async openMashroomDetail (id) {
        this.detailGroup.visible = true
        const param = {
          'id': id
        }
        let resDetailMachineroom = await this.$http.get_detail_machineroom(param)
        this.detailGroup.form = resDetailMachineroom
        if (this.detailGroup.form.idc == null) {
          this.detailGroup.form.idc = {'id': null, 'name': null}
        }
        let resIdcList = await this.$http.get_idc_list()
        this.idcList = resIdcList.results
      },
      async getMachineroomList (key) {
        let res = await this.$http.get('/asset/machineroom/')
        this.$refs.machineroomList.setData(res.results, res.count)
      },
      getPerm () {
        let perm = JSON.parse(window.sessionStorage.getItem('permission'))
        if (perm.includes('add_machineroom')) {
          this.buttonNew = true
        }
        if (perm.includes('delete_machineroom')) {
          this.buttonDelete = true
        }
        if (perm.includes('change_machineroom')) {
          this.buttonChange = true
        }
      },
      handleCommand (command) {
        let list = command.split('.')
        if (list[0] === 'delete') {
          this.deleteMashroomDetail(list[1])
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
