<template>
  <div class="main">
    <!-- 将子组件渲染到页面 -->
    <app-link v-show="$route.path!=='/home'"></app-link>
    <!-- 将这里设置为layout主容器中的左侧导航组件的渲染出口 -->
    <router-view></router-view>
  </div>
</template>

<script>
// 导入子组件
import AppLink from './AppLink';
export default {
  components: {
    AppLink
  }
}
</script>

<style scoped>
.el-breadcrumb {
  margin: 20px;
  border-radius: 10px;
  padding: 20px;
  padding-left: 35px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
}
.el-breadcrumb::before {
  position: absolute;
  top: 37px;
  left: 45px;
  content: '';
  width: 3px;
  height: 20px;
  background-color: #f66;
}
</style>
