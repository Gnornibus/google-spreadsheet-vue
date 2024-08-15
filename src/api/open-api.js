import request from '@/common/utils/request'

let BaseUrl = "/campOpen"

/**
 * 营会信息表列表
 * @param data
 * @returns {*}
 */
export function selectCampTermList(data) {
    return request({
        url: BaseUrl + '/selectCampTermList',
        method: 'post',
        data: data,
    })
}

/**
 * 横幅信息表列表
 * @returns {*}
 */
export function selectAllCampBanner() {
    return request({
        url: BaseUrl + '/selectAllCampBanner',
        method: 'get',
    })
}

/**
 * 用户注册
 * @returns {*}
 */
export function register(data) {
    return request({
        url: BaseUrl + '/register',
        method: 'post',
        data: data,
    })
}
