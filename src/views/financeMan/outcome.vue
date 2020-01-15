<template>
  <div class="app-container">
    <div style="margin-bottom:15px;">
      <el-button type="primary"
                 @click="goNew">新建</el-button>
      <span style="margin-left:40px;">支出时间</span>
      <el-date-picker style="margin-left:20px;width: 150px;"
                      v-model="listQuery.pay_start_datetime"
                      type="date"
                      placeholder="开始日期时间"
                      value-format="yyyy-MM-dd"></el-date-picker>
      至
      <el-date-picker style="width: 150px;"
                      v-model="listQuery.pay_end_datetime"
                      type="date"
                      placeholder="结束日期时间"
                      value-format="yyyy-MM-dd">
      </el-date-picker>
      <span style="margin-left:40px;">录入时间</span>
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
      <div style="margin-top:20px;margin-left:100px;">
        <el-select v-model="listQuery.type_id"
                   placeholder="类型"
                   style="width:120px;margin-right:20px"
                   clearable>
          <el-option v-for="item in typeList"
                     :label="item.title"
                     :value="item.id"
                     :key="item.id">
          </el-option>
        </el-select>

        <el-input placeholder="收入说明"
                  v-model="listQuery.keyword"
                  style="width: 150px;margin-right:20px"
                  clearable>
        </el-input>
        <el-input placeholder="编号"
                  v-model="listQuery.no"
                  style="width: 150px;margin-right:20px"
                  clearable>
        </el-input>
        <el-button type="primary"
                   plain
                   icon="el-icon-search"
                   @click="handleFilter(value)">搜索</el-button>

      </div>
    </div>
    <div style="margin-bottom:15px">
      <span>总支出:{{pay_sum}}</span>
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
      <el-table-column label="编号"
                       align="center"
                       width="110">
        <template slot-scope="scope">
          {{ scope.row.no }}
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
                       width="160">
        <template slot-scope="scope">
          {{ scope.row.pay_datetime }}
        </template>
      </el-table-column>
      <el-table-column align="center"
                       label="支出类型"
                       width="150">
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
                       label="经手人"
                       width="90">
        <template slot-scope="scope">
          {{ scope.row.create_user || scope.row.applicant }}
        </template>
      </el-table-column>
      <el-table-column align="center"
                       label="备注"
                       width="85">
        <template slot-scope="scope">
          {{ scope.row.content }}
        </template>
      </el-table-column>
      <el-table-column align="center"
                       label="是否已上传支出凭证"
                       width="165">
        <template slot-scope="scope">
          <div v-if="scope.row.pay_proof.length>0">
            已上传
          </div>
          <div v-else
               style="color:red">
            未上传
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center"
                       label="是否已上传报销凭证"
                       width="165">
        <template slot-scope="scope">
          <div v-if="scope.row.expense_proof.length > 0&&scope.row.is_expense == 1">
            已上传
          </div>
          <div v-if="scope.row.expense_proof.length==0&&scope.row.is_expense == 1"
               style="color:red">
            未上传
          </div>
          <div v-if="scope.row.is_expense != 1"
               style="color:#000">
            -----
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center"
                       label="录入时间"
                       width="165">
        <template slot-scope="scope">
          {{ scope.row.created_at }}
        </template>
      </el-table-column>
      <el-table-column align="center"
                       label="操作人"
                       width="105">
        <template slot-scope="scope">
          <div v-if="scope.row.handler!=null">{{ scope.row.handler.nickname }}</div>
          <div v-else></div>

        </template>
      </el-table-column>
      <el-table-column align="center"
                       label="最新修改人"
                       width="125">
        <template slot-scope="scope">
          <div v-if="scope.row.editor!=null">{{ scope.row.editor.nickname }}</div>
          <div v-else></div>
        </template>
      </el-table-column>
      <el-table-column align="center"
                       label="最新修改时间"
                       width="165">
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
            <el-button size="mini"
                       type="warning"
                       @click="goProof(scope.row)">支出凭证</el-button>
            <el-button size="mini"
                       v-if="scope.row.is_expense == 1"
                       type="warning"
                       @click="goBxProof(scope.row)">报销凭证</el-button>
            <el-button size="mini"
                       @click="handleEdit(scope.row)"
                       type="primary"
                       style="margin-top:10px">修改</el-button>
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
      form: {
        id: '',
        desc: '',
        income_datatime: '',
        price: '',
        type_id: '',
        content: '',
        proof: '',
      },
      listQuery: {
        page: 1,
        limit: 10,
        keyword: '',
        end_datetime: '',
        start_datetime: '',
        pay_end_datetime: '',
        pay_start_datetime: '',
        no: '',
        type_id: '',
      },
      pay_sum: null,
      btnLoading: false,
      listLoading: true,
      list: null,
      typeList: null,
      value: '',
      total: null,
      type: [],
    }
  },
  created () {
    this.getList()
    this.getTypeList()
  },
  methods: {
    goNew () {
      this.$router.push({ path: '/financeMan/newOut' })
    },
    goProof (row) {
      this.$router.push({ path: '/financeMan/proofOut', query: { id: row.id } })
    },
    goBxProof (row) {
      this.$router.push({ path: '/financeMan/bxproof', query: { id: row.id } })

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

      // if (value == '选项1') {
      //   this.listQuery.sale_status = '1'
      // }
      // else if (value == '选项2') {
      //   this.listQuery.sale_status = '2'
      // }
      // console.log(this.listQuery.sale_status)
      this.listQuery.page = 1;
      this.getList();
      // this.listQuery.sale_status = ''
    },
    handleEdit (row) {
      this.$router.push({
        path: '/financeMan/newOut',
        query: { id: row.id }

      })
    },
    getList () {
      this.listQuery.start_datetime = this.listQuery.start_datetime ? this.listQuery.start_datetime + " 00:00:00" : ""
      this.listQuery.end_datetime = this.listQuery.end_datetime ? this.listQuery.end_datetime + " 23:59:59" : ""
      this.listQuery.pay_start_datetime = this.listQuery.pay_start_datetime ? this.listQuery.pay_start_datetime + " 00:00:00" : ""
      this.listQuery.pay_end_datetime = this.listQuery.pay_end_datetime ? this.listQuery.pay_end_datetime + " 23:59:59" : ""
      this.listLoading = true;
      request({
        url: "/api/backend/pay/index",
        method: "get",
        params: this.listQuery
      }).then(response => {
        this.list = response.data.data;
        this.pay_sum = response.data.pay_sum
        this.total = response.data.total;
        this.listLoading = false;
        this.value = ""
        // console.log(this.value);
        // console.log(this.list);

        // console.log(this.list);
        // this.listQuery.sale_status = ''
      });

    },
    getTypeList () {
      this.listLoading = true;
      request({
        url: "/api/backend/payType/index",
        method: "get",
      }).then(response => {
        console.log(response);
        this.typeList = response.data.data;
        this.listLoading = false;
        for (let i = 0; i < this.typeList.length; i++) {
          if (this.typeList[i].status == 2) {
            this.typeList.splice(i, 1)
          }
        }
      });

    },




  },
  components: {
    // UploadList
  }
}
</script>
