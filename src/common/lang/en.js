import SysDataLang from "@/common/lang/view/en/SysDataLang";
import SysFeedbackLangLang from "@/common/lang/view/en/SysFeedbackLang";
import SysFileRecordLang from "@/common/lang/view/en/SysFileRecordLang";
import SysLogLang from "@/common/lang/view/en/SysLogLang";
import SysMenuLang from "@/common/lang/view/en/SysMenuLang";
import SysNoticeLang from "@/common/lang/view/en/SysNoticeLang";
import SysParamLang from "@/common/lang/view/en/SysParamLang";
import SysPlatLang from "@/common/lang/view/en/SysPlatLang";
import SysRoleLang from "@/common/lang/view/en/SysRoleLang";
import SysTaskLang from "@/common/lang/view/en/SysTaskLang";
import SysUserLang from "@/common/lang/view/en/SysUserLang";
import CommonViewLang from "@/common/lang/view/en/CommonViewLang";

export default {
    enum: {
        unknown: "Unknown Data",
        // 性别
        sex: {
            0: "Female",
            1: "Male",
        },
        // 通用状态
        state: {
            0: "Disabled",
            1: "Enabled",
        },
        // 营员状态
        camperState: {
            0: "Unregistered",
            1: "Registered",
            2: "Camp Completed",
        },
        // 订单状态
        orderState: {
            0: "Unpaid",
            1: "Paid",
            2: "Cancelled",
        },
        // 营会状态
        termState: {
            0: "Registration Open",
            1: "Camp Pending",
            2: "Camp in Progress",
            3: "Camp Completed",
        },
        // 反馈状态
        feedbackState: {
            0: "Unprocessed",
            1: "Processing",
            2: "Resolved",
            3: "Closed",
        },
        // 交易状态
        tradeStatus: {
            WAIT_BUYER_PAY: "Waiting for Buyer Payment",
            TRADE_SUCCESS: "Transaction Success",
            TRADE_CLOSED: "Transaction Closed",
            TRADE_FINISHED: "Transaction Finished",
            TRADE_PENDING: "Waiting for Seller to Receive Payment",
            TRADE_FAILED: "Transaction Failed",
        },
        // 反馈状态
        noticeState: {
            0: "Disabled",
            1: "Enabled",
        },
        // 反馈状态
        operation: {
            0: "Pending",
            1: "In Progress",
        },
        // 付款方式
        alipayFundChannel: {
            COUPON: "Alipay Red Packet",
            ALIPAYACCOUNT: "Alipay Account",
            PCREDIT: "Huabei",
            POINT: "Ant Points",
            DISCOUNT: "Discount Voucher",
            MDISCOUNT: "Merchant Discount Voucher",
            MCOUPON: "Merchant Red Packet"
        },
        // 营会类型
        termType: {
            0: "STEM Camp",
            1: "Language Camp",
            2: "Science Camp",
            3: "Creative Camp",
            4: "Leadership Camp",
            5: "Outdoor Camp",
            6: "Sports Camp",
            7: "Parent-Child Camp",
            8: "Customized Camp",
        },
        // 横幅类型
        bannerType: {
            0: "image/jpg",
            1: "image/jpeg",
            2: "image/png",
        },
        // 照片类型
        photoType: {
            0: "image/jpg",
            1: "image/jpeg",
            2: "image/png",
        },
        // 视频类型
        videoType: {
            0: "image/mp4",
        },
        // 时长类型
        durationType: {
            0: "1-Day Camp",
            1: "3-Day Camp",
            2: "5-Day Camp",
            3: "7-Day Camp",
            4: "Summer Camp",
            5: "Winter Camp",
            6: "Customized Camp",
        },
        // 反馈类型
        feedbackType: {
            0: "System Bug",
            1: "Feature Suggestion",
        },
        // 反馈类型
        noticeType: {
            0: "System Notification",
            1: "Task Notification",
            2: "Event Notification",
        },
        // 支付方式
        channel: {
            0: "Cash",
            1: "Alipay",
            2: "WeChat Pay",
        },
        // 反馈处理优先级
        priority: {
            0: "Priority 1",
            1: "Priority 2",
            2: "Priority 3",
        }
    },
    common: {
        backToTop: 'Back to Top',
        success: "Success",
        error: "Error",
        confirmBtn: "Confirm",
        cancelBtn: "Cancel",
        confirm: {
            tips: "Tips",
            add: {
                title: "Are you sure to create the current object?",
            },
            delete: {
                title: "Are you sure to delete the current object?",
            },
            modify: {
                title: "Are you sure to modify the current object and submit?",
            },
            batchDelete: {
                title: "Are you sure to batch delete the current object?",
            },
            resetPwd: {
                title: "Are you sure to reset the password of the current object?",
            },
        },
        dialog: {
            dialogAddTitle: "Add",
            dialogModifyTitle: "Edit",
            dialogInfoTitle: "Details",
            dialogBatchTitle: "Batch Add",
        },
        btn: {
            searchBtnName: "Search",
            resetBtnName: "Reset",
            addBtnName: "Add",
            infoBtnName: "Details",
            modifyBtnName: "Edit",
            deleteBtnName: "Delete",
            batchAddBtnName: "Batch Add",
            batchDeleteBtnName: "Batch Delete",
            resetPwdBtnName: "Reset Password",
        },
        tool: {
            exportTemplate: "Export Template",
            exportSuccess: "The backend begins to export silently. The completion will be prompted. Please wait.",
            exportError: "Export option exception",
            exportChooseNullError: "No data can be exported based on the current search conditions",
            batchExport: {
                choose: "Batch export selected items (within 10,000)",
                query: "Batch export items based on search conditions (within 10,000)",
                all: "Batch export all items in the current table view (within 10,000)",

            },
        },
    },
    login: {
        loginBtn: 'Login',
        account: 'Account',
        password: 'Password',
        passwordToolTip: 'Caps Lock is on',
        checkCode: 'Verification Code',
        checkCodeError: 'Failed to load verification code',
        any: 'Any',
    },
    table: {
        id: 'ID',
        operation: 'Operation',
        filterPane: {
            lastDay: 'Last Day',
            lastWeek: 'Last Week',
            lastMonth: 'Last Month',
            lastSeason: 'Last Season',
            LastHalfYear: 'Last Half Year',
            lastYear: 'Last Year',
        },
        filterBtn: {
            search: 'Search',
            reset: 'Reset',
            add: 'Add',
            batchAdd: 'Batch Add',
            batchDelete: 'Batch Delete',
            export: 'Batch Export',
            start: 'Start',
            end: 'End',
        },
        dynamicTips1: 'Fixed Header, Sorted by Header order',
        dynamicTips2: 'Unfixed Header, Sorted by Click order',
        dragTips1: 'Default Order',
        dragTips2: 'Order after dragging',
        title: 'Title',
        importance: 'Importance',
        type: 'Type',
        remark: 'Remark',
        reviewer: 'Reviewer',
        date: 'Date',
        author: 'Author',
        readings: 'Readings',
        status: 'Status',
        actions: 'Actions',
        edit: 'Edit',
        publish: 'Publish',
        draft: 'Draft',
        delete: 'Delete',
        cancel: 'Cancel',
        confirm: 'Confirm'
    },
    component: {
        excel: {
            unKnownHeader: "Unknown Title",
        }
    },
    route: {
        // 首页
        chart: 'Homepage',
        dashBoard: 'Homepage',
        // 系统管理
        system: 'System',
        sysPlat: 'Platform',
        sysParam: 'Parameters',
        sysMenu: 'Menus',
        sysNotice: 'Notifications',
        sysFeedback: 'Feedbacks',
        // 用户管理
        user: 'User',
        sysUser: 'Users',
        sysRole: 'Roles',
        sysPower: 'Permissions',
        // 定时管理
        task: 'Task',
        sysTask: 'Tasks',
        // 数据管理
        data: 'Data',
        sysData: 'Data',
        // 文件管理
        file: 'File',
        sysFileRecord: 'Files',
        // 日志管理
        log: 'Log',
        sysLog: 'Logs',
        // 测试管理
        test: 'Test',
        sysTest: 'Tests',
    },
    tagsView: {
        refresh: 'Refresh',
        close: 'Close',
        closeOthers: 'Close Others',
        closeAll: 'Close All'
    },
    settings: {
        title: 'System Layout Configuration',
        theme: 'Theme Color',
        tagsView: 'Open Tags-View',
        fixedHeader: 'Fixed Header',
        sidebarLogo: 'Sidebar Logo'
    },
    navbar: {
        dashBoard: 'Homepage',
        logOut: 'Log Out',
        profile: 'Profile',
        size: 'Layout Size'
    },
    profile: {
        title: 'Profile',
    },
    view: {
        ...CommonViewLang,
        ...SysDataLang,
        ...SysFeedbackLangLang,
        ...SysFileRecordLang,
        ...SysLogLang,
        ...SysMenuLang,
        ...SysNoticeLang,
        ...SysParamLang,
        ...SysPlatLang,
        ...SysRoleLang,
        ...SysTaskLang,
        ...SysUserLang,
    },
}
