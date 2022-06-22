<template>
  <div class="main">
    <div class="wrapper wrapper-content">
      <d-table url="/asset/cabinet/" ref="cabinetList" v-if="!showDetail" :conditionForm="condition">
        <template slot="headerRight">
          <el-form-item>
            <el-button icon="el-icon-plus" type="primary" @click="add" v-if="buttonNew">新建</el-button>
          </el-form-item>
        </template>
        <template slot="column">
          <el-table-column label="机柜名称">
            <template slot-scope="scope">
              {{ scope.row.name }}
            </template>
          </el-table-column>
          <el-table-column label="机房名称" width="200">
            <template v-if="scope.row.machine_room != null" slot-scope="scope">
              {{ scope.row.machine_room.name }}
            </template>
          </el-table-column>
          <el-table-column label="备注">
            <template slot-scope="scope">
              {{ scope.row.comment }}
            </template>
          </el-table-column>
          <el-table-column label="创建时间" width="200">
            <template slot-scope="scope">
              {{ scope.row.create_at }}
            </template>
          </el-table-column>
          <el-table-column label="修改时间" width="200">
            <template slot-scope="scope">
              {{ scope.row.update_at }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="250">
            <template slot-scope="scope">
              <el-dropdown split-button trigger="click" type="primary" @click="openDetail(scope.row)" @command="handleCommand">详情
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item :command="'delete.' + scope.row.id" :disabled="!buttonDelete">删除</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </template>
      </d-table>
      <el-dialog title="新建机柜" :visible.sync="addGroup.visible" width="40%">
        <el-form :model="addGroup.form" ref="addForm" labelWidth="100px">
          <el-form-item prop="name" label="机柜名" :rules="$newrules.empty">
            <el-input v-model="addGroup.form.name" style="width: 95%"></el-input>
          </el-form-item>
          <el-form-item prop="机房中心" label="机房中心:">
            <el-select v-model="addGroup.form.machine_room" style="width:160px">
              <el-option v-for="item in machineroomList" :key="item.id" :value="item.id" :label="item.name"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="description" label="备注">
            <el-input v-model="addGroup.form.comment" type="textarea" :rows="2" placeholder="请输入内容" style="width: 95%"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="addConfirm">确 定</el-button>
          <el-button @click="cancelAdd">取 消</el-button>
        </span>
      </el-dialog>
      <el-dialog title="机柜详情" :visible.sync="detailGroup.visible" width="40%">
        <el-form :model="detailGroup.form" ref="detailForm" labelWidth="100px">
          <el-form-item prop="name" label="机柜名" :rules="$newrules.empty">
            <el-input v-model="detailGroup.form.name" style="width: 95%"></el-input>
          </el-form-item>
          <el-form-item prop="机房" label="机房:">
            <el-select v-if="detailGroup.form.machine_room != null"
                       v-model="detailGroup.form.machine_room.id" style="width:160px">
              <el-option v-for="item in machineroomList" :key="item.id" :value="item.id" :label="item.name"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="comment" label="备注">
            <el-input v-model="detailGroup.form.comment" type="textarea" :rows="2" placeholder="请输入内容" style="width: 95%"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="detailConfirm()" v-if="buttonChange">确 定</el-button>
          <el-button @click="cancelDetail">取 消</el-button>
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
        detailGroup: {visible: false, form: {id: '', name: '', comment: '', machine_room: {id: '', name: ''}}},
        addGroup: {visible: false, form: {name: '', comment: '', machine_room: ''}},
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
          const param = {
            'id': id
          }
          let res = await this.$http.delete_cabinet_room(param)
          this.$message.success('删除成功')
          this.detailGroup.visible = false
          this.getCabinetList()
        }).catch(_ => {})
      },
      async add () {
        this.addGroup.visible = true
        this.addGroup.form = {name: '', comment: '', machine_room: ''}
        let res = await this.$http.get_machineroom_list()
        this.machineroomList = res.results
      },
      addConfirm () {
        this.$refs.addForm.validate(async v => {
          if (v) {
            let res = await this.$http.add_cabinet(this.addGroup.form)
            console.log('this.addGroup.form', this.addGroup.form)
            this.$message.success('新增成功')
            this.addGroup.visible = false
            this.getCabinetList()
          }
        })
      },
      async openDetail (item) {
        this.detailGroup.visible = true
        const param = {
          'id': item.id
        }
        let detailRes = await this.$http.get_detail_cabinet(param)
        this.detailGroup.form = detailRes
        if (this.detailGroup.form.machine_room == null) {
          this.detailGroup.form.machine_room = {'id': null, 'name': null}
        }
        let machineRoomRes = await this.$http.get_machineroom_list()
        this.machineroomList = machineRoomRes.results
      },
      detailConfirm () {
        this.$refs.detailForm.validate(async v => {
          if (v) {
            const param = {
              'id': this.detailGroup.form.id,
              'name': this.detailGroup.form.name,
              'comment': this.detailGroup.form.comment,
              'machine_room': this.detailGroup.form.machine_room.id
            }
            console.log('param', param)
            await this.$http.patch_cabinet(param)
            this.$message.success('修改成功')
            this.detailGroup.visible = false
            this.getCabinetList()
          }
        })
      },
      cancelDetail () {
        this.detailGroup.visible = false
        this.getCabinetList()
      },
      cancelAdd () {
        this.addGroup.visible = false
        this.getCabinetList()
      },
      async getCabinetList (key) {
        let res = await this.$http.get('/asset/cabinet/')
        this.$refs.cabinetList.setData(res.results, res.count)
      },
      getPerm () {
        let perm = JSON.parse(window.sessionStorage.getItem('permission'))
        if (perm.includes('add_cabinet')) {
          this.buttonNew = true
        }
        if (perm.includes('delete_cabinet')) {
          this.buttonDelete = true
        }
        if (perm.includes('change_cabinet')) {
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
