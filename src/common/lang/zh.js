import SysDataLang from "@/common/lang/view/zh/System/SysDataLang";
import SysFeedbackLangLang from "@/common/lang/view/zh/System/SysFeedbackLang";
import SysBannerLang from "@/common/lang/view/zh/System/SysBannerLang";
import SysDictLang from "@/common/lang/view/zh/System/SysDictLang";
import SysDictItemLang from "@/common/lang/view/zh/System/SysDictItemLang";
import SysFileRecordLang from "@/common/lang/view/zh/System/SysFileRecordLang";
import SysLogLang from "@/common/lang/view/zh/System/SysLogLang";
import SysMenuLang from "@/common/lang/view/zh/System/SysMenuLang";
import SysNoticeLang from "@/common/lang/view/zh/System/SysNoticeLang";
import SysParamLang from "@/common/lang/view/zh/System/SysParamLang";
import SysPlatLang from "@/common/lang/view/zh/System/SysPlatLang";
import SysRoleLang from "@/common/lang/view/zh/System/SysRoleLang";
import SysTaskLang from "@/common/lang/view/zh/System/SysTaskLang";
import SysTenantLang from "@/common/lang/view/zh/System/SysTenantLang";
import SysUserLang from "@/common/lang/view/zh/System/SysUserLang";
import CommonViewLang from "@/common/lang/view/zh/CommonViewLang";
import BasicEnumLang from "@/common/lang/view/zh/BasicEnumLang";
import BasicRouterLang from "@/common/lang/view/zh/BasicRouterLang";
import BasicBtnLang from "@/common/lang/view/zh/BasicBtnLang";
import BasicToolLang from "@/common/lang/view/zh/BasicToolLang";
import BasicMessageBoxLang from "@/common/lang/view/zh/BasicMessageBoxLang";
import BasicTableLang from "@/common/lang/view/zh/BasicTableLang";
import SportChatInfoLang from "@/common/lang/view/zh/Sport/SportChatInfoLang"
import SportChatLang from "@/common/lang/view/zh/Sport/SportChatLang"
import SportCoachLang from "@/common/lang/view/zh/Sport/SportCoachLang"
import SportMemberKeyLang from "@/common/lang/view/zh/Sport/SportMemberKeyLang"
import SportMemberTypeLang from "@/common/lang/view/zh/Sport/SportMemberTypeLang"
import SportOrderLang from "@/common/lang/view/zh/Sport/SportOrderLang"
import SportProjectClassLang from "@/common/lang/view/zh/Sport/SportProjectClassLang"
import SportProjectLang from "@/common/lang/view/zh/Sport/SportProjectLang"
import SportScoreInfoLang from "@/common/lang/view/zh/Sport/SportScoreInfoLang"
import SportScoreLang from "@/common/lang/view/zh/Sport/SportScoreLang"
import SportScoreRangeLang from "@/common/lang/view/zh/Sport/SportScoreRangeLang"
import SportVideoHistoryLang from "@/common/lang/view/zh/Sport/SportVideoHistoryLang"
import SportVideoLang from "@/common/lang/view/zh/Sport/SportVideoLang"

export default {
    enum: {
        ...BasicEnumLang
    },
    common: {
        backToTop: '返回顶部',
        success: "成功",
        error: "失败",
        messageBox: {
            ...BasicMessageBoxLang
        },
        dialog: {
            dialogAddTitle: "新增",
            dialogModifyTitle: "编辑",
            dialogInfoTitle: "详情",
            dialogBatchTitle: "批量新增",
        },
        btn: {
            ...BasicBtnLang
        },
        tool: {
            ...BasicToolLang
        },
    },
    login: {
        loginBtn: '登录',
        account: '账号',
        password: '密码',
        passwordToolTip: '您开启了大写锁定',
        checkCode: '验证码',
        checkCodeError: '验证码加载失败',
        any: '随便填',
    },
    table: {
        ...BasicTableLang
    },
    component: {
        excel: {
            unKnownHeader: "未知标题",
        }
    },
    router: {
        ...BasicRouterLang
    },
    tagsView: {
        refresh: '刷新',
        close: '关闭',
        closeOthers: '关闭其它',
        closeAll: '关闭所有'
    },
    settings: {
        title: '系统布局配置',
        theme: '主题色',
        tagsView: '开启 Tags-View',
        fixedHeader: '固定 Header',
        sidebarLogo: '侧边栏 Logo'
    },
    navbar: {
        dashBoard: '首页',
        logOut: '退出登录',
        profile: '个人中心',
        size: '布局大小'
    },
    profile: {
        title: '个人中心',
    },
    view: {
        ...SysDataLang,
        ...SysBannerLang,
        ...SysDictLang,
        ...SysDictItemLang,
        ...SysFeedbackLangLang,
        ...SysFileRecordLang,
        ...SysLogLang,
        ...SysMenuLang,
        ...SysNoticeLang,
        ...SysParamLang,
        ...SysPlatLang,
        ...SysRoleLang,
        ...SysTaskLang,
        ...SysTenantLang,
        ...SysUserLang,
        ...CommonViewLang,
        ...SportChatInfoLang,
        ...SportChatLang,
        ...SportCoachLang,
        ...SportMemberKeyLang,
        ...SportMemberTypeLang,
        ...SportOrderLang,
        ...SportProjectClassLang,
        ...SportProjectLang,
        ...SportScoreInfoLang,
        ...SportScoreLang,
        ...SportScoreRangeLang,
        ...SportVideoHistoryLang,
        ...SportVideoLang,
    },
}
