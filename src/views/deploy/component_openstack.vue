<template>
  <div class="main">
    <div class="wrapper wrapper-content">
      <el-tabs type="border-card" @tab-click="handleClick" v-model="activeName">
        <el-tab-pane label="openstack组件列表" name="one">
          <el-input placeholder="请输入内容" v-model="selectTask" class="input-with-select" style="width: 400px">
            <el-button slot="append" icon="el-icon-search" @click="onSearchTask"></el-button>
          </el-input>
          <el-table v-loading="loading" size="medium" :data="componentNameList" height="440"
                    @selection-change="handleSelectionChange" style="width: 100%">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="component_name" label="组件名称"></el-table-column>
            <el-table-column prop="component_priority" label="组件优先级"></el-table-column>
            <el-table-column prop="type_environment_name.type_environment_name" label="环境类型"></el-table-column>
            <el-table-column prop="create_time" label="创建时间"></el-table-column>
            <el-table-column prop="update_time" label="修改时间"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="openSlsList(scope.row.id)">脚本列表</el-button>
                <el-button type="primary" size="mini" @click="openDetail(scope.row.id)">编辑</el-button>
                <el-button type="danger" size="mini" @click="delComponent(scope.row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination style="padding-top: 20px" layout="total, prev, pager, next, jumper, slot"
                         @current-change="handleCurrentChange" :total="this.componentNameList.length"
                         :page-count="this.componentNameList.page_count">
            <span class="go">Go</span>
          </el-pagination>
          <div style="text-align: right;padding-top: 10px">
            <el-button type="success" icon="el-icon-refresh" @click="getComponentList()">刷新</el-button>
            <el-button @click="addComponentDialog()" type="primary" plain>增加组件</el-button>
          </div>
        </el-tab-pane>
      </el-tabs>
      <el-dialog class="time-dialog" title="增加组件" :visible.sync="addGroup.visible" width="34%"
                 :before-close="handleClose">
        <el-form :model="addGroup.form" ref="addGroup" label-width="100px">
          <el-form-item prop="type_environment_name" label="环境类型名">
            <el-input disabled v-model="addGroup.form.type_environment_name"></el-input>
          </el-form-item>
          <el-form-item prop="component_name" label="组件名称">
            <el-input v-model="addGroup.form.component_name"></el-input>
          </el-form-item>
          <el-form-item prop="component_priority" label="组件优先级">
            <el-input v-model="addGroup.form.component_priority"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" @click="add_component_name" plain>提交</el-button>
      </el-dialog>
      <el-dialog title="组件详情" :visible.sync="detailComponentDialog">
        <el-form label-width="120px">
          <el-form-item label="组件名称：">
            <el-input v-model=detailComponent.component_name placeholder="请输入组件名称">
            </el-input>
          </el-form-item>
          <el-form-item label="组件优先级：">
            <el-form label="detailComponent.component_priority">
              <el-input v-model=detailComponent.component_priority placeholder="请输入组件优先级">
              </el-input>
            </el-form>
          </el-form-item>
          <el-form-item label="创建时间：">{{ detailComponent.create_time }}</el-form-item>
          <el-form-item label="更新时间：">{{ detailComponent.update_time }}</el-form-item>
        </el-form>
        <div class="operation">
          <el-button type="warning" @click="detailComponentDialog = false" plain>确认</el-button>
          <el-button type="warning" @click="detailComponentDialog = false" plain>取消</el-button>
          <el-button type="primary" @click="updateComponent_name()" plain>修改</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        addGroup: {visible: false, form: { type_environment_name: '', component_name: '', component_priority: '' }},
        type_environment_name: {type_environment_name: '', id: ''},
        detailComponentDialog: false,
        detailComponent: '',
        component_id: '',
        component_name: '',
        component_priority: '',
        create_time: '',
        update_time: '',
        selectTask: '',
        visible: false,
        loading: false,
        componentDialog: false,
        instantTaskDialog: false,
        description: '',
        componentNameList: [],
        tasksList: [],
        formData: [],
        timeForm1: {every: null, period: null},
        timeForm2: {minute: null, hour: null, day_of_week: null, day_of_month: null, month_of_year: null},
        task: '',
        regiseted_task_list: [],
        multipleSelection: [],
        selected_type: '',
        selected_value: '',
        // 注册过的函数
        scheduler_type: ['interval', 'crontab'],
        immediate_type: 'immediate',
        periods: ['days', 'hours', 'minutes', 'seconds', 'microseconds'],
        page_no: 1,
        page_no2: 1,
        detailDialog: false,
        taskDetail: '',
        selectTask2: '',
        failLogDialog: false,
        activeName: 'one'
      }
    },
    created () {
      this.type_environment_name.id = this.$route.params.type_environment_name
      this.getComponentList(this.type_environment_name.id)
    },
    methods: {
      async openSlsList (id) {
        this.$router.push({name: '部署脚本', params: {'id': id, type_environment_name_id: this.type_environment_name.id}})
      },
      async jumpToDeploy () {
        this.$router.push({name: 'deploy_openstack'})
      },
      async openDetail (id) {
        const params = {
          'id': id
        }
        let res = await this.$http.get_detail_component(params)
        this.detailComponent = res
        this.detailComponentDialog = true
        this.component_id = id
      },
      async updateComponent_name () {
        const params = {
          id: this.detailComponent.id,
          component_name: this.detailComponent.component_name,
          component_priority: this.detailComponent.component_priority
        }
        await this.$http.patch_component_name(params)
        this.$message.success('修改成功')
        this.detailComponentDialog = false
        this.getComponentList(this.type_environment_name.id)
      },
      // 删除组件
      delComponent (id) {
        this.$confirm('确认删除？').then(async () => {
          let res = await this.$http.delete_component_name({id: id})
          this.$message.success('删除成功')
          this.getComponentList(this.type_environment_name.id)
        }).catch(_ => {})
      },
      handleClick (tab) {
        if (tab.label === '已构建的任务') {
          this.getTasksList()
        } else if (tab.label === '构建新的任务') {
          this.getComponentList(this.type_environment_name.id)
        }
      },
      handleCurrentChange (v) {
        this.page_no = v
        this.getComponentList(this.type_environment_name.id)
      },
      handleCurrentChange2 (v) {
        this.page_no2 = v
        this.getTasksList()
      },
      async getTasksList () {
        const params = {
          page_no: this.page_no2,
          page_size: 10
        }
        let res = await this.$http.schedulerTasksList(params)
        this.tasksList = res.data
        this.tasksList.page_count = res.page_count
      },
      async getComponentList (id) {
        this.loading = false
        const param = {
          type_environment_name: id
        }
        let res = await this.$http.componentlist(param)
        console.log('res', res)
        this.componentNameList = res.results
        this.total = res.count
        this.selectTask = ''
      },
      async onSearchTask () {
        this.loading = true
        this.componentNameList = [{'job_name': 1, 'status': 'ok'}, {'job_name': 1, 'status': 'ok'}, {'job_name': 1, 'status': 'ok'}]
        this.selectTask = ''
        this.loading = false
      },
      async onSearchTaskTwo () {
        this.loading = true
        const params = {
          page_no: 1,
          page_size: 10,
          key_word: this.selectTask2
        }
        let res = await this.$http.schedulerTasksList(params)
        if (res.code === 4000) {
          this.tasksList = res.data
          this.tasksList.page_count = res.page_count
          this.selectTask2 = ''
        }
        this.loading = false
      },
      async getJob () {
        let res = await this.$http.get_regiseted_task()
        this.regiseted_task_list = res.data
      },
      // 构建按钮
      async addComponentDialog () {
        this.addGroup.visible = true
        this.addGroup.form.component_name = ''
        this.addGroup.form.component_priority = ''
        let res = await this.$http.get_detail_typeenvironmentname({id: this.type_environment_name.id})
        console.log('res', res)
        this.type_environment_name.type_environment_name = res.type_environment_name
        this.addGroup.form.type_environment_name = this.type_environment_name.type_environment_name
        console.log('this.type_environment_name', this.type_environment_name)
      },
      handleSelectionChange (val) {
        this.multipleSelection = val
      },
      handleClose (done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done()
          })
          .catch(_ => {})
      },
      async add_component_name () {
        this.loading = true
        const params = {
          component_name: this.addGroup.form.component_name,
          component_priority: this.addGroup.form.component_priority,
          type_environment_name: this.type_environment_name.id
        }
        let res = await this.$http.add_component_name(params)
        this.$message({
          message: '增加成功',
          type: 'success'
        })
        this.loading = false
        this.getComponentList(this.type_environment_name.id)
        this.addGroup.visible = false
      }
    }
  }
</script>

<style lang="less" ref="stylesheet/less">
  .time-dialog{
    .time-dialog-first{
      padding: 10px;
    }
  }
  .operation{
    display: flex;
    align-items: center;
    justify-content: space-around;
    width: 100%;
  }
  .go{
    display: inline-flex !important;
    width: 28px;
    height: 28px;
    border-radius: 28px;
    justify-content: center;
    align-items: center;
    background: #4bff66;
    color: white;
    margin-left: 20px;
    cursor: pointer;
    &:hover{
      background: #19ae31;
    }
  }
  .fail-log{
    .el-dialog__body{
      pre {
        white-space: pre-wrap;
        word-wrap: break-word;
      }
    }
  }
</style>
