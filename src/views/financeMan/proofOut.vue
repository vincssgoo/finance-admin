<template>
  <div class="app-container">

    <el-form ref="form"
             :model="form"
             label-width="120px">
      <el-form-item label="支付凭证">
        <UploadList :list="proofList"
                    v-model="proofList">
        </UploadList>
        <!-- <UploadList></UploadList> -->
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
import UploadList from '@/components/UploadList'

// import UploadList from '@/components/UploadList'

export default {
  data () {
    return {
      btnLoading: false,
      listLoading: true,
      proofList: null,
      bxList: [],
      form: {
        id: '',
        pay_proof: [],
      },
      list: null,
    }
  },
  created () {
    this.getList()
    if (this.proofList == null) {
      this.proofList = []
    }
  },
  methods: {

    backIndex () {
      this.$router.replace({ path: '/financeMan/outcome' })
    },
    getList () {
      this.listLoading = true;
      request({
        url: "/api/backend/pay/proof",
        method: "get",
        params: { id: this.$route.query.id }
      }).then(response => {
        if (response.data != null) {
          this.proofList = response.data
        }

      }).catch(err => {
        console.log(err);
      });
    },
    saveData () {
      this.btnLoading = true;
      this.form.id = this.$route.query.id
      if (this.proofList) {
        this.form.pay_proof = this.proofList
      }
      request({
        url: "/api/backend/pay/proofStore",
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

