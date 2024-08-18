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

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-balham.css';
// icon样式
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'ag-grid-enterprise'; // 自动启用所有企业功能

import {LicenseManager} from 'ag-grid-enterprise';

// 设置 AG-Grid 企业版许可证密钥
LicenseManager.setLicenseKey("Using_this_{AG_Charts_and_AG_Grid}_Enterprise_key_{AG-063234}_in_excess_of_the_licence_granted_is_not_permitted___Please_report_misuse_to_legal@ag-grid.com___For_help_with_changing_this_key_please_contact_info@ag-grid.com___{Uppeta_limited}_is_granted_a_{Multiple_Applications}_Developer_License_for_{1}_Front-End_JavaScript_developer___All_Front-End_JavaScript_developers_need_to_be_licensed_in_addition_to_the_ones_working_with_{AG_Charts_and_AG_Grid}_Enterprise___This_key_has_not_been_granted_a_Deployment_License_Add-on___This_key_works_with_{AG_Charts_and_AG_Grid}_Enterprise_versions_released_before_{10_July_2025}____[v3]_[0102]_MTc1MjEwMjAwMDAwMA==334251ced43da139554512dfd04aac30");

import {AgGridVue} from 'ag-grid-vue';

// 全局注册组件
Vue.component('AgGridVue', AgGridVue);

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
