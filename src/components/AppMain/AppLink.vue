<template>
  <!-- 当路由对象路径为首页路径时,不显示面包屑导航 -->
  <el-breadcrumb separator="/">
    <!-- $route.meta.title就是设置在路由配置中的选项 -->
    <el-breadcrumb-item :to="{ path: $route.path }">{{$route.meta.title}}</el-breadcrumb-item>
  </el-breadcrumb>
</template>