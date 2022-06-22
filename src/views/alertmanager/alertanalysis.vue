<template>
  <div class="main">
    <div class="wrapper wrapper-content">
      <d-table
        url="/api/alertanalysis/apidataviewset/"
        ref="alertanalysisList"
        v-if="!showDetail"
        :conditionForm="condition"
      >
        <template slot="headerLeft">
          <el-form-item>
            <el-button
              icon="el-icon-plus"
              type="primary"
              @click="add"
              v-if="buttonNew"
              >新建</el-button
            >
          </el-form-item>
          <el-form-item>
            <el-input
              placeholder="url模糊搜索"
              v-model="searchUrl"
              class="input-search"
              style="width: 500px"
            >
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-input
              placeholder="应用名模糊搜索"
              v-model="searchApplicationName"
              class="input-search"
              style="width: 300px"
            >
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-date-picker
              v-model="recordDate"
              type="date"
              format="yyyy 年 MM 月 dd 日"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-select placeholder="请选择值类型" v-model="valueType" clearable>
              <el-option value="handredVaule" label="100"></el-option>
              <el-option value="ninetyfiveVlue" label="95"></el-option>
              <el-option value="ninetyVlue" label="90"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button
              icon="el-icon-search"
              type="primary"
              @click="onSearchAlertRule"
              >查询</el-button
            >
          </el-form-item>
          <el-form-item>
            <el-button
              v-loading="false"
              type="success"
              icon="el-icon-download"
              @click="exportdata"
              >导出</el-button
            >
          </el-form-item>
        </template>
        <template slot="column">
          <el-table-column label="id" width="50px">
            <template slot-scope="scope">
              {{ scope.row.id }}
            </template>
          </el-table-column>
          <el-table-column label="applicationName" width="280px">
            <template slot-scope="scope">
              {{ scope.row.applicationName }}
            </template>
          </el-table-column>
          <el-table-column label="url" width="200px">
            <template slot-scope="scope">
              {{ scope.row.url }}
            </template>
          </el-table-column>
          <el-table-column label="description" width="100px">
            <template slot-scope="scope">
              {{ scope.row.description }}
            </template>
          </el-table-column>
          <el-table-column label="project" width="80px">
            <template slot-scope="scope">
              <div v-if="scope.row.project">
                {{ scope.row.project.projectName }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="subsystem" width="200px">
            <template slot-scope="scope">
              <div v-if="scope.row.subsystem">
                {{ scope.row.subsystem.subsystemname }}
                <br />
                {{ scope.row.subsystem.subsystemNick }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="cluster" width="100px">
            <template slot-scope="scope">
              <div v-if="scope.row.cluster">
                {{ scope.row.cluster.clusterName }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="qps" width="150px">
            <template slot-scope="scope">
              <div v-if="scope.row.qps">
                {{ scope.row.qps }}
                <!--                max: {{ scope.row.qps.handredVaule }}-->
                <!--                <br>-->
                <!--                95: {{ scope.row.qps.ninetyfiveVlue }}-->
                <!--                <br>-->
                <!--                90: {{ scope.row.qps.ninetyVlue }}-->
              </div>
            </template>
          </el-table-column>
          <el-table-column label="avgDelay" width="150px">
            <template slot-scope="scope">
              <div v-if="scope.row.avgDelay">
                {{ scope.row.avgDelay }}
                <!--                max: {{ scope.row.avgDelay.handredVaule }}-->
                <!--                <br>-->
                <!--                95: {{ scope.row.avgDelay.ninetyfiveVlue }}-->
                <!--                <br>-->
                <!--                90: {{ scope.row.avgDelay.ninetyVlue }}-->
              </div>
            </template>
          </el-table-column>
          <el-table-column label="maxDelay" width="150px">
            <template slot-scope="scope">
              <div v-if="scope.row.maxDelay">
                {{ scope.row.maxDelay }}
                <!--                max: {{ scope.row.maxDelay.handredVaule }}-->
                <!--                <br>-->
                <!--                95: {{ scope.row.maxDelay.ninetyfiveVlue }}-->
                <!--                <br>-->
                <!--                90: {{ scope.row.maxDelay.ninetyVlue }}-->
              </div>
            </template>
          </el-table-column>
          <el-table-column label="recordDate" width="100px">
            <template slot-scope="scope">
              {{ scope.row.recordDate }}
            </template>
          </el-table-column>

          <!--          <el-table-column label="操作" width="200px">-->
          <!--            <template slot-scope="scope">-->
          <!--              <el-dropdown split-button trigger="click" type="primary" @click="edit(scope.row)"-->
          <!--                           @command="handleCommand">详情-->
          <!--                <el-dropdown-menu slot="dropdown">-->
          <!--                  <el-dropdown-item :command="'delete.' + scope.row.id" :disabled="!buttonDelete">删除</el-dropdown-item>-->
          <!--                </el-dropdown-menu>-->
          <!--              </el-dropdown>-->
          <!--            </template>-->
          <!--          </el-table-column>-->
        </template>
      </d-table>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      excelData: null,
      searchUrl: null,
      searchApplicationName: null,
      recordDate: null,
      valueType: null,
      condition: null,
      groupId: '',
      groupName: '',
      editGroup: {
        visible: false,
        form: { id: '', groupName: '', description: '', groupId: '' }
      },
      addGroup: { visible: false, form: { name: '', comment: '' } },
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
        this.onSearchAlertRule()
      }
    }
  },
  methods: {
    async exportdata () {
      this.$confirm('确认导出?', '提示', { type: 'warning' })
        .then(async () => {
          const param = { allpage: true }
          if (this.searchUrl) {
            param['url__contains'] = this.searchUrl
          }
          if (this.searchalertGroup) {
            param['applicationName__contains'] = this.searchApplicationName
          }
          if (this.recordDate) {
            param['recordDate'] = this.recordDate
          }
          if (this.valueType) {
            param['valueType'] = this.valueType
          }
          let res = await this.$http.get(
            `/api/alertanalysis/apidataviewset/`,
            param
          )
          res.results.forEach(value => {
            if (value.project) {
              value['project'] = value.project.projectName
            }
            if (value.subsystem) {
              value['subsystem'] = value.subsystem.subsystemname
            }
            if (value.cluster) {
              value['cluster'] = value.cluster.clusterName
            }
          })
          console.log(res.results)
          this.excelData = res.results
          this.export2Excel()
        })
        .catch(_ => {})
    },
    export2Excel () {
      const that = this
      require.ensure([], () => {
        const { export_json_to_excel } = require('@/excel/export2Excel.js')
        // 导出的表头名信息
        const tHeader = [
          'id',
          'applicatinName',
          'url',
          'description',
          'project',
          'subsystem',
          'cluster',
          'qps',
          'avgDelay',
          'maxDelay',
          'recordDate'
        ]
        // 导出的表头字段名，需要导出表格字段名
        const filterVal = [
          'id',
          'applicationName',
          'url',
          'description',
          'project',
          'subsystem',
          'cluster',
          'qps',
          'avgDelay',
          'maxDelay',
          'recordDate'
        ]
        const list = that.excelData
        const jsonData = that.formatJson(filterVal, list)
        //   // 导出的表格名称，根据需要自己命名
        export_json_to_excel(tHeader, jsonData, '监控分析')
      })
    },
    formatJson (filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    async onSearchAlertRule () {
      const param = {}
      if (this.searchUrl) {
        param['url__contains'] = this.searchUrl
      }
      if (this.searchalertGroup) {
        param['applicationName__contains'] = this.searchApplicationName
      }
      if (this.recordDate) {
        param['recordDate'] = this.recordDate
      }
      if (this.valueType) {
        param['valueType'] = this.valueType
      }
      let res = await this.$http.get_alertanalysis(param)
      this.$refs.alertanalysisList.setData(res.results, res.count)
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
      this.$confirm('确认删除?', '提示', { type: 'warning' })
        .then(async () => {
          await this.$http.delete_brand({ id: id })
          this.$message.success('删除成功')
          this.$refs.brandList.getData()
        })
        .catch(_ => {})
    },
    add () {
      this.addGroup.visible = true
    },
    addConfirm () {
      this.$refs.addForm.validate(async v => {
        if (v) {
          const param = {
            name: this.addGroup.form.name,
            comment: this.addGroup.form.comment
          }
          let res = await this.$http.add_brand(param)
          this.addGroup.visible = false
          this.$refs.brandList.getData()
        }
      })
    },
    edit (item) {
      this.editGroup = {
        visible: true,
        form: { id: item.id, name: item.name, comment: item.comment }
      }
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
      this.addGroup = { visible: false, form: { name: '', comment: '' } }
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
