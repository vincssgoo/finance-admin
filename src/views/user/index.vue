<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.nickname" placeholder="用户昵称" style="width: 200px;" class="filter-item" clearable/>
      <el-select v-model="listQuery.is_forbidden" placeholder="状态" clearable style="width: 90px" class="filter-item">
        <el-option label="正常" value="0"/>
        <el-option label="被禁用" value="1"/>
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row>
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          <!-- {{ scope.$index }} -->
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="头像" min-width="110" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.avatar" class="user-avatar">
        </template>
      </el-table-column>
      <el-table-column label="昵称" min-width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.nickname }}
        </template>
      </el-table-column>
      <el-table-column label="性别" min-width="110" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.gender == 0">未设置</span>
          <span v-else-if="scope.row.gender == 1">男</span>
          <span v-else-if="scope.row.gender == 2">女</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="用户状态" min-width="110" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.is_forbidden == 0" type="success">正常</el-tag>
          <el-tag v-else type="warning">被禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="注册时间" min-width="200">
        <template slot-scope="scope">
          <i class="el-icon-time"/>
          <span>{{ scope.row.created_at }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-if="scope.row.is_forbidden == 0" type="warning" size="mini" @click="handleForbid(scope.row.id, '禁用')">禁用</el-button>
          <el-button v-else size="mini" type="primary" @click="handleForbid(scope.row.id, '解禁')">解禁</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" :total="total" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
    </div>
  </div>
</template>

<script>

import request from '@/utils/request'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        nickname: '',
        is_forbidden: ''
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      request({
        url: '/api/backend/user/list',
        method: 'get',
        params: this.listQuery
      }).then(response => {
        this.list = response.data.data
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    handleForbid(val,text) {
      this.$confirm('此操作将'+text+'该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request({
          url: '/api/backend/user/forbid',
          method: 'get',
          params: {id: val}
        }).then(()=>{
          this.getList()
          this.$message({
            type: 'success',
            message: '操作成功!'
          });
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });
      });
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 6px;
}
</style>
