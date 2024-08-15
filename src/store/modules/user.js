import {getInfo, login, loginOut} from '@/api/sys-uaa-api'
import {removeToken, setToken} from '@/common/utils/token-util'
import router, {resetRouter} from '@/router'
import {setValRsa} from "@/common/utils/rsa-util";
import store from "@/store";

const state = {
    id: '',
    roleName: '',
    account: '',
    name: '',
    sex: '',
    avatar: '',
    state: '',
    mobile: '',
    email: '',
    cardId: '',
    loginCount: '',
    loginIpAddress: '',
    oldLoginTime: '',
    platId: '',
    powers: [],
    token: '',
}

const mutations = {
    SET_USER_ID: (state, id) => {
        state.id = id;
    },
    SET_ROLE_NAME: (state, roleName) => {
        state.roleName = roleName;
    },
    SET_ACCOUNT: (state, account) => {
        state.account = account;
    },
    SET_NAME: (state, name) => {
        state.name = name;
    },
    SET_SEX: (state, sex) => {
        state.sex = sex;
    },
    SET_AVATAR: (state, avatar) => {
        state.avatar = avatar;
    },
    SET_STATE: (state, myState) => {
        state.state = myState;
    },
    SET_MOBILE: (state, mobile) => {
        state.mobile = mobile;
    },
    SET_EMAIL: (state, email) => {
        state.email = email;
    },
    SET_CARD_ID: (state, cardId) => {
        state.cardId = cardId;
    },
    SET_LOGIN_COUNT: (state, loginCount) => {
        state.loginCount = loginCount;
    },
    SET_LOGIN_IP_ADDRESS: (state, loginIpAddress) => {
        state.loginIpAddress = loginIpAddress;
    },
    SET_OLD_LOGIN_TIME: (state, oldLoginTime) => {
        state.oldLoginTime = oldLoginTime;
    },
    SET_PLAT_ID: (state, platId) => {
        state.platId = platId;
    },
    SET_POWERS: (state, powers) => {
        state.powers = powers;
    },
    SET_TOKEN: (state, token) => {
        state.token = token;
        setToken(token);
    },
}

const actions = {
    // 用户登录
    login({commit}, userInfo) {
        const {account, password, checkCode, checkCodeToken} = userInfo
        return new Promise((resolve, reject) => {
            login({
                account: setValRsa(account.trim()),
                password: setValRsa(password),
                checkCode: setValRsa(checkCode)
            }, {'authorization_code': checkCodeToken}).then(response => {
                const {data} = response
                commit('SET_TOKEN', data.token)
                setToken(data.token)
                resolve(data)
            }).catch(error => {
                reject(error)
            })
        })
    },

    // 获取用户详情
    getInfo({commit, state}) {
        return new Promise((resolve, reject) => {
            getInfo().then(response => {
                const {data} = response

                if (!data) {
                    reject('验证失败，请重新登录。')
                }

                const {
                    id,
                    roleName,
                    account,
                    name,
                    sex,
                    avatar,
                    state,
                    mobile,
                    email,
                    cardId,
                    loginCount,
                    loginIpAddress,
                    oldLoginTime,
                    platId,
                    powers,
                    token,
                } = data
                commit('SET_USER_ID', id)
                commit('SET_ROLE_NAME', roleName)
                commit('SET_ACCOUNT', account)
                commit('SET_NAME', name)
                commit('SET_SEX', sex)
                commit('SET_AVATAR', avatar)
                commit('SET_STATE', state)
                commit('SET_MOBILE', mobile)
                commit('SET_EMAIL', email)
                commit('SET_CARD_ID', cardId)
                commit('SET_LOGIN_COUNT', loginCount)
                commit('SET_LOGIN_IP_ADDRESS', loginIpAddress)
                commit('SET_OLD_LOGIN_TIME', oldLoginTime)
                commit('SET_PLAT_ID', platId)
                commit('SET_POWERS', powers)
                commit('SET_TOKEN', token)
                resolve(data)
            }).catch(error => {
                reject(error)
            })
        })
    },

    // 用户退出
    loginOut({commit, state, dispatch}) {
        return new Promise((resolve, reject) => {
            loginOut(state.token).then(() => {
                // 重置菜单
                store.dispatch('menu/setMenus', '').then(
                    // 删除用户令牌
                    dispatch('resetToken'),
                    // 重置访问的视图和缓存的视图
                    dispatch('tagsView/delAllViews', null, {root: true}),
                );
                // 重置路由
                resetRouter()
                resolve()
            }).catch(error => {
                reject(error)
            })
        })
    },

    // 删除用户令牌
    resetToken({commit}) {
        return new Promise(resolve => {
            commit('SET_TOKEN', '')
            commit('SET_POWERS', '')
            removeToken()
            resolve()
        })
    },

    // 动态修改权限
    async changeRoles({commit, dispatch}, role) {
        const token = role + '-token'

        commit('SET_TOKEN', token)
        setToken(token)

        const {roles} = await dispatch('getInfo')

        resetRouter()

        // 根据角色生成可访问的路由映射
        const accessRoutes = await dispatch('permission/generateRoutes', roles, {root: true})
        // dynamically add accessible routes
        router.addRoutes(accessRoutes)

        // 重置访问的视图和缓存的视图
        dispatch('tagsView/delAllViews', null, {root: true})
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
