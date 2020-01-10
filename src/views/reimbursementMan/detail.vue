<template>
  <div class="app-container">
    <el-form ref="form"
             :model="form"
             label-width="120px">
      <el-form-item label="支出说明">
        <el-input v-model="form.desc"
                  type="textarea"
                  :rows="3"
                  placeholder="请输入内容"
                  style="width:30%"
                  disabled>
        </el-input>
      </el-form-item>
      <el-form-item label="支出时间">
        <el-date-picker v-model="form.pay_datetime"
                        type="datetime"
                        placeholder="选择日期时间"
                        disabled>

        </el-date-picker>
      </el-form-item>
      <el-form-item label="支出金额">
        <el-input v-model="form.price"
                  placeholder="请输入金额"
                  style="width:30%"
                  clearable
                  disabled />
      </el-form-item>
      <el-form-item label="支出类型">
        <el-select placeholder="请选择类型"
                   v-model="form.type_id"
                   disabled>
          <el-option v-for="item in typeList"
                     :label="item.title"
                     :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="申请人">
        <el-input v-model="form.applicant"
                  placeholder="请输入申请人"
                  style="width:30%"
                  clearable
                  disabled />
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="form.content"
                  type="textarea"
                  :rows="3"
                  placeholder="请输入内容"
                  style="width:30%"
                  disabled>
        </el-input>
      </el-form-item>
      <el-form-item label="支出凭证">
        <UploadList :list="proofList"
                    :able="true">
        </UploadList>
      </el-form-item>
      <el-form-item label="报销凭证">
        <UploadList :list="bxList"
                    :able="true">
        </UploadList>
      </el-form-item>

    </el-form>
    <div style="text-align:center">
      <el-button style="margin-right:15px"
                 @click="backIndex">返 回</el-button>
    </div>
  </div>
</template>
<script>
import request from "@/utils/request";
import UploadList from '@/components/UploadList'
var moment = require("moment");
export default {
  data () {
    return {
      value: '',
      list_location: null,
      list_type: null,
      listQuery: {
        id: '',
      },
      bxList: null,
      proofList: null,
      form: {
        id: '',
        price: '',
        type_id: '',
        desc: '',
        expense_proof: [],
        pay_proof: [],
        pay_datetime: '',
        content: '',
        applicant: '',
      },
      btnLoading: false,
      listLoading: true,
      list: null,
      typeList: null,
    }
  },
  created () {
    // console.log(this.$route.query.item);
    // if (this.$route.query.item) {
    //   this.getItemInfo(this.$route.query.item)
    // }
    // if (this.$route.query.id) {
    //   this.getDetail()
    // }
    // this.getLocationList();
    // this.getTypeList();
    if (this.$route.query.id) {
      this.form.id = this.$route.query.id
      this.getList()
      this.getTypeList()
    }
    if (this.bxList == null || this.proofList == null) {
      this.bxList = []
      this.proofList = []
    }



    // console.log(this.proofList);

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
    getList () {
      this.listLoading = true;
      request({
        url: "/api/backend/expense/detail",
        method: "get",
        params: { id: this.$route.query.id }
      }).then(response => {
        this.form = response.data;
        this.listLoading = false;
        if (this.form.pay_proof.length > 0) {
          this.proofList = this.form.pay_proof
        }
        if (this.form.expense_proof.length > 0) {
          this.bxList = this.form.expense_proof
        }
        console.log(this.form);
        console.log(this.form.pay_proof);

      });
    },
    saveData () {
      this.btnLoading = true;
      if (this.proofList) {
        this.form.pay_proof = this.proofList
      }
      if (this.bxList) {
        this.form.expense_proof = this.bxList
      }
      this.form.pay_datetime = moment(this.form.pay_datetime).format('YYYY-M-DD h:mm:ss')
      request({
        url: "/api/backend/expense/handle",
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
      this.$router.replace({ path: '/reimbursementMan/list' })
    },




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