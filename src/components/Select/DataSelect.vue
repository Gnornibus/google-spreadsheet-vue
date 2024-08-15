<template>
    <div>
        <!-- el-select 组件 -->
        <el-select v-model="model[field]" :disabled="disabled"
                   :placeholder="name" clearable filterable style="width: 100%;"
                   @focus="fetchDataIfNeeded(dataSelect)">
            <!-- el-option 子组件，循环渲染下拉选项 -->
            <el-option v-for="(option, optionIndex) in dataSelectOptions"
                       :key="optionIndex" :label="option.name" :value="option.value"/>
        </el-select>
    </div>
</template>

<script>
import {queryDataSelectList} from "@/api/sys-select-api";

// 刷新间隔秒数
const refreshTime = 30;
// 重新获取阈值秒数
const thresholdSeconds = 10;

// 共享的字典数据选项和时间戳
let sharedDataSelectOptions = {};
let sharedDataSelectTimestamp = {};

export default {
    props: {
        field: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        dataSelect: {
            type: Object,
            required: true,
        },
        model: {
            type: Object,
            required: true,
        },
        disabled: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            // 下拉选项数据
            dataSelectOptions: [],
        };
    },
    created() {
        // 如果已有选中值，则获取对应下拉数据
        if (this.model[this.field]) {
            this.fetchDataIfNeeded(this.dataSelect);
        }
    },
    methods: {
        // 检查是否需要重新获取数据
        needsRefresh(url, dataSelect) {
            return sharedDataSelectOptions[url] && !dataSelect.hasOwnProperty("param") &&
                Date.now() - sharedDataSelectTimestamp[url] < refreshTime * 1000 &&
                Date.now() - sharedDataSelectTimestamp[url] > thresholdSeconds * 1000;
        },
        // 更新共享数据状态
        updateSharedState(url, data) {
            sharedDataSelectOptions[url] = data;
            sharedDataSelectTimestamp[url] = Date.now();
        },
        // 获取下拉数据
        fetchDataIfNeeded(dataSelect) {
            if (dataSelect && dataSelect.url) {
                if (this.needsRefresh(dataSelect.url, dataSelect)) {
                    // 直接使用已有数据
                    this.dataSelectOptions = sharedDataSelectOptions[dataSelect.url];
                } else {
                    // 请求获取最新数据
                    queryDataSelectList(dataSelect.url, dataSelect.param).then(response => {
                        this.dataSelectOptions = response.data;
                        if (!dataSelect.hasOwnProperty("param")) {
                            // 保存数据到共享状态
                            this.updateSharedState(dataSelect.url, response.data);
                        }
                    });
                }
            }
        },
        handleChange(value) {
            // 如果值为空，则触发重新获取数据
            if (value === null || value === undefined || value === '') {
                this.fetchDataIfNeeded(this.dataSelect);
            }
        },
    },
};
</script>

<style scoped>
/* 可以添加一些样式来美化组件 */
</style>
