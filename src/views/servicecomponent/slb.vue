<template>
  <div class="main">
    <div class="wrapper wrapper-content">
      <d-table :url="url" ref="brandList" v-if="!showDetail" :conditionForm="condition">
        <template slot="headerRight">
          <el-form-item>
            <el-button v-loading="slbloading" type="primary" @click="syncSlb">同步</el-button>
          </el-form-item>
<!--          <el-form-item>-->
<!--            <el-input placeholder="请输入nginxIp" v-model="nginxIp"></el-input>-->
<!--          </el-form-item>-->
<!--          <el-form-item>-->
<!--            <el-input placeholder="请输入权重值" v-model="nginxWeight"></el-input>-->
<!--          </el-form-item>-->
<!--          <el-form-item>-->
<!--            <el-button type="primary" @click="mul_patch_weight()">修改权重</el-button>-->
<!--          </el-form-item>-->
        </template>
        <template slot="column">
          <el-table-column label="id" width="80px">
            <template slot-scope="scope">
              {{ scope.row.id }}
            </template>
          </el-table-column>
          <el-table-column label="LoadBalancerId">
            <template slot-scope="scope">
              <router-link :to="{name:'servicecomponent_slb_attribute',params: {row: scope.row}}">{{
                scope.row.LoadBalancerId }}
              </router-link>
            </template>
          </el-table-column>
          <el-table-column label="域名">
            <template slot-scope="scope">
              {{ scope.row.LoadBalancerName }}
            </template>
          </el-table-column>
          <el-table-column label="Address">
            <template slot-scope="scope">
              {{ scope.row.Address }}
            </template>
          </el-table-column>
          <el-table-column label="Tags">
            <template slot-scope="scope">
              {{ scope.row.Tags }}
            </template>
          </el-table-column>
          <el-table-column label="项目组">
            <template slot-scope="scope">
              <div v-if="scope.row.project !== null">
                {{scope.row.project.projectName}}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="创建时间">
            <template slot-scope="scope">
              {{ scope.row.create_at }}
            </template>
          </el-table-column>
          <el-table-column label="修改时间">
            <template slot-scope="scope">
              {{ scope.row.update_at }}
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-dropdown split-button trigger="click" type="primary" @click="edit(scope.row)"
                           @command="handleCommand">详情
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item :command="'delete.' + scope.row.id" :disabled="!buttonDelete">删除</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
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
        data() {
            return {
                nginxIp: null,
                nginxWeight: null,
                url: '',
                slbloading: false,
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
        created() {
            // this.getPerm()
            this.url = '/api/cmdb/aliyunslb/?RegionId=cn-shanghai/'
        },
        methods: {
            // async mul_patch_weight() {
            //     this.$confirm('确认同步?', '提示', {type: 'warning'}).then(async () => {
            //         const param = {nginxIp: this.nginxIp, nginxWeight: this.nginxWeight}
            //         let res = await this.$http.multiplePatchSlbBsApi(param)
            //         if (res.hasOwnProperty('results')) {
            //             this.$message.success("修改成功!")
            //         } else {
            //             this.$message.error("修改失败!")
            //         }
            //     })
            // },
            async syncSlb() {
                this.$confirm('确认同步?', '提示', {type: 'warning'}).then(async () => {
                    this.slbloading = true
                    let res = await this.$http.syncSlbApi()
                    if (res.hasOwnProperty('results')) {
                        this.$message.success('同步成功!')
                    } else {
                        this.$message.error('同步失败!')
                    }
                    this.slbloading = false
                })
            },
            closeDetail() {
                this.showDetail = false
            },
            showSafeDetail(item, active) {
                this.detailId = item.SecurityGroupId
                this.detailName = item.SecurityGroupName
                this.showDetail = true
                this.activeName = active
            },
            deleteSafeGroup(id) {
                this.$confirm('确认删除?', '提示', {type: 'warning'}).then(async () => {
                    await this.$http.delete_brand({id: id})
                    this.$message.success('删除成功')
                    this.$refs.brandList.getData()
                }).catch(_ => {
                })
            },
            add() {
                this.addGroup.visible = true
            },
            addConfirm() {
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
            edit(item) {
                this.editGroup = {visible: true, form: {id: item.id, name: item.name, comment: item.comment}}
            },
            editConfirm() {
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
            cancelEdit() {
                this.editGroup = {visible: false, form: {groupName: '', description: '', groupId: ''}}
                this.addGroup = {visible: false, form: {name: '', comment: ''}}
            },
            async getBrandList(key) {
                let res = await this.$http.get('/asset/brand/')
                this.$refs.brandList.setData(res.results, res.count)
            },
            getPerm() {
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
            handleCommand(command) {
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
    color: #409EFF;
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
