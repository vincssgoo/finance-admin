<template>
  <div class="app-container">
    <div style="margin-bottom:15px;">
      <span style="margin-left:40px;">时间段</span>
      <el-date-picker style="margin-left:20px;width: 150px;"
                      v-model="listQuery.start_datetime"
                      type="date"
                      placeholder="开始日期时间"
                      value-format="yyyy-MM-dd"></el-date-picker>
      至
      <el-date-picker style="width: 150px;"
                      v-model="listQuery.end_datetime"
                      type="date"
                      placeholder="结束日期时间"
                      value-format="yyyy-MM-dd">
      </el-date-picker>
      <el-button type="primary"
                 plain
                 style="float:right;"
                 icon="el-icon-search"
                 @click="handleFilter(value)">搜索</el-button>
      <el-select v-model="value"
                 placeholder="状态"
                 style="width:120px;margin-right:20px;float:right"
                 clearable>
        <el-option v-for="item in options"
                   :key="item.value"
                   :label="item.label"
                   :value="item.value">
        </el-option>
      </el-select>

      <el-input placeholder="支出说明"
                v-model="listQuery.keyword"
                style="width: 150px;float:right;margin-right:20px"
                clearable>
      </el-input>

    </div>
    <el-table v-loading="listLoading"
              :data="list"
              element-loading-text="Loading"
              border
              fit
              highlight-current-row>
      <el-table-column align="center"
                       label="序号"
                       width="75">
        <template slot-scope="scope">
          {{ scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column align="center"
                       label="支出说明">
        <template slot-scope="scope">
          {{ scope.row.desc }}
        </template>
      </el-table-column>
      <el-table-column align="center"
                       label="支出时间"
                       width="100">
        <template slot-scope="scope">
          {{ scope.row.pay_datetime }}
        </template>
      </el-table-column>
      <el-table-column align="center"
                       label="支出类型"
                       width="100">
        <template slot-scope="scope">
          {{ scope.row.type.title }}
        </template>
      </el-table-column>
      <el-table-column align="center"
                       label="金额"
                       width="90">
        <template slot-scope="scope">
          <el-tag type="success">{{ scope.row.price }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center"
                       label="申请人"
                       width="90">
        <template slot-scope="scope">
          {{ scope.row.applicant }}
        </template>
      </el-table-column>
      <el-table-column align="center"
                       label="备注">
        <template slot-scope="scope">
          {{ scope.row.content }}
        </template>
      </el-table-column>

      <el-table-column align="center"
                       label="提交时间"
                       width="100">
        <template slot-scope="scope">
          {{ scope.row.created_at }}
        </template>
      </el-table-column>
      <el-table-column align="center"
                       label="状态"
                       width="105">

        <template slot-scope="scope">
          <div v-if="scope.row.handle_status == '1' ">
            已处理
          </div>
          <div v-else-if="scope.row.handle_status == '2'"
               style="color:red">
            未处理
          </div>
          <div v-else-if="scope.row.handle_status == '3'"
               style="color:#67c23a">
            已取消
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center"
                       label="处理人"
                       width="105">
        <template slot-scope="scope">
          <div v-if="scope.row.handler">
            {{ scope.row.handler.nickname }}
          </div>
          <div v-else></div>
        </template>
      </el-table-column>
      <el-table-column align="center"
                       label="最新修改时间"
                       width="100">
        <template slot-scope="scope">
          {{ scope.row.updated_at }}
        </template>
      </el-table-column>
      <el-table-column label="操作"
                       width="220"
                       align="center">
        <template slot-scope="scope"
                  style="">
          <div>

            <div v-if="scope.row.handle_status == '1' ">
              <el-button @click="goDetail(scope.row)"
                         type="primary">查看详情</el-button>
            </div>
            <div v-else-if="scope.row.handle_status == '2'"
                 style="color:red">
              <el-button type="danger"
                         @click="cancel(scope.row)">取消</el-button>
              <el-button type="success"
                         @click="goHandle(scope.row)">处理</el-button>

            </div>
            <div v-else-if="scope.row.handle_status == '3'"
                 style="color:red">
            </div>
          </div>

        </template>
      </el-table-column>

    </el-table>
    <div class="block"
         style="margin-top:25px">
      <!-- <span class="demonstration">完整功能</span> -->
      <!-- <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="listQuery.page"
                     :page-sizes="[5, 10, 20, 50,100]"
                     :page-size="listQuery.limit"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total">
      </el-pagination> -->
      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="listQuery.page"
                     :page-sizes="[5, 10, 20, 50,100]"
                     :page-size="listQuery.limit"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total">
      </el-pagination>
    </div>
    <!-- <router-view /> -->
  </div>
</template>
<script>
import request from "@/utils/request";
// import UploadList from '@/components/UploadList'

export default {
  data () {
    return {
      options: [
        {
          value: '选项1',
          label: '未处理',
        },
        {
          value: '选项2',
          label: '已处理',
        },
        {
          value: '选项3',
          label: '已取消',
        },
      ],
      value: '',
      list_location: null,
      list_type: null,
      listQuery: {
        // page: 0,
        // limit: 1000000,
        page: 1,
        limit: 10,
        keyword: '',
        status: '',
        start_datetime: '',
        end_datetime: '',
      },
      btnLoading: false,
      listLoading: true,
      list: null,
      total: null,
    }
  },
  created () {
    this.getList();
  },
  methods: {
    cancel (row) {


      this.$confirm('此操作将取消该申请, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        row.handle_status = '3'
        this.btnLoading = true;
        request({
          url: "/api/backend/expense/cancel",
          method: "post",
          data: { id: row.id }
        })
          .then(() => {
            // this.getTypeList();
            this.$message({
              type: "success",
              message: "操作成功!"
            });
          })
          .finally(() => {
            this.btnLoading = false;
          });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });
      });

    },
    goDetail (row) {
      this.$router.push({
        path: '/reimbursementMan/detail',
        query: { id: row.id }

      })
    },
    goHandle (row) {
      this.$router.push({
        path: '/reimbursementMan/handle',
        query: { id: row.id }

      })
    },
    handleEdit (row) {
      this.$router.push({
        path: '/reimbursementMan/handle',
        query: { id: row.id }

      })
    },
    handleSizeChange (val) {
      this.listQuery.limit = val;
      this.getList();
    },
    handleCurrentChange (val) {
      this.listQuery.page = val;
      this.getList();
    },
    handleFilter (value) {
      // console.log(value);

      if (value == '选项1') {
        this.listQuery.status = '2'
      }
      else if (value == '选项2') {
        this.listQuery.status = '1'
      }
      else if (value == '选项3') {
        this.listQuery.status = '3'
      }
      else {
        this.listQuery.status = ''
      }
      // console.log(this.listQuery.sale_status)
      this.listQuery.page = 1;
      this.getList();
      // this.listQuery.sale_status = ''
    },
    getList () {
      this.listLoading = true;
      console.log(this.listQuery);

      request({
        url: "/api/backend/expense/index",
        method: "get",
        params: this.listQuery
      }).then(response => {
        this.list = response.data.data;
        this.total = response.data.total;
        this.listLoading = false;
        console.log(this.value);
        console.log(this.list);
      });
    },


  },
  components: {
    // UploadList
  }
}
</script>
