<template>
    <div class="filter-container">
        <!-- 搜索区域 -->
        <el-collapse v-model="pickerName" accordion>
            <el-collapse-item class="collapse-cls" name="searchPicker">
                <el-row :gutter="2">
                    <!-- 数字输入框筛选组件 -->
                    <template v-if="filterData.numbers">
                        <el-col v-for="(item) in filterData.numbers" :key="item.key"
                                :span="$store.getters.device === desktopDevices?4:12">
                            <el-input-number
                                :key="item.key"
                                v-model="filterData.listQuery[item.key]"
                                :max="Math.pow(10,item.length)-1"
                                :placeholder="item.name"
                                clearable
                                controls-position="right"
                                style="width: 100%"
                                @keyup.enter.native="filterData.filterBtn.searchBtn.handleClick"
                            />
                        </el-col>
                    </template>

                    <!-- 数字输入框筛选组件 -->
                    <template v-if="filterData.decimal">
                        <el-col v-for="(item) in filterData.decimal" :key="item.key"
                                :span="$store.getters.device === desktopDevices?4:12">
                            <el-input-number
                                :key="item.key"
                                v-model="filterData.listQuery[item.key]"
                                :max="Math.pow(10,item.length-item.precision)-1"
                                :placeholder="item.name"
                                :precision="item.precision"
                                :step="0.01"
                                clearable
                                controls-position="right"
                                style="width: 100%"
                                @keyup.enter.native="filterData.filterBtn.searchBtn.handleClick"
                            />
                        </el-col>
                    </template>

                    <!-- 输入框筛选组件 -->
                    <template v-if="filterData.inputs">
                        <el-col v-for="(item) in filterData.inputs" :key="item.key"
                                :span="$store.getters.device === desktopDevices?4:12">
                            <el-input
                                :key="item.key"
                                v-model="filterData.listQuery[item.key]"
                                :maxlength="item.length"
                                :placeholder="item.name"
                                clearable
                                show-word-limit
                                type="text"
                                @keyup.enter.native="filterData.filterBtn.searchBtn.handleClick"
                            />
                        </el-col>
                    </template>

                    <!-- 下拉框筛选组件 -->
                    <template v-if="filterData.selects">
                        <el-col v-for="(item) in filterData.selects" :key="item.key"
                                :span="$store.getters.device === desktopDevices?4:12">
                            <el-select
                                v-if="item.options"
                                :key="item.key"
                                v-model="filterData.listQuery[item.key]"
                                :placeholder="item.name"
                                clearable
                                filterable
                                style="width: 100%;"
                                @keyup.enter.native="filterData.filterBtn.searchBtn.handleClick"
                            >
                                <el-option
                                    v-for="(item,index) in item.options"
                                    :key="index"
                                    :label="item.name"
                                    :value="item.key"
                                />
                            </el-select>
                            <data-select v-if="item.dataSelect" :field="item.key" :name="item.name"
                                         :model="filterData.listQuery"
                                         :data-select="item.dataSelect"/>
                            <dict-select v-if="item.dictSelect" :field="item.key" :name="item.name"
                                         :model="filterData.listQuery"
                                         :dict-select="item.dictSelect"/>
                        </el-col>
                    </template>

                    <!-- 日期筛选组件 -->
                    <template v-if="filterData.monthPickers">
                        <el-col v-for="(item) in filterData.monthPickers" :key="item.key"
                                :span="$store.getters.device === desktopDevices?4:12">
                            <el-date-picker
                                :key="item.key"
                                v-model="filterData.listQuery[item.key]"
                                :placeholder="item.name"
                                :type="item.dateType"
                                style="width: 100%;"
                                :value-format="item.valueFormat"/>
                        </el-col>
                    </template>

                    <!-- 日期筛选组件 -->
                    <template v-if="filterData.datePickers">
                        <el-col v-for="(item) in filterData.datePickers" :key="item.key"
                                :span="$store.getters.device === desktopDevices?8:24">
                            <el-date-picker
                                :key="item.key"
                                v-model="filterData.listQuery[item.key]"
                                :default-time="['', '']"
                                :end-placeholder="$t('table.filterBtn.end') + item.name"
                                :picker-options="dataPickerOptions"
                                :start-placeholder="$t('table.filterBtn.start') + item.name"
                                style="width: 100%"
                                type="daterange"
                                value-format="yyyy-MM-dd"
                            />
                        </el-col>
                    </template>

                    <!-- 时间筛选组件 -->
                    <template v-if="filterData.timePickers">
                        <el-col v-for="(item) in filterData.timePickers" :key="item.key"
                                :span="$store.getters.device === desktopDevices?8:24">
                            <el-time-picker
                                :key="item.key"
                                v-model="filterData.listQuery[item.key]"
                                :default-time="['', '']"
                                :end-placeholder="$t('table.filterBtn.end') + item.name"
                                :start-placeholder="$t('table.filterBtn.start') + item.name"
                                is-range
                                style="width: 100%"
                                value-format="HH:mm:ss"
                            />
                        </el-col>
                    </template>

                    <!-- 日期时间筛选组件 -->
                    <template v-if="filterData.dateTimePickers">
                        <el-col v-for="(item) in filterData.dateTimePickers" :key="item.key"
                                :span="$store.getters.device === desktopDevices?8:24">
                            <el-date-picker
                                :key="item.key"
                                v-model="filterData.listQuery[item.key]"
                                :default-time="['', '']"
                                :end-placeholder="$t('table.filterBtn.end') + item.name"
                                :picker-options="dataTimePickerOptions"
                                :start-placeholder="$t('table.filterBtn.start') + item.name"
                                style="width: 100%"
                                type="datetimerange"
                                value-format="yyyy-MM-dd HH:mm:ss"
                            />
                        </el-col>
                    </template>

                </el-row>
                <!-- 按钮组件 -->
                <template slot="title">
                    <el-button
                        v-if="filterData.filterBtn.searchBtn"
                        v-permission="filterData.filterBtn.searchBtn.permission"
                        :icon="$store.getters.device === desktopDevices?'el-icon-search':''"
                        type="primary"
                        @click.stop.prevent="filterData.filterBtn.searchBtn.handleClick">
                        {{ $t('table.filterBtn.search') }}
                    </el-button>
                    <el-button
                        v-if="filterData.filterBtn.searchBtn"
                        v-permission="filterData.filterBtn.searchBtn.permission"
                        :icon="$store.getters.device === desktopDevices?'el-icon-refresh-right':''"
                        type="warning"
                        @click.stop.prevent="handleRest">
                        {{ $t('table.filterBtn.reset') }}
                    </el-button>
                    <el-button
                        v-if="filterData.filterBtn.addBtn"
                        v-permission="filterData.filterBtn.addBtn.permission"
                        :icon="$store.getters.device === desktopDevices?'el-icon-circle-plus-outline':''"
                        type="primary"
                        @click.stop.prevent="filterData.filterBtn.addBtn.handleClick">
                        {{ $t('table.filterBtn.add') }}
                    </el-button>
                    <el-button
                        v-if="filterData.filterBtn.batchAddBtn"
                        v-permission="filterData.filterBtn.batchAddBtn.permission"
                        :icon="$store.getters.device === desktopDevices?'el-icon-plus':''"
                        type="primary"
                        @click.stop.prevent="filterData.filterBtn.batchAddBtn.handleClick">
                        {{ $t('table.filterBtn.batchAdd') }}
                    </el-button>
                    <el-button
                        v-if="filterData.filterBtn.buildAllWagesBtn"
                        v-permission="filterData.filterBtn.buildAllWagesBtn.permission"
                        type="primary"
                        @click.stop.prevent="filterData.filterBtn.buildAllWagesBtn.handleClick">
                        一键生成工资
                    </el-button>
                    <el-button
                        v-if="filterData.filterBtn.exportPerfWagesBtn"
                        v-permission="filterData.filterBtn.exportPerfWagesBtn.permission"
                        type="primary"
                        @click.stop.prevent="filterData.filterBtn.exportPerfWagesBtn.handleClick">
                        导出工资
                    </el-button>
                    <el-button
                        v-if="filterData.filterBtn.batchDeleteBtn"
                        v-permission="filterData.filterBtn.batchDeleteBtn.permission"
                        :icon="$store.getters.device === desktopDevices?'el-icon-delete':''"
                        type="danger"
                        @click.stop.prevent="filterData.filterBtn.batchDeleteBtn.handleClick">
                        {{ $t('table.filterBtn.batchDelete') }}
                    </el-button>
                </template>
            </el-collapse-item>
        </el-collapse>
    </div>
