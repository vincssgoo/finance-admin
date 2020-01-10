<template>
  <div class="app-container">
    <div style="margin-bottom:15px;">
      <el-button type="primary"
                 @click="dialogVisible = true">新建</el-button>
    </div>
    <el-table v-loading="listLoading"
              :data="list"
              element-loading-text="Loading"
              border
              fit
              highlight-current-row>
      <el-table-column align="center"
                       label="序号"
                       width="185">
        <template slot-scope="scope">
          {{ scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column label="类型"
                       align="center">
        <template slot-scope="scope">
          {{ scope.row.title }}
        </template>
      </el-table-column>
      <el-table-column align="center"
                       label="状态"
                       width="185">

        <template slot-scope="scope">
          <div v-if="scope.row.status == '1' ">
            正常
          </div>
          <div v-else-if="scope.row.status == '2'"
               style="color:red">
            已下架
          </div>
        </template>
      </el-table-column>

      <el-table-column label="操作"
                       width="260"
                       align="center">
        <template slot-scope="scope"
                  style="">
          <div>
            <el-button @click="handleEdit(scope.row)"
                       type="primary">修改</el-button>
            <el-button v-if="scope.row.status == '1' "
                       @click="handleCourse(scope.row)"
                       type="danger">下架</el-button>
            <el-button v-else
                       @click="handleCourse(scope.row)"
                       type="danger">上架</el-button>
          </div>

        </template>
      </el-table-column>

    </el-table>
    <el-dialog :close-on-click-modal="false"
               :visible.sync="dialogVisible"
               width="50%">
      <el-form ref="form"
               :model="form"
               label-position="left"
               label-width="70px">
        <el-form-item label="类型"
                      prop="name">
          <el-input v-model="form.title"
                    placeholder="请输入类型名称"
                    style="width:50%" />
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary"
                   @click="saveData"
                   :loading="btnLoading">确定</el-button>
      </div>
    </el-dialog>

    <div class="block"
         style="margin-top:25px">
      <!-- <span class="demonstration">完整功能</span> -->
      <!-- <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="listQuery.page"
                     :page-sizes="[5, 10, 20, 50,100]"
                     :page-size="listQuery.limit"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total">
      </el-pagination> -->
      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="listQuery.page"
                     :page-sizes="[5, 10, 20, 50,100]"
                     :page-size="listQuery.limit"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total">
      </el-pagination>
    </div>
    <!-- <router-view /> -->
  </div>
</template>
<script>
import request from "@/utils/request";
// import UploadList from '@/components/UploadList'

export default {
  data () {
    return {
      dialogVisible: false,
      form: {
        id: '',
        title: '',
      },
      listQuery: {
        page: 1,
        limit: 10,
      },
      btnLoading: false,
      listLoading: true,
      list: null,
      totalL: null,
    }
  },
  created () {
    this.getList()
  },
  watch: {
    dialogVisible (newVal, oldVal) {
      // 编辑框一异隐藏，马上清除旧数据
      if (newVal === false) {
        this.form = {
          id: "",
          title: '',
        };
      }
    }
  },
  methods: {
    handleSizeChange (val) {
      this.listQuery.limit = val;
      this.getList();
    },
    handleCurrentChange (val) {
      this.listQuery.page = val;
      this.getList();
    },
    handleEdit (item) {
      this.form = {
        id: item.id,
        title: item.title
      };

      this.dialogVisible = true;
    },
    handleCourse (row) {
      this.$confirm('确定要改变该类型的状态吗?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        this.changeStatus(row)
      }).catch(() => {

      });
    },
    changeStatus (row) {
      request({
        url: "/api/backend/payType/changeStatus",
        method: "post",
        data: { id: row.id }
      }).then(response => {
        if (row.status == '1') {
          row.status = '2'
        }
        else if (row.status == '2') {
          row.status = '1'
        }
        this.getList()
      });
    },

    getList () {
      this.listLoading = true;
      request({
        url: "/api/backend/payType/index",
        method: "get",
      }).then(response => {
        this.list = response.data.data;
        this.total = response.data.total;
        this.listLoading = false;
        console.log(this.list);
      });

    },
    saveData () {
      this.btnLoading = true;
      request({
        url: "/api/backend/payType/store",
        method: "post",
        data: this.form
      })
        .then(() => {
          // this.getTypeList();
          this.$message({
            type: "success",
            message: "操作成功!"
          }); this.dialogVisible = false
          this.getList();

        })
        .finally(() => {
          this.btnLoading = false;
        });
    },
  },
  components: {
    // UploadList
  }
}

</script>