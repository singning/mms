<template>
  <div>
    <!-- 
      父组件向子组件传递参数 ： 在父组件中的 子组件标签上 绑定自定义属性 向自定义属性中传递想要传递的参数
      在子组件中使用props属性来接受对象 对象中声明父组件传递进来的参数的类型即可 这里就可以使用父组件传递捡来的参数

      子组件向父组件传递参数：  在父组件中的 子组件标签上 添加自定义事件 传递一个方法过去 
      在子组件想要传递的参数那里 使用this.$emit('父组件中定义的自定义事件名', 要传递的参数)
      在父组件中的方法定义中 将自定义事件中的方法定义  注意方法的参数必须和子组件传递过来的参数一致 否则拿不到
    -->

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
        <el-input v-model="searchMap.name" placeholder="商品名称"></el-input>
      </el-form-item>
      <el-form-item prop="code">
        <el-input v-model="searchMap.code" placeholder="商品编码"></el-input>
      </el-form-item>
      <el-form-item prop="supplierName">
        <!-- 给当前输入框设置为只读模式 不允许用户写入 -->
        <!-- 注意这里的input属于组件输入框 所以想要添加原生事件到上面 需要使用@click.native的方法 -->
        <el-input
          v-model="searchMap.supplierName"
          placeholder="选择供应商"
          readonly
          @click.native="dialogVisible=true"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <!-- 重新调用接口查询数据 -->
        <el-button type="primary" @click="fetchData" class="el-icon-search">查 询</el-button>
        <el-button type="primary" class="el-icon-edit" @click="handleAdd">新 增</el-button>
        <!-- 这里的表单name必须在上边form表单上添加ref属性后才可以找到 -->
        <el-button @click="resetForm('searchForm')" class="el-icon-refresh">重 置</el-button>
      </el-form-item>
    </el-form>
    <!-- 顶部搜索框 end -->

    <!-- 商品列表  start -->
    <el-table :data="goodsList" height="400" style="margin: 0 auto; width: 97%;">
      <!-- 给字段添加了type="index"属性之后 会自动产生序号 从1开始递增 -->
      <el-table-column type="index" label="序号" align="center"></el-table-column>
      <el-table-column prop="name" label="商品名称" align="center"></el-table-column>
      <el-table-column prop="code" label="商品编码" align="center"></el-table-column>
      <el-table-column prop="spec" label="商品规格" align="center"></el-table-column>
      <el-table-column prop="retailPrice" label="零售价" align="center"></el-table-column>
      <el-table-column prop="pruchasePrice" label="进货价" align="center"></el-table-column>
      <el-table-column prop="storageNum" label="库存数量" align="center"></el-table-column>
      <el-table-column prop="supplierName" label="供应商" align="center"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <!-- scope.$index  当前选择的序号
            scope.row 当前选择的行
          -->
          <el-button size="mini" @click="handleEdit(scope.row.id)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 商品列表  end -->

    <!-- 底部分页功能 start -->
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
    <!-- 底部分页功能 end -->

    <!-- 顶部搜索区域 供应商模态框 start -->
    <el-dialog title="选择供应商" :visible.sync="dialogVisible" width="30%" top="30px">
      <!-- 供应商子组件渲染出口 -->
      <!-- 父组件向子组件中传递参数  方法之一 在子组件模板标签上 绑定自定义属性 传递参数过去 子组件通过初始化数据中的props属性来接受参数 -->
      <!-- 这里传递一个属性过去 传递过去的属性值为true -->
      <supplier :isDialog="true" @supplier-value="supplierVal"></supplier>
    </el-dialog>
    <!-- 顶部搜索区域 供应商模态框 end -->

    <!-- 新增商品弹出框start -->
    <el-dialog title="商品编辑" :visible.sync="dialogFormVisible" top="150px" width="500px">
      <el-form :model="pojo" label-width="100px" :rules="rules" ref="pojoForm">
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="pojo.name"></el-input>
        </el-form-item>
        <el-form-item label="商品编码" prop="code">
          <el-input v-model="pojo.code"></el-input>
        </el-form-item>
        <el-form-item label="商品规格" prop="spec">
          <el-input v-model="pojo.spec"></el-input>
        </el-form-item>
        <el-form-item label="零售价" prop="retailPrice">
          <el-input v-model="pojo.retailPrice"></el-input>
        </el-form-item>
        <el-form-item label="进货价" prop="pruchasePrice">
          <el-input v-model="pojo.pruchasePrice"></el-input>
        </el-form-item>
        <el-form-item label="库存数量" prop="storageNum">
          <el-input v-model="pojo.storageNum"></el-input>
        </el-form-item>
        <el-form-item label="供应商" prop="supplierName">
          <!-- 表单组件上不能直接使用原生事件 例如点击双击 需要使用 @click.native="方法名"的方式进行添加事件 -->
          <el-input
            v-model="pojo.supplierName"
            readonly
            @click.native="editFormShow"
            placeholder="选择供应商"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <!-- 这里点击事件触发的方法上边要传入表单id  进行表单验证 -->
        <el-button
          type="primary"
          @click="pojo.id===null?addGoods('pojoForm'):updata('pojoForm')"
        >确 定</el-button>
      </div>
    </el-dialog>
    <!-- 新增商品弹出框end -->
  </div>
