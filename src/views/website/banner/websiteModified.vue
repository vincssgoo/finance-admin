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
        <!-- <el-dialog :visible.sync="dialogVisible">
          <img width="100%"
               :src="dialogImageUrl"
               alt="">
        </el-dialog> -->
      </el-form-item>
      <el-form-item label="权重">
        <el-input type="number"
                  placeholder="请输入权重"
                  v-model="input"
                  style="width:250px"
                  clearable></el-input>
      </el-form-item>
    </el-form>
    <div style="text-align:center;margin-top:200px">
      <el-button style="margin-right:15px">返 回</el-button>
      <el-button type="primary">提 交</el-button>
    </div>
  </div>
</template>

<script>
import { getList } from '@/api/table'

export default {
  filters: {
    statusFilter (status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data () {
    return {
      input: '1',
      list: null,
      listLoading: true
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
