<template>
  <div>
    <!-- 顶部会员查询区域 -->
    <!-- ref属性就是表单name值提交表单时所必须的内容 -->
    <!-- 注意给表单绑定属性时 需要用到v-bind / :  通过这种方式定义的属性才可以变化 -->
    <el-form
      ref="searchForm"
      :inline="true"
      :model="searchMap"
      class="demo-form-inline"
      style="margin: 0 20px;"
    >
      <el-form-item prop="cardNum">
        <el-input v-model="searchMap.cardNum" placeholder="会员卡号"></el-input>
      </el-form-item>
      <el-form-item prop="name">
        <el-input v-model="searchMap.name" placeholder="会员名称"></el-input>
      </el-form-item>
      <el-form-item prop="payType">
        <el-select v-model="searchMap.payType" placeholder="支付类型" style="width: 120px">
          <el-option
            v-for="item in payTypeOptions"
            :label="item.name"
            :value="item.type"
            :key="item.type"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="birthday">
        <el-date-picker
          type="date"
          placeholder="会员生日"
          value-format="yyyy-MM-dd"
          v-model="searchMap.birthday"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <!-- 重新调用接口查询数据 -->
        <el-button type="primary" @click="fetchData" class="el-icon-search">查 询</el-button>
        <el-button type="primary" class="el-icon-edit" @click="handleAdd">新 增</el-button>
        <!-- 这里的表单name必须在上边form表单上添加ref属性后才可以找到 -->
        <el-button @click="resetForm('searchForm')" class="el-icon-refresh">重 置</el-button>
      </el-form-item>
    </el-form>

    <!-- 会员列表区域 -->
    <!-- :data="memberList"该属性 绑定的是 表单数据 -->
    <!-- el-table 添加border就是不固定表头带边框  去掉就是固定表头 -->
    <el-table :data="memberList" height="400" style="margin: 0 auto; width: 97%;">
      <!-- 给字段添加了type="index"属性之后 会自动产生序号 从1开始递增 -->
      <el-table-column type="index" label="序号" align="center"></el-table-column>
      <el-table-column prop="cardNum" label="会员卡号" align="center"></el-table-column>
      <el-table-column prop="name" label="会员姓名" width="80px" align="center"></el-table-column>
      <el-table-column prop="birthday" label="会员生日" align="center"></el-table-column>
      <el-table-column prop="phone" label="联系电话" width="160px" align="center"></el-table-column>
      <el-table-column prop="integral" label="积分" width="60px" align="center"></el-table-column>
      <el-table-column prop="money" label="充值金额" width="120px" align="center"></el-table-column>
      <el-table-column prop="payType" label="支付方式" width="120px" align="center">
        <!-- 添加内容 可以使用 template标签 element-ui内置的 -->
        <template slot-scope="scope">{{scope.row.payType | payTypeFilter(scope.row.payType)}}</template>
      </el-table-column>
      <el-table-column prop="address" label="地址" align="center"></el-table-column>
      <el-table-column label="操作" width="150px" align="center">
        <template slot-scope="scope">
          <!-- scope.$index  当前选择的序号
            scope.row 当前选择的行
          -->
          <el-button size="mini" @click="handleEdit(scope.row.id)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 底部分页区域 -->
    <!-- 这里注意 不能使用初始化数据的方法fetchData来抓取数据 因为每次改变页码之后 需要重新传递参数 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-sizes="[10,20,50]"
      :page-size="size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      style="margin: 15px 280px;"
    ></el-pagination>

    <!-- 新增会员弹出框区域 -->
    <el-dialog
      title="会员编辑"
      :visible.sync="dialogFormVisible"
      top="20px"
      width="500px"
      style="height: 800px"
    >
      <el-form :model="pojo" label-width="90px" :rules="rules" ref="pojoForm">
        <el-form-item label="会员卡号" prop="cardNum">
          <el-input v-model="pojo.cardNum"></el-input>
        </el-form-item>
        <el-form-item label="会员姓名" prop="name">
          <el-input v-model="pojo.name"></el-input>
        </el-form-item>
        <el-form-item label="会员生日" prop="birthday">
          <el-date-picker
            type="date"
            placeholder="会员生日"
            value-format="yyyy-MM-dd"
            v-model="pojo.birthday"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="联系方式" prop="phone">
          <el-input v-model="pojo.phone"></el-input>
        </el-form-item>
        <el-form-item label="开卡金额" prop="money">
          <el-input v-model="pojo.money"></el-input>
        </el-form-item>
        <el-form-item label="当前积分" prop="integral">
          <el-input v-model="pojo.integral"></el-input>
        </el-form-item>
        <el-form-item label="支付类型" prop="payType">
          <el-select v-model="pojo.payType" placeholder="支付类型">
            <el-option
              v-for="item in payTypeOptions"
              :label="item.name"
              :value="item.type"
              :key="item.type"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="会员地址" prop="address">
          <el-input v-model="pojo.address" type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <!-- 这里点击事件触发的方法上边要传入表单id  进行表单验证 -->
        <el-button
          type="primary"
          @click=" pojo.id !== null?updataMember('pojoForm'):addMember('pojoForm') "
        >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 导入Api(所有api方法都可用)
