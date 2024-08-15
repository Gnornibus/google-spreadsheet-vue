import {getUserMenu} from "@/api/sys-menu-api";

const state = {
    menus: [],
}

const mutations = {
    SET_MENUS: (state, menus) => {
        state.menus = menus
    },
}

const actions = {
    // 获取菜单信息
    getUserMenu({commit, state}) {
        return new Promise((resolve, reject) => {
            getUserMenu().then(response => {
                // 获取菜单栏
                const {data} = response
                // 设置菜单栏
                commit('SET_MENUS', data)
                resolve(data)
            }).catch(error => {
                reject(error)
            })
        })
    },

    // 删除用户令牌
    setMenus({commit},menu) {
        return new Promise(resolve => {
            commit('SET_MENUS', menu);
        })
    },

}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
