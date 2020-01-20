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
                  style="width:30%">
        </el-input>
      </el-form-item>
      <el-form-item label="支出时间">
        <el-date-picker v-model="form.pay_datetime"
                        type="datetime"
                        placeholder="选择日期时间">

        </el-date-picker>
      </el-form-item>
      <el-form-item label="支出金额">
        <el-input v-model="form.price"
                  placeholder="请输入金额"
                  style="width:30%"
                  clearable />
      </el-form-item>
      <el-form-item label="支出类型">
        <el-select placeholder="请选择类型"
                   v-model="form.type_id">
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
                  clearable />
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="form.content"
                  type="textarea"
                  :rows="3"
                  placeholder="请输入内容"
                  style="width:30%">
        </el-input>
      </el-form-item>
      <el-form-item label="支出凭证">
        <UploadList :list="proofList">
        </UploadList>
      </el-form-item>
      <el-form-item label="报销凭证">
        <UploadList :list="bxList">
        </UploadList>
        <img :src="urlCode"
             v-if="urlCode"
             style="width: 118px;height: 118px">
      </el-form-item>

    </el-form>
    <div style="text-align:center">
      <el-button style="margin-right:15px"
                 @click="backIndex">返 回</el-button>
      <el-button type="primary"
                 :loading="btnLoading"
                 @click="saveData">处 理</el-button>
    </div>
  </div>
</template>
<script>
import request from "@/utils/request";
import UploadList from '@/components/UploadList'
var moment = require("moment");
import {
  BASE_URL
} from '../../../config/prod.env.js';
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
      urlCode: '',
      userId: null,
      id: null,
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
    this.id = this.$route.query.id
    this.getId()
    this.url = BASE_URL
    // this.url = this.url.replace("\"", "")
    this.url = this.url.substring(1, this.url.length - 1);

    // console.log(this.proofList);

    // this.getSchoolList();
  },

  methods: {
    openCode () {
      console.log(this.userId);

      request({
        url: "/api/backend/qrCode/index",
        method: "get",
        params: {
          url: this.url + 'proofBx?id=' + this.id + '&user_id=' + this.userId
        }
      }).then((res) => {
        this.urlCode = res.data
      })
    },
    getId () {
      request({
        url: "/api/backend/admin/info",
        method: "get",
      }).then(response => {
        this.userId = response.data.user.id
        console.log(this.userId);
        this.openCode()
      }).catch(err => {
        console.log(err);
      });
    },
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
          applicant: this.list.applicant,
        }
        if (this.form.pay_proof.length > 0) {
          this.proofList = this.form.pay_proof
        }
        if (this.form.expense_proof.length > 0) {
          this.bxList = this.form.expense_proof
        }
        this.listLoading = false;
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
      if (this.form.pay_datetime == null || this.form.pay_datetime != this.list.pay_datetime) {
        this.form.pay_datetime = moment(this.form.pay_datetime).format('YYYY-M-DD h:mm:ss')
        console.log(123);

      }
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
      // this.$router.push({ path: '/reimbursementMan/list' })
      this.$router.back(-1)
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
