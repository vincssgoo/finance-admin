<template>
  <div class="app-container">
    <div style="margin-bottom:15px;">
      <span style="margin-left:40px;">时间段</span>
      <el-date-picker style="margin-left:20px;width: 150px;"
                      type="date"
                      v-model="listQuery.start_datetime"
                      placeholder="开始日期时间"
                      value-format="yyyy-MM-dd"></el-date-picker>
      至
      <el-date-picker style="width: 150px;"
                      type="date"
                      v-model="listQuery.end_datetime"
                      placeholder="结束日期时间"
                      value-format="yyyy-MM-dd">
      </el-date-picker>
      <el-button type="primary"
                 plain
                 style="float:right;"
                 icon="el-icon-search"
                 @click="handleFilter(value)">搜索</el-button>
    </div>
    <el-table v-loading="listLoading"
              :data="list"
              element-loading-text="Loading"
              border
              fit
              highlight-current-row>
      <el-table-column align="center"
                       label="序号"
                       width="115">
        <template slot-scope="scope">
          {{ scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column label="盈亏金额"
                       align="center"
                       width="160">
        <template slot-scope="scope">
          <div v-if="scope.row.net_income>=0">
            {{ scope.row.net_income }}
          </div>
          <div v-else
               style="color:red">
            {{ scope.row.net_income }}
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center"
                       label="收入"
                       width="160">
        <template slot-scope="scope">
          {{ scope.row.income }}
        </template>
      </el-table-column>
      <el-table-column align="center"
                       label="支出"
                       width="160">
        <template slot-scope="scope">
          {{ scope.row.pay }}
        </template>
      </el-table-column>
      <el-table-column align="center"
                       label="时间">
        <template slot-scope="scope">
          {{ scope.row.settle_date }}
        </template>
      </el-table-column>
      <el-table-column align="center"
                       label="对账人"
                       width="160">
        <template slot-scope="scope">

          <div v-if="scope.row.admin.length==0"
               style="color:red">
            未对账
          </div>
          <div v-else>
            {{ scope.row.admin.nickname }}
          </div>
        </template>
      </el-table-column>

      <el-table-column label="操作"
                       width="220"
                       align="center">
        <template slot-scope="scope"
                  style="">
          <div>

            <div v-if="scope.row.admin.length==0"
                 style="color:red">
              <el-button @click="handleEdit(scope.row)"
                         type="primary">对账</el-button>
            </div>
            <div v-else></div>
          </div>

        </template>
      </el-table-column>

    </el-table>
    <div class="block"
         style="margin-top:25px">
      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="listQuery.page"
                     :page-sizes="[5, 10, 20, 50,100]"
                     :page-size="listQuery.limit"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total">
      </el-pagination>
    </div>
    <!-- <router-vie  w /> -->
  </div>
</template>
<script>
import request from "@/utils/request";
// import UploadList from '@/components/UploadList'

export default {
  data () {
    return {
      listQuery: {
        page: 1,
        limit: 10,
        keyword: '',
        end_datetime: '',
        start_datetime: '',
        no: '',
        type_id: '',
      },
      btnLoading: false,
      listLoading: true,
      list: null,
    }
  },
  created () {
    this.getList()
  },
  methods: {
    handleSizeChange (val) {
      this.listQuery.limit = val;
      this.getList();
    },
    handleCurrentChange (val) {
      this.listQuery.page = val;
      this.getList();
    },
    handleFilter (value) {
      this.listQuery.page = 1;
      this.getList();
    },
    // handleEdit (row) {
    //   this.$confirm('确定要进行对账操作吗?', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //   }).then(() => {
    //     this.changeStatus(row)
    //   }).catch(() => {

    //   });
    // },
    // changeStatus (row) {
    //   request({
    //     url: "/api/backend/moneySettle/handle",
    //     method: "post",
    //     data: { id: row.id }
    //   }).then(response => {
    //     if (row.status == '1') {
    //       row.status = '2'
    //     }
    //     else if (row.status == '2') {
    //       row.status = '1'
    //     }
    //     this.getList()
    //   });
    // },
    getList () {
      this.listLoading = true;
      request({
        url: "/api/backend/moneySettle/index",
        method: "get",
        params: this.listQuery
      }).then(response => {
        this.list = response.data.data;
        this.total = response.data.total;
        this.listLoading = false;
        console.log(this.list);
      });

    },

  },
  components: {
    // UploadList
  }
}
</script>