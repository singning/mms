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

// 引入element-ui加载服务
import { Loading } from 'element-ui';

// 引入element-ui消息提示
import { Message } from 'element-ui';

// 调用页面加载指令
// Loading.service(options);

// 返回加载实例
// this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
//     loadingInstance.close();
// });

// 定义加载数据的对象
const loadingData = {
    loadingInstance: null, //先将加载实例置为空
    open() {
        if (this.loadingInstance === null) {
            // 打开服务
            this.loadingInstance = Loading.service({ target: '.main', text: '数据加载中...' });
        }
    },
    close() {
        if (this.loadingInstance !== null) {
            this.loadingInstance.close();
            this.loadingInstance = null;
        }
    }
}

// 请求拦截器
request.interceptors.request.use(function(config) {
    // 向后台发送ajax请求时
    loadingData.open();
    // 返回请求内容
    return config;
}, function(error) {
    // 如果请求出错 也要关闭加载服务
    loadingData.close();
    // 通过Pormise对象 抛出错误信息
    return Promise.reject(error);
});

// 响应拦截器
request.interceptors.response.use(function(response) {
    const resp = response.data;
    // 如果响应回来的状态码不为2000 这说明服务端出现问题
    if (resp.code !== 2000) {
        Message({
            type: 'error',
            duration: 5000,
            message: resp.message || '系统错误'
        });
    }
    // 响应成功后 关闭加载服务
    loadingData.close();
    // 返回响应结果
    return response;
}, function(error) {
    loadingData.close();
    // 如果因为网络原因或访问地址问题导致出现error 可以在这里抛出
    switch (response.status) {
        case 404:
            Message({
                type: 'error',
                duration: 5000,
                message: '抱歉，找不到您访问的地址'
            });
            break;
        case 500:
            Message({
                type: 'error',
                duration: 5000,
                message: '网络错误,请检查您的网络'
            });
            break;
        default:
            break;
    }
    // 抛出错误信息
    return Promise.reject(error);
});

// 导出axios对象
export default request //导出axios对象