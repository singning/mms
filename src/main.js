import Vue from "vue";

// 引入element-ui
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import App from "./App.vue";
import router from "./router";

// 将设置的权限拦截设置为全局作用
import './permission.js';

//element-ui是插件 所以这里要使用插件 
Vue.use(ElementUI);

// 生产环境下不需要 代码警告  而开发环境下需要警告来帮助我们调试错误
Vue.config.productionTip = process.env.NODE_ENV === 'production';

// console.log(process.env.NODE_ENV);
// console.log(process.env.VUE_APP_SERVER_URL);
// console.log(process.env.VUE_APP_BASE_API);

// 创建vue实例对象
new Vue({
    router,
    render: h => h(App)
}).$mount("#app");