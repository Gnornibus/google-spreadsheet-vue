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
    deleteBatchSportOrder,
    deleteSportOrder,
    exportChoseExcelSportOrder,
    exportExcelSportOrder,
    exportParamExcelSportOrder,
    exportTemplateSportOrder,
    queryPageSportOrder,
    saveBatchSportOrder,
    saveSportOrder,
    selectSportOrder,
} from "@/api/sport-order-api";
import i18n from '@/common/lang';
import UploadExcelComponent from '@/components/UploadExcel/index.vue';
import BackToTop from "@/components/BackToTop";

export default {
    name: 'SportOrder',
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
                        permission: '080301',
                        handleClick: this.queryPage,
                    },
                    addBtn: {
                        permission: '080302',
                        handleClick: () => {
                            this.addDialogData.visible = true
                        },
                    },
                    batchAddBtn: {
                        permission: '080303',
                        handleClick: () => {
                            this.batchDialogData.visible = true;
                        },
                    },
                    batchDeleteBtn: {
                        permission: '080305',
                        handleClick: this.batchDelete,
                    },
                },

                // 精准数据输入框
                decimal: [
                    {
                        key: 'price',
                        length: 8,
                        precision: 2,
                        name: i18n.t('view.sportOrder.price'),
                    },
                ],
                // 数字输入框
                numbers: [
                    {
                        key: 'id',
                        length: 11,
                        name: i18n.t('view.sportOrder.id'),
                    },
                    {
                        key: 'memberTypeId',
                        length: 11,
                        name: i18n.t('view.sportOrder.memberTypeId'),
                    },
                ],
                // 搜索输入框
                inputs: [
                    {
                        key: 'orderNo',
                        length: 128,
                        name: i18n.t('view.sportOrder.orderNo'),
                    },
                    {
                        key: 'state',
                        length: 32,
                        name: i18n.t('view.sportOrder.state'),
                    },
                    {
                        key: 'remark',
                        length: 255,
                        name: i18n.t('view.sportOrder.remark'),
                    },
                ],
                // 搜索下拉框
                selects: [
                    {
                        key: 'creUserId',
                        name: i18n.t('view.sportOrder.creUserName'),
                        dataSelect: {
                            url: 'sys-user',
                        },
                    },
                    {
                        key: 'updUserId',
                        name: i18n.t('view.sportOrder.updUserName'),
                        dataSelect: {
                            url: 'sys-user',
                        },
                    },
                ],
                // 搜索日期框
                datePickers: [
                ],
                // 搜索时间框
                timePickers: [
                ],
                // 搜索日期及时间框
                dateTimePickers: [
                    {
                        key: 'creTime',
                        name: i18n.t('view.sportOrder.creTime'),
                    },
                    {
                        key: 'updTime',
                        name: i18n.t('view.sportOrder.updTime'),
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
                        label: i18n.t('view.sportOrder.id'),
                        sortable: true,
                    },
                    {
                        key: 'orderNo',
                        label: i18n.t('view.sportOrder.orderNo'),
                        sortable: true,
                    },
                    {
                        key: 'memberTypeId',
                        label: i18n.t('view.sportOrder.memberTypeId'),
                        sortable: true,
                    },
                    {
                        key: 'price',
                        label: i18n.t('view.sportOrder.price'),
                        sortable: true,
                    },
                    {
                        key: 'stateName',
                        label: i18n.t('view.sportOrder.state'),
                        sortable: true,
                    },
                    {
                        key: 'remark',
                        label: i18n.t('view.sportOrder.remark'),
                        sortable: true,
                    },
                    {
                        key: 'creUserId',
                        label: i18n.t('view.sportOrder.creUserId'),
                        sortable: true,
                    },
                    {
                        key: 'creUserName',
                        label: i18n.t('view.sportOrder.creUserName'),
                        sortable: true,
                    },
                    {
                        width: 160,
                        key: 'creTime',
                        label: i18n.t('view.sportOrder.creTime'),
                        sortable: true,
                    },
                    {
                        key: 'updUserId',
                        label: i18n.t('view.sportOrder.updUserId'),
                        sortable: true,
                    },
                    {
                        key: 'updUserName',
                        label: i18n.t('view.sportOrder.updUserName'),
                        sortable: true,
                    },
                    {
                        width: 160,
                        key: 'updTime',
                        label: i18n.t('view.sportOrder.updTime'),
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
                            permission: '080306',
                            handleRowClick: (index, row) => {
                                selectSportOrder({id: row.id}).then((res) => {
                                    this.infoDialogData.model = res.data
                                    this.infoDialogData.visible = true;
                                })
                            }
                        },
                        {
                            name: i18n.t('common.btn.modifyBtnName'),
                            type: 'primary',
                            permission: '080302,080106',
                            handleRowClick: (index, row) => {
                                selectSportOrder({id: row.id}).then((res) => {
                                    this.modifyDialogData.model = res.data
                                    this.modifyDialogData.visible = true;
                                })
                            }
                        },
                        {
                            name: i18n.t('common.btn.deleteBtnName'),
                            type: 'danger',
                            permission: '080304',
                            handleRowClick: (index, row) => {
                                this.$confirm(i18n.t('common.messageBox.delete.title') + row.name, i18n.t('common.messageBox.tips'), {
                                    confirmButtonText: i18n.t('common.btn.confirmBtnName'),
                                    cancelButtonText: i18n.t('common.btn.cancelBtnName'),
                                    type: 'warning'
                                }).then(() => {
                                    // 确定
                                    deleteSportOrder({id: row.id}).then((res) => {
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
                        permission: '080307',
                        handleClick: this.exportTemplate,
                    },
                ],
                toolDropDown: [
                    {
                        name: i18n.t('common.tool.batchExport.choose'),
                        key: 'export',
                        permission: '080308',
                        handleClick: this.batchExport,
                        options: [
                            {
                                permission: '080308',
                                key: 'choose',
                                name: i18n.t('common.tool.batchExport.choose'),
                            },
                            {
                                permission: '080309',
                                key: 'query',
                                name: i18n.t('common.tool.batchExport.query'),
                            },
                            {
                                permission: '080310',
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
                        key: 'orderNo',
                        name: i18n.t('view.sportOrder.orderNo'),
                    },
                    {
                        type: 'number',
                        length: 11,
                        key: 'memberTypeId',
                        name: i18n.t('view.sportOrder.memberTypeId'),
                    },
                    {
                        type: 'decimal',
                        length: 8,
                        precision: 2,
                        key: 'price',
                        name: i18n.t('view.sportOrder.price'),
                    },
                    {
                        type: 'input',
                        length: 32,
                        key: 'state',
                        name: i18n.t('view.sportOrder.state'),
                    },
                    {
                        type: 'input',
                        length: 255,
                        key: 'remark',
                        name: i18n.t('view.sportOrder.remark'),
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
                        name: i18n.t('view.sportOrder.id'),
                    },
                    {
                        type: 'input',
                        length: 128,
                        key: 'orderNo',
                        name: i18n.t('view.sportOrder.orderNo'),
                    },
                    {
                        type: 'number',
                        length: 11,
                        key: 'memberTypeId',
                        name: i18n.t('view.sportOrder.memberTypeId'),
                    },
                    {
                        type: 'decimal',
                        length: 8,
                        precision: 2,
                        key: 'price',
                        name: i18n.t('view.sportOrder.price'),
                    },
                    {
                        type: 'input',
                        length: 32,
                        key: 'state',
                        name: i18n.t('view.sportOrder.state'),
                    },
                    {
                        type: 'input',
                        length: 255,
                        key: 'remark',
                        name: i18n.t('view.sportOrder.remark'),
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
                        name: i18n.t('view.sportOrder.id'),
                    },
                    {
                        type: 'input',
                        length: 128,
                        key: 'orderNo',
                        name: i18n.t('view.sportOrder.orderNo'),
                    },
                    {
                        type: 'number',
                        length: 11,
                        key: 'memberTypeId',
                        name: i18n.t('view.sportOrder.memberTypeId'),
                    },
                    {
                        type: 'decimal',
                        length: 8,
                        precision: 2,
                        key: 'price',
                        name: i18n.t('view.sportOrder.price'),
                    },
                    {
                        type: 'input',
                        length: 32,
                        key: 'state',
                        name: i18n.t('view.sportOrder.state'),
                    },
                    {
                        type: 'input',
                        length: 255,
                        key: 'remark',
                        name: i18n.t('view.sportOrder.remark'),
                    },
                    {
                        type: 'number',
                        length: 11,
                        key: 'creUserId',
                        name: i18n.t('view.sportOrder.creUserId'),
                    },
                    {
                        type: 'input',
                        length: 10,
                        key: 'creUserName',
                        name: i18n.t('view.sportOrder.creUserName'),
                    },
                    {
                        type: 'datetime',
                        key: 'creTime',
                        name: i18n.t('view.sportOrder.creTime'),
                    },
                    {
                        type: 'number',
                        length: 11,
                        key: 'updUserId',
                        name: i18n.t('view.sportOrder.updUserId'),
                    },
                    {
                        type: 'input',
                        length: 10,
                        key: 'updUserName',
                        name: i18n.t('view.sportOrder.updUserName'),
                    },
                    {
                        type: 'datetime',
                        key: 'updTime',
                        name: i18n.t('view.sportOrder.updTime'),
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
                saveSportOrder(data).then((res) => {
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
                const res = await queryPageSportOrder({...pagination, ...sort, ...this.filterData.listQuery});
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
                saveSportOrder(data).then((res) => {
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
                saveBatchSportOrder(this.batchDialogData.excelData.file).then((res) => {
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
                deleteBatchSportOrder(this.selected).then((res) => {
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
            exportTemplateSportOrder();
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
                    hasSelected ? exportChoseExcelSportOrder(this.selected) : this.$message.error(EXPORT_CHOOSE_NULL_ERROR_MSG);
                    break;
                }
                case EXPORT_TYPE.QUERY:
                    this.$message.success(EXPORT_SUCCESS_MSG);
                    exportParamExcelSportOrder({...this.filterData.listQuery});
                    break;
                case EXPORT_TYPE.ALL:
                    this.$message.success(EXPORT_SUCCESS_MSG);
                    exportExcelSportOrder();
                    break;
                default:
                    this.$message.error(EXPORT_ERROR_MSG);
                    break;
            }
        }
    }
}
</script>
