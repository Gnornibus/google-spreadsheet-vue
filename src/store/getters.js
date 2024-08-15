const getters = {
    sidebar: state => state.app.sidebar,
    language: state => state.app.language,
    size: state => state.app.size,
    device: state => state.app.device,
    visitedViews: state => state.tagsView.visitedViews,
    cachedViews: state => state.tagsView.cachedViews,
    // 用户信息
    userId: state => state.user.userId,
    roleName: state => state.user.roleName,
    platId: state => state.user.platId,
    account: state => state.user.account,

    name: state => state.user.name,
    avatar: state => state.user.avatar,
    mobile: state => state.user.mobile,
    email: state => state.user.email,
    loginCount: state => state.user.loginCount,
    loginIpAddress: state => state.user.loginIpAddress,
    oldLoginTime: state => state.user.oldLoginTime,
    powers: state => state.user.powers,
    token: state => state.user.token,
    //
    permission_routes: state => state.permission.routes,
    errorLogs: state => state.errorLog.logs,
    menus: state => state.menu.menus,
}
export default getters