import memberAPI from '@/api/member';

// 定义一个全局数组变量  因为过滤器不能出现this 所以定义在data中的数据在过滤器中拿不到
const payTypeOptions = [
  { type: '1', name: '现金' },
  { type: '2', name: '微信' },
  { type: '3', name: '支付宝' },
  { type: '4', name: '银行卡' }];

export default {
  data () {
    return {
      memberList: [],
      total: 0,
      page: 1,
      size: 10,
      searchMap: {  //将表单属性初始化  放置表单重置后输入内容失效
        cardNum: '',
        name: '',
        payType: '',
        birthday: ''
      },
      payTypeOptions, //将全局变量注册为初始化数据
      dialogFormVisible: false, //弹出框的显示隐藏状态
      pojo: { //新增表单的 双向绑定id
        id: null,
        cardNum: '',
        name: '',
        phone: '',
        address: '',
        money: '',
        integral: '',
        payType: '',
        birthday: ''
      },
      rules: { //新增会员表单的验证规则
        cardNum: [{ required: true, message: '卡号不能为空', trigger: 'blur' }],
        name: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
        money: [{ required: true, message: '开卡金额不能为空', trigger: 'blur' }],
        payType: [{ required: true, message: '支付方式不能为空', trigger: 'blur' }],
        phone: [{ required: true, message: '联系方式不能为空', trigger: 'blur' }],
      }
    }
  },
  // 初始化数据
  created () {
    this.fetchData();
  },
  methods: {
    // 获取数据
    fetchData () {
      // memberAPI.getMember().then(response => {
      memberAPI.search(this.page, this.size, this.searchMap).then(response => {
        const resp = response.data;
        this.memberList = resp.data.rows;
        this.total = resp.data.total;
      });
    },
    // 编辑会员(通过id查询到当前要修改的会员信息)
    handleEdit (id) {
      // 显示遮罩层
      this.handleAdd();
      // 向后台发送请求 获取会员信息
      memberAPI.getById(id).then(response => {
        const resp = response.data;
        // 将查询到的数据渲染到页面表单中
        this.pojo = resp.data;
      })
    },
    // 确认修改会员信息
    updataMember (formName) {
      // 客户端表单规则验证
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 验证通过
          memberAPI.updataMember(this.pojo).then(response => {
            const resp = response.data;
            if (resp.flag) {
              // 重新渲染页面
              this.fetchData();
              // 关闭遮罩层
              this.dialogFormVisible = false;
              this.$message({
                type: 'success',
                message: resp.message
              })
            } else {
              this.$message({
                type: 'warning',
                message: '修改失败,请稍后再试'
              })
            }
          });
        } else {
          return false; //客户端拦截 不向后台发送请求
        }
      })
    },
    // 删除会员
    handleDelete (id) {
      this.$confirm('是否永久删除该会员？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => { //确认删除
        memberAPI.deleteMember(id).then(response => {
          const resp = response.data;
          if (resp.flag) {
            // 删除成功 刷新页面
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
      }).catch(() => { //取消删除
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    //底部页码  改变每页显示条数 
    handleSizeChange (val) {
      this.size = val;
      // 重新获取数据
      this.fetchData();
    },
    //底部页码  改变当前页
    handleCurrentChange (val) {
      this.page = val;
      this.fetchData();
    },
    // 顶部重置搜索框方法
    resetForm (formName) {
      // element-ui内置方法
      this.$refs[formName].resetFields();
    },
    // 新增会员功能
    addMember (formName) {
      // 表单验证
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 客户端表单验证通过
          memberAPI.addMember(this.pojo).then(response => {
            const resp = response.data;
            if (resp.flag) {
              // 新增成功 关闭弹出框 重新请求数据
              this.dialogFormVisible = false;
              this.fetchData();
              this.$message({
                type: 'success',
                message: resp.message
              })
            } else {
              // 新增失败
              this.dialogFormVisible = false;
              this.$message({
                type: 'error',
                message: '新增会员失败,请稍后再试'
              })
            }
          })
        } else {
          // 验证失败
          return false;  //直接在客户端进行拦截提交请求
        }
      });
    },
    // 弹出编辑会员 遮罩层(清空表单数据)
    handleAdd () {
      this.dialogFormVisible = true;
      // 使用vue实例中的方法 vm.$nextTick(() => {}) 实现异步操作
      // 当Dom加载完成之后立即触发回调函数
      this.$nextTick(() => {
        // 在当前表单Dom加载完成之后  重置表单
        this.$refs['pojoForm'].resetFields();
      })
    },


  },
  // 添加过滤器 用来生成支付类型
  filters: {
    // 传入一个参数 要过滤的值
    payTypeFilter (type) {
      // 在数组中查找一个符合条件的对象  对象type属性和传入值相同
      const obj = payTypeOptions.find(payObj => payObj.type === type);
      // 将符合条件的对象name属性返回回去  完成过滤效果
      return obj ? obj.name : null;
    }
  },
}
</script>

<style scoped>
.el-table {
  text-align: center;
}
</style>

