import router from './router'
import store from './store'
import NProgress from 'nprogress' // 进度条
//auth文件主要依赖js-cookie模块，把getToken，setToken，removeToken设置在这里,从cooking获取token
import {getToken} from '@/common/utils/token-util'
//get-page-title文件主要是网站的标题，get-page-title通过依赖setting.js里的title变量修改网站标题
//如果需要更改网站的标题，可以直接到setting.js修改title属性
import getPageTitle from '@/common/utils/get-page-title'
import {Message} from "element-ui";
import {CommonEnum} from "@/common/enum/CommonEnum";
//NProgress是封装的进度条，基本不用动，进度条配置
NProgress.configure({showSpinner: false})

router.beforeEach(async (to, from, next) => {
    // 开始进度条
    NProgress.start()

    // 设置页面标题
    document.title = getPageTitle(to.meta.title)

    // 这里的getToken()就是在上面导入的auth.js里的getToken()方法，判断用户是否已登录
    const hasToken = getToken()
    // 如果存在token，即存在已登陆的令牌
    if (hasToken) {
        // 如果用户存在令牌的情况请求登录页面，就让用户直接跳转到首页，避免存在重复登录的情况
        if (to.path === '/login') {
            // 直接跳转到首页，当然取决于你的路由重定向到哪里,如果已登录，则重定向到主页
            // next({path: '/'})
            next();
            // 关闭进度条
            NProgress.done();
        } else {
            // 如果已经有令牌的用户请求的不是登录页，是其他页面
            // 就从Vuex里拿到用户的信息，这里也证明用户不是第一次登录了
            // 确定用户是否通过getUserMenu获得了他的菜单权限
            const hasMenus = store.getters.menus && store.getters.menus.length > 0
            if (hasMenus) {
                next()
            } else {
                try {
                    // 如果已经有令牌的用户请求的不是登录页，是其他页面
                    // 就从Vuex里拿到用户的信息，这里也证明用户不是第一次登录了
                    // 获取用户详情
                    await store.dispatch('user/getInfo')
                    // 获取菜单栏
                    const menus = await store.dispatch('menu/getUserMenu')
                    // 基于菜单栏生成可访问的路线图
                    const accessRoutes = await store.dispatch('permission/generateRoutes', menus)
                    // 动态添加可访问的路由
                    router.addRoutes(accessRoutes)
                    //设置好了之后，依然可以请求哪就跳转哪
                    // hack方法来确保addRoutes是完整的
                    // 设置replace: true，这样导航就不会留下历史记录
                    next({...to, replace: true})
                } catch (error) {
                    // 移除令牌并转到登录页面重新登录
                    Message.error(error || 'Has Error')
                    // 如果出错了，把令牌去掉
                    await store.dispatch('user/resetToken')
                    // 让用户重新去到登录页面
                    next('/login?redirect=/dashBoard')
                    // 关闭进度条
                    NProgress.done()
                }
            }
        }
    } else {
        // 这里是没有令牌的情况
        // 上面的白名单吗，现在起作用了
        if (CommonEnum.whiteListEnum.indexOf(to.path) !== -1) {
            // 不是-1就证明存在白名单里，不管你有没有令牌，都直接去到白名单路由对应的页面
            next()
        } else {
            // 如果这个页面不在白名单里，直接跳转到登录页面,并重定向到起跳转过来的页面
            next('/login')
            NProgress.done()
        }
    }
})

router.afterEach(() => {
    // 完成进度条
    NProgress.done()
})
