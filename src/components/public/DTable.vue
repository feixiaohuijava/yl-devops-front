<template>
  <el-main>
    <el-row>
      <slot name="tab"> </slot>
      <el-form :inline="true" :model="conditionForm">
        <slot name="headerLeft"></slot>
        <el-form-item>
          <el-button type="success" @click="getData()" icon="el-icon-refresh"
            >刷新</el-button
          >
        </el-form-item>
        <slot name="headerRight"></slot>
      </el-form>
    </el-row>
    <el-table
      :row-class-name="tableRowClassName"
      ref="mainTable"
      id="out-table"
      :row-key="rowKey"
      v-loading="loading"
      :data="tableData.list"
      style="width: 100%;margin-bottom: 20px"
      size="small"
      @sort-change="tableSort"
      @selection-change="handleSelectionChange"
    >
      <slot name="column"></slot>
    </el-table>
    <slot name="batch"></slot>
    <el-pagination
      style="float: right"
      layout="total, prev, pager, next, jumper, slot"
      @current-change="handleCurrentChange"
      prev-text="上一页"
      next-text="下一页"
      :page-size="15"
      :current-page="pageNum"
      :total="tableData.total"
    >
      <span class="go">Go</span>
    </el-pagination>
    <slot name="footer"></slot>
  </el-main>
</template>
<script>
export default {
  props: {
    conditionForm: {},
    url: '',
    isCommunicationMode: false,
    retainPageNum: false,
    publiPageNum: false,
    publishOrderPage: false,
    order: true
  },
  data () {
    return {
      pageNum: 1,
      pageSize: 10,
      tableData: { list: [], total: 1 },
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
    tableRowClassName ({ row, rowIndex }) {
      if (this.order) {
        if (row.parent === null) {
          return 'warning-row'
        } else {
          return 'success-row'
        }
      }
    },
    clearSelection () {
      this.$refs.mainTable.clearSelection()
    },
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
      let formData = {}
      for (let a in this.conditionForm) {
        formData[a] = this.conditionForm[a]
      }
      formData.page = this.pageNum
      formData.subsystem = this.conditionForm.id
      let res = await this.$http.get(this.url, formData)
      if (res.TotalCount) {
        res.count = res.TotalCount
      }
      if (v.prop === 'role') {
        // 角色排序
        if (v.order === 'descending') {
          // 向下排序
          res.results = res.results.sort((a, b) => b.role.localeCompare(a.role))
        } else {
          // 向上排序
          res.results = res.results.sort((a, b) => a.role.localeCompare(b.role))
        }
      } else {
        // 用户排序
        if (v.order === 'descending') {
          // 向下排序
          res.results = res.results.sort((a, b) =>
            b.user.username.localeCompare(a.user.username)
          )
        } else {
          // 向上排序
          res.results = res.results.sort((a, b) =>
            a.user.username.localeCompare(b.user.username)
          )
        }
      }
      res.results.forEach(item => {
        if (item.role === 'dev') {
          item.role = `${item.role}(开发)`
        } else if (item.role === 'product') {
          item.role = `${item.role}(产品)`
        } else if (item.role === 'ops') {
          item.role = `${item.role}(运维)`
        } else if (item.role === 'test') {
          item.role = `${item.role}(测试)`
        }
      })
      this.tableData = res.code
        ? res.code === 4000
          ? { list: res.data, total: res.count }
          : this.$message.warning(res.msg)
        : { list: res.results, total: res.count }
      // let orderBy = v.prop
      // if (v.order === 'descending') {
      //   orderBy = '-' + orderBy
      // }
      // let formData = { pageNumber: this.pageNum, orderBy: orderBy }
      // for (let a in this.conditionForm) {
      //   formData[a] = this.conditionForm[a]
      // }
      // formData.page = this.pageNum
      // let res = await this.$http.get(this.url, formData)
      // if (res.TotalCount) {
      //   res.count = res.TotalCount
      // }
      // console.log('count', res.count)
      // this.tableData = res.code
      //   ? res.code === 4000
      //     ? { list: res.data, total: res.count }
      //     : this.$message.warning(res.msg)
      //   : { list: res.results, total: res.count }
    },
    handleCurrentChange (v) {
      //缓存页码
      if (this.retainPageNum) {
        window.localStorage.setItem('retainPageNum', v)
      }
      if (this.publiPageNum) {
        window.localStorage.setItem('publiPageNum', v)
      }
      if (this.publishOrderPage) {
        window.localStorage.setItem('publishOrderPage', v)
      }
      this.pageNum = v
      this.getData()
    },
    async getData (type) {
      this.loading = true
      this.tableData.list = []
      let formData = {}
      for (let a in this.conditionForm) {
        formData[a] = this.conditionForm[a]
      }
      // 获取缓存查询条件
      if (this.retainPageNum) {
        formData = JSON.parse(window.localStorage.getItem('paramData'))
          ? JSON.parse(window.localStorage.getItem('paramData'))
          : {}
      }
      // 获取缓存页码
      if (
        window.localStorage.getItem('retainPage') === '1' &&
        this.retainPageNum
      ) {
        this.pageNum = Number(window.localStorage.getItem('retainPageNum'))
          ? Number(window.localStorage.getItem('retainPageNum'))
          : 1
      } else if (
        window.localStorage.getItem('retainPage') === '1' &&
        this.publiPageNum
      ) {
        this.pageNum = Number(window.localStorage.getItem('publiPageNum'))
          ? Number(window.localStorage.getItem('publiPageNum'))
          : 1
      }
      window.localStorage.setItem('retainPage', 0)
      if (type === 'add') {
        this.pageNum = 1
      } else {
        formData.page = this.pageNum
      }
      if (this.isCommunicationMode) {
        formData.subsystem = this.conditionForm.id
      }
      console.log('formData', formData)
      let res = await this.$http.get(this.url, formData)
      if (res.TotalCount) {
        res.count = res.TotalCount
      }
      if (this.isCommunicationMode) {
        res.results.forEach(item => {
          if (item.role === 'dev') {
            item.role = `${item.role}(开发)`
          } else if (item.role === 'product') {
            item.role = `${item.role}(产品)`
          } else if (item.role === 'ops') {
            item.role = `${item.role}(运维)`
          } else if (item.role === 'test') {
            item.role = `${item.role}(测试)`
          }
        })
      }
      this.tableData = res.code
        ? res.code === 4000
          ? { list: res.data, total: res.count || res.total }
          : this.$message.warning(res.msg)
        : { list: res.results, total: res.count || res.total }
      this.loading = false
      console.log('list', this.tableData.list)
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
    setData (results, count, page) {
      if (page !== 1) {
        this.tableData = { list: results, total: count }
        this.pageNum = 1
      } else if (page === 1) {
        this.tableData = { list: results, total: count }
        this.pageNum = Number(window.localStorage.getItem('publishOrderPage'))
          ? Number(window.localStorage.getItem('publishOrderPage'))
          : 1
      }
    },
    // 查看所有选中项hh
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
.go {
  display: inline-flex !important;
  width: 28px;
  height: 28px;
  border-radius: 28px;
  justify-content: center;
  align-items: center;
  background: #409eff;
  color: white;
  margin-left: 20px;
  cursor: pointer;
  &:hover {
    background: #19ae31;
  }
}
</style>
<style>
.el-table .warning-row {
  background: #ddf581;
}

.el-table .success-row {
  background: #f0f9eb;
}
</style>
