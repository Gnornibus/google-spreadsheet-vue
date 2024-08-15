import Cookies from 'js-cookie'
import store from "@/store";

// 通知键值
const SysNoticeKey = {
    // 超级管理员平台
    SUPER: "SUPER_NOTICE_KEY",
    // 管理平台
    ADMIN: "ADMIN_NOTICE_KEY",
    // 服务商平台
    AGENT: "AGENT_NOTICE_KEY",
    // 营地平台
    CAMP: "CAMP_NOTICE_KEY",
    // 用户平台
    CUSTOMER: "CUSTOMER_NOTICE_KEY",
}

export function getSysNoticeCookies() {
    const userSysNoticeKey = store.getters.platId;
    return Cookies.get(SysNoticeKey[userSysNoticeKey])
}

export function setSysNoticeCookies() {
    const userSysNoticeKey = store.getters.platId;
    return Cookies.set(SysNoticeKey[userSysNoticeKey], true)
}

export function removeSysNoticeCookies() {
    const userSysNoticeKey = store.getters.platId;
    return Cookies.remove(SysNoticeKey[userSysNoticeKey])
}
