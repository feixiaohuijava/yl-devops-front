<template>
  <div class="main">
    <div class="wrapper wrapper-content">
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        searchenv: '',
        searchModule: '',
        searchTime: '',
        condition: {},
        groupId: '',
        groupName: '',
        editGroup: {visible: false, form: {id: '', env: '', module: '', deploy_es_detail: '', jenkins_build_error_log: ''}},
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
    },
    methods: {
      async onSearchValue () {
        if (!(this.searchTime instanceof Array)) {
          this.searchTime = null
        } else {
          this.searchTime = moment(this.searchTime[0]).format('YYYY-MM-DD HH:mm:ss') + ',' + moment(this.searchTime[1]).format('YYYY-MM-DD HH:mm:ss')
        }
        const param = {
          env: this.searchenv,
          module: this.searchModule,
          createdTime__range: this.searchTime
        }
        let res = await this.$http.searchJenkinBuildLogApi(param)
        this.$refs.jenkinsbuildloglist.setData(res.results, res.count)
        this.condition = param
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
        this.editGroup = {visible: true, form: {id: item.id, env: item.env, module: item.module, deploy_es_detail: item.deploy_es_detail, jenkins_build_error_log: item.jenkins_build_error_log}}
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
