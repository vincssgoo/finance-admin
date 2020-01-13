<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="收入说明">
        <el-input
          type="textarea"
          :rows="3"
          placeholder="请输入内容"
          style="width:30%"
          v-model="form.desc"
        ></el-input>
      </el-form-item>
      <el-form-item label="收入时间">
        <el-date-picker type="datetime" placeholder="选择日期时间"  v-model="form.income_datetime"></el-date-picker>
      </el-form-item>
      <el-form-item label="收入金额">
        <el-input placeholder="请输入金额" style="width:30%" v-model="form.price" clearable/>
      </el-form-item>
      <el-form-item label="收入类型">
        <el-select placeholder="请选择类型" v-model="form.type_id">
          <!-- <el-option v-for="item in list_type"
                     :label="item.name"
                     :value="item.id">
          </el-option>-->
          <el-option v-for="item in typeList" :label="item.title" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="备注">
        <el-input
          type="textarea"
          :rows="3"
          placeholder="请输入内容"
          style="width:30%"
          v-model="form.content"
        ></el-input>
      </el-form-item>
      <el-form-item label="凭证">
        <UploadList v-model="form.proof"></UploadList>
      </el-form-item>
    </el-form>
    <div style="text-align:center">
      <el-button style="margin-right:15px" @click="backIndex">返 回</el-button>
      <el-button type="primary" :loading="btnLoading" @click="saveData">提 交</el-button>
    </div>
  </div>
</template>
<script>
import request from "@/utils/request";
import UploadList from "@/components/UploadList";
var moment = require("moment");
export default {
  data() {
    return {
      value: "",
      list_location: null,
      list_type: null,
      // listQuery: {
      //   // page: 0,
      //   // limit: 1000000,
      //   keyword: '',
      //   sale_statue: '',
      //   type_id: '',
      // },
      form: {
        id: "",
        desc: "",
        income_datetime: "",
        price: "",
        type_id: "",
        content: "",
        proof: []
      },
      btnLoading: false,
      listLoading: true,
      mapQuery: {
        key: '"e189ae2e6e040e0861df1281cb162f6b"',
        Keyword: ""
      },
      typeList: null,
      list: null
    };
  },
  created() {
    if (this.$route.query.id) {
      this.getDetail();
    }
    this.getTypeList();
  },
  methods: {
    getTypeList() {
      this.listLoading = true;
      request({
        url: "/api/backend/incomeType/index",
        method: "get"
      }).then(response => {
        this.typeList = response.data.data;
        this.listLoading = false;
        console.log(this.typeList);
        for (let i = 0; i < this.typeList.length; i++) {
          if (this.typeList[i].status == 2) {
            this.typeList.splice(i, 1);
          }
        }
        // console.log(this.list);
        // this.listQuery.sale_status = ''
      });
    },
    getDetail() {
      // console.log(123);

      this.listLoading = true;
      request({
        url: "/api/backend/income/detail",
        method: "get",
        params: { id: this.$route.query.id }
      })
        .then(response => {
          // this.list = response.data.data;
          // this.form = response.data

          this.form = response.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    backIndex() {
      this.$router.push({ path: "/financeMan/income" });
    },
    saveData() {
      if (this.form.income_datetime) {
        this.form.income_datetime = moment(this.form.income_datetime).format("YYYY-MM-DD HH:mm:ss");
      }
      if(!this.form.income_datetime || !this.form.desc || !this.form.price || !this.form.type_id) {
        this.$message({
          type: "error",
          message: "请填写完整!"
        });
        return
      }
      this.form.expense_proof = []
      this.btnLoading = true;
      request({
        url: "/api/backend/income/store",
        method: "post",
        data: this.form
      })
        .then(() => {
          // this.getTypeList();
          this.$message({
            type: "success",
            message: "操作成功!"
          });
          this.backIndex();
        })
        .finally(() => {
          this.btnLoading = false;
        });
    }
  },
  components: {
    UploadList
  }
};
</script>

<style scoped>
.line {
  text-align: center;
}
</style>
