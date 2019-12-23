<template>
  <div class="app-container">
    <div class="block"
         style="margin-bottom:15px;">
      <span style="margin-left:40px;">时间段</span>
      <el-date-picker style="margin-left:20px;"
                      v-model="listQuery.start_datetime"
                      type="date"
                      placeholder="开始日期时间"
                      value-format="yyyy-MM-dd"></el-date-picker>
      至
      <el-date-picker v-model="listQuery.end_datetime"
                      type="date"
                      placeholder="结束日期时间"
                      value-format="yyyy-MM-dd">
      </el-date-picker>
      <el-input placeholder="请输入用户名/电话"
                v-model="listQuery.keyword"
                style="width: 320px;"
                clearable>
      </el-input>
      <el-select v-model="value"
                 placeholder="是否选择"
                 style="width:120px;margin-right:20px">
        <el-option v-for="item in options"
                   :key="item.value"
                   :label="item.label"
                   :value="item.value">
        </el-option>
      </el-select>
      <el-button type="primary"
                 plain
                 style="float:right;"
                 icon="el-icon-search"
                 @click="handleFilter">搜索</el-button>
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
          {{ scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column align="center"
                       label="分点名称">
        <template slot-scope="scope">
          {{ scope.row.avatar }}
        </template>
      </el-table-column>
      <el-table-column label="结算时间段"
                       width="110"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.nickname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="金额"
                       width="110"
                       align="center">
        <template slot-scope="scope">
          {{ scope.row.tel }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col"
                       label="状态"
                       width="110"
                       align="center">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center"
                       label="操作"
                       width="200">
        <template slot-scope="scope">
          <el-button size="mini"
                     type="danger"
                     @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="block"
         style="margin-top:25px">
      <!-- <span class="demonstration">完整功能</span> -->
      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="listQuery.page"
                     :page-sizes="[5,10,20,30, 50]"
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
      options: [
        {
          value: '选项1',
          label: '未选择',
        },
        {
          value: '选项2',
          label: '已选择',
        },
      ],
      value: '未选择',
      list: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        keyword: '',
        end_datetime: '',
        start_datetime: '',
      },
    }
  },
  created () {
    // this.getList()
  },
  methods: {
    handleFilter () {
      this.listQuery.page = 1;
      this.getList();
    },
    handleSizeChange (val) {
      this.listQuery.limit = val;
      this.getList();
    },
    handleCurrentChange (val) {
      this.listQuery.page = val;
      this.getList();
    }, getList () {
      this.listLoading = true;
      request({
        url: "/api/backend/finance/orderFlow",
        method: "get",
        params: this.listQuery
      }).then(response => {
        this.list = response.data.data;
        this.total = response.data.total;
        this.amount = response.data.order_amount;
        this.listLoading = false;
      });

    },
  }
}
</script>
