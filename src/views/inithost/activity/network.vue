<template>
  <div class="main">
    <div class="wrapper wrapper-content">
      <el-tabs type="border-card">
        <el-tab-pane label="网卡列表">
          <el-table v-loading="loading" element-loading-text="加载中"
                    element-loading-spinner="el-icon-loading"
                    element-loading-background="rgba(0, 0, 0, 0.8)" size="medium" :data="netWorkList" height="500"
                    style="width: 100%">
            <el-table-column prop="name" label="网卡名"></el-table-column>
            <el-table-column prop="state" label="状态"></el-table-column>
            <el-table-column prop="type" label="类型"></el-table-column>
            <el-table-column prop="con" label="配置文件"></el-table-column>
            <el-table-column prop="ip" label="IP地址"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" @click="openDetail(scope.row.name, scope.row.type)" plain>详情</el-button>
                <el-button type="danger" v-if="scope.row.type !== 'ethernet'" @click="deleteNIC(scope.row.name)">删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div style="text-align: right;padding-top: 10px">
            <el-button type="success" icon="el-icon-refresh" @click="getNetworkList">刷新</el-button>
            <el-button @click="openAddBond()" type="primary" plain>新建Bond</el-button>
            <el-button @click="openAddBridge()" type="primary" plain>新建Bridge</el-button>
            <el-button @click="openAddVlan()" type="primary" plain>新建Vlan</el-button>
            <el-button @click="lastStep()" type="primary" plain>上一步</el-button>
            <el-button @click="nextStep()" type="primary" plain>下一步</el-button>
          </div>
        </el-tab-pane>
      </el-tabs>
      <el-dialog title="新建Bond" :visible.sync="bondGroup.visible" width="40%">
        <el-form :model="bondGroup.form" ref="addForm" labelWidth="100px">
          <el-form-item prop="name" label="Bond名称" :rules="$newrules.empty">
            <el-input v-model="bondGroup.form.name" placeholder="bond0"></el-input>
          </el-form-item>
          <div v-if="bondGroup.form.method === 'manual'">
            <el-form-item v-for="(item, index) in bondGroup.form.ip"
                          :key="'ip_' + index"
                          label="IP信息"
                          :prop="'ip.' + index + '.address'"
                          :rules="$newrules.checkIP">
              <el-col :span="10">
                <el-input v-model="item.address" placeholder="192.168.232.100" style="width: 100%;"></el-input>
              </el-col>
              <el-col class="line text-center" :span="2">/</el-col>
              <el-col :span="6">
                <el-input-number v-model="item.prefix" :min="0" :max="32" controls-position="right" label="掩码"
                                 style="width: 100%;"></el-input-number>
              </el-col>
              <el-col :span="6" class="text-center">
                <el-checkbox v-model="item.is_management" style="width: 100%;">管理IP</el-checkbox>
              </el-col>
            </el-form-item>
            <el-form-item prop="gateway" label="网关">
              <el-input v-model="bondGroup.form.gateway" placeholder="192.168.232.1"></el-input>
            </el-form-item>
            <el-form-item v-for="(item, index) in bondGroup.form.dns"
                          :key="'dns_' + index"
                          label="DNS"
                          :prop="'dns.' + index + '.value'">
              <el-input v-model="item.value" placeholder="114.114.114.114"></el-input>
            </el-form-item>
          </div>
          <el-form-item label="IP地址模式" :rules="$newrules.empty">
            <el-select v-model="bondGroup.form.method" placeholder="请选择" @change="bondMethodChange">
              <el-option v-for="item in methodOption" :key="item.value" :label="item.label"
                         :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="Bond模式" :rules="$newrules.empty">
            <el-select v-model="bondGroup.form.mode" placeholder="请选择">
              <el-option
                v-for="item in bondModeOption"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="绑定设备" :rules="$newrules.empty">
            <el-select v-model="bondGroup.form.slave"
                       multiple
                       @visible-change="bondGetNIC($event)"
                       placeholder="请选择绑定设备" :loading="bondSlaveLoading">
              <el-option
                v-for="item in bondSlave"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="bondGroup.form.method === 'manual'">
            <el-button @click="bondAddIP">添加IP信息</el-button>
            <el-button @click="bondDeleteIP">删除IP信息</el-button>
            <el-button @click="bondAddDNS">添加DNS</el-button>
            <el-button @click="bondDeleteDNS">删除DNS</el-button>
          </el-form-item>
          <el-form-item style="text-align: right">
            <el-button type="primary" @click="bondAddConfirm">确 定</el-button>
            <el-button @click="bondCancel">取 消</el-button>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer"></span>
      </el-dialog>
      <el-dialog title="新建Bridge" :visible.sync="bridgeGroup.visible" width="40%">
        <el-form :model="bridgeGroup.form" ref="addForm" labelWidth="100px">
          <el-form-item prop="name" label="Bridge名称" :rules="$newrules.empty">
            <el-input v-model="bridgeGroup.form.name"></el-input>
          </el-form-item>
          <div v-if="bridgeGroup.form.method === 'manual'">
            <el-form-item v-for="(item, index) in bridgeGroup.form.ip"
                          :key="'ip_' + index"
                          label="IP信息"
                          :prop="'ip.' + index + '.address'"
                          :rules="$newrules.checkIP">
              <el-col :span="10">
                <el-input v-model="item.address" placeholder="192.168.232.100" style="width: 100%;"></el-input>
              </el-col>
              <el-col class="line text-center" :span="2">/</el-col>
              <el-col :span="6">
                <el-input-number v-model="item.prefix" :min="0" :max="32" controls-position="right" label="掩码"
                                 style="width: 100%;"></el-input-number>
              </el-col>
              <el-col :span="6" class="text-center">
                <el-checkbox v-model="item.is_management" style="width: 100%;">管理IP</el-checkbox>
              </el-col>
            </el-form-item>
            <el-form-item prop="gateway" label="网关">
              <el-input v-model="bridgeGroup.form.gateway" placeholder="192.168.232.1"></el-input>
            </el-form-item>
            <el-form-item v-for="(item, index) in bridgeGroup.form.dns"
                          :key="'dns_' + index"
                          label="DNS"
                          :prop="'dns.' + index + '.value'">
              <el-input v-model="item.value" placeholder="114.114.114.114"></el-input>
            </el-form-item>
          </div>
          <el-form-item label="IP地址模式" :rules="$newrules.empty">
            <el-select v-model="bridgeGroup.form.method" placeholder="请选择" @change="bridgeMethodChange">
              <el-option v-for="item in methodOption" :key="item.value" :label="item.label"
                         :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="桥接设备" :rules="$newrules.empty">
            <el-select v-model="bridgeGroup.form.slave"
                       @visible-change="bridgeGetNIC($event)"
                       placeholder="请选择桥接设备" :loading="bridgeSlaveLoading">
              <el-option
                v-for="item in bridgeSlave"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="bridgeGroup.form.method === 'manual'">
            <el-button @click="bridgeAddIP">添加IP信息</el-button>
            <el-button @click="bridgeDeleteIP">删除IP信息</el-button>
            <el-button @click="bridgeAddDNS">添加DNS</el-button>
            <el-button @click="bridgeDeleteDNS">删除DNS</el-button>
          </el-form-item>
          <el-form-item style="text-align: right">
            <el-button type="primary" @click="bridgeAddConfirm">确 定</el-button>
            <el-button @click="bridgeCancel">取 消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <el-dialog title="新建Vlan" :visible.sync="vlanGroup.visible" width="40%">
        <el-form :model="vlanGroup.form" ref="addForm" labelWidth="100px">
          <el-form-item prop="name" label="Vlan名称" :rules="$newrules.empty">
            <el-input v-model="vlanGroup.form.name"></el-input>
          </el-form-item>
          <el-form-item v-for="(item, index) in vlanGroup.form.ip"
                        :key="'ip_' + index"
                        label="IP信息"
                        :prop="'ip.' + index + '.address'"
                        :rules="$newrules.checkIP">
            <el-col :span="10">
              <el-input v-model="item.address" placeholder="192.168.232.100" style="width: 100%;"></el-input>
            </el-col>
            <el-col class="line text-center" :span="2">/</el-col>
            <el-col :span="6">
              <el-input-number v-model="item.prefix" :min="0" :max="32" controls-position="right" label="掩码"
                               style="width: 100%;"></el-input-number>
            </el-col>
          </el-form-item>
          <el-form-item prop="vlan_id" label="Vlan ID" :rules="$newrules.empty">
            <el-input-number v-model="vlanGroup.form.vlan_id" :min="1" :max="4094" controls-position="right"
                             label="掩码" style="width: 100%;"></el-input-number>
          </el-form-item>
          <el-form-item prop="slave" label="标记设备" :rules="$newrules.empty">
            <el-select v-model="vlanGroup.form.slave"
                       @visible-change="vlanGetNIC($event)"
                       placeholder="请选择标记设备" :loading="vlanSlaveLoading">
              <el-option
                v-for="item in vlanSlave"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button @click="vlanAddIP">添加IP信息</el-button>
            <el-button @click="vlanDeleteIP">删除IP信息</el-button>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="addConfirmVlan">确 定</el-button>
            <el-button @click="cancelAddVlan">取 消</el-button>
        </span>
      </el-dialog>
      <el-dialog title="详情" :visible.sync="nicDetail.visible">
        <el-form label-width="120px">
          <el-form-item label="名称">
            <el-input v-model="nicDetail.form.name" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="类型">
            <el-input v-model="nicDetail.form.type" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="nicDetail.form.state">
              <el-option v-for="item in state" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="IP地址模式" :rules="$newrules.empty">
            <el-select v-model="nicDetail.form.method" @change="nicDetailMethodChange">
              <el-option v-for="item in detailMethodOption" :key="item.value" :label="item.label"
                         :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-for="(item, index) in nicDetail.form.ip"
                        :key="'ip_' + index"
                        label="IP信息"
                        :prop="'ip.' + index + '.address'">
            <el-col :span="10">
              <el-input v-model="item.address" style="width: 100%;" :disabled="nicDetail.ipDisable"></el-input>
            </el-col>
            <el-col class="line text-center" :span="2">/</el-col>
            <el-col :span="6">
              <el-input-number v-model="item.prefix" :min="0" :max="32" controls-position="right" label="掩码"
                               style="width: 100%;" :disabled="nicDetail.ipDisable"></el-input-number>
            </el-col>
            <el-col :span="6" class="text-center">
              <el-checkbox v-model="item.is_management" style="width: 100%;" :disabled="nicDetail.ipDisable">管理IP
              </el-checkbox>
            </el-col>
          </el-form-item>
          <el-form-item label="网关">
            <el-input v-model="nicDetail.form.gateway" :disabled="nicDetail.ipDisable"></el-input>
          </el-form-item>
          <el-form-item v-for="(item, index) in nicDetail.form.dns"
                        :key="'dns_' + index"
                        label="DNS"
                        :prop="'dns.' + index + '.value'">
            <el-input v-model="item.value" :disabled="nicDetail.ipDisable"></el-input>
          </el-form-item>
          <el-form-item label="绑定设备" :rules="$newrules.empty" v-if="nicDetail.form.type !== 'ethernet'">
            <el-select v-model="nicDetail.form.slave" multiple disabled>
              <el-option
                v-for="item in nicSlave"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="nicDetail.form.method === 'manual'">
            <el-button @click="nicDetailAddIP">添加IP信息</el-button>
            <el-button @click="nicDetailDeleteIP">删除IP信息</el-button>
            <el-button @click="nicDetailAddDNS">添加DNS</el-button>
            <el-button @click="nicDetailDeleteDNS">删除DNS</el-button>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="nicDetailConfirm">确 定</el-button>
          <el-button @click="nicDetailCancel">取 消</el-button>
        </span>
      </el-dialog>
      <el-dialog title="Vlan详情" :visible.sync="vlanDetail.visible">
        <el-form label-width="120px">
          <el-form-item label="名称">
            <el-input v-model="vlanDetail.form.name" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="类型">
            <el-input v-model="vlanDetail.form.type" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="vlanDetail.form.state">
              <el-option v-for="item in state" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-for="(item, index) in vlanDetail.form.ip"
                        :key="'ip_' + index"
                        label="IP信息"
                        :prop="'ip.' + index + '.address'">
            <el-col :span="10">
              <el-input v-model="item.address" style="width: 100%;" :disabled="vlanDetail.ipDisable"></el-input>
            </el-col>
            <el-col class="line text-center" :span="2">/</el-col>
            <el-col :span="6">
              <el-input-number v-model="item.prefix" :min="0" :max="32" controls-position="right" label="掩码"
                               style="width: 100%;" :disabled="vlanDetail.ipDisable"></el-input-number>
            </el-col>
          </el-form-item>
          <el-form-item label="标记设备" :rules="$newrules.empty">
            <el-select v-model="vlanDetail.form.slave" disabled>
              <el-option
                v-for="item in vlanSlave"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button @click="vlanDetailAddIP">添加IP信息</el-button>
            <el-button @click="vlanDetailDeleteIP">删除IP信息</el-button>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="vlanDetailConfirm">确 定</el-button>
          <el-button @click="vlanDetailCancel">取 消</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  const generateIPData = () => ({
    address: '',
    prefix: 24,
    is_management: false
  })
  const generateDNSData = () => ({
    value: ''
  })
  const generateForm = () => ({
    name: '',
    type: '',
    state: '',
    ip: [],
    gateway: '',
    dns: [],
    method: '',
    slave: []
  })
  const generateVlanForm = () => ({
    name: '',
    type: '',
    state: '',
    vlan_id: 1,
    ip: [],
    slave: ''
  })

  export default {
    data () {
      return {
        name: '',
        state: [{label: 'UP', value: 'UP'}, {label: 'DOWN', value: 'DOWN'}],
        methodOption: [{label: '自动', value: 'auto'}, {label: '手动', value: 'manual'}],
        detailMethodOption: [{label: '无', value: ''}, {label: '自动', value: 'auto'}, {label: '手动', value: 'manual'}],
        bondGroup: {
          visible: false,
          form: {
            name: '',
            ip: [],
            gateway: '',
            dns: [],
            method: '',
            mode: '',
            slave: []
          }
        },
        bridgeGroup: {
          visible: false,
          form: {
            name: '',
            ip: [],
            gateway: '',
            dns: [],
            method: '',
            slave: ''
          }
        },
        vlanGroup: {
          visible: false,
          form: {
            name: '',
            ip: [{address: '', prefix: 24}],
            vlan_id: '',
            slave: ''
          }
        },
        nicDetail: {
          visible: false,
          ipDisable: false,
          form: generateForm()
        },
        nicSlave: [],
        vlanDetail: {
          visible: false,
          ipDisable: false,
          form: generateVlanForm()
        },
        id: '',
        loading: false,
        netWorkList: [],
        // 新建bond
        bondModeOption: [
          {label: '0 - 轮询负载均衡', value: 0},
          {label: '1 - 主备模式', value: 1},
          {label: '2 - XOR Hash负载均衡', value: 2},
          {label: '3 - 广播冗余', value: 3},
          {label: '4 - IEEE 802.3ad 动态链接聚合', value: 4},
          {label: '5 - 适配器传输负载均衡', value: 5},
          {label: '6 - 适配器适应性负载均衡', value: 6}
        ],
        bondSlave: [],
        bondSlaveLoading: false,
        // 新建bridge
        bridgeSlave: '',
        bridgeSlaveLoading: false,
        // 新建vlan
        vlanSlave: '',
        vlanSlaveLoading: false
      }
    },
    created () {
      if (this.$route.params.id === undefined) {
        this.$router.push({path: '/init/'})
      } else {
        this.id = this.$route.params.id
        this.name = this.$route.params.name
        this.getNetworkList()
      }
    },
    methods: {
      // 主页面
      deleteNIC (name) {
        this.$confirm('确认删除？').then(async () => {
          this.loading = true
          let param = {
            'host_id': this.id,
            'name': name
          }
          let res = await this.$http.deleteDevice(param)
          if (res.hasOwnProperty('msg') !== true) {
            this.$message.success('删除成功')
          }
          this.getNetworkList()
        }).catch(_ => {})
      },
      async getNetworkList () {
        this.loading = true
        const param = {
          'host_id': this.id
        }
        let res = await this.$http.getNicList(param)
        if (res.hasOwnProperty('msg') !== true) {
          this.netWorkList = res.results
        }
        this.loading = false
      },
      openAddBond () {
        this.bondGroup.visible = true
      },
      openAddBridge () {
        this.bridgeGroup.visible = true
      },
      openAddVlan () {
        this.vlanGroup.visible = true
      },
      async openDetail (name, type) {
        let param = {
          host_id: this.id,
          id: name
        }
        this.loading = true
        let res = await this.$http.getDetailNetwork(param)
        if (res.hasOwnProperty('msg') !== true) {
          if (type === 'ethernet' || type === 'bond' || type === 'bridge') {
            this.nicDetail.form = generateForm()
            if (res.hasOwnProperty('name') && res.name !== '') {
              this.nicDetail.form.name = res.name
              this.nicDetail.form.type = res.type
              this.nicDetail.form.state = res.state
              if (res.ip.length === 0) {
                this.nicDetail.form.ip = [generateIPData()]
              } else {
                this.nicDetail.form.ip = res.ip
              }
              this.nicDetail.form.gateway = res.gateway
              if (res.dns.length === 0) {
                this.nicDetail.form.dns = [generateDNSData()]
              } else {
                let dns = []
                res.dns.forEach(function (item) {
                  dns.push({value: item})
                })
                this.nicDetail.form.dns = dns
              }
              this.nicDetail.ipDisable = res.method !== 'manual'
              this.nicDetail.form.method = res.method
              this.nicDetail.form.slave = res.slave
              this.nicDetail.visible = true
            }
          } else if (type === 'vlan') {
            this.vlanDetail.form = generateVlanForm()
            if (res.hasOwnProperty('name') && res.name !== '') {
              this.vlanDetail.form.name = res.name
              this.vlanDetail.form.type = res.type
              this.vlanDetail.form.state = res.state
              this.vlanDetail.form.vlan_id = res.vlan_id
              if (res.ip.length === 0) {
                this.vlanDetail.form.ip = [{address: '', prefix: 24}]
              } else {
                this.vlanDetail.form.ip = res.ip
              }
              this.vlanDetail.form.slave = res.slave
              this.vlanDetail.visible = true
            }
          }
        }
        this.loading = false
      },
      lastStep () {
        this.$router.push({name: '更改Repo', params: {id: this.id, name: this.name}})
      },
      async nextStep () {
        let param = {
          host_id: this.id
        }
        let res = await this.$http.networkDone(param)
        if (res.hasOwnProperty('msg') !== true) {
          this.$router.push({name: '安装salt', params: {id: this.id, name: this.name}})
        }
      },
      // 新建bond
      bondCancel () {
        this.bondGroup.visible = false
      },
      async bondAddConfirm () {
        let flag = true
        let param = {
          host_id: this.id
        }
        if (this.bondGroup.form.name !== '') {
          param['name'] = this.bondGroup.form.name
        } else {
          flag = false
          this.$message.error('Bond名称不能为空。')
        }
        if (this.bondGroup.form.method !== '') {
          if (this.bondGroup.form.method === 'manual') {
            if (this.bondGroup.form.ip[this.bondGroup.form.ip.length - 1].address !== '') {
              param['ip'] = this.bondGroup.form.ip
            } else {
              flag = false
              this.$message.error('手动模式，IP地址不能为空。')
            }
            if (this.bondGroup.form.dns !== []) {
              let dns = []
              this.bondGroup.form.dns.forEach(function (item) {
                if (item.value !== '') {
                  dns.push(item.value)
                }
              })
              param['dns'] = dns
            }
            param['gateway'] = this.bondGroup.form.gateway
          } else {
            param['ip'] = []
            param['gateway'] = ''
            param['dns'] = []
          }
          param['method'] = this.bondGroup.form.method
        } else {
          flag = false
          this.$message.error('IP地址模式不能为空。')
        }
        if (this.bondGroup.form.mode !== '') {
          param['mode'] = this.bondGroup.form.mode
        } else {
          flag = false
          this.$message.error('bond模式不能为空。')
        }
        if (this.bondGroup.form.slave.length !== 0) {
          param['slave'] = this.bondGroup.form.slave
        } else {
          flag = false
          this.$message.error('必须选择绑定的设备。')
        }
        if (flag) {
          this.bondGroup.visible = false
          this.loading = true
          let res = await this.$http.bondCreate(param)
          if (res.hasOwnProperty('msg')) {
            this.$message.error('Bond创建失败。')
          } else {
            this.$message.success('Bond创建成功。')
            this.bondGroup.form.name = ''
            this.bondGroup.form.method = ''
            this.bondGroup.form.mode = ''
            this.bondGroup.form.slave = []
          }
          this.getNetworkList()
          this.loading = false
        }
      },
      bondAddIP () {
        let len = this.bondGroup.form.ip.length
        if (this.bondGroup.form.ip[len - 1].address !== '') {
          this.bondGroup.form.ip.push(generateIPData())
        } else {
          this.$message.error('ip地址不能为空。')
        }
      },
      bondDeleteIP () {
        if (this.bondGroup.form.ip.length > 1) {
          this.bondGroup.form.ip.pop()
        } else {
          this.$message.error('最少要有一个IP信息。')
        }
      },
      bondAddDNS () {
        let len = this.bondGroup.form.dns.length
        if (this.bondGroup.form.dns[len - 1].value !== '') {
          this.bondGroup.form.dns.push(generateDNSData())
        } else {
          this.$message.error('DNS不能为空。')
        }
      },
      bondDeleteDNS () {
        if (this.bondGroup.form.dns.length > 1) {
          this.bondGroup.form.dns.pop()
        } else {
          this.$message.error('最少要有一个DNS。')
        }
      },
      async bondGetNIC (callback) {
        this.bondSlaveLoading = true
        if (callback) {
          let res = await this.$http.bondGetDevice({host_id: this.id})
          if (res.hasOwnProperty('msg') !== true) {
            this.bondSlave = res.results.sort()
          }
        }
        this.bondSlaveLoading = false
      },
      bondMethodChange () {
        if (this.bondGroup.form.method === 'manual') {
          this.bondGroup.form.ip.push(generateIPData())
          this.bondGroup.form.dns.push(generateDNSData())
        } else {
          this.bondGroup.form.ip = []
          this.bondGroup.form.dns = []
        }
      },
      // 新建bridge
      bridgeCancel () {
        this.bridgeGroup.visible = false
      },
      bridgeMethodChange () {
        if (this.bridgeGroup.form.method === 'manual') {
          this.bridgeGroup.form.ip.push(generateIPData())
          this.bridgeGroup.form.dns.push(generateDNSData())
        } else {
          this.bridgeGroup.form.ip = []
          this.bridgeGroup.form.dns = []
        }
      },
      async bridgeGetNIC (callback) {
        this.bridgeSlaveLoading = true
        if (callback) {
          let res = await this.$http.bridgeGetDevice({host_id: this.id})
          if (res.hasOwnProperty('msg') !== true) {
            this.bridgeSlave = res.results.sort()
          }
        }
        this.bridgeSlaveLoading = false
      },
      async bridgeAddConfirm () {
        let flag = true
        let param = {
          host_id: this.id
        }
        if (this.bridgeGroup.form.name !== '') {
          param['name'] = this.bridgeGroup.form.name
        } else {
          flag = false
          this.$message.error('Bridge名称不能为空。')
        }
        if (this.bridgeGroup.form.method !== '') {
          if (this.bridgeGroup.form.method === 'manual') {
            if (this.bridgeGroup.form.ip[this.bridgeGroup.form.ip.length - 1].address !== '') {
              param['ip'] = this.bridgeGroup.form.ip
            } else {
              flag = false
              this.$message.error('手动模式，IP地址不能为空。')
            }
            if (this.bridgeGroup.form.dns !== []) {
              let dns = []
              this.bridgeGroup.form.dns.forEach(function (item) {
                if (item.value !== '') {
                  dns.push(item.value)
                }
              })
              param['dns'] = dns
            }
            param['gateway'] = this.bridgeGroup.form.gateway
          } else {
            param['ip'] = []
            param['gateway'] = ''
            param['dns'] = []
          }
          param['method'] = this.bridgeGroup.form.method
        } else {
          flag = false
          this.$message.error('IP地址模式不能为空。')
        }
        if (this.bridgeGroup.form.slave !== '') {
          param['slave'] = this.bridgeGroup.form.slave
        } else {
          flag = false
          this.$message.error('必须选择绑定的设备。')
        }
        if (flag) {
          this.bridgeGroup.visible = false
          this.loading = true
          let res = await this.$http.bridgeCreate(param)
          if (res.hasOwnProperty('msg') !== true) {
            this.$message.success('Bridge创建成功')
            this.bridgeGroup.form.name = ''
            this.bridgeGroup.form.method = ''
            this.bridgeGroup.form.slave = ''
          }
          this.getNetworkList()
          this.loading = false
        }
      },
      bridgeAddIP () {
        let len = this.bridgeGroup.form.ip.length
        if (this.bridgeGroup.form.ip[len - 1].address !== '') {
          this.bridgeGroup.form.ip.push(generateIPData())
        } else {
          this.$message.error('ip地址不能为空。')
        }
      },
      bridgeDeleteIP () {
        if (this.bridgeGroup.form.ip.length > 1) {
          this.bridgeGroup.form.ip.pop()
        } else {
          this.$message.error('最少要有一个IP信息。')
        }
      },
      bridgeAddDNS () {
        let len = this.bridgeGroup.form.dns.length
        if (this.bridgeGroup.form.dns[len - 1].value !== '') {
          this.bridgeGroup.form.dns.push(generateDNSData())
        } else {
          this.$message.error('DNS不能为空。')
        }
      },
      bridgeDeleteDNS () {
        if (this.bridgeGroup.form.dns.length > 1) {
          this.bridgeGroup.form.dns.pop()
        } else {
          this.$message.error('最少要有一个DNS。')
        }
      },
      // 新建vlan
      cancelAddVlan () {
        this.vlanGroup.visible = false
      },
      async addConfirmVlan () {
        let flag = true
        let param = {
          host_id: this.id
        }
        if (this.vlanGroup.form.name !== '') {
          param['name'] = this.vlanGroup.form.name
        } else {
          flag = false
          this.$message.error('Vlan名称不能为空。')
        }
        if (this.vlanGroup.form.ip[this.vlanGroup.form.ip.length - 1].address !== '') {
          param['ip'] = this.vlanGroup.form.ip
        } else {
          flag = false
          this.$message.error('IP地址不能为空。')
        }
        if (this.vlanGroup.form.vlan_id !== '') {
          param['vlan_id'] = this.vlanGroup.form.vlan_id
        } else {
          flag = false
          this.$message.error('Vlan ID不能为空。')
        }
        if (this.vlanGroup.form.slave !== '') {
          param['slave'] = this.vlanGroup.form.slave
        } else {
          flag = false
          this.$message.error('必须选择要标记vlan的设备。')
        }
        if (flag) {
          this.vlanGroup.visible = false
          this.loading = true
          let res = await this.$http.vlanCreate(param)
          if (res.hasOwnProperty('msg') !== true) {
            this.$message.success('Vlan创建成功')
            this.vlanGroup.form.name = ''
            this.vlanGroup.form.ip = [{address: '', prefix: 24}]
            this.vlanGroup.form.vlan_id = ''
            this.vlanGroup.form.slave = ''
          }
          this.getNetworkList()
          this.loading = false
        }
      },
      vlanAddIP () {
        let len = this.vlanGroup.form.ip.length
        if (this.vlanGroup.form.ip[len - 1].address !== '') {
          this.vlanGroup.form.ip.push({address: '', prefix: 24})
        } else {
          this.$message.error('ip地址不能为空。')
        }
      },
      vlanDeleteIP () {
        if (this.vlanGroup.form.ip.length > 1) {
          this.vlanGroup.form.ip.pop()
        } else {
          this.$message.error('最少要有一个IP信息。')
        }
      },
      async vlanGetNIC (callback) {
        this.vlanSlaveLoading = true
        if (callback) {
          let res = await this.$http.vlanGetDevice({host_id: this.id})
          if (res.hasOwnProperty('msg') !== true) {
            this.vlanSlave = res.results.sort()
          }
        }
        this.vlanSlaveLoading = false
      },
      // nic详细,包括ethernet、bond、bridge
      async nicDetailConfirm () {
        let flag = true
        let param = {
          host_id: this.id,
          id: this.nicDetail.form.name
        }
        if (this.nicDetail.form.method === 'manual') {
          let len = this.nicDetail.form.ip.length
          if (this.nicDetail.form.ip[len - 1].address !== '') {
            param['ip'] = this.nicDetail.form.ip
          } else {
            flag = false
            this.$message.error('手动模式，IP地址信息不能为空。')
          }
          param['gateway'] = this.nicDetail.form.gateway
          let dns = []
          this.nicDetail.form.dns.forEach(function (item) {
            dns.push(item.value)
          })
          param['dns'] = dns
        } else if (this.nicDetail.form.method === '') {
          flag = false
          this.$message.error('IP地址模式不能为"无"。')
        }
        param['method'] = this.nicDetail.form.method
        param['state'] = this.nicDetail.form.state
        if (flag) {
          this.nicDetail.visible = false
          this.loading = true
          let res = await this.$http.updateNetwork(param)
          if (res.hasOwnProperty('msg') !== true) {
            this.$message.success('配置修改成功。')
            this.getNetworkList()
          }
          this.nicDetail.form = generateForm()
        }
        this.loading = false
      },
      nicDetailCancel () {
        this.nicDetail.visible = false
      },
      nicDetailAddIP () {
        let len = this.nicDetail.form.ip.length
        if (this.nicDetail.form.ip[len - 1].address !== '') {
          this.nicDetail.form.ip.push(generateIPData())
        } else {
          this.$message.error('前面的IP地址不能为空。')
        }
      },
      nicDetailDeleteIP () {
        if (this.nicDetail.form.ip.length > 1) {
          this.nicDetail.form.ip.pop()
        } else {
          this.$message.error('最少要有一个IP地址信息。')
        }
      },
      nicDetailAddDNS () {
        let len = this.nicDetail.form.dns.length
        if (this.nicDetail.form.dns[len - 1].value !== '') {
          this.nicDetail.form.dns.push(generateDNSData())
        } else {
          this.$message.error('上一个DNS不能为空。')
        }
      },
      nicDetailDeleteDNS () {
        if (this.nicDetail.form.dns.length > 1) {
          this.nicDetail.form.dns.pop()
        } else {
          this.$message.error('最少要保留一个DNS输入框。')
        }
      },
      nicDetailMethodChange () {
        this.nicDetail.ipDisable = this.nicDetail.form.method !== 'manual'
      },
      // Vlan详细
      async vlanDetailConfirm () {
        let flag = true
        let param = {
          host_id: this.id,
          id: this.vlanDetail.form.name
        }
        if (this.vlanDetail.form.method === 'manual') {
          let len = this.vlanDetail.form.ip.length
          if (this.vlanDetail.form.ip[len - 1].address !== '') {
            param['ip'] = this.vlanDetail.form.ip
          } else {
            flag = false
            this.$message.error('手动模式，IP地址信息不能为空。')
          }
          param['gateway'] = this.vlanDetail.form.gateway
          let dns = []
          this.vlanDetail.form.dns.forEach(function (item) {
            dns.push(item.value)
          })
          param['dns'] = dns
        } else if (this.vlanDetail.form.method === '') {
          flag = false
          this.$message.error('IP地址模式不能为"无"。')
        }
        param['method'] = this.vlanDetail.form.method
        param['state'] = this.vlanDetail.form.state
        if (flag) {
          this.vlanDetail.visible = false
          this.loading = true
          let res = await this.$http.updateVlan(param)
          if (res.hasOwnProperty('msg') !== true) {
            this.$message.success('配置修改成功。')
            this.getNetworkList()
          }
          this.vlanDetail.form = generateForm()
        }
        this.loading = false
      },
      vlanDetailCancel () {
        this.vlanDetail.visible = false
      },
      vlanDetailAddIP () {
        let len = this.vlanDetail.form.ip.length
        if (this.vlanDetail.form.ip[len - 1].address !== '') {
          this.vlanDetail.form.ip.push(generateIPData())
        } else {
          this.$message.error('前面的IP地址不能为空。')
        }
      },
      vlanDetailDeleteIP () {
        if (this.vlanDetail.form.ip.length > 1) {
          this.vlanDetail.form.ip.pop()
        } else {
          this.$message.error('最少要有一个IP地址信息。')
        }
      }
    }
  }
</script>

<style>
</style>
