<template>
    <div :class="classObj" class="app-wrapper">
        <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
        <sidebar class="sidebar-container" />
        <!-- 个人中心 -->
        <profile />
        <!-- 视图容器 -->
        <div :class="{hasTagsView:needTagsView}" class="main-container">
            <!-- 通知 -->
            <my-dialog
                :cancelBtn="noticeDialogData.cancelBtn"
                :title="noticeDialogData.title"
                :visible.sync="noticeDialogData.visible"
                class="notice-dialog"
                @submit="sysNoticeSubmit">
                <div class="notice-content">
                    {{ noticeDialogData.content }}
                </div>
            </my-dialog>
            <!-- 固定钉 -->
            <div :class="{'fixed-header':fixedHeader}">
                <navbar />
                <tags-view v-if="needTagsView" />
            </div>
            <app-main />
            <!-- 系统底部信息 -->
            <el-footer style="text-align: center;height: 25px;padding: 0;">
                <system-footer />
            </el-footer>
            <!-- 系统设置 -->
            <right-panel v-if="showSettings">
                <settings />
            </right-panel>
        </div>
    </div>
</template>

<script>
import RightPanel from '@/components/RightPanel'
import {AppMain, Navbar, Profile, Settings, Sidebar, TagsView} from '@/layout/components/admin'
import ResizeMixin from './mixin/ResizeHandler'
import {mapState} from 'vuex'
import SystemFooter from "@/layout/components/common/SystemFooter";
import {getSysNoticeCookies, setSysNoticeCookies} from "@/common/utils/cookies-util";
import {queryPageSysNotice} from "@/api/sys-notice-api";
import MyDialog from "@/components/Dialog";

export default {
    name: 'Layout',
    components: {
        AppMain,
        Navbar,
        RightPanel,
        Settings,
        Sidebar,
        TagsView,
        Profile,
        SystemFooter,
        MyDialog
    },
    mixins: [ResizeMixin],
    computed: {
        ...mapState({
            systemName: state => state.settings.systemName,
            author: state => state.settings.author,
        }),
        ...mapState({
            sidebar: state => state.app.sidebar,
            device: state => state.app.device,
            showSettings: state => state.settings.showSettings,
            needTagsView: state => state.settings.tagsView,
            fixedHeader: state => state.settings.fixedHeader
        }),
        classObj() {
            return {
                hideSidebar: !this.sidebar.opened,
                openSidebar: this.sidebar.opened,
                withoutAnimation: this.sidebar.withoutAnimation,
                mobile: this.device === 'mobile'
            }
        }
    },
    created() {
        // 获取系统通知
        this.sysNotice();
    },
    data() {
        return {
            // 通知对话框数据
            noticeDialogData: {
                visible: false,
                cancelBtn: false,
                title: "",
                content: "",
            },
        }
    },
    methods: {
        /**
         * 通知对话框
         */
        sysNotice() {
            const sysNoticeCookies = getSysNoticeCookies();
            if (sysNoticeCookies === undefined || sysNoticeCookies === "false") {
                queryPageSysNotice({size: -1, platId: this.$store.getters.platId, notice_state: '1'}).then(res => {
                    if (res.data.records.length > 0) {
                        this.noticeDialogData.content = res.data.records[0].content;
                        this.noticeDialogData.title = res.data.records[0].title;
                        this.noticeDialogData.visible = true;
                    }
                })
            }
        },
        // 确认通知
        sysNoticeSubmit() {
            setSysNoticeCookies();
            this.noticeDialogData.visible = false;
        },
        handleClickOutside() {
            this.$store.dispatch('app/closeSideBar', {withoutAnimation: false})
        }
    }
}
</script>

<style lang="scss" scoped>
@import "~@/assets/css/scss/mixin.scss";
@import "~@/assets/css/scss/variables.scss";

.app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;

    &.mobile.openSidebar {
        position: fixed;
        top: 0;
    }
}

.drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
}

.fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9;
    width: calc(100% - #{$sideBarWidth});
    transition: width 0.28s;
}

.hideSidebar .fixed-header {
    width: calc(100% - 54px)
}

.mobile .fixed-header {
    width: 100%;
}

.main-container {
    overflow-y: scroll;
    overflow-x: hidden;
    background: #ffffff;
    height: 100%;
    padding-left: 5px;
    /*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/

    &::-webkit-scrollbar {
        width: 6px;
        height: 6px;
    }

    /*定义滚动条轨道背景部分*/

    &::-webkit-scrollbar-track-piece {
        background-color: #ffffff;
        -webkit-border-radius: 6px;
    }

    /*定义滑块 内阴影+圆角*/

    &::-webkit-scrollbar-thumb:vertical {
        height: 5px;
        border-radius: 10px;
        background-color: #d9d2d2;
        -webkit-border-radius: 6px;
    }
}
</style>

<!-- 通知框样式 -->
<style lang="scss" scoped>

.notice-dialog{
    margin-top: 10%;
}
.notice-content {
    line-height: 30vh;
    text-align: center;
}

@media screen and (max-width: 500px) {
    .notice-dialog {
        width: 70%;
        height: 50vh;
        border-radius: 30px;
        margin: 200px auto auto auto !important;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .notice-content {
        font-size: 16px;
        height: 35vh;
        line-height: 35vh;
        max-height: 500px;
        text-align: center;
    }
}
</style>
