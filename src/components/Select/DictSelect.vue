<template>
    <div>
        <el-select v-model="model[field]" :disabled="disabled"
                   :placeholder="name" clearable filterable style="width: 100%;"
                   @focus="dictSelectSelectFocus(dictSelect)"
                   @change="handleChange">
            <el-option v-for="(option, optionIndex) in dictSelectOptions"
                       :key="optionIndex" :label="option.name" :value="option.value"/>
        </el-select>
    </div>
</template>

<script>
import {queryDictSelectList} from "@/api/sys-select-api";

// 共享的字典数据状态，保存已经请求过的字典数据
let sharedDictSelectOptions = {};
// 共享的字典数据时间戳，保存数据获取的时间戳
let sharedDictSelectTimestamp = {};

export default {
    props: {
        field: {
            type: String,
            required: null,
        },
        name: {
            type: String,
            required: null,
        },
        dictSelect: {
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
    mounted() {
        this.dictSelectSelectFocus(this.dictSelect);
    },
    data() {
        return {
            dictSelectOptions: [],
        };
    },
    methods: {
        dictSelectSelectFocus(dictSelect) {
            if (dictSelect && dictSelect.dictCode) {
                // 设置30s重新获取最新的下拉数据
                if (sharedDictSelectOptions[dictSelect.dictCode] && Date.now() - sharedDictSelectTimestamp[dictSelect.dictCode] < 30 * 1000) {
                    // 直接使用已存在的数据
                    this.dictSelectOptions = sharedDictSelectOptions[dictSelect.dictCode];
                } else {
                    queryDictSelectList(dictSelect.dictCode, dictSelect.param).then(response => {
                        this.dictSelectOptions = response.data.children;
                        this.$nextTick(() => {
                            // 保存数据到共享状态
                            sharedDictSelectOptions[dictSelect.dictCode] = response.data.children;
                            // 保存数据获取的时间戳
                            sharedDictSelectTimestamp[dictSelect.dictCode] = Date.now();
                        });
                    });
                }
            }
        },
        handleChange(value) {
            this.dictSelectSelectFocus(this.dictSelect);
        },
    },
};
</script>

<style scoped>
/* 可以添加一些样式来美化组件 */
</style>
