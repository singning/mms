<template>
  <!-- 这里面添加 v-if="!isDialog"属性的都是在当前页面显示 而在商品组件中隐藏的内容
    利用了父子组件间通信的原理 props接受数据实现的 
  -->
  <div>
    <!-- 顶部搜索框 start -->
    <el-form
      ref="searchForm"
      :inline="true"
      :model="searchMap"
      class="demo-form-inline"
      style="margin: 0 20px;"
    >
      <!-- 在 el-form-item 标签上添加prop属性是为了 清空时能够生效-->
      <el-form-item prop="name">
        <el-input v-model="searchMap.name" placeholder="供应商名称"></el-input>
      </el-form-item>
      <el-form-item prop="linkman" v-if="!isDialog">
        <el-input v-model="searchMap.linkman" placeholder="联系人"></el-input>
      </el-form-item>
      <el-form-item prop="phone" v-if="!isDialog">
        <el-input v-model="searchMap.phone" placeholder="联系电话"></el-input>
      </el-form-item>
      <el-form-item>
        <!-- 重新调用接口查询数据 -->
        <el-button type="primary" @click="fetchData" class="el-icon-search">查 询</el-button>
        <el-button type="primary" class="el-icon-edit" @click="handleAdd" v-if="!isDialog">新 增</el-button>
        <!-- 这里的表单name必须在上边form表单上添加ref属性后才可以找到 -->
        <el-button @click="resetForm('searchForm')" class="el-icon-refresh" v-if="!isDialog">重 置</el-button>
      </el-form-item>
    </el-form>
    <!-- 顶部搜索框 end -->

    <!-- 供应商列表  start -->
    <!-- highlight-current-row给表单添加这个属性 表单变为可单选形式
      @current-change="chooseCurrentChange"此时选中某一项会触发该事件  传递两个参数 第一个newObj第二个oldObj

      动态切换 供应商列表的可选与不可选状态  利用属性绑定的方法实现
    -->
    <el-table
      :highlight-current-row="isDialog"
      @current-change="chooseCurrentChange"
      :data="supplierList"
      height="400"
      border
      style="margin: 0 auto; width: 97%;"
    >
      <!-- 给字段添加了type="index"属性之后 会自动产生序号 从1开始递增 -->
      <el-table-column type="index" label="序号" align="center"></el-table-column>
      <el-table-column prop="name" label="供应商名称" align="center"></el-table-column>
      <el-table-column prop="linkman" label="联系人" align="center"></el-table-column>
      <el-table-column prop="mobile" label="联系电话" align="center" v-if="!isDialog"></el-table-column>
      <el-table-column prop="remake" label="备注" align="center" v-if="!isDialog"></el-table-column>
      <el-table-column label="操作" align="center" v-if="!isDialog">
        <template slot-scope="scope">
          <!-- scope.$index  当前选择的序号
            scope.row 当前选择的行
          -->
          <el-button size="mini" @click="handleEdit(scope.row.id)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 供应商列表  end -->

    <!-- 底部分页功能 start -->
    <!-- 
      layout="total, sizes, prev, pager, next, jumper"这个是针对于供应商一个组件显示确定的内容
      想要动态条件判断显示那些内容  需要用到v-bind绑定属性的方式实现 因为是动态的 所以不能直接属性名:属性值
      而是要 :属性名:属性值
      如果是商品组件访问当前供应商组件  页码部分就只显示上一页下一页和当前页码的功能
    -->
    <el-pagination
      :layout="!isDialog?'total, sizes, prev, pager, next, jumper':'prev, pager, next' "
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-sizes="[10,20,50]"
      :page-size="size"
      :total="total"
      :style="!isDialog?'margin: 15px 280px;':'margin: 15px 20px;' "
    ></el-pagination>
    <!-- 底部分页功能 end -->

    <!-- 新增供应商弹出框start -->
    <el-dialog
      title="供应商编辑"
      :visible.sync="dialogFormVisible"
      top="150px"
      width="500px"
      v-if="!isDialog"
    >
      <el-form :model="pojo" label-width="100px" :rules="rules" ref="pojoForm">
        <el-form-item label="供应商名称" prop="name">
          <el-input v-model="pojo.name"></el-input>
        </el-form-item>
        <el-form-item label="联系人" prop="linkman">
          <el-input v-model="pojo.linkman"></el-input>
        </el-form-item>
        <el-form-item label="联系方式" prop="mobile">
          <el-input v-model="pojo.mobile"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remake">
          <el-input v-model="pojo.remake" type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <!-- 这里点击事件触发的方法上边要传入表单id  进行表单验证 -->
        <el-button
          type="primary"
          @click="pojo.id === null? addMember('pojoForm'):updataSupplier('pojoForm')"
        >确 定</el-button>
      </div>
    </el-dialog>
    <!-- 新增供应商弹出框end -->
  </div>
