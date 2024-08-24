<template>
    <div>
        <search-pane :filter-data="filterData" :sort="this.dataSource.sort"/>
        <table-pane
            ref="myTable"
            :data-source="dataSource"
            :tool="tool"
            @changeCurrent="changeCurrent"
            @changeSize="changeSize"
            @selectionChange="selectionChange"
            @sortChange="sortChange"
        />
        <my-dialog
            :model="addDialogData.model"
            :modelItem="addDialogData.modelItem"
            :title="$t('common.dialog.dialogAddTitle')"
            :visible.sync="addDialogData.visible"
            :width="dialogWidth"
            @close="queryPage()"
            @submit="add">
        </my-dialog>
        <my-dialog
            :model="modifyDialogData.model"
            :modelItem="modifyDialogData.modelItem"
            :title="modifyDialogData.title"
            :visible.sync="modifyDialogData.visible"
            :width="dialogWidth"
            @close="queryPage()"
            @submit="modify">
        </my-dialog>
        <my-dialog
            :componentsDisabled="true"
            :model="infoDialogData.model"
            :modelItem="infoDialogData.modelItem"
            :title="$t('common.dialog.dialogInfoTitle')"
            :visible.sync="infoDialogData.visible"
            :required="false"
            :width="dialogWidth"
            @close="queryPage()"
            @submit="()=>{this.infoDialogData.visible=false}"/>
        <my-dialog
            :fullscreen="batchDialogData.fullscreen"
            :title="$t('common.dialog.dialogBatchTitle')"
            :visible.sync="batchDialogData.visible"
            :width="batchDialogData.width"
            @submit="batchAdd">
            <upload-excel-component :excelData="batchDialogData.excelData"/>
        </my-dialog>
        <my-dialog
            :title="cacheGrid.title"
            :visible.sync="cacheGrid.visible"
            top="10%"
            width="90%"
            @submit="cacheGrid.visible=false">
            <template v-slot:title-slot>
                <a type="primary" :href="cacheGrid.linkUrl" target="_blank"
                   style="color: inherit; text-decoration: none;">
                    <span style="color: deepskyblue">{{ cacheGrid.title }}</span>
                </a>
            </template>
            <ag-grid-vue
                class="ag-theme-alpine"
                style="width: 100%; height: 400px;"
                :columnDefs="cacheGrid.columnDefs"
                :rowData="cacheGrid.rowData"
                :gridOptions="cacheGrid.gridOptions">
            </ag-grid-vue>
        </my-dialog>
        <!--缓存数据查询弹框-->
        <my-dialog
            :title="cacheGrid.title"
            :visible.sync="cacheGrid.visible"
            top="10%"
            width="90%"
            @submit="cacheGrid.visible=false">
            <template v-slot:title-slot>
                <a type="primary" :href="cacheGrid.linkUrl" target="_blank"
                   style="color: inherit; text-decoration: none;">
                    <span style="color: deepskyblue">{{ cacheGrid.title }}</span>
                </a>
            </template>
            <ag-grid-vue
                class="ag-theme-alpine"
                style="width: 100%; height: 400px;"
                :columnDefs="cacheGrid.columnDefs"
                :rowData="cacheGrid.rowData"
                :gridOptions="cacheGrid.gridOptions">
            </ag-grid-vue>
        </my-dialog>
        <!--事件查询弹框-->
        <my-dialog
            :title="eventGrid.title"
            :visible.sync="eventGrid.visible"
            top="10%"
            width="90%"
            @submit="eventGrid.visible=false">
            <template v-slot:title-slot>
                <a type="primary" :href="eventGrid.linkUrl" target="_blank"
                   style="color: inherit; text-decoration: none;">
                    <span style="color: deepskyblue">{{ eventGrid.title }}</span>
                </a>
            </template>
            <el-row>
                <el-col :span="7">
                    <el-date-picker
                        v-model="eventGrid.datetimeScope"
                        type="datetimerange"
                        :picker-options="pickerOptions"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        value-format="yyyy-MM-dd HH:mm:ss">
                    </el-date-picker>
                </el-col>
                <el-col :span="7">
                    <dict-select :field="'status'" :name="'事件状态'"
                                 :model="eventGrid.currenObj"
                                 :dict-select="{dictCode:'google.sheet.configuration.status'}"/>
                </el-col>
                <el-col :span="7">
                    <el-button type="primary" @click="getEventByProperties(eventGrid.currenObj)">查询</el-button>
                </el-col>
            </el-row>
            <ag-grid-vue
                class="ag-theme-alpine"
                style="width: 100%; height: 400px;"
                :columnDefs="eventGrid.columnDefs"
                :rowData="eventGrid.rowData"
                :gridOptions="eventGrid.gridOptions">
            </ag-grid-vue>
        </my-dialog>
    </div>
</template>

<script>
import searchPane from '@/components/SearchPane';
import tablePane from '@/components/TablePane';
import MyDialog from '@/components/Dialog';
import {
    getCacheSpreadsheetContent,
    deleteBatchGoogleSheetConfig,
    deleteGoogleSheetConfig,
    exportChoseExcelGoogleSheetConfig,
    exportExcelGoogleSheetConfig,
    exportParamExcelGoogleSheetConfig,
    exportTemplateGoogleSheetConfig,
    queryPageGoogleSheetConfig,
    saveBatchGoogleSheetConfig,
    saveGoogleSheetConfig,
    selectGoogleSheetConfig,
} from "@/api/google-sheet-config-api.js";
import i18n from '@/common/lang';
import UploadExcelComponent from '@/components/UploadExcel/index.vue';
import BackToTop from "@/components/BackToTop";
import ImageUpload from "@/components/Upload/ImageUpload.vue";
import {AgGridVue} from "ag-grid-vue";
import {deleteSheetOperation} from "../../../../api/google-sheet-remove-api";
import {launchOperation} from "../../../../api/google-sheet-config-api";
import DictSelect from "@/components/Select/DictSelect.vue";
import axios from "axios";
import {formatDate} from "@/common/utils/validate";

