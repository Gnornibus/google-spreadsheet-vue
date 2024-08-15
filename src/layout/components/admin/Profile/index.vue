<template>
    <el-drawer
        :size="infoSize"
        :title="$t('profile.title')"
        :visible.sync="$store.state.app.profileVisible"
        class="center-title">
        <div style="padding:0 5%;">
            <!-- 头像信息 -->
            <div class="user-profile">
                <div class="box-center">
                    <pan-thumb :hoverable="false" :image="user.avatar | imageFileFilter" />
                </div>
                <div class="box-center">
                    <div class="user-name text-center">{{ user.name | dataFilter }}</div>
                    <div class="user-role text-center text-muted">{{ roleName | dataFilter }}</div>
                </div>
            </div>

            <div class="user-bio">
                <div class="user-education user-bio-section">
                    <div class="user-bio-section-header">
                        <svg-icon icon-class="education" />
                        <span>账户: </span>{{ user.account | dataFilter }}
                    </div>
                </div>
                <div class="user-education user-bio-section">
                    <div class="user-bio-section-header">
                        <svg-icon icon-class="education" />
                        <span>手机号: </span>{{ user.mobile | dataFilter }}
                    </div>
                </div>
                <div class="user-education user-bio-section">
                    <div class="user-bio-section-header">
                        <svg-icon icon-class="education" />
                        <span>邮箱: </span>{{ user.email | dataFilter }}
                    </div>
                </div>
                <div class="user-education user-bio-section">
                    <div class="user-bio-section-header">
                        <svg-icon icon-class="education" />
                        <span>登录次数: </span>{{ user.loginCount | dataFilter }}
                    </div>
                </div>
                <div class="user-education user-bio-section">
                    <div class="user-bio-section-header">
                        <svg-icon icon-class="education" />
                        <span>上次登录IP地址: </span>{{ user.oldLoginIpAddress | dataFilter }}
                    </div>
                </div>

                <div class="user-education user-bio-section">
                    <div class="user-bio-section-header">
                        <svg-icon icon-class="education" />
                        <span>上次登录时间：</span>{{ user.oldLoginTime | dataFilter }}
                    </div>
                </div>

            </div>
            <el-footer class="info-footer">
                <el-button type="primary" @click="infoEdit">修改信息</el-button>
                <el-button type="danger" @click="infoEditPwd">修改密码</el-button>
            </el-footer>
            <el-drawer
                :append-to-body="true"
                :before-close="sonClose"
                :visible.sync="sonInfoVisible"
                title="修改信息">
                <image-upload
                    ref="uploadAvatar"
                    action-url="avatar"
                    class="avatar-uploader"
                    @uploadChange="handleUploadChange"
                    @uploadSuccess="handleUploadSuccess">
                    <el-image v-if="editUser.imageUrl" :src="editUser.imageUrl | imageFileFilter" alt="头像" class="avatar"/>
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </image-upload>
                <el-form
                    ref="sonEditForm"
                    :model="editUser"
                    :rules="sonEditFormRules"
                    style="padding: 0 5%">
                    <el-form-item label="用户名" prop="name">
                        <el-input v-model="editUser.name" :placeholder="user.name" />
                    </el-form-item>
                    <el-form-item label="手机号" prop="mobile">
                        <el-input v-model="editUser.mobile" :placeholder="user.mobile" />
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="editUser.email" :placeholder="user.email" />
                    </el-form-item>
                </el-form>
                <el-footer style="text-align: center;">
                    <el-button type="primary" @click="sonSubmit">确定</el-button>
                    <el-button type="danger" @click="()=>{this.sonInfoVisible=false}">取消</el-button>
                </el-footer>
            </el-drawer>
            <el-drawer
                :append-to-body="true"
                :before-close="sonPwdClose"
                :visible.sync="sonInfoPwdVisible"
                title="修改密码">
                <el-form ref="sonEditPwdForm" :model="editUserPwd" :rules="sonEditPwdFormRules" style="padding: 0 5%">
                    <el-form-item label="输入旧密码" prop="oldPassword">
                        <el-input v-model="editUserPwd.oldPassword" type="password" />
                    </el-form-item>
                    <el-form-item label="输入新密码" prop="newPassword">
                        <el-input v-model="editUserPwd.newPassword" type="password" />
                    </el-form-item>
                    <el-form-item label="确认新密码" prop="renewPassword">
                        <el-input v-model="editUserPwd.renewPassword" type="password" />
                    </el-form-item>
                </el-form>
                <el-footer style="text-align: center;">
                    <el-button type="primary" @click="sonPwdSubmit">确定</el-button>
                    <el-button type="danger" @click="()=>{this.sonInfoPwdVisible=false}">取消</el-button>
                </el-footer>
            </el-drawer>
        </div>
    </el-drawer>
