module.exports = {
    /**
     * 网页地址的名称前缀
     *
     * @type {string} title
     * 系统标题
     */
    systemName: '炘星体育助手系统',

    /**
     * 网页地址的名称前缀
     *
     * @type {string} title
     * 系统标题
     */
    htmlTitle: '炘星体育',

    /**
     * 网站所有者
     *
     * @type {string} title
     */
    author: '厦门炘星体育发展有限公司',

    /**
     * @type {boolean} true | false
     * @description 是否显示设置右侧面板
     */
    showSettings: false,

    /**
     * @type {boolean} true | false
     * @description 是否使用tagsView
     */
    tagsView: true,

    /**
     * @type {boolean} true | false
     * @description 是否固定标题
     */
    fixedHeader: true,

    /**
     * @type {boolean} true | false
     * @description 是否在侧边栏显示Logo
     */
    sidebarLogo: true,

    /**
     * @type {boolean} true | false
     * @description 在headerSearch中是否支持拼音搜索
     * 包大小缩小了47.3kb，缩小+压缩了63lkb
     */
    supportPinyinSearch: true,

    /**
     * @type {string | array} 'production' | ['production', 'development']
     * @description 需要显示错误日志组件。
     * 默认值仅用于生产环境
     * 如果您想在开发中也使用它，您可以通过 ['production', 'development']
     */
    errorLog: 'production'
}
