<template>
  <el-main>
    <el-row>
      <slot name="tab">
      </slot>
        <el-form :inline="true" :model="conditionForm">
          <slot name="headerLeft"></slot>
          <el-form-item>
            <el-button type="success" @click="getData()" icon="el-icon-refresh">刷新</el-button>
          </el-form-item>
          <slot name="headerRight"></slot>
        </el-form>
    </el-row>
      <el-table id="out-table" :row-key="rowKey" v-loading="loading" :data="tableData.list" style="width: 100%;margin-bottom: 20px" size="small" @sort-change="tableSort" @selection-change="handleSelectionChange">
        <slot name="column"></slot>
      </el-table>
      <slot name="batch"></slot>
      <el-pagination style="float: right" layout="total, prev, pager, next, jumper, slot" @current-change="handleCurrentChange" prev-text="上一页" next-text="下一页" :current-page="pageNum" :total="tableData.total">
        <span class="go">Go</span>
      </el-pagination>
      <slot name="footer"></slot>
  </el-main>
</template>

<script>
export default {
  props: {conditionForm: null, url: ''},
  data () {
    return {
      pageNum: 1,
      pageSize: 10,
      tableData: {list: [], total: 1},
      inputValue: '',
      loading: true,
      selectList: []
    }
  },
  watch: {
    inputValue: function (newInput, oldInput) {
      this.filterData(this.inputValue)
    }
  },
  methods: {
    rowKey (row) {
      if (row.id) {
        return row.id
      } else if (row.RecordId) {
        return row.RecordId
      }
    },
    handleSelectionChange (val) {
      this.selectList = val
      this.$emit('SelectionChange', val)
    },
    setPageNumber (number) {
      this.pageNum = number
    },
    async tableSort (v) {
      let orderBy = v.prop
      if (v.order === 'descending') {
        orderBy = '-' + orderBy
      }
      let formData = {pageNumber: this.pageNum, orderBy: orderBy}
      for (let a in this.conditionForm) {
        formData[a] = this.conditionForm[a]
      }
      let res = await this.$http.get(this.url, formData)
      if (res.TotalCount) {
        res.count = res.TotalCount
      }
      this.tableData = {list: res.results || res.data, total: res.count}
    },
    handleCurrentChange (v) {
      this.pageNum = v
      this.getData()
    },
    async getData () {
      this.loading = true
      this.tableData.list = []
      let formData = {page: this.pageNum}
      for (let a in this.conditionForm) {
        formData[a] = this.conditionForm[a]
      }
      let res = await this.$http.get(this.url, formData)
      if (res.TotalCount) {
        res.count = res.TotalCount
      }
      if (res.code === 4000 || !res.code) {
        this.tableData = {list: res.results || res.data, total: res.count || res.total}
      }
      this.loading = false
    },
    filterData (value) {
      if (!value) {
        this.getData()
      } else {
        this.tableData.list = this.tableData.list.filter(i => {
          let str = ''
          for (let key in i) {
            str = str + i[key]
          }
          return str.indexOf(value) > -1
        })
      }
    },
    setData (results, count) {
      this.tableData = {list: results, total: count}
      this.pageNum = 1
    },
    // 查看所有选中项
    getAllSelect () {
      this.setData(this.selectList, this.selectList.length)
    }
  },
  created () {
    this.getData()
  }
}
</script>
<style lang="less" ref="stylesheet/less" scoped>
  .go{
    display: inline-flex !important;
    width: 28px;
    height: 28px;
    border-radius: 28px;
    justify-content: center;
    align-items: center;
    background: #4bff66;
    color: white;
    margin-left: 20px;
    cursor: pointer;
    &:hover{
      background: #19ae31;
    }
  }
</style>
