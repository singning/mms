//自定义封装axios对象

import axios from 'axios';

// 测试代码
// axios.get('/db.json').then(response => {
//     console.log(response.data);
// });

const request = axios.create({
    baseURL: process.env.VUE_APP_BASE_API,
    // baseURL: '/', //请求路径前缀
    time: 5000, //响应等待时间 超过5000ms未响应 则返回拒绝访问
});

// 请求拦截器
request.interceptors.request.use(function(config) {
    // 返回请求内容
    return config;
}, function(error) {
    // 通过Pormise对象 抛出错误信息
    return Promise.reject(error);
});

// 响应拦截器
request.interceptors.response.use(function(response) {
    // 返回响应结果
    return response;
}, function(error) {
    // 抛出错误信息
    return Promise.reject(error);
});

// 导出axios对象
export default request //导出axios对象