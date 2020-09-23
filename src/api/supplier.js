// 引入封装的axios
import request from '../utils/requset';

export default {

    // 查询供应商列表
    getList() {
        return request({
            url: '/supplier/list',
            method: 'get'
        });
    },
    //搜索 供应商
    search(page, size, searchMap) {
        return request({
            url: `/supplier/list/search/${page}/${size}`,
            method: 'post',
            data: { searchMap }
        })
    },
    // 新增供应商
    addSupplier(pojo) {
        return request({
            url: '/supplier',
            method: 'post',
            data: { pojo }
        })
    },
    // 根据id查询供应商信息
    getById(id) {
        return request({
            url: `/supplier/${id}`,
            method: 'post'
        })
    },
    // 提交修改请求
    updata(pojo) {
        return request({
            url: `/supplier/${pojo.id}`,
            method: 'put',
            data: { pojo }
        })
    },
    // 删除供应商
    delete(id) {
        return request({
            url: `/supplier/${id}`,
            method: 'delete'
        })
    }


}