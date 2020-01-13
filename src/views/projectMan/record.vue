<template>
  <div class="app-container">
    <div style="margin-bottom:15px;">
      <el-button type="primary"
                 v-if="routerName !== 'ProjReturn'"
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
                       width="135">
        <template slot-scope="scope">
          {{ scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column label="公司"
                       align="center"
                       width="150"
                       v-if="routerName === 'ProjReturn'">
        <template slot-scope="scope">
          {{ scope.row.project.company }}
        </template>
      </el-table-column>
      <el-table-column label="项目名称"
                       align="center"
                       width="150"
                       v-if="routerName === 'ProjReturn'">
        <template slot-scope="scope">
          {{ scope.row.project.name }}
        </template>
      </el-table-column>
      <el-table-column label="项目编号"
                       align="center"
                       width="150"
                       v-if="routerName === 'ProjReturn'">
        <template slot-scope="scope">
          {{ scope.row.project.project_no }}
        </template>
      </el-table-column>
      <el-table-column label="回款金额"
                       align="center"
                       width="150">
        <template slot-scope="scope">
          {{ scope.row.price }}
        </template>
      </el-table-column>
      <el-table-column align="center"
                       label="比例"
                       width="150">
        <template slot-scope="scope">
          {{ scope.row.percent }}
        </template>
      </el-table-column>
      <el-table-column align="center"
                       label="回款时间"
                       width="270">
        <template slot-scope="scope">
          {{ scope.row.returned_datetime }}
        </template>
      </el-table-column>
      <el-table-column align="center"
                       label="录入时间"
                       width="270">
        <template slot-scope="scope">
          {{ scope.row.created_at }}
        </template>
      </el-table-column>
      <el-table-column align="center"
                       label="操作人"
                       width="120">
        <template slot-scope="scope">
          <div v-if="scope.row.admin==null"></div>
          <div v-else>
            {{ scope.row.admin.nickname }}
          </div>
        </template>
      </el-table-column>

      <el-table-column label="操作"
                       align="center">
        <template slot-scope="scope"
                  style="">
          <div>
            <el-button @click="handleEdit(scope.row)"
                       type="primary">修改</el-button>
          </div>

        </template>
      </el-table-column>

    </el-table>
    <div style="margin-top:15px;">
      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="listQuery.page"
                     :page-sizes="[5, 10, 20, 50,100]"
                     :page-size="listQuery.limit"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total"></el-pagination>
    </div>
    <!-- <router-view /> -->
    <div style="text-align:center;margin-top:60px;">
      <el-button style="margin-right:15px"
                 @click="backIndex"
                 v-if="routerName !== 'ProjReturn'"
                 type="primary">返 回</el-button>
    </div>
  </div>
</template>
<script>
import request from "@/utils/request";
// import UploadList from '@/components/UploadList'

export default {
  data () {
    return {
      listQuery: {
        page: 1,
        limit: 10,
        project_id: '',
      },
      total: null,
      btnLoading: false,
      listLoading: true,
      list: null,
      routerName: '',
    }
  },
  created () {
    this.routerName = this.$route.name
    this.listQuery.project_id = this.$route.query.project_id ? this.$route.query.project_id : ''
    this.getList()
  },
  watch: {
    '$route' (to, from) { //监听路由是否变化
      this.routerName = this.$route.name
      if (this.name === 'ProjReturn') {
        this.listQuery.project_id = ''
      } else if (this.name === 'Record') {
        this.listQuery.project_id = this.$route.query.project_id
      }
      this.getList()
    }
  },
  methods: {
    handleEdit (row) {
      this.$router.push({
        path: '/projectMan/newRecord',
        query: { project_id: row.project_id, id: row.id }
      })
    },
    goNew () {
      this.$router.push({        path: '/projectMan/newRecord', query: {
          project_id: this.$route.query.project_id,
        }      })
    },
    getList () {
      this.listLoading = true;
      request({
        url: "/api/backend/returnedMoney/index",
        method: "get",
        params: this.listQuery
      }).then(response => {
        this.list = response.data.data;
        this.total = response.data.total
        this.listLoading = false;
      });
    },
    backIndex () {
      this.$router.push({ path: '/projectMan/list?' })
    },
    handleSizeChange (val) {
      this.listQuery.limit = val;
      this.getList();
    },
    handleCurrentChange (val) {
      this.listQuery.page = val;
      this.getList();
    },
  },
  components: {
    // UploadList
  }
}
</script>
