<template>
  <div class="login">
    <el-form
      ref="loginForm"
      :rules="loginRules"
      :model="form"
      label-width="80px"
      class="login-form"
    >
      <h2 class="login-title">会员管理系统</h2>
      <el-form-item label="账号:" prop="username">
        <el-input v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label="密码:" prop="password">
        <el-input v-model="form.password" type="password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('loginForm')" class="login-btn">登 录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// 导入登录方法
import { login, UserInfo } from '@/api/login';

export default {
  data () {
    return {
      // 用户填写的表单信息(双向绑定)
      form: {
        username: '',
        password: ''
      },
      // 表单验证规则
      loginRules: {
        username: [{
          required: true, message: "账号不能为空", trigger: 'blur'
        }, {
          min: 3, max: 9, message: '账号应为3到9位', trigger: 'blur'
        }],
        password: [{
          required: true, message: "密码不能为空", trigger: 'blur'
        }]
      }
    }
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate(valid => {
        // 如果用户输入了账号密码
        if (valid) {
          // console.log('登录成功');
          // 将用户输入的账号密码传入后台进行验证
          login(this.form.username, this.form.password).then(response => {
            // console.log(response.data);
            // 如果响应回来的flag为true 就用拿到的token去请求用户信息
            const token = response.data.data.token;
            if (response.data.flag) {
              // console.log(response.data.data.token);
              UserInfo(token).then(response => {
                // 如果拿到了用户信息
                if (response.data.flag) {
                  // 拿到当前用户的个人信息 
                  const resp = response.data;
                  const userInfo = resp.data;
                  // console.log(response.data);
                  // 将用户信息保存到本地存储中
                  localStorage.setItem('mms-token', token);
                  localStorage.setItem('mms-userInfo', JSON.stringify(userInfo));
                  // 页面重定向到会员管理首页
                  this.$router.push('/');
                  // 提示用户登陆成功
                  this.$message({
                    type: 'success',
                    message: `亲爱的 ${userInfo.name}, 欢迎回来！`,
                    duration: 4000
                  })
                } else { //如果没有拿到
                  this.$message({
                    type: 'warning',
                    message: '您的账号存在问题,暂时无法登录！'
                  })
                }
              });
            } else { //flag为false 弹出提示框提示用户登录失败
              this.$message({
                type: 'error',
                message: '账号或密码错误,请重新输入!'
              })
            }
          })





        } else {
          console.log('登录失败');
        }
      })
    }
  }
}
</script>

<style scoped>
.login {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(rgb(145, 211, 124), rgb(200, 212, 20));
  overflow: hidden;
}
.login-form {
  width: 400px;
  margin: 200px auto;
  background-color: #ddd;
  padding: 25px;
  border-radius: 10px;
}
.login-title {
  text-align: center;
}
.login-btn {
  width: 150px;
  margin: 0 50px;
}
</style>