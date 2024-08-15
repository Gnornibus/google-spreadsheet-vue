import request from '@/common/utils/request'

let BaseUrl = "/dict"

/**
 * 查找用户下拉框
 * @returns {*}
 */
export function selectAllSysUserDict() {
    return request({
        url: BaseUrl + '/selectAllSysUserDict',
        method: 'get',
    })
}

/**
 * 查找定时任务下拉框
 * @returns {*}
 */
export function selectAllSysTaskDict() {
    return request({
        url: BaseUrl + '/selectAllSysTaskDict',
        method: 'get',
    })
}

/**
 * 查找角色下拉框
 * @returns {*}
 */
export function selectAllSysRoleDict() {
    return request({
        url: BaseUrl + '/selectAllSysRoleDict',
        method: 'get',
    })
}

/**
 * 查找平台下拉框
 * @returns {*}
 */
export function selectAllSysPlatDict() {
    return request({
        url: BaseUrl + '/selectAllSysPlatDict',
        method: 'get',
    })
}

/**
 * 查找参数下拉框
 * @returns {*}
 */
export function selectAllSysParamDict() {
    return request({
        url: BaseUrl + '/selectAllSysParamDict',
        method: 'get',
    })
}

/**
 * 查找公告下拉框
 * @returns {*}
 */
export function selectAllSysNoticeDict() {
    return request({
        url: BaseUrl + '/selectAllSysNoticeDict',
        method: 'get',
    })
}

/**
 * 查找菜单下拉框
 * @returns {*}
 */
export function selectAllSysMenuDict() {
    return request({
        url: BaseUrl + '/selectAllSysMenuDict',
        method: 'get',
    })
}

/**
 * 查找日志下拉框
 * @returns {*}
 */
export function selectAllSysLogDict() {
    return request({
        url: BaseUrl + '/selectAllSysLogDict',
        method: 'get',
    })
}

/**
 * 查找文件下拉框
 * @returns {*}
 */
export function selectAllSysFileRecordDict() {
    return request({
        url: BaseUrl + '/selectAllSysFileRecordDict',
        method: 'get',
    })
}

/**
 * 查找反馈下拉框
 * @returns {*}
 */
export function selectAllSysFeedbackDict() {
    return request({
        url: BaseUrl + '/selectAllSysFeedbackDict',
        method: 'get',
    })
}

/**
 * 查找数据可视化下拉框
 * @returns {*}
 */
export function selectAllSysDataDict() {
    return request({
        url: BaseUrl + '/selectAllSysDataDict',
        method: 'get',
    })
}
