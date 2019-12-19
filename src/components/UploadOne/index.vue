<template>
  <el-upload
    v-loading="loading"
    :action="qiniu.actionPath"
    :data="qiniu.postData"
    class="avatar-uploader"
    :style="{width: width,height: height}"
    :show-file-list="false"
    :before-upload="beforeUpload"
    :on-success="uploadSuccess"
    :on-error="uploadError"
  >
    <img v-if="url" :src="url" class="avatar" />
    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
  </el-upload>
</template>
<script>
import { getQiniuToken } from "@/api/common";
import { guid } from "@/utils/index";

export default {
  name: "UploadOne",
  props: {
    url: {
      value: ""
    },
    width: {
      type: String,
      default: "120px"
    },
    height: {
      type: String,
      default: "120px"
    }
  },
  model: {
    prop: "url", //绑定的值，通过父组件传递
    event: "update" //自定义时间名
  },
  data() {
    return {
      loading: false,
      qiniu: {
        actionPath: "",
        baseUrl: "",
        postData: {}
      }
    };
  },
  created() {
    getQiniuToken().then(response => {
      // token可多次使用
      this.qiniu.actionPath = response.data.uploadUrl;
      this.qiniu.baseUrl = response.data.baseUrl;
      if (!this.qiniu.postData.token) {
        this.qiniu.postData.token = response.data.token;
      }
    });
  },
  methods: {
    beforeUpload(file) {
      // 上传前需生成图片的GUID唯一名
      this.qiniu.postData.key = guid() + '.' + file.type.split('/')[1];
      this.loading = true;
    },
    uploadSuccess(res) {
      let url = this.qiniu.baseUrl + "/" + res.key;
      this.$emit("update", url); //子组件与父组件通讯，告知父组件更新绑定的值
      this.loading = false;
    },
    uploadError(res) {
      this.loading = false;
      this.$message({
        type: "error",
        message: `操作失败,${res}`
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100%;
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .avatar {
    width: 100%;
    height: 100%;
    display: block;
  }
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
</style>