</template>

<script>
import {mapGetters} from "vuex";
import PanThumb from '@/components/PanThumb'
import {modifyPwd, saveSysUser, selectSysUser} from "@/api/sys-uaa-api";
import i18n from "@/common/lang";
import {validateInput} from "@/common/utils/validate";
import ImageUpload from "@/components/Upload/ImageUpload";
import store from "@/store";

export default {
    name: "Profile",
    components: {PanThumb, ImageUpload},
    computed: {
        ...mapGetters([
            'id',
            'roleName',
        ])
    },
    data() {
        let reValidatePassword = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再输入密码!'));
            } else if (value !== this.editUserPwd.newPassword) {
                callback(new Error("前后密码不一致！"))
            } else {
                callback();
            }
        };
        return {
            actionUrl: "/file/image/uploadAvatar",
            sonInfoVisible: false,
            sonInfoPwdVisible: false,
            infoSize: '30%',
            user: {
                id: '',
                roleName: '',
                account: '',
                name: '',
                avatar: '',
                mobile: '',
                email: '',
                loginCount: '',
                oldLoginIpAddress: '',
                oldLoginTime: '',
            },
            editUser: {
                id: '',
                name: '',
                avatar: '',
                mobile: '',
                email: '',
                imageUrl: "",
            },
            sonEditFormRules: {
                name: [{required: true, trigger: 'blur', validator: validateInput}],
                mobile: [{required: true, trigger: 'blur', validator: validateInput}],
                email: [{required: true, trigger: 'blur', validator: validateInput}],
            },
            editUserPwd: {
                id: '',
                oldPassword: "",
                newPassword: "",
                renewPassword: "",
            },
            // 修改密码表单校验规则
            sonEditPwdFormRules: {
                oldPassword: [
                    {required: true, message: '请输入旧密码...', trigger: 'blur'},
                    {validator: this.validPassword, trigger: 'change'}
                ],
                newPassword: [
                    {required: true, message: '请输入新密码...', trigger: 'blur'},
                    {validator: this.validPassword, trigger: 'change'}
                ],
                renewPassword: [
                    {required: true, message: '请再输入新密码...', trigger: 'blur'},
                    {validator: reValidatePassword, trigger: 'change'}
                ],
            },
        }
    },
    created() {
        // 获取用户详情
        store.dispatch('user/getInfo').then(user => {
            this.user = user
        })
    },
    methods: {
        // 图片上传成功回调
        handleUploadSuccess(response, file, fileList) {
            if (response.code === 20000) {
                this.editUser.avatar = response.data;
                this.saveUserInfo(); // 保存用户信息
            } else {
                this.$message.error(response.data)
            }
        },
        // 选择的图片变化回调
        handleUploadChange(file, fileList) {
            this.editUser.imageUrl = URL.createObjectURL(file.raw);
        },
        openDrawer() {
            selectSysUser({id: this.id}).then((res) => {
                this.user = res.data
            })
        },
        infoEdit() {
            this.infoSize = '40%';
            this.sonInfoVisible = true;
            this.editUser.id = this.user.id;
            this.editUser.avatar = this.user.avatar;
            this.editUser.imageUrl = this.user.avatar;
            this.editUser.name = this.user.name;
            this.editUser.mobile = this.user.mobile;
            this.editUser.email = this.user.email;
        },
        infoEditPwd() {
            this.infoSize = '40%'
            this.sonInfoPwdVisible = true
        },
        sonClose(done) {
            this.$confirm("当前操作数据未更新！", i18n.t('common.messageBox.tips'), {
                confirmButtonText: i18n.t('common.btn.confirmBtnName'),
                cancelButtonText: i18n.t('common.btn.cancelBtnName'),
                type: 'warning'
            }).then(_ => {
                this.infoSize = '30%'
                done();
            }).catch(_ => {
            });
        },
        // 确认修改
        sonSubmit() {
            this.$refs.sonEditForm.validate(valid => {
                if (valid) {
                    // 判断头像是否有修改
                    if (this.editUser.imageUrl !== this.editUser.avatar) {
                        // 如果有修改头像，等待上传成功后再保存用户信息
                        this.$refs.uploadAvatar.submit();
                    } else {
                        // 如果没有修改头像，直接保存用户信息
                        this.saveUserInfo();
                    }
                } else {
                    this.$message.error("请正确填写所有必填字段。");
                    return false;
                }
            });
        },
        // 保存用户信息
        saveUserInfo() {
            saveSysUser(this.editUser).then((res) => {
                if (res.data) {
                    this.$message.success(i18n.t('common.success'));
                    // 获取用户详情
                    store.dispatch('user/getInfo').then(user => {
                        this.user = user
                    })
                    this.sonInfoVisible = false;
                } else {
                    this.$message.error(i18n.t('common.error') + ":" + res.data);
                }
            });
        },
        sonPwdSubmit() {
            this.$refs.sonEditPwdForm.validate(valid => {
                if (valid) {
                    this.editUserPwd.id = this.id
                    modifyPwd(this.editUserPwd).then((res) => {
                        if (res.data) {
                            this.$message.success(i18n.t('common.success'));
                            this.sonInfoPwdVisible = false;
                        } else {
                            this.$message.error(i18n.t('common.error') + ":" + res.data);
                        }
                    })
                } else {
                    this.$message.error("请正确填写所有必填字段。");
                    return false;
                }
            })
        },
        sonPwdClose(done) {
            this.$confirm("当前操作数据未更新！", i18n.t('common.messageBox.tips'), {
                confirmButtonText: i18n.t('common.btn.confirmBtnName'),
                cancelButtonText: i18n.t('common.btn.cancelBtnName'),
                type: 'warning'
            }).then(_ => {
                this.infoSize = '30%'
                done();
            }).catch(_ => {
            });
        },
    },
};
</script>
<!-- 基础样式 -->
<style lang="scss" scoped>
// 详情底部按钮
.info-footer {
    padding: 0;
    text-align: center;
}

