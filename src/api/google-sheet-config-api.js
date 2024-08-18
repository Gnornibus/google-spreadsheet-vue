import request from '@/common/utils/request'

let BaseUrl = "/googleSheetConfiguration"

/**
 * 发起工作簿运算
 * @param data
 * @returns {*}
 */
export function launchOperation(data) {
    return request({
        url: BaseUrl + '/launch-operation',
        method: 'post',
        data: data,
    })
}

/**
 * 获取配置列表缓存
 * @param data
 * @returns {*}
 */
export function getCacheSpreadsheetContent(data) {
    return request({
        url: BaseUrl + '/get-cache',
        method: 'post',
        data: data,
    })
}

/**
 * 列表
 * @param data
 * @returns {*}
 */
export function queryPageGoogleSheetConfig(data) {
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
export function saveGoogleSheetConfig(data) {
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
export function deleteGoogleSheetConfig(params) {
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
export function selectGoogleSheetConfig(params) {
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
export function selectAllGoogleSheetConfig() {
    return request({
        url: BaseUrl + '/selectAllGoogleSheetConfig',
        method: 'get',
    })
}

/**
 * 导出模板
 * @returns {*}
 * @param params
 */
export function exportTemplateGoogleSheetConfig(params) {
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
export function exportChoseExcelGoogleSheetConfig(data) {
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
export function exportParamExcelGoogleSheetConfig(data) {
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
export function exportExcelGoogleSheetConfig(params) {
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
export function saveBatchGoogleSheetConfig(file) {
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
export function deleteBatchGoogleSheetConfig(data) {
    return request({
        url: BaseUrl + '/deleteBatch',
        method: 'post',
        data: data
    });
}
