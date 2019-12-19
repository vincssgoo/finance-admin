<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>
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
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="角色名" min-width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="创建时间" min-width="200">
        <template slot-scope="scope">
          <i class="el-icon-time"/>
          <span>{{ scope.row.created_at }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template v-if="scope.row.id != 1" slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDel(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" :total="total" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
      <el-form ref="form" :rules="rules" :model="form" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="角色名" prop="name">
          <el-input v-model="form.name"/>
        </el-form-item>
        <el-form-item label="权限" prop="permissions">
          <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
          <div style="margin: 15px 0;"></div>
          <el-checkbox-group v-model="form.permissions" @change="handleCheckedPermissionsChange">
            <el-checkbox v-for="permission in permissions" :label="permission.id" :key="permission.id">{{permission.display_name}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="saveData" :loading="btnLoading">确定</el-button>
      </div>
    </el-dialog>
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
        limit: 10
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '添加'
      },
      dialogPvVisible: false,
      pvData: [],
      form: {
        id: '',
        name: '',
        permissions: []
      },
      rules: {
        name: [{ required: true, message: '角色名不能为空', trigger: 'change' }],
        permissions: [{ type: 'array', required: true, message: '权限不能为空', trigger: 'change' }]
      },
      //权限复选框
      checkAll: false,
      isIndeterminate: false,
      permissions: [],
      btnLoading: false,
    }
  },
  created() {
    this.getPermissionAll();
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      request({
        url: '/api/backend/role/list',
        method: 'get',
        params: this.listQuery
      }).then(response => {
        this.list = response.data.data
        this.total = response.data.total
        this.listLoading = false
      })
    },
    getPermissionAll() {
      request({
        url: '/api/backend/permission/all',
        method: 'get',
        params: {}
      }).then(response => {
        this.permissions = response.data
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
    resetForm() {
      this.form = {
        id: '',
        name: '',
        permissions: [],
      }
      this.checkAll = false
      this.isIndeterminate = false
      this.btnLoading = false
    },

    handleCreate() {
      this.resetForm()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['form'].clearValidate()
      })
    },
    handleUpdate(row) {
      this.resetForm()
      let form = Object.assign({}, row) // copy obj
      let permissions = [];
      for(let i = 0; i<form.permissions.length; i++) {
        permissions.push(form.permissions[i].id);
      }
      form.permissions = permissions
      this.handleCheckedPermissionsChange(form.permissions)
      this.form = form;
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['form'].clearValidate()
      })
    },
    saveData() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.btnLoading = true
          request({
            url: '/api/backend/role/save',
            method: 'post',
            data: this.form
          }).then(response => {
            this.btnLoading = false
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '保存成功',
              type: 'success',
              duration: 2000
            })
            this.getList();
          }).catch((err) => {
            this.btnLoading = false
          })
        }
      })
    },
    handleDelete(row) {
      this.$notify({
        title: '成功',
        message: '删除成功',
        type: 'success',
        duration: 2000
      })
      const index = this.list.indexOf(row)
      this.list.splice(index, 1)
    },
    handleCheckAllChange(val) {
      let checkedPermissions = [];
      if (val) {
        for(let i = 0; i < this.permissions.length; i++) {
          checkedPermissions.push(this.permissions[i].id);
        }
      }
      this.form.permissions = checkedPermissions;
      this.isIndeterminate = false;
    },
    handleCheckedPermissionsChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.permissions.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.permissions.length;
    },
    handleDel(val) {
      this.$confirm('此操作将删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request({
          url: '/api/backend/role/del',
          method: 'get',
          params: {id: val}
        }).then(()=>{
          this.getList()
          this.$message({
            type: 'success',
            message: '删除成功!'
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
