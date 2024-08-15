import Vue from "vue";
/**
 * 图标
 */
import '@/icons'
/**
 * 权限控制
 */
import '@/permission'
/**
 * 样式文件
 */
import '@/assets/css/scss/element-variables.scss'
import '@/assets/css/scss/index.scss'
// 桌面端样式
import '@/assets/css/desktop/scss.scss'
// 移动端适配样式
import '@/assets/css/mobile/css.css'
import '@/assets/css/mobile/scss.scss'
/**
 * 错误日志
 */
import '@/common/utils/error-log'
/**
 * CSS 重置的现代替代方案
 */
import 'normalize.css/normalize.css'
/**
 * 权限判断指令
 */
import permission from '@/common/directive/permission/index.js'

/**
 * 日期格式化组件
 */

export const globalMixin = {
  directives: {
    permission: permission,
  },
  mounted() {
    Vue.prototype.$global = {
      deepClone:function (source) {
        if (!source || typeof source !== 'object') {
          throw new Error('错误的参数', '深克隆');
        } else {
          const targetObj = source.constructor === Array ? [] : {};
          Object.keys(source).forEach((key) => {
            if (Array.isArray(source[key])) {
              targetObj[key] = [...source[key]];
            } else if (source[key] && typeof source[key] === 'object') {
              targetObj[key] = deepClone(source[key]);
            } else {
              targetObj[key] = source[key];
            }
          });
          return targetObj;
        }
      }
    };
  },
};
