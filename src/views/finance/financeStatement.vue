<template>
  <div class="app-container">
    <div class="block"
         style="margin-bottom:15px;">
      <span class="demonstration"
            style="font-size:15px;">时间段 </span>
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
      <el-input placeholder="请输入学校名称"
                v-model="input"
                style="width: 320px;"
                clearable>
      </el-input>
      <template>
        <el-select v-model="value"
                   placeholder="请选择">
          <el-option v-for="item in options"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value">
          </el-option>
        </el-select>
      </template>
      <el-button type="primary"
                 plain
                 style="float:right;"
                 icon="el-icon-search">搜索</el-button>
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
      <el-table-column align="center"
                       label="分点名称">
        <template slot-scope="scope">
          {{ scope.row.avatar }}
        </template>
      </el-table-column>
      <el-table-column label="结算时间段"
                       width="110"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.nickname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="金额"
                       width="110"
                       align="center">
        <template slot-scope="scope">
  {{ scope.row.tel }}
</template>
      </el-table-column>
      <el-table-column class-name="status-col"
                       label="状态"
                       width="110"
                       align="center">
        <template slot-scope="scope">
  <span>{{scope.row.name}}</span>
</template>
      </el-table-column>
      <el-table-column align="center"
                       label="操作"
                       width="200">
        <template slot-scope="scope">
  <el-button size="mini"
             type="danger"
             @click="handleDelete(scope.$index, scope.row)">删除</el-button>
</template>
      </el-table-column>
    </el-table>
    <div class="block"
         style="margin-top:25px">
      <!-- <span class="demonstration">完整功能</span> -->
      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="currentPage4"
                     :page-sizes="[5, 10, 20, 50,100]"
                     :page-size="100"
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
      options: [
        {
          value: '选项1',
          label: '未选择',
        },
        {
          value: '选项2',
          label: '已选择',
        },
      ],
      value: '未选择',
      input: '',
      list: null,
      listLoading: true
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`);
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
    }
  }
}
</script>
