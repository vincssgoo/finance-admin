<template>
  <div class="image-container">
    <div class="upload"
         v-for="(item, index) in list"
         :key="index"
         :style="{width: width,height: height}"
         @mouseover="showOptionIndex = index"
         @mouseout="showOptionIndex = -1">
      <img :src="item"
           class="avatar"
           v-if="videoType.indexOf(item.substring(item.lastIndexOf('.')+1)) == -1" />
      <video :src="item"
             class="avatar"
             v-else></video>
      <div v-if="index == showOptionIndex"
           class="option">
        <i class="option-icon el-icon-back"
           @click="handleLeft(index)"></i>
        <i class="option-icon el-icon-delete"
           @click="handleRemove(index)"></i>
        <i class="option-icon el-icon-zoom-in"
           @click="handleWatch(index)"></i>
        <i class="option-icon el-icon-right"
           @click="handleRight(index)"></i>
      </div>
    </div>
    <el-upload v-loading="loading"
               :action="qiniu.actionPath"
               :data="qiniu.postData"
               class="avatar-uploader"
               :style="{width: width,height: height}"
               :show-file-list="false"
               :before-upload="beforeUpload"
               :on-success="uploadSuccess"
               :disabled="able">
      <i class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
    <div>

    </div>
    <el-dialog :visible.sync="showPreview"
               :append-to-body='true'
               center
               :show-close="false"
               :close-on-click-modal="false">
      <img :src="previews"
           class="avatar"
           v-if="videoType.indexOf(previews.substring(previews.lastIndexOf('.')+1)) == -1" />
      <video :src="previews"
             class="avatar"
             v-else
             autoplay='true'
             controls="true"
             ref="videoPreview"></video>
      <el-button @click="cancel"
                 style="display:block;">返 回</el-button>
    </el-dialog>
  </div>
</template>

<script>
import { getQiniuToken } from "@/api/common";
import { guid } from "@/utils/index";

export default {
  name: "UploadList",
  props: {
    list: {
      type: Array,
      default: () => []
    },
    width: {
      type: String,
      default: "120px"
    },
    height: {
      type: String,
      default: "120px"
    },
    // disable: {
    //   type: String,
    //   default: false
    // }
    able: {
      type: Boolean,
      default: false,
    },
  },

  model: {
    prop: "list",
    event: "change"
  },

  watch: {
    list (newVal) {
      this.$emit("change", newVal);
    }
  },

  data () {
    return {
      loading: false,
      showOptionIndex: -1,
      qiniu: {
        actionPath: "",
        baseUrl: "",
        postData: {}
      },
      videoType: ['mp4', 'rmvb', 'wmv', 'avi', 'mov', 'flv'],
      previews: '',
      showPreview: false,
    };
  },

  created () {
    // console.log(this.disable);
    console.log(this.able);

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
    beforeUpload (file) {
      // 上传前需生成图片的GUID唯一名
      this.qiniu.postData.key = guid() + "." + file.type.split("/")[1];
      this.loading = true;
    },
    uploadSuccess (res, file, list) {
      let url = this.qiniu.baseUrl + "/" + res.key;
      this.list.push(url);
      // this.list.push({name:url,show:this.videoType.indexOf(element.substring(element.lastIndexOf('.')+1))});
      this.loading = false;
    },
    handleLeft (index) {
      if (index === 0) {
        return;
      }
      this.list.splice(
        index - 1,
        0,
        this.list.splice(index, 1)[0]
      );
    },
    handleRight (index) {
      if (index >= this.list.length - 1) {
        return;
      }
      this.list.splice(
        index + 1,
        0,
        this.list.splice(index, 1)[0]
      );
    },
    handleRemove (index) {
      this.list.splice(index, 1);
    },
    handleWatch (index) {
      this.previews = this.list[index]
      this.showPreview = true
    },
    cancel () {
      if (this.$refs.videoPreview) {
        this.$refs.videoPreview.pause()
      }
      this.showPreview = false
    },
  }
};
</script>

<style lang="scss" scoped>
.upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100%;
  margin-right: 10px;
  margin-bottom: 10px;
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
  .option {
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    position: absolute;
    left: 0;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: space-around;
    font-size: 18px;
    color: white;
    option-icon {
      flex: 1 1 auto;
    }
  }
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.image-container {
  display: flex;
  flex-wrap: wrap;
}
</style>
