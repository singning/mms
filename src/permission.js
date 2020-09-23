/* 
路由访问权限
利用Vue Router中的钩子函数 beforeEach进行拦截路由请求

router.beforeEach((to, from, next) => {
  // ...
})
to 将要与的路由地址  
from 当前所在的路由地址
next 回调函数
next() 代表权限通过 直接到达 to的地址
next({path: '/'}) 没有权限 去到path提供的地址

1.判断当前本地存储中是否存在token
1.1如果存在token 判断是否存在用户个人信息 如果存在就直接跳转  不存在就利用token向后台发送请求 获取用户信息
1.2如果能够获取到用户信息 就跳转到用户访问的地址页面 如果获取不到用户信息 说明token过期失效 移除token让用户继续登陆

2.如果没有token 不管访问那个路由地址 都要重定向回登录页面 进行登录

注意在实现逻辑的时候 一定要将 用户想访问的页面是否就是 /login  从而进行分支判断
*/

// 导入路由对象
import router from './router/index';
// 导入获取用户信息接口
import { UserInfo } from '@/api/login';

// 利用钩子函数拦截路由请求
router.beforeEach((to, from, next) => {
    // 从本地存储中获取token
    const token = localStorage.getItem('mms-token');
    // 判断是否可以获取到token
    if (!token) {
        // 如果没有获取到token  直接重定向回登录页面
        if (to.path !== '/login') {
            next('/login');
        } else {
            // 如果用户访问的就是登录页面 直接去到登录页面
            next();
        }
    } else { // 如果获取到了token
        // 如果用户想去的就是登录页面
        if (to.path === '/login') {
            next();
        } else {
            // 判断是否可以获取到用户信息
            const user = localStorage.getItem('mms-userInfo');
            if (user) {
                // 如果存在用户信息 直接跳转到路由地址即可
                next();
            } else {
                // 如果没有获取到用户信息  调取接口获取用户信息
                UserInfo(token).then(response => {
                    const resp = response.data;
                    if (resp.flag) {
                        // 如果获取到了用户信息 跳转到用户访问界面
                        next();
                    } else {
                        // 如果没有获取到用户信息 继续回到登录界面并提示用户重新登录 刷新token
                        next('/login');
                        this.$message({
                            type: 'warning',
                            message: '登录信息过期,请重新登录'
                        })
                    }
                });
            }
        }
    }
});