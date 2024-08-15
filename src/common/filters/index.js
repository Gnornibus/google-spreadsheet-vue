// 模块中导出的两个时间处理函数，用于解析和格式化时间。
export {parseTime, formatTime} from '@/common/utils'
import store from "../../store/index";

/**
 * 根据 time 参数的不同返回对应的带单位字符串，当 time 为 1 时单位为 label，否则为 label + s
 * @param {number} time
 * @param {string} label
 * @return {string}
 */
function pluralize(time, label) {
    if (time === 1) {
        return time + label
    }
    return time + label + 's'
}

/**
 * 函数根据时间戳 time 计算距离当前时间的时间差，并返回带单位的字符串
 * @param {number} time
 */
export function timeAgo(time) {
    const between = Date.now() / 1000 - Number(time)
    if (between < 3600) {
        return pluralize(~~(between / 60), ' minute')
    } else if (between < 86400) {
        return pluralize(~~(between / 3600), ' hour')
    } else {
        return pluralize(~~(between / 86400), ' day')
    }
}

/**
 * 函数用于将数字格式化为带单位的字符串，如 10000 => "10k"
 * @param {number} num
 * @param {number} digits
 */
export function numberFormatter(num, digits) {
    const si = [
        {value: 1E18, symbol: 'E'},
        {value: 1E15, symbol: 'P'},
        {value: 1E12, symbol: 'T'},
        {value: 1E9, symbol: 'G'},
        {value: 1E6, symbol: 'M'},
        {value: 1E3, symbol: 'k'}
    ]
    for (let i = 0; i < si.length; i++) {
        if (num >= si[i].value) {
            return (num / si[i].value).toFixed(digits).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') + si[i].symbol
        }
    }
    return num.toString()
}

/**
 * 函数用于将数字每三位加一个逗号，如 10000 => "10,000"
 * @param {number} num
 */
export function toThousandFilter(num) {
    return (+num || 0).toString().replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
}

/**
 * 函数用于将数字每三位加一个逗号，如 10000 => "10,000"
 * @param {String} string
 */
export function uppercaseFirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
}

/**
 * 将时间戳修改成正常的日期格式
 * @param time
 * @returns {string}
 */
export function timeFormat(time) {
    if (!time) { // 当时间是null或者无效格式时我们返回空
        return ' '
    } else {
        // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
        const date = new Date(time)
        // 使用箭头函数和三目运算以及es6字符串的简单操作。因为只有一个操作不需要{} ，目的就是数字小于10，例如9那么就加上一个0，变成09，否则就返回本身。
        const dateNumFun = (num) => num < 10 ? `0${num}` : num
        // 这是es6的解构赋值。
        const [Y, M, D, h, m, s] = [
            date.getFullYear(),
            dateNumFun(date.getMonth() + 1),
            dateNumFun(date.getDate()),
            dateNumFun(date.getHours()),
            dateNumFun(date.getMinutes()),
            dateNumFun(date.getSeconds())
        ]
        // 一定要注意是反引号，否则无效。
        return `${Y}-${M}-${D} ${h}:${m}:${s}`
    }
}

/**
 * 判断{{}}中的数据是否存在，如空则返回提醒
 * @param item
 * @returns {string|*}
 */
export function dataFilter(item) {
    // 当时间是null或者无效格式时我们返回指定值
    if (!item) {
        return '-'
    } else {
        return item
    }
}

import {queryDataSelectList} from "@/api/sys-select-api";

/**
 * 判断{{}}中的数据是否存在，如空则返回，非空返回字典映射值
 * @param item
 * @param url
 * @returns {string|*}
 */
export function dictMappingFilter(item, url) {
    // 当时间是null或者无效格式时我们返回指定值
    if (!item) {
        return '-'
    } else {
        queryDataSelectList(url, {id: item}).then(res => {
            if (res.data.length === 1) {
                return res.data[0].name;
            } else {
                return '-';
            }
        });
    }
}

/**
 * 判断{{}}中的数据是否存在，如空则返回提醒
 * @param item
 * @returns {string|*}
 */
export function imageFilter(item) {
    // 当时间是null或者无效格式时我们返回指定值
    if (!item || item === "" || item === undefined) {
        return 'https://picsum.photos/32'
    } else {
        // 将图片的服务器前缀加上去
        return "store.state.serverUrl.fileServersUrl" + item
    }
}

/**
 * 状态判断拦截器
 * @param status
 * @returns {*}
 */
export function statusFilter(status) {
    if (status === 'Y' || status === 0) {
        status = 0;
    }
    if (status === 'N' || status === 1) {
        status = 1;
    }
    const statusMap = {
        '0': 'danger',
        '1': 'success',
        '2': 'warning',
        '3': 'info',
    }
    return statusMap[status]
}

/**
 * 通用媒体文件过滤器
 * @param item 过滤内容
 * @param defaultUrl 默认Url
 * @returns {*}
 */
const mediaFilter = (item, defaultUrl) => {
    if (!item || item === "" || item === undefined) {
        // 如果文件不存在，返回默认文件URL
        return defaultUrl;
    } else if (!item.startsWith('/')) {
        return item;
    } else {
        // 拼接服务器地址和文件路径，返回完整URL
        return store.state.serverUrl.fileServersUrl + item;
    }
};

/**
 * 图片过滤器
 */
export function imageFileFilter(item) {
    return mediaFilter(item, "https://picsum.photos/32/32");
}

/**
 * 音频过滤器
 */
export function audioFileFilter(item) {
    return mediaFilter(item, "https://www.runoob.com/try/demo_source/horse.ogg");
}

/**
 * 视频过滤器
 */
export function videoFileFilter(item) {
    return mediaFilter(item, "https://www.runoob.com/try/demo_source/movie.mp4");
}
