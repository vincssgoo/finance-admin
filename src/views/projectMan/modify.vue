<template>
  <div class="app-container">

    <el-form ref="form"
             :model="form"
             label-width="120px">
      <el-form-item label="项目名称">
        <el-input placeholder="请输入项目名称"
                  style="width:30%"
                  v-model="form.name"
                  clearable />
      </el-form-item>
      <el-form-item label="签约公司">
        <el-input placeholder="请输入签约公司"
                  style="width:30%"
                  v-model="form.company"
                  clearable />
      </el-form-item>
      <el-form-item label="项目编号">
        <el-input placeholder="请输入项目编号"
                  v-model="form.project_no"
                  style="width:30%"
                  clearable />
      </el-form-item>
      <el-form-item label="项目类型">
        <el-select placeholder="请选择项目类型"
                   v-model="form.type_id">
          <!-- <el-option v-for="item in list_type"
                     :label="item.name"
                     :value="item.id">
          </el-option> -->
          <el-option v-for="item in typeList"
                     :label="item.title"
                     :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="项目总额">
        <el-input placeholder="请输入项目总额"
                  style="width:30%"
                  v-model="form.total_price"
                  clearable />
      </el-form-item>
      <el-form-item label="签约时间">
        <el-date-picker v-model="form.sign_datetime"
                        type="datetime"
                        placeholder="选择日期时间">

        </el-date-picker>
      </el-form-item>
      <el-form-item label="签约时长(工作日)">
        <el-input placeholder="请输入签约时长"
                  style="width:30%"
                  v-model="form.sign_days"
                  clearable />
      </el-form-item>
    </el-form>
    <div style="text-align:center">
      <el-button style="margin-right:15px"
                 @click="backIndex">返 回</el-button>
      <el-button type="primary"
                 @click="saveData"
                 :loading="btnLoading">提 交</el-button>
    </div>
  </div>
</template>
<script>
import request from "@/utils/request";
// import UploadList from '@/components/UploadList'
var moment = require("moment");
export default {
  data () {
    return {
      value: '',
      // listQuery: {
      //   // page: 0,
      //   // limit: 1000000,
      //   keyword: '',
      //   sale_statue: '',
      //   type_id: '',
      // },
      form: {
        id: '',
        name: '',
        company: '',
        project_no: '',
        type_id: '',
        total_price: '',
        sign_datetiem: '',
        sign_days: '',
      },
      btnLoading: false,
      listLoading: true,
      typeList: null
    }
  },
  created () {
    if (this.$route.query.id) {
      this.getDetail()
    }
    this.getTypeList()
  },
  methods: {
    getTypeList () {
      this.listLoading = true;
      request({
        url: "/api/backend/projectType/index",
        method: "get",
        params: { status: 1 }
      }).then(response => {
        this.typeList = response.data.data;
        this.listLoading = false;
        console.log(this.typeList);

        for (let i = 0; i < this.typeList.length; i++) {
          if (this.typeList[i].status == 2) {
            this.typeList.splice(i, 1)
          }
        }
      });

    },
    getDetail () {
      this.listLoading = true;
      request({
        url: "/api/backend/project/detail",
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
    saveData () {
      this.btnLoading = true;
      this.form.sign_datetime = moment(this.form.sign_datetime).format('YYYY-M-DD h:mm:ss')
      request({
        url: "/api/backend/project/store",
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

    backIndex () {
      // this.$router.replace({ path: '/projectMan/list' })
      this.$router.back(-1)
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
