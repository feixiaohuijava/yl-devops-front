<template>
  <div class="main">
    <div class="wrapper wrapper-content">
      <d-table
        url="/api/servicecom/nginxdomainviewset/"
        ref="nginxdomainlist"
        v-if="!showDetail"
        :conditionForm="condition"
      >
        <template slot="headerLeft">
          <el-form-item>
            <el-input
              placeholder="域名模糊搜索"
              v-model="searchValue"
              class="input-search"
            >
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-input
              placeholder="解析地址模糊搜索"
              v-model="searchParseValue"
              class="input-search"
            >
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-select
              clearable
              v-model="slb_config_spec"
              placeholder="规格"
              style="width: 300px"
            >
              <el-option
                v-for="item in slb_config_specs"
                :key="item.k"
                :value="item.v"
                :label="item.k"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input
              placeholder="CDN模糊搜索"
              v-model="searchCdnValue"
              style="width: 250px"
              class="input-search"
            >
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              icon="el-icon-search"
              type="primary"
              @click="onSearchName"
              >查询</el-button
            >
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="syncnginxdomain"
              v-if="this.button_syncnginxdomain"
              >nginx域名同步</el-button
            >
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="syncdomainrecords"
              v-if="this.button_syncaliyundomain"
              >阿里云云解析域名同步
            </el-button>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="synccdn"
              v-if="this.button_synccdn"
              >CDN同步</el-button
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
          <el-table-column prop="id" label="id" width="50px">
            <template slot-scope="scope">
              {{ scope.row.id }}
            </template>
          </el-table-column>
          <el-table-column label="环境">
            <template slot-scope="scope">
              <div v-if="scope.row.env !== null">
                {{ scope.row.env.name }}
              </div>
              <div v-if="scope.row.env === null"></div>
            </template>
          </el-table-column>
          <el-table-column label="域名">
            <template slot-scope="scope">
              {{ scope.row.name }}
            </template>
          </el-table-column>
          <el-table-column label="规格" width="250px">
            <template slot-scope="scope">
              {{ scope.row.slb_config_spec }}
            </template>
          </el-table-column>
          <el-table-column label="解析地址">
            <template slot-scope="scope">
              {{ scope.row.slb_ip }}
            </template>
          </el-table-column>
          <el-table-column label="CDN地址">
            <template slot-scope="scope">
              {{ scope.row.cname }}
            </template>
          </el-table-column>
          <el-table-column label="端口">
            <template slot-scope="scope">
              <div v-if="scope.row.hasOwnProperty('ports')">
                <el-tag v-for="(tag, index) in scope.row.ports" :key="index"
                  >{{ tag.ListenerProtocol }}:{{ tag.ListenerPort }}
                </el-tag>
              </div>
              <div v-if="!scope.row.hasOwnProperty('ports')"></div>
            </template>
          </el-table-column>
          <el-table-column label="配置文件" width="100px">
            <template slot-scope="scope">
              {{ scope.row.config_file_name }}
            </template>
          </el-table-column>
          <el-table-column label="slb标签">
            <template slot-scope="scope">
              <div v-if="scope.row.hasOwnProperty('Tags')">
                <el-tag
                  v-for="tag in scope.row.Tags.Tag"
                  :key="tag.TagKey"
                  v-if="scope.row.Tags != ''"
                  >{{ tag.TagKey }} : {{ tag.TagValue }}
                </el-tag>
                <el-tag v-if="scope.row.Tags == ''"></el-tag>
              </div>
              <div v-if="!scope.row.hasOwnProperty('Tags')"></div>
            </template>
          </el-table-column>
          <el-table-column label="备注">
            <template slot-scope="scope">
              {{ scope.row.description }}
            </template>
          </el-table-column>
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
      slb_config_spec: '',
      slb_config_specs: [
        { k: '简约-max-5千-CPS-3千-QPS-1千', v: 'slb.s1.small' },
        {
          k: '标准1-max-5万-CPS-5千-QPS-5千',
          v: 'slb.s2.small'
        },
        { k: '标准2-max-10万-CPS-1万-QPS-1万', v: 'slb.s2.medium' },
        { k: '高阶1-max-20万-CPS-2万-QPS-2万', v: 'slb.s3.small' },
        {
          k: '高阶2-max-50万-CPS-5万-QPS-3万',
          v: 'slb.s3.medium'
        },
        { k: '超强-max-100万-CPS-10万-QPS-5万', v: 'slb.s3.large' }
      ],
      searchCdnValue: '',
      searchParseValue: '',
      searchValue: '',
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
      button_synccdn: false,
      button_syncaliyundomain: false,
      button_syncnginxdomain: false
    }
  },
  created () {
    this.getPerm()
  },
  mounted () {
    document.onkeydown = event => {
      var code = event.keyCode
      if (code === 13) {
        //这是键盘的enter监听事件
        this.onSearchName()
      }
    }
  },
  methods: {
    async exportdata () {
      this.$confirm('确认导出?', '提示', { type: 'warning' })
        .then(async () => {
          let res = await this.$http.get(
            '/api/servicecom/nginxdomainviewset/?allpage=1'
          )
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
        const tHeader = ['id', '域名', '规格', '解析地址', 'CDN地址']
        // 导出的表头字段名，需要导出表格字段名
        const filterVal = ['id', 'name', 'config_file_name', 'slb_ip', 'cname']
        const list = that.excelData
        const jsonData = that.formatJson(filterVal, list)
        //   // 导出的表格名称，根据需要自己命名
        export_json_to_excel(tHeader, jsonData, '域名slb')
      })
    },
    formatJson (filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    async syncnginxdomain () {
      let res = await this.$http.syncnginxdomainapi()
      if (res.results === 'success') {
        this.$message.success('同步nginx域名成功')
      } else {
        this.$message.error('同步nginx域名失败')
      }
    },
    async syncdomainrecords () {
      let res = await this.$http.syncdomainrecordsapi()
      if (res.results === 'success') {
        this.$message.success('同步阿里云域名成功')
      } else {
        this.$message.error('同步阿里云域名失败')
      }
    },
    async synccdn () {
      let res = await this.$http.synccdnapi()
      if (res.results === 'success') {
        this.$message.success('同步cdn成功')
      } else {
        this.$message.error('同步cdn失败')
      }
    },
    async onSearchName () {
      const param = {
        name__contains: this.searchValue,
        slb_ip__contains: this.searchParseValue,
        cname__contains: this.searchCdnValue,
        slb_config_spec: this.slb_config_spec
      }
      let res = await this.$http.get_domainslb(param)
      this.$refs.nginxdomainlist.setData(res.results, res.count)
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
    getPerm () {
      let perm = JSON.parse(window.sessionStorage.getItem('permission'))
      if (perm.includes('synccdn')) {
        this.button_synccdn = true
      }
      if (perm.includes('syncaliyundomain')) {
        this.button_syncaliyundomain = true
      }
      if (perm.includes('syncnginxdomain')) {
        this.button_syncnginxdomain = true
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
