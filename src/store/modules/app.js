import Cookies from 'js-cookie'
import {getLanguage} from '@/common/lang'

const state = {
    sidebar: {
        opened: Cookies.get('SIDEBAR_STATUS') ? !!+Cookies.get('SIDEBAR_STATUS') : true,
        withoutAnimation: false
    },
    device: 'desktop',
    language: getLanguage(),
    size: Cookies.get('size') || 'medium',// 界面组件大小布局
    profileVisible: false,
}

const mutations = {
    TOGGLE_SIDEBAR: state => {
        state.sidebar.opened = !state.sidebar.opened
        state.sidebar.withoutAnimation = false
        if (state.sidebar.opened) {
            Cookies.set('SIDEBAR_STATUS', 1)
        } else {
            Cookies.set('SIDEBAR_STATUS', 0)
        }
    },
    CLOSE_SIDEBAR: (state, withoutAnimation) => {
        Cookies.set('SIDEBAR_STATUS', 0)
        state.sidebar.opened = false
        state.sidebar.withoutAnimation = withoutAnimation
    },
    TOGGLE_DEVICE: (state, device) => {
        state.device = device
    },
    SET_LANGUAGE: (state, language) => {
        state.language = language
        Cookies.set('language', language)
    },
    SET_SIZE: (state, size) => {
        state.size = size
        Cookies.set('size', size)
    },
    SET_PROFILE_VISIBLE: (state, profileVisible) => {
        state.profileVisible = profileVisible
    },
}

const actions = {
    toggleSideBar({commit}) {
        commit('TOGGLE_SIDEBAR')
    },
    closeSideBar({commit}, {withoutAnimation}) {
        commit('CLOSE_SIDEBAR', withoutAnimation)
    },
    toggleDevice({commit}, device) {
        commit('TOGGLE_DEVICE', device)
    },
    setLanguage({commit}, language) {
        commit('SET_LANGUAGE', language)
    },
    setSize({commit}, size) {
        commit('SET_SIZE', size)
    },
    setProfileVisible({commit}, profileVisible) {
        commit('SET_PROFILE_VISIBLE', profileVisible)
    },
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
