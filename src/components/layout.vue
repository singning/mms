<!-- vue组件 首页模板布局 -->

<template>
  <div>
    <!-- 使用子组件 -->
    <!-- 头部 -->
    <app-header></app-header>
    <!-- 侧边栏 -->
    <app-aside></app-aside>
    <!-- 主区域 -->
    <app-main></app-main>
  </div>
</template>

<script>

// 导入子组件
import AppHeader from '../components/AppHeader';
import AppAside from '../components/AppAside';
import AppMain from '../components/AppMain';

export default {
  // 注册子组件
  components: { AppHeader, AppAside, AppMain }
}
</script>


<style scoped>
/* 顶部区域 */
.header {
  /* 添加了相对定位 如果左右边距均为0 就是拉满整个区域 */
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  background-color: rgb(73, 78, 82);
  height: 50px;
  /* 设置了行高 可以省略高度 */
  line-height: 50px;
}
.aside {
  position: absolute;
  top: 50px;
  left: 0;
  bottom: 0;
  width: 230px;
  background-color: rgb(97, 105, 97);
  /* 设置自动出现的滚动条(y轴) */
  overflow-y: auto;
}
.main {
  position: absolute;
  top: 50px;
  left: 230px;
  right: 0;
  bottom: 0;
  /* background-color: #eee; */
  /* 设置自动出现的滚动条(y轴) */
  overflow-y: auto;
}
</style>