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
            :required="false"
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
            :title="grid.title"
            :visible.sync="grid.visible"
            top="10%"
            width="90%"
            @submit="grid.visible=false">
            <template v-slot:title-slot>
                <a type="primary" :href="grid.linkUrl" target="_blank"
                         style="color: inherit; text-decoration: none;">
                    <span style="color: deepskyblue">{{ grid.title }}</span>
                </a>
            </template>
            <ag-grid-vue
                class="ag-theme-alpine"
                style="width: 100%; height: 400px;"
                :columnDefs="grid.columnDefs"
                :rowData="grid.rowData"
                :gridOptions="grid.gridOptions">
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

export default {
    name: 'GoogleConfig',
    components: {AgGridVue, ImageUpload, searchPane, tablePane, MyDialog, UploadExcelComponent, BackToTop},
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
                        key: 'outputHeader',
                        length: 8,
                        name: i18n.t('view.googleSheetConfig.outputHeader'),
                    },
                    {
                        key: 'ignoreDrive',
                        length: 8,
                        name: i18n.t('view.googleSheetConfig.ignoreDrive'),
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
                        key: 'outputHeader',
                        label: i18n.t('view.googleSheetConfig.outputHeader'),
                        sortable: true,
                    },
                    {
                        width: 150,
                        key: 'ignoreDrive',
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
                    width: 80 * 6,
                    data: [
                        {
                            name: "发起",
                            type: 'success',
                            permission: '040106',
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
                            name: "配置",
                            type: 'primary',
                            permission: '040106',
                            handleRowClick: (index, row) => {
                                getCacheSpreadsheetContent({
                                    "sourceUrl": row.sourceUrl,
                                    "sourceSheet": row.sourceSheet
                                }).then((res) => {
                                    this.grid.title = "【来源】：" + row.sourceUrl + "   【页签】：" + row.sourceSheet
                                    this.grid.linkUrl = "https://docs.google.com/spreadsheets/d/" + row.sourceUrl
                                    this.processData(res.data)
                                    this.grid.visible = true;
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
                            permission: '040102,040106',
                            handleRowClick: (index, row) => {
                                selectGoogleSheetConfig({id: row.id}).then((res) => {
                                    this.modifyDialogData.title = "复制";
                                    this.modifyDialogData.model = res.data
                                    this.$set(this.modifyDialogData.model, 'id', "")
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
                            permission: '040104',
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
                        type: 'input',
                        length: 128,
                        key: 'spreadsheetId',
                        name: i18n.t('view.googleSheetConfig.spreadsheetId'),
                    },
                    {
                        type: 'select',
                        length: 32,
                        key: 'status',
                        name: i18n.t('view.googleSheetConfig.status'),
                    },
                    {
                        type: 'input',
                        length: 255,
                        key: 'remark',
                        name: i18n.t('view.googleSheetConfig.remark'),
                    },
                    {
                        type: 'input',
                        length: 8,
                        key: 'outputHeader',
                        name: i18n.t('view.googleSheetConfig.outputHeader'),
                    },
                    {
                        type: 'input',
                        length: 8,
                        key: 'ignoreDrive',
                        name: i18n.t('view.googleSheetConfig.ignoreDrive'),
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
            // 修改
            modifyDialogData: {
                visible: false,
                title: i18n.t('common.dialog.dialogModifyTitle'),
                modelItem: [
                    {
                        type: 'input',
                        length: 128,
                        key: 'spreadsheetId',
                        name: i18n.t('view.googleSheetConfig.spreadsheetId'),
                    },
                    {
                        type: 'input',
                        length: 32,
                        key: 'status',
                        name: i18n.t('view.googleSheetConfig.status'),
                    },
                    {
                        type: 'input',
                        length: 255,
                        key: 'remark',
                        name: i18n.t('view.googleSheetConfig.remark'),
                    },
                    {
                        type: 'input',
                        length: 8,
                        key: 'outputHeader',
                        name: i18n.t('view.googleSheetConfig.outputHeader'),
                    },
                    {
                        type: 'input',
                        length: 8,
                        key: 'ignoreDrive',
                        name: i18n.t('view.googleSheetConfig.ignoreDrive'),
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
                        type: 'input',
                        length: 32,
                        key: 'status',
                        name: i18n.t('view.googleSheetConfig.status'),
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
                        type: 'input',
                        length: 8,
                        key: 'outputHeader',
                        name: i18n.t('view.googleSheetConfig.outputHeader'),
                    },
                    {
                        type: 'input',
                        length: 8,
                        key: 'ignoreDrive',
                        name: i18n.t('view.googleSheetConfig.ignoreDrive'),
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

            // AgGridVue
            grid: {
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
                columnDefs: ""
            }
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

        processData(data) {
            if (!data.length) return;

            // 第一行为列定义
            this.grid.columnDefs = data[0].map(header => ({
                headerName: header,
                field: header.toLowerCase(),
                sortable: true,
                filter: true,
                resizable: true
            }));

            // 剩余行为行数据
            this.grid.rowData = data.slice(1).map(row => {
                let rowData = {};
                row.forEach((cell, index) => {
                    let fieldName = data[0][index].toLowerCase();
                    rowData[fieldName] = cell;
                });
                return rowData;
            });
        }
    }
}
</script>
