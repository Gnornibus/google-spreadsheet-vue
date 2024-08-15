import request from '@/common/utils/request'

let BaseUrl = "/sportVideoHistory"

/**
 * 列表
 * @param data
 * @returns {*}
 */
export function queryPageSportVideoHistory(data) {
    return request({
        url: BaseUrl + '/page',
        method: 'post',
        data: data,
    })
}

/**
 * 创建/修改
 * @returns {*}
 * @param data
 */
export function saveSportVideoHistory(data) {
    return request({
        url: BaseUrl + '/save',
        method: 'post',
        data: data,
    })
}

/**
 * 删除
 * @returns {*}
 * @param params
 */
export function deleteSportVideoHistory(params) {
    return request({
        url: BaseUrl + '/delete',
        method: 'delete',
        params: params,
    })
}

/**
 * 查找
 * @returns {*}
 * @param params
 */
export function selectSportVideoHistory(params) {
    return request({
        url: BaseUrl + '/select',
        method: 'get',
        params: params,
    })
}

/**
 * 查找
 * @returns {*}
 */
export function selectAllSportVideoHistory() {
    return request({
        url: BaseUrl + '/selectAllSportVideoHistory',
        method: 'get',
    })
}

/**
 * 导出模板
 * @returns {*}
 * @param params
 */
export function exportTemplateSportVideoHistory(params) {
    return request({
        url: BaseUrl + '/exportTemplate',
        method: 'get',
        responseType: 'blob',
    })
}

/**
 * 批量选中导出
 * @returns {*}
 * @param data
 */
export function exportChoseExcelSportVideoHistory(data) {
    return request({
        url: BaseUrl + '/exportChoseExcel',
        method: 'post',
        data: data,
        responseType: 'blob',
    })
}

/**
 * 批量条件导出
 * @returns {*}
 * @param data
 */
export function exportParamExcelSportVideoHistory(data) {
    return request({
        url: BaseUrl + '/exportParamExcel',
        method: 'post',
        data: data,
        responseType: 'blob',
    })
}

/**
 * 批量导出
 * @returns {*}
 * @param params
 */
export function exportExcelSportVideoHistory(params) {
    return request({
        url: BaseUrl + '/exportExcel',
        method: 'get',
        responseType: 'blob',
    })
}

/**
 * 批量新增
 * @returns {*}
 * @param file
 */
export function saveBatchSportVideoHistory(file) {
    const formData = new FormData();
    formData.append("file", file);
    return request({
        url: BaseUrl + "/saveBatch",
        method: "post",
        data: formData,
        headers: {"Content-Type": "multipart/form-data"},
    });
}

/**
 * 批量删除
 * @returns {Promise}
 * @param data
 */
export function deleteBatchSportVideoHistory(data) {
    return request({
        url: BaseUrl + '/deleteBatch',
        method: 'post',
        data: data
    });
}
