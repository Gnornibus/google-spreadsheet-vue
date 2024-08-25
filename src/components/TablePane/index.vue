<template>
    <div class="table-container">
        <!-- 表格数据组件 -->
        <el-table
            ref="table"
            :data="dataSource.data"
            :default-sort="{ prop: dataSource.sort.sortProp, order: dataSource.sort.sortOrder }"
            :loading="dataSource.loading"
            border
            class="table-panel-container"
            highlight-current-row
            stripe
            @sort-change="handleSortChange"
            @row-click="getRowData"
            @selection-change="handleSelectionChange">
            <!-- 是否有多选 -->
            <el-table-column
                v-if="!dataSource.hasOwnProperty('selectAble') || dataSource.selectAble"
                :selectable="dataSource.selectable"
                align="center"
                type="selection"
                width="50"
            />
            <!-- 是否有序号 -->
            <el-table-column
                v-if="!dataSource.hasOwnProperty('indexAble') || dataSource.indexAble"
                :label="$t('table.id')"
                align="center"
                type="index"
                width="50"
            />
            <!-- 表格列表项 -->
            <template v-for="item in dataSource.columns" v-if="item.hide!==true">
                <!-- 表格的列展示，特殊情况处理：比如要输入框，显示图片 -->
                <!-- 需要特殊颜色框显示 -->
                <el-table-column
                    v-if="item.isSpecial"
                    :prop="item.key"
                    :width="item.width || 110"
                    align="center"
                    show-overflow-tooltip
                    v-bind="item">
                    <template v-slot="{row, column}">
                        <el-tag :type="row[item.key] | statusFilter">
                            {{ item.isSpecial(row[item.key]) }}
                        </el-tag>
                    </template>
                </el-table-column>
                <!-- 评分星星 -->
                <el-table-column
                    v-else-if="item.isRate"
                    :prop="item.key"
                    :width="item.width || 140"
                    align="center"
                    show-overflow-tooltip
                    v-bind="item">
                    <template v-slot="{row, column}">
                        <el-rate
                            v-model="row[item.key]"
                            :colors="colors"
                            disabled>
                        </el-rate>
                    </template>
                </el-table-column>
                <!-- 图片带tooltip -->
                <el-table-column
                    v-else-if="item.isImage"
                    :minWidth="item.width || 100"
                    :prop="item.key"
                    align="center"
                    show-overflow-tooltip
                    v-bind="item">
                    <template v-slot="{row, column}">
                        <el-popover
                            placement="right"
                            title=""
                            trigger="hover"
                        >
                            <el-image :src="row[item.key] | imageFileFilter" class="image-popover"/>
                            <el-image slot="reference" :src="row[item.key] | imageFileFilter"
                                      class="reference-img" lazy/>
                        </el-popover>
                    </template>
                </el-table-column>
                <!-- 需要带图标的某列，带回调事件-->
                <el-table-column
                    v-else-if="item.isIcon"
                    :minWidth="item.width || 100"
                    :prop="item.key"
                    align="center"
                    show-overflow-tooltip
                    v-bind="item">
                    <template v-slot="{row, column}">
                        <span>
                            <span>{{ item.filter(row[item.key]) }}</span>
                            <i v-if="item.icon" :class="[item.icon(row[item.key]), 'icon-normal']"
                               @click="item.handlerClick(row)"/>
                        </span>
                        <!-- 比如要输入框 显示图片等等 自己定义 -->
                        <slot :column="column" :name="item.key" :row="row"/>
                    </template>
                </el-table-column>
                <!-- 比如要输入指定格式的数据等等 自己定义 -->
                <el-table-column
                    v-else-if="item.isFormatter"
                    :minWidth="item.width || 120"
                    :prop="item.key"
                    show-overflow-tooltip
                    v-bind="item.isCodeTableFormatter ? Object.assign({ formatter: item.isCodeTableFormatter }, item) : item">
                    <template v-slot="{row, column}">
                        <slot :column="column" :name="item.key" :row="row"/>
                    </template>
                </el-table-column>
                <!-- 字典映射 -->
                <el-table-column
                    v-else-if="item.isDataSelect"
                    :prop="item.key"
                    :width="item.width || 140"
                    align="center"
                    show-overflow-tooltip
                    v-bind="item">
                    <template v-slot="{row, column}">
                        <!--TODO 行编辑功能没有返回值-->
                        <span v-show="!row.editable">{{ row[item.key] | dataFilter }}</span>
                        <data-select v-show="row.editable" :key="item.key" :name="item.label"
                                     :model="row" :data-select="item.isDataSelect"/>
                    </template>
                </el-table-column>
                <!-- 字典映射 -->
                <el-table-column
                    v-else-if="item.isLink"
                    :prop="item.key"
                    :width="item.width || 140"
                    align="center"
                    show-overflow-tooltip
                    v-bind="item">
                    <template v-slot="{row, column}" v-if="item.showField">
                        <!--TODO 行编辑功能没有返回值-->
                        <el-link v-show="!row.editable" type="primary" :href="row[item.valueField]" target="_blank">
                            {{ row[item.showField] | dataFilter }}
                        </el-link>
                        <el-input v-show="row.editable" v-model="row[item.valueField]"></el-input>
                    </template>
                    <template v-slot="{row, column}" v-else>
                        <!--TODO 行编辑功能没有返回值-->
                        <el-link v-show="!row.editable" type="primary" :href="row[item.key]" target="_blank">
                            {{ row[item.key] | dataFilter }}
                        </el-link>
                        <el-input v-show="row.editable" v-model="row[item.key]"></el-input>
                    </template>
                </el-table-column>
                <!-- 大部分适用 -->
                <el-table-column
                    v-else
                    :minWidth="item.width || 120"
                    :prop="item.key"
                    align="center"
                    show-overflow-tooltip
                    v-bind="item">
                    <template v-slot="{row, column}">
                        <span v-show="!row.editable">{{ row[item.key] | dataFilter }}</span>
                        <el-input v-show="row.editable" v-model="row[item.key]"></el-input>
                    </template>
                </el-table-column>
            </template>
            <!-- 表格操作列，没有数据时候不固定列 -->
            <el-table-column
                v-if="dataSource.operation.data.length>0"
                :fixed="(dataSource.data && dataSource.data.length && $store.getters.device === desktopDevices && dataSource.operation.fixed !== false ) ? 'right' : false"
                :label="dataSource.operation.label"
                :show-overflow-tooltip="dataSource.operation.overflowTooltip"
                :width="dataSource.operation.width"
                align="center">
                <!-- UI统一一排放3个，4个以上出现更多 -->
                <template v-slot="{index, row}">
                    <!-- UI统一一排放3个，4个以上出现更多 -->
                    <div class="btn">
                        <template v-for="(item) in dataSource.operation.data">
                            <el-button
                                v-permission="item.permission"
                                :type="item.type?item.type:'info'"
                                size="mini"
                                v-bind="item"
                                @click.stop.prevent="item.handleRowClick(index, row, item.name)">
                                {{ item.name }}
                            </el-button>
                        </template>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <!-- 底部工具类数据 -->
        <div class="footer">
            <!-- 工具型按钮组件 -->
            <template v-if="tool" class="tool">
                <template v-for="(item) in tool.toolBtn">
                    <el-button
                        v-permission="item.permission"
                        :icon="item.icon || 'el-icon-download'"
                        :type="item.type || 'primary'"
                        size="mini"
                        style="margin-right: 2px;"
                        @click="item.handleClick(item.name,$event)">
                        {{ item.name }}
                    </el-button>
                </template>
                <template v-for="(item) in tool.toolDropDown">
                    <el-dropdown
                        v-permission="item.permission"
                        :type="item.type || 'primary'"
                        size="mini"
                        split-button
                        style="margin-right: 2px;"
                        @click="item.handleClick(item.key)"
                        @command="handleExportCommand">
                        {{ item.name }}
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item
                                v-for="option in item.options"
                                :key="option.key"
                                v-permission="option.permission"
                                :command="option.key"
                            >
                                {{ option.name }}
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </template>
            </template>
            <!-- 分页组件 -->
            <div class="page">
                <el-pagination
                    :current-page="dataSource.pagination.current"
                    :page-size="dataSource.pagination.size"
                    :page-sizes="dataSource.pagination.pageSizes?dataSource.pagination.pageSizes:[5,10,15,20,30,40,50,100]"
                    :total="dataSource.pagination.total"
                    background
                    layout="total, sizes, prev, pager, next, jumper"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                />
            </div>
        </div>
        <!-- 返回顶部 -->
        <back-to-top :back-position="50" :custom-style="myBackToTopStyle" :visibility-height="300"
                     transition-name="fade"/>
    </div>
