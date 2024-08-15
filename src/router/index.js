import Vue from 'vue'
import Router from 'vue-router'
/* 布局 */
import AdminLayout from '@/layout/admin-index'

Vue.use(Router)

/**
 * 注意:子菜单仅在路由子级时出现。长度> = 1
 * 详情见:https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true如果设置为true，项目将不会显示在侧边栏中(默认值为false)
 * alwaysShow: true如果设置为true，将总是显示根菜单
 * 如果未设置alwaysShow，当项目有多个子路线时，
 * 它将变成嵌套模式，否则不显示根菜单
 * redirect: noRedirect如果设置noRedirect，则不会在面包屑中重定向
 * name:'router-name '该名称由< keep-alive >使用(必须设置！！！)
 * 元:{
   角色:['admin '，' editor']控制页面角色(您可以设置多个角色)
   标题:“标题”显示在侧栏和面包屑中的名称(推荐集)
   图标:' svg-name'/'el-icon-x '图标显示在侧边栏中
   affix: true如果设置为true，将会固定到TagsView(默认值为false)
   noCache: true如果设置为true，将不会缓存页面(默认值为false)
   附加:true如果设置为true，标签将附加在标签视图中
   breadcrumb: false如果设置为false，项目将隐藏在breadcrumb中(默认值为true)
   activeMenu: '/example/list '如果设置路径，侧栏将突出显示您设置的路径
  }
 */

/**
 * 基础路由
 * 没有权限要求的基页
 * 所有角色都可以访问
 */
export const constantRoutes = [
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/login/index'),
        hidden: true
    },
    {
        path: '/redirect',
        component: AdminLayout,
        hidden: true,
        children: [
            {
                path: '/redirect/:path(.*)',
                component: () => import('@/views/redirect/index')
            }
        ]
    },
    {
        path: '/auth-redirect',
        component: () => import('@/views/login/auth-redirect'),
        hidden: true
    },
    {
        path: '/401',
        name: '401',
        component: () => import('@/views/error/401'),
        hidden: true
    },
    {
        path: '/404',
        name: '404',
        component: () => import('@/views/error/404'),
        hidden: true
    },
];

/**
 * 异步路由
 * 需要根据用户角色动态加载的路由
 */
export const asyncRoutes = [
    // 404页必须放在末尾
    // {path: '*', redirect: '/404', hidden: true},
]

const createRouter = () => new Router({
    mode: 'history', // 需要服务支持
    base: '/system-admin/',
    scrollBehavior: () => ({y: 0}),
    routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
    const newRouter = createRouter()
    router.matcher = newRouter.matcher // 重新设置路由
}

export default router
