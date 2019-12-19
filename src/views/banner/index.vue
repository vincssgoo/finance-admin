<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row>
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="图片" min-width="110" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.img" style="width:120px;height:80px">
        </template>
      </el-table-column>
      <el-table-column label="跳转类型" min-width="110" align="center">
        <template slot-scope="scope">
          <template v-if="scope.row.link_type == 0">不跳转</template>
          <template v-if="scope.row.link_type == 1">网页</template>
          <template v-else-if="scope.row.link_type == 2">小程序</template>
          <template v-else-if="scope.row.link_type == 3">IOS</template>
          <template v-else-if="scope.row.link_type == 4">安卓</template>
        </template>
      </el-table-column>
      <el-table-column label="跳转链接" min-width="220" align="center">
        <template slot-scope="scope">
          {{ scope.row.link }}
        </template>
      </el-table-column>
      <el-table-column label="权重" min-width="60" align="center">
        <template slot-scope="scope">
          {{ scope.row.weight }}
        </template>
      </el-table-column>
      <el-table-column label="描述" align="center">
        <template slot-scope="scope">
          {{ scope.row.description }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="创建时间" min-width="140">
        <template slot-scope="scope">
          <i class="el-icon-time"/>
          <span>{{ scope.row.created_at }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDel(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" :total="total" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
      <el-form ref="form" :rules="rules" :model="form" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="图片" prop="img">
          <!-- <div class="upload-block" @click="toggleShow">
            <img v-if="form.img" :src="form.img" class="uploaded-img">
            <i  v-else class="el-icon-plus uploader-icon"></i>
          </div>
          <img-crop-upload field="img"
            @crop-success="cropSuccess"
            v-model="show"
            :width="375"
            :height="230"
            :noCircle="true"
            :noSquare="true"
            img-format="png">
          </img-crop-upload> -->
          <upload-one v-model="form.img"></upload-one>
        </el-form-item>
        <el-form-item label="上传多张图片">
          <uploadList width="120px" height="120px" v-model="form.imgArray">
          </uploadList>
        </el-form-item>
        <el-form-item label="跳转类型" prop="link_type">
          <el-select v-model="form.link_type">
            <el-option label="不跳转" :value="0"/>
            <el-option label="网页" :value="1"/>
            <el-option label="小程序" :value="2"/>
            <el-option label="IOS" :value="3"/>
            <el-option label="安卓" :value="4"/>
          </el-select>
        </el-form-item>
        <el-form-item v-if="form.link_type" label="跳转链接" prop="link">
          <el-input v-model="form.link"/>
        </el-form-item>
        <el-form-item label="权重" prop="weight">
          <el-input type="number" v-model="form.weight"/>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input type="textarea" :rows="2" v-model="form.description"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="saveData" :loading="btnLoading">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import { getQiniuToken } from '@/api/common'
import request from '@/utils/request'
import { guid,base64toFile } from '@/utils/index'
import 'babel-polyfill'; // es6 shim
import imgCropUpload from 'vue-image-crop-upload';
import uploadList from '@/components/UploadList/index.vue'
import * as qiniu from 'qiniu-js'

export default {
  components: {
    'img-crop-upload': imgCropUpload,
    uploadList
  },
  data() {
    return {
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '添加'
      },
      dialogPvVisible: false,
      pvData: [],
      form: {
        id: '',
        img: '',
        imgArray:[],
        link_type: 0,
        link: '',
        weight: 0,
        description: '',
      },
      rules: {
        img: [{ required: true, message: '图片不能为空', trigger: 'blur' }],
      },
      btnLoading: false,

      show: false,
      imgBase64Data: '', // the datebase64 url of created image
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      request({
        url: '/api/backend/banner/list',
        method: 'get',
        params: this.listQuery
      }).then(response => {
        this.list = response.data.data
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    resetForm() {
      this.form = {
        id: '',
        img: '',
        imgArray:[],
        link_type: 0,
        link: '',
        weight: 0,
        description: '',
      }
      this.btnLoading = false
    },

    handleCreate() {
      this.resetForm()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['form'].clearValidate()
      })
    },
    handleUpdate(row) {
      this.resetForm()
      this.form = Object.assign({
        imgArray: ['http://img.qkjcrm.com/c9fd9e7a-6e3c-42c7-8c9a-22c20cd3db22.png','http://img.qkjcrm.com/f860dce0-04e4-49c4-926e-4a7a0360c8b0.png']
      }, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['form'].clearValidate()
      })
    },
    saveData() {
      console.log(this.form,this.form.imgArray)
      return
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.btnLoading = true
          request({
            url: '/api/backend/banner/save',
            method: 'post',
            data: this.form
          }).then(response => {
            this.btnLoading = false
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '保存成功',
              type: 'success',
              duration: 2000
            })
            this.getList();
          }).catch((err) => {
            this.btnLoading = false
          })
        }
      })
    },
    handleDel(val) {
      this.$confirm('确定要删除, 是否继续?', '提示', {
        type: 'warning'
      }).then(() => {
        request({
          url: '/api/backend/banner/del',
          method: 'get',
          params: {id: val}
        }).then(()=>{
          this.getList()
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });
      });
    },

    toggleShow() {
      this.show = !this.show;
    },
    cropSuccess(imgBase64Data, field){
      console.log('-------- 裁剪成功 --------');
      let that = this;
      this.imgBase64Data = imgBase64Data;
      getQiniuToken().then(response => {
        let file = base64toFile(imgBase64Data, 'tmp.png')
        let key = guid()+'.png';
        let token = response.data.token
        let baseUrl = response.data.baseUrl
        let putExtra = {}
        let config = {
          useCdnDomain: true,
          region: qiniu.region.z2
        };
        var observable = qiniu.upload(file, key, token, putExtra, config)
        var subscription = observable.subscribe({
          next(res){
            // ...
          },
          error(err){
            // ...
          },
          complete(res){
            // ...
            let imgUrl = baseUrl + '/' + key;
            that.form.img = imgUrl
            console.log(imgUrl)
          }
        }) // 上传开始
        // or
        // var subscription = observable.subscribe(next, error, complete) // 这样传参形式也可以
        // subscription.unsubscribe() // 上传取消
      })

    },
  }
}
</script>


<style>
.upload-block {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 120px;
  height: 120px;
}
.uploaded-img {
  width: 120px;
  height: 120px;
}
.upload-block:hover{
  border-color: #409EFF;
}
.uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
}
</style>
