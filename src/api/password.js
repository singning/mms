// 修改棉麻api接口

import request from '../utils/requset';

export default {
    // 判断密码是否正确  向后台传入当前用户的id和原始密码
    checkPwd(userId, password) {
        return request({
            method: 'post',
            url: '/user/pwd',
            data: {
                userId,
                password
            }
        })
    },
    // 更新密码 向后台传入当前用户的id和修改后的密码
    updataPwd(userId, password) {
        return request({
            method: 'put',
            url: '/user/pwd',
            data: {
                userId,
                password
            }
        })
    }
}