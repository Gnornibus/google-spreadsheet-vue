<template>
    <el-dialog
        ref="dialogForm"
        v-el-drag-dialog
        :append-to-body="true"
        :before-close="handleBeforeClose"
        :componentsDisabled="componentsDisabled"
        :destroy-on-close="destroyOnClose"
        :fullscreen="fullscreen"
        :lock-scroll="lockScroll"
        :max-width="maxWidth"
        :min-width="minWidth"
        :modal="modal"
        :modal-append-to-body="modalAppendToBody"
        :title="title"
        :top="top"
        :visible.sync="dialogVisible"
        :width="width"
        :z-index="zIndex"
        center
        custom-class="dialog-scroll"
        @close="handleClose"
        @drag="handleDrag"
        @fullscreen="handleFullscreen"
        @open="handleOpen"
        @opened="handleOpened"
        @resize="handleResize"
        @scroll="handleScroll"
        @submit="onSubmit"
        @dblclick.native="handleDoubleClick"
    >
        <template v-slot:title>
            <slot name="title-slot">
                {{ title }}
            </slot>
        </template>
        <slot></slot>
        <el-form ref="dialogForm" :model="model" :rules="dialogFormRules" class="dialog-form-model" label-width="120px">
            <template v-for="(item, index) in modelItem">
                <el-form-item v-show="!item.hidden" :label="item.name" :prop="item.key">
                    <template v-if="item.type === 'input'">
                        <el-input v-model="model[item.key]" :disabled="item.disabled || componentsDisabled"
                                  :maxlength="item.length"
                                  :placeholder="item.name"
                                  clearable show-word-limit style="width: 100%;" type="text"/>
                    </template>
                    <template v-else-if="item.type === 'number'">
                        <el-input-number v-model="model[item.key]" :disabled="item.disabled || componentsDisabled"
                                         :max="Math.pow(10,item.length)-1"
                                         :placeholder="item.name"
                                         clearable style="width: 100%;"/>
                    </template>
                    <template v-else-if="item.type === 'password'">
                        <el-input v-model="model[item.key]"
                                  :disabled="item.disabled || componentsDisabled"
                                  :maxlength="item.length" :placeholder="item.name"
                                  clearable maxlength="32" show-password style="width: 100%;" type="password"/>
                    </template>
                    <template v-else-if="item.type === 'decimal'">
                        <el-input-number v-model="model[item.key]" :disabled="item.disabled || componentsDisabled"
                                         :max="item.max || Math.pow(10,item.length)-1"
                                         :min="item.min"
                                         :placeholder="item.name"
                                         :precision="2"
                                         :step="0.01"
                                         clearable style="width: 100%;"/>
                    </template>
                    <template v-else-if="item.type === 'textarea'">
                        <el-input v-model="model[item.key]" :disabled="item.disabled || componentsDisabled"
                                  :maxlength="item.length"
                                  :placeholder="item.name"
                                  show-word-limit style="width: 100%;" type="textarea"/>
                    </template>
                    <template v-else-if="item.type === 'switch'">
                        <el-switch v-model="model[item.key]" :disabled="item.disabled || componentsDisabled"
                                   :placeholder="item.name"
                                   style="width: 100%;"/>
                        <span>{{ model[item.key] }}</span>
                    </template>
                    <template v-else-if="item.type === 'date'">
                        <el-date-picker v-model="model[item.key]" :disabled="item.disabled || componentsDisabled"
                                        :placeholder="item.name"
                                        :type="item.dateType"
                                        style="width: 100%;" :value-format="item.valueFormat"/>
                    </template>
                    <template v-else-if="item.type === 'datetime'">
                        <el-date-picker v-model="model[item.key]" :disabled="item.disabled || componentsDisabled"
                                        :placeholder="item.name"
                                        style="width: 100%;" type="datetime" value-format="yyyy-MM-dd HH:mm:ss"/>
                    </template>
                    <template v-else-if="item.type === 'time'">
                        <el-time-picker v-model="model[item.key]" :disabled="item.disabled || componentsDisabled"
                                        :placeholder="item.name"
                                        style="width: 100%;" type="time" value-format="HH:mm:ss"/>
                    </template>
                    <template v-else-if="item.type === 'select'">
                        <template v-if="item.change">
                            <el-select v-model="model[item.key]" :disabled="item.disabled || componentsDisabled"
                                       :placeholder="item.name"
                                       clearable
                                       filterable
                                       style="width: 100%;"
                                       @change="item.change(model[item.key])">
                                <el-option v-for="(option, optionIndex) in item.options"
                                           :key="optionIndex"
                                           :label="option.name"
                                           :value="option.value"/>
                            </el-select>
                        </template>
                        <template v-else>
                            <el-select v-model="model[item.key]" :disabled="item.disabled || componentsDisabled"
                                       :placeholder="item.name"
                                       clearable
                                       filterable
                                       style="width: 100%;">
                                <el-option v-for="(option, optionIndex) in item.options"
                                           :key="optionIndex"
                                           :label="option.name"
                                           :value="option.value"/>
                            </el-select>
                        </template>
                    </template>
                    <template v-else-if="item.type === 'dataSelect'">
                        <data-select :field="item.key" :name="item.name" :model="model" :data-select="item.dataSelect"
                                     :disabled="item.disabled || componentsDisabled"/>
                    </template>
                    <template v-else-if="item.type === 'dictSelect'">
                        <dict-select :field="item.key" :name="item.name" :model="model" :dict-select="item.dictSelect"
                                     :disabled="item.disabled || componentsDisabled"/>
                    </template>
                    <template v-else-if="item.type === 'checkbox' && item.options">
                        <el-checkbox-group v-model="model[item.key]" :disabled="item.disabled || componentsDisabled">
                            <template v-for="(option, optionIndex) in item.options">
                                <el-checkbox :key="optionIndex" :label="option.value">{{ option.name }}</el-checkbox>
                            </template>
                        </el-checkbox-group>
                    </template>
                    <template v-else-if="item.type === 'radio' && item.options">
                        <el-radio-group v-model="model[item.key]" :disabled="item.disabled || componentsDisabled">
                            <template v-for="(option, optionIndex) in item.options">
                                <el-radio :key="optionIndex" :label="option.value">{{ option.name }}</el-radio>
                            </template>
                        </el-radio-group>
                    </template>
                    <template v-else-if="item.type === 'rate'">
                        <el-rate
                            v-model="model[item.key]"
                            :colors="colors">
                        </el-rate>
                    </template>
                </el-form-item>
            </template>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button v-if="cancelBtn" @click="dialogVisible = false">取 消</el-button>
            <el-button v-if="submitBtn" type="primary" @click="onSubmit">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import elDragDialog from '@/common/directive/el-drag-dialog';
