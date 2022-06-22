<template>
  <el-tabs  style="margin: 1px">
    <div>
      <el-card shadow="hover">
        <div slot="header" class="card_header">
          <el-button  type="primary" icon="el-icon-back" @click="reback">返回</el-button>
          <label style="margin-left: 40%">主机巡检内容</label>
        </div>
        <el-table :empty-text="emptytext" class="tb-edit" :data="inspectList" size="small" style="width: 100%" height="500">
          <el-table-column label="主机" width="100px">
            <template slot-scope="scope">
              <div class="member-box">
                <el-tag  type="success">
                  {{ scope.row.Host }}
                </el-tag>
              </div>
              <!--<div v-for="tag in scope.row.cpu" :key="tag.Name">-->
              <!--{{ tag.Name}}-->
              <!--{{ tag.Health}}-->
              <!--</div>-->
            </template>
          </el-table-column>
          <el-table-column label="cpu" width="100px">
            <template slot-scope="scope">
              <div class="member-box">
                <el-tag v-for="tag in scope.row.Cpu" :key="tag.Name" v-if="scope.row.flag == true" type="success">
                  {{ tag.Name }}
                  {{ tag.Health }}
                </el-tag>
                <el-tag v-if="scope.row.flag == false" type="danger">
                  error
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
                <el-tag v-for="tag in scope.row.Harddisk" :key="tag.Name" v-if="scope.row.flag == true" type="success">
                  {{ tag.Name }}
                  {{ tag.Health}}
                </el-tag>
                <el-tag v-if="scope.row.flag == false" type="danger">
                  error
                </el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="内存">
            <template slot-scope="scope">
              <div class="member-box">
                <el-tag v-for="tag in scope.row.Memory" :key="tag.Name" v-if="scope.row.flag == true" type="success">
                  {{ tag.Name }}
                  {{ tag.Health}}
                </el-tag>
                <el-tag v-if="scope.row.flag == false" type="danger">
                  error
                </el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="网卡">
            <template slot-scope="scope">
              <div class="member-box">
                <el-tag v-for="tag in scope.row.Nic" :key="tag.Name" v-if="tag.LinkStatus == 'Up' && scope.row.flag == true" type="success">
                  {{ tag.Name }}
                  {{ tag.LinkStatus}}
                </el-tag>
                <el-tag v-for="tag in scope.row.Nic" :key="tag.Name" v-if="tag.LinkStatus == 'Down' && scope.row.flag == true" type="danger">
                  {{ tag.Name }}
                  {{ tag.LinkStatus}}
                </el-tag>
                <el-tag v-if="scope.row.flag == false" type="danger">
                  error
                </el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="电源" width="150px">
            <template slot-scope="scope">
              <div class="member-box">
                <el-tag v-for="tag in scope.row.Power" :key="tag.Name" v-if="scope.row.flag == true" type="success">
                  {{ tag.Name }}
                  {{ tag.Health}}
                </el-tag>
                <el-tag v-if="scope.row.flag == false" type="danger">
                  error
                </el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="风扇" width="200px">
            <template slot-scope="scope">
              <div class="member-box">
                <el-tag v-for="tag in scope.row.Fan" :key="tag.Name" v-if="scope.row.flag == true" type="success">
                  {{ tag.Name }}
                  {{ tag.Health}}
                </el-tag>
                <el-tag v-if="scope.row.flag == false" type="danger">
                  error
                </el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="温度" width="200px">
            <template slot-scope="scope">
              <div class="member-box">
                <el-tag v-for="tag in scope.row.Temperature" :key="tag.Name" v-if="scope.row.flag == true" type="success">
                  {{ tag.Name }}
                  {{ tag.Temperature}}
                </el-tag>
                <el-tag v-if="scope.row.flag == false" type="danger">
                  error
                </el-tag>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div>
          <el-footer style="margin-left: 45%">
            <label>{{ loadingtext }}</label>
          </el-footer>
        </div>
        <!--<el-pagination style="padding-top: 20px" layout="total, prev, pager, next, jumper, slot"-->
        <!--@current-change="handleCurrentChange" :page-count="total">-->
        <!--</el-pagination>-->
      </el-card>
    </div>
  </el-tabs>
</template>

<script>
  export default {
    data () {
      return {
        total: 7,
        emptytext: '加载中',
        loadingtext: '加载中',
        loading: false,
        cpuList: [],
        harddiskList: [],
        inspectList: [],
        idcId: '',
        machineroomId: '',
        cabinetId: '',
        idcList: [],
        machineroomList: [],
        cabinetList: [],
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
    created () {
      const val = this.$route.params.checkList
      this.inspectHost(val)
    },
    methods: {
      reback () {
        this.$router.push({name: '主机列表'})
      },
      async inspectHost (val) {
        this.emptytext = '加载中'
        this.loadingtext = ''
        console.log(val)
        // val.forEach(async item => {
        for (let i = 0; i < val.length; i++) {
          const param = {id: val[i]}
          let resinspection = await this.$http.inspection(param)
          console.log(resinspection)
          if (resinspection.hasOwnProperty('msg')) {
            this.inspectList.push({
              flag: false,
              Host: resinspection.Host
            })
          } else {
            this.inspectList.push({
              flag: true,
              Host: resinspection.Host,
              Cpu: resinspection.Cpu,
              Harddisk: resinspection.Harddisk,
              Memory: resinspection.Memory,
              Nic: resinspection.Nic,
              Power: resinspection.Power,
              Fan: resinspection.Fan,
              Temperature: resinspection.Temperature
            })
          }
          this.loadingtext = '加载中'
        }
        this.loadingtext = '加载完毕'
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
        })
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
        this.editGroup = {visible: true, form: {id: item.id, name: item.name, comment: item.comment}}
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
  .member-box{
    .el-tag{
      margin: 4px;
      .tag-button{
        cursor: pointer;
      }
    }
  }
</style>
