// 引入 封装好的axios对象
import request from '../utils/requset';
import { _ } from 'core-js';

// 定义地址前缀(解决跨域问题)
// const BASEURL = '/dev-api';

request.get('/db.json').then(reqponse => {
    console.log("get2", reqponse.data);
});


// 导出默认对象
export default {
    // 定义方法
    getList() {
        const res = request({
            method: 'get',
            url: '/db.json'
        });
        // 返回得到的结果
        return res;
    }
}