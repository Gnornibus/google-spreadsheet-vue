<template>
    <!-- 图片上传组件 -->
    <el-upload
        ref="imageUpload"
        :action="`${baseUrl}${actionUrl}`"
        :auto-upload="uploadAutoUpload"
        :before-remove="uploadBeforeRemove"
        :before-upload="uploadBeforeUpload"
        :data="uploadData"
        :file-list="uploadFileList"
        :headers="uploadHeadersData"
        :limit="uploadLimit"
        :list-type="uploadListType"
        :multiple="uploadMultiple"
        :on-change="uploadChange"
        :on-error="uploadError"
        :on-exceed="uploadExceed"
        :on-preview="uploadPreview"
        :on-progress="uploadProgress"
        :on-remove="uploadRemove"
        :on-success="uploadSuccess"
        :show-file-list="uploadShowFileList"
        accept=".jpg,.jpeg,.png"
        drag
    >
        <!-- 如果显示上传进度，则显示进度条，否则显示插槽内容 -->
        <el-progress v-if="imagePercentageVisible"
                     :percentage="imageUploadPercent"
                     type="circle"/>
        <slot v-else></slot>
    </el-upload>
</template>

<script>
import {getToken} from "@/common/utils/token-util";
// 定义图片类型和文件大小限制常量
const IMAGE_TYPES = "image/jpg,image/jpeg,image/png";
const FILE_SIZE_LIMIT = 10;

import * as imageConversion from 'image-conversion';

export default {
    name: "ImageUpload",
    // 接收父组件传递的属性
    props: {
        // 上传时的附加参数
        uploadData: {type: Object, default: () => ({})},
        // 是否支持多选
        uploadMultiple: {type: Boolean, default: false},
        // 是否显示已上传文件列表
        uploadShowFileList: {type: Boolean, default: false},
        // 是否自动上传
        uploadAutoUpload: {type: Boolean, default: false},
        // 上传的地址
        actionUrl: {type: String, required: true},
        // 已上传文件列表
        uploadFileList: {type: Array, default: () => []},
        // 文件列表类型
        uploadListType: {type: String, default: "text"},
        // 最大上传数量限制
        uploadLimit: {type: Number, default: 5},
    },
    data() {
        return {
            // 定义基础Url地址前缀、上传进度条显示和进度值、请求头信息
            baseUrl: process.env.VUE_APP_BASE_URL_ADMIN_API + "/file/image/",
            imagePercentageVisible: false,
            imageUploadPercent: 0,
            uploadHeadersData: {
                "authorization": getToken(),
            },
        }
    },
    methods: {
        // 确认上传图片
        async submit() {
            // 显示上传进度条
            this.imagePercentageVisible = true;
            // 提交上传
            this.$refs.imageUpload.submit();
        },
        // 清空已上传图片
        async clearFiles() {
            // 隐藏上传进度条
            this.imagePercentageVisible = false;
            // 清空已上传文件列表
            this.$refs.imageUpload.clearFiles();
        },
        // 触发父组件事件
        emitEvent(name, ...args) {
            this.$emit(name, ...args);
        },
        /**
         * 处理上传文件
         */
        // 文件上传成功的回调
        async uploadSuccess(response, file, fileList) {
            // 隐藏上传进度条
            this.imagePercentageVisible = false;
            // 清空已上传文件列表
            this.$refs.imageUpload.clearFiles();
            // 触发上传成功事件
            this.emitEvent('uploadSuccess', response, file, fileList);
        },
        // 文件上传失败的回调
        async uploadError(err, file, fileList) {
            // 隐藏上传进度条
            this.imagePercentageVisible = false;
            // 触发上传失败事件
            this.emitEvent('uploadError', err, file, fileList);
        },
        // 文件上传进度的回调
        async uploadProgress(event, file, fileList) {
            // 更新上传进度值
            this.imageUploadPercent = file.percentage.toFixed(0) * 1;
            // 触发上传进度事件
            this.emitEvent('uploadProgress', event, file, fileList);
        },
        // 文件状态改变的回调
        async uploadChange(file, fileList) {
            // 触发文件状态改变事件
            this.emitEvent('uploadChange', file, fileList);
        },
        // 超出文件数量限制的回调
        async uploadExceed(files, fileList) {
            // 隐藏上传进度条
            this.imagePercentageVisible = false;
            // 提示超出限制
            this.$message.error(`一次性上传最多${this.uploadLimit}张哦！！！`);
            // 触发超出限制事件
            this.emitEvent('uploadExceed', files, fileList);
        },
        // 上传文件前的钩子，验证文件类型和大小
        async uploadBeforeUpload(file) {
            try {
                // 判断是否为图片类型
                const isImage = IMAGE_TYPES.includes(file.type);
                // 判断文件大小是否符合限制
                const isLtLimit = file.size / 1024 / 1024 < FILE_SIZE_LIMIT;
                // 验证是否有效
                const isValid = isImage && isLtLimit;
                if (!isValid) {
                    // 错误信息
                    const errorMessage = !isImage ? '上传文件只能是图片格式!' : `上传文件大小不能超过 ${FILE_SIZE_LIMIT}MB!`;
                    // 提示错误信息
                    this.$message.error(errorMessage);
                    return false;
                }
                // 返回压缩后的文件
                return new Promise((resolve) => {
                    // 压缩到100KB,这里的100就是要压缩的大小,可自定义
                    // imageConversion.compressAccurately(file, 10).then(res => {
                    //     resolve(res);
                    // });
                    // 以质量为0.2进行压缩
                    imageConversion.compress(file, 0.2).then(res => {
                        resolve(res);
                    });
                })
            } catch (error) {
                this.$message.error('上传文件验证失败!');
                return false;
            }
        },
        /**
         * 处理已上传文件
         */
        // 点击已上传文件预览的回调
        async uploadPreview(file) {
            // 获取文件预览的URL
            const url = URL.createObjectURL(file.raw);
            // 在新窗口打开预览的文件
            window.open(url);
            // 触发预览事件
            this.emitEvent('uploadPreview', file);
        },
        // 移除文件的回调
        async uploadRemove(file, fileList) {
            // 触发移除文件事件
            this.emitEvent('uploadRemove', file, fileList);
        },
        // 删除文件前的钩子，确认移除文件
        async uploadBeforeRemove(file, fileList) {
            await this.$confirm(`确定移除 ${file.name}?`).then(() => {
                // 更新文件列表
                this.uploadFileList = fileList;
            });
            // 触发删除文件前事件
            this.emitEvent('uploadBeforeRemove', file, fileList);
        }
    }
};
</script>
