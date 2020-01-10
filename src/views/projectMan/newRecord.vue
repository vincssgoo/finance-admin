<template>
  <div class="app-container">

    <el-form ref="form"
             :model="form"
             label-width="120px">
      <el-form-item label="已回款比例">
        <span>{{data}}%</span>
      </el-form-item>
      <el-form-item label="金额">
        <el-input placeholder="请输入金额"
                  style="width:30%"
                  clearable
                  v-model="form.price" />
      </el-form-item>

      <el-form-item label="比例(%)">
        <el-input placeholder="请输入比例"
                  style="width:30%"
                  clearable
                  v-model="form.percent" />
      </el-form-item>

      <el-form-item label="回款时间">
        <el-date-picker v-model="form.returned_datetime"
                        type="datetime"
                        placeholder="选择日期时间">
        </el-date-picker>
      </el-form-item>
    </el-form>
    <div style="text-align:center">
      <el-button style="margin-right:15px"
                 @click="backIndex">返 回</el-button>
      <el-button type="primary"
                 :loading="btnLoading"
                 @click="saveData">提 交</el-button>
    </div>
  </div>
</template>
<script>
import request from "@/utils/request";
var moment = require("moment");
export default {
  data () {
    return {
      form: {
        id: '',
        price: '',
        percent: '',
        returned_datetime: '',
        project_id: '',
      },
      btnLoading: false,
      listLoading: true,
      proj_id: '',
      data: null,
    }
  },
  created () {
    this.form.project_id = this.$route.query.project_id
    if (this.$route.query.id) {
      this.getDetail()
    }
    this.getPercent()
  },
  methods: {
    getDetail () {
      this.listLoading = true;
      request({
        url: "/api/backend/returnedMoney/detail",
        method: "get",
        params: { id: this.$route.query.id }
      }).then(response => {
        // this.list = response.data.data;
        this.form = response.data
        console.log(this.form);



      }).catch(err => {
        console.log(err);

      });
    },
    backIndex () {
      this.$router.replace({        path: '/projectMan/record', query: {
          project_id: this.form.project_id
        }      })
    },
    getPercent () {
      this.listLoading = true;
      request({
        url: "/api/backend/returnedMoney/haveReturnedPercent",
        method: "get",
        params: this.form.project_id
      }).then(response => {
        this.data = response.data;
        this.listLoading = false;
        console.log(this.data);

      });
    },
    saveData () {
      this.btnLoading = true;
      // this.form.project_id = this.project_id
      this.form.returned_datetime = moment(this.form.returned_datetime).format('YYYY-M-DD h:mm:ss')
      request({
        url: "/api/backend/returnedMoney/store",
        method: "post",
        data: this.form
      })
        .then(() => {
          // this.getTypeList();
          this.$message({
            type: "success",
            message: "操作成功!"
          });
          this.backIndex()
        })
        .finally(() => {
          this.btnLoading = false;
        });
    },



  },
  components: {
    // UploadList
  }
}
</script>

<style scoped>
.line {
  text-align: center;
}
</style>