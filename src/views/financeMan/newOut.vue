<template>
  <div class="app-container">

    <el-form ref="form"
             :model="form"
             label-width="120px">
      <el-form-item label="支出说明">
        <el-input type="textarea"
                  :rows="3"
                  placeholder="请输入内容"
                  style="width:30%"
                  v-model="form.desc">
        </el-input>
      </el-form-item>
      <el-form-item label="支出时间">
        <el-date-picker type="datetime"
                        placeholder="选择日期时间"
                        v-model="form.pay_datetime">

        </el-date-picker>
      </el-form-item>
      <el-form-item label="支出金额">
        <el-input placeholder="请输入金额"
                  style="width:30%"
                  v-model="form.price"
                  clearable />
      </el-form-item>
      <el-form-item label="支出类型">
        <el-select placeholder="请选择类型"
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
      <el-form-item label="经手人">
        <el-input placeholder="请输入经手人"
                  style="width:30%"
                  v-model="form.create_user"
                  clearable />
      </el-form-item>
      <el-form-item label="备注">
        <el-input type="textarea"
                  :rows="3"
                  placeholder="请输入内容"
                  style="width:30%"
                  v-model="form.content">
        </el-input>
      </el-form-item>
      <el-form-item label="凭证">

        <UploadList :list="proofList"></UploadList>
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
// import UploadList from '@/components/UploadList'
import UploadList from '@/components/UploadList'
var moment = require("moment");
export default {
  data () {
    return {
      value: '',
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
        id: '',
        desc: '',
        pay_datetime: '',
        price: '',
        type_id: '',
        content: '',
        create_user: '',
        pay_proof: [],
        expense_proof: [],
      },
      btnLoading: false,
      listLoading: true,
      typeList: null,
      proofList: null,
    }
  },
  created () {
    if (this.$route.query.id) {
      this.getDetail()
    }
    this.getTypeList();
    if (this.proofList == null) {
      this.proofList = []
    }
    // this.getSchoolList();
  },
  methods: {
    getTypeList () {
      this.listLoading = true;
      request({
        url: "/api/backend/payType/index",
        method: "get",
      }).then(response => {
        this.length = response.data.length
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
      // console.log(123);

      this.listLoading = true;
      request({
        url: "/api/backend/pay/detail",
        method: "get",
        params: { id: this.$route.query.id }
      }).then(response => {
        // this.list = response.data.data;
        this.list = response.data
        console.log(this.list);
        this.form = {
          id: this.list.id,
          desc: this.list.desc,
          pay_datetime: this.list.pay_datetime,
          price: this.list.price,
          type_id: this.list.type_id,
          content: this.list.content,
          create_user: this.list.create_user,
          pay_proof: this.list.pay_proof,
          expense_proof: this.list.expense_proof,
        }



      }).catch(err => {
        console.log(err);

      });
    },
    backIndex () {
      this.$router.replace({ path: '/financeMan/outcome' })
    },
    saveData () {
      this.btnLoading = true;
      console.log(this.form);
      if (this.proofList) {
        this.form.pay_proof = this.proofList
      }
      if (this.form.pay_datetime == null || this.form.pay_datetime != this.list.pay_datetime) {
        this.form.pay_datetime = moment(this.form.pay_datetime).format('YYYY-M-DD h:mm:ss')
        console.log(123);

      }

      request({
        url: "/api/backend/pay/store",
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
    }




  },
  components: {
    UploadList
  }
}
</script>

<style scoped>
.line {
  text-align: center;
}
</style>