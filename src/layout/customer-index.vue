<template>
    <div class="customer-container">
        <el-header class="header-container">
            <nav-bar />
        </el-header>
        <el-container class="container">
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
            <main-container />
        </el-container>
        <el-footer class="footer-container">
            <tab-bar />
        </el-footer>
    </div>
</template>

<script>
import ResizeMixin from "@/layout/mixin/ResizeHandler";
import MyDialog from "@/components/Dialog";
import {MainContainer, NavBar, TabBar} from "@/layout/components/customer";
import {getSysNoticeCookies, setSysNoticeCookies} from "@/common/utils/cookies-util";
import {queryPageSysNotice} from "@/api/sys-notice-api";

export default {
    name: "customer-index",
    components: {TabBar, NavBar, MainContainer, MyDialog},
    mixins: [ResizeMixin],
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
    }
}
</script>

<style lang="scss">
/*整个页面视图*/
.customer-container {
    // 头部
    .header-container {
        width: 100%;
        padding: 0;
        margin: 0;
        height: 50px !important;
        line-height: 50px;
        font-size: 20px;
        color: white;
        text-align: center;
        background-color: #55b4ff;
    }

    // 内容
    .container {
        width: 100%;
        padding: 0;
        margin: 0;
        height: calc(100vh - 110px);
        z-index: 10000;
    }

    // 底部
    .footer-container {
        z-index: 10;
        padding: 0;
        background-color: #F9F9F9;
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        display: flex;
        justify-content: space-around;
        align-items: center;
        box-shadow: 0px -1px 3px rgba(0, 0, 0, 0.15);
    }
}
</style>

<!-- 通知框样式 -->
<style lang="scss">
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
