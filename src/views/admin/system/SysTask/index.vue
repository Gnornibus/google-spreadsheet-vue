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
    deleteBatchSysTask,
    deleteSysTask,
    exportChoseExcelSysTask,
    exportExcelSysTask,
    exportParamExcelSysTask,
    exportTemplateSysTask,
    queryPageSysTask,
    saveBatchSysTask,
    saveSysTask,
    selectSysTask,
} from "@/api/sys-task-api";
import i18n from '@/common/lang';
import UploadExcelComponent from '@/components/UploadExcel/index.vue';
import BackToTop from "@/components/BackToTop";

export default {
    name: 'SysTask',
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
                        permission: '020501',
                        handleClick: this.queryPage,
                    },
                    addBtn: {
                        permission: '020502',
                        handleClick: () => {
                            this.addDialogData.visible = true
                        },
                    },
                    batchAddBtn: {
                        permission: '020503',
                        handleClick: () => {
                            this.batchDialogData.visible = true;
                        },
                    },
                    batchDeleteBtn: {
                        permission: '020505',
                        handleClick: this.batchDelete,
                    },
                },

                // 数字输入框
                numbers: [
                    {
                        key: 'id',
                        length: 20,
                        name: i18n.t('view.sysTask.id'),
                    },
                ],
                // 搜索输入框
                inputs: [
                    {
                        key: 'name',
                        length: 255,
                        name: i18n.t('view.sysTask.name'),
                    },
                    {
                        key: 'type',
                        length: 255,
                        name: i18n.t('view.sysTask.type'),
                    },
                    {
                        key: 'msg',
                        length: 255,
                        name: i18n.t('view.sysTask.msg'),
                    },
                ],
                // 搜索下拉框
                selects: [
                    {
                        key: 'state',
                        name: i18n.t('view.sysTask.state'),
                        dictSelect: {
                            dictCode: 'sys.enable.disable'
                        }
                    },
                    {
                        key: 'operation',
                        name: i18n.t('view.sysTask.operation'),
                        options: [
                            {
                                key: '0',
                                name: i18n.t('enum.operation.0'),
                            },
                            {
                                key: '1',
                                name: i18n.t('enum.operation.1'),
                            },
                        ]
                    },
                    {
                        key: 'creUserName',
                        name: i18n.t('view.sysTask.creUserName'),
                        dataSelect: {
                            url: 'sys-user',
                        }
                    },
                    {
                        key: 'updUserName',
                        name: i18n.t('view.sysTask.updUserName'),
                        dataSelect: {
                            url: 'sys-user',
                        }
                    },
                ],
                // 搜索日期框
                datePickers: [
                ],
                // 搜索日期及时间框
                dateTimePickers: [
                    {
                        key: 'startTime',
                        name: i18n.t('view.sysTask.startTime'),
                    },
                    {
                        key: 'endTime',
                        name: i18n.t('view.sysTask.endTime'),
                    },
                    {
                        key: 'creTime',
                        name: i18n.t('view.sysTask.creTime'),
                    },
                    {
                        key: 'updTime',
                        name: i18n.t('view.sysTask.updTime'),
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
                        label: i18n.t('view.sysTask.id'),
                        sortable: true,
                    },
                    {
                        key: 'name',
                        label: i18n.t('view.sysTask.name'),
                        sortable: true,
                    },
                    {
                        key: 'type',
                        label: i18n.t('view.sysTask.type'),
                        sortable: true,
                    },
                    {
                        key: 'state',
                        label: i18n.t('view.sysTask.state'),
                        sortable: true,
                        isSpecial: function (value) {
                            switch (value) {
                                case "0":
                                    return i18n.t('enum.state.0');
                                case "1":
                                    return i18n.t('enum.state.1');
                                default:
                                    return i18n.t('enum.unknown');
                            }
                        },
                    },
                    {
                        key: 'operation',
                        label: i18n.t('view.sysTask.operation'),
                        sortable: true,
                        isSpecial: function (value) {
                            switch (value) {
                                case "0":
                                    return i18n.t('enum.operation.0');
                                case "1":
                                    return i18n.t('enum.operation.1');
                                default:
                                    return i18n.t('enum.unknown');
                            }
                        },
                    },
                    {
                        key: 'msg',
                        label: i18n.t('view.sysTask.msg'),
                        sortable: true,
                    },
                    {
                        width: 160,
                        key: 'startTime',
                        label: i18n.t('view.sysTask.startTime'),
                        sortable: true,
                    },
                    {
                        width: 160,
                        key: 'endTime',
                        label: i18n.t('view.sysTask.endTime'),
                        sortable: true,
                    },
                    {
                        key: 'creUserName',
                        label: i18n.t('view.sysTask.creUserName'),
                        sortable: true,
                    },
                    {
                        width: 160,
                        key: 'creTime',
                        label: i18n.t('view.sysTask.creTime'),
                        sortable: true,
                    },
                    {
                        key: 'updUserName',
                        label: i18n.t('view.sysTask.updUserName'),
                        sortable: true,
                    },
                    {
                        width: 160,
                        key: 'updTime',
                        label: i18n.t('view.sysTask.updTime'),
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
                            permission: '020506',
                            handleRowClick: (index, row) => {
                                selectSysTask({id: row.id}).then((res) => {
                                    this.infoDialogData.model = res.data
                                    this.infoDialogData.visible = true;
                                })
                            }
                        },
                        {
                            name: i18n.t('common.btn.modifyBtnName'),
                            type: 'primary',
                            permission: '020502,020506',
                            handleRowClick: (index, row) => {
                                selectSysTask({id: row.id}).then((res) => {
                                    this.modifyDialogData.model = res.data
                                    this.modifyDialogData.visible = true;
                                })
                            }
                        },
                        {
                            name: i18n.t('common.btn.deleteBtnName'),
                            type: 'danger',
                            permission: '020504',
                            handleRowClick: (index, row) => {
                                this.$confirm(i18n.t('common.messageBox.delete.title') + row.name, i18n.t('common.messageBox.tips'), {
                                    confirmButtonText: i18n.t('common.btn.confirmBtnName'),
                                    cancelButtonText: i18n.t('common.btn.cancelBtnName'),
                                    type: 'warning'
                                }).then(() => {
                                    // 确定
                                    deleteSysTask({id: row.id}).then((res) => {
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
                        permission: '020507',
                        handleClick: this.exportTemplate,
                    },
                ],
                toolDropDown: [
                    {
                        name: i18n.t('common.tool.batchExport.choose'),
                        key: 'export',
                        permission: '020508',
                        handleClick: this.batchExport,
                        options: [
                            {
                                permission: '020508',
                                key: 'choose',
                                name: i18n.t('common.tool.batchExport.choose'),
                            },
                            {
                                permission: '020509',
                                key: 'query',
                                name: i18n.t('common.tool.batchExport.query'),
                            },
                            {
                                permission: '020510',
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
                        length: 255,
                        key: 'name',
                        name: i18n.t('view.sysTask.name'),
                    },
                    {
                        type: 'input',
                        length: 255,
                        key: 'type',
                        name: i18n.t('view.sysTask.type'),
                    },
                    {
                        type: 'select',
                        key: 'state',
                        name: i18n.t('view.sysTask.state'),
                        options: [
                            {
                                value: "0",
                                name: i18n.t('enum.state.0'),
                            },
                            {
                                value: "1",
                                name: i18n.t('enum.state.1'),
                            },
                        ],
                    },
                    {
                        type: 'select',
                        key: 'operation',
                        name: i18n.t('view.sysTask.operation'),
                        options: [
                            {
                                value: "0",
                                name: i18n.t('enum.operation.0'),
                            },
                            {
                                value: "1",
                                name: i18n.t('enum.operation.1'),
                            },
                        ],
                    },
                    {
                        type: 'input',
                        length: 255,
                        key: 'msg',
                        name: i18n.t('view.sysTask.msg'),
                    },
                    {
                        type: 'datetime',
                        key: 'startTime',
                        name: i18n.t('view.sysTask.startTime'),
                    },
                    {
                        type: 'datetime',
                        key: 'endTime',
                        name: i18n.t('view.sysTask.endTime'),
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
                        length: 20,
                        key: 'id',
                        name: i18n.t('view.sysTask.id'),
                    },
                    {
                        type: 'input',
                        length: 255,
                        key: 'name',
                        name: i18n.t('view.sysTask.name'),
                    },
                    {
                        type: 'input',
                        length: 255,
                        key: 'type',
                        name: i18n.t('view.sysTask.type'),
                    },
                    {
                        type: 'select',
                        key: 'state',
                        name: i18n.t('view.sysTask.state'),
                        options: [
                            {
                                value: "0",
                                name: i18n.t('enum.state.0'),
                            },
                            {
                                value: "1",
                                name: i18n.t('enum.state.1'),
                            },
                        ],
                    },
                    {
                        type: 'select',
                        key: 'operation',
                        name: i18n.t('view.sysTask.operation'),
                        options: [
                            {
                                value: "0",
                                name: i18n.t('enum.operation.0'),
                            },
                            {
                                value: "1",
                                name: i18n.t('enum.operation.1'),
                            },
                        ],
                    },
                    {
                        type: 'input',
                        length: 255,
                        key: 'msg',
                        name: i18n.t('view.sysTask.msg'),
                    },
                    {
                        type: 'datetime',
                        key: 'startTime',
                        name: i18n.t('view.sysTask.startTime'),
                    },
                    {
                        type: 'datetime',
                        key: 'endTime',
                        name: i18n.t('view.sysTask.endTime'),
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
                        length: 20,
                        key: 'id',
                        name: i18n.t('view.sysTask.id'),
                    },
                    {
                        type: 'input',
                        length: 255,
                        key: 'name',
                        name: i18n.t('view.sysTask.name'),
                    },
                    {
                        type: 'input',
                        length: 255,
                        key: 'type',
                        name: i18n.t('view.sysTask.type'),
                    },
                    {
                        type: 'select',
                        key: 'state',
                        name: i18n.t('view.sysTask.state'),
                        options: [
                            {
                                value: "0",
                                name: i18n.t('enum.state.0'),
                            },
                            {
                                value: "1",
                                name: i18n.t('enum.state.1'),
                            },
                        ],
                    },
                    {
                        type: 'select',
                        key: 'operation',
                        name: i18n.t('view.sysTask.operation'),
                        options: [
                            {
                                value: "0",
                                name: i18n.t('enum.operation.0'),
                            },
                            {
                                value: "1",
                                name: i18n.t('enum.operation.1'),
                            },
                        ],
                    },
                    {
                        type: 'input',
                        length: 255,
                        key: 'msg',
                        name: i18n.t('view.sysTask.msg'),
                    },
                    {
                        type: 'datetime',
                        key: 'startTime',
                        name: i18n.t('view.sysTask.startTime'),
                    },
                    {
                        type: 'datetime',
                        key: 'endTime',
                        name: i18n.t('view.sysTask.endTime'),
                    },
                    {
                        type: 'number',
                        length: 11,
                        key: 'creUserName',
                        name: i18n.t('view.sysTask.creUserName'),
                    },
                    {
                        type: 'datetime',
                        key: 'creTime',
                        name: i18n.t('view.sysTask.creTime'),
                    },
                    {
                        type: 'number',
                        length: 11,
                        key: 'updUserName',
                        name: i18n.t('view.sysTask.updUserName'),
                    },
                    {
                        type: 'datetime',
                        key: 'updTime',
                        name: i18n.t('view.sysTask.updTime'),
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
                saveSysTask(data).then((res) => {
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
                const res = await queryPageSysTask({ ...pagination, ...sort, ...this.filterData.listQuery });
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
                saveSysTask(data).then((res) => {
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
                saveBatchSysTask(this.batchDialogData.excelData.file).then((res) => {
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
                deleteBatchSysTask(this.selected).then((res) => {
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
            exportTemplateSysTask();
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
                    hasSelected ? exportChoseExcelSysTask(this.selected) : this.$message.error(EXPORT_CHOOSE_NULL_ERROR_MSG);
                    break;
                }
                case EXPORT_TYPE.QUERY:
                    this.$message.success(EXPORT_SUCCESS_MSG);
                    exportParamExcelSysTask({...this.filterData.listQuery});
                    break;
                case EXPORT_TYPE.ALL:
                    this.$message.success(EXPORT_SUCCESS_MSG);
                    exportExcelSysTask();
                    break;
                default:
                    this.$message.error(EXPORT_ERROR_MSG);
                    break;
            }
        }
    }
}
</script>
