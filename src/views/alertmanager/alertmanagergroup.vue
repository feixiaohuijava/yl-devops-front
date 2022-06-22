<template>
  <div class="main">
    <div class="wrapper wrapper-content">
      <d-table
        url="/api/webhookmanager/alertgroupviewset/"
        ref="alertGroupList"
        v-if="!showDetail"
        :conditionForm="condition"
      >
        <template slot="headerRight">
          <el-select
            placeholder="请选择prometheus"
            clearable
            @visible-change="onSelectChangePrometheus($event, 'select')"
            v-model="searchalertSource"
            style="width:250px"
          >
            <el-option
              v-for="item in prometheusList"
              :key="item.id"
              :value="item.prometheusUrl"
              :label="item.prometheusUrl"
            ></el-option>
          </el-select>
          <el-form-item>
            <el-input
              placeholder="根据监控组名模糊搜索"
              v-model="searchalertGroup"
              class="input-search"
              @keyup.native.enter="onSearchAlertGroup"
              style="width: 220px"
            >
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              icon="el-icon-search"
              type="primary"
              @click="onSearchAlertGroup"
              >查询</el-button
            >
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="prometheusUrl"
              placeholder="eg: http://ip:port"
              style="width: 300px"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="collectrules()">导入</el-button>
          </el-form-item>
          <el-form-item>
            <el-button
              icon="el-icon-plus"
              type="primary"
              @click="openAlertGroup()"
              >添加</el-button
            >
          </el-form-item>
        </template>
        <template slot="column">
          <el-table-column label="id" width="100px">
            <template slot-scope="scope">
              {{ scope.row.id }}
            </template>
          </el-table-column>
          <el-table-column label="监控组名" width="150px">
            <template slot-scope="scope">
              {{ scope.row.groupName }}
            </template>
          </el-table-column>
          <!--          <el-table-column label="容器对象" width="200px">-->
          <!--            <template slot-scope="scope">-->
          <!--              {{ scope.row.prometheusRuleOperator }}-->
          <!--            </template>-->
          <!--          </el-table-column>-->
          <!--          <el-table-column label="类型" width="80px">-->
          <!--            <template slot-scope="scope">-->
          <!--              {{ scope.row.type }}-->
          <!--            </template>-->
          <!--          </el-table-column>-->
          <el-table-column label="prometheus地址" width="200px">
            <template slot-scope="scope">
              {{ scope.row.alertSource }}
            </template>
          </el-table-column>
          <el-table-column label="groupFile" width="300px">
            <template slot-scope="scope">
              {{ scope.row.groupFile }}
            </template>
          </el-table-column>
          <el-table-column label="groupInterval" width="110px">
            <template slot-scope="scope">
              {{ scope.row.groupInterval }}
            </template>
          </el-table-column>
          <!--          <el-table-column label="env" width="100px">-->
          <!--            <template slot-scope="scope" v-if="scope.row.env != null">-->
          <!--              {{ scope.row.env }}-->
          <!--            </template>-->
          <!--            <template slot-scope="scope" v-else>-->
          <!--              {{ }}-->
          <!--            </template>-->
          <!--          </el-table-column>-->
          <el-table-column label="创建时间" width="150px">
            <template slot-scope="scope">
              {{ scope.row.createdTime }}
            </template>
          </el-table-column>
          <el-table-column label="修改时间" width="150px">
            <template slot-scope="scope">
              {{ scope.row.updateTime }}
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-dropdown
                split-button
                trigger="click"
                type="primary"
                @click="edit(scope.row)"
                @command="handleCommand"
                >详情
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item :command="'delete.' + scope.row.id"
                    >删除</el-dropdown-item
                  >
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </template>
      </d-table>
      <el-dialog
        title="添加监控组"
        :visible.sync="addGroup.visible"
        width="70%"
      >
        <el-form :model="addGroup.form" ref="addForm" label-width="200px">
          <el-form-item label="prometheusUrl:">
            <el-select
              placeholder="请选择prometheus"
              clearable
              @visible-change="onSelectChangePrometheus($event, 'add')"
              v-model="addGroup.form.prometheusUrl"
              style="width:250px"
            >
              <el-option
                v-for="item in prometheusListAdd"
                :key="item.id"
                :value="item.prometheusUrl"
                :label="item.prometheusUrl"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="监控组名:">
            <el-input
              v-model="addGroup.form.groupName"
              style="width: 300px"
            ></el-input>
          </el-form-item>
          <el-form-item label="监控组文件:">
            <el-input
              v-model="addGroup.form.groupFile"
              style="width: 300px"
            ></el-input>
          </el-form-item>
          <el-form-item label="监控组间隔:">
            <el-input
              v-model="addGroup.form.groupInterval"
              style="width: 300px"
            ></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="addConfirm">确 定</el-button>
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
      prometheusListAdd: [],
      prometheusList: [],
      prometheusUrl: '',
      searchalertGroup: null,
      searchalertSource: null,
      condition: null,
      groupId: '',
      groupName: '',
      editGroup: {
        visible: false,
        form: { id: '', groupName: '', description: '', groupId: '' }
      },
      addGroup: {
        visible: false,
        form: {
          prometheusUrl: undefined,
          groupName: undefined,
          groupFile: undefined,
          groupInterval: undefined
        }
      },
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
  mounted () {
    document.onkeydown = event => {
      var code = event.keyCode
      if (code === 13) {
        //这是键盘的enter监听事件
        this.onSearchAlertGroup()
      }
    }
  },
  methods: {
    async onSelectChangePrometheus (callback, type) {
      if (callback) {
        this.prometheusList = []
        if (type === 'select') {
          let resPrometheus = await this.$http.get_prometheus_url()
          this.prometheusList = resPrometheus.results
        } else if (type === 'add') {
          let resPrometheus = await this.$http.get_prometheus_url()
          this.prometheusListAdd = resPrometheus.results
        }
      }
    },
    async openAlertGroup () {
      this.addGroup.visible = true
    },
    // async onSelectChangePrometheus(callback) {
    //     this.prometheusList = []
    //     if (callback) {
    //         let resPrometheus = await this.$http.get_prometheus_url()
    //         this.prometheusList = resPrometheus.results
    //     }
    // },
    async onSearchAlertGroup () {
      const param = {}
      if (this.searchalertSource) {
        param['alertSource__icontains'] = this.searchalertSource
      }
      if (this.searchalertGroup) {
        param['groupName__icontains'] = this.searchalertGroup
      }
      let res = await this.$http.get_alertGroup(param)
      this.$refs.alertGroupList.setData(res.results, res.count)
      this.condition = param
    },
    async collectrules () {
      if (this.prometheusUrl) {
        this.$confirm('确认导入?', '提示', { type: 'warning' })
          .then(async () => {
            await this.$http.collectrulesviewset({ url: this.prometheusUrl })
          })
          .catch(_ => {
            this.$message.success('导入成功')
          })
      }
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
      this.$confirm('确认删除?', '提示', { type: 'warning' })
        .then(async () => {
          let res = await this.$http.delteAlertGroupApi({ id: id })
          console.log(res)
          if (res.hasOwnProperty('results')) {
            this.$message.success('删除成功!')
          } else {
            this.$message.error('删除失败!')
          }
          this.$refs.alertGroupList.getData()
        })
        .catch(_ => {})
    },
    add () {
      this.addGroup.visible = true
    },
    addConfirm () {
      this.$confirm('确认添加?', '提示', { type: 'warning' }).then(async () => {
        const param = {
          alertSource: this.addGroup.form.prometheusUrl,
          groupName: this.addGroup.form.groupName,
          groupFile: this.addGroup.form.groupFile,
          groupInterval: this.addGroup.form.groupInterval
        }
        let res = await this.$http.createAlertGroupApi(param)
        if (res.hasOwnProperty('results')) {
          this.$message.success('创建成功!')
        } else {
          this.$message.error('创建失败!')
        }
        this.addGroup.visible = false
        this.$refs.alertGroupList.getData()
      })
    },
    edit (item) {
      // this.editGroup = {visible: true, form: {id: item.id, name: item.name, comment: item.comment}}
    },
    editConfirm () {
      this.$refs.editForm.validate(async v => {
        if (v) {
          const param = {
            id: this.editGroup.form.id,
            name: this.editGroup.form.name,
            comment: this.editGroup.form.comment
          }
          let res = await this.$http.patch_brand(param)
          this.$message.success('修改成功')
          this.editGroup.visible = false
          this.$refs.brandList.getData()
        }
      })
    },
    cancelEdit () {
      this.editGroup = {
        visible: false,
        form: { groupName: '', description: '', groupId: '' }
      }
      this.addGroup = { visible: false, form: {} }
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
.group-id {
  color: #409eff;
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
