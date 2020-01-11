<template>
  <div class="app-container">
    <div style="margin-bottom:15px;">
      <el-button type="primary"
                 @click="goNew">新建</el-button>
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
                       width="220"
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
    }
  },
  created () {
    this.getList()
  },
  methods: {
    goNew () {
      this.$router.push({ path: '/projectMan/newRecord' })
    },
    getList () {
      this.listLoading = true;
      request({
        url: "/api/backend/returnedMoney/all",
        method: "get",
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
