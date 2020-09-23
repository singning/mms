<template>
  <!-- 在修改密码时 要通过自定义校验器来进行密码的二次校验 
  第一次校验用户是否输入规定的字符
  第二次自定义校验器来校验与后台响应回来的结果是否一致
  两次校验都成功  就向后台发送修改密码请求 否则修改密码失败
  -->
  <div class="header">
    <!-- 左侧logo标志及项目名称 -->
    <a href="#/" class="logo">
      <img class="logoImg" src="../../assets/logo.png" alt="蔦屋书店" title="蔦屋书店" />
      <span class="cname">会员管理系统</span>
    </a>
    <!-- 右侧退出登录和修改密码 -->
    <el-dropdown @command="handleCommand">
      <span class="el-dropdown-link">
        {{userInfo.name}}
        <i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item icon="el-icon-edit" command="a">修改密码</el-dropdown-item>
        <el-dropdown-item icon="el-icon-open" command="b">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <!-- 修改密码对话框 -->
    <el-dialog title="修改密码" :visible.sync="dialogFormVisible" width="400px">
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
        style="width: 350px"
      >
        <el-form-item label="原始密码" prop="oldPass">
          <el-input type="password" v-model="ruleForm.oldPass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="pass">
          <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
// 退出登录接口
import { logout } from '@/api/login';
// 修改密码接口
import passwordAPI from '@/api/password';

export default {
  // 初始化数据
  data () {
    // 定义自定义校验规则
    // 原始密码校验
    const validateOldPass = (rule, value, callback) => {
      // value是当前用户输入的值  rule是验证规则 callback是回调函数 负责处理验证结果的
      // console.log(value);
      // 向后台发送请求 判断当前用户输入的密码是否正确
      passwordAPI.checkPwd(this.userInfo.id, value).then(response => {
        const resp = response.data;
        // 如果后台响应回来的数据显示成功
        if (resp.flag) {
          // 验证成功直接调用回调函数即可
          callback();
        } else {
          callback(new Error(resp.message))
        }
      });
    };
    // 新密码与确认密码校验规则
    const validateCheckPass = (rule, value, callback) => {
      if (value !== this.ruleForm.pass) {
        callback(new Error('两次密码不一致'));
      } else {
        // 校验成功 直接调用回调函数即可
        callback();
      }
    }

    return {
      dialogFormVisible: false, //对话框显示与隐藏状态
      ruleForm: {  //表单绑定数据
        oldPass: '',
        pass: '',
        checkPass: ''
      },
      rules: { //表单验证规则
        oldPass: [{ required: true, message: '请输入原始密码', trigger: 'blur' },
        { validator: validateOldPass, trigger: 'blur' }],
        pass: [{ required: true, message: '请输入新密码', trigger: 'blur' },
        ],
        checkPass: [{ required: true, message: '请重新输入密码', trigger: 'blur' },
        { validator: validateCheckPass, trigger: 'change' }]
      },
      userInfo: JSON.parse(localStorage.getItem('mms-userInfo')), //获取本地存储中的用户信息
    }
  },

  methods: {
    //修改密码或退出登录的逻辑实现
    handleCommand (command) {
      // this.$message({ message: `当前为${command}` });
      // 如果用户点击的是退出登录
      if (command == 'b') {
        this.logout();
      } else { //当前点击的是修改密码
        this.changePwd();
      }
    },
    // 退出登录逻辑
    logout () {
      // 向后台发送退出登录请求
      // 获取token
      const token = localStorage.getItem('mms-token');
      logout(token).then(response => {
        const resp = response.data;
        if (resp.flag) {
          // 清除本地存储中的token和用户信息
          localStorage.removeItem('mms-token');
          localStorage.removeItem('mms-userInfo');
          // 页面跳转到登录界面
          this.$router.push('/login');
          this.$message({
            type: 'success',
            message: resp.message
          })
        } else {
          this.$message({
            type: 'warning',
            message: '退出失败,请稍后再试',
            duration: 2000
          })
        }
      });
    },
    // 修改密码弹出框
    changePwd () {
      this.dialogFormVisible = true;
      // 重置表单
      this.$nextTick(() => {
        this.$refs['ruleForm'].resetFields();
      })
    },
    // 提交修改密码请求
    submitForm (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 调用接口向后台发送确认修改密码请求
          passwordAPI.updataPwd(this.userInfo.id, this.ruleForm.pass).then(response => {
            const resp = response.data;
            if (resp.flag) {
              // 密码修改成功
              this.logout();
              this.$message({
                type: 'success',
                message: resp.message
              })
            } else {
              this.$message({
                type: 'error',
                message: resp.message
              })
            }
          })

        } else {
          return false;
        }
      });
    },
    // 重置表单
    resetForm (formName) {
      this.$refs[formName].resetFields();
    }

  }

}
</script>

<style scoped>
.logo {
  display: inline-block;
  color: aliceblue;
  text-decoration: none;
}
.logoImg {
  display: inline-block;
  vertical-align: middle;
  width: 25px;
  margin: -8px 10px 0 35px;
}
.cname {
  font-size: 16px;
  letter-spacing: 1px;
}
.el-dropdown {
  float: right;
  margin-right: 30px;
  cursor: pointer;
  color: beige;
}
</style>