import DataSelect from '@/components/Select/DataSelect';
import DictSelect from '@/components/Select/DictSelect';
import {
    validAccount,
    validateCheckbox,
    validateDate,
    validateDatetime,
    validateDefault,
    validateInput,
    validatePassword,
    validateRadio,
    validateSelect,
    validateSwitch,
    validateTextarea,
} from "@/common/utils/validate";
import {queryDataSelectList} from "@/api/sys-select-api";

export default {
    name: 'Dialog',
    components: {
        DataSelect,
        DictSelect
    },
    directives: {elDragDialog},
    created() {
        if (this.required) {
            // 在 mounted 阶段循环 modelItem 数组
            for (const item of this.modelItem) {
                switch (item.type) {
                    case 'input':
                        item.required === undefined || item.required ?
                            this.$set(this.dialogFormRules, item.key, [{
                                required: true,
                                trigger: 'blur',
                                validator: item.key === 'account' ? validAccount : validateInput,
                            }])
                            : null;
                        break;
                    case 'password':
                        item.required === undefined || item.required ?
                            this.$set(this.dialogFormRules, item.key, [{
                                required: true,
                                trigger: 'blur',
                                validator: validatePassword,
                            }])
                            : null;
                        break;
                    case 'textarea':
                        item.required === undefined || item.required ?
                            this.$set(this.dialogFormRules, item.key, [{
                                required: true,
                                trigger: 'blur',
                                validator: validateTextarea,
                            }])
                            : null;
                        break;
                    case 'switch':
                        item.required === undefined || item.required ?
                            this.$set(this.dialogFormRules, item.key, [{
                                required: true,
                                trigger: 'blur',
                                validator: validateSwitch,
                            }])
                            : null;
                        break;
                    case 'date':
                        item.required === undefined || item.required ?
                            this.$set(this.dialogFormRules, item.key, [{
                                required: true,
                                trigger: 'blur',
                                validator: validateDate,
                            }])
                            : null;
                        break;
                    case 'datetime':
                        item.required === undefined || item.required ?
                            this.$set(this.dialogFormRules, item.key, [{
                                required: true,
                                trigger: 'blur',
                                validator: validateDatetime,
                            }])
                            : null;
                        break;
                    case 'select':
                        item.required === undefined || item.required ?
                            this.$set(this.dialogFormRules, item.key, [{
                                required: true,
                                trigger: 'blur',
                                validator: validateSelect,
                            }])
                            : null;
                        break;
                    case 'dataSelect':
                        item.required === undefined || item.required ?
                            this.$set(this.dialogFormRules, item.key, [{
                                required: true,
                                trigger: 'blur',
                                validator: validateSelect,
                            }])
                            : null;
                        if (!item.model) {
                            this.dataSelectSelectFocus(item.dataSelect);
                        }
                        break;
                    case 'dictSelect':
                        item.required === undefined || item.required ?
                            this.$set(this.dialogFormRules, item.key, [{
                                required: true,
                                trigger: 'blur',
                                validator: validateSelect,
                            }])
                            : null;
                        break;
                    case 'checkbox':
                        item.required === undefined || item.required ?
                            this.$set(this.dialogFormRules, item.key, [{
                                required: true,
                                trigger: 'blur',
                                validator: validateCheckbox,
                            }])
                            : null;
                        break;
                    case 'radio':
                        item.required === undefined || item.required ?
                            this.$set(this.dialogFormRules, item.key, [{
                                required: true,
                                trigger: 'blur',
                                validator: validateRadio,
                            }])
                            : null;
                        break;
                    default:
                        item.required === undefined || item.required ?
                            this.$set(this.dialogFormRules, item.key, [{
                                required: true,
                                trigger: 'blur',
                                validator: validateDefault,
                            }])
                            : null;
                        break;
                }
            }
        }
    },
    data() {
        return {
            // 评分颜色
            colors: ['#99A9BF', '#ffd987', '#ff0000'],
            // 弹框检测规则
            dialogFormRules: {},

            // 可定制的按钮样式，显示/隐藏临界点，返回位置
            myBackToTopStyle: {
                right: '50%',
                bottom: '0',
                width: '40px',
                height: '40px',
                'border-radius': '4px',
                'line-height': '45px', // 请保持与高度一致以垂直居中
                background: '#e7eaf1',// 按钮的背景颜色
            },
            // 弹框表单字典数据
            dataSelectOptions: []
        }
    },
    props: {
        title: {
            type: String,
            default: "对话框",
        },
        visible: {
            type: Boolean,
            default: false,
        },
        required: {
            type: Boolean,
            default: true,
        },
        fullscreen: {
            type: Boolean,
            default: false,
        },
        componentsDisabled: {
            type: Boolean,
            default: false,
        },
        lockScroll: {
            type: Boolean,
            default: true,
        },
        customClass: {
            type: String,
            default: '',
        },
        center: {
            type: Boolean,
            default: false,
        },
        destroyOnClose: {
            type: Boolean,
            default: false,
        },
        modalAppendToBody: {
            type: Boolean,
            default: true,
        },
        modal: {
            type: Boolean,
            default: true,
        },
        width: {
            type: String,
            default: '50%',
        },
        minWidth: {
            type: String,
            default: '400px',
        },
        maxWidth: {
            type: String,
            default: '80%',
        },
        top: {
            type: String,
            default: '0vh',
        },
        zIndex: {
            type: Number,
            default: 2000,
        },
        beforeClose: {
            type: Function,
        },
        modelItem: {
            type: Array,
            default: () => [],
        },
        model: {
            type: Object,
            default: () => ({}),
        },
        cancelBtn: {
            type: Boolean,
            default: true,
        },
        submitBtn: {
            type: Boolean,
            default: true,
        },
    },
    computed: {
        dialogVisible: {
            get() {
                return this.visible
            },
            set(val) {
                this.$emit('update:visible', val)
            }
        }
    },
    methods: {
        // 双击全屏事件
        handleDoubleClick(event) {
            // 如果双击的是空白处并且没有弹出框中的元素被选中，才执行全屏操作
            const dialogEl = this.$refs.dialogForm.$el;
            if (!dialogEl.contains(event.target)) {
                this.fullscreen = !this.fullscreen;
            }
        },
        handleOpen() {
            this.$emit('open')
        },
        handleClose() {
            this.$emit('close')
        },
        handleOpened() {
            this.$emit('opened')
        },
        handleBeforeClose(done) {
            this.$confirm('确定要关闭对话框吗？')
                .then(() => {
                    // 确定
                    done()
                })
                .catch(() => {
                    // 取消
                })
        },
        handleFullscreen() {
            this.$emit('fullscreen')
        },
        handleResize(size) {
            this.$emit('resize', size)
        },
        handleDrag(event) {
            this.$emit('drag', event)
        },
        handleScroll(event) {
            this.$emit('scroll', event)
        },
        onSubmit() {
            this.$refs.dialogForm.validate(valid => {
                if (valid) {
                    this.$emit('submit', this.model)
                } else {
                    this.$message.error("请正确填写所有必填字段。");
                }
            });
        },
        // 字典下拉选中
        dataSelectSelectFocus(dataSelect) {
            if (dataSelect && dataSelect.url) {
                this.dataSelectOptions = []
                queryDataSelectList(dataSelect.url, dataSelect.param).then(response => {
                    this.dataSelectOptions = response.data
                });
            }
        }
    }
}
</script>

<style>
/*模态框样式*/
.el-dialog--center .el-dialog__body {
    padding: 0;
}
</style>

<style lang="scss">
// 模态框表单样式
.dialog-form-model {
    padding-right: 25px;
}

// 滚动条样式
.dialog-scroll {
    overflow-y: scroll;
    overflow-x: hidden;
    padding-left: 5px;
    max-height: 100%;

    /*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
    &::-webkit-scrollbar {
        width: 0;
        height: 0;
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
