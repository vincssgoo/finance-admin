<template>
  <div class="app-container">
    <div class="content">
      <span style="width:80px">公告</span>
      <el-input type="textarea"
                :rows="5"
                placeholder="请输入内容"
                v-model="textarea">
      </el-input>
    </div>
    <div class="content">
      <span style="width:80px">报名须知</span>
      <el-input type="textarea"
                :rows="5"
                placeholder="请输入内容"
                v-model="textarea">
      </el-input>
    </div>
    <div class="content">
      <span style="width:80px">关于我们</span>
      <el-input type="textarea"
                :rows="5"
                placeholder="请输入内容"
                v-model="textarea">
      </el-input>
    </div>
    <div style="text-align:center">
      <el-button type="primary">提交</el-button>
    </div>

  </div>
</template>

<script>
import { getList } from '@/api/table'

export default {
  data () {
    return {
      list: null,
      listLoading: true,
      textarea: ''
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      this.listLoading = true
      // getList().then(response => {
      //   this.list = response.data.items
      //   this.listLoading = false
      // })
      this.list = [
        {
          avatar: 'null',
          nickname: '小红',
          tel: '13112345678',
          name: '红红',
          register_time: '2019.12.12',
        },
        {
          avatar: 'null',
          nickname: '小红',
          tel: '13112345678',
          name: '红红',
          register_time: '2019.12.12',
        },

      ]
      this.listLoading = false
    }
  }
}
</script>
<style>
.content {
  display: flex;
  flex-wrap: nowrap;
  margin-bottom: 60px;
}
</style>