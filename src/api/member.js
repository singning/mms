// 引入 axios对象
import request from '../utils/requset';

// 导出默认对象
export default {
    // 获取会员列表信息
    getMember() {
        return request({
            method: 'get',
            url: '/member/list'
        })
    },
    // 会员分页查询功能
    search(page, size, searchMap) {
        return request({
            method: 'post',
            url: `/member/list/search/${page}/${size}`,
            data: { searchMap }
        })
    },
    // 新增会员功能
    addMember(pojo) {
        return request({
            url: '/member',
            method: 'post',
            data: { pojo }
        })
    },
    // 通过id查询会员
    getById(id) {
        return request({
            url: `/member/${id}`,
            method: 'post'
        });
    },
    // 更新会员信息
    updataMember(pojo) {
        return request({
            // 注意后台中的 /{id}是占位符  负责传递参数的
            url: `/member/${pojo.id}`,
            method: 'put',
            data: { pojo }
        });
    },
    // 删除会员
    deleteMember(id) {
        return request({
            url: `/member/${id}`,
            method: 'delete'
        });
    }
}