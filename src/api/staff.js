// 员工页面接口

import request from '../utils/requset';

export default {
    // 员工列表分页查询
    search(page, size, searchMap) {
        return request({
            method: 'post',
            url: `/staff/list/search/${page}/${size}`,
            data: { searchMap }
        });
    },
    // 新增员工
    add(pojo) {
        return request({
            method: 'post',
            url: '/staff',
            data: { pojo }
        });
    },
    //查找员工
    getById(id) {
        return request({
            method: 'post',
            url: `/staff/${id}`
        })
    },
    // 更新员工信息
    updata(pojo) {
        return request({
            method: 'put',
            url: `/staff/${pojo.id}`,
            data: { pojo }
        });
    },
    // 删除当前员工
    delete(id) {
        return request({
            method: 'delete',
            url: `/staff/${id}`
        });
    }

}