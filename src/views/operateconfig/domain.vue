<template>
  <div class="main">
    <div class="wrapper wrapper-content">
      <d-table url="/api/servicecom/domainviewset/" ref="domainlist" v-if="!showDetail" :conditionForm="condition">
        <template slot="headerRight">
          <el-form-item>
            <el-button icon="el-icon-plus" type="primary" @click="add" v-if="buttonNew">新建</el-button>
          </el-form-item>
        </template>
        <template slot="column">
          <el-table-column prop="id" label="id" width="50px">
            <template slot-scope="scope">
              {{ scope.row.id }}
            </template>
          </el-table-column>
          <el-table-column label="name" width="100px">
            <template slot-scope="scope">
              {{ scope.row.name }}
            </template>
          </el-table-column>
          <el-table-column label="config_file_name">
            <template slot-scope="scope">
              {{ scope.row.config_file_name }}
            </template>
          </el-table-column>
          <el-table-column label="nginx_ip">
            <template slot-scope="scope">
              {{ scope.row.nginx_ip }}
            </template>
          </el-table-column>
<!--          <el-table-column label="cname" width="250px">-->
<!--            <template slot-scope="scope">-->
<!--              {{ scope.row.cname }}-->
<!--            </template>-->
<!--          </el-table-column>-->
          <el-table-column label="network_type">
            <template slot-scope="scope">
              {{ scope.row.network_type}}
            </template>
          </el-table-column>
<!--          <el-table-column label="slb_ip">-->
<!--            <template slot-scope="scope">-->
<!--              {{ scope.row.slb_ip }}-->
<!--            </template>-->
<!--          </el-table-column>-->
          <el-table-column label="env">
            <template slot-scope="scope" v-if="scope.row.env !== null">
              {{ scope.row.env.name}}
            </template>
             <template slot-scope="scope" v-else="scope.row.env === null">
              {{ }}
            </template>
          </el-table-column>
        </template>
      </d-table>
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
