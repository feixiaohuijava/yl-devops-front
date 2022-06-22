<template>
  <div class="main">
    <div class="wrapper wrapper-content" v-loading="editGroupLoading">
      <d-table
        url="/api/cmdb/applicationinstance/"
        ref="applicationinstancelist"
        v-if="!showDetail"
        :conditionForm="condition"
        @SelectionChange="getCheckList"
      >
        <template slot="headerRight">
          <el-form-item>
            <el-input
              :placeholder="placeholder"
              v-model="searchApplicationname"
              class="input-search"
              style="width: 200px"
            >
            </el-input>
          </el-form-item>
          <el-form-item
            prop="locationFlag"
            label="开启应用名精准搜索:"
            class="accurate-search"
          >
            <el-switch
              :inactive-value="false"
              :active-value="true"
              v-model="accurateSearch"
              @change="stateSearch"
            ></el-switch>
          </el-form-item>
          <el-form-item>
            <el-select
              placeholder="请选择集群"
              clearable
              @visible-change="onSelectChangeCluster($event)"
              v-model="searchCluster"
              style="width:160px"
            >
              <el-option
                v-for="item in clusterList"
                :key="item.id"
                :value="item.id"
                :label="item.clusterName"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select
              placeholder="请选择命名空间"
              clearable
              v-model="searchNamespace"
              @visible-change="onSearchNameKubernetes($event)"
              style="width:300px"
            >
              <el-option
                v-for="item in searchKubernetesList"
                :key="item.id"
                :value="item.namespaceName"
                :label="item.namespaceName"
              ></el-option>
            </el-select>
            <!-- 二级联动选择器 -->
            <!-- <el-cascader
              v-model="searchNamespace"
              :props="namespaceProps"
              placeholder="请选择命名空间"
              clearble
              :show-all-levels="true"
              style="width:300px"
            ></el-cascader> -->
          </el-form-item>
          <br />
          <el-form-item>
            <!-- <el-select
              placeholder="请输入区域"
              clearable
              @visible-change="onSelectChangeArea($event)"
              v-model="searchArea"
              style="width:160px"
            >
              <el-option
                v-for="item in areaList"
                :key="item.id"
                :value="item.id"
                :label="item.name"
              ></el-option>
            </el-select> -->
            <e-select
              width="160px"
              url="/api/cmdb/area/"
              placeholder="请输入区域"
              @onValue="getAreaValue"
              chang-list="area"
            ></e-select>
          </el-form-item>
          <el-form-item>
            <!-- <el-select
              placeholder="请选择项目"
              clearable
              @visible-change="onSelectChangeProject($event)"
              v-model="searchProject"
              style="width:160px"
            >
              <el-option
                v-for="item in projectList"
                :key="item.id"
                :value="item.id"
                :label="item.projectName"
              ></el-option>
            </el-select> -->
            <e-select
              width="160px"
              url="/api/cmdb/project/"
              placeholder="请选择项目"
              @onValue="getProjectValue"
              chang-list="project"
            ></e-select>
          </el-form-item>
          <el-form-item>
            <!-- <el-select
              placeholder="请选择环境"
              clearable
              @visible-change="onSelectChnageEnvironment($event)"
              v-model="searchEnvironment"
              style="width:160px"
            >
              <el-option
                v-for="item in environmentListSelect"
                :key="item.id"
                :value="item.id"
                :label="item.name"
              ></el-option>
            </el-select> -->
            <e-select
              :params="{ type: '应用' }"
              width="160px"
              url="/api/cmdb/environment/"
              placeholder="请选择环境"
              @onValue="getEnvironmentValue"
              chang-list="environment"
            ></e-select>
          </el-form-item>
          <el-form-item>
            <el-select
              placeholder="请选择应用类型"
              clearable
              v-model="searchApplicationType"
            >
              <el-option value="1" label="云主机应用"></el-option>
              <el-option value="2" label="容器应用"></el-option>
              <el-option value="3" label="前端应用"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button
              icon="el-icon-search"
              type="primary"
              @click="onSearchValue"
              >查询</el-button
            >
          </el-form-item>
          <el-form-item>
            <el-button
              icon="el-icon-refresh"
              v-loading="syncAppInLoading"
              type="primary"
              @click="syncApplicationInstance"
              >同步应用
            </el-button>
          </el-form-item>
          <el-form-item class="el-icon-plus-btn">
            <el-button icon="el-icon-plus" type="primary" @click="add"
              >添加</el-button
            >
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="toApplicationinDetails"
              >进入详情</el-button
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
          <el-table-column label="id" width="80px">
            <template slot-scope="scope">
              {{ scope.row.id }}
            </template>
          </el-table-column>
          <el-table-column label="应用名" width="150px">
            <template slot-scope="scope">
              <div class="group-name">
                <router-link
                  :to="{
                    name: 'cmdb_applicationinstance_detail',
                    params: { id: scope.row.id }
                  }"
                  >{{ scope.row.applicationName }}
                </router-link>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="应用类型" width="150px">
            <template slot-scope="scope">
              {{ scope.row.applicationType }}
            </template>
          </el-table-column>
          <el-table-column label="区域">
            <template slot-scope="scope" v-if="scope.row.area">
              {{ scope.row.area.name }}
            </template>
          </el-table-column>
          <el-table-column label="项目">
            <template slot-scope="scope">
              <div v-if="scope.row.project !== null">
                {{ scope.row.project.projectName }}
              </div>
              <div v-else>
                {{ scope.row.project }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="子系统">
            <template slot-scope="scope">
              <div v-if="scope.row.subsystem !== null">
                {{ scope.row.subsystem.subsystemname }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="环境" width="80px">
            <template slot-scope="scope">
              <div v-if="scope.row.environment !== null">
                {{ scope.row.environment.name }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="命名空间">
            <template slot-scope="scope">
              <div v-if="scope.row.namespace !== null">
                {{ scope.row.namespace.namespaceName }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="集群">
            <template slot-scope="scope">
              <div v-if="scope.row.cluster !== null">
                {{ scope.row.cluster.clusterName }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="域名">
            <template slot-scope="scope">
              {{ scope.row.domainname }}
            </template>
          </el-table-column>
          <el-table-column label="部署">
            <template slot-scope="scope">
              <div v-if="scope.row.locationFlag === true">
                <el-tag type="success">是</el-tag>
              </div>
              <div v-else>
                <el-tag type="info">否</el-tag>
              </div>
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
      <!-- 添加应用 -->
      <el-dialog title="添加应用" :visible.sync="addGroup.visible" width="40%">
        <el-form
          :model="addGroup.form"
          :rules="rules"
          ref="addForm"
          labelWidth="110px"
        >
          <el-form-item label="应用类型" prop="applicationType">
            <el-select
              placeholder="请选择应用类型"
              clearable
              v-model="addGroup.form.applicationType"
              @change="frontOrBack()"
            >
              <!-- <el-option value="1" label="云主机应用"></el-option> -->
              <el-option value="2" label="容器应用"></el-option>
              <el-option value="3" label="前端应用"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="applicationName" label="应用名">
            <el-input
              :disabled="isAddDisabled"
              v-model="addGroup.form.applicationName"
              style="width: 200px"
            ></el-input>
          </el-form-item>
          <el-form-item label="子系统" prop="subsystem">
            <!-- 三级联动选择器 -->
            <!-- <el-cascader
              v-model="addGroup.form.project"
              :props="projectProps"
              placeholder="请选择"
              clearble
              :show-all-levels="true"
              style="width:500px"
            ></el-cascader> -->
            <el-autocomplete
              :disabled="isAddDisabled"
              :loading="autocompleteloading"
              class="inline-input"
              v-model="addGroup.form.subsystemname"
              :fetch-suggestions="querySearch"
              placeholder="模糊搜索"
              @select="handleSelect"
              style="width: 500px"
            ></el-autocomplete>
          </el-form-item>
          <el-form-item prop="applicationName" label="区域">
            <el-input
              :disabled="isAddDisabled"
              readonly
              v-model="areaName"
              style="width: 200px"
            ></el-input>
            <!-- <el-select
              placeholder="请选择环境"
              clearble
              @visible-change="onUpdateSelectChangeEnv($event, 'add')"
              v-model="addGroup.form.area"
            >
              <el-option
                v-for="item in areaList"
                :key="item.id"
                :value="item.id"
                :label="item.name"
              ></el-option>
            </el-select> -->
          </el-form-item>
          <el-form-item prop="applicationName" label="项目名">
            <el-input
              :disabled="isAddDisabled"
              readonly
              v-model="addGroup.form.projectName"
              style="width: 200px"
            ></el-input>
          </el-form-item>
          <el-form-item prop="environment" label="环境">
            <el-select
              :disabled="isAddDisabled"
              placeholder="请选择环境"
              clearble
              @visible-change="onUpdateSelectChangeEnv($event, 'add')"
              v-model="addGroup.form.environment"
            >
              <el-option
                v-for="item in environmentList"
                :key="item.id"
                :value="item.id"
                :label="item.name"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="命名空间" prop="namespace" v-if="isShow">
            <!-- 二级联动选择器 -->
            <el-cascader
              :disabled="isAddDisabled"
              v-model="addGroup.form.namespace"
              :props="namespaceProps"
              placeholder="请选择命名空间"
              clearble
              :show-all-levels="true"
              style="width:500px"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="类型" prop="kind" v-if="isShow">
            <el-select
              :disabled="isAddDisabled"
              placeholder="请选择类型"
              clearable
              v-model="addGroup.form.kind"
            >
              <el-option value="deployment" label="无状态"></el-option>
              <el-option value="stateful" label="有状态"></el-option>
              <el-option value="daemonset" label="守护进程集"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="locationFlag" label="部署" v-if="isShow">
            <el-switch
              :disabled="isAddDisabled"
              v-model="addGroup.form.locationFlag"
              :active-value="true"
              :inactive-value="false"
            ></el-switch>
          </el-form-item>
          <el-form-item prop="choiceEs" label="ES" v-if="isShow">
            <!-- 二级联动选择器 -->
            <el-cascader
              :disabled="isAddDisabled"
              v-model="addGroup.form.searchIndex"
              :props="props"
              placeholder="请选择ES"
              clearable
              :show-all-levels="true"
              style="width:500px"
            ></el-cascader>
          </el-form-item>
          <el-form-item prop="description" label="备注">
            <el-input
              :disabled="isAddDisabled"
              v-model="addGroup.form.description"
              type="textarea"
              :rows="2"
              placeholder="请输入内容"
              style="width: 95%"
            ></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button
            type="primary"
            @click="addConfirm"
            :disabled="isAddDisabled"
            >确 定</el-button
          >
          <el-button @click="cancelEdit('add')">取 消</el-button>
        </span>
      </el-dialog>
      <!-- 应用详情对话框 -->
      <el-dialog title="应用详情" :visible.sync="editGroup.visible" width="50%">
        <el-form :model="editGroup.form" ref="editForm" label-width="100px">
          <el-form-item prop="id" label="id">
            <el-input
              v-model="editGroup.form.id"
              readonly
              style="width: 200px"
            ></el-input>
          </el-form-item>
          <el-form-item prop="applicationName" label="应用名">
            <el-input
              v-model="editGroup.form.applicationName"
              readonly
              style="width:500px"
            ></el-input>
          </el-form-item>
          <el-form-item label="区域">
            <el-select
              clearable
              @visible-change="onUpdateSelectChangeArea($event)"
              v-model="editGroup.form.area"
              style="width:160px"
            >
              <el-option
                v-for="item in areacList"
                :key="item.id"
                :value="item.id"
                :label="item.name"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="项目名">
            <div v-if="editGroup.form.project !== null">
              <el-select
                clearable
                @visible-change="onUpdateSelectChangeProject($event)"
                v-model="editGroup.form.project.id"
                style="width:160px"
              >
                <el-option
                  v-for="item in projectList"
                  :key="item.id"
                  :value="item.id"
                  :label="item.projectName"
                ></el-option>
              </el-select>
            </div>
            <div v-else>
              <el-input
                v-model="editGroup.form.project"
                style="width: 300px"
              ></el-input>
            </div>
          </el-form-item>
          <el-form-item prop="subsystem" label="子系统">
            <div v-if="editGroup.form.subsystem !== null">
              <!--  :disabled="isSubsystem" -->
              <el-select
                :filterable="true"
                :filter-method="myFilter"
                clearble
                @visible-change="onUpdateSelectChangeSubsystem($event)"
                v-model="editGroup.form.subsystem.id"
                style="width:500px"
              >
                <el-option
                  v-for="item in searchSubsystemList"
                  :key="item.id"
                  :value="item.id"
                  :label="item.subsystemname"
                ></el-option>
              </el-select>
            </div>
          </el-form-item>
          <el-form-item label="命名空间" prop="namespace" v-if="isEditShow">
            <!-- 二级联动选择器 -->
            <!-- <el-cascader
              v-model="editGroup.form.namespace"
              :props="namespaceProps"
              placeholder="请选择命名空间"
              clearble
              :show-all-levels="true"
              style="width:500px"
            ></el-cascader> -->
            <!--  @change="onSearchEditCh" -->
            <div v-if="editGroup.form.cluster !== null" class="namespace">
              <el-select
                placeholder="请选择集群"
                clearable
                v-model="editGroup.form.cluster.id"
                style="width:300px"
                @change="onSearchNamespace"
              >
                <el-option
                  v-for="item in clusterList"
                  :key="item.id"
                  :value="item.id"
                  :label="item.clusterName"
                ></el-option>
              </el-select>
            </div>
            <span> +</span>
            <div v-if="editGroup.form.namespace !== null" class="namespace">
              <el-select
                placeholder="请选择命名空间"
                clearable
                v-model="editGroup.form.namespace.id"
                style="width:300px"
              >
                <el-option
                  v-for="item in kubernetesnamespaceList"
                  :key="item.id"
                  :value="item.id"
                  :label="item.namespaceName"
                ></el-option>
              </el-select>
            </div>
          </el-form-item>
          <el-form-item prop="environment" label="环境">
            <div v-if="editGroup.form.environment !== null">
              <el-select
                clearble
                @visible-change="onUpdateSelectChangeEnv($event)"
                v-model="editGroup.form.environment.id"
              >
                <el-option
                  v-for="item in environmentList"
                  :key="item.id"
                  :value="item.id"
                  :label="item.name"
                ></el-option>
              </el-select>
            </div>
          </el-form-item>
          <el-form-item prop="domainname" label="域名">
            <el-input
              v-model="editGroup.form.domainname"
              style="width: 500px"
            ></el-input>
          </el-form-item>
          <el-form-item prop="locationFlag" label="部署">
            <el-switch
              v-model="editGroup.form.locationFlag"
              :active-value="true"
              :inactive-value="false"
            ></el-switch>
          </el-form-item>
          <el-form-item
            prop="es"
            label="ES"
            v-if="editGroup.form.searchIndex !== null && isEditShow"
          >
            <el-select
              placeholder="请选择"
              clearable
              @change="onSearchEditCh"
              v-model="editGroup.form.searchIndex.chEs"
              style="width:300px"
            >
              <el-option
                v-for="item in editCh"
                :key="item.id"
                :value="item.value"
                :label="item.label"
              ></el-option>
            </el-select>
            +
            <el-select
              placeholder="请选择"
              clearable
              v-model="editGroup.form.searchIndex.egEs"
              @change="onSearchEditEs"
              style="width:300px"
            >
              <el-option
                v-for="item in editEg"
                :key="item.id"
                :value="item.value"
                :label="item.label"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="create_at" label="创建时间:">
            <el-input
              v-model="editGroup.form.createdTime"
              readonly
              style="width: 300px"
            ></el-input
          ></el-form-item>
          <el-form-item prop="create_at" label="修改时间:">
            <el-input
              v-model="editGroup.form.updateTime"
              readonly
              style="width: 300px"
            ></el-input
          ></el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="editConfirm" :disabled="isDisabled"
            >确 定</el-button
          >
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
      // 搜索
      isEditShow: false,
      isDisabled: false,
      isAddDisabled: true,
      searchProject: null,
      searchCluster: null,
      autocompleteloading: false,
      searchArea: '',
      searchApplicationname: null,
      searchNamespace: null,
      searchEnvironment: null,
      searchApplicationType: null,
      searchKind: null,
      subsystemList: [],
      resubsystemList: [],
      projectList: [],
      subsystemList: [],
      areaList: [],
      searchSubsystemList: [],
      environmentList: [],
      environmentListSelect: [],
      searchNamespaceList: [],
      syncAppInLoading: false,
      editGroupLoading: false,
      clusterList: [],
      areacList: [],
      kubernetesnamespaceList: [],
      searchKubernetesList: [],
      namespaceList: [],
      condition: null,
      groupId: '',
      groupName: '',
      editGroup: {
        visible: false,
        form: {
          id: null,
          applicationName: null,
          project: null,
          subsystem: null,
          environment: null,
          domainname: null,
          locationFlag: null,
          searchIndex: null,
          createdTime: null,
          updateTime: null,
          cluster: null,
          namespace: null,
          area: {}
        }
      },
      areaName: '',
      addGroup: {
        visible: false,
        form: {
          applicationName: null,
          project: null,
          projectName: null,
          subsystem: null,
          environment: null,
          locationFlag: null,
          searchIndex: null,
          description: null,
          kind: null,
          namespace: null,
          applicationType: null,
          cluster: null,
          area: null,
          subsystemname: null
        }
      },
      multipleGroup: { visible: false, form: {} },
      showDetail: false,
      detailId: '',
      detailName: '',
      activeName: '',
      buttonNew: false,
      buttonDelete: false,
      buttonChange: false,
      props: {
        expandTrigger: 'click',
        lazy: true,
        lazyLoad: this.lazyLoad
      },
      namespaceProps: {
        expandTrigger: 'click',
        lazy: true,
        lazyLoad: this.namespaceLazyLoad
      },
      projectProps: {
        expandTrigger: 'click',
        lazy: true,
        lazyLoad: this.projectLazyLoad
      },
      editCh: [],
      editEg: [],
      el_value: '',
      isShow: true,
      isSubsystem: true,
      accurateSearch: false,
      placeholder: '应用名模糊搜索',
      rules: {
        applicationName: [
          { required: true, message: '请输入应用名', trigger: 'blur' }
        ],
        project: [
          { required: true, message: '请选择项目名', trigger: 'change' }
        ],
        subsystem: [
          { required: true, message: '请选择子系统', trigger: 'change' }
        ],
        environment: [
          { required: true, message: '请选择环境', trigger: 'change' }
        ],
        applicationType: [
          { required: true, message: '请选择应用类型', trigger: 'change' }
        ],
        namespace: [
          { required: true, message: '请选择命名空间', trigger: 'change' }
        ],
        kind: [{ required: true, message: '请选择类型', trigger: 'change' }]
      }
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
        this.onSearchValue()
      }
    }
  },
  methods: {
    // 前后端控制
    frontOrBack () {
      if (this.addGroup.form.applicationType === '') {
        this.isAddDisabled = true
      } else {
        this.isAddDisabled = false
      }
      if (this.addGroup.form.applicationType === '3') {
        this.isShow = false
      } else {
        this.isShow = true
      }
    },
    getAreaValue (val) {
      this.searchArea = val
    },
    getProjectValue (val) {
      this.searchProject = val
    },
    getEnvironmentValue (val) {
      this.searchEnvironment = val
    },
    // 子系统模糊搜索
    async querySearch (queryString, cb) {
      if (queryString === '') {
        this.areaName = ''
        this.addGroup.form.projectName = ''
      }
      this.onSelectChangeArea()
      this.resubsystemList = []
      this.subsystemList = []
      // 请求需要时间等待
      let resSubsystem = await this.$http.getsubsystemapi({
        ordering: 'subsystemname'
      })
      this.subsystemList = resSubsystem.results
      if (this.resubsystemList.length === 0) {
        this.subsystemList.forEach(val => {
          this.resubsystemList.push({
            value: val.subsystemname,
            id: val.id,
            area: val.area.id,
            areaName: val.area.name,
            project: val.project.id,
            projectName: val.project !== null ? val.project.projectName : null
          })
        })
      }
      var restaurants = this.resubsystemList
      var results = queryString
        ? this.resubsystemList.filter(
            this.createFilter(queryString.replace(/(^\s*)|(\s*$)/g, ''))
          )
        : this.resubsystemList
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    async handleSelect (item) {
      console.log('item', item)
      this.autocompleteloading = true
      this.addGroup.form.projectName = item.projectName
      this.addGroup.form.project = item.project
      this.addGroup.form.area = item.area
      this.areaName = item.areaName
      this.addGroup.form.subsystem = item.id
      this.autocompleteloading = false
    },
    createFilter (queryString) {
      return restaurant => {
        return (
          restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) > -1
        )
      }
    },
    // 命名空间
    async onSearchNameKubernetes () {
      const param = {
        cluster: this.searchCluster,
        ordering: 'namespaceName',
        appFlag: true
      }
      let resChildren = await this.$http.get_kubernetesnamespace(param)
      this.searchKubernetesList = resChildren.results
    },
    // 进入详情
    toApplicationinDetails () {
      this.$router.push({
        name: 'cmdb_applicationinDetails'
      })
    },
    // 编辑命名空间
    async onSearchNamespace () {
      this.editGroup.form.namespace.id = ''
      this.kubernetesnamespaceList = []
      const param = {
        cluster: this.editGroup.form.cluster.id,
        ordering: 'namespaceName',
        appFlag: true
      }
      let resChildren = await this.$http.get_kubernetesnamespace(param)
      this.kubernetesnamespaceList = resChildren.results
    },
    // 编辑es二级
    async onSearchEditCh () {
      this.editGroup.form.searchIndex.egEs = ''
      this.editEg = []
      let checkEs = []
      if (
        !(
          this.editGroup.form.searchIndex.chEs &&
          this.editGroup.form.searchIndex.egEs
        )
      ) {
        this.isDisabled = false
      }
      if (
        this.editGroup.form.searchIndex.chEs &&
        !this.editGroup.form.searchIndex.egEs
      ) {
        this.isDisabled = true
        this.$message.warning('两者都选或都不选，不可以只选其一')
      }
      checkEs = this.editCh.filter(item => {
        return item.value === this.editGroup.form.searchIndex.chEs
      })
      if (checkEs[0]) {
        const param = { elasticSearch: checkEs[0].label }
        let resChildren = await this.$http.get_searchindexviewset(param)
        resChildren.results.forEach(item => {
          this.editEg.push({
            value: item.id,
            label: item.name
          })
        })
      }
    },
    onSearchEditEs () {
      if (
        this.editGroup.form.searchIndex.chEs &&
        !this.editGroup.form.searchIndex.egEs
      ) {
        this.isDisabled = true
        this.$message.warning('两者都选或都不选，不可以只选其一')
      } else {
        this.isDisabled = false
      }
    },
    // 子系统三级联动选择器
    projectLazyLoad (node, resolve) {
      this.projectGetData(node, resolve)
    },
    async projectGetData (node, resolve) {
      const level = node.level
      let result = []
      if (level === 0) {
        let areacList = await this.$http.getAreaApi()
        areacList.results.forEach(item => {
          result.push({
            value: item.id,
            label: item.name
          })
        })
      }
      if (level === 1) {
        const param = { area: node.data.value }
        let resChildren = await this.$http.getProjectApi(param)
        resChildren.results.forEach(item => {
          result.push({
            value: item.id,
            label: item.projectName
          })
        })
      }
      if (level === 2) {
        const param = { project: node.data.value, ordering: 'subsystemname' }
        let resChildren = await this.$http.getsubsystemapi(param)
        resChildren.results.forEach(item => {
          result.push({
            value: item.id,
            label: item.subsystemname
          })
        })
      }
      resolve(result)
    },
    // 子系统自定义搜索
    myFilter (val) {
      if (val === '') {
        this.onUpdateSelectChangeSubsystem(true)
      } else {
        this.searchSubsystemList = this.subsystemList.filter(item => {
          return item.subsystemname.indexOf(val) !== -1
        })
      }
    },
    // 命名空间二级联动选择器
    namespaceLazyLoad (node, resolve) {
      this.namespaceGetData(node, resolve)
    },
    async namespaceGetData (node, resolve) {
      const level = node.level
      let result = []
      if (level === 0) {
        let elasticList = await this.$http.getClusterApi()
        elasticList.results.forEach(item => {
          result.push({
            value: item.id,
            label: item.clusterName
          })
        })
      }
      if (level === 1) {
        const param = {
          cluster: node.data.value,
          ordering: 'namespaceName',
          appFlag: true
        }
        let resChildren = await this.$http.get_kubernetesnamespace(param)
        resChildren.results.forEach(item => {
          result.push({
            value: item.id,
            label: item.namespaceName
          })
        })
      }
      resolve(result)
    },
    // 二级联动选择器
    lazyLoad (node, resolve) {
      this.getData(node, resolve)
    },
    async getData (node, resolve) {
      const level = node.level
      let result = []
      if (level === 0) {
        let elasticList = await this.$http.get_elasticsearchviewset()
        elasticList.results.forEach(item => {
          result.push({
            value: item.id,
            label: item.name
          })
        })
      }
      if (level === 1) {
        const param = { elasticSearch: node.label }
        let resChildren = await this.$http.get_searchindexviewset(param)
        resChildren.results.forEach(item => {
          result.push({
            value: item.id,
            label: item.name
          })
        })
      }
      resolve(result)
    },
    // async onSelectChnageEnvironment (callback) {
    //   this.environmentListSelect = []
    //   if (callback) {
    //     const param = { type: '应用' }
    //     let resEnvironment = await this.$http.getEnvironmentApi(param)
    //     this.environmentListSelect = resEnvironment.results
    //   }
    // },
    // async onSelectChangeProject (callback) {
    //   this.projectList = []
    //   if (callback) {
    //     let resProject = await this.$http.getProjectApi()
    //     this.projectList = resProject.results
    //   }
    // },
    async onUpdateSelectChangeEnv (callback, type) {
      if (callback) {
        let resEnvironment = await this.$http.getEnvironmentApi({
          type: '应用'
        })
        this.environmentList = resEnvironment.results
        if (type != 'add') {
          this.editGroup.form.environment.id = ''
        }
      }
    },
    async onUpdateSelectChangeSubsystem (callback, type) {
      if (callback) {
        let resSubsystem = await this.$http.getsubsystemapi({
          ordering: 'subsystemname',
          project: this.editGroup.form.project.id
        })
        this.subsystemList = resSubsystem.results
        this.searchSubsystemList = resSubsystem.results
        if (type !== 'add') {
          this.editGroup.form.subsystem.id = ''
        }
      }
    },
    // 详情area列表
    async onUpdateSelectChangeArea (callback) {
      if (callback) {
        this.editGroup.form.project.id = ''
        this.editGroup.form.subsystem.id = ''
        let reaAreac = await this.$http.getAreaApi()
        this.areacList = reaAreac.results
      }
    },
    // 详情项目名列表
    async onUpdateSelectChangeProject (callback) {
      if (callback) {
        this.editGroup.form.subsystem.id = ''
        let resProject = await this.$http.getProjectApi({
          area: this.editGroup.form.area
        })
        this.projectList = resProject.results
      }
    },
    async syncApplicationInstance () {
      if (this.searchCluster !== null) {
        this.$confirm('确认同步?', '提示', { type: 'warning' }).then(
          async () => {
            this.syncAppInLoading = true
            const param = { clusterId: this.searchCluster, kind: 'deployment' }
            let res = await this.$http.syncApplicationInstanceApi(param)
            if (res.hasOwnProperty('results')) {
              this.$message.success('同步成功!')
            } else {
              this.$message.error('同步失败!')
            }
            this.syncAppInLoading = false
          }
        )
      } else {
        this.$message.error('请选择集群!')
      }
    },
    async onSelectChangeArea (callback) {
      this.areaList = []
      if (callback) {
        let resCluster = await this.$http.getAreaApi()
        this.areaList = resCluster.results
      }
    },
    async onSelectChangeCluster (callback) {
      this.searchNamespace = ''
      this.clusterList = []
      if (callback) {
        let resCluster = await this.$http.getClusterApi()
        this.clusterList = resCluster.results
      }
    },
    async onSelectChangeNamespace (callback) {
      this.namespaceList = []
      if (callback) {
        let resKs = await this.$http.get_kubernetesnamespace()
        this.kubernetesnamespaceList = resKs.results
      }
    },
    async getCheckList (val) {
      this.checkList = []
      val.map(item => {
        this.checkList.push(item.id)
      })
    },
    multipleAppInstance () {
      if (this.checkList.length !== 0) {
        this.multipleGroup.visible = false
        this.multipleGroup.form = this.checkList
      }
      // let res = await this.$http.post('')
    },
    stateSearch () {
      if (this.accurateSearch) {
        this.placeholder = '应用名精准搜索'
      } else {
        this.placeholder = '应用名模糊搜索'
      }
    },
    // 查询
    async onSearchValue () {
      let param = {}
      if (this.accurateSearch) {
        param = {
          applicationName: this.searchApplicationname,
          cluster: this.searchCluster,
          project: this.searchProject,
          namespaceName: this.searchNamespace,
          environment: this.searchEnvironment,
          applicationType: this.searchApplicationType,
          area: this.searchArea
        }
      } else {
        param = {
          applicationName__contains: this.searchApplicationname,
          cluster: this.searchCluster,
          project: this.searchProject,
          namespaceName: this.searchNamespace,
          environment: this.searchEnvironment,
          applicationType: this.searchApplicationType,
          area: this.searchArea
        }
      }
      let res = await this.$http.searchApplicationApi(param)
      this.$refs.applicationinstancelist.setData(res.results, res.count)
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
    // 删除
    deleteSafeGroup (id) {
      this.$confirm('确认删除?', '提示', { type: 'warning' })
        .then(async () => {
          let res = await this.$http.deleteApplicationIns({ id: id })
          if (res.hasOwnProperty('results')) {
            this.$message.success('删除成功')
          } else {
            this.$message.error('删除失败!')
          }
          this.$refs.applicationinstancelist.getData()
        })
        .catch(_ => {})
    },
    // 点击新增按钮
    add () {
      this.isAddDisabled = true
      this.isShow = true
      this.addGroup.form.subsystemname = ''
      this.areaName = ''
      this.addGroup.form.projectName = ''
      this.addGroup.form.searchIndex = ''
      this.addGroup.form.project = ''
      this.$nextTick(() => {
        this.$refs.addForm.resetFields()
      })
      this.addGroup.visible = true
    },
    // 新增确认
    addConfirm () {
      this.$refs.addForm.validate(async v => {
        if (v) {
          let param = {}
          if (this.addGroup.form.applicationType === '3') {
            // 前端
            param = {
              applicationType: this.addGroup.form.applicationType,
              applicationName: this.addGroup.form.applicationName,
              project: this.addGroup.form.project,
              subsystem: this.addGroup.form.subsystem,
              area: this.addGroup.form.area,
              environment: this.addGroup.form.environment,
              description: this.addGroup.form.description
            }
          } else {
            // 后端
            param = {
              applicationName: this.addGroup.form.applicationName,
              project: this.addGroup.form.project,
              subsystem: this.addGroup.form.subsystem,
              environment: this.addGroup.form.environment,
              locationFlag: this.addGroup.form.locationFlag,
              searchIndex: this.addGroup.form.searchIndex[0],
              description: this.addGroup.form.description,
              kind: this.addGroup.form.kind,
              namespace: this.addGroup.form.namespace[1]
                ? this.addGroup.form.namespace[1]
                : '',
              applicationType: this.addGroup.form.applicationType,
              cluster: this.addGroup.form.namespace[0],
              area: this.addGroup.form.area
            }
          }
          console.log(param)
          let res = await this.$http.add_applicationinstance(param)
          this.addGroup.visible = false
          this.$refs.applicationinstancelist.getData()
        }
      })
    },
    // 编辑展示
    async edit (item) {
      if (item.applicationType === '前端应用') {
        this.isEditShow = false
      } else {
        this.isEditShow = true
      }
      this.editCh = []
      this.editGroupLoading = true
      this.onSelectChangeCluster(true)
      this.onSelectChangeNamespace(true)
      let reaAreac = await this.$http.getAreaApi()
      this.areacList = reaAreac.results
      let resProject = await this.$http.getProjectApi()
      this.projectList = resProject.results
      // 获取集群
      let elasticList = await this.$http.get_elasticsearchviewset()
      elasticList.results.forEach(item => {
        this.editCh.push({
          value: item.id,
          label: item.name
        })
      })
      if (item.searchIndex !== null) {
        let resChildren = await this.$http.get_searchindexviewset({
          elasticSearch: item.searchIndex.elasticSearch.name
        })
        resChildren.results.forEach(item => {
          this.editEg.push({
            value: item.id,
            label: item.name
          })
        })
      }
      const param = { id: item.id }
      let resSubsystem = await this.$http.getsubsystemapi()
      this.subsystemList = resSubsystem.results
      this.searchSubsystemList = resSubsystem.results
      let resEnvironment = await this.$http.getEnvironmentApi({ type: '应用' })
      this.environmentList = resEnvironment.results
      let res = await this.$http.getDetailApplicationApi(param)
      console.log('results', res.results)
      if (res.hasOwnProperty('results')) {
        this.editGroup.form = res.results
        if (this.editGroup.form.searchIndex !== null) {
          this.editGroup.form.searchIndex = {
            chEs: this.editGroup.form.searchIndex.elasticSearch.id,
            egEs: this.editGroup.form.searchIndex.id
          }
        }
        this.editGroup.visible = true
        this.editGroupLoading = false
      }
      if (this.editGroup.form.project === null) {
        this.editGroup.form.project = { id: '', projectName: '' }
      }
      if (this.editGroup.form.subsystem === null) {
        this.editGroup.form.subsystem = { id: '', subsystemname: '' }
      }
      if (this.editGroup.form.environment === null) {
        this.editGroup.form.environment = { id: '', name: '' }
      }
      if (this.editGroup.form.searchIndex === null) {
        this.editGroup.form.searchIndex = {
          chEs: '',
          egEs: ''
        }
      }
      if (this.editGroup.form.cluster === null) {
        this.editGroup.form.cluster = {
          id: '',
          clusterName: ''
        }
      }
      if (this.editGroup.form.namespace === null) {
        this.editGroup.form.namespace = {
          id: '',
          namespaceName: ''
        }
      }
    },
    // 编辑确认按钮
    editConfirm () {
      this.$refs.editForm.validate(async v => {
        if (v) {
          let param = {}
          if (this.isEditShow) {
            // 后端
            param = {
              id: this.editGroup.form.id,
              project: this.editGroup.form.project.id,
              subsystem: this.editGroup.form.subsystem.id,
              environment: this.editGroup.form.environment.id,
              domainname: this.editGroup.form.domainname,
              locationFlag: this.editGroup.form.locationFlag,
              cluster: this.editGroup.form.cluster.id,
              namespace: this.editGroup.form.namespace.id,
              area: this.editGroup.form.area,
              searchIndex: this.editGroup.form.searchIndex.egEs
            }
          } else {
            // 前端
            param = {
              id: this.editGroup.form.id,
              project: this.editGroup.form.project.id,
              subsystem: this.editGroup.form.subsystem.id,
              environment: this.editGroup.form.environment.id,
              domainname: this.editGroup.form.domainname,
              locationFlag: this.editGroup.form.locationFlag,
              area: this.editGroup.form.area
            }
          }
          console.log(param)
          let res = await this.$http.patchApplicationApi(param)
          if (res.hasOwnProperty('results')) {
            this.$message.success('修改成功')
            this.editGroup.visible = false
            this.$refs.applicationinstancelist.getData()
          } else {
            this.$message.error('修改失败!')
          }
        }
      })
    },
    // 点击取消
    cancelEdit (val) {
      this.editGroup.visible = false
      this.addGroup.visible = false
      if (val === 'add') {
        this.$nextTick(() => {
          this.$refs.addForm.resetFields()
        })
      }
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
.el-icon-plus-btn {
  margin-right: 0;
}
.namespace {
  display: inline-block;
}
.accurate-search {
  margin-right: 70px;
}
</style>
