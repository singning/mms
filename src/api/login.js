// 登录功能路由
// import request from '@/utils/request';
import request from '../utils/requset';
// 导出方法

// 登录验证 获取token
export function login(username, password) {
    return request({
        method: 'post',
        url: '/user/login',
        data: {
            username,
            password
        }
    })
};

// 根据token 获取用户信息
export function UserInfo(token) {
    return request({
        method: 'get',
        url: `/user/info/${token}`
    })
};

// 退出登录
export function logout(token) {
    return request({
        method: 'post',
        url: '/user/logout',
        data: {
            token
        }
    })
};