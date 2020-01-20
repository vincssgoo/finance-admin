<template>
  <div class="app-container">

    <el-form ref="form"
             :model="form"
             label-width="120px">
      <el-form-item label="凭证">
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
    <!-- <div style="text-align:center">
      <span style="margin-top:35px;font-size:14px;display:inline-block;">tip:手机上传凭证后请先刷新后再提交!</span>
    </div> -->
  </div>
</template>

<script>
import request from "@/utils/request";
import UploadList from '@/components/UploadList'
import {
  BASE_URL
} from '../../../config/prod.env.js';
// import UploadList from '@/components/UploadList'

export default {
  data () {
    return {
      btnLoading: false,
      listLoading: true,
      proofList: null,
      form: {
        id: '',
        proof: [],
      },
      list: null,
      urlCode: '',
      userId: null,
      id: null,
      url: null,
    }
  },
  async created () {
    this.getList()
    if (this.proofList == null) {
      this.proofList = []
    }
    this.id = this.$route.query.id
    await this.getId()
    this.url = BASE_URL
    // this.url = this.url.replace("\"", "")
    this.url = this.url.substring(1, this.url.length - 1);
    console.log(this.url);

  },

  methods: {

    backIndex () {
      // this.$router.push({ path: '/income' })
      this.$router.back(-1)
    },
    getId () {
      request({
        url: "/api/backend/admin/info",
        method: "get",
      }).then(response => {
        this.userId = response.data.user.id
        this.openCode()
        console.log(this.userId);
      }).catch(err => {
        console.log(err);
      });
    },

    openCode () {
      console.log(this.userId);

      request({
        url: "/api/backend/qrCode/index",
        method: "get",
        params: {
          url: this.url + 'proof?id=' + this.id + '&user_id=' + this.userId
        }
      }).then((res) => {
        this.urlCode = res.data
      })
    },
    getList () {
      this.listLoading = true;
      request({
        url: "/api/backend/income/proof",
        method: "get",
        params: { id: this.$route.query.id }
      }).then(response => {
        this.list = response.data
        // console.log(response);
        this.proofList = response.data
      }).catch(err => {
        console.log(err);
      });
    },
    saveData () {
      this.btnLoading = true;
      this.form.id = this.$route.query.id
      if (this.proofList) {
        this.form.proof = this.proofList
      }
      request({
        url: "/api/backend/income/proofStore",
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

