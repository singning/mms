module.exports = {
    // 开发依赖
    devServer: {
        port: 8888, //端口号 默认为8080 这里为了防止冲突
        host: 'localhost', //主机名 127.0.0.1  真机0.0.0.0
        https: false, //协议 不使用 https协议
        open: true, //启动服务器时自动打开浏览器
        proxy: {
            [process.env.VUE_APP_BASE_API]: { //地址前缀 当访问到地址为dev-api时 将请求转交给目标地址
                target: process.env.VUE_APP_SERVER_URL, //目标地址
                changeOrigin: true, //开启代理
                pathRewrite: {
                    ['^' + process.env.VUE_APP_BASE_API]: '' //会将/dev-api替换为空字符串
                }
            }
        }
    },

    lintOnSave: false, //关闭格式自动检查
    productionSourceMap: false, //打包时不生成 .map文件 加快打包速度
}