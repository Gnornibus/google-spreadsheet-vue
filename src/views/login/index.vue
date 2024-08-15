<template>
    <div class="login-container">
        <el-form ref="loginForm" :model="loginForm" :rules="loginRules" autocomplete="on" class="login-form"
                 label-position="left">
            <!-- Logo -->
            <div class="title-container">
                <div class="logo">
                    <img :src="require('../../assets/image/logo.png')" alt="logo">
                    <h1 class="title">{{ systemName }}</h1>
                </div>
            </div>
            <!-- 账号 -->
            <el-form-item prop="account">
                <span class="svg-container">
                    <svg-icon icon-class="user"/>
                </span>
                <el-input
                    ref="account"
                    v-model="loginForm.account"
                    :placeholder="$t('login.account')"
                    autocomplete="off"
                    clearable
                    maxlength="64"
                    name="account"
                    style="width: calc(100% - 35px)"
                    tabindex="1"
                    type="text"
                />
            </el-form-item>
            <!-- 密码 -->
            <el-form-item prop="password">
                <span class="svg-container">
                    <svg-icon icon-class="password"/>
                </span>
                <el-tooltip v-model="capsTooltip" :content="$t('login.passwordToolTip')" manual placement="right">
                    <el-input
                        ref="password"
                        v-model="loginForm.password"
                        :placeholder="$t('login.password')"
                        autocomplete="off"
                        clearable
                        maxlength="32"
                        name="password"
                        show-password
                        style="width: calc(100% - 35px)"
                        tabindex="2"
                        type="password"
                        @blur="capsTooltip = false"
                        @keyup.native="checkCapslock"
                        @keyup.enter.native="handleLogin"
                    />
                </el-tooltip>
            </el-form-item>
            <!-- 验证码 -->
            <el-form-item prop="checkCode">
                <span class="svg-container">
                    <svg-icon icon-class="check-code"/>
                </span>
                <el-input
                    ref="checkCode"
                    v-model="loginForm.checkCode"
                    :placeholder="$t('login.checkCode')"
                    autocomplete="off"
                    class="check-code"
                    clearable
                    maxlength="4"
                    name="checkCode"
                    tabindex="3"
                    type="text"
                    @keyup.enter.native="handleLogin()"
                />
                <img :alt="$t('login.checkCodeError')" :src="loginForm.codeImage" class="check-code-img"
                     @click="refreshCode"/>
            </el-form-item>
            <!-- 登录按钮 -->
            <el-button :loading="loading" size="medium" style="width:100%;" type="primary"
                       @click.native.prevent="handleLogin">
                {{ $t('login.loginBtn') }}
            </el-button>
            <!-- 用户注册 -->
            <my-dialog
                :model="registerDialogData.model"
                :modelItem="registerDialogData.modelItem"
                :title="'用户注册'"
                :visible.sync="registerDialogData.visible"
                @close="registerClose"
                @submit="registerConfirm">
                <image-upload
                    ref="registerAvatar"
                    action-url="avatar"
                    class="avatar-uploader"
                    @uploadChange="handleRegisterUploadChange"
                    @uploadSuccess="handleRegisterUploadSuccess">
                    <el-image v-if="registerDialogData.avatarImageUrl" :src="registerDialogData.avatarImageUrl"
                              alt="头像" class="avatar"/>
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </image-upload>
            </my-dialog>
            <!-- 用户操作按钮 -->
            <el-row style="margin-bottom:10px;" v-if="false">
                <el-button style="color: white;font-size: 15px;float: left;" type="text">忘记密码</el-button>
                <el-button style="color: white;font-size: 15px;float: right;" type="text" @click="register">用户注册
                </el-button>
            </el-row>
            <!-- 系统底部信息 -->
            <el-footer>
                <system-footer style="color: white"/>
            </el-footer>
        </el-form>
    </div>
</template>

<script>
import {validAccount, validCheckCode, validPassword} from '@/common/utils/validate'
import SocialSign from './components/SocialSignin'
import {mapState} from "vuex";
import {check} from "@/api/sys-uaa-api";
import SystemFooter from "@/layout/components/common/SystemFooter";
import router from "@/router";
import ResizeMixin from '@/layout/mixin/ResizeHandler'
import MyDialog from '@/components/Dialog';
import i18n from "@/common/lang";
import ImageUpload from "@/components/Upload/ImageUpload";
import {register} from "@/api/open-api";
import store from "@/store";