export default {
    name: 'GoogleConfig',
    components: {DictSelect, AgGridVue, ImageUpload, searchPane, tablePane, MyDialog, UploadExcelComponent, BackToTop},
    // 生命周期-页面创建
    created() {
        // 初始化方法
        this.init();
    },
    data() {
        return {
            /**
             * 搜索栏配置
             */
            filterData: {
                // 重置
                reset: true,
                // 查询参数
                listQuery: {},
                // 查询按钮
                filterBtn: {
                    searchBtn: {
                        permission: '040101',
                        handleClick: this.queryPage,
                    },
                    addBtn: {
                        permission: '040102',
                        handleClick: () => {
                            this.addDialogData.visible = true
                        },
                    },
                    batchAddBtn: {
                        permission: '040103',
                        handleClick: () => {
                            this.batchDialogData.visible = true;
                        },
                    },
                    batchDeleteBtn: {
                        permission: '040105',
                        handleClick: this.batchDelete,
                    },
                },

                // 精准数据输入框
                decimal: [],
                // 数字输入框
                numbers: [],
                // 搜索输入框
                inputs: [
                    {
                        key: 'id',
                        length: 64,
                        name: i18n.t('view.googleSheetConfig.id'),
                    },
                    {
                        key: 'spreadsheetId',
                        length: 128,
                        name: i18n.t('view.googleSheetConfig.spreadsheetId'),
                    },
                    {
                        key: 'remark',
                        length: 255,
                        name: i18n.t('view.googleSheetConfig.remark'),
                    },
                    {
                        key: 'sourceUrl',
                        length: 255,
                        name: i18n.t('view.googleSheetConfig.sourceUrl'),
                    },
                    {
                        key: 'sourceSheet',
                        length: 255,
                        name: i18n.t('view.googleSheetConfig.sourceSheet'),
                    },
                    {
                        key: 'dataRange',
                        length: 255,
                        name: i18n.t('view.googleSheetConfig.dataRange'),
                    },
                    {
                        key: 'judgeCondition',
                        length: 255,
                        name: i18n.t('view.googleSheetConfig.judgeCondition'),
                    },
                    {
                        key: 'compareField',
                        length: 255,
                        name: i18n.t('view.googleSheetConfig.compareField'),
                    },
                    {
                        key: 'outputField',
                        length: 255,
                        name: i18n.t('view.googleSheetConfig.outputField'),
                    },
                    {
                        key: 'outputMode',
                        length: 255,
                        name: i18n.t('view.googleSheetConfig.outputMode'),
                    },
                    {
                        key: 'cron',
                        length: 255,
                        name: i18n.t('view.googleSheetConfig.cron'),
                    },
                    {
                        key: 'targetUrl',
                        length: 255,
                        name: i18n.t('view.googleSheetConfig.targetUrl'),
                    },
                    {
                        key: 'targetSheet',
                        length: 255,
                        name: i18n.t('view.googleSheetConfig.targetSheet'),
                    },
                    {
                        key: 'targetStart',
                        length: 255,
                        name: i18n.t('view.googleSheetConfig.targetStart'),
                    },
                ],
                // 搜索下拉框
                selects: [
                    {
                        key: 'status',
                        length: 32,
                        name: i18n.t('view.googleSheetConfig.status'),
                        dictSelect: {
                            dictCode: 'google.sheet.configuration.status'
                        }
                    },
                    {
                        key: 'outputHeader',
                        length: 8,
                        name: i18n.t('view.googleSheetConfig.outputHeader'),
                        dictSelect: {
                            dictCode: 'sys.yes.no'
                        }
                    },
                    {
                        key: 'ignoreDrive',
                        length: 8,
                        name: i18n.t('view.googleSheetConfig.ignoreDrive'),
                        dictSelect: {
                            dictCode: 'sys.yes.no'
                        }
                    },
                    // {
                    //     key: 'creUserId',
                    //     length: 32,
                    //     name: i18n.t('view.googleSheetConfig.creUserId'),
                    //     dataSelect: {
                    //         url: 'sys-user',
                    //     },
                    // },
                    // {
                    //     key: 'updUserId',
                    //     length: 32,
                    //     name: i18n.t('view.googleSheetConfig.updUserId'),
                    //     dataSelect: {
                    //         url: 'sys-user',
                    //     },
                    // },
                ],
                // 搜索日期框
                datePickers: [],
                // 搜索时间框
                timePickers: [],
                // 搜索日期及时间框
                dateTimePickers: [
                    // {
                    //     key: 'creTime',
                    //     name: i18n.t('view.googleSheetConfig.creTime'),
                    // },
                    // {
                    //     key: 'updTime',
                    //     name: i18n.t('view.googleSheetConfig.updTime'),
                    // },
                ],
            },

            /**
             * 表格配置
             */
            dataSource: {
                // 表格加载
                loading: true,
                // 列表项
                columns: [
                    {
                        key: 'id',
                        label: i18n.t('view.googleSheetConfig.id'),
                        sortable: true,
                    },
                    {
                        key: 'spreadsheetId',
                        label: i18n.t('view.googleSheetConfig.spreadsheetId'),
                        sortable: true,
                    },
                    {
                        key: 'statusName',
                        label: i18n.t('view.googleSheetConfig.status'),
                        sortable: true,
                    },
                    {
                        key: 'remark',
                        label: i18n.t('view.googleSheetConfig.remark'),
                        sortable: true,
                    },
                    // {
                    //     key: 'creUserName',
                    //     label: i18n.t('view.googleSheetConfig.creUserName'),
                    //     sortable: true,
                    // },
                    // {
                    //     width: 160,
                    //     key: 'creTime',
                    //     label: i18n.t('view.googleSheetConfig.creTime'),
                    //     sortable: true,
                    // },
                    // {
                    //     key: 'updUserName',
                    //     label: i18n.t('view.googleSheetConfig.updUserName'),
                    //     sortable: true,
                    // },
                    // {
                    //     width: 160,
                    //     key: 'updTime',
                    //     label: i18n.t('view.googleSheetConfig.updTime'),
                    //     sortable: true,
                    // },
                    {
                        key: 'outputHeaderName',
                        label: i18n.t('view.googleSheetConfig.outputHeader'),
                        sortable: true,
                    },
                    {
                        width: 150,
                        key: 'ignoreDriveName',
                        label: i18n.t('view.googleSheetConfig.ignoreDrive'),
                        sortable: true,
                    },
                    {
                        width: 350,
                        key: 'sourceUrl',
                        label: i18n.t('view.googleSheetConfig.sourceUrl'),
                        sortable: true,
                    },
                    {
                        key: 'sourceSheet',
                        label: i18n.t('view.googleSheetConfig.sourceSheet'),
                        sortable: true,
                    },
                    {
                        key: 'dataRange',
                        label: i18n.t('view.googleSheetConfig.dataRange'),
                        sortable: true,
                    },
                    {
                        key: 'judgeCondition',
                        label: i18n.t('view.googleSheetConfig.judgeCondition'),
                        sortable: true,
                    },
                    {
                        key: 'compareField',
                        label: i18n.t('view.googleSheetConfig.compareField'),
                        sortable: true,
                    },
                    {
                        key: 'outputField',
                        label: i18n.t('view.googleSheetConfig.outputField'),
                        sortable: true,
                    },
                    {
                        key: 'outputMode',
                        label: i18n.t('view.googleSheetConfig.outputMode'),
                        sortable: true,
                    },
                    {
                        key: 'cron',
                        label: i18n.t('view.googleSheetConfig.cron'),
                        sortable: true,
                    },
                    {
                        width: 350,
                        key: 'targetUrl',
                        label: i18n.t('view.googleSheetConfig.targetUrl'),
                        sortable: true,
                    },
                    {
                        key: 'targetSheet',
                        label: i18n.t('view.googleSheetConfig.targetSheet'),
                        sortable: true,
                    },
                    {
                        key: 'targetStart',
                        label: i18n.t('view.googleSheetConfig.targetStart'),
                        sortable: true,
                    },
                ],
                // 表格数据
                data: [],
                // 表格排序
                sort: {
                    sortProp: '',
                    sortOrder: '',
                },
                // 分页插件
                pagination: {
                    size: 10,   // 页数
                    current: 1, // 页码
                    total: 10,  // 总计
                },
                // 操作按钮项
                operation: {
                    label: i18n.t('table.operation'),
                    width: 80 * 7,
                    data: [
                        {
                            name: "发起",
                            type: 'success',
                            permission: '040111',
                            handleRowClick: (index, row) => {
                                this.$confirm("确认要发起运算嘛？" + row.spreadsheetId, i18n.t('common.messageBox.tips'), {
                                    confirmButtonText: i18n.t('common.btn.confirmBtnName'),
                                    cancelButtonText: i18n.t('common.btn.cancelBtnName'),
                                    type: 'warning'
                                }).then(() => {
                                    // 确定
                                    launchOperation({
                                        ...row
                                    }).then((res) => {
                                        if (res.data) {
                                            this.queryPage()
                                            this.$message.success(i18n.t('common.success'));
                                        } else {
                                            this.$message.error(i18n.t('common.error') + ":" + res.data);
                                        }
                                    })
                                });
                            }
                        },
                        {
                            name: "事件",
                            type: 'primary',
                            permission: '040112',
                            handleRowClick: (index, row) => {
                                this.eventGrid.currenObj = row;
                                this.getEventByProperties(row)
                            }
                        },
                        {
                            name: "配置",
                            type: 'primary',
                            permission: '040113',
                            handleRowClick: (index, row) => {
                                getCacheSpreadsheetContent({
                                    "sourceUrl": row.sourceUrl,
                                    "sourceSheet": row.sourceSheet
                                }).then((res) => {
                                    this.cacheGrid.title = "【来源】：" + row.sourceUrl + "   【页签】：" + row.sourceSheet
                                    this.cacheGrid.linkUrl = "https://docs.google.com/spreadsheets/d/" + row.sourceUrl
                                    this.processCacheAgGridData(res.data)
                                    this.cacheGrid.visible = true;
                                })
                            }
                        },
                        {
                            name: i18n.t('common.btn.infoBtnName'),
                            type: 'primary',
                            permission: '040106',
                            handleRowClick: (index, row) => {
                                selectGoogleSheetConfig({id: row.id}).then((res) => {
                                    this.infoDialogData.model = res.data
                                    this.infoDialogData.visible = true;
                                })
                            }
                        },
                        {
                            name: "复制",
                            type: 'primary',
                            permission: '040114',
                            handleRowClick: (index, row) => {
                                selectGoogleSheetConfig({id: row.id}).then((res) => {
                                    this.modifyDialogData.title = "复制";
                                    this.modifyDialogData.model = res.data
                                    this.$set(this.modifyDialogData.model, 'id', "")
                                    this.$set(this.modifyDialogData.model, 'spreadsheetId', "")
                                    this.modifyDialogData.visible = true;
                                })
                            }
                        },
                        {
                            name: i18n.t('common.btn.modifyBtnName'),
                            type: 'primary',
                            permission: '040102,040106',
                            handleRowClick: (index, row) => {
                                selectGoogleSheetConfig({id: row.id}).then((res) => {
                                    this.modifyDialogData.title = i18n.t('common.dialog.dialogModifyTitle');
                                    this.modifyDialogData.model = res.data;
                                    this.modifyDialogData.visible = true;
                                })
                            }
                        },
                        {
                            name: "清缓",
                            type: 'danger',
                            permission: '040115',
                            handleRowClick: (index, row) => {
                                this.$confirm("确认要清除缓存嘛？" + row.spreadsheetId, i18n.t('common.messageBox.tips'), {
                                    confirmButtonText: i18n.t('common.btn.confirmBtnName'),
                                    cancelButtonText: i18n.t('common.btn.cancelBtnName'),
                                    type: 'warning'
                                }).then(() => {
                                    // 确定
                                    deleteSheetOperation({
                                        spreadsheetId: row.sourceUrl,
                                        sheetName: row.sourceSheet
                                    }).then((res) => {
                                        if (res.data) {
                                            this.queryPage()
                                            this.$message.success(i18n.t('common.success'));
                                            this.addDialogData.visible = false;
                                        } else {
                                            this.$message.error(i18n.t('common.error') + ":" + res.data);
                                        }
                                    })
                                });
                            }
                        },
                        {
                            name: i18n.t('common.btn.deleteBtnName'),
                            type: 'danger',
                            permission: '040104',
                            handleRowClick: (index, row) => {
                                this.$confirm(i18n.t('common.messageBox.delete.title') + row.spreadsheetId, i18n.t('common.messageBox.tips'), {
                                    confirmButtonText: i18n.t('common.btn.confirmBtnName'),
                                    cancelButtonText: i18n.t('common.btn.cancelBtnName'),
                                    type: 'warning'
                                }).then(() => {
                                    // 确定
                                    deleteGoogleSheetConfig({id: row.id}).then((res) => {
                                        if (res.data) {
                                            this.queryPage()
                                            this.$message.success(i18n.t('common.success'));
                                            this.addDialogData.visible = false;
                                        } else {
                                            this.$message.error(i18n.t('common.error') + ":" + res.data);
                                        }
                                    })
                                });
                            }
                        },
                    ]
                },
            },

            /**
             * 底部工具按钮
             */
            tool: {
                toolBtn: [
                    {
                        name: i18n.t('common.tool.exportTemplate'),
                        permission: '040107',
                        handleClick: this.exportTemplate,
                    },
                ],
                toolDropDown: [
                    {
                        name: i18n.t('common.tool.batchExport.choose'),
                        key: 'export',
                        permission: '040108',
                        handleClick: this.batchExport,
                        options: [
                            {
                                permission: '040108',
                                key: 'choose',
                                name: i18n.t('common.tool.batchExport.choose'),
                            },
                            {
                                permission: '040109',
                                key: 'query',
                                name: i18n.t('common.tool.batchExport.query'),
                            },
                            {
                                permission: '040110',
                                key: 'all',
                                name: i18n.t('common.tool.batchExport.all'),
                            },
                        ],
                    },
                ],
            },
            // 多选框
            selected: [],

            /**
             * 弹出框
             */
            // 弹出框的宽度
            dialogWidth: '50%',
            // 新增
            addDialogData: {
                visible: false,
                modelItem: [
                    {
                        disabled: true,
                        required: false,
                        type: 'input',
                        length: 128,
                        key: 'spreadsheetId',
                        name: i18n.t('view.googleSheetConfig.spreadsheetId'),
                    },
                    {
                        required: false,
                        type: 'dictSelect',
                        length: 32,
                        key: 'status',
                        name: i18n.t('view.googleSheetConfig.status'),
                        dictSelect: {
                            dictCode: 'google.sheet.configuration.status'
                        }
                    },
                    {
                        required: false,
                        type: 'input',
                        length: 255,
                        key: 'remark',
                        name: i18n.t('view.googleSheetConfig.remark'),
                    },
                    {
                        type: 'dictSelect',
                        length: 8,
                        key: 'outputHeader',
                        name: i18n.t('view.googleSheetConfig.outputHeader'),
                        dictSelect: {
                            dictCode: 'sys.yes.no'
                        }
                    },
                    {
                        type: 'dictSelect',
                        length: 8,
                        key: 'ignoreDrive',
                        name: i18n.t('view.googleSheetConfig.ignoreDrive'),
                        dictSelect: {
                            dictCode: 'sys.yes.no'
                        }
                    },
                    {
                        type: 'input',
                        length: 255,
                        key: 'sourceUrl',
                        name: i18n.t('view.googleSheetConfig.sourceUrl'),
                    },
                    {
                        type: 'input',
                        length: 255,
                        key: 'sourceSheet',
                        name: i18n.t('view.googleSheetConfig.sourceSheet'),
                    },
                    {
                        type: 'input',
                        length: 255,
                        key: 'dataRange',
                        name: i18n.t('view.googleSheetConfig.dataRange'),
                    },
                    {
                        type: 'input',
                        length: 255,
                        key: 'judgeCondition',
                        name: i18n.t('view.googleSheetConfig.judgeCondition'),
                    },
                    {
                        required: false,
                        type: 'input',
                        length: 255,
                        key: 'compareField',
                        name: i18n.t('view.googleSheetConfig.compareField'),
                    },
                    {
                        required: false,
                        type: 'input',
                        length: 255,
                        key: 'outputField',
                        name: i18n.t('view.googleSheetConfig.outputField'),
                    },
                    {
                        type: 'input',
                        length: 255,
                        key: 'outputMode',
                        name: i18n.t('view.googleSheetConfig.outputMode'),
                    },
                    {
                        required: false,
                        type: 'input',
                        length: 255,
                        key: 'cron',
                        name: i18n.t('view.googleSheetConfig.cron'),
                    },
                    {
                        type: 'input',
                        length: 255,
                        key: 'targetUrl',
                        name: i18n.t('view.googleSheetConfig.targetUrl'),
                    },
                    {
                        type: 'input',
                        length: 255,
                        key: 'targetSheet',
                        name: i18n.t('view.googleSheetConfig.targetSheet'),
                    },
                    {
                        required: false,
                        type: 'input',
                        length: 255,
                        key: 'targetStart',
                        name: i18n.t('view.googleSheetConfig.targetStart'),
                    },
                ],
                model: {},
            },
            // 修改
            modifyDialogData: {
                visible: false,
                title: i18n.t('common.dialog.dialogModifyTitle'),
                modelItem: [
                    {
                        disabled: true,
                        required: false,
                        type: 'input',
                        length: 128,
                        key: 'spreadsheetId',
                        name: i18n.t('view.googleSheetConfig.spreadsheetId'),
                    },
                    {
                        required: false,
                        type: 'dictSelect',
                        length: 32,
                        key: 'status',
                        name: i18n.t('view.googleSheetConfig.status'),
                        dictSelect: {
                            dictCode: 'google.sheet.configuration.status'
                        }
                    },
                    {
                        required: false,
                        type: 'input',
                        length: 255,
                        key: 'remark',
                        name: i18n.t('view.googleSheetConfig.remark'),
                    },
                    {
                        type: 'dictSelect',
                        length: 8,
                        key: 'outputHeader',
                        name: i18n.t('view.googleSheetConfig.outputHeader'),
                        dictSelect: {
                            dictCode: 'sys.yes.no'
                        }
                    },
                    {
                        type: 'dictSelect',
                        length: 8,
                        key: 'ignoreDrive',
                        name: i18n.t('view.googleSheetConfig.ignoreDrive'),
                        dictSelect: {
                            dictCode: 'sys.yes.no'
                        }
                    },
                    {
                        type: 'input',
                        length: 255,
                        key: 'sourceUrl',
                        name: i18n.t('view.googleSheetConfig.sourceUrl'),
                    },
                    {
                        type: 'input',
                        length: 255,
                        key: 'sourceSheet',
                        name: i18n.t('view.googleSheetConfig.sourceSheet'),
                    },
                    {
                        type: 'input',
                        length: 255,
                        key: 'dataRange',
                        name: i18n.t('view.googleSheetConfig.dataRange'),
                    },
                    {
                        type: 'input',
                        length: 255,
                        key: 'judgeCondition',
                        name: i18n.t('view.googleSheetConfig.judgeCondition'),
                    },
                    {
                        required: false,
                        type: 'input',
                        length: 255,
                        key: 'compareField',
                        name: i18n.t('view.googleSheetConfig.compareField'),
                    },
                    {
                        required: false,
                        type: 'input',
                        length: 255,
                        key: 'outputField',
                        name: i18n.t('view.googleSheetConfig.outputField'),
                    },
                    {
                        type: 'input',
                        length: 255,
                        key: 'outputMode',
                        name: i18n.t('view.googleSheetConfig.outputMode'),
                    },
                    {
                        required: false,
                        type: 'input',
                        length: 255,
                        key: 'cron',
                        name: i18n.t('view.googleSheetConfig.cron'),
                    },
                    {
                        type: 'input',
                        length: 255,
                        key: 'targetUrl',
                        name: i18n.t('view.googleSheetConfig.targetUrl'),
                    },
                    {
                        type: 'input',
                        length: 255,
                        key: 'targetSheet',
                        name: i18n.t('view.googleSheetConfig.targetSheet'),
                    },
                    {
                        required: false,
                        type: 'input',
                        length: 255,
                        key: 'targetStart',
                        name: i18n.t('view.googleSheetConfig.targetStart'),
                    },
                ],
                model: {},
            },
            // 详情
            infoDialogData: {
                visible: false,
                modelItem: [
                    {
                        type: 'input',
                        length: 64,
                        key: 'id',
                        name: i18n.t('view.googleSheetConfig.id'),
                    },
                    {
                        type: 'input',
                        length: 128,
                        key: 'spreadsheetId',
                        name: i18n.t('view.googleSheetConfig.spreadsheetId'),
                    },
                    {
                        type: 'dictSelect',
                        length: 32,
                        key: 'status',
                        name: i18n.t('view.googleSheetConfig.status'),
                        dictSelect: {
                            dictCode: 'google.sheet.configuration.status'
                        }
                    },
                    {
                        type: 'input',
                        length: 255,
                        key: 'remark',
                        name: i18n.t('view.googleSheetConfig.remark'),
                    },
                    {
                        type: 'input',
                        length: 32,
                        key: 'creUserId',
                        name: i18n.t('view.googleSheetConfig.creUserId'),
                    },
                    {
                        type: 'datetime',
                        key: 'creTime',
                        name: i18n.t('view.googleSheetConfig.creTime'),
                    },
                    {
                        type: 'input',
                        length: 32,
                        key: 'updUserId',
                        name: i18n.t('view.googleSheetConfig.updUserId'),
                    },
                    {
                        type: 'datetime',
                        key: 'updTime',
                        name: i18n.t('view.googleSheetConfig.updTime'),
                    },
                    {
                        type: 'dictSelect',
                        length: 8,
                        key: 'outputHeader',
                        name: i18n.t('view.googleSheetConfig.outputHeader'),
                        dictSelect: {
                            dictCode: 'sys.yes.no'
                        }
                    },
                    {
                        type: 'dictSelect',
                        length: 8,
                        key: 'ignoreDrive',
                        name: i18n.t('view.googleSheetConfig.ignoreDrive'),
                        dictSelect: {
                            dictCode: 'sys.yes.no'
                        }
                    },
                    {
                        type: 'input',
                        length: 255,
                        key: 'sourceUrl',
                        name: i18n.t('view.googleSheetConfig.sourceUrl'),
                    },
                    {
                        type: 'input',
                        length: 255,
                        key: 'sourceSheet',
                        name: i18n.t('view.googleSheetConfig.sourceSheet'),
                    },
                    {
                        type: 'input',
                        length: 255,
                        key: 'dataRange',
                        name: i18n.t('view.googleSheetConfig.dataRange'),
                    },
                    {
                        type: 'input',
                        length: 255,
                        key: 'judgeCondition',
                        name: i18n.t('view.googleSheetConfig.judgeCondition'),
                    },
                    {
                        type: 'input',
                        length: 255,
                        key: 'compareField',
                        name: i18n.t('view.googleSheetConfig.compareField'),
                    },
                    {
                        type: 'input',
                        length: 255,
                        key: 'outputField',
                        name: i18n.t('view.googleSheetConfig.outputField'),
                    },
                    {
                        type: 'input',
                        length: 255,
                        key: 'outputMode',
                        name: i18n.t('view.googleSheetConfig.outputMode'),
                    },
                    {
                        type: 'input',
                        length: 255,
                        key: 'cron',
                        name: i18n.t('view.googleSheetConfig.cron'),
                    },
                    {
                        type: 'input',
                        length: 255,
                        key: 'targetUrl',
                        name: i18n.t('view.googleSheetConfig.targetUrl'),
                    },
                    {
                        type: 'input',
                        length: 255,
                        key: 'targetSheet',
                        name: i18n.t('view.googleSheetConfig.targetSheet'),
                    },
                    {
                        type: 'input',
                        length: 255,
                        key: 'targetStart',
                        name: i18n.t('view.googleSheetConfig.targetStart'),
                    },
                ],
                model: {},
            },
            // 批量新增
            batchDialogData: {
                width: "80%",
                visible: false,
                fullscreen: false,
                excelData: {
                    tableHeader: [],
                    tableData: [],
                    file: null,
                },
            },

            // 缓存弹框配置
            cacheGrid: {
                visible: false,
                linkUrl: "https://docs.google.com/spreadsheets/u/0/",
                title: "测试",
                gridOptions: {
                    enableRangeSelection: true,
                    enableClipboard: true,
                    sideBar: {
                        toolPanels: [
                            {
                                id: 'columns',
                                labelDefault: 'Columns',
                                labelKey: 'columns',
                                iconKey: 'columns',
                                toolPanel: 'agColumnsToolPanel',
                                toolPanelParams: {
                                    suppressRowGroups: true,
                                    suppressValues: true,
                                    suppressPivots: true,
                                    suppressPivotMode: true
                                }
                            },
                            {
                                id: 'filters',
                                labelDefault: 'Filters',
                                labelKey: 'filters',
                                iconKey: 'filter',
                                toolPanel: 'agFiltersToolPanel',
                            }
                        ],
                        defaultToolPanel: 'columns'
                    }
                },
                columnDefs: "",
                rowData: [],
            },
            // 事件弹框配置
            eventGrid: {
                host: "https://us.posthog.com",
                project: "85867",
                apiKey: "phx_apIWBmYRALmdzndWYpV1lh1X5V6hitAFKqjLtq4799DgO81",
                visible: false,
                linkUrl: "https://docs.google.com/spreadsheets/u/0/",
                title: "测试",
                currenObj: {},
                datetimeScope: this.getDefaultDateRange(),
                gridOptions: {
                    enableRangeSelection: true,
                    enableClipboard: true,
                    masterDetail: true,
                    detailCellRendererParams: {
                        detailGridOptions: {
                            columnDefs: [],
                            domLayout: 'autoHeight'
                        },
                        getDetailRowData: function (params) {
                            if (params.data && params.data.details) {
                                params.successCallback(params.data.details);
                            } else {
                                params.successCallback([]);
                            }
                        }
                    }
                },
                columnDefs: [],
                rowData: []
            },
            pickerOptions: {
                shortcuts: [{
                    text: '最近一周',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近一个月',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近三个月',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                        picker.$emit('pick', [start, end]);
                    }
                }]
            },

        }
    },
    methods: {
        /**
         * 页面初始化方法
         */
        async init() {
            // 获取列表
            await this.queryPage()
        },

        /**
         * 表格内部
         */
        // 页数事件
        changeSize(size) {
            this.dataSource.pagination.size = size;
            this.queryPage();
        },
        // 页码事件
        changeCurrent(current) {
            this.dataSource.pagination.current = current;
            this.queryPage();
        },
        // 当表格的排序条件发生改变并且数据被重新排序时，触发该事件
        sortChange(sort) {
            if (sort.order !== null) {
                this.dataSource.sort.sortOrder = sort.order === "ascending" ? "ASC" : "DESC";
                this.dataSource.sort.sortProp = sort.prop;
            } else {
                this.dataSource.sort.sortOrder = null;
                this.dataSource.sort.sortProp = null;
            }
            this.queryPage();
        },
        // 多选事件
        selectionChange(selectRows) {
            this.selected = selectRows.map(item => item.id);
        },
        // 编辑
        modify(data) {
            this.$confirm(i18n.t('common.messageBox.modify.title'), i18n.t('common.messageBox.tips'), {
                confirmButtonText: i18n.t('common.btn.confirmBtnName'),
                cancelButtonText: i18n.t('common.btn.cancelBtnName'),
                type: 'warning'
            }).then(() => {
                saveGoogleSheetConfig(data).then((res) => {
                    if (res.data) {
                        this.$message.success(i18n.t('common.success'));
                        this.modifyDialogData.visible = false;
                        this.queryPage()
                    } else {
                        this.$message.error(i18n.t('common.error') + ":" + res.data);
                    }
                })
            });
        },

        /**
         * 搜索框
         */
        // 获取列表数据
        async queryPage() {
            this.dataSource.loading = true;
            try {
                const {pagination, sort} = this.dataSource;
                const res = await queryPageGoogleSheetConfig({...pagination, ...sort, ...this.filterData.listQuery});
                const {records, size, current, total} = res.data;
                this.dataSource.data = records;
                this.dataSource.pagination.size = records.length > 0 ? size : 10;
                this.dataSource.pagination.current = records.length > 0 ? current : 1;
                this.dataSource.pagination.total = records.length > 0 ? total : 0;
                this.$nextTick(() => {
                    this.dataSource.loading = false;
                });
            } catch (error) {
                this.$message.error(i18n.t('common.error') + ":" + error);
                this.dataSource.loading = false;
            }
        },
        // 新增
        add(data) {
            this.$confirm(i18n.t('common.messageBox.add.title'), i18n.t('common.messageBox.tips'), {
                confirmButtonText: i18n.t('common.btn.confirmBtnName'),
                cancelButtonText: i18n.t('common.btn.cancelBtnName'),
                type: 'warning'
            }).then(() => {
                // 确定
                saveGoogleSheetConfig(data).then((res) => {
                    if (res.data) {
                        this.queryPage()
                        this.$message.success(i18n.t('common.success'));
                        this.addDialogData.visible = false;
                        this.queryPage();
                    } else {
                        this.$message.error(i18n.t('common.error') + ":" + res.data);
                    }
                }).finally(() => {
                    this.addDialogData.visible = false;
                });
            });
        },
        // 批量新增
        batchAdd() {
            try {
                saveBatchGoogleSheetConfig(this.batchDialogData.excelData.file).then((res) => {
                    if (res.data) {
                        this.queryPage();
                        this.$message.success(i18n.t('common.success'));
                        this.batchDialogData.visible = false;
                    } else {
                        this.$message.error(i18n.t('common.error') + ":" + res.data);
                    }
                });
            } catch (error) {
                this.$message.error(i18n.t('common.error') + ":" + error);
            } finally {
                this.batchDialogData.visible = false;
            }
        },
        // 批量删除
        batchDelete() {
            this.$confirm(i18n.t('common.messageBox.batchDelete.title'), i18n.t('common.messageBox.tips'), {
                confirmButtonText: i18n.t('common.btn.confirmBtnName'),
                cancelButtonText: i18n.t('common.btn.cancelBtnName'),
                type: 'warning'
            }).then(() => {
                // 确定
                deleteBatchGoogleSheetConfig(this.selected).then((res) => {
                    if (res.data) {
                        this.queryPage()
                        this.$message.success(i18n.t('common.success'));
                    } else {
                        this.$message.error(i18n.t('common.error') + ":" + res.data);
                    }
                }).finally(() => {
                    this.selected = [];
                });
            });
        },

        /**
         * 工具栏
         */
        // 导出模板
        exportTemplate() {
            exportTemplateGoogleSheetConfig();
        },
        // 批量导出
        batchExport(key) {
            const EXPORT_TYPE = {
                EXPORT: 'export',
                CHOOSE: 'choose',
                QUERY: 'query',
                ALL: 'all',
            };
            const EXPORT_SUCCESS_MSG = i18n.t('common.tool.exportSuccess');
            const EXPORT_CHOOSE_NULL_ERROR_MSG = i18n.t('common.tool.exportChooseNullError');
            const EXPORT_ERROR_MSG = i18n.t('common.tool.exportError');
            switch (key) {
                case EXPORT_TYPE.EXPORT:
                case EXPORT_TYPE.CHOOSE: {
                    const hasSelected = this.selected.length > 0;
                    this.$message.success(EXPORT_SUCCESS_MSG);
                    hasSelected ? exportChoseExcelGoogleSheetConfig(this.selected) : this.$message.error(EXPORT_CHOOSE_NULL_ERROR_MSG);
                    break;
                }
                case EXPORT_TYPE.QUERY:
                    this.$message.success(EXPORT_SUCCESS_MSG);
                    exportParamExcelGoogleSheetConfig({...this.filterData.listQuery});
                    break;
                case EXPORT_TYPE.ALL:
                    this.$message.success(EXPORT_SUCCESS_MSG);
                    exportExcelGoogleSheetConfig();
                    break;
                default:
                    this.$message.error(EXPORT_ERROR_MSG);
                    break;
            }
        },

        processCacheAgGridData(data) {
            if (!data.length) return;

            // 第一行为列定义
            this.cacheGrid.columnDefs = data[0].map(header => ({
                headerName: header,
                field: header.toLowerCase(),
                sortable: true,
                filter: true,
                resizable: true
            }));

            // 剩余行为行数据
            this.cacheGrid.rowData = data.slice(1).map(row => {
                let rowData = {};
                row.forEach((cell, index) => {
                    let fieldName = data[0][index].toLowerCase();
                    rowData[fieldName] = cell;
                });
                return rowData;
            });
        },

        async getEventByProperties() {
            const url = `${this.eventGrid.host}/api/projects/${this.eventGrid.project}/query/`;
            const body = {
                query: {
                    kind: "HogQLQuery",
                    query: `select *
                            from events
                            where event = '${this.eventGrid.currenObj.status}'
                              and properties.sourceUrl = '${this.eventGrid.currenObj.sourceUrl}'
                              and properties.sourceSheet = '${this.eventGrid.currenObj.sourceSheet}'
                              and timestamp
                                > '${this.eventGrid.datetimeScope[0]}'
                              and timestamp
                                < '${this.eventGrid.datetimeScope[1]}'
                            order by timestamp asc`
                }
            };
            const config = {
                headers: {
                    'Content-Type': "application/json",
                    'Authorization': `Bearer ${this.eventGrid.apiKey}`,
                }
            };

            try {
                const response = await axios.post(url, body, config);
                this.processData(response.data.types, response.data.results);
                this.eventGrid.title = "【来源】：" + this.eventGrid.currenObj.sourceUrl + "   【页签】：" + this.eventGrid.currenObj.sourceSheet
                this.eventGrid.linkUrl = "https://docs.google.com/spreadsheets/d/" + this.eventGrid.currenObj.sourceUrl
                this.eventGrid.visible = true;
            } catch (error) {
                console.error('Error fetching data:', error);
                this.data = `Failed to fetch data: ${error.message}`;
            }
        },
        processData(columnDefsList, data) {
            if (!data.length) return;

            this.eventGrid.columnDefs = columnDefsList.map(([field, type]) => ({
                headerName: field.replace(/_/g, ' ').replace(/\$+/g, '').replace(/([a-z])([A-Z])/g, '$1 $2'),
                field: field.toLowerCase(),
                sortable: true,
                filter: true,
                resizable: true,
                cellRenderer: field.toLowerCase() === 'properties' ? 'agGroupCellRenderer' : null
            }));

            let flag = true; // 控制只执行一次
            this.eventGrid.rowData = data.map(row => {
                let rowData = {};
                columnDefsList.forEach(([field], index) => {
                    if (field.toLowerCase() === "properties") {
                        try {
                            let details = JSON.parse(row[index]);
                            if (flag) {
                                this.processChildrenColDefs(details);
                                flag = false;
                            }
                            rowData[field.toLowerCase()] = row[index];
                            rowData["details"] = [details];
                        } catch (e) {
                            console.error('Error parsing properties:', e);
                            rowData[field.toLowerCase()] = {};
                            rowData["details"] = [];
                        }
                    } else {
                        rowData[field.toLowerCase()] = row[index];
                    }
                });
                return rowData;
            });
        },
        processChildrenColDefs(data) {
            this.eventGrid.gridOptions.detailCellRendererParams.detailGridOptions.columnDefs = Object.keys(data).map(key => ({
                headerName: key.replace(/_/g, ' ').replace(/\$+/g, '').replace(/([a-z])([A-Z])/g, '$1 $2'), // 使列名更易读
                field: key,  // 确保 field 名称为小写
                sortable: true,
                filter: true,
                resizable: true
            }));
        },
        getDefaultDateRange() {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            return [formatDate(start), formatDate(end)];
        },
    }
}
</script>

<style scoped>
::v-deep .ag-details-row {
    padding: 0px 0px 0px 20px;
}

::v-deep .ag-theme-alpine .ag-layout-auto-height .ag-center-cols-clipper, .ag-theme-alpine .ag-layout-auto-height .ag-center-cols-container, .ag-theme-alpine .ag-layout-print .ag-center-cols-clipper, .ag-theme-alpine .ag-layout-print .ag-center-cols-container, .ag-theme-alpine-dark .ag-layout-auto-height .ag-center-cols-clipper, .ag-theme-alpine-dark .ag-layout-auto-height .ag-center-cols-container, .ag-theme-alpine-dark .ag-layout-print .ag-center-cols-clipper, .ag-theme-alpine-dark .ag-layout-print .ag-center-cols-container {
    min-height: 45px;
}
</style>
