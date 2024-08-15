export const CommonEnum = {
    // 用户平台的所有地址
    customerRedirectEnum: ['/home', '/course', '/media', '/profile'],
    // 白名单界面
    // 路由白名单列表，把路由添加到这个数组，不用登陆也可以访问,无重定向白名单
    whiteListEnum: ['/login', '/auth-redirect', '/401', '/404', '/home'],
    enableDisable: {
        // 停用
        disable: '0',
        // 启用
        enable: '1'
    },
    dictType: {
        // 系统字典
        sys: '0',
        // 业务字典
        biz: '1'
    },
    // 平台
    platId: {
        // 超级管理员平台
        SUPER: "SUPER",
        // 管理平台
        ADMIN: "ADMIN",
        // 服务商平台
        AGENT: "AGENT",
        // 营地平台
        CAMP: "CAMP",
        // 用户平台
        CUSTOMER: "CUSTOMER",
    },
    // 设备枚举
    devicesEnum: {
        // 桌面端
        DESKTOP: "desktop",
        // 移动端
        MOBILE: "mobile",
    },
    // 订单支付状态
    orderStateEnum: {
        // 未支付
        UNPAID: 0,
        // 已支付
        PAID: 1,
        // 取消
        CANCEL: 2,
    },
    // 角色编号信息
    roleIdEnum: {
        // 超级管理员
        Super: -1,
        // 客户端管理员
        admin: 1,
        // 客户端用户
        user: 2,
        // 微信小程序教练
        coach: 3,
        // 微信小程序学员
        customer: 4,
    },
}