export default {
    name: 'Login',
    components: {ImageUpload, SocialSign, SystemFooter, MyDialog},
    mixins: [ResizeMixin],
    watch: {
        $route: {
            handler: function (route) {
                const query = route.query
                if (query) {
                    this.redirect = query.redirect
                    this.otherQuery = this.getOtherQuery(query)
                }
            },
            immediate: true
        }
    },
    computed: {
        ...mapState({
            systemName: state => state.settings.systemName,
            author: state => state.settings.author,
            device: state => state.app.device,
        }),
    },
    data() {
        return {
            loginForm: {
                account: '',
                password: '',
                checkCode: '',                                                        //验证码
                checkCodeToken: '',                                                   //验证码令牌
                codeImage: "https://picsum.photos/150/40"                             //验证码图片
            },
            loginRules: {
                account: [{required: true, trigger: 'blur', validator: validAccount}],
                password: [{required: true, trigger: 'blur', validator: validPassword}],
                checkCode: [{required: true, trigger: 'blur', validator: validCheckCode}],
            },
            capsTooltip: false,
            loading: false,
            showDialog: false,
            redirect: undefined,
            otherQuery: {},

            /**
             * 用户注册
             */
            registerDialogData: {
                visible: false,
                modelItem: [
                    {
                        type: 'input',
                        length: 64,
                        key: 'account',
                        name: i18n.t('view.sysUser.account'),
                    },
                    {
                        type: 'password',
                        length: 40,
                        key: 'password',
                        name: i18n.t('view.sysUser.password'),
                    },
                    {
                        type: 'input',
                        length: 10,
                        key: 'name',
                        name: i18n.t('view.sysUser.name'),
                    },
                    {
                        type: 'select',
                        key: 'sex',
                        name: i18n.t('view.sysUser.sex'),
                        options: [
                            {
                                value: "0",
                                name: i18n.t('enum.sex.0'),
                            },
                            {
                                value: "1",
                                name: i18n.t('enum.sex.1'),
                            },
                        ],
                    },
                    {
                        type: 'input',
                        length: 11,
                        key: 'mobile',
                        name: i18n.t('view.sysUser.mobile'),
                    },
                    {
                        required: false,
                        type: 'input',
                        length: 64,
                        key: 'email',
                        name: i18n.t('view.sysUser.email'),
                    },
                    {
                        required: false,
                        type: 'input',
                        length: 18,
                        key: 'cardId',
                        name: i18n.t('view.sysUser.cardId'),
                    },
                ],
                model: {
                    avatar: "",
                },
                avatarImageUrl: "",
            },
        }
    },
    methods: {
        checkCapslock(e) {
            const {key} = e
            this.capsTooltip = key && key.length === 1 && (key >= 'A' && key <= 'Z')
        },
        showPwd() {
            if (this.passwordType === 'password') {
                this.passwordType = ''
            } else {
                this.passwordType = 'password'
            }
            this.$nextTick(() => {
                this.$refs.password.focus()
            })
        },
        handleLogin() {
            this.$refs.loginForm.validate(valid => {
                if (valid) {
                    this.loading = true
                    this.$store.dispatch('user/login', this.loginForm).then((res) => {
                        if (this.redirect) {
                            router.push({path: this.redirect || '/dashBoard', query: this.otherQuery});
                        } else {
                            router.push({name: "dashBoard"})
                        }
                        this.loading = false
                    }).catch(() => {
                        this.refreshCode();
                        this.loading = false;
                    })
                } else {
                    this.$message.warning("请输入完整的登录信息！")
                    return false
                }
            })
        },
        getOtherQuery(query) {
            return Object.keys(query).reduce((acc, cur) => {
                if (cur !== 'redirect') {
                    acc[cur] = query[cur]
                }
                return acc
            }, {})
        },
        //刷新验证码图片
        refreshCode() {
            this.loginForm.checkCode = '';
            check().then((res) => {
                this.loginForm.codeImage = res.data.imgBase64;
                this.loginForm.checkCodeToken = res.data.checkCodeToken;
            })
        },

        /**
         * 头像上传
         */
        // 用户注册
        register() {
            this.registerDialogData.visible = true;
        },
        // 选择的图片变化回调
        handleRegisterUploadChange(file, fileList) {
            this.registerDialogData.avatarImageUrl = URL.createObjectURL(file.raw);
        },
        // 注册用户上传成功回调
        handleRegisterUploadSuccess(response, file, fileList) {
            if (response.code === 20000) {
                this.registerDialogData.model.avatar = response.data;
                // 注册用户
                register(this.registerDialogData.model).then((res) => {
                    debugger
                    if (res.data) {
                        this.$message.success(i18n.t('common.success'));
                        this.registerDialogData.visible = false;
                    } else {
                        this.$message.error(i18n.t('common.error') + ":" + res.data);
                    }
                }).finally(() => {
                    this.registerDialogData.visible = false;
                });
            } else {
                this.$message.error(response.data)
            }
        },
        // 用户注册
        registerConfirm() {
            this.$confirm("确定要注册当前用户？", i18n.t('common.messageBox.tips'), {
                confirmButtonText: i18n.t('common.btn.confirmBtnName'),
                cancelButtonText: i18n.t('common.btn.cancelBtnName'),
                type: 'warning'
            }).then(() => {
                if (this.registerDialogData.avatarImageUrl === '') {
                    this.$message.error("请上传用户头像，最好是个人大头像")
                } else {
                    this.$refs.registerAvatar.submit();
                }
            });
        },
        // 关闭注册界面
        registerClose() {
            this.registerDialogData.model = {};
            this.registerDialogData.avatarImageUrl = null;
            this.registerDialogData.visible = false;
        },
    },
    created() {
        // window.addEventListener('storage', this.afterQRScan)
        // 清除用户token和重置用户令牌
        store.dispatch('user/resetToken')
        // 刷新验证码
        this.refreshCode();
    },
    mounted() {
        if (this.loginForm.account === '') {
            this.$refs.account.focus()
        } else if (this.loginForm.password === '') {
            this.$refs.password.focus()
        }
    },
    destroyed() {
        // window.removeEventListener('storage', this.afterQRScan)
    },
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$light_gray: #fff;
$cursor: #fff;

/* 移动端样式 */
@media screen and (max-width: 768px) {
    .login-container {
        width: 100vw;
        height: 100vh;
        background-size: cover;
        display: flex;
        justify-content: center;
        align-items: center;
        background: url("../../assets/image/background.png") no-repeat center center;

        .title {
            font-size: 28px;
            margin-top: 20px;
        }

        .login-form {
            margin: 10px !important;
        }

        .svg-container {
            display: none;
        }

        .el-input {
            font-size: 16px;
            height: 45px;
            padding-left: 15px;
            border-radius: 5px;
        }

        .el-button {
            height: 45px;
            font-size: 16px;
            border-radius: 5px;
        }

        // 大小写提示
        .el-tooltip {
            display: none;
        }

        // 验证码框
        .check-code {
            width: calc(100% - 200px) !important;
        }

        // 验证码图片
        .check-code-img {
            float: right;
            margin: 5px;
        }
    }
}

/* 桌面端样式 */
@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
    .login-container .el-input input {
        color: $cursor;
    }
}

