import request from '@/common/utils/request'

let BaseUrl = "/google-delete"

/**
 * 获取配置列表缓存
 * @param params
 * @returns {*}
 */
export function deleteSheetOperation(params) {
    return request({
        url: BaseUrl + '/sheet-name',
        method: 'get',
        params: params,
    })
}
