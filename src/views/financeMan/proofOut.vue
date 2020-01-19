<template>
  <div class="app-container">

    <el-form ref="form"
             :model="form"
             label-width="120px">
      <el-form-item label="支付凭证">
        <UploadList :list="proofList"
                    v-model="proofList">
        </UploadList>
        <img :src="urlCode"
             v-if="urlCode"
             style="width: 118px;height: 118px">
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
      urlCode: '',
      userId: null,
      id: null,
    }
  },
  created () {
    this.getList()
    if (this.proofList == null) {
      this.proofList = []
    }
    this.id = this.$route.query.id

    this.getId()
  },

  methods: {
    openCode () {
      console.log(this.userId);
      request({
        url: "/api/backend/qrCode/index",
        method: "get",
        params: {
          url: 'http://finance-h5.mvp45.com/proofOut?id=' + this.id + '&user_id=' + this.userId
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
    backIndex () {
      // this.$router.push({ path: '/outcome' })
      this.$router.back(-1)
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
          console.log(this.proofList);
        }

      }).catch(err => {
        console.log(err);
      });
    },
    saveData () {
      this.btnLoading = true;
      this.form.id = this.$route.query.id
      // this.getList()
      if (this.proofList) {
        this.form.pay_proof = this.proofList
      }

      console.log(this.form);

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

