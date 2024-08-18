import {constantRoutes} from '@/router'
import AdminLayout from '@/layout/admin-index'
import CustomerLayout from '@/layout/customer-index'

// 基础路由页面信息
const asyncRouterComponents = {
    /**
     * 管理平台
     */
    // 首页管理
    dashBoard: () => import('@/views/admin/chart/index'),
    // 系统管理
    sysPlat: () => import('@/views/admin/system/SysPlat'),
    sysNotice: () => import('@/views/admin/system/SysNotice'),
    sysParam: () => import('@/views/admin/system/SysParam'),
    sysMenu: () => import('@/views/admin/system/SysMenu'),
    sysTask: () => import('@/views/admin/system/SysTask'),
    sysData: () => import('@/views/admin/system/SysData'),
    sysBanner: () => import('@/views/admin/system/SysBanner'),
    sysDict: () => import('@/views/admin/system/SysDict'),
    sysFeedback: () => import('@/views/admin/system/SysFeedback'),
    // 用户管理
    sysTenant: () => import('@/views/admin/user/SysTenant'),
    sysUser: () => import('@/views/admin/user/SysUser'),
    sysRole: () => import('@/views/admin/user/SysRole'),
    sysPower: () => import('@/views/admin/user/SysPower'),
    // 文件管理
    sysFileRecord: () => import('@/views/admin/file/SysFileRecord'),
    // 日志管理
    sysLog: () => import('@/views/admin/log/SysLog'),
    // 测试管理
    sysTest: () => import('@/views/admin/test/SysTest'),
    // 教练管理
    googleSheetConfig: () => import('@/views/google/spreadsheet/config'),
}

const state = {
    routes: [],
    addRoutes: [],
}

const mutations = {
    SET_ROUTES: (state, routes) => {
        state.addRoutes = routes
        state.routes = constantRoutes.concat(routes)
    }
}

const actions = {
    async generateRoutes({commit}, menus) {
        // 动态生成路由界面
        const asyncRoutes = menus.map(makeRouterObject);
        // 404页必须放在末尾
        asyncRoutes.push({path: '*', redirect: '/404', hidden: true},)
        commit('SET_ROUTES', asyncRoutes);
        return state.addRoutes;
    }
}

function makeRouterObject({toUrl, children, icon, platId}) {
    if (toUrl === 'chart') {
        return {
            path: '/',
            component: AdminLayout,
            redirect: '/' + children[0].toUrl,
            children: [
                {
                    path: children[0].toUrl,
                    component: asyncRouterComponents[children[0].toUrl],
                    name: children[0].toUrl,
                    meta: {title: children[0].toUrl, icon: 'dashboard', affix: true}
                }
            ]
        };
    }

    return {
        path: `/${toUrl}`,
        component: platId === "CUSTOMER" ? CustomerLayout : AdminLayout,
        redirect: `/${toUrl}/${children[0].toUrl}`,
        alwaysShow: toUrl.length,
        name: toUrl,
        meta: {
            title: toUrl,
            icon
        },
        children: children.reduce((routes, child) => {
            routes.push({
                path: child.toUrl,
                component: asyncRouterComponents[child.toUrl],
                name: child.toUrl,
                meta: {
                    title: child.toUrl,
                    icon: child.icon
                }
            });
            return routes;
        }, [])
    };
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
