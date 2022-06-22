<template>
  <div class="main">
    <div class="wrapper wrapper-content">
      <el-form>
        <el-form-item label="告警记录Id" :rules="$newrules.empty">
          <el-input placeholder="多个Id请以逗号相隔" v-model="recordIds" style="width: 500px"></el-input>
        </el-form-item>
        <el-form-item label="comment" :rules="$newrules.empty">
          <el-input v-model="comment" style="width: 500px"></el-input>
        </el-form-item>
        <el-form-item label="createdBy" :rules="$newrules.empty">
          <el-input v-model="createdBy" style="width: 500px"></el-input>
        </el-form-item>
        <el-form-item label="小时" :rules="$newrules.empty">
          <el-input v-model="hours" style="width: 500px"></el-input>
        </el-form-item>
        <el-form-item label="分钟" :rules="$newrules.empty">
          <el-input v-model="minutes" style="width: 500px"></el-input>
        </el-form-item>
        <el-button type="primary" @click="silenceAlert">沉默</el-button>
      </el-form>
    </div>
  </div>
</template>

<script>
    export default {
        data() {
            return {
                recordIds: null,
                comment: null,
                createdBy: null,
                hours: null,
                minutes: null
            }
        },
        created() {
        },
        methods: {
            async silenceAlert() {
                const param = {
                    recordIds: this.recordIds,
                    comment: this.comment,
                    createdBy: this.createdBy,
                    hours: this.hours,
                    minutes: this.minutes
                }
                let res = await this.$http.silenceAlertApi(param)
                if (res.hasOwnProperty('results')) {
                    this.$message.success('沉默成功!')
                    this.recordIds = null
                    this.comment = null
                    this.createdBy = null
                    this.hours = null
                    this.minutes = null
                } else {
                    this.$message.error('沉默失败!')
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