</template>

<script>
//引入商品接口api
import goodsAPI from '@/api/goods.js';
// 引入供应商组件 作为当前商品组件的子组件
import Supplier from '../supplier';


export default {
  data () {
    return {
      goodsList: [],//商品列表数据
      searchMap: { //搜索框搜索条件
        id: null,
        name: '',
        code: '',
        supplierName: ''
      },
      page: 1,
      size: 20,
      total: 0,
      dialogVisible: false, //供应商选择 弹出框
      dialogFormVisible: false, //商品编辑窗口
      pojo: { //新增商品数据
        name: '',
        code: '',
        spec: '',
        retailPrice: '',
        pruchasePrice: '',
        storageNum: '',
        supplierName: '',
        id: null
      },
      rules: {//新增商品表单验证规则
        name: [{ required: true, message: '商品名称不能为空', trigger: 'blur' }],
        code: [{ required: true, message: '商品编码不能为空', trigger: 'blur' }],
        retailPrice: [{ required: true, message: '零售价不能为空', trigger: 'blur' }],
        pruchasePrice: [{ required: true, message: '进货价不能为空', trigger: 'blur' }],
      },
      isEdit: false, //设置中间条件进行判断当前选择供应商的是 编辑商品 还是 搜索商品
    }
  },
  // 想要在template中使用子组件 就需要先注册子组件
  components: {
    Supplier,
  },
  // 初始化数据
  created () {
    this.fetchData();
  },
  methods: {
    // 抓取商品
    fetchData () {
      // 调用接口获取数据
      goodsAPI.search(this.page, this.size, this.searchMap).then(response => {
        const resp = response.data.data;
        this.goodsList = resp.rows;
        this.total = resp.total;
      });
    },
    // 编辑商品
    handleEdit (id) {
      // console.log(id);
      // 弹出模态框并清空表单
      this.handleAdd();
      goodsAPI.getById(id).then(response => {
        const resp = response.data;
        if (resp.flag) {
          // 将查找到的信息回显
          this.pojo = resp.data;
        } else {
          this.$message({
            type: 'error',
            message: resp.message
          })
        }
      });
    },
    //确认更新商品 
    updata (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          goodsAPI.updataGoods(this.pojo).then(response => {
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
    // 删除商品
    handleDelete (id) {
      this.$confirm('是否要永久删除该商品?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        goodsAPI.delete(id).then(response => {
          const resp = response.data;
          if (resp.flag) {
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
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    // 页码大小改变触发
    handleSizeChange (val) {
      // 页码大小改变
      this.size = val;
      // 重新抓取数据
      this.fetchData();
    },
    // 当前页码改变时触发
    handleCurrentChange (val) {
      this.page = val;
      this.fetchData();
    },
    // 新增商品中点击选择供应商时触发的事件
    editFormShow () {
      this.dialogVisible = true;
      // 表示这是在编辑商品
      this.isEdit = true;
    },
    // 新增商品弹出框显示(每次都清空表单)
    handleAdd () {
      this.dialogFormVisible = true;
      // 清空新增商品表单 这里使用异步操作  等待Dom加载完成之后 再清空表单
      this.$nextTick(() => {
        this.$refs['pojoForm'].resetFields();
      })
    },
    // 确认新增商品
    addGoods (formName) {
      // 客户端表单验证
      this.$refs[formName].validate(valid => {
        if (valid) {
          goodsAPI.addGoods(this.pojo).then(response => {
            const resp = response.data;
            if (resp.flag) {
              // 隐藏新增商品弹出框
              this.dialogFormVisible = false;
              // 重新刷新数据
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
        } else {
          return false;
        }
      })
    },
    // 重置搜索框
    resetForm (formName) {
      // 重置注意事项  在方法中定义 需要使用this 而在模板中直接使用 不需要加this就可以找到 加了this反而找不到
      // 注意要将清空的表单项 添加prop属性 否则清空方法没有效果
      this.$refs[formName].resetFields();
    },
    // 自定义事件 用来接收子组件传递过来的参数
    supplierVal (currentRow) {
      // console.log('parent', currentRow);
      if (this.isEdit) {
        // 如果是编辑商品
        // 获取供应商名称和供应商id 用于后台查询数据
        this.pojo.supplierName = currentRow.name;
        this.pojo.id = currentRow.id;
      } else {
        // 如果是搜索商品
        // 获取供应商名称和供应商id 用于后台查询数据
        this.searchMap.supplierName = currentRow.name;
        this.searchMap.id = currentRow.id;
      }
      // 将中间条件重置
      this.isEdit = false;
      // 隐藏模态框
      this.dialogVisible = false;
    },



  },

}

</script>