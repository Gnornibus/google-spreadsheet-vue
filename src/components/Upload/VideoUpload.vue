<template>
    <!-- el-upload 组件 -->
    <el-upload
        ref="videoUpload"
        :action="`${baseUrl}${actionUrl}`"
        :auto-upload="uploadAutoUpload"
        :before-remove="uploadBeforeRemove"
        :before-upload="uploadBeforeUpload"
        :data="uploadData"
        :file-list="uploadFileList"
        :headers="uploadHeaders"
        :limit="uploadLimit"
        :list-type="uploadListType"
        :multiple="uploadMultiple"
        :on-change="uploadChange"
        :on-error="uploadError"
        :on-exceed="uploadExceed"
        :on-progress="uploadProgress"
        :on-remove="uploadRemove"
        :on-success="uploadSuccess"
        :show-file-list="uploadShowFileList"
        accept=".mp4"
        drag
    >
        <!-- el-progress 组件，用于显示上传进度 -->
        <el-progress v-if="videoPercentageVisible"
                     :percentage="videoUploadPercent"
                     type="circle"/>
        <!-- 插槽，用于显示自定义内容 -->
        <slot v-else></slot>
    </el-upload>
</template>

<script>
import {getToken} from "@/common/utils/token-util";

const VIDEO_TYPES = "video/mp4"; // 视频文件类型
const FILE_SIZE_LIMIT = 500; // 文件大小限制，单位MB

export default {
    name: "VideoUpload",
    props: {
        // 上传时附带的额外参数
        uploadData: {type: Object, default: () => ({})},
        // 是否支持多选文件
        uploadMultiple: {type: Boolean, default: false},
        // 是否显示已上传文件列表
        uploadShowFileList: {type: Boolean, default: false},
        // 是否自动上传
        uploadAutoUpload: {type: Boolean, default: false},
        // 上传的地址
        actionUrl: {type: String, required: true},
        // 上传的文件列表
        uploadFileList: {type: Array, default: () => []},
        // 文件列表的类型
        uploadListType: {type: String, default: "text"},
        // 最大允许上传个数
        uploadLimit: {type: Number, default: 5},
    },
    data() {
        return {
            // 定义基础Url地址前缀、上传进度条显示和进度值、请求头信息
            baseUrl: process.env.VUE_APP_BASE_URL_ADMIN_API + "/file/video/",
            // 上传请求头信息
            uploadHeaders: {"authorization": getToken()},
            // 是否显示上传进度条
            videoPercentageVisible: false,
            // 上传进度百分比
            videoUploadPercent: 0,
        };
    },
    methods: {
        // 提交上传
        submit() {
            this.videoPercentageVisible = true;
            this.$refs.videoUpload.submit();
        },
        // 清除已选择的文件
        clearFiles() {
            this.videoPercentageVisible = false;
            this.$refs.videoUpload.clearFiles();
        },
        // 触发父组件事件
        emitEvent(name, ...args) {
            this.$emit(name, ...args);
        },
        // 上传成功时的回调
        uploadSuccess(response, file, fileList) {
            this.videoPercentageVisible = false;
            this.emitEvent('uploadSuccess', response, file, fileList);
        },
        // 上传失败时的回调
        uploadError(err, file, fileList) {
            this.videoPercentageVisible = false;
            this.$refs.videoUpload.abort(file);
            this.emitEvent('uploadError', err, file, fileList);
        },
        // 上传进度变化时的回调
        uploadProgress(event, file, fileList) {
            this.videoPercentageVisible = true;
            this.videoUploadPercent = file.percentage.toFixed(0) * 1;
            this.emitEvent('uploadProgress', event, file, fileList);
        },
        // 文件选择发生变化时的回调
        uploadChange(file, fileList) {
            this.emitEvent('uploadChange', file, fileList);
        },
        // 文件数量超出限制时的回调
        uploadExceed(files, fileList) {
            this.videoPercentageVisible = false;
            this.$message.error(`一次性上传最多${this.uploadLimit}张哦！！！`);
            this.$refs.videoUpload.abort(files[0]);
            this.emitEvent('uploadExceed', files, fileList);
        },
        // 文件上传前的钩子函数
        uploadBeforeUpload(file) {
            this.videoPercentageVisible = true;
            const isVideo = VIDEO_TYPES.split(",").includes(file.type);
            const isLt1M = file.size / 1024 / 1024 < FILE_SIZE_LIMIT;
            const isValid = [isVideo, isLt1M].every(Boolean);
            if (!isValid) {
                const errorMessage = !isVideo ? '上传文件只能是MP4格式!' : `上传文件大小不能超过 ${FILE_SIZE_LIMIT}MB!`;
                this.$refs.videoUpload.abort(file);
                this.$message.error(errorMessage);
            }
            return isValid;
        },
        // 预览已上传文件
        uploadPreview(file) {
            const url = URL.createObjectURL(file.raw);
            window.open(url);
            this.emitEvent('uploadPreview', file);
        },
        // 删除文件
        uploadRemove(file, fileList) {
            this.emitEvent('uploadRemove', file, fileList);
        },
        // 删除文件前的确认处理
        async uploadBeforeRemove(file, fileList) {
            await this.$confirm(`确定移除 ${file.name}？`).then(() => {
                this.uploadFileList = fileList;
            });
            this.emitEvent('uploadBeforeRemove', file, fileList);
        }
    }
};
</script>
