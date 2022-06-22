<template>
  <div class="main">
    <div class="wrapper wrapper-content">
      <d-table
        url="/asset/host/"
        ref="hostList"
        v-if="!showDetail"
        :conditionForm="condition"
        @SelectionChange="getCheckList"
      >
        <template slot="headerLeft">
          <el-form-item label="IDC:">
            <el-select
              clearable
              @visible-change="onSelectChangeIdc($event)"
              v-model="idcId"
              style="width:160px"
            >
              <el-option
                v-for="item in idcList"
                :key="item.id"
                :value="item.id"
                :label="item.name"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="机房:">
            <el-select
              clearable
              @visible-change="onSelectChangeMachine($event)"
              v-model="machineroomId"
              style="width:160px"
            >
              <el-option
                v-for="item in machineroomList"
                :key="item.id"
                :value="item.id"
                :label="item.name"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="机柜:">
            <el-select
              clearable
              @visible-change="onSelectChangeCabin($event)"
              v-model="cabinetId"
              style="width:160px"
            >
              <el-option
                v-for="item in cabinetList"
                :key="item.id"
                :value="item.id"
                :label="item.name"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button
              icon="el-icon-search"
              type="primary"
              @click="getHostList()"
              >查询</el-button
            >
          </el-form-item>
          <el-form-item>
            <el-input
              placeholder="全局模糊搜索"
              v-model="searchValue"
              class="input-search"
              @keyup.native.enter="onSearch"
            >
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="onSearchHost"
              ></el-button>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-plus" type="primary" @click="openAddHost"
              >新增</el-button
            >
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="inspectHost">巡检</el-button>
          </el-form-item>
        </template>
        <template slot="column">
          <el-table-column
            type="selection"
            width="55"
            :reserve-selection="true"
          ></el-table-column>
          <el-table-column label="主机名称" width="200">
            <template slot-scope="scope">
              {{ scope.row.name }}
            </template>
          </el-table-column>
          <el-table-column label="资产编号" width="200">
            <template slot-scope="scope">
              <div class="group-name">
                {{ scope.row.sn }}
              </div>
            </template>
          </el-table-column>
          <!--<el-table-column label="远程IP" width="100">-->
          <!--<template slot-scope="scope">-->
          <!--{{ scope.row.rac_ip }}-->
          <!--</template>-->
          <!--</el-table-column>-->
          <el-table-column label="管理IP" width="120">
            <template slot-scope="scope">
              {{ scope.row.ip }}
            </template>
          </el-table-column>
          <el-table-column label="数据中心">
            <template v-if="scope.row.idc != null" slot-scope="scope">
              {{ scope.row.idc.name }}
            </template>
          </el-table-column>
          <el-table-column label="机房">
            <template v-if="scope.row.machine_room != null" slot-scope="scope">
              {{ scope.row.machine_room.name }}
            </template>
          </el-table-column>
          <el-table-column label="机柜">
            <template v-if="scope.row.cabinet != null" slot-scope="scope">
              {{ scope.row.cabinet.name }}
            </template>
          </el-table-column>
          <el-table-column label="电源状态">
            <template slot-scope="scope">
              {{ scope.row.power_state }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="250">
            <template slot-scope="scope">
              <div>
                <el-button
                  size="mini"
                  type="primary"
                  @click="showHostdetail(scope.row.id)"
                  >详情</el-button
                >
                <!--<el-button size="mini" type="primary" @click="showHistoryinspection(scope.row.id)">历史巡检</el-button>-->
                <!--<el-button size="mini" type="danger" @click="" v-if="buttonDelete">删除</el-button>-->
                <el-dropdown @command="hostoperation">
                  <el-button
                    style="margin-left: 10px"
                    type="primary"
                    size="mini"
                  >
                    主机操作<i class="el-icon-arrow-down el-icon--right"></i>
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                      v-for="item in tableSelectOptions"
                      v-text="item.value"
                      :key="item.name"
                      :command="item.name + ',' + scope.row.id"
                      :disabled="item.disabledperm"
                    >
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
            </template>
          </el-table-column>
        </template>
      </d-table>
      <el-dialog
        title="历史巡检记录"
        :visible.sync="historyGroup.visible"
        width="90%"
        top="20px"
      >
        <template margin-top="5px">
          <el-tabs>
            <div>
              <el-card shadow="hover">
                <el-table
                  class="tb-edit"
                  :data="historyinspectList"
                  size="small"
                  style="width: 100%"
                  height="700"
                >
                  <el-table-column label="cpu" width="100px">
                    <template slot-scope="scope">
                      <div class="member-box">
                        <el-tag
                          v-for="tag in scope.row.cpu"
                          :key="tag.Name"
                          type="success"
                        >
                          {{ tag.Name }}
                          {{ tag.Health }}
                        </el-tag>
                      </div>
                      <!--<div v-for="tag in scope.row.cpu" :key="tag.Name">-->
                      <!--{{ tag.Name}}-->
                      <!--{{ tag.Health}}-->
                      <!--</div>-->
                    </template>
                  </el-table-column>
                  <el-table-column label="硬盘" width="200px">
                    <template slot-scope="scope">
                      <div class="member-box">
                        <el-tag
                          v-for="tag in scope.row.harddisk"
                          :key="tag.Name"
                          type="success"
                        >
                          {{ tag.Name }}
                          {{ tag.Health }}
                        </el-tag>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column label="内存">
                    <template slot-scope="scope">
                      <div class="member-box">
                        <el-tag
                          v-for="tag in scope.row.memory"
                          :key="tag.Name"
                          type="success"
                        >
                          {{ tag.Name }}
                          {{ tag.Health }}
                        </el-tag>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column label="网卡">
                    <template slot-scope="scope">
                      <div class="member-box">
                        <el-tag
                          v-for="tag in scope.row.nic"
                          :key="tag.Name"
                          v-if="tag.LinkStatus == 'Up'"
                          type="success"
                        >
                          {{ tag.Name }}
                          {{ tag.LinkStatus }}
                        </el-tag>
                        <el-tag
                          v-for="tag in scope.row.nic"
                          :key="tag.Name"
                          v-if="tag.LinkStatus == 'Down'"
                          type="danger"
                        >
                          {{ tag.Name }}
                          {{ tag.LinkStatus }}
                        </el-tag>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column label="电源" width="150px">
                    <template slot-scope="scope">
                      <div class="member-box">
                        <el-tag
                          v-for="tag in scope.row.power"
                          :key="tag.Name"
                          v-if="tag.Health === 'Critical'"
                          type="danger"
                        >
                          {{ tag.Name }}
                          {{ tag.Health }}
                        </el-tag>
                        <el-tag
                          v-for="tag in scope.row.power"
                          :key="tag.Name"
                          v-if="tag.Health !== 'Critical'"
                          type="success"
                        >
                          {{ tag.Name }}
                          {{ tag.Health }}
                        </el-tag>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column label="风扇" width="200px">
                    <template slot-scope="scope">
                      <div class="member-box">
                        <el-tag
                          v-for="tag in scope.row.fan"
                          :key="tag.Name"
                          type="success"
                        >
                          {{ tag.Name }}
                          {{ tag.Health }}
                        </el-tag>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column label="温度" width="200px">
                    <template slot-scope="scope">
                      <div class="member-box">
                        <el-tag
                          v-for="tag in scope.row.temperature"
                          :key="tag.Name"
                          type="success"
                        >
                          {{ tag.Name }}
                          {{ tag.Temperature }}
                        </el-tag>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column label="创建时间" width="150px">
                    <template slot-scope="scope">
                      <div class="member-box">
                        {{ scope.row.create_at }}
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
                <el-pagination
                  style="padding-top: 20px"
                  layout="total, prev, pager, next, jumper, slot"
                  @current-change="handleCurrentChangeDialog"
                  :page-count="historytotal"
                >
                </el-pagination>
              </el-card>
            </div>
          </el-tabs>
        </template>
      </el-dialog>
      <el-dialog title="主机新增" :visible.sync="addGroup.visible" width="40%">
        <el-form :model="addGroup.form" label-width="15%">
          <el-form-item prop="name" label="主机名:" :rules="$newrules.empty">
            <el-input
              v-model="addGroup.form.name"
              style="width: 70%"
            ></el-input>
          </el-form-item>
          <el-form-item prop="name" label="SN:" :rules="$newrules.empty">
            <el-input v-model="addGroup.form.sn" style="width: 70%"></el-input>
          </el-form-item>
          <el-form-item prop="name" label="CPU(核):">
            <el-input v-model="addGroup.form.cpu" style="width: 30%"></el-input>
          </el-form-item>
          <el-form-item prop="name" label="内存(KB):">
            <el-input
              v-model="addGroup.form.memory"
              style="width: 30%"
            ></el-input>
          </el-form-item>
          <el-form-item prop="name" label="硬盘容量(KB):">
            <el-input
              v-model="addGroup.form.disk"
              style="width: 30%"
            ></el-input>
          </el-form-item>
          <el-form-item prop="name" label="管理IP:">
            <el-input v-model="addGroup.form.ip" style="width: 30%"></el-input>
          </el-form-item>
          <el-form-item prop="name" label="远控卡IP:">
            <el-input
              v-model="addGroup.form.rac_ip"
              style="width: 30%"
            ></el-input>
          </el-form-item>
          <el-form-item prop="name" label="远控卡账号:">
            <el-input
              v-model="addGroup.form.rac_account"
              style="width: 30%"
            ></el-input>
          </el-form-item>
          <el-form-item prop="name" label="远控卡密码:">
            <el-input
              v-model="addGroup.form.rac_password"
              style="width: 30%"
            ></el-input>
          </el-form-item>
          <el-form-item prop="name" label="系统类型:">
            <el-input
              v-model="addGroup.form.system_type"
              style="width: 30%"
            ></el-input>
          </el-form-item>
          <el-form-item prop="name" label="系统版本号:">
            <el-input
              v-model="addGroup.form.system_version"
              style="width: 30%"
            ></el-input>
          </el-form-item>
          <el-form-item prop="name" label="机架位置:">
            <el-input
              v-model="addGroup.form.position"
              style="width: 30%"
            ></el-input>
          </el-form-item>
          <el-form-item prop="name" label="角色:">
            <el-select v-model="addGroup.form.role">
              <el-option
                v-for="item in roleList"
                :key="item.role"
                :value="item.role"
                :label="item.name"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="name" label="集群:">
            <el-input
              v-model="addGroup.form.cluster"
              style="width: 70%"
            ></el-input>
          </el-form-item>
          <el-form-item prop="name" label="备注:">
            <el-input
              v-model="addGroup.form.comment"
              style="width: 70%"
            ></el-input>
          </el-form-item>
          <el-form-item prop="品牌" label="品牌:">
            <el-select
              @visible-change="onUpdateChangeBrand($event)"
              v-if="addGroup.form.brand.id != null"
              v-model="addGroup.form.brand.id"
              style="width:160px"
            >
              <el-option
                v-for="item in brandList"
                :key="item.id"
                :value="item.id"
                :label="item.name"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="数据中心" label="数据中心:">
            <el-select
              @visible-change="onUpdateChangeIdc($event, 'add')"
              v-if="addGroup.form.idc.id != null"
              v-model="addGroup.form.idc.id"
              style="width:160px"
            >
              <el-option
                v-for="item in idcList"
                :key="item.id"
                :value="item.id"
                :label="item.name"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="机房" label="机房:">
            <el-select
              @visible-change="
                onUpdateChangeMachine($event, addGroup.form.idc.id, 'add')
              "
              v-if="addGroup.form.machine_room.id != null"
              v-model="addGroup.form.machine_room.id"
              style="width:160px"
            >
              <el-option
                v-for="item in machineroomList"
                :key="item.id"
                :value="item.id"
                :label="item.name"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="机柜" label="机柜:">
            <el-select
              @visible-change="
                onUpdateChangeCabinet($event, addGroup.form.machine_room.id)
              "
              v-if="addGroup.form.cabinet.id != null"
              v-model="addGroup.form.cabinet.id"
              style="width:160px"
            >
              <el-option
                v-for="item in cabinetList"
                :key="item.id"
                :value="item.id"
                :label="item.name"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="addHostConfirm">确认</el-button>
          <el-button type="primary" @click="addGroup.visible = false" plain
            >取消</el-button
          >
        </span>
      </el-dialog>
      <el-dialog
        title="主机详情"
        :visible.sync="detailGroup.visible"
        width="40%"
      >
        <el-form labelWidth="100px">
          <el-form-item prop="name" label="主机名:">
            <el-input v-model="detail_host.name" style="width: 50%"></el-input>
          </el-form-item>
          <el-form-item label="资产编号:">
            <el-input v-model="detail_host.sn" style="width: 50%"></el-input>
          </el-form-item>
          <el-form-item prop="cpu" label="cpu:">
            <el-input v-model="detail_host.cpu" style="width: 50%"></el-input>
          </el-form-item>
          <el-form-item prop="memory" label="内存:">
            <el-input
              v-model="detail_host.memory"
              style="width: 50%"
            ></el-input>
          </el-form-item>
          <el-form-item prop="disk" label="硬盘:">
            <el-input v-model="detail_host.disk" style="width: 50%"></el-input>
          </el-form-item>
          <el-form-item prop="ip" label="管理IP:">
            <el-input v-model="detail_host.ip" style="width: 50%"></el-input>
          </el-form-item>
          <el-form-item prop="rac_ip" label="远控IP:">
            <el-input
              v-model="detail_host.rac_ip"
              style="width: 50%"
            ></el-input>
          </el-form-item>
          <el-form-item prop="rac_account" label="远控卡账号:">
            <el-input
              v-model="detail_host.rac_account"
              style="width: 50%"
            ></el-input>
          </el-form-item>
          <el-form-item prop="rac_password" label="远控卡密码:">
            <el-input
              v-model="detail_host.rac_password"
              style="width: 50%"
            ></el-input>
          </el-form-item>
          <el-form-item prop="系统类型" label="系统类型:">
            <el-input
              v-model="detail_host.system_type"
              style="width: 50%"
            ></el-input>
          </el-form-item>
          <el-form-item prop="系统版本" label="系统版本:">
            <el-input
              v-model="detail_host.system_version"
              style="width: 50%"
            ></el-input>
          </el-form-item>
          <el-form-item label="机架位置:">
            <el-input
              v-model="detail_host.position"
              style="width: 50%"
            ></el-input>
          </el-form-item>
          <el-form-item label="角色:">
            <el-select
              v-if="detail_host.role != null"
              v-model="detail_host.role"
            >
              <el-option
                v-for="item in roleList"
                :key="item.role"
                :value="item.role"
                :label="item.name"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属集群:">
            <el-input
              v-model="detail_host.cluster"
              style="width: 50%"
            ></el-input>
          </el-form-item>
          <el-form-item label="备注信息:">
            <el-input
              v-model="detail_host.comment"
              style="width: 50%"
            ></el-input>
          </el-form-item>
          <el-form-item prop="品牌" label="品牌:">
            <el-select
              @visible-change="onUpdateChangeBrand($event)"
              v-if="detail_host.brand != null"
              v-model="detail_host.brand.id"
              style="width:160px"
            >
              <el-option
                v-for="item in brandList"
                :key="item.id"
                :value="item.id"
                :label="item.name"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="数据中心" label="数据中心:">
            <el-select
              @visible-change="onUpdateChangeIdc($event, 'edit')"
              v-if="detail_host.idc != null"
              v-model="detail_host.idc.id"
              style="width:160px"
            >
              <el-option
                v-for="item in idcList"
                :key="item.id"
                :value="item.id"
                :label="item.name"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="机房" label="机房:">
            <el-select
              @visible-change="
                onUpdateChangeMachine($event, detail_host.idc.id, 'edit')
              "
              v-if="detail_host.machine_room != null"
              v-model="detail_host.machine_room.id"
              style="width:160px"
            >
              <el-option
                v-for="item in machineroomList"
                :key="item.id"
                :value="item.id"
                :label="item.name"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="机柜" label="机柜:">
            <el-select
              @visible-change="
                onUpdateChangeCabinet($event, detail_host.machine_room.id)
              "
              v-if="detail_host.cabinet != null"
              v-model="detail_host.cabinet.id"
              style="width:160px"
            >
              <el-option
                v-for="item in cabinetList"
                :key="item.id"
                :value="item.id"
                :label="item.name"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="create_at" label="创建时间:">{{
            detail_host.create_at
          }}</el-form-item>
          <el-form-item prop="create_at" label="修改时间:">{{
            detail_host.update_at
          }}</el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button
            type="primary"
            v-if="buttonChange == true"
            @click="patchHost"
            >确认</el-button
          >
          <el-button
            type="primary"
            v-else-if="buttonChange == false"
            @click="patchHost"
            disabled
            >确认</el-button
          >
          <el-button type="primary" @click="detailGroup.visible = false" plain
            >取消</el-button
          >
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      historyinspectionPage: 1,
      dropdownvalue: false,
      operationvaluetext: '',
      tableSelectOptions: [
        { name: 1, value: '关闭', disabledperm: null },
        { name: 2, value: '启动', disabledperm: null },
        { name: 3, value: '重启', disabledperm: null },
        { name: 4, value: '电源键', disabledperm: null },
        { name: 5, value: '删除', disabledperm: null },
        { name: 6, value: '历史巡检', disabledperm: false }
      ],
      tableSelect: null,
      historytotal: null,
      historyinspectList: [],
      checkList: [],
      searchValue: '',
      detail_host: '',
      idcId: '',
      machineroomId: '',
      cabinetId: '',
      roleList: [
        { role: 0, name: '未分配' },
        { role: 1, name: '控制节点' },
        { role: 2, name: '计算节点' },
        { role: 3, name: '网络节点' },
        { role: 4, name: '存储节点' },
        { role: 5, name: '部署节点' },
        { role: 6, name: '存储网关' },
        { role: 7, name: '数据库' },
        { role: 8, name: '消息队列' }
      ],
      brandList: [],
      idcList: [],
      machineroomList: [],
      cabinetList: [],
      condition: null,
      groupId: '',
      groupName: '',
      historyGroup: { visible: false, historyinspectionPage: 1 },
      editGroup: {
        visible: false,
        form: { groupName: '', description: '', groupId: '' }
      },
      addGroup: {
        visible: false,
        form: {
          name: '',
          sn: '',
          cpu: 0,
          memory: '',
          disk: '',
          ip: '',
          rac_ip: '',
          rac_account: '',
          rac_password: '',
          system_type: '',
          system_version: '',
          position: '',
          role: 0,
          cluster: '',
          comment: '',
          brand: { id: '', name: '' },
          idc: { id: '', name: '' },
          machine_room: { id: '', name: '' },
          cabinet: { id: '', name: '' }
        }
      },
      showDetail: false,
      detailId: '',
      detailName: '',
      activeName: '',
      detailGroup: { visible: false },
      onChangeSelect: false,
      buttonDelete: false,
      buttonChange: false
    }
  },
  created () {
    this.getPerm()
  },
  methods: {
    handleCurrentChangeDialog (v) {
      this.historyGroup.historyinspectionPage = v
      this.showHistoryinspection(this.handleCurrentChangeId)
    },
    async hostoperation (val) {
      this.operationvaluetext = ''
      const operationvalue = val.split(',')[0]
      if (operationvalue == 1) {
        this.operationvaluetext = '关闭'
      } else if (operationvalue == 2) {
        this.operationvaluetext = '启动'
      } else if (operationvalue == 3) {
        this.operationvaluetext = '重启'
      } else if (operationvalue == 4) {
        this.operationvaluetext = '电源操作'
      } else if (operationvalue == 5) {
        this.operationvaluetext = '删除'
      } else if (operationvalue == 6) {
        this.operationvaluetext = '历史巡检'
      } else {
        this.operationvaluetext = '错误操作'
      }
      const hostid = val.split(',')[1]
      const param = { host_id: hostid }
      if (operationvalue == 6) {
        this.historyinspectList = []
        this.showHistoryinspection(hostid)
      } else {
        await this.$confirm(
          this.operationvaluetext + '操作将进行, 是否继续?',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
          .then(async () => {
            if (operationvalue == 1) {
              await this.$http.racPoweroff(param)
              console.log('执行关闭操作')
            } else if (operationvalue == 2) {
              await this.$http.racPoweron(param)
              console.log('执行启动操作')
            } else if (operationvalue == 3) {
              await this.$http.racRestart(param)
              console.log('执行重启操作')
            } else if (operationvalue == 4) {
              await this.$http.racPushpowerbutton(param)
              console.log('执行电源键操作')
            } else if (operationvalue == 5) {
              await this.$http.delete_host({ id: hostid })
              console.log('执行删除操作')
            } else {
              console.log('执行了错误操作')
            }
            this.$message({
              type: 'success',
              message: this.operationvaluetext + '操作成功!'
            })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消' + this.operationvaluetext
            })
          })
        this.getHostList()
      }
    },
    reback () {
      this.$router.push({ name: '主机列表' })
    },
    async showHistoryinspection (id) {
      this.handleCurrentChangeId = id
      this.historyGroup.visible = true
      const param = { host: id, page: this.historyGroup.historyinspectionPage }
      let res = await this.$http.historyInspection(param)
      this.historyinspectList = res.results
      this.historytotal = Math.ceil(res.count / 10)
      console.log(this.historyinspectList)
    },
    inspectHost () {
      this.$router.push({
        name: '巡检操作',
        params: { checkList: this.checkList }
      })
    },
    getCheckList (val) {
      this.checkList = []
      val.map(item => {
        this.checkList.push(item.id)
      })
    },
    async addHostConfirm () {
      this.addGroup.visible = true
      const param = {
        name: this.addGroup.form.name,
        sn: this.addGroup.form.sn,
        cpu: this.addGroup.form.cpu,
        memory: this.addGroup.form.memory,
        disk: this.addGroup.form.disk,
        ip: this.addGroup.form.ip,
        rac_ip: this.addGroup.form.rac_ip,
        rac_account: this.addGroup.form.rac_account,
        rac_password: this.addGroup.form.rac_password,
        system_type: this.addGroup.form.system_type,
        system_version: this.addGroup.form.system_version,
        position: this.addGroup.form.position,
        role: this.addGroup.form.role,
        cluster: this.addGroup.form.cluster,
        comment: this.addGroup.form.comment,
        brand: this.addGroup.form.brand.id,
        idc: this.addGroup.form.idc.id,
        machine_room: this.addGroup.form.machine_room.id,
        cabinet: this.addGroup.form.cabinet.id
      }
      let res = await this.$http.add_host(param)
      if (res.hasOwnProperty('msg')) {
        this.addGroup.visible = true
      } else {
        this.addGroup.visible = false
      }
      this.getHostList()
    },
    async openAddHost () {
      this.addGroup.visible = true
      this.addGroup.form = {
        name: '',
        sn: '',
        cpu: 0,
        memory: '',
        disk: '',
        ip: '',
        rac_ip: '',
        rac_account: '',
        rac_password: '',
        system_type: '',
        system_version: '',
        position: '',
        role: 0,
        cluster: '',
        comment: '',
        brand: { id: '', name: '' },
        idc: { id: '', name: '' },
        machine_room: { id: '', name: '' },
        cabinet: { id: '', name: '' }
      }
    },
    async onUpdateChangeBrand (callback) {
      if (callback) {
        let resBrand = await this.$http.get_brand_list()
        this.brandList = resBrand.results
      }
    },
    async onUpdateChangeIdc (callback, variable) {
      if (callback) {
        let resIdc = await this.$http.get_idc_list()
        this.idcList = resIdc.results
        // edit
        if (variable == 'edit') {
          this.detail_host.machine_room.id = ''
          this.detail_host.cabinet.id = ''
        }
        // add
        if (variable == 'add') {
          this.addGroup.form.machine_room.id = ''
          this.addGroup.form.cabinet.id = ''
        }
      }
    },
    async onUpdateChangeMachine (callback, idcId, variable) {
      console.log('idcId', idcId)
      if (callback) {
        if (idcId === '') {
          this.$message.warning('请先选择数据中心')
          // this.detail_host.machine_room = {'name': '', 'id': ''}
          this.machineroomList = []
        } else {
          let resMachineroom = await this.$http.get_machineroom_list({
            idc: idcId
          })
          // this.detail_host.machine_room = resMachineroom.results
          this.machineroomList = resMachineroom.results
          // edit
          if (variable == 'edit') {
            this.detail_host.cabinet.id = ''
          }
          // add
          if (variable == 'add') {
            this.addGroup.form.cabinet.id = ''
          }
        }
      }
    },
    async onUpdateChangeCabinet (callback, machineRoomId) {
      console.log('machine_roomId', machineRoomId)
      if (callback) {
        if (machineRoomId === '') {
          this.$message.warning('请先选择机房')
          // this.detail_host.cabinet = {'name': '', 'id': ''}
          this.cabinetList = []
        } else {
          let resCabinet = await this.$http.get_cabinets_list({
            machine_room: machineRoomId
          })
          // this.detail_host.cabinet = resCabinet.results
          this.cabinetList = resCabinet.results
        }
      }
    },
    async onSelectChangeIdc (callback) {
      console.log('start idc', callback)
      if (callback) {
        console.log('start idc true')
        let resIdc = await this.$http.get_idc_list()
        this.idcList = resIdc.results
      }
    },
    async onSelectChangeMachine (callback) {
      if (callback) {
        if (this.idcId === '') {
          this.$message.warning('请先选择数据中心')
          this.machineroomList = []
        } else {
          let resMachineroom = await this.$http.get_machineroom_list({
            idc: this.idcId
          })
          this.machineroomList = resMachineroom.results
        }
      }
    },
    async onSelectChangeCabin (callback) {
      if (callback) {
        if (this.machineroomId === '') {
          this.$message.warning('请先选择机房')
          this.cabinetList = []
        } else {
          console.log('this.machineroomId', this.machineroomId)
          let cabinetList = await this.$http.get_cabinets_list({
            machine_room: this.machineroomId
          })
          console.log('cabinetList', cabinetList)
          this.cabinetList = cabinetList.results
        }
      }
    },
    async onSearchHost () {
      const param = {
        search: this.searchValue
      }
      let res = await this.$http.get_host_list(param)
      this.$refs.hostList.setData(res.results, res.count)
    },
    async showHostdetail (id) {
      this.getLocationList()
      this.detailGroup.visible = true
      this.detail_host = {}
      const param = {
        id: id
      }
      let res = await this.$http.get_detail_host(param)
      this.detail_host = res
      if (this.detail_host.idc == null) {
        this.detail_host.idc = { name: '', id: '' }
      }
      if (this.detail_host.machine_room == null) {
        this.detail_host.machine_room = { name: '', id: '' }
      }
      if (this.detail_host.cabinet == null) {
        this.detail_host.cabinet = { name: '', id: '' }
      }
      if (this.detail_host.brand == null) {
        this.detail_host.brand = { name: '', id: '' }
      }
      console.log('this.detail_host', this.detail_host)
    },
    async patchHost () {
      const param = {
        id: this.detail_host.id,
        name: this.detail_host.name,
        sn: this.detail_host.sn,
        cpu: this.detail_host.cpu,
        memory: this.detail_host.memory,
        disk: this.detail_host.disk,
        ip: this.detail_host.ip,
        rac_ip: this.detail_host.rac_ip,
        rac_account: this.detail_host.rac_account,
        rac_password: this.detail_host.rac_password,
        system_type: this.detail_host.system_type,
        system_version: this.detail_host.system_version,
        position: this.detail_host.position,
        role: this.detail_host.role,
        cluster: this.detail_host.cluster,
        comment: this.detail_host.comment,
        brand: this.detail_host.brand.id,
        idc: this.detail_host.idc.id,
        machine_room: this.detail_host.machine_room.id,
        cabinet: this.detail_host.cabinet.id
      }
      console.log('param', param)
      let res = await this.$http.patch_host(param)
      this.detailGroup.visible = false
      this.$message.success('修改成功')
      this.getHostList()
      this.detailGroup.visible = false
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
      this.$confirm('确认删除?', '提示', { type: 'warning' }).then(async () => {
        let res = await this.$http.delSafeGroup({ groupId: id })
        if (res.code === 4000) {
          this.$message.success('删除成功')
          this.$refs.tableList.getData()
        } else {
          this.$message.warning(res.msg)
        }
      })
    },
    add () {
      this.addGroup.visible = true
    },
    edit (item) {
      this.editGroup = {
        visible: true,
        form: {
          groupName: item.SecurityGroupName,
          description: item.SecurityGroupDesc,
          groupId: item.SecurityGroupId
        }
      }
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
      this.editGroup = {
        visible: false,
        form: { groupName: '', description: '', groupId: '' }
      }
      this.addGroup = {
        visible: false,
        form: { groupName: '', description: '', projectId: '' }
      }
    },
    async getHostList () {
      const param = {
        idc: this.idcId,
        machine_room: this.machineroomId,
        cabinet: this.cabinetId
      }
      console.log('param', param)
      let res = await this.$http.get_host_list(param)
      console.log('res.results', res.results)
      this.$refs.hostList.setData(res.results, res.count)
      this.condition = param
    },
    async getLocationList () {
      let resIdc = await this.$http.get_idc_list()
      this.idcList = resIdc.results
      let resMachineroom = await this.$http.get_machineroom_list()
      this.machineroomList = resMachineroom.results
      let resCabinets = await this.$http.get_cabinets_list()
      this.cabinetList = resCabinets.results
      let resbrand = await this.$http.get_brand_list()
      this.brandList = resbrand.results
      console.log('this brandList', this.brandList)
    },
    getPerm () {
      let perm = JSON.parse(window.sessionStorage.getItem('permission'))
      if (perm.includes('add_poweroff')) {
        this.tableSelectOptions[0].disabledperm = false
      } else {
        this.tableSelectOptions[0].disabledperm = true
      }
      if (perm.includes('add_poweron')) {
        this.tableSelectOptions[1].disabledperm = false
      } else {
        this.tableSelectOptions[1].disabledperm = true
      }
      if (perm.includes('add_restart')) {
        this.tableSelectOptions[2].disabledperm = false
      } else {
        this.tableSelectOptions[2].disabledperm = true
      }
      if (perm.includes('add_pushpowerbutton')) {
        this.tableSelectOptions[3].disabledperm = false
      } else {
        this.tableSelectOptions[3].disabledperm = true
      }
      if (perm.includes('delete_hosts')) {
        this.tableSelectOptions[4].disabledperm = false
      } else {
        this.tableSelectOptions[4].disabledperm = true
      }
      if (perm.includes('change_hosts')) {
        this.buttonChange = true
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
