<template>
  <div class="app-container">
    <div style="margin-bottom:15px;">
      <el-button type="primary"
                 @click="goNew">新建</el-button>
      <span style="margin-left:40px;">签约时间</span>
      <el-date-picker style="margin-left:20px;width: 150px;"
                      type="date"
                      v-model="listQuery.sign_start_datetime"
                      placeholder="开始日期时间"
                      value-format="yyyy-MM-dd"></el-date-picker>
      至
      <el-date-picker style="width: 150px;"
                      type="date"
                      v-model="listQuery.sign_end_datetime"
                      placeholder="结束日期时间"
                      value-format="yyyy-MM-dd">
      </el-date-picker>
      <span style="margin-left:10px;">录入时间</span>
      <el-date-picker style="margin-left:20px;width: 150px;"
                      type="date"
                      v-model="listQuery.start_datetime"
                      placeholder="开始日期时间"
                      value-format="yyyy-MM-dd"></el-date-picker>
      至
      <el-date-picker style="width: 150px;"
                      type="date"
                      v-model="listQuery.end_datetime"
                      placeholder="结束日期时间"
                      value-format="yyyy-MM-dd">
      </el-date-picker>
      <el-select v-model="value"
                 placeholder="状态"
                 style="width:120px"
                 clearable>
        <el-option v-for="item in options"
                   :key="item.value"
                   :label="item.label"
                   :value="item.value">
        </el-option>
      </el-select>
      <el-select v-model="listQuery.type_id"
                 placeholder="类型"
                 style="">
        <el-option v-for="item in typeList"
                   :label="item.title"
                   :value="item.id">
        </el-option>
      </el-select>

      <div style="margin-top:10px;">
        <el-input placeholder="公司名称"
                v-model="listQuery.company_name"
                style="width: 150px;"
                clearable>
      </el-input>
      <el-input placeholder="项目名称"
                v-model="listQuery.project_name"
                style="width: 150px;"
                clearable>
      </el-input>
      <el-button type="primary"
                 plain
                 icon="el-icon-search"
                 @click="handleFilter(value)">搜索</el-button>
      </div>

    </div>
    <div style="margin-bottom:15px">
      <span>项目总额:{{project_price_sum}}</span>
      <span style="margin-left:20px">已回款总额:{{returned_price_sum}}</span>
      <span style="margin-left:20px">待回款总额:{{no_returned_price_sum}}</span>
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
                       width="110">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="center"
                       label="公司">
        <template slot-scope="scope">
          {{ scope.row.company }}
        </template>
      </el-table-column>
      <el-table-column align="center"
                       label="项目编号"
                       width="130">
        <template slot-scope="scope">
          {{ scope.row.project_no }}
        </template>
      </el-table-column>
      <el-table-column align="center"
                       label="项目类型"
                       width="90">
        <template slot-scope="scope">
          {{ scope.row.type.title }}
        </template>
      </el-table-column>
      <el-table-column align="center"
                       label="项目总额"
                       width="110">
        <template slot-scope="scope">
          {{ scope.row.total_price }}
        </template>
      </el-table-column>
      <el-table-column align="center"
                       label="签约时间"
                       width="170">
        <template slot-scope="scope">
          {{ scope.row.sign_datetime }}
        </template>
      </el-table-column>
      <el-table-column align="center"
                       label="签约时长(工作日)"
                       width="115">
        <template slot-scope="scope">
          {{ scope.row.sign_days }}
        </template>
      </el-table-column>
      <el-table-column align="center"
                       label="已回款比例"
                       width="135">
        <template slot-scope="scope">
          {{ scope.row.returned_percent }}
        </template>
      </el-table-column>
      <el-table-column align="center"
                       label="已回款金额"
                       width="130">
        <template slot-scope="scope">
          {{ scope.row.returned_price }}
        </template>
      </el-table-column>
      <el-table-column align="center"
                       label="状态"
                       width="95">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.returned_percent == 0 " type="primary">新建</el-tag>
          <el-tag v-if="scope.row.returned_percent > 0 && scope.row.returned_percent < 100" type="success">进行中</el-tag>
          <el-tag v-if="scope.row.returned_percent == 100" type="danger">已完成</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center"
                       label="录入时间"
                       width="155">
        <template slot-scope="scope">
          {{ scope.row.created_at }}
        </template>
      </el-table-column>
      <el-table-column align="center"
                       label="最新修改人"
                       width="105">
        <template slot-scope="scope">
          <div v-if="scope.row.admin==null"></div>
          <div v-else>
            {{ scope.row.admin.nickname }}
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center"
                       label="最新修改时间"
                       width="155">
        <template slot-scope="scope">
          {{ scope.row.updated_at}}
        </template>
      </el-table-column>
      <el-table-column label="操作"
                       width="220"
                       align="center">
        <template slot-scope="scope"
                  style="">
          <div>
            <el-button class="btns" @click="handleEdit(scope.row)"
                       type="warning">修改</el-button>
            <el-button class="btns" @click="handleDelete(scope.row)"
            type="danger">删除</el-button>
            <el-button class="btns" @click="goRecord(scope.row)"
                       type="primary">回款记录</el-button>
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
      options: [
        {
          value: '选项1',
          label: '新建',
        },
        {
          value: '选项2',
          label: '进行中',
        },
        {
          value: '选项3',
          label: '已完成',
        },
      ],
      value: '',
      listQuery: {
        // page: 0,
        // limit: 1000000,
        page: 1,
        limit: 10,
        project_name: '',
        company_name: '',
        type_id: '',
        status: '',
        start_datetime: '',
        end_datetime: '',
      },
      btnLoading: false,
      listLoading: true,
      mapQuery: {
        key: '"e189ae2e6e040e0861df1281cb162f6b"',
        Keyword: '',
      },
      list: null,
      typeList: null,
      project_price_sum: null,
      returned_price_sum: null,
      no_returned_price_sum: null,
    }
  },
  created () {
    // console.log(this.$route.query.item);
    // if (this.$route.query.item) {
    //   this.getItemInfo(this.$route.query.item)
    // }
    // if (this.$route.query.id) {
    //   this.getDetail()
    // }
    // this.getLocationList();
    this.getList()
    this.getTypeList();
    // this.getSchoolList();
  },
  methods: {
    goRecord (row) {
      this.$router.push({        path: '/projectMan/record', query: {
          project_id: row.id
        }      })
    },
    goNew () {
      this.$router.push({ path: '/projectMan/modify' })
    },
    getTypeList () {
      this.listLoading = true;
      request({
        url: "/api/backend/projectType/index",
        method: "get",
      }).then(response => {
        this.length = response.data.length
        this.typeList = response.data.data;
        this.listLoading = false;
        console.log(this.typeList);
        for (let i = 0; i < this.typeList.length; i++) {
          if (this.typeList[i].status == 2) {
            this.typeList.splice(i, 1)
          }
        }
      });

    },
    handleSizeChange (val) {
      this.listQuery.limit = val;
      this.getList();
    },
    handleCurrentChange (val) {
      this.listQuery.page = val;
      this.getList();
    },
    handleEdit (row) {
      this.$router.push({
        path: '/projectMan/modify',
        query: { id: row.id }

      })
    },
    handleFilter (value) {
      // console.log(value);

      if (value == '选项1') {
        this.listQuery.status = '1'
      }
      else if (value == '选项2') {
        this.listQuery.status = '2'
      }
      else if (value == '选项3') {
        this.listQuery.status = '3'
      }
      // console.log(this.listQuery.sale_status)
      this.listQuery.page = 1;
      this.getList();
      // this.listQuery.sale_status = ''
    },
    getList () {
      this.listQuery.start_datetime = this.listQuery.start_datetime ? this.listQuery.start_datetime + " 00:00:00" : ""
      this.listQuery.end_datetime = this.listQuery.end_datetime ? this.listQuery.end_datetime + " 23:59:59" : ""
      this.listQuery.income_start_datetime = this.listQuery.income_start_datetime ? this.listQuery.income_start_datetime + " 23:59:59" : ""
      this.listQuery.income_end_datetime = this.listQuery.income_end_datetime ? this.listQuery.income_end_datetime + " 23:59:59" : ""
      this.listLoading = true;
      request({
        url: "/api/backend/project/index",
        method: "get",
        params: this.listQuery
      }).then(response => {
        this.list = response.data.data;
        this.total = response.data.total;
        this.project_price_sum = response.data.project_price_sum,
          this.returned_price_sum = response.data.returned_price_sum,
          this.no_returned_price_sum = response.data.no_returned_price_sum,
          this.listLoading = false;
        console.log(this.value);
        console.log(this.list);
      });
    },
    handleDelete(row) {
      this.$confirm("确认删除, 是否继续?", "提示", {
        type: "warning"
      })
        .then(() => {
          request({
            url: "/api/backend/project/delete",
            method: "post",
            data: { id: row.id }
          }).then(() => {
            this.getList();
            this.$message({
              type: "success",
              message: "删除成功!"
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },


  },
  components: {
    // UploadList
  }
}
</script>
<style scoped>
  .btns {
    margin-bottom: 5px;
  }
</style>
