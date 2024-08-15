import axios from 'axios'
import {Message, MessageBox, Notification} from 'element-ui'
import store from '@/store'
import {getToken} from '@/common/utils/token-util'
import NProgress from 'nprogress'
import router from "@/router";
import {showFullScreenLoading, tryHideFullScreenLoading} from "@/common/utils/loading";

// 创建axios实例时配置的默认值
const request = axios.create({
    // url = 基础url + 请求url
    baseURL: process.env.VUE_APP_BASE_URL_ADMIN_API,
    // 当跨域请求时发送cookie
    withCredentials: true,
    // 请求超时
    // timeout: 5000,
    headers: {
        'X-Custom-Header': 'foobar',
        'Content-Type': "application/json;charset=utf-8",
        "Access-Control-Allow-Origin": process.env.VUE_APP_BASE_URL + process.env.VUE_APP_BASE_URL_ADMIN_PORT, // 请求源
        "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
        'Access-Control-Allow-Credentials': true // 允许发送凭证
    }
})

/**
 * 请求拦截器
 */
request.interceptors.request.use(config => {
        // 启动进度条（起始最低为60%，永不达100%）
        NProgress.inc();
        showFullScreenLoading()
        // 在发送请求之前做些什么
        const userToken = getToken()
        // 如果 token 存在
        if (userToken) {
            config.headers['authorization'] = userToken
        }
        return config;
    },
    error => {
        Message.error({message: error.message, duration: 3000})
        // 关闭进度条
        NProgress.done();
        tryHideFullScreenLoading()
        // 对请求错误做些什么
        return Promise.reject(error.message);
    }
)

/**
 * 响应拦截器
 */
request.interceptors.response.use(async response => {
        if (response.data instanceof Blob) {
            if (response.headers['content-disposition'] === undefined) {
                Message.error("导出数据行数超过10000行数据")
            } else {
                // 判断返回的数据类型，不是 blob，则将 responseType 修改为 'blob'
                if (!(response.data instanceof Blob)) {
                    response = await axios({
                        ...response.config,
                        responseType: 'blob'
                    });
                }
                // 创建一个 Blob 对象
                const blob = new Blob([response.data], {type: 'application/vnd.ms-excel'});
                // 创建一个 a 标签
                const link = document.createElement('a');
                // 设置 a 标签的 download、href 属性
                link.download = decodeURIComponent(response.headers['content-disposition'].split('filename=')[1]);
                // 设置下载链接
                link.href = window.URL.createObjectURL(blob);
                // 将 a 标签添加到页面中，并触发点击事件
                document.body.appendChild(link);
                // 触发点击事件
                link.click();
                await Notification({
                    title: '下载已完成',
                    message: '请前往下载记录查看',
                    type: 'success'
                });
                // 移除 a 标签
                document.body.removeChild(link);
            }
        } else {
            // 响应数据
            const data = response.data;
            // 如果定制代码不是200，则判定为错误。
            if (data.code && data.code !== 20000) {
                // 30000: 令牌过期;51000: 非法参数;
                if (data.code === 401) {
                    // 重新登录
                    MessageBox.confirm('您已登出，您可以取消以留在此页面，或重新登录', '确认注销', {
                        confirmButtonText: '重新登录',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        // 重置用户令牌
                        store.dispatch('user/resetToken').then(() => {
                            // 重置完成后重新刷新当前页面
                            location.reload()
                        })
                    });
                } else if (data.code === 51000) {
                    Message({
                        message: data.code + ":" + data.message,
                        type: 'warning',
                        duration: 2000
                    });
                } else {
                    Message({
                        message: data.code + ":" + data.message,
                        type: 'warning',
                        duration: 2000
                    });
                }
                NProgress.done();
                tryHideFullScreenLoading()
                return Promise.reject(new Error(data.message || 'Error'))
            } else {
                NProgress.done();
                tryHideFullScreenLoading()
                return data;
            }
        }
    }, error => {
        // 关闭进度条
        NProgress.done();
        tryHideFullScreenLoading()
        // 将如下错误信息跳转到登录页面
        if (error + "" === "Error: Network Error") {
            Message.error({message: "网络链接异常,请保存数据,刷新重试", type: 'error', duration: 3000})
            router.push({name: 'login'})
        } else if (error.response.status === 404) {
            Message.error({message: "网络错误404", type: 'error', duration: 3000})
            router.push({name: '404'})
        } else if (error.response.status === 401) {
            Message.error({message: "网络错误404", type: 'error', duration: 3000})
            router.push({name: '401'})
        } else {
            Message.error({message: error.code + error, type: 'error', duration: 3000})
        }
        // 对响应错误做点什么
        return Promise.reject(error.message)
    }
);

// 显示一个通知
function showNotification(title, message, type) {
    return new Promise(resolve => {
        Notification({
            title: title,
            message: message,
            type: type,
            onClose: () => {
                resolve();
            }
        });
    });
}

export default request
