<template>
  <div class="app-container">
    <div style="margin-bottom:15px;">
      <span style="margin-left:40px;">时间段</span>
      <el-date-picker
        v-model="listQuery.start_datetime"
        style="margin-left:20px;"
        type="date"
        placeholder="开始日期时间"
        value-format="yyyy-MM-dd"
      ></el-date-picker>至
      <el-date-picker v-model="listQuery.end_datetime" type="date" placeholder="结束日期时间" value-format="yyyy-MM-dd"></el-date-picker>
      <el-input v-model="listQuery.no" style="width:250px" placeholder="请输入编号" clearable></el-input>
      <el-button
        type="success"
        icon="el-icon-search"
        @click="seacher"
        style="margin-left:30px"
      >搜索</el-button>
    </div>
    <div>
      <div class="box" v-for="(item,index) in list" :key="index">
        <div class="content_top">
          <span>{{item.created_at}}</span>
          <span style="margin:0 30px;">{{item.admin.nickname}}</span>
          <span v-if="item.type == 1">新增</span>
          <span v-if="item.type == 2">修改</span>
          <span v-if="item.type == 3">处理</span>
        </div>
        <div class="content_mid">
          <span v-if="item.group == 1">收入编号:{{item.no}}</span>
          <span v-if="item.group == 2">支出编号:{{item.no}}</span>
          <span v-if="item.group == 3">报销编号:{{item.no}}</span>
        </div>
        <div class="content_bottom">
          <div class="bottom_top">
            <span>操作内容</span>
          </div>
          <div class="bottom" v-if="item.type != 1">
            <div class="income_handle" v-if="item.data_before.desc">
              <span>{{item.group == 1 ? '收入' : item.group == 2 ? '支出' : '报销'}}说明：</span>
              <span class="span_width" style="margin-left:20px;">{{item.data_before.desc}}</span>
              <span style="margin-left:30px;color:red;" v-if="item.data_after.desc">变更后：</span>
              <span class="span_width" style="margin-left:20px;color:red;" v-if="item.data_after.desc">{{item.data_after.desc}}</span>
            </div>
            <div class="income_handle" v-if="item.data_before.price">
              <span>{{item.group == 1 ? '收入' : item.group == 2 ? '支出' : '报销'}}金额：</span>
              <span class="span_width" style="margin-left:20px;">{{item.data_before.price}}</span>
              <span style="margin-left:30px;color:red;" v-if="item.data_after.price">变更后：</span>
              <span class="span_width" style="margin-left:20px;color:red;" v-if="item.data_after.price">{{item.data_after.price}}</span>
            </div>
            <div class="income_handle" v-if="item.data_before.pay_datetime || item.data_before.income_datetime">
              <span>{{item.group == 1 ? '收入' : item.group == 2 ? '支出' : '报销'}}时间：</span>
              <span class="span_width" style="margin-left:20px;">{{item.data_before.pay_datetime || item.data_before.income_datetime}}</span>
              <span style="margin-left:30px;color:red;" v-if="item.data_before.pay_datetime || item.data_before.income_datetime">变更后：</span>
              <span class="span_width" style="margin-left:20px;color:red;" v-if="item.data_before.pay_datetime || item.data_before.income_datetime">{{item.data_before.pay_datetime || item.data_before.income_datetime}}</span>
            </div>
            <div class="income_handle" v-if="item.data_before.type">
              <span>{{item.group == 1 ? '收入' : item.group == 2 ? '支出' : '报销'}}类型：</span>
              <span class="span_width" style="margin-left:20px;">{{item.data_before.type.title}}</span>
              <span style="margin-left:30px;color:red;" v-if="item.data_after.type">变更后：</span>
              <span class="span_width" style="margin-left:20px;color:red;" v-if="item.data_after.type">{{item.data_after.type.title}}</span>
            </div>
            <div class="income_handle" v-if="item.data_before.create_user">
              <span>{{item.group == 1 ? '收入' : item.group == 2 ? '支出' : '报销'}}经手人：</span>
              <span class="span_width" style="margin-left:20px;">{{item.data_before.create_user}}</span>
              <span style="margin-left:30px;color:red;" v-if="item.data_after.create_user">变更后：</span>
              <span class="span_width" style="margin-left:20px;color:red;" v-if="item.data_after.create_user">{{item.data_after.create_user}}</span>
            </div>
            <div class="income_handle" v-if="item.data_before.content">
              <span>{{item.group == 1 ? '收入' : item.group == 2 ? '支出' : '报销'}}备注：</span>
              <span class="span_width" style="margin-left:20px;">{{item.data_before.content}}</span>
              <span style="margin-left:30px;color:red;" v-if="item.data_after.content">变更后：</span>
              <span class="span_width" style="margin-left:20px;color:red;" v-if="item.data_after.content">{{item.data_after.content}}</span>
            </div>
            <div class="income_handle" v-if="item.data_before.proof || item.data_before.pay_proof || item.data_before.expense_proof">
              <span style="color:red;margin-right:50px;" v-if="item.data_after.proof">修改收入凭证</span>
              <span style="color:red;margin-right:50px;" v-if="item.data_after.pay_proof">修改支出凭证</span>
              <span style="color:red;" v-if="item.data_after.expense_proof">修改报销凭证</span>
            </div>
          </div>
          <div class="bottom" v-else>
            <div class="income_handle" v-if="item.data_after.desc">
              <span>{{item.group == 1 ? '收入' : item.group == 2 ? '支出' : '报销'}}说明：</span>
              <span style="margin-left:50px;">{{item.data_after.desc}}</span>
            </div>
            <div class="income_handle" v-if="item.data_after.price">
              <span>{{item.group == 1 ? '收入' : item.group == 2 ? '支出' : '报销'}}金额：</span>
              <span style="margin-left:50px;">{{item.data_after.price}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="block" style="margin-top:25px">
      <!-- <span class="demonstration">完整功能</span> -->
      <!-- <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="listQuery.page"
                     :page-sizes="[5, 10, 20, 50,100]"
                     :page-size="listQuery.limit"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total">
      </el-pagination>-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="listQuery.page"
        :page-sizes="[5, 10, 20, 50,100]"
        :page-size="listQuery.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
import request from "@/utils/request";

export default {
  data () {
    return {
      listLoading: true,
      total:null,
      loadings:false,
      listQuery:{
        page:1,
        limit:5,
        group:'',
        start_datetime:'',
        end_datetime:'',
        no:'',
      },
      list:[],
    }
  },
  mounted() {
    let name = this.$route.name
    if(name === 'incomeLog'){
      this.listQuery.group = 1
    }else if(name === 'LogOut'){
      this.listQuery.group = 2
    }else if(name === 'Log'){
      this.listQuery.group = 3
    }
    this.getList()
  },
  watch: {
    '$route' (to, from) { //监听路由是否变化
      let name = this.$route.name
      if(name === 'incomeLog'){
        this.listQuery.group = 1
      }else if(name === 'LogOut'){
        this.listQuery.group = 2
      }else if(name === 'Log'){
        this.listQuery.group = 3
      }
      this.getList()
    }
  },
  methods: {
    getList () {
      this.listQuery.start_datetime = this.listQuery.start_datetime ? this.listQuery.start_datetime + ' 00:00:00':'',
      this.listQuery.end_datetime = this.listQuery.end_datetime ? this.listQuery.end_datetime + ' 23:59:59':'',
      this.listLoading = true;
      request({
        url: "/api/backend/log/index",
        method: "get",
        params:this.listQuery,
      }).then(response => {
        this.total = response.data.total
        this.list = response.data.data;
        this.listLoading = false;
      });
    },
    seacher() {
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.getList();
    },
  },
}
</script>
<style>
.box {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  width: 900px;
}
.content_top {
  padding-top: 30px;
  margin-top: 30px;
  margin-left: 20px;
}
.content_mid {
  margin-top: 30px;
  margin-left: 20px;
}
.content_bottom {
  display: flex;
  flex-direction: column;
}
.bottom_top {
  margin-top: 30px;
  margin-left: 20px;
}
.income_desc {
  margin-top: 30px;
  margin-left: 40px;
}
.income_handle {
  margin-top: 30px;
  margin-left: 40px;
  display: flex;
  margin-bottom: 30px;
}
.income_amount {
  margin-top: 30px;
  margin-left: 40px;
  margin-bottom: 30px;
}
.span_width {
  width: 250px;
  word-break: break-all;
}
</style>
