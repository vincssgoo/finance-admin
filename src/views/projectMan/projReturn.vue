<template>
  <div class="app-container">
    <div style="margin-bottom:15px;">
      <el-button type="primary"
                 @click="goNew">新建</el-button>
      <span style="margin-left:40px;">回款时间</span>
      <el-date-picker style="margin-left:20px;width: 150px;"
                      v-model="listQuery.returned_start_datetime"
                      type="date"
                      placeholder="开始日期时间"
                      value-format="yyyy-MM-dd"></el-date-picker>
      至
      <el-date-picker style="width: 150px;"
                      v-model="listQuery.returned_end_datetime"
                      type="date"
                      placeholder="结束日期时间"
                      value-format="yyyy-MM-dd">
      </el-date-picker>
      <span style="margin-left:40px;">录入时间</span>
      <el-date-picker style="margin-left:20px;width: 150px;"
                      v-model="listQuery.start_datetime"
                      type="date"
                      placeholder="开始日期时间"
                      value-format="yyyy-MM-dd"></el-date-picker>
      至
      <el-date-picker style="width: 150px;"
                      v-model="listQuery.end_datetime"
                      type="date"
                      placeholder="结束日期时间"
                      value-format="yyyy-MM-dd">
      </el-date-picker>
      <div style="margin-top:20px;margin-left:100px;">

        <el-input placeholder="项目名称"
                  v-model="listQuery.project_name"
                  style="width: 150px;margin-right:20px"
                  clearable>
        </el-input>
        <el-input placeholder="公司"
                  v-model="listQuery.company"
                  style="width: 150px;margin-right:20px"
                  clearable>
        </el-input>
        <el-button type="primary"
                   plain
                   icon="el-icon-search"
                   @click="handleFilter()">搜索</el-button>

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
                       width="75">
        <template slot-scope="scope">
          {{ scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column label="项目名称"
                       align="center"
                       width="100">
        <template slot-scope="scope">
          {{ scope.row.project.name }}
        </template>
      </el-table-column>
      <el-table-column align="center"
                       label="公司">
        <template slot-scope="scope">
          {{ scope.row.project.company }}
        </template>
      </el-table-column>
      <el-table-column align="center"
                       label="项目编号"
                       width="100">
        <template slot-scope="scope">
          {{ scope.row.project.project_no }}
        </template>
      </el-table-column>
      <el-table-column align="center"
                       label="回款金额"
                       width="90">
        <template slot-scope="scope">
          {{ scope.row.price }}
        </template>
      </el-table-column>
      <el-table-column align="center"
                       label="比例"
                       width="80">
        <template slot-scope="scope">
          {{ scope.row.percent }}
        </template>
      </el-table-column>
      <el-table-column align="center"
                       label="回款时间"
                       width="160">
        <template slot-scope="scope">
          {{ scope.row.returned_datetime }}
        </template>
      </el-table-column>
      <el-table-column align="center"
                       label="录入时间"
                       width="160">
        <template slot-scope="scope">
          {{ scope.row.created_at }}
        </template>
      </el-table-column>
      <el-table-column align="center"
                       label="操作人"
                       width="110">
        <template slot-scope="scope">
          <div v-if="scope.row.admin==null"></div>
          <div v-else>
            {{ scope.row.admin.nickname }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作"
                       width="240"
                       align="center">
        <template slot-scope="scope"
                  style="">
          <div>
            <el-button @click="handleEdit(scope.row)"
                       type="primary">修改</el-button>
            <el-button @click="handleEdit(scope.row)"
                       type="warning">操作日志</el-button>
          </div>

        </template>
      </el-table-column>

    </el-table>
    <!-- <router-view /> -->
  </div>
</template>
<script>
import request from "@/utils/request";
// import UploadList from '@/components/UploadList'

export default {
  data () {
    return {
      btnLoading: false,
      listLoading: true,
      list: null,
      listQuery: {
        end_datetime: '',
        start_datetime: '',
        returned_end_datetime: '',
        returned_start_datetime: '',
        project_name: '',
        company: '',
      }
    }
  },
  created () {
    this.getList()
  },
  methods: {
    handleFilter () {
      // console.log(value);

      // if (value == '选项1') {
      //   this.listQuery.sale_status = '1'
      // }
      // else if (value == '选项2') {
      //   this.listQuery.sale_status = '2'
      // }
      // console.log(this.listQuery.sale_status)
      this.listQuery.page = 1;
      this.getList();
      // this.listQuery.sale_status = ''
    },
    goNew () {
      this.$router.push({ path: '/projectMan/newRecord' })
    },
    getList () {
      this.listQuery.start_datetime = this.listQuery.start_datetime ? this.listQuery.start_datetime + " 00:00:00" : ""
      this.listQuery.end_datetime = this.listQuery.end_datetime ? this.listQuery.end_datetime + " 23:59:59" : ""
      this.listQuery.returned_start_datetime = this.listQuery.returned_start_datetime ? this.listQuery.returned_start_datetime + " 00:00:00" : ""
      this.listQuery.returned_end_datetime = this.listQuery.returned_end_datetime ? this.listQuery.returned_end_datetime + " 23:59:59" : ""
      this.listLoading = true;
      request({
        url: "/api/backend/returnedMoney/all",
        method: "get",
        params: this.listQuery
      }).then(response => {
        this.list = response.data.data;
        this.listLoading = false;
      });
    },

  },
  components: {
    // UploadList
  }
}
</script>
