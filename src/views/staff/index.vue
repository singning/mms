<template>
  <div>
    <!-- 顶部搜索框 start -->
    <el-form :inline="true" :model="searchMap" ref="searchForm" style="margin-left:20px">
      <el-form-item prop="username">
        <el-input v-model="searchMap.username" placeholder="员工账号"></el-input>
      </el-form-item>
      <el-form-item prop="name">
        <el-input v-model="searchMap.name" placeholder="员工姓名"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="fetchData">查询</el-button>
        <el-button type="primary" @click="handleEditForm('pojoForm')">新增</el-button>
        <el-button @click="$refs['searchForm'].resetFields()">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 顶部搜索框 end -->

    <!-- 员工列表start -->
    <el-table :data="staffList" height="400" style="width: 97%; margin-left:20px">
      <el-table-column type="index" label="序号" align="center"></el-table-column>
      <el-table-column prop="username" label="账号" align="center"></el-table-column>
      <el-table-column prop="name" label="姓名" align="center"></el-table-column>
      <el-table-column prop="age" label="年龄" align="center"></el-table-column>
      <el-table-column prop="mobile" label="电话" align="center"></el-table-column>
      <el-table-column prop="salary" label="薪酬" align="center"></el-table-column>
      <el-table-column prop="entrydate" label="入职日期" align="center"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row.id)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 员工列表end -->

    <!-- 底部分页 start -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-sizes="[10,20,50]"
      :page-size="size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      style="margin: 30px 0 0 290px"
    ></el-pagination>
    <!-- 底部分页 end -->

    <!-- 编辑员工窗口 start -->
    <el-dialog title="编辑员工" :visible.sync="dialogFormVisible" width="500px">
      <el-form :model="pojo" label-width="100px" :rules="rules" ref="pojoForm">
        <el-form-item label="员工账号" prop="username">
          <el-input v-model="pojo.username"></el-input>
        </el-form-item>
        <el-form-item label="员工密码" v-if="isEdit" prop="password">
          <el-input v-model="pojo.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="员工姓名" prop="name">
          <el-input v-model="pojo.name"></el-input>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input v-model="pojo.age"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="pojo.mobile"></el-input>
        </el-form-item>
        <el-form-item label="薪酬" prop="salary">
          <el-input v-model="pojo.salary"></el-input>
        </el-form-item>
        <el-form-item label="入职时间" prop="entrydate">
          <el-date-picker
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
            v-model="pojo.entrydate"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="pojo.id === null?addStaff('pojoForm'):updataStaff('pojoForm')"
        >确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑员工窗口 end -->
  </div>
</template>

<script>
// 引入接口api
import staffAPI from '@/api/staff.js';

export default {
  data () {
    return {
      staffList: [], //员工列表数据
      page: 1,
      size: 20,
      total: 0,
      searchMap: { //搜索框双向绑定数据
        username: '',
        name: ''
      },
      dialogFormVisible: false,//编辑员工对话框显示与隐藏
      pojo: { //编辑员工表单数据
        id: null,
        username: '',
        name: '',
        age: '',
        mobile: '',
        entrydate: '',
        salary: '',
        password: ''
      },
      isEdit: false, //当前编辑窗口是新增还是编辑
      rules: { //表单验证规则
        username: [{ required: true, message: '账号不能为空', trigger: 'blur' }],
        name: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
        password: [{ required: true, message: '密码不能为空', trigger: 'blur' }],
        passwordS: [{ required: true, message: '密码不能为空', trigger: 'blur' }],
        mobile: [{ required: true, message: '联系方式不能为空', trigger: 'blur' }],
      },

    }
  },
  created () {
    this.fetchData();
  },
  methods: {
    // 向后台发送请求 获取员工列表信息
    fetchData () {
      // 调用接口 获取列表数据
      staffAPI.search(this.page, this.size, this.searchMap).then(response => {
        const resp = response.data.data;
        if (response.data.flag) {
          this.staffList = resp.rows;
          this.total = resp.total;
        }
      })
    },
    // 每页显示员工数量改变
    handleSizeChange (val) {
      this.size = val;
      this.fetchData();
    },
    // 当前页码改变
    handleCurrentChange (val) {
      this.page = val;
      this.fetchData();
    },
    // 弹出员工编辑窗口 并清空表单
    handleEditForm (formName) {
      this.dialogFormVisible = true;
      // 采用异步方法 等待Dom元素加载完成 再清空表单
      this.$nextTick(() => {
        this.$refs[formName].resetFields();
      })
    },
    // 确认新增员工
    addStaff (formName) {
      // 客户端表单验证
      this.$refs[formName].validate(valid => {
        if (valid) {
          staffAPI.add(this.pojo).then(response => {
            const resp = response.data;
            if (resp.flag) {
              this.dialogFormVisible = false;
              this.fetchData();
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
      })
    },
    // 编辑员工
    handleEdit (id) {
      this.isEdit = true;
      // console.log(id);
      this.handleEditForm('pojoForm');
      // 查找员工
      staffAPI.getById(id).then(response => {
        const resp = response.data;
        if (resp.flag) {
          this.pojo = resp.data;
        }
      })
    },
    //提交员工修改请求 
    updataStaff (formName) {
      //完成编辑之后  重置中间变量
      this.isEdit = false;
      this.$refs[formName].validate(valid => {
        if (valid) {
          staffAPI.updata(this.pojo).then(response => {
            const resp = response.data;
            if (resp.flag) {
              this.dialogFormVisible = false;
              this.fetchData();
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
          });
        } else {
          return false;
        }
      })
    },
    // 删除员工
    handleDelete (id) {
      this.$confirm('是否要永久删除该员工信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 直接调用接口删除当前员工
        staffAPI.delete(id).then(response => {
          const resp = response.data;
          if (resp.flag) {
            this.fetchData();
            this.$message({
              type: 'success',
              message: resp.message
            });
          } else {
            this.$message({
              type: 'error',
              message: resp.message
            });
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
  }

}
</script>