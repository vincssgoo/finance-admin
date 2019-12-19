<template>
  <div class="app-container">
    <div style="margin-bottom:15px;">
      <el-button type="primary"
                 @click="dialogVisible = true">新增</el-button>
      <el-button type="primary"
                 plain
                 style="float:right;"
                 icon="el-icon-search">搜索</el-button>
      <div style="float:right">
        <span class="demonstration"
              style="font-size:15px;">报名时间 </span>
        <el-date-picker v-model="value2"
                        type="daterange"
                        align="right"
                        unlink-panels
                        style="margin:0 15px;"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :picker-options="pickerOptions">
        </el-date-picker>
      </div>

    </div>
    <el-table v-loading="listLoading"
              :data="list"
              element-loading-text="Loading"
              border
              fit
              highlight-current-row>
      <el-table-column align="center"
                       label="序号"
                       width="95">
        <template slot-scope="scope">
          {{ scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column label="时间"
                       align="center">
        <template slot-scope="scope">
          {{ scope.row.title }}
        </template>
      </el-table-column>
      <el-table-column label="操作"
                       width="230"
                       align="center">
        <template slot-scope="scope">
          <el-button size="mini"
                     type="danger"
                     @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>

    </el-table>

    <el-dialog title="提示"
               :visible.sync="dialogVisible"
               width="30%"
               :before-close="handleClose">
      <span>这是一段信息</span>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <div class="block"
         style="margin-top:25px">
      <!-- <span class="demonstration">完整功能</span> -->
      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="currentPage4"
                     :page-sizes="[5, 10, 20, 50,100]"
                     :page-size="10"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="400">
      </el-pagination>
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
      input: '',
      list: null,
      listLoading: true,
      dialogVisible: false
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    handleEdit (row) {

    },
    handleDelete (row) {

    },
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`);
    },
    handleClose (done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => { });
    },
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
    },


  }
}
</script>