</template>

<script>

import BackToTop from "@/components/BackToTop";
import {CommonEnum} from "@/common/enum/CommonEnum";
import {dictMappingFilter} from "@/common/filters";
import DataSelect from "@/components/Select/DataSelect.vue";

export default {
    // 接收父组件传递过来的值
    props: {
        // 表格数据和表格部分属性的对象
        dataSource: {
            type: Object,
            default: {},
        },
        tool: {
            type: Object,
            default: null,
        },
    },
    components: {DataSelect, BackToTop},
    data() {
        return {
            // 电脑端设备
            desktopDevices: CommonEnum.devicesEnum.DESKTOP,
            // 评分颜色
            colors: ['#99A9BF', '#ffd987', '#ff0000'],
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
        }
    },
    watch: {
        'dataSource.columns': { // 监听表格列变化
            deep: true,
            handler() {
                // 解决表格列变动的抖动问题
                this.$nextTick(this.$refs.table.doLayout)
            }
        },
    },
    methods: {
        dictMappingFilter,
        // 页数事件
        handleSizeChange(size) {
            this.$emit('changeSize', size)
        },
        // 页码事件
        handleCurrentChange(current) {
            this.$emit('changeCurrent', current)
        },
        // 排序事件
        handleSortChange(sort) {
            this.$emit('sortChange', sort)
        },
        // 多选事件
        handleSelectionChange(selectRows) {
            this.$emit('selectionChange', selectRows)
        },
        // 修改下拉框选项名和key
        handleExportCommand(command) {
            const toolDropDown = this.tool.toolDropDown;
            toolDropDown.some((item) => {
                const option = item.options.find((opt) => opt.key === command);
                if (option) {
                    item.name = option.name;
                    item.key = option.key;
                    if (item.handleClick && typeof item.handleClick === "function") {
                        item.handleClick();
                    }
                    return true; // 退出循环
                }
            });
        },
        // 点击当前行进行操作
        async getRowData(row) {
            // 选中当前行
            this.$refs.table.toggleRowSelection(row);
            if (this.lastRowClickTime && (new Date() - this.lastRowClickTime) < 300) {
                // 300ms以内算双击
                try {
                    // 判断当前网站是否是安全域，如果是安全域的话利用新版复制方法，旧版就利用组件新增一个组件后立马移除
                    if (navigator.clipboard && window.isSecureContext) {
                        // 将行数据转换为 JSON 字符串 再将 JSON 字符串写入剪贴板
                        await navigator.clipboard.writeText(JSON.stringify(row))
                        this.$message.success("当前行数据已复制到剪贴板");
                    } else {
                        // 创建textarea元素并设置样式和值
                        const textArea = document.createElement('textarea');
                        Object.assign(textArea.style, {
                            opacity: 0,
                            position: 'absolute',
                            left: '-999999px',
                            top: '-999999px'
                        });
                        textArea.value = JSON.stringify(row);
                        document.body.appendChild(textArea);
                        // 选中并复制textarea内容
                        textArea.select();
                        try {
                            this.$message.success("当前行数据已复制到剪贴板");
                            document.execCommand('copy');
                        } catch (err) {
                            this.$message.error(`复制失败: ${err}`);
                        } finally {
                            // 移除textarea元素
                            document.body.removeChild(textArea);
                        }
                    }
                } catch (err) {
                    this.$message.error("复制行数据失败:" + err)
                }
            } else {
                this.lastRowClickTime = new Date()
            }
        },
    }
}
</script>

<style lang="scss">
.el-table__body-wrapper::-webkit-scrollbar {
    height: 10px;
}

.el-table__body-wrapper::-webkit-scrollbar-track {
    background-color: #f2f2f2;
}

.el-table__body-wrapper::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: #c1c1c1;
}

.el-table__body-wrapper::-webkit-scrollbar-thumb:hover {
    background-color: #a5a5a5;
}

.el-table__body-wrapper::-webkit-scrollbar-corner {
    background-color: #f2f2f2;
}
</style>

<style lang="scss" scoped>
@import '../../assets/css/scss/variables.scss';

.table-container {
    .footer {
        margin-top: 5px;

        .tool {
            float: left;
        }

        .page {
            float: right;
        }
    }
}

.btn {
    display: flex;
    justify-content: center;
}

.btn div {
    margin-left: 5px;
}

// 列表图片样式
.reference-img {
    height: 40px;
    margin-bottom: -6px;
    background-size: 100% 100%;
    border-radius: 4px;
}

// 列表图片浮动预览样式
.image-popover {
    height: 200px;
    background-size: 100% 100%;
}

.icon {
    width: 25px;
    font-size: 20px;
    font-weight: bold;
}

</style>
