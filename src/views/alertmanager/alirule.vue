<template>
  <div class="main">
    <div class="wrapper wrapper-content">
      <d-table
        url="/api/webhookmanager/aliruleviewset/"
        ref="alialertrulelist"
        v-if="!showDetail"
        :conditionForm="condition"
        @SelectionChange="getCheckList"
      >
        <template slot="headerLeft">
          <el-form-item>
            <el-input
              placeholder="根据RuleId模糊搜索"
              v-model="searchRuleId"
              class="input-search"
              @keyup.native.enter="onSearchAliAlertRule"
              style="width: 220px"
            >
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-input
              placeholder="根据RuleName模糊搜索"
              v-model="searchRuleName"
              class="input-search"
              @keyup.native.enter="onSearchAliAlertRule"
              style="width: 220px"
            >
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-input
              placeholder="根据MetricName模糊搜索"
              v-model="searchMetricName"
              class="input-search"
              @keyup.native.enter="onSearchAliAlertRule"
              style="width: 220px"
            >
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-input
              placeholder="根据Namespace模糊搜索"
              v-model="searchNamespace"
              class="input-search"
              @keyup.native.enter="onSearchAliAlertRule"
              style="width: 220px"
            >
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-input
              placeholder="根据GroupName模糊搜索"
              v-model="searchGroupName"
              class="input-search"
              @keyup.native.enter="onSearchAliAlertRule"
              style="width: 220px"
            >
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-input
              placeholder="根据ContactGroups模糊搜索"
              v-model="searchContactGroups"
              class="input-search"
              @keyup.native.enter="onSearchAliAlertRule"
              style="width: 220px"
            >
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              icon="el-icon-search"
              type="primary"
              @click="onSearchAliAlertRule"
              >查询</el-button
            >
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="syncAliAlertRuleRobot"
              >同步</el-button
            >
          </el-form-item>
        </template>
        <template slot="column">
          <el-table-column
            type="selection"
            width="55"
            :reserve-selection="true"
          >
          </el-table-column>
          <el-table-column label="ID" width="50px">
            <template slot-scope="scope">
              {{ scope.row.id }}
            </template>
          </el-table-column>
          <el-table-column label="RuleId" width="170px">
            <template slot-scope="scope">
              {{ scope.row.RuleId }}
            </template>
          </el-table-column>
          <el-table-column label="RuleName" width="130px">
            <template slot-scope="scope">
              {{ scope.row.RuleName }}
            </template>
          </el-table-column>
          <el-table-column label="MetricName" width="150px">
            <template slot-scope="scope">
              {{ scope.row.MetricName }}
            </template>
          </el-table-column>
          <el-table-column label="Namespace" width="150px">
            <template slot-scope="scope">
              {{ scope.row.Namespace }}
            </template>
          </el-table-column>
          <el-table-column label="GroupName" width="120px">
            <template slot-scope="scope">
              {{ scope.row.GroupName }}
            </template>
          </el-table-column>
          <el-table-column label="ContactGroups" width="150px">
            <template slot-scope="scope">
              {{ scope.row.ContactGroups }}
            </template>
          </el-table-column>
          <el-table-column label="一级机器人(无条件发送群)" width="200px">
            <template
              slot-scope="scope"
              v-if="scope.row.robot_primary.length == 0"
            >
              {{}}
            </template>
            <template
              slot-scope="scope"
              v-if="scope.row.robot_primary.length != 0"
            >
              <el-tag
                v-for="tag in scope.row.robot_primary"
                :key="tag.id"
                type="success"
                >{{ tag.robot_name }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column label="phone" width="60px">
            <template slot-scope="scope">
              <div v-if="scope.row.callOpsFlag === true">
                <el-tag type="primary">有</el-tag>
              </div>
            </template>
          </el-table-column>
          <!--  width="135px" -->
          <el-table-column label="修改时间">
            <template slot-scope="scope">
              {{ scope.row.updateTime }}
            </template>
          </el-table-column>
          <!-- width="120px" -->
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-dropdown
                split-button
                trigger="click"
                type="primary"
                @click="edit(scope.row.id)"
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
        title="阿里云监控详情"
        :visible.sync="editGroup.visible"
        width="40%"
      >
        <el-form :model="editGroup.form" ref="editForm" labelWidth="100px">
          <el-form-item prop="id" label="id">
            <el-input
              v-model="editGroup.form.id"
              readonly
              style="width: 300px"
            ></el-input>
          </el-form-item>
          <el-form-item prop="RuleName" label="RuleName">
            <el-input
              v-model="editGroup.form.RuleName"
              style="width: 300px"
            ></el-input>
          </el-form-item>
          <el-form-item prop="callOpsFlag" label="电话">
            <!--            <el-input v-model="editGroup.form.callOpsFlag" style="width: 300px"></el-input>-->
            <el-switch v-model="editGroup.form.callOpsFlag"></el-switch>
          </el-form-item>
          <el-form-item prop="robot_primary" label="一级机器人">
            <el-select
              clearable
              @visible-change="onSelectChangeRobot($event)"
              v-model="selectRobotPrimaryId"
            >
              <el-option
                v-for="item in robotList"
                :key="item.id"
                :value="item.id"
                :label="item.robot_name"
              ></el-option>
            </el-select>
            <el-button type="primary" @click="addRobot()">添加</el-button>
            <br />
            <el-tag
              closable
              @close="handleRobotClose(tag)"
              v-for="tag in editGroup.form.robot_primary"
              :key="tag.id"
            >
              {{ tag.robot_name }}
            </el-tag>
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
import robot from './robot'

export default {
  data () {
    return {
      selectRobotPrimaryId: null,
      robotList: [],
      searchContactGroups: null,
      searchGroupName: null,
      searchRuleId: null,
      searchRuleName: null,
      searchRobotPrimary: null,
      searchMetricName: null,
      searchNamespace: null,
      robotoptions: [
        { label: '一级机器人', key: 'robot_primary' },
        { label: '二级机器人', key: 'robot_second' }
      ],
      checkList: [],
      searchLableKey: '',
      searchLableValue: '',
      machineroomId: '',
      cabinetId: '',
      idcList: [],
      machineroomList: [],
      cabinetList: [],
      condition: null,
      groupId: '',
      groupName: '',
      pageNumber: '',
      editGroup: {
        visible: false,
        form: {
          id: undefined,
          RuleName: undefined,
          robot_primary: undefined,
          callOpsFlag: undefined
        }
      },
      robotIds: '',
      setrobotGroup: {
        visible: false,
        form: {
          robotIds: [],
          robotType: '',
          alertRuleIds: [],
          robotSecond_lable: ''
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
  created () {},
  methods: {
    handleRobotClose (tag) {
      this.editGroup.form.robot_primary.pop(tag)
    },
    addRobot () {
      if (this.selectRobotPrimaryId !== null) {
        this.robotList.forEach(value => {
          if (value.id === this.selectRobotPrimaryId) {
            this.editGroup.form.robot_primary.push({
              id: this.selectRobotPrimaryId,
              robot_name: value.robot_name
            })
          }
        })
        this.selectRobotPrimaryId = null
      }
    },
    async onSelectChangeRobot (callback) {
      if (callback) {
        this.robotList = []
        let resRobot = await this.$http.getRobotListApi()
        resRobot.results.forEach(value => {
          this.robotList.push({ id: value.id, robot_name: value.robot_name })
        })
      }
    },
    async deleteUnuseRule () {
      this.$confirm('确认删除无效监控项?', '提示', { type: 'warning' }).then(
        async () => {
          let res = await this.$http.deleteUnuseeRuleApi()
          this.$message.success('删除无效监控项成功')
        }
      )
    },
    async syncAliAlertRuleRobot () {
      this.$confirm('确认同步?', '提示', { type: 'warning' }).then(async () => {
        let res = await this.$http.syncalialertrulerobotapi()
        if (res.hasOwnProperty('results')) {
          this.$message.success('同步阿里云监控规则成功!')
        }
      })
    },
    async onSearchAliAlertRule () {
      const param = {}
      if (this.searchRuleId) {
        param['RuleId__icontains'] = this.searchRuleId
      }
      if (this.searchGroupName) {
        param['GroupName__icontains'] = this.searchGroupName
      }
      if (this.searchContactGroups) {
        param['ContactGroups__icontains'] = this.searchContactGroups
      }
      if (this.searchRuleName) {
        param['RuleName__icontains'] = this.searchRuleName
      }
      if (this.searchMetricName) {
        param['MetricName__icontains'] = this.searchMetricName
      }
      if (this.searchNamespace) {
        param['Namespace__icontains'] = this.searchNamespace
      }
      let res = await this.$http.get_ali_alertRule(param)
      this.$refs.alialertrulelist.setData(res.results, res.count)
      this.condition = param
    },
    async getCheckList (val) {
      this.checkList = []
      val.map(item => {
        this.checkList.push(item.id)
      })
    },
    async edit (id) {
      this.editGroup.visible = true
      let res = await this.$http.getAliAlertRuleApi({ id: id })
      this.editGroup.form.id = res.results.id
      this.editGroup.form.robot_primary = res.results.robot_primary
      this.editGroup.form.RuleName = res.results.RuleName
      this.editGroup.form.callOpsFlag = res.results.callOpsFlag
    },
    editConfirm () {
      this.$refs.editForm.validate(async v => {
        if (v) {
          const param = {
            id: this.editGroup.form.id,
            robot_primary: this.editGroup.form.robot_primary,
            callOpsFlag: this.editGroup.form.callOpsFlag
          }
          let res = await this.$http.patchAliAlertRuleApi(param)
          if (res.hasOwnProperty('results')) {
            this.$message.success('修改成功!')
          } else {
            this.$message.error('修改失败!')
          }
          this.editGroup.visible = false
          this.$refs.alialertrulelist.getData()
        }
      })
    },
    cancelEdit () {
      this.setrobotGroup.visible = false
      this.$refs.alertrulelist.getData()
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
