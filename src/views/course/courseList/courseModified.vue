<template>
  <div class="app-container">

    <el-form ref="form"
             :model="form"
             label-width="120px">
      <el-form-item label="图片">
        <el-upload action="https://jsonplaceholder.typicode.com/posts/"
                   list-type="picture-card"
                   :on-preview="handlePictureCardPreview"
                   :on-remove="handleRemove">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%"
               :src="dialogImageUrl"
               alt="">
        </el-dialog>
      </el-form-item>
      <el-form-item label="名称">
        <el-input v-model="form.name"
                  placeholder="请输入名称"
                  clearable />
      </el-form-item>
      <el-form-item label="价格">
        <el-input v-model="form.price"
                  placeholder="请输入价格"
                  clearable />
      </el-form-item>
      <el-form-item label="学校">
        <el-select v-model="value1"
                   placeholder="请选择">
          <el-option v-for="item in options1"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="科目">
        <el-select v-model="value2"
                   placeholder="请选择">
          <el-option v-for="item in options2"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="限制人数">
        <el-input v-model="form.price"
                  placeholder="请输入限制人数"
                  clearable />
      </el-form-item>
      <el-form-item label="上课时间">
        <el-input v-model="form.price"
                  placeholder="请输入上课时间"
                  clearable />
      </el-form-item>
      <el-form-item label="上课详细地点">
        <el-input v-model="form.price"
                  placeholder="请输入上课详细地点"
                  clearable />
      </el-form-item>

      <el-form-item label="经纬度">
        <div v-if="form.lng">{{form.lng}},{{form.lat}}</div>
        <div v-else>请在地图上选点，然后点击“选择该位置”按钮获取经纬度</div>
        <div style="position: relative">
          <AMapPosition ref="map"
                        @choosePosition="choosePosition"
                        :height="300"></AMapPosition>
        </div>
      </el-form-item>
      <el-form-item label="详细介绍">
        <tinymce :height="400"
                 v-model="content"
                 :value="content" />
      </el-form-item>
    </el-form>
    <div style="text-align:center">
      <el-button style="margin-right:15px">返 回</el-button>
      <el-button type="primary">提 交</el-button>
    </div>
  </div>
</template>

<script>
import AMapPosition from "@/components/AMapPosition";
import Tinymce from '@/components/Tinymce'
export default {
  data () {
    return {
      content: '',
      value1: '西部分校',
      value2: '益智',
      dialogImageUrl: '',
      dialogVisible: false,
      position: null,
      options1: [{
        value: '选项1',
        label: '西部分校'
      }, {
        value: '选项2',
        label: '东部分校'
      }, {
        value: '选项3',
        label: '北部分校'
      }, {
        value: '选项4',
        label: '南部分校'
      },],
      options2: [{
        value: '选项1',
        label: '益智'
      }, {
        value: '选项2',
        label: '运动'
      }, {
        value: '选项3',
        label: '123'
      }, {
        value: '选项4',
        label: '123'
      },],
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: '',
        lng: '',
        lat: '',

      }
    }
  },
  methods: {
    handleRemove (file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    choosePosition (res) {
      console.log(res);
      this.form.lng = res.position.lng;
      this.form.lat = res.position.lat;
    },
  },
  components: {
    AMapPosition,
    Tinymce,
  }
}
</script>

<style scoped>
.line {
  text-align: center;
}
</style>

