<template>
  <div class="app-container">
    <div style="margin-bottom:15px;">
      <span style="margin-left:40px;">时间段</span>
      <el-date-picker style="margin-left:20px;"
                      type="date"
                      placeholder="开始日期时间"
                      value-format="yyyy-MM-dd"></el-date-picker>
      至
      <el-date-picker type="date"
                      placeholder="结束日期时间"
                      value-format="yyyy-MM-dd">
      </el-date-picker>
      <el-button type="primary"
                 plain
                 style="float:right;"
                 icon="el-icon-search">搜索</el-button>
      <el-select placeholder="操作人"
                 style="float:right;width:120px;margin-right:20px">
        <el-option></el-option>
      </el-select>

      <el-input placeholder="请输入编号"
                style="width: 140px;float:right;margin-right:20px"
                clearable>
      </el-input>

    </div>
    <div class="box">
      <div class="content_top">
        <span>123123132132</span>
      </div>
      <div class="content_mid">
        <span>支出编号:123</span>
      </div>
      <div class="content_bottom">

        <div class="bottom_top">
          <span>操作内容</span>
        </div>
        <div class="bottom">
          <div class="income_desc">
            <span>支出说明:123</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <span>变更后:1234</span>
          </div>
          <div class="income_amount">
            <span>支出金额:123</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <span>变更后:1234</span>
          </div>
        </div>

      </div>

    </div>
  </div>
</template>
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
.income_amount {
  margin-top: 30px;
  margin-left: 40px;
  margin-bottom: 30px;
}
</style>