</template>

<script>

// 引入接口
import supplierAPI from '@/api/supplier.js';

export default {
  // 接受父组件传递进来的参数
  props: {
    // 这里的参数为布尔类型  默认为false 传递进来的为true
    isDialog: Boolean
  },
  data () {
    return {
      supplierList: [], //供应商数组
      searchMap: { //查询表单对象
        name: '',
        linkman: '',
        phone: ''
      },
      page: 1, //初始页码
      size: 20, //页码大小
      total: 0, //总页数
      dialogFormVisible: false, //遮罩层是否显示
      pojo: { //新增会员表单数据
        id: null,
        name: '',
        linkman: '',
        mobile: '',
        remake: ''
      },
      rules: {
        name: [{ required: true, message: '供应商名称不能为空', trigger: 'blur' }],
        linkman: [{ required: true, message: '联系人不能为空', trigger: 'blur' }],
        mobile: [{ required: true, message: '联系方式不能为空', trigger: 'blur' }],
      }
    }
  },
  // 钩子函数 用来初始化页面
  created () {
    this.fetchData();
  },
  methods: {
    // 获取供应商列表信息
    fetchData () {
      // supplierAPI.getList().then(response => {
      supplierAPI.search(this.page, this.size, this.searchMap).then(response => {
        const resp = response.data;
        if (resp.flag) {
          this.supplierList = resp.data.rows;
          // 将查询到的页码赋值
          this.total = resp.data.total;
        } else {
          this.$message({
            type: 'error',
            message: resp.message
          })
        }
      })
    },
    // 编辑供应商
    handleEdit (id) {
      // 清空表单并向后台发送请求
      this.handleAdd();
      supplierAPI.getById(id).then(response => {
        const resp = response.data;
        this.pojo = resp.data;
      });
    },
    // 确认修改供应商
    updataSupplier (formName) {
      // 对表单进行验证
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 验证通过向服务器端发送请求
          supplierAPI.updata(this.pojo).then(response => {
            const resp = response.data;
            if (resp.flag) {
              this.dialogFormVisible = false;
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
          });
        } else {
          // 在客户端阻止向服务器端发送请求
          return false;
        }
      });
    },
    // 删除供应商
    handleDelete (id) {
      this.$confirm('您确认要永久删除该供应商信息？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 验证通过向服务器端发送请求
        supplierAPI.delete(id).then(response => {
          const resp = response.data;
          if (resp.flag) {
            this.dialogFormVisible = false;
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
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    // 弹出新增供应商遮罩层(每次弹出遮罩层之前就需要先清空表单)
    handleAdd () {
      this.dialogFormVisible = true;
      // 重置表单
      // 需要等待dom加载完成之后才可以重置表单
      this.$nextTick(() => {
        this.$refs['pojoForm'].resetFields();
      })
    },
    // 新增供应商后台响应
    addMember (formName) {
      // 先在客户端进行规则校验
      this.$refs[formName].validate(valid => {
        if (valid) {
          supplierAPI.addSupplier(this.pojo).then(response => {
            const resp = response.data;
            if (resp.flag) {
              // 隐藏遮罩层 重新抓取数据
              this.dialogFormVisible = false;
              this.fetchData();
              this.$message({
                type: 'success',
                message: resp.message
              })
            } else {
              this.$message({
                type: 'warning',
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
      // 调用方法重置表单
      this.$refs[formName].resetFields();
    },
    // 页码大小改变
    handleSizeChange (val) {
      // 将页码大小重新赋值
      this.size = val;
      //重新发送请求刷新数据
      this.fetchData();
    },
    // 当前页码改变
    handleCurrentChange (val) {
      this.page = val;
      this.fetchData();
    },
    //供应商列表单选选中时触发 
    chooseCurrentChange (currentRow, oldRow) {
      // console.log(currentRow);
      this.$emit('supplier-value', currentRow);
    }




  }



}
</script>
