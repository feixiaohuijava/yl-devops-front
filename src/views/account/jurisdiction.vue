<template>
  <div class="main">
    <div class="wrapper wrapper-content">
      <d-table
        url="/api/account/permission/"
        ref="userList"
        v-if="!showDetail"
        :conditionForm="condition"
      >
        <template slot="headerRight"> </template>
        <template slot="column">
          <el-table-column label="id">
            <template slot-scope="scope">
              {{ scope.row.id }}
            </template>
          </el-table-column>
          <el-table-column label="权限">
            <template slot-scope="scope">
              {{ scope.row.name }}
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-dropdown
                split-button
                trigger="click"
                type="primary"
                @click="edit(scope.row)"
                @command="handleCommand"
                >详情
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item :command="'delete.' + scope.row.id" disabled
                    >删除</el-dropdown-item
                  >
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
export default {
  data () {
    return {
      condition: null,
      showDetail: false
    }
  },
  created () {
    // this.getPerm()
  },
  methods: {
    // 点击详情
    edit (row) {},
    handleCommand (command) {
      let list = command.split('.')
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
