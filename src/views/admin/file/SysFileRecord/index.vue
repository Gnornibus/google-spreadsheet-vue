<template>
    <div>
        <search-pane :filter-data="filterData" :sort="this.dataSource.sort" />
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
            @submit="add" />
        <my-dialog
            :model="modifyDialogData.model"
            :modelItem="modifyDialogData.modelItem"
            :title="$t('common.dialog.dialogModifyTitle')"
            :visible.sync="modifyDialogData.visible"
            :width="dialogWidth"
            @close="queryPage()"
            @submit="modify" />
        <my-dialog
            :componentsDisabled="true"
            :model="infoDialogData.model"
            :modelItem="infoDialogData.modelItem"
            :title="$t('common.dialog.dialogInfoTitle')"
            :visible.sync="infoDialogData.visible"
            :required="false"
            :width="dialogWidth"
            @close="queryPage()"
            @submit="()=>{this.infoDialogData.visible=false}" />
        <my-dialog
            :fullscreen="batchDialogData.fullscreen"
            :title="$t('common.dialog.dialogBatchTitle')"
            :visible.sync="batchDialogData.visible"
            :width="batchDialogData.width"
            @submit="batchAdd">
            <upload-excel-component :excelData="batchDialogData.excelData" />
        </my-dialog>
    </div>
</template>

<script>
import searchPane from '@/components/SearchPane';
import tablePane from '@/components/TablePane';
import MyDialog from '@/components/Dialog';
import {
    deleteBatchSysFileRecord,
    deleteSysFileRecord,
    exportChoseExcelSysFileRecord,
    exportExcelSysFileRecord,
    exportParamExcelSysFileRecord,
    exportTemplateSysFileRecord,
    queryPageSysFileRecord,
    saveBatchSysFileRecord,
    saveSysFileRecord,
    selectSysFileRecord,
} from "@/api/sys-file-record-api";
import i18n from '@/common/lang';
import UploadExcelComponent from '@/components/UploadExcel/index.vue';
import BackToTop from "@/components/BackToTop";

