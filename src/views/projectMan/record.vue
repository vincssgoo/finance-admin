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
                       width="135">
        <template slot-scope="scope">
          {{ scope.$index+1 }}
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
    <!-- <router-view /> -->
    <div style="text-align:center;margin-top:60px;">
      <el-button style="margin-right:15px"
                 @click="backIndex"
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
        project_id: '',
      },
      btnLoading: false,
      listLoading: true,
      list: null,
    }
  },
  created () {
    console.log(this.$route.query.project_id);

    this.listQuery.project_id = this.$route.query.project_id
    this.getList()
  },
  methods: {
    handleEdit (row) {
      this.$router.replace({
        path: '/projectMan/newRecord',
        query: { id: row.id }
      })
    },
    goNew () {
      this.$router.replace({        path: '/projectMan/newRecord', query: {
          project_id: this.listQuery.project_id
        }      })
    },
    getList () {
      this.listLoading = true;
      request({
        url: "/api/backend/returnedMoney/index",
        method: "get",
        params: this.listQuery
      }).then(response => {
        // console.log(response);

        this.list = response.data.data;
        this.listLoading = false;
        console.log(this.list);

        // console.log(this.list);
        // this.listQuery.sale_status = ''
      });
    },
    backIndex () {
      this.$router.replace({ path: '/projectMan/list' })
    },



  },
  components: {
    // UploadList
  }
}
</script>