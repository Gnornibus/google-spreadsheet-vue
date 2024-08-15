/**
 * 服务器地址设置
 */
const state = {
    fileServersUrl: process.env.VUE_APP_BASE_URL + process.env.VUE_APP_BASE_URL_FILE_IN_PORT,         // 图片存放服务器地址前缀
};
const mutations = {};
const actions = {};
const getters = {
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
}
