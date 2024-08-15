import store from '@/store'
import {CommonEnum} from "@/common/enum/CommonEnum";

export function checkPermission(el, binding) {
    if (store.getters.platId===CommonEnum.platId.SUPER){
        return;
    }
    // 获取指令传进来的
    const bindPowers = binding.value.split(',');
    if (bindPowers.length > 0) {
        const powers = store.getters && store.getters.powers;
        let hasPermission = true;
        bindPowers.forEach(item => {
            if (!powers.includes(item)) {
                hasPermission = false;
            }
        });
        if (!hasPermission) {
            el.parentNode && el.parentNode.removeChild(el);
        }
    }
}

export default {
    // 指令是具有一组生命周期的钩子：
    // 插入钩子函数
    inserted(el, binding) {
        checkPermission(el, binding)
    },
    // 在包含组件的 VNode 及其子组件的 VNode 更新之后调用
    update(el, binding) {
        // checkPermission(el, binding)
    },
    // 在绑定元素的父组件挂载之前调用
    beforeMount(el, binding, node) {
    },
    // 绑定元素的父组件挂载时调用
    mounted(el, binding, node) {
    },
    // 在包含组件的 VNode 更新之前调用
    beforeUpdate(el, binding, node) {
    },
    // 在绑定元素的父组件卸载之前调用
    beforeUnmount(el, binding, node) {
    },
    // 卸载绑定元素的父组件时调用
    unmounted(el, binding, node) {
    },
    // 卸载绑定元素的父组件时调用
    bind(el, binding, node) {
    },
}
