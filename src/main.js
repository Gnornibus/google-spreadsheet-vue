import Vue from 'vue'
import App from './App'
/**
 * Cookies工具类
 */
import Cookies from 'js-cookie'
/**
 * 全局样式
 */
import Element from 'element-ui'
/**
 * VueX
 */
import store from './store'
/**
 * 路由
 */
import router from './router'
/**
 * 国际化
 */
import i18n from './common/lang'
/**
 * 拦截器
 */
import * as filters from './common/filters'
/**
 * 将main的配置文件拆分一部分出去，避免臃肿
 */
import {globalMixin} from './mixin/globalMixin.js';

Vue.mixin(globalMixin);

/**
 * 桌面端
 */
Vue.use(Element, {
  size: Cookies.get('size') || 'mini', // 设置 element-ui 默认大小
  i18n: (key, value) => i18n.t(key, value)
})
/**
 * 移动端
 */

// 注册全局实用程序过滤器
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
