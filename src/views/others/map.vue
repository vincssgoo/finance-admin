<template>
  <el-form ref="form" :model="form" label-width="80px" style="width:80%;height:450px;margin:50px auto;">
    <el-form-item label="详细地址">
      <el-input v-model="form.address"></el-input>
    </el-form-item>
    <el-form-item label="经纬度">
      <el-col :md="6">
        <el-input :disabled="true" v-model="form.position"></el-input>
      </el-col>
      <el-col :span="24" style="margin-top:15px;">
        <amap-position ref="map" @choosePosition="choosePosition" :height="300"></amap-position>
      </el-col>
    </el-form-item>
    <el-form-item label="设置中心">
      <el-button type="success" @click="setCenter">设置中心点</el-button>
    </el-form-item>
  </el-form>

</template>

<script>
import AMapPosition from "@/components/AMapPosition";

export default {
  components: {
    "amap-position": AMapPosition
  },
  data() {
    return {
      form: {
        address: "",
        position: ""
      }
    };
  },
  methods: {
    onSubmit() {
      console.log("submit!");
    },
    choosePosition(res) {
      console.log(res);
      this.form.position = res.position.lat + "," + res.position.lng;
      this.form.address = res.address;
    },
    setCenter() {
      this.$nextTick(() => {
        this.$refs["map"].setCenter(116.410389, 39.903621);
      });
    }
  }
};
</script>

<style>

</style>
