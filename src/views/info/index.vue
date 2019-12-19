<template>
<el-form ref="form" :model="form" :rules="rule" label-width="140px" style="width:60%;margin:40px auto;">
  <el-form-item label="用户名">
    <el-input v-model="form.username" disabled></el-input>
  </el-form-item>
  <el-form-item label="旧密码" prop="password_old">
    <el-input type="password" v-model="form.password_old"></el-input>
  </el-form-item>
  <el-form-item label="新密码" prop="password_new">
    <el-input type="password" v-model="form.password_new"></el-input>
  </el-form-item>
  <el-form-item label="确认新密码" prop="password_new_confirm">
    <el-input type="password" v-model="form.password_new_confirm"></el-input>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="saveData" :loading="btnLoading">保存</el-button>
    <el-button @click="cancel">取消</el-button>
  </el-form-item>
</el-form>
</template>

<script>

import request from '@/utils/request'

export default {
  data() {
    const validatePass = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码不能小于6位'))
      } else {
        if (this.form.checkPass !== '') {
          this.$refs.form.validateField('password_new_confirm');
        }
        callback();
      }
    }
    const validatePass2 = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码不能小于6位'))
      } else if (value !== this.form.password_new) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback()
      }
    }
    return {
      btnLoading: false,
      form: {
        username: '',
        password_old: '',
        password_new: '',
        password_new_confirm: '',
      },
      rule: {
        password_old: [{ required: true, trigger: 'blur', message: '旧密码不能为空'}],
        password_new: [{ required: true, trigger: 'blur', validator: validatePass }],
        password_new_confirm: [{ required: true, trigger: 'blur', validator: validatePass2 }]
      }
    }
  },
  created() {
    this.form.username = this.$store.state.user.username
  },
  methods: {
    saveData() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.btnLoading = true
          request({
            url: '/api/backend/change_passwd',
            method: 'post',
            data: this.form
          }).then(response => {
            this.btnLoading = false
            this.$notify({
              title: '成功',
              message: '保存成功',
              type: 'success',
              duration: 2000
            })
            setTimeout(() => {
              this.$router.go(-1);//返回上一层
            }, 500);
          }).catch((err) => {
            this.btnLoading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    cancel() {
      this.$router.go(-1);//返回上一层
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
