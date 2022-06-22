<template>
  <div class="main">
    <div class="wrapper wrapper-content">
      <d-table url="/account/operationlog/" ref="operationlogList" v-if="!showDetail" :conditionForm="condition">
        <template slot="headerRight">
          <el-form-item label="操作者:">
            <el-input v-model="searchOperator" class="input-search">
            </el-input>
          </el-form-item>
          <el-form-item label="操作人IP:">
            <el-input v-model="searchOperationIp" class="input-search">
            </el-input>
          </el-form-item>
          <el-form-item label="操作请求内容:">
            <el-input v-model="searchOperationBody" class="input-search">
            </el-input>
          </el-form-item>
          <el-form-item label="操作结果:">
            <el-input v-model="searchResponse" class="input-search">
            </el-input>
          </el-form-item>
          <el-form-item label="按照时间:">
            <el-date-picker
              v-model="selectTime"
              type="datetimerange"
              align="right"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :default-time="['01:00:00', '23:00:00']">
            </el-date-picker>
          </el-form-item>
          <el-form-item >
            <el-button icon="el-icon-search" type="primary" @click="onSearchOperation">查询</el-button>
          </el-form-item>
        </template>
        <template slot="column">
          <el-table-column label="操作人"  min-width="15%">
            <template slot-scope="scope">
              {{ scope.row.operator }}
            </template>
          </el-table-column>
          <el-table-column label="操作人IP" min-width="20%">
            <template slot-scope="scope">
              <div class="group-name">
                {{ scope.row.operate_ip }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作URL" min-width="20%">
            <template slot-scope="scope">
              <div class="group-name">
                {{ scope.row.operate_url }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作人方式" min-width="20%">
            <template slot-scope="scope">
              <div class="group-name">
                {{ scope.row.operate_method }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作人请求内容">
            <template slot-scope="scope">
              <div class="group-name">
                {{ scope.row.operate_request_body }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作结果" min-width="20%">
            <template slot-scope="scope">
              <div class="group-name">
                {{ scope.row.operate_response_status }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作时间" min-width="20%">
            <template slot-scope="scope">
              {{ scope.row.operate_time }}
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
        selectTime: '',
        searchOperator: '',
        searchOperationIp: '',
        searchOperationBody: '',
        searchResponse: '',
        operationlogList: [],
        condition: {},
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
    },
    methods: {
      async onSearchOperation () {
        if ((this.selectTime instanceof Array) == false) {
          this.selectTime = null
        } else {
          this.selectTime = moment(this.selectTime[0]).format('YYYY-MM-DD HH:mm:ss') + ',' + moment(this.selectTime[1]).format('YYYY-MM-DD HH:mm:ss')
        }
        const param = {
          operator: this.searchOperator,
          operate_ip: this.searchOperationIp,
          operate_request_body__contains: this.searchOperationBody,
          operate_response_status: this.searchResponse,
          operate_time__range: this.selectTime
        }
        let res = await this.$http.operationlogsearch(param)
        console.log(res.results)
        this.$refs.operationlogList.setData(res.results, res.count)
        console.log('param', param)
        this.condition = param
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
</style>
