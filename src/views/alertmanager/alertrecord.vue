<template>
  <div class="main">
    <div class="wrapper wrapper-content">
      <d-table
        url="/api/webhookmanager/alertrecordviewset/"
        ref="alertrecordlist"
        v-if="!showDetail"
        :conditionForm="condition"
      >
        <template slot="headerRight">
          <el-form-item>
            <el-input
              placeholder="记录id"
              v-model="searchRecordId"
              class="input-search"
              style="width: 100px"
            >
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-input
              placeholder="根据prometheus模糊搜索"
              v-model="searchPrometheusUrl"
              class="input-search"
              style="width: 250px"
            >
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-input
              placeholder="根据监控项模糊搜索"
              v-model="searchAlertname"
              class="input-search"
              style="width: 200px"
            >
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-input
              placeholder="根据标签key"
              v-model="searchLableKey"
              class="input-search"
              style="width: 150px"
            >
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-input
              placeholder="根据标签value"
              v-model="searchLableValue"
              class="input-search"
              style="width: 200px"
            >
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-input
              placeholder="根据状态"
              v-model="searchStatus"
              class="input-search"
              style="width: 200px"
            >
            </el-input>
          </el-form-item>

          <el-form-item label="按照时间:">
            <el-date-picker
              v-model="searchTime"
              type="datetimerange"
              align="right"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :default-time="['01:00:00', '23:00:00']"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button
              icon="el-icon-search"
              type="primary"
              @click="onSearchValue"
              >查询</el-button
            >
          </el-form-item>
        </template>
        <template slot="column">
          <el-table-column prop="id" label="id" width="100px">
            <template slot-scope="scope">
              {{ scope.row.id }}
            </template>
          </el-table-column>
          <el-table-column prop="alertname" label="监控名" width="100px">
            <template slot-scope="scope">
              <div v-if="scope.row.alertname !== null">
                {{ scope.row.alertname }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="监控标签" width="400px">
            <template slot-scope="scope">
              <!--              <div v-for="(value, key) in scope.row.alertLabel">-->
              <!--                <el-tag type="warning">{{key}}: {{value}}</el-tag>-->
              <!--              </div>-->
              {{ scope.row.alertLabel }}
            </template>
          </el-table-column>
          <el-table-column label="监控状态" width="100px">
            <template slot-scope="scope">
              <div v-if="scope.row.alertStatus === 'firing'">
                <el-tag type="danger">firing</el-tag>
              </div>
              <div v-else-if="scope.row.alertStatus === 'resolved'">
                <el-tag type="success">resolved</el-tag>
              </div>
              <div v-else></div>
            </template>
          </el-table-column>
          <el-table-column label="prometheus">
            <template slot-scope="scope">
              {{ scope.row.prometheusUrl }}
            </template>
          </el-table-column>
          <!--          <el-table-column label="alertSource" width="190px">-->
          <!--            <template slot-scope="scope">-->
          <!--              <div v-if="scope.row.alertRule !== null && scope.row.alertRule.alertGroup !== null">-->
          <!--                {{ scope.row.alertRule.alertGroup.id }}-->
          <!--                <br>-->
          <!--                {{ scope.row.alertRule.alertGroup.alertSource }}-->
          <!--                <br>-->
          <!--                {{ scope.row.alertRule.alertGroup.groupName }}-->
          <!--              </div>-->
          <!--            </template>-->
          <!--          </el-table-column>-->
          <!--          <el-table-column label="环境" width="100px">-->
          <!--            <template slot-scope="scope">-->
          <!--              <div v-if="scope.row.alertRule !== null && scope.row.alertRule.alertGroup !== null && scope.row.alertRule.alertGroup.env !== null">-->
          <!--                {{ scope.row.alertRule.alertGroup.env.id }}-->
          <!--                <br>-->
          <!--                {{ scope.row.alertRule.alertGroup.env.name }}-->
          <!--              </div>-->
          <!--            </template>-->
          <!--          </el-table-column>-->
          <el-table-column label="alertAnnotations" width="200px">
            <template slot-scope="scope">
              {{ scope.row.alertAnnotations }}
            </template>
          </el-table-column>
          <el-table-column label="alertGeneratorURL" width="200px">
            <template slot-scope="scope">
              {{ scope.row.alertGeneratorURL }}
            </template>
          </el-table-column>
          <el-table-column label="createdTime" width="200px">
            <template slot-scope="scope">
              {{ scope.row.createdTime }}
            </template>
          </el-table-column>
        </template>
      </d-table>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  data () {
    return {
      searchStatus: null,
      searchLableKey: null,
      searchLableValue: null,
      searchPrometheusUrl: null,
      searchRecordId: null,
      searchAlertname: null,
      searchTime: null,
      condition: {},
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
        this.onSearchValue()
      }
    }
  },
  methods: {
    async onSearchValue () {
      if (!(this.searchTime instanceof Array)) {
        this.searchTime = null
      } else {
        this.searchTime =
          moment(this.searchTime[0]).format('YYYY-MM-DD HH:mm:ss') +
          ',' +
          moment(this.searchTime[1]).format('YYYY-MM-DD HH:mm:ss')
      }
      const param = {}
      if (this.searchStatus) {
        param['alertStatus__icontains'] = this.searchStatus
      }
      if (this.searchRecordId) {
        param['id'] = this.searchRecordId
      }
      if (this.searchPrometheusUrl) {
        param['prometheusUrl__icontains'] = this.searchPrometheusUrl
      }
      if (this.searchAlertname) {
        param['alertname__icontains'] = this.searchAlertname
      }
      if (this.searchTime) {
        param['createdTime__range'] = this.searchTime
      }
      if (this.searchLableKey && this.searchLableValue) {
        param['alertLabel'] = {
          searchLableKey: this.searchLableKey,
          searchLableValue: this.searchLableValue
        }
      }
      let res = await this.$http.searchAlertLogApi(param)
      this.$refs.alertrecordlist.setData(res.results, res.count)
      this.condition = param
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