/* reset element-ui css */
.login-container {
    width: 100vw;
    height: 100vh;
    background-size: cover;
    display: flex;
    justify-content: center;
    align-items: center;
    background-image: url("../../assets/image/background.png");

    .el-input {
        display: inline-block;
        height: 47px;
        width: 85%;

        input {
            background: transparent;
            border: 0px;
            -webkit-appearance: none;
            border-radius: 0px;
            padding: 12px 5px 12px 15px;
            // 字体颜色
            color: $light_gray;
            height: 47px;
            // 光标颜色
            caret-color: $cursor;

        }
    }

    .el-form-item {
        border: 1px solid rgba(255, 255, 255, 0.6);
        background: rgba(0, 0, 0, 0.6);
        border-radius: 5px;
        color: #454545;
    }

    .check-code {
        width: 60%;
    }

    .check-code-img {
        float: right;
        margin: 5px;
    }

}
</style>

<style lang="scss" scoped>
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
    min-height: 100%;
    width: 100%;
    overflow: hidden;

    .login-form {
        position: relative;
        width: 520px;
        max-width: 100%;
        margin: 0 auto;
        overflow: hidden;

        .input {
            width: 100%;
        }
    }

    .tips {
        font-size: 14px;
        color: #fff;
        margin-bottom: 10px;

        span {
            &:first-of-type {
                margin-right: 16px;
            }
        }
    }

    .svg-container {
        padding: 6px 5px 6px 15px;
        color: $dark_gray;
        vertical-align: middle;
        width: 30px;
        display: inline-block;
    }

    .title-container {
        position: relative;

        .title {
            font-size: 30px;
            color: $light_gray;
            margin: 0 auto 30px auto;
            text-align: center;
            font-weight: bold;
        }

        .set-language {
            color: #fff;
            position: absolute;
            top: 3px;
            font-size: 18px;
            right: 0px;
            cursor: pointer;
        }

        .logo {
            text-align: center;
        }

        .logo img {
            width: 100px;
            height: 100px;
        }

    }

    .show-pwd {
        position: absolute;
        right: 10px;
        top: 7px;
        font-size: 16px;
        color: $dark_gray;
        cursor: pointer;
        user-select: none;
    }

}
</style>
