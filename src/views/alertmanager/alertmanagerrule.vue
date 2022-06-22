<template>
  <div class="main">
    <div class="wrapper wrapper-content">
      <d-table
        url="/api/webhookmanager/alertruleviewset/"
        ref="alertrulelist"
        v-if="!showDetail"
        :conditionForm="condition"
        @SelectionChange="getCheckList"
      >
        <template slot="headerLeft">
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
            <el-select
              placeholder="请选择监控组"
              clearable
              @visible-change="onSelectChangeGroup($event, 'select')"
              v-model="searchalertGroup"
              style="width:250px"
            >
              <el-option
                v-for="item in alertGroupList"
                :key="item.id"
                :value="item.groupName"
                :label="item.groupName"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input
              placeholder="根据监控项模糊搜索"
              v-model="searchalertRuleName"
              class="input-search"
              style="width: 300px"
            >
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-input
              placeholder="根据监控标签key"
              v-model="searchLableKey"
              class="input-search"
              style="width: 150px"
            >
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-input
              placeholder="根据监控标签value"
              v-model="searchLableValue"
              class="input-search"
              style="width: 200px"
            >
            </el-input>
          </el-form-item>
          <el-form-item>
            <!-- @keyup.enter.native="onSearchAlertRule" -->
            <el-input
              placeholder="根据一级机器人模糊搜索"
              v-model="searchRobotPrimary"
              class="input-search"
              style="width: 220px"
            >
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-select clearable placeholder="运维电话" v-model="callOpsFlag">
              <el-option value="true" label="有"></el-option>
              <el-option value="false" label="无"></el-option>
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
            <el-button type="primary" @click="openaddrobot"
              >批量配置机器人</el-button
            >
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="syncAlertRuleRobot"
              >根据channel同步机器人</el-button
            >
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-plus" @click="addAlertRule"
              >添加</el-button
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
          <el-table-column label="监控项" width="130px">
            <template slot-scope="scope">
              <a href="javascript:;" @click="monitoringItems(scope.row)">{{
                scope.row.ruleName
              }}</a>
            </template>
          </el-table-column>
          <el-table-column label="运维电话" width="65px">
            <template slot-scope="scope">
              <div v-if="scope.row.callOpsFlag === true">
                <el-tag type="primary">有</el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="监控组" width="250px">
            <template slot-scope="scope">
              <div
                v-if="
                  scope.row.alertGroup !== null &&
                    scope.row.alertGroup.env !== null
                "
              >
                prometheus: {{ scope.row.alertGroup.alertSource }} <br />
                告警组: {{ scope.row.alertGroup.groupName }} <br />
                环境:
                {{ scope.row.alertGroup.env.name }}
              </div>
              <div
                v-else-if="
                  scope.row.alertGroup !== null &&
                    scope.row.alertGroup.env === null
                "
              >
                prometheus: {{ scope.row.alertGroup.alertSource }} <br />
                告警组: {{ scope.row.alertGroup.groupName }}
              </div>
              <div v-else></div>
            </template>
          </el-table-column>
          <el-table-column label="监控规则标签" width="200px">
            <template slot-scope="scope">
              <div v-for="(value, key) in scope.row.ruleLabels" :key="key">
                <el-tag type="warning">{{ key }}: {{ value }}</el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="一级机器人(无条件发送群)" width="250px">
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
              >
                {{ tag.robot_name }}
              </el-tag>
            </template>
          </el-table-column>
          <!-- width="100px" -->
          <el-table-column label="类型">
            <template slot-scope="scope">
              {{ scope.row.type }}
            </template>
          </el-table-column>
          <!-- width="100px" -->
          <el-table-column label="声音">
            <template slot-scope="scope">
              {{ scope.row.voiceName }}
            </template>
          </el-table-column>
          <el-table-column label="修改时间" width="135px">
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
        title="批量配置机器人"
        :visible.sync="setrobotGroup.visible"
        width="40%"
      >
        <el-form
          :model="setrobotGroup.form"
          ref="multipleRobotConfirm"
          labelWidth="100px"
        >
          <el-form-item prop="alertRuleIds" label="监控规则Id:">
            <el-tag v-for="tag in setrobotGroup.form.alertRuleIds" :key="tag">{{
              tag
            }}</el-tag>
          </el-form-item>
          <el-form-item label="机器人类型:" label-width="100px">
            <el-select v-model="setrobotGroup.form.robotType">
              <el-option
                v-for="item in robotoptions"
                :key="item.key"
                :label="item.label"
                :value="item.key"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="robotIds" label="监控机器人:">
            <el-input v-model="robotIds"></el-input>
          </el-form-item>
          <el-form-item prop="robotSecond_lable" label="二级机器人标签:">
            <el-input v-model="setrobotGroup.form.robotSecond_lable"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="multipleRobotConfirm"
            >添加监控项的机器人配置</el-button
          >
          <el-button type="primary" @click="multipleAlertRuleDelete"
            >删除监控项</el-button
          >
          <el-button type="primary" @click="multipleAlertRuleRobotDelete"
            >删除监控项的机器人</el-button
          >
          <el-button @click="cancelEdit">取 消</el-button>
        </span>
      </el-dialog>
      <!-- 监控项-->
      <el-dialog
        v-loading.fullscreen.lock="patchloading"
        title="监控项属性"
        :visible.sync="editGroup.monitoringGroup"
        width="80%"
      >
        <el-form
          :model="editGroup.form"
          ref="monitoringForm"
          label-width="200px"
        >
          <el-form-item label="id">
            <el-input
              readonly
              v-model="editGroup.form.id"
              style="width: 100px"
            ></el-input>
          </el-form-item>
          <el-form-item label="监控名(record/alert)">
            <el-input
              v-model="editGroup.form.ruleName"
              style="width:500px"
            ></el-input>
          </el-form-item>
          <el-form-item label="expr">
            <textarea
              v-model="editGroup.form.ruleQuery"
              style="width: 1000px"
            ></textarea>
          </el-form-item>
          <el-form-item label="for" v-if="editGroup.form.type === 'alerting'">
            <el-input
              v-model="editGroup.form.ruleDuration"
              style="width: 100px"
            ></el-input>
          </el-form-item>
          <el-form-item prop="ruleLabels" label="label">
            <el-input
              placeholder="请输入标签key"
              v-model="ruleLabelsEditKey"
              style="width: 200px"
            ></el-input>
            :
            <el-input
              placeholder="请输入标签value"
              v-model="ruleLabelsEditValue"
              style="width: 200px"
            ></el-input>
            <el-button type="primary" @click="addJsonKeyValue('patch', 'label')"
              >添加key和value</el-button
            >
            <br />
            <el-tag
              class="el-tag"
              closable
              @close="tagClose(key, 'patch', 'label')"
              v-for="(value, key) in editGroup.form.ruleLabels"
              :key="key"
              >{{ key }}: {{ value }}
            </el-tag>
          </el-form-item>
          <el-form-item
            label="annotations"
            v-if="editGroup.form.type === 'alerting'"
          >
            <el-input
              placeholder="请输入key"
              v-model="ruleAnnotationEditKey"
              style="width: 200px"
            ></el-input>
            :
            <el-input
              placeholder="请输入value"
              v-model="ruleAnnotationEditValue"
              style="width: 800px"
            ></el-input>
            <el-button
              type="primary"
              @click="addJsonKeyValue('patch', 'annotation')"
              >添加key和value</el-button
            >
            <br />
            <div
              v-for="(value, key) in editGroup.form.ruleAnnotations"
              :key="key"
              class="el-tag"
            >
              <el-tag closable @close="tagClose(key, 'patch', 'annotation')"
                >{{ key }}: {{ value }}</el-tag
              >
            </div>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="monitoringEditConfirm"
            >确 定</el-button
          >
          <el-button @click="cancelEdit">取 消</el-button>
        </span>
      </el-dialog>
      <!-- 监控项详情 -->
      <el-dialog
        v-loading.fullscreen.lock="patchloading"
        title="监控项详情"
        :visible.sync="editGroup.visible"
        width="80%"
      >
        <el-form
          :model="editGroup.form"
          ref="monitoringForm"
          label-width="200px"
        >
          <div class="el-col">
            <el-form-item label="运维电话">
              <el-switch v-model="editGroup.form.callOpsFlag"></el-switch>
            </el-form-item>
            <el-form-item label="开发电话">
              <el-switch v-model="editGroup.form.callDevFlag"></el-switch>
            </el-form-item>
            <el-form-item label="测试电话">
              <el-switch v-model="editGroup.form.callTestFlag"></el-switch>
            </el-form-item>
            <el-form-item label="产品电话">
              <el-switch v-model="editGroup.form.callProductFlag"></el-switch>
            </el-form-item>
            <el-form-item label="群发到一级机器人">
              <el-switch v-model="editGroup.form.mutipleNoticeFlag"></el-switch>
            </el-form-item>
            <el-form-item label="@操作">
              <el-switch v-model="editGroup.form.noticeFlag"></el-switch>
            </el-form-item>
          </div>
          <el-form-item label="@操作key value">
            <el-input
              placeholder="请输入key"
              v-model="notite_key_valueEditKey"
              style="width: 200px"
            ></el-input>
            :
            <el-input
              placeholder="请输入value"
              v-model="notite_key_valueEditValue"
              style="width: 800px"
            ></el-input>
            <el-button
              type="primary"
              @click="addJsonKeyValue('patch', 'notite_key_value')"
              >添加key和value</el-button
            >
            <div
              v-for="(value, key) in editGroup.form.notite_key_value"
              :key="key"
            >
              <el-tag
                class="el-tag"
                closable
                @close="tagClose(key, 'patch', 'notite_key_value')"
                >{{ key }}: {{ value }}</el-tag
              >
            </div>
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
            <el-button type="primary" @click="addRobot('editGroup')"
              >添加</el-button
            >
            <br />
            <el-tag
              closable
              class="el-tag"
              @close="handleRobotClose(tag, 'editGroup')"
              v-for="tag in editGroup.form.robot_primary"
              :key="tag.id"
            >
              {{ tag.robot_name }}
            </el-tag>
          </el-form-item>
          <el-form-item prop="subsystems" label="子系统白名单">
            <el-autocomplete
              :loading="autocompleteloading"
              class="inline-input"
              v-model="selectSubsystem"
              :fetch-suggestions="querySearch"
              placeholder="模糊搜索"
              @select="handleSelect"
              style="width: 500px"
            ></el-autocomplete>
            <el-input
              v-model="whiteUrl"
              placeholder="接口名"
              style="width: 700px"
            ></el-input>
            <el-button type="primary" @click="addSubsystem()">添加</el-button>
            <br />
            <el-tag
              closable
              @close="handleSubsystemClose(tag)"
              v-for="tag in editGroup.form.subsystems"
              :key="tag"
            >
              {{ tag }}
            </el-tag>
          </el-form-item>
          <el-form-item label="群发标签key">
            <div v-if="editGroup.form.groupLabelKey !== null">
              <el-select
                clearable
                @visible-change="onUpdateSelectChangeGrouplabelkey($event)"
                v-model="editGroup.form.groupLabelKey.id"
                style="width:250px"
              >
                <el-option
                  v-for="item in grouplabelkeyList"
                  :key="item.id"
                  :value="item.id"
                  :label="item.key"
                ></el-option>
              </el-select>
            </div>
            <div v-else>
              <el-input
                v-model="editGroup.form.groupLabelKey"
                style="width: 200px"
              ></el-input>
            </div>
          </el-form-item>
          <el-form-item prop="autoHealPackage" label="自愈套餐">
            <el-tag
              v-for="tag in editGroup.form.autoHealPackage"
              :key="tag.id"
              >{{ tag.healName }}</el-tag
            >
          </el-form-item>
          <el-form-item label="必打电话">
            <!-- <el-tag v-if="editGroup.form.callUser" v-for="tag in editGroup.form.callUser" :key="tag">{{tag}}</el-tag> -->
            <template v-if="editGroup.form.callUser">
              <el-tag v-for="tag in editGroup.form.callUser" :key="tag">{{
                tag
              }}</el-tag>
            </template>
          </el-form-item>
          <el-form-item label="声音">
            <el-input
              v-model="editGroup.form.voiceName"
              style="width: 300px"
            ></el-input>
          </el-form-item>
          <el-form-item label="创建时间">
            <el-input
              readonly
              v-model="editGroup.form.createdTime"
              style="width: 300px"
            ></el-input>
          </el-form-item>
          <el-form-item label="修改时间">
            <el-input
              readonly
              v-model="editGroup.form.updateTime"
              style="width: 300px"
            ></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="editConfirm">确 定</el-button>
          <el-button @click="cancelEdit">取 消</el-button>
        </span>
      </el-dialog>
      <!-- 添加 -->
      <el-dialog
        v-loading.fullscreen.lock="createloading"
        title="添加监控规则"
        :visible.sync="addGroup.visible"
        width="80%"
      >
        <el-form :model="addGroup.form" ref="addForm" label-width="200px">
          <el-form-item label="prometheusUrl">
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
          <el-form-item label="监控规则组">
            <el-select
              placeholder="请选择组"
              clearable
              @visible-change="onSelectChangeGroup($event, 'add')"
              v-model="addGroup.form.groupId"
            >
              <el-option
                v-for="item in alertGroupList"
                :key="item.id"
                :value="item.id"
                :label="item.groupName"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="类型">
            <el-select v-model="addGroup.form.type">
              <el-option value="alerting" label="alerting"></el-option>
              <el-option value="recording" label="recording"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="监控名(record/alert)">
            <el-input
              v-model="addGroup.form.ruleName"
              style="width: 300px"
            ></el-input>
          </el-form-item>
          <el-form-item label="expr">
            <el-input
              v-model="addGroup.form.ruleQuery"
              style="width: 500px"
            ></el-input>
          </el-form-item>
          <el-form-item label="for" v-if="addGroup.form.type === 'alerting'">
            <el-input
              v-model="addGroup.form.ruleDuration"
              style="width: 100px"
            ></el-input>
          </el-form-item>
          <el-form-item label="label">
            <el-input
              placeholder="请输入标签key"
              v-model="ruleLabelsAddKey"
              style="width: 200px"
            ></el-input>
            :
            <el-input
              placeholder="请输入标签value"
              v-model="ruleLabelsAddValue"
              style="width: 200px"
            ></el-input>
            <el-button type="primary" @click="addJsonKeyValue('add', 'label')"
              >添加key和value</el-button
            >
            <br />
            <div v-for="(value, key) in addGroup.form.ruleLabels" :key="key">
              <el-tag
                closable
                @close="tagClose(key, 'add', 'label')"
                type="warning"
                >{{ key }}: {{ value }}</el-tag
              >
            </div>
          </el-form-item>
          <el-form-item
            label="annotations"
            v-if="addGroup.form.type === 'alerting'"
          >
            <el-input
              placeholder="请输入key"
              v-model="ruleAnnotationAddKey"
              style="width: 200px"
            ></el-input>
            :
            <el-input
              placeholder="请输入value"
              v-model="ruleAnnotationAddValue"
              style="width: 200px"
            ></el-input>
            <el-button
              type="primary"
              @click="addJsonKeyValue('add', 'annotation')"
              >添加key和value</el-button
            >
            <br />
            <div
              v-for="(value, key) in addGroup.form.ruleAnnotations"
              :key="key"
            >
              <el-tag
                closable
                @close="tagClose(key, 'add', 'annotation')"
                type="warning"
                >{{ key }}: {{ value }}</el-tag
              >
            </div>
          </el-form-item>
          <el-form-item label="运维电话">
            <el-switch v-model="addGroup.form.callOpsFlag"></el-switch>
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
            <el-button type="primary" @click="addRobot('addGroup')"
              >添加</el-button
            >
            <br />
            <el-tag
              closable
              @close="handleRobotClose(tag, 'addGroup')"
              v-for="tag in addGroup.form.robot_primary"
              :key="tag.id"
            >
              {{ tag.robot_name }}
            </el-tag>
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
      callOpsFlag: null,
      grouplabelkeyList: [],
      whiteUrl: null,
      whiteresubsystemList: [],
      whitesubsystemList: [],
      autocompleteloading: false,
      ruleLabelsAddKey: null,
      ruleLabelsAddValue: null,
      ruleAnnotationAddKey: null,
      ruleAnnotationAddValue: null,
      ruleLabelsEditKey: null,
      ruleLabelsEditValue: null,
      ruleAnnotationEditKey: null,
      ruleAnnotationEditValue: null,
      notite_key_valueEditKey: null,
      notite_key_valueEditValue: null,
      patchloading: false,
      createloading: false,
      alertGroupList: [],
      prometheusListAdd: [],
      robotList: [],
      subsystemList: [],
      selectRobotPrimaryId: null,
      selectSubsystem: null,
      prometheusList: [],
      alertRuleLabel: {},
      pageNumber: '',
      searchalertSource: null,
      searchRobotPrimary: null,
      searchalertGroup: null,
      searchalertRuleName: null,
      robotoptions: [
        { label: '一级机器人', key: 'robot_primary' },
        { label: '二级机器人', key: 'robot_second' }
      ],
      checkList: [],
      searchLableKey: '',
      searchLableValue: '',
      condition: null,
      groupId: '',
      groupName: '',
      editGroup: {
        monitoringGroup: false,
        visible: false,
        form: {
          ruleLabels: {},
          ruleAnnotations: {},
          notite_key_value: {},
          groupLabelKey: { key: null }
        }
      },
      ruleLabelsadd: null,
      ruleLabelsEdit: null,
      ruleAnnotationsadd: null,
      ruleAnnotationsEdit: null,
      addGroup: {
        visible: false,
        form: {
          prometheusUrl: undefined,
          ruleName: undefined,
          ruleQuery: undefined,
          ruleDuration: undefined,
          ruleLabels: {},
          ruleAnnotations: {},
          callOpsFlag: false,
          robot_primary: [],
          groupId: undefined,
          type: undefined
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
  mounted () {
    document.onkeydown = event => {
      var code = event.keyCode
      if (code == 13) {
        //这是键盘的enter监听事件
        this.onSearchAlertRule()
      }
    }
  },
  methods: {
    async onUpdateSelectChangeGrouplabelkey (callback) {
      if (callback) {
        let resGrouplabelkey = await this.$http.getGroupLabelKeyApi()
        this.grouplabelkeyList = resGrouplabelkey.results
        this.editGroup.form.groupLabelKey.id = ''
      }
    },
    async handleSelect (item) {
      this.autocompleteloading = true
      console.log(item)
      this.selectSubsystem = item.value
      console.log(this.selectSubsystem)
    },
    createFilter (queryString) {
      return restaurant => {
        return (
          restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) > -1
        )
      }
    },
    async querySearch (queryString, cb) {
      this.whiteresubsystemList = []
      this.whitesubsystemList = []
      let resSubsystem = await this.$http.getsubsystemapi({
        ordering: 'subsystemname'
      })
      this.whitesubsystemList = resSubsystem.results
      this.whitesubsystemList.forEach(val => {
        this.whiteresubsystemList.push({
          value: val.subsystemname
        })
      })
      var restaurants = this.whiteresubsystemList
      var results = queryString
        ? this.whiteresubsystemList.filter(
            this.createFilter(queryString.replace(/(^\s*)|(\s*$)/g, ''))
          )
        : this.whiteresubsystemList
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    tagClose (key, type, alertKey) {
      if (type === 'patch') {
        if (alertKey === 'label') {
          this.$delete(this.editGroup.form.ruleLabels, key)
        } else if (alertKey === 'annotation') {
          this.$delete(this.editGroup.form.ruleAnnotations, key)
        } else if (alertKey === 'notite_key_value') {
          this.$delete(this.editGroup.form.notite_key_value, key)
        }
      } else if (type === 'add') {
        if (alertKey === 'label') {
          this.$delete(this.addGroup.form.ruleLabels, key)
        } else if (alertKey === 'annotation') {
          this.$delete(this.addGroup.form.ruleAnnotations, key)
        }
      }
    },
    addJsonKeyValue (type, alertKey) {
      if (type === 'add') {
        if (alertKey === 'label') {
          console.log(this.addGroup.form)
          this.addGroup.form.ruleLabels[
            [this.ruleLabelsAddKey]
          ] = this.ruleLabelsAddValue
          this.ruleLabelsAddKey = null
          this.ruleLabelsAddValue = null
        } else if (alertKey === 'annotation') {
          this.addGroup.form.ruleAnnotations[
            [this.ruleAnnotationAddKey]
          ] = this.ruleAnnotationAddValue
          this.ruleAnnotationAddKey = null
          this.ruleAnnotationAddValue = null
        }
      } else if (type === 'patch') {
        if (alertKey === 'label') {
          if (this.editGroup.form.ruleLabels === null) {
            this.editGroup.form.ruleLabels = {}
          }
          this.editGroup.form.ruleLabels[
            [this.ruleLabelsEditKey]
          ] = this.ruleLabelsEditValue
          this.ruleLabelsEditKey = null
          this.ruleLabelsEditValue = null
        } else if (alertKey === 'annotation') {
          this.editGroup.form.ruleAnnotations[
            [this.ruleAnnotationEditKey]
          ] = this.ruleAnnotationEditValue
          this.ruleAnnotationEditKey = null
          this.ruleAnnotationEditValue = null
        } else if (alertKey === 'notite_key_value') {
          this.editGroup.form.notite_key_value[
            [this.notite_key_valueEditKey]
          ] = this.notite_key_valueEditValue
          this.notite_key_valueEditKey = null
          this.notite_key_valueEditValue = null
        } else {
        }
      } else {
      }
    },
    addAlertRule () {
      this.addGroup.visible = true
      this.addGroup.form = {
        prometheusUrl: undefined,
        ruleName: undefined,
        ruleQuery: undefined,
        ruleDuration: undefined,
        ruleLabels: {},
        ruleAnnotations: {},
        callOpsFlag: false,
        robot_primary: [],
        groupId: undefined
      }
      this.ruleLabelsadd = null
      this.ruleAnnotationsadd = null
    },
    handleRobotClose (tag, type) {
      if (type === 'editGroup') {
        this.editGroup.form.robot_primary.splice(
          this.editGroup.form.robot_primary.findIndex(item => item === tag),
          1
        )
      } else if (type === 'addGroup') {
        this.addGroup.form.robot_primary.splice(
          this.addGroup.form.robot_primary.findIndex(item => item === tag),
          1
        )
      } else {
      }
    },
    handleSubsystemClose (tag) {
      this.editGroup.form.subsystems.splice(
        this.editGroup.form.subsystems.findIndex(item => item === tag),
        1
      )
    },

    addSubsystem () {
      console.log(this.selectSubsystem)
      if (this.selectSubsystem !== null && this.whiteUrl !== null) {
        if (
          this.editGroup.form.subsystems.indexOf(
            this.selectSubsystem + '+' + this.whiteUrl
          ) > -1
        ) {
          this.$message.error('重复,请勿添加!')
        } else {
          this.editGroup.form.subsystems.push(
            this.selectSubsystem + '+' + this.whiteUrl
          )
        }
      }
      this.selectSubsystem = null
      this.whiteUrl = null
      console.log(this.editGroup.form.subsystems)
    },
    addRobot (type) {
      if (this.selectRobotPrimaryId !== null) {
        if (type === 'editGroup') {
          this.robotList.forEach(value => {
            if (value.id === this.selectRobotPrimaryId) {
              this.editGroup.form.robot_primary.push({
                id: this.selectRobotPrimaryId,
                robot_name: value.robot_name
              })
            }
          })
        } else if (type === 'addGroup') {
          this.robotList.forEach(value => {
            if (value.id === this.selectRobotPrimaryId) {
              this.addGroup.form.robot_primary.push({
                id: this.selectRobotPrimaryId,
                robot_name: value.robot_name
              })
            }
          })
        } else {
        }
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
    async onSelectChangeSubsystem (callback) {
      if (callback) {
        this.subsystemList = []
        let resSubsystem = await this.$http.searchSubsystemApi()
        resSubsystem.results.forEach(value => {
          this.subsystemList.push(value.subsystemname)
        })
      }
    },
    async onSelectChangeGroup (callback, type) {
      if (callback) {
        this.alertGroupList = []
        if (type === 'add') {
          if (this.addGroup.form.prometheusUrl) {
            const param = {
              alertSource__icontains: this.addGroup.form.prometheusUrl
            }
            let resGroup = await this.$http.get_alertGroup(param)
            this.alertGroupList = resGroup.results
          } else {
            this.$message.error('请先选择prometheus地址!')
          }
        } else if (type === 'select') {
          if (this.searchalertSource) {
            const param = { alertSource__icontains: this.searchalertSource }
            let resGroup = await this.$http.get_alertGroup(param)
            this.alertGroupList = resGroup.results
            console.log(this.alertGroupList)
          } else {
            this.$message.error('请先选择prometheus地址!')
          }
        } else {
          this.alertGroupList = []
        }
      }
    },
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
    async deleteUnuseRule () {
      this.$confirm('确认删除无效监控项?', '提示', { type: 'warning' }).then(
        async () => {
          let res = await this.$http.deleteUnuseeRuleApi()
          this.$message.success('删除无效监控项成功')
        }
      )
    },
    async syncAlertRuleRobot () {
      this.$confirm('确认同步?', '提示', { type: 'warning' }).then(async () => {
        let res = await this.$http.syncalertrulerobotapi()
        this.$message.success('根据channel同步机器人成功')
      })
    },
    async onSearchAlertRule () {
      const param = {}
      if (this.searchalertSource) {
        param['alertSource'] = this.searchalertSource
      }
      if (this.searchalertGroup) {
        param['groupName'] = this.searchalertGroup
      }
      if (this.searchalertRuleName) {
        param['ruleName__icontains'] = this.searchalertRuleName
      }
      if (this.searchRobotPrimary) {
        param['robot_primary'] = this.searchRobotPrimary
      }
      if (this.searchLableKey && this.searchLableValue) {
        param['ruleLabels'] = {
          searchLableKey: this.searchLableKey,
          searchLableValue: this.searchLableValue
        }
      }
      if (this.callOpsFlag !== null) {
        param['callOpsFlag'] = this.callOpsFlag
      }
      let res = await this.$http.get_alertRule(param)
      this.$refs.alertrulelist.setData(res.results, res.count)
      this.condition = param
    },
    async getCheckList (val) {
      this.checkList = []
      val.map(item => {
        this.checkList.push(item.id)
      })
    },
    openaddrobot () {
      if (this.checkList.length !== 0) {
        this.setrobotGroup.visible = true
        this.setrobotGroup.form.alertRuleIds = this.checkList
        this.setrobotGroup.form.robotType = ''
      } else {
        this.$message.error('请先添加!')
      }
    },
    deleteSafeGroup (id) {
      this.$confirm('确认删除?', '提示', { type: 'warning' })
        .then(async () => {
          let res = await this.$http.deleteAlertruleApi({ id: id })
          if (res.hasOwnProperty('results')) {
            this.$message.success('删除成功!')
          } else {
            this.$message.error('删除失败!')
          }
          this.$refs.alertrulelist.getData()
          this.setrobotGroup.form = {}
          this.checkList = []
        })
        .catch(_ => {})
    },
    multipleAlertRuleDelete () {
      this.$confirm('确认删除监控项吗?', '提示', { type: 'warning' }).then(
        async () => {
          const param = {
            id: 'multiple',
            alertRuleIds: this.setrobotGroup.form.alertRuleIds,
            robotType: this.setrobotGroup.form.robotType,
            robotIds: this.setrobotGroup.form.robotIds
          }
          let res = await this.$http.deleteAlertruleApi(param)
          this.setrobotGroup.form.alertRuleIds = []
          this.$refs.alertrulelist.getData()
          this.checkList.length = 0
          this.setrobotGroup.visible = false
          console.log('this.checkList after delete', this.checkList)
        }
      )
    },
    multipleAlertRuleRobotDelete () {
      this.$confirm('确认删除监控项的机器人吗?', '提示', {
        type: 'warning'
      }).then(async () => {
        this.setrobotGroup.form.robotIds = this.robotIds.split(',')
        const param = {
          id: 'multiple',
          alertRuleIds: this.setrobotGroup.form.alertRuleIds,
          robotType: this.setrobotGroup.form.robotType,
          robotIds: this.setrobotGroup.form.robotIds
        }
        let res = await this.$http.deleteAlertruleRobotApi(param)
        this.setrobotGroup.form = {}
        this.checkList = []
        this.setrobotGroup.visible = false
        this.$refs.alertrulelist.getData()
      })
    },
    multipleRobotConfirm () {
      this.$refs.multipleRobotConfirm.validate(async v => {
        if (v) {
          this.setrobotGroup.form.robotIds = this.robotIds.split(',')
          if (this.setrobotGroup.form.robotType.length === 0) {
            this.$message.error('机器人类型请选择！')
          } else {
            const param = {
              robotType: this.setrobotGroup.form.robotType,
              robotIds: this.setrobotGroup.form.robotIds,
              alertRuleIds: this.setrobotGroup.form.alertRuleIds,
              robotSecond_lable: this.setrobotGroup.form.robotSecond_lable
            }
            let res = await this.$http.multipleaddrobot(param)
            this.setrobotGroup.form = {}
            this.checkList = []
            this.setrobotGroup.visible = false
            this.$refs.alertrulelist.getData()
          }
        }
      })
    },
    async edit (row) {
      this.editGroup.visible = true
      this.ruleLabelsEdit = null
      this.ruleAnnotationsEdit = null
      this.selectSubsystem = null
      let resGrouplabelkeylist = await this.$http.getGroupLabelKeyApi()
      this.grouplabelkeyList = resGrouplabelkeylist.results
      let res = await this.$http.getDetailAlertRuleApi({ id: row.id })
      if (res.hasOwnProperty('results')) {
        this.editGroup.form = res.results
        console.log('this.editGroup.form', this.editGroup.form)
      } else {
        this.$message.error('详情出错!')
      }
      if (this.editGroup.form.groupLabelKey === null) {
        this.editGroup.form.groupLabelKey = { id: '', key: '' }
      }
    },
    async monitoringItems (row) {
      this.editGroup.monitoringGroup = true
      this.ruleLabelsEdit = null
      this.ruleAnnotationsEdit = null
      this.selectSubsystem = null
      let resGrouplabelkeylist = await this.$http.getGroupLabelKeyApi()
      this.grouplabelkeyList = resGrouplabelkeylist.results
      let res = await this.$http.getDetailAlertRuleApi({ id: row.id })
      if (res.hasOwnProperty('results')) {
        this.editGroup.form = res.results
        console.log('this.editGroup.form', this.editGroup.form)
      } else {
        this.$message.error('详情出错!')
      }
      if (this.editGroup.form.groupLabelKey === null) {
        this.editGroup.form.groupLabelKey = { id: '', key: '' }
      }
    },
    addConfirm () {
      this.$confirm('确认添加?', '提示', { type: 'warning' }).then(async () => {
        this.createloading = true
        const robot_primary = []
        this.addGroup.form.robot_primary.forEach(val => {
          robot_primary.push(val.id)
        })
        const param = {
          ruleName: this.addGroup.form.ruleName,
          ruleQuery: this.addGroup.form.ruleQuery,
          ruleDuration: this.addGroup.form.ruleDuration,
          ruleLabels: this.addGroup.form.ruleLabels,
          ruleAnnotations: this.addGroup.form.ruleAnnotations,
          callOpsFlag: this.addGroup.form.callOpsFlag,
          alertGroup: this.addGroup.form.groupId,
          type: this.addGroup.form.type,
          robot_primary: robot_primary
        }
        console.log(param)
        let res = await this.$http.createAlertRuleApi(param)
        if (res.hasOwnProperty('results')) {
          this.addGroup.visible = false
          this.$message.success('添加成功!')
          this.$refs.alertrulelist.getData()
        } else {
          this.$message.error('添加失败!')
        }
        this.createloading = false
      })
    },
    editConfirm () {
      this.$confirm('确认修改?', '提示', { type: 'warning' }).then(async () => {
        this.patchloading = true
        const robot_primary = []
        this.editGroup.form.robot_primary.forEach(val => {
          robot_primary.push(val.id)
        })
        const param = {
          id: this.editGroup.form.id,
          callOpsFlag: this.editGroup.form.callOpsFlag,
          callDevFlag: this.editGroup.form.callDevFlag,
          callTestFlag: this.editGroup.form.callTestFlag,
          callProductFlag: this.editGroup.form.callProductFlag,
          mutipleNoticeFlag: this.editGroup.form.mutipleNoticeFlag,
          noticeFlag: this.editGroup.form.noticeFlag,
          notite_key_value: this.editGroup.form.notite_key_value,
          robot_primary: robot_primary,
          subsystems: this.editGroup.form.subsystems,
          groupLabelKey: this.editGroup.form.groupLabelKey.id,
          voiceName: this.editGroup.form.voiceName
        }
        console.log(param)
        let res = await this.$http.patchAlertRuleApi(param)
        if (res.hasOwnProperty('results')) {
          this.$message.success('修改成功!')
        } else {
          this.$message.error('修改失败!')
        }
        this.patchloading = false
        this.editGroup.visible = false
        this.$refs.alertrulelist.getData()
      })
    },
    monitoringEditConfirm () {
      this.$confirm('确认修改?', '提示', { type: 'warning' }).then(async () => {
        this.patchloading = true
        const robot_primary = []
        this.editGroup.form.robot_primary.forEach(val => {
          robot_primary.push(val.id)
        })
        const param = {
          id: this.editGroup.form.id,
          ruleName: this.editGroup.form.ruleName,
          ruleQuery: this.editGroup.form.ruleQuery,
          ruleDuration: this.editGroup.form.ruleDuration,
          ruleLabels: this.editGroup.form.ruleLabels,
          ruleAnnotations: this.editGroup.form.ruleAnnotations
        }
        let res = await this.$http.patchMonitoringAlertRuleApi(param)
        if (res.hasOwnProperty('results')) {
          this.$message.success('修改成功!')
        } else {
          this.$message.error('修改失败!')
        }
        this.patchloading = false
        this.editGroup.monitoringGroup = false
        this.$refs.alertrulelist.getData()
      })
    },
    cancelEdit () {
      this.setrobotGroup.visible = false
      this.editGroup.visible = false
      this.editGroup.monitoringGroup = false
      this.addGroup.visible = false
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
.el-col {
  display: flex;
}
.el-tag {
  margin-right: 10px;
}
</style>
