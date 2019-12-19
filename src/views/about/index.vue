<template>
  <div class="richtext-container">
    <tinymce :height="400" v-model="content" :value="content"/>
    <el-row style="padding:15px 0;text-align:center">
      <!-- <el-button type="danger" @click="handleClear">清空</el-button> -->
      <el-button type="primary" @click="handleSave">保存</el-button>
    </el-row>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import request from '@/utils/request'

export default {
  name: 'TinymceDemo',
  components: { Tinymce },
  data() {
    return {
      content: ''
    }
  },
  created() {
    this.getAbout()
  },
  methods: {
    getAbout() {
      request({
        url: '/api/backend/about',
        method: 'get',
        params: {}
      }).then(response => {
        this.content = response.data.content || ''
      })
    },
    handleClear() {

    },
    handleSave() {
      this.$confirm('确定要保存, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request({
          url: '/api/backend/about/save',
          method: 'post',
          params: { content: this.content}
        }).then(()=>{
          this.$message({
            type: 'success',
            message: '保存成功!'
          });
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });
      });
    }
  }

}
</script>

<style scoped>
.richtext-container{
  width: 90%;
  margin: 0 auto;
  margin-top: 20px;
}
</style>

