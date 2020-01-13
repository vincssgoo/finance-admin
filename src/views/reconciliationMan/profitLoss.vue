<template>
  <div class="app-container">
    <div style="margin-bottom:15px;">
      <el-button style="float:left"
                 type="primary"
                 @click="dialogVisible = true">新建对账</el-button>
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
                       label="开始时间">
        <template slot-scope="scope">
          {{ scope.row.start_date}}
        </template>
      </el-table-column>
      <el-table-column align="center"
                       label="结束时间">
        <template slot-scope="scope">
          {{ scope.row.end_date }}
        </template>
      </el-table-column>
      <el-table-column align="center"
                       label="对账人"
                       width="160">
        <template slot-scope="scope">

          <div v-if="scope.row.admin">
            <el-tag type="success">{{ scope.row.admin.nickname }}</el-tag>
          </div>
          <div v-else>
            <el-tag type="danger">未对账</el-tag>
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
    <el-dialog :visible.sync="dialogVisible"
               :close-on-click-modal="false"
               class="dialog">
      <div class="first">
        <span>上次结算至:{{last}}</span>
        <div class="last"><span>本次结算日期从 {{now}} 至:</span></div>

        <el-form ref="form"
                 :model="form"
                 label-position="left"
                 label-width="70px">
          <el-form-item label="日期"
                        prop="name">
            <el-date-picker v-model="form.end_date"
                            type="date"
                            placeholder="选择日期"
                            value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
        </el-form>

      </div>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary"
                   @click="saveData"
                   :loading="btnLoading">确定</el-button>
      </div>
    </el-dialog>
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
      dialogVisible: false,
      total: null,
      btnLoading: false,
      listLoading: true,
      list: null,
      time: null,
      last: '',
      now: '',
      form: {
        start_date: '',
        end_date: '',
      },
    }
  },
  created () {
    this.getList()
    this.getTime()
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
    handleEdit (row) {
      this.$confirm('确定要进行对账操作吗?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        this.changeStatus(row)
      }).catch(() => {

      });
    },
    changeStatus (row) {
      request({
        url: "/api/backend/moneySettle/handle",
        method: "post",
        data: { id: row.id }
      }).then(response => {
        this.$message({
          type: 'success',
          message: '对账成功!'
        });
        this.getList()
      });
    },
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
    getTime () {
      this.listLoading = true;
      request({
        url: "/api/backend/moneySettle/date",
        method: "get",
      }).then(response => {
        this.time = response.data;
        this.last = this.time.last_end_date
        this.now = this.time.now_start_date
        this.listLoading = false;
      });
    },
    saveData () {
      this.form.start_date = this.time.now_start_date
      this.btnLoading = true;
      request({
        url: "/api/backend/moneySettle/handle",
        method: "post",
        data: this.form
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "操作成功!"
          });
          this.dialogVisible = false;
          this.getList()
          this.getTime()
        })
        .finally(() => {
          this.btnLoading = false;
        });
    }

  },
  components: {
    // UploadList
  }
}
</script>
<style>
.first {
  /* margin-top: 20px; */
}
.last {
  margin-top: 30px;
  margin-bottom: 30px;
}
.dialog {
  margin-left: 250px;
  /* position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin: 0; */
  width: 70%;
}
</style>