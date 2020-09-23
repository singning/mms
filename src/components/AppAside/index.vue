<template>
  <div class="aside">
    <el-menu
      default-active="/home"
      class="el-menu-vertical-demo"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
      :router="true"
    >
      <el-menu-item index="/home">
        <i class="el-icon-house"></i>
        <span slot="title">首页</span>
      </el-menu-item>
      <el-menu-item index="/member/">
        <i class="el-icon-s-custom"></i>
        <span slot="title">会员管理</span>
      </el-menu-item>
      <el-menu-item index="/supplier/">
        <i class="el-icon-truck"></i>
        <span slot="title">供应商管理</span>
      </el-menu-item>
      <el-menu-item index="/goods/">
        <i class="el-icon-shopping-cart-1"></i>
        <span slot="title">商品管理</span>
      </el-menu-item>
      <el-menu-item index="/staff/">
        <i class="el-icon-money"></i>
        <span slot="title">员工管理</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<style scoped>
.el-menu-item {
  border: none;
}
</style>