.box-center {
    margin: 0 auto;
    display: table;
}

.text-muted {
    color: #777;
}

.user-profile {
    .user-name {
        font-weight: bold;
    }

    .box-center {
        padding-top: 10px;
    }

    .user-role {
        padding-top: 10px;
        font-weight: 400;
        font-size: 14px;
    }

    .box-social {
        padding-top: 30px;

        .el-table {
            border-top: 1px solid #dfe6ec;
        }
    }

    .user-follow {
        padding-top: 20px;
    }
}

.user-bio {
    margin-top: 20px;
    color: #606266;

    span {
        padding-left: 4px;
    }

    .user-bio-section {
        font-size: 14px;
        padding: 5px 0;

        .user-bio-section-header {
            border-bottom: 1px solid #dfe6ec;
            padding-bottom: 10px;
            margin-bottom: 10px;
            font-weight: bold;
        }
    }
}
</style>
<!-- 头像样式 -->
<style lang="scss">
.avatar-uploader {
    .el-upload-dragger {
        width: 178px !important;
    }
}
</style>
<style>
.avatar-uploader {
    text-align: center;
}

.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    text-align: center;
}

.avatar-uploader .el-upload:hover {
    border-color: #409EFF;
}

.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px !important;
    line-height: 178px !important;
}

.avatar {
    width: 178px;
    height: 178px;
}
</style>