export default {
    name: 'SysFileRecord',
    components: {searchPane, tablePane, MyDialog, UploadExcelComponent, BackToTop},
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
                        permission: '970101',
                        handleClick: this.queryPage,
                    },
                    addBtn: {
                        permission: '970102',
                        handleClick: () => {
                            this.addDialogData.visible = true
                        },
                    },
                    batchAddBtn: {
                        permission: '970103',
                        handleClick: () => {
                            this.batchDialogData.visible = true;
                        },
                    },
                    batchDeleteBtn: {
                        permission: '970105',
                        handleClick: this.batchDelete,
                    },
                },

                // 精准数据输入框
                decimal: [
                ],
                // 数字输入框
                numbers: [
                    {
                        key: 'id',
                        length: 11,
                        name: i18n.t('view.sysFileRecord.id'),
                    },
                    {
                        key: 'fileSize',
                        length: 11,
                        name: i18n.t('view.sysFileRecord.fileSize'),
                    },
                    {
                        key: 'creUserName',
                        length: 11,
                        name: i18n.t('view.sysFileRecord.creUserName'),
                    },
                ],
                // 搜索输入框
                inputs: [
                    {
                        key: 'platId',
                        length: 11,
                        name: i18n.t('view.sysFileRecord.platId'),
                    },
                    {
                        key: 'fileName',
                        length: 100,
                        name: i18n.t('view.sysFileRecord.fileName'),
                    },
                    {
                        key: 'name',
                        length: 100,
                        name: i18n.t('view.sysFileRecord.name'),
                    },
                    {
                        key: 'filePath',
                        length: 100,
                        name: i18n.t('view.sysFileRecord.filePath'),
                    },
                    {
                        key: 'fileType',
                        length: 20,
                        name: i18n.t('view.sysFileRecord.fileType'),
                    },
                ],
                // 搜索下拉框
                selects: [
                ],
                // 搜索日期框
                datePickers: [
                ],
                // 搜索日期及时间框
                dateTimePickers: [
                    {
                        key: 'creTime',
                        name: i18n.t('view.sysFileRecord.creTime'),
                    },
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
                        label: i18n.t('view.sysFileRecord.id'),
                        sortable: true,
                    },
                    {
                        key: 'platId',
                        label: i18n.t('view.sysFileRecord.platId'),
                        sortable: true,
                    },
                    {
                        key: 'fileName',
                        label: i18n.t('view.sysFileRecord.fileName'),
                        sortable: true,
                    },
                    {
                        key: 'name',
                        label: i18n.t('view.sysFileRecord.name'),
                        sortable: true,
                    },
                    {
                        key: 'filePath',
                        label: i18n.t('view.sysFileRecord.filePath'),
                        sortable: true,
                    },
                    {
                        key: 'fileSize',
                        label: i18n.t('view.sysFileRecord.fileSize'),
                        sortable: true,
                    },
                    {
                        key: 'fileType',
                        label: i18n.t('view.sysFileRecord.fileType'),
                        sortable: true,
                    },
                    {
                        key: 'creUserName',
                        label: i18n.t('view.sysFileRecord.creUserName'),
                        sortable: true,
                    },
                    {
                        width: 160,
                        key: 'creTime',
                        label: i18n.t('view.sysFileRecord.creTime'),
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
                    width: 80 * 3,
                    data: [
                        {
                            name: i18n.t('common.btn.infoBtnName'),
                            type: 'primary',
                            permission: '970106',
                            handleRowClick: (index, row) => {
                                selectSysFileRecord({id: row.id}).then((res) => {
                                    this.infoDialogData.model = res.data
                                    this.infoDialogData.visible = true;
                                })
                            }
                        },
                        {
                            name: i18n.t('common.btn.modifyBtnName'),
                            type: 'primary',
                            permission: '970102,970106',
                            handleRowClick: (index, row) => {
                                selectSysFileRecord({id: row.id}).then((res) => {
                                    this.modifyDialogData.model = res.data
                                    this.modifyDialogData.visible = true;
                                })
                            }
                        },
                        {
                            name: i18n.t('common.btn.deleteBtnName'),
                            type: 'danger',
                            permission: '970104',
                            handleRowClick: (index, row) => {
                                this.$confirm(i18n.t('common.messageBox.delete.title') + row.name, i18n.t('common.messageBox.tips'), {
                                    confirmButtonText: i18n.t('common.btn.confirmBtnName'),
                                    cancelButtonText: i18n.t('common.btn.cancelBtnName'),
                                    type: 'warning'
                                }).then(() => {
                                    // 确定
                                    deleteSysFileRecord({id: row.id}).then((res) => {
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
                        permission: '970107',
                        handleClick: this.exportTemplate,
                    },
                ],
                toolDropDown: [
                    {
                        name: i18n.t('common.tool.batchExport.choose'),
                        key: 'export',
                        permission: '970108',
                        handleClick: this.batchExport,
                        options: [
                            {
                                permission: '970108',
                                key: 'choose',
                                name: i18n.t('common.tool.batchExport.choose'),
                            },
                            {
                                permission: '970109',
                                key: 'query',
                                name: i18n.t('common.tool.batchExport.query'),
                            },
                            {
                                permission: '970110',
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
                        length: 11,
                        key: 'platId',
                        name: i18n.t('view.sysFileRecord.platId'),
                    },
                    {
                        type: 'input',
                        length: 100,
                        key: 'fileName',
                        name: i18n.t('view.sysFileRecord.fileName'),
                    },
                    {
                        type: 'input',
                        length: 100,
                        key: 'name',
                        name: i18n.t('view.sysFileRecord.name'),
                    },
                    {
                        type: 'input',
                        length: 100,
                        key: 'filePath',
                        name: i18n.t('view.sysFileRecord.filePath'),
                    },
                    {
                        type: 'number',
                        length: 11,
                        key: 'fileSize',
                        name: i18n.t('view.sysFileRecord.fileSize'),
                    },
                    {
                        type: 'input',
                        length: 20,
                        key: 'fileType',
                        name: i18n.t('view.sysFileRecord.fileType'),
                    },
                ],
                model: {},
            },
            // 修改
            modifyDialogData: {
                visible: false,
                modelItem: [
                    {
                        disabled: true,
                        type: 'number',
                        length: 11,
                        key: 'id',
                        name: i18n.t('view.sysFileRecord.id'),
                    },
                    {
                        type: 'input',
                        length: 11,
                        key: 'platId',
                        name: i18n.t('view.sysFileRecord.platId'),
                    },
                    {
                        type: 'input',
                        length: 100,
                        key: 'fileName',
                        name: i18n.t('view.sysFileRecord.fileName'),
                    },
                    {
                        type: 'input',
                        length: 100,
                        key: 'name',
                        name: i18n.t('view.sysFileRecord.name'),
                    },
                    {
                        type: 'input',
                        length: 100,
                        key: 'filePath',
                        name: i18n.t('view.sysFileRecord.filePath'),
                    },
                    {
                        type: 'number',
                        length: 11,
                        key: 'fileSize',
                        name: i18n.t('view.sysFileRecord.fileSize'),
                    },
                    {
                        type: 'input',
                        length: 20,
                        key: 'fileType',
                        name: i18n.t('view.sysFileRecord.fileType'),
                    },
                ],
                model: {},
            },
            // 详情
            infoDialogData: {
                visible: false,
                modelItem: [
                    {
                        type: 'number',
                        length: 11,
                        key: 'id',
                        name: i18n.t('view.sysFileRecord.id'),
                    },
                    {
                        type: 'input',
                        length: 11,
                        key: 'platId',
                        name: i18n.t('view.sysFileRecord.platId'),
                    },
                    {
                        type: 'input',
                        length: 100,
                        key: 'fileName',
                        name: i18n.t('view.sysFileRecord.fileName'),
                    },
                    {
                        type: 'input',
                        length: 100,
                        key: 'name',
                        name: i18n.t('view.sysFileRecord.name'),
                    },
                    {
                        type: 'input',
                        length: 100,
                        key: 'filePath',
                        name: i18n.t('view.sysFileRecord.filePath'),
                    },
                    {
                        type: 'number',
                        length: 11,
                        key: 'fileSize',
                        name: i18n.t('view.sysFileRecord.fileSize'),
                    },
                    {
                        type: 'input',
                        length: 20,
                        key: 'fileType',
                        name: i18n.t('view.sysFileRecord.fileType'),
                    },
                    {
                        type: 'number',
                        length: 11,
                        key: 'creUserName',
                        name: i18n.t('view.sysFileRecord.creUserName'),
                    },
                    {
                        type: 'datetime',
                        key: 'creTime',
                        name: i18n.t('view.sysFileRecord.creTime'),
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
            }else {
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
                saveSysFileRecord(data).then((res) => {
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
                const res = await queryPageSysFileRecord({ ...pagination, ...sort, ...this.filterData.listQuery });
                const { records, size, current, total } = res.data;
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
                saveSysFileRecord(data).then((res) => {
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
                saveBatchSysFileRecord(this.batchDialogData.excelData.file).then((res) => {
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
                deleteBatchSysFileRecord(this.selected).then((res) => {
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
            exportTemplateSysFileRecord();
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
                    hasSelected ? exportChoseExcelSysFileRecord(this.selected) : this.$message.error(EXPORT_CHOOSE_NULL_ERROR_MSG);
                    break;
                }
                case EXPORT_TYPE.QUERY:
                    this.$message.success(EXPORT_SUCCESS_MSG);
                    exportParamExcelSysFileRecord({...this.filterData.listQuery});
                    break;
                case EXPORT_TYPE.ALL:
                    this.$message.success(EXPORT_SUCCESS_MSG);
                    exportExcelSysFileRecord();
                    break;
                default:
                    this.$message.error(EXPORT_ERROR_MSG);
                    break;
            }
        }
    }
}
</script>
