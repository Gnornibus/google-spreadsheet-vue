import request from '@/common/utils/request'

/**
 * 查找数据下拉框
 * @returns {*}
 */
export function queryDataSelectList(url, data) {
    return request({
        url: '/sys-data-select/system/' + url,
        method: 'post',
        data: JSON.stringify(data) || {}
    })
}

/**
 * 查找字典下拉框
 * @returns {*}
 */
export function queryDictSelectList(dictCode, data) {
    return request({
        url: '/sys-dict-select/system/' + dictCode,
        method: 'post',
        data: data || {}
    })
}
