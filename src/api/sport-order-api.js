import request from '@/common/utils/request'

let BaseUrl = "/sportOrder"

/**
 * 列表
 * @param data
 * @returns {*}
 */
export function queryPageSportOrder(data) {
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
export function saveSportOrder(data) {
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
export function deleteSportOrder(params) {
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
export function selectSportOrder(params) {
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
export function selectAllSportOrder() {
    return request({
        url: BaseUrl + '/selectAllSportOrder',
        method: 'get',
    })
}

/**
 * 导出模板
 * @returns {*}
 * @param params
 */
export function exportTemplateSportOrder(params) {
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
export function exportChoseExcelSportOrder(data) {
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
export function exportParamExcelSportOrder(data) {
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
export function exportExcelSportOrder(params) {
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
export function saveBatchSportOrder(file) {
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
export function deleteBatchSportOrder(data) {
    return request({
        url: BaseUrl + '/deleteBatch',
        method: 'post',
        data: data
    });
}
