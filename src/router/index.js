import Vue from "vue";
import VueRouter from "vue-router";

// 引入登录页面组件
import Login from '../views/login/index.vue';
// 引入主页布局路由组件 
import Layout from '@/components/layout.vue';
// 引入导航子组件
import Home from '@/views/home';
import Member from '@/views/member';
import Staff from '@/views/staff';
import Supplier from '@/views/supplier';
import Goods from '@/views/goods';

Vue.use(VueRouter);

const router = new VueRouter({
    // mode: "history",  //历史路由  使用历史路由 没有哈希值 #    不使用 url地址中会包含 #
    routes: [{
            path: '/login', //路由请求地址
            name: 'login', //路由名称
            component: Login //路由组件
        }, {
            path: '/', //  /代表的就是layout主容器
            name: 'index',
            component: Layout, //路由组件
            children: [{ //子路由(用来将子组件渲染到layout父组件上)
                path: '/home',
                meta: { title: '首页' },
                component: Home
            }],
            redirect: '/home', //页面重定向到首页(每次进入时)
        }, {
            // 这里通过访问  /member来进行渲染layout主页  再通过子路由将内容渲染到layout子组件main上实现效果
            path: '/member',
            component: Layout, //注意这里的组件应当为 全局父组件
            children: [{
                path: '/', //  /member/这个是绝对路径
                component: Member,
                meta: { title: '会员管理' }
            }]
        }, {
            path: '/supplier',
            component: Layout,
            children: [{
                path: '/',
                meta: { title: '供应商管理' },
                component: Supplier
            }]
        },
        {
            path: '/staff',
            component: Layout,
            children: [{
                path: '/',
                meta: { title: '员工管理' },
                component: Staff
            }]
        }, {
            path: '/goods',
            component: Layout,
            children: [{
                path: '/',
                meta: { title: '商品管理' },
                component: Goods
            }]
        }
    ]
});

export default router;