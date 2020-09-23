// 商品接口
import request from '../utils/requset';

export default {
    // 商品查询
    search(page, size, searchMap) {
        return request({
            url: `/goods/list/search/${page}/${size}`,
            method: 'post',
            data: { searchMap }
        });
    },
    addGoods(pojo) {
        return request({
            url: '/goods',
            method: 'post',
            // 这里是想后台传输的数据
            data: { pojo }
        });
    },
    // 查找商品
    getById(id) {
        return request({
            url: `/goods/${id}`,
            method: 'post'
        })
    },
    // 提交修改商品请求
    updataGoods(pojo) {
        return request({
            url: `/goods/${pojo.id}`,
            method: 'put',
            data: { pojo }
        })
    },
    // 删除商品
    delete(id) {
        return request({
            url: `/goods/${id}`,
            method: 'delete'
        });
    }

}