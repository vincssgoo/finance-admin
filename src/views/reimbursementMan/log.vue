<template>
  <div class="app-container">
    <div style="margin-bottom:15px;">
      <span style="margin-left:40px;">时间段</span>
      <el-date-picker
        style="margin-left:20px;"
        type="date"
        placeholder="开始日期时间"
        value-format="yyyy-MM-dd"
      ></el-date-picker>至
      <el-date-picker type="date" placeholder="结束日期时间" value-format="yyyy-MM-dd"></el-date-picker>
      <el-button type="primary" plain style="float:right;" icon="el-icon-search">搜索</el-button>
      <el-select placeholder="操作人" style="float:right;width:120px;margin-right:20px">
        <el-option></el-option>
      </el-select>
      <el-input placeholder="请输入编号" style="width: 140px;float:right;margin-right:20px" clearable></el-input>
    </div>
    <div v-for="(item,index) in list" :key="index">
      <div class="box">
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
        <div class="bottom">
          <div class="income_handle">
            <span>收入说明:123</span>
            <span style="margin:15px 0;">变更后:1234</span>
            <span>申请人:"某某"</span>
          </div>
        </div>
      </div>
    </div>
    <div class="box">
      <div class="content_top">
        <span>123123132132</span>
      </div>
      <div class="content_mid">
        <span>收入编号:123</span>
      </div>
      <div class="content_bottom">
        <div class="bottom_top">
          <span>操作内容</span>
        </div>
        <div class="bottom">
          <div class="income_desc">
            <span style="margin-right:150px;">收入说明:123</span>
            <span>变更后:1234</span>
          </div>
          <div class="income_amount">
            <span style="margin-right:150px;">收入金额:123</span>
            <span>变更后:1234</span>
          </div>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>
<script>
import request from "@/utils/request";

export default {
  data () {
    return {
      listLoading: true,
      listQuery:{
        page:1,
        limit:10,
        group:3,
      },
      list:[],
    }
  },
  created () {
    this.getList();
  },
  methods: {
    getList () {
      this.listLoading = true;
      request({
        url: "/api/backend/log/index",
        method: "get",
        params:this.listQuery,
      }).then(response => {
        this.list = response.data.data;
        this.listLoading = false;
      });

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
  flex-direction: column;
  margin-bottom: 30px;
}
.income_amount {
  margin-top: 30px;
  margin-left: 40px;
  margin-bottom: 30px;
}
</style>