</template>

<script>
import i18n from "@/common/lang";
import {CommonEnum} from "@/common/enum/CommonEnum";
import {queryDataSelectList} from "@/api/sys-select-api";
import DataSelect from "@/components/Select/DataSelect.vue";
import DictSelect from "@/components/Select/DictSelect.vue";

export default {
    components: {DictSelect, DataSelect},
    props: {
        filterData: {
            type: Object,
            default: {},
        },
        sort: {
            type: Object,
            default: {
                sortProp: '',
                sortOrder: '',
            },
        },
    },
    data() {
        return {
            // 电脑端设备
            desktopDevices: CommonEnum.devicesEnum.DESKTOP,
            // 日期类型范围筛选
            dataPickerOptions: {
                shortcuts: [{
                    text: '本月',
                    onClick(picker) {
                        picker.$emit('pick', [new Date(), new Date()]);
                    }
                }, {
                    text: '今年至今',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date(new Date().getFullYear(), 0);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近六个月',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setMonth(start.getMonth() - 6);
                        picker.$emit('pick', [start, end]);
                    }
                }]
            },
            // 日期时间类型范围筛选
            dataTimePickerOptions: {
                shortcuts: [
                    {
                        text: i18n.t('table.filterPane.lastDay'),
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24);
                            picker.$emit('pick', [start, end]);
                        }
                    },
                    {
                        text: i18n.t('table.filterPane.lastWeek'),
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    },
                    {
                        text: i18n.t('table.filterPane.lastMonth'),
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    },
                    {
                        text: i18n.t('table.filterPane.lastSeason'),
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        }
                    },
                    {
                        text: i18n.t('table.filterPane.LastHalfYear'),
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 180);
                            picker.$emit('pick', [start, end]);
                        }
                    },
                    {
                        text: i18n.t('table.filterPane.lastYear'),
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 365);
                            picker.$emit('pick', [start, end]);
                        }
                    }
                ]
            },
            // 默认展开项
            pickerName: 'searchPicker',
            // 搜索框字典数据
            dictOptions: []
        };
    },
    methods: {
        handleRest() {
            // 重置查询数据
            const data = this.$global.deepClone(this.filterData.listQuery)
            Object.keys(data).forEach(function (key) {
                data[key] = ''
            })
            this.filterData.listQuery = Object.entries(data).filter(([key, value]) => value !== '')

            // 重置完进行查询
            if (this.filterData.filterBtn.searchBtn.handleClick && typeof this.filterData.filterBtn.searchBtn.handleClick === "function") {
                this.filterData.filterBtn.searchBtn.handleClick();
            }
        },
        // 字典下拉选中
        dictSelectFocus(dict) {
            if (dict && dict.url) {
                // 获取字典数据
                this.dictOptions = []
                queryDataSelectList(dict.url, dict.param).then(response => {
                    this.dictOptions = response.data
                });
            }
        }
    }
}
</script>

<style lang='scss' scoped>
// 伸缩框的下边距
.el-collapse-item ::v-deep .el-collapse-item__content {
    padding-bottom: 5px;
}

.collapse-cls {

    title {
        height: 100px;
    }
}
</style>
