<template>
  <div class="app-container">
    <div style="margin-bottom:15px;">
      <el-button type="primary"
                 @click="goModified">添加</el-button>
    </div>
    <el-table v-loading="listLoading"
              :data="list"
              element-loading-text="Loading"
              border
              fit
              highlight-current-row>
      <el-table-column align="center"
                       label="序号"
                       width="95">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="图片"
                       align="center">
        <template slot-scope="scope">
          <img :src="scope.row.image"
               class="user-avatar">
        </template>
      </el-table-column>
      <el-table-column label="权重"
                       align="center">
        <template slot-scope="scope">
          {{ scope.row.weight }}
        </template>
      </el-table-column>
      <el-table-column label="操作"
                       width="230"
                       align="center">
        <template slot-scope="scope">
          <el-button size="mini"
                     @click="handleEdit(scope.row)">修改</el-button>
          <el-button size="mini"
                     type="danger"
                     @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>

    </el-table>

    <div class="block"
         style="margin-top:25px">
      <!-- <span class="demonstration">完整功能</span> -->
      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="listQuery.page"
                     :page-sizes="[5, 10, 20, 50,100]"
                     :page-size="listQuery.limit"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import request from "@/utils/request";
export default {

  data () {
    return {
      total: null,
      list: null,
      listLoading: true,
      btnLoading: false,
      dialogVisible: false,
      listQuery: {
        page: 1,
        limit: 10,
      },
      // form: {
      //   id: '',
      //   image: '',
      //   weight: '',
      // }
    }
  },
  created () {
    this.getList()
  },
  methods: {
    getList () {
      console.log('test');

      this.listLoading = true;
      request({
        url: "/api/backend/banner/index",
        method: "get",
        // params: this.listQuery,
      }).then(response => {
        console.log(response);
        this.total = response.data.total;

        this.list = response.data.data;
        this.listLoading = false;
        console.log(this.list);
      });
    },
    goModified () {
      this.$router.replace({ path: '/websiteModified' })
    },
    handleEdit (row) {
      this.$router.replace({
        path: '/websiteModified',
        query: { id: row.id }

      })
    },
    handleDelete (row) {
      this.$confirm("确定要删除轮播图吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        console.log(1234);
        request({
          url: "/api/backend/banner/delete",
          method: "post",
          data: { id: row.id },
        }).then(() => {
          console.log(123);

          // 删除最后一条数据时无数据问题
          this.list.length <= 1 ? this.listQuery.page-- : false;
          this.getList();
          this.$message({
            type: "success",
            message: "操作成功!"
          });
        });
      });
    },
    handleSizeChange (val) {
      this.listQuery.limit = val;
      this.getList();
    },
    handleCurrentChange (val) {
      this.listQuery.page = val;
      this.getList();
    },


  }
}
</script>

<style scope>
.user-avatar {
  width: 160px;
  height: 160px;
  border-radius: 6px;
}
</style>