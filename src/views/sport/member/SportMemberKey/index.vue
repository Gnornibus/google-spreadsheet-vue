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
    deleteBatchSportMemberKey,
    deleteSportMemberKey,
    exportChoseExcelSportMemberKey,
    exportExcelSportMemberKey,
    exportParamExcelSportMemberKey,
    exportTemplateSportMemberKey,
    queryPageSportMemberKey,
    saveBatchSportMemberKey,
    saveSportMemberKey,
    selectSportMemberKey,
} from "@/api/sport-member-key-api";
import i18n from '@/common/lang';
import UploadExcelComponent from '@/components/UploadExcel/index.vue';
import BackToTop from "@/components/BackToTop";

export default {
    name: 'SportMemberKey',
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
                        permission: '080201',
                        handleClick: this.queryPage,
                    },
                    addBtn: {
                        permission: '080202',
                        handleClick: () => {
                            this.addDialogData.visible = true
                        },
                    },
                    batchAddBtn: {
                        permission: '080203',
                        handleClick: () => {
                            this.batchDialogData.visible = true;
                        },
                    },
                    batchDeleteBtn: {
                        permission: '080205',
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
                        name: i18n.t('view.sportMemberKey.id'),
                    },
                ],
                // 搜索输入框
                inputs: [
                    {
                        key: 'name',
                        length: 32,
                        name: i18n.t('view.sportMemberKey.name'),
                    },
                    {
                        key: 'code',
                        length: 128,
                        name: i18n.t('view.sportMemberKey.code'),
                    },
                ],
                // 搜索下拉框
                selects: [
                    {
                        key: 'userId',
                        name: i18n.t('view.sportMemberKey.userName'),
                        dataSelect: {
                            url: 'sys-user',
                        },
                    },
                    {
                        key: 'state',
                        name: i18n.t('view.sportMemberKey.state'),
                        dictSelect: {
                            dictCode: 'sport.member.key.state'
                        }
                    },
                    {
                        key: 'memberTypeId',
                        name: i18n.t('view.sportMemberKey.memberTypeName'),
                        dataSelect: {
                            url: 'sport-member-type',
                        },
                    },
                    {
                        key: 'creUserId',
                        name: i18n.t('view.sportMemberKey.creUserName'),
                        dataSelect: {
                            url: 'sys-user',
                        },
                    },
                    {
                        key: 'updUserId',
                        name: i18n.t('view.sportMemberKey.updUserName'),
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
                        key: 'exchangeDate',
                        name: i18n.t('view.sportMemberKey.exchangeDate'),
                    },
                    {
                        key: 'expiryDate',
                        name: i18n.t('view.sportMemberKey.expiryDate'),
                    },
                    {
                        key: 'creTime',
                        name: i18n.t('view.sportMemberKey.creTime'),
                    },
                    {
                        key: 'updTime',
                        name: i18n.t('view.sportMemberKey.updTime'),
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
                        label: i18n.t('view.sportMemberKey.id'),
                        sortable: true,
                    },
                    {
                        key: 'memberTypeName',
                        label: i18n.t('view.sportMemberKey.memberTypeName'),
                    },
                    {
                        key: 'name',
                        label: i18n.t('view.sportMemberKey.name'),
                        sortable: true,
                    },
                    {
                        key: 'code',
                        width: 250,
                        label: i18n.t('view.sportMemberKey.code'),
                        sortable: true,
                    },
                    {
                        key: 'userName',
                        label: i18n.t('view.sportMemberKey.userName'),
                        sortable: true,
                    },
                    {
                        width: 160,
                        key: 'exchangeDate',
                        label: i18n.t('view.sportMemberKey.exchangeDate'),
                        sortable: true,
                    },
                    {
                        width: 160,
                        key: 'expiryDate',
                        label: i18n.t('view.sportMemberKey.expiryDate'),
                        sortable: true,
                    },
                    {
                        key: 'state',
                        label: i18n.t('view.sportMemberKey.state'),
                        sortable: true,
                        isSpecial: function (value) {
                            switch (value) {
                                case "0":
                                    return i18n.t('enum.memberKey.0');
                                case "1":
                                    return i18n.t('enum.memberKey.1');
                                default:
                                    return i18n.t('enum.unknown');
                            }
                        },
                    },
                    {
                        key: 'creUserId',
                        label: i18n.t('view.sportMemberKey.creUserId'),
                        sortable: true,
                    },
                    {
                        key: 'creUserName',
                        label: i18n.t('view.sportMemberKey.creUserName'),
                        sortable: true,
                    },
                    {
                        width: 160,
                        key: 'creTime',
                        label: i18n.t('view.sportMemberKey.creTime'),
                        sortable: true,
                    },
                    {
                        key: 'updUserId',
                        label: i18n.t('view.sportMemberKey.updUserId'),
                        sortable: true,
                    },
                    {
                        key: 'updUserName',
                        label: i18n.t('view.sportMemberKey.updUserName'),
                        sortable: true,
                    },
                    {
                        width: 160,
                        key: 'updTime',
                        label: i18n.t('view.sportMemberKey.updTime'),
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
                            permission: '080206',
                            handleRowClick: (index, row) => {
                                selectSportMemberKey({id: row.id}).then((res) => {
                                    this.infoDialogData.model = res.data
                                    this.infoDialogData.visible = true;
                                })
                            }
                        },
                        {
                            name: i18n.t('common.btn.modifyBtnName'),
                            type: 'primary',
                            permission: '080202,080106',
                            handleRowClick: (index, row) => {
                                selectSportMemberKey({id: row.id}).then((res) => {
                                    this.modifyDialogData.model = res.data
                                    this.modifyDialogData.visible = true;
                                })
                            }
                        },
                        {
                            name: i18n.t('common.btn.deleteBtnName'),
                            type: 'danger',
                            permission: '080204',
                            handleRowClick: (index, row) => {
                                this.$confirm(i18n.t('common.messageBox.delete.title') + row.name, i18n.t('common.messageBox.tips'), {
                                    confirmButtonText: i18n.t('common.btn.confirmBtnName'),
                                    cancelButtonText: i18n.t('common.btn.cancelBtnName'),
                                    type: 'warning'
                                }).then(() => {
                                    // 确定
                                    deleteSportMemberKey({id: row.id}).then((res) => {
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
                        permission: '080207',
                        handleClick: this.exportTemplate,
                    },
                ],
                toolDropDown: [
                    {
                        name: i18n.t('common.tool.batchExport.choose'),
                        key: 'export',
                        permission: '080208',
                        handleClick: this.batchExport,
                        options: [
                            {
                                permission: '080208',
                                key: 'choose',
                                name: i18n.t('common.tool.batchExport.choose'),
                            },
                            {
                                permission: '080209',
                                key: 'query',
                                name: i18n.t('common.tool.batchExport.query'),
                            },
                            {
                                permission: '080210',
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
                        type: 'dataSelect',
                        key: 'memberTypeId',
                        name: i18n.t('view.sportMemberKey.memberTypeName'),
                        dataSelect: {
                            url: 'sport-member-type'
                        }
                    },
                    {
                        type: 'input',
                        length: 32,
                        key: 'name',
                        name: i18n.t('view.sportMemberKey.name'),
                    },
                    {
                        type: 'datetime',
                        key: 'expiryDate',
                        name: i18n.t('view.sportMemberKey.expiryDate'),
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
                        name: i18n.t('view.sportMemberKey.id'),
                    },
                    {
                        type: 'dataSelect',
                        key: 'memberTypeId',
                        name: i18n.t('view.sportMemberKey.memberTypeName'),
                        dataSelect: {
                            url: 'sport-member-type'
                        }
                    },
                    {
                        type: 'input',
                        length: 32,
                        key: 'name',
                        name: i18n.t('view.sportMemberKey.name'),
                    },
                    {
                        disabled: true,
                        type: 'input',
                        length: 128,
                        key: 'code',
                        name: i18n.t('view.sportMemberKey.code'),
                    },
                    {
                        disabled: true,
                        required: false,
                        type: 'input',
                        length: 11,
                        key: 'userId',
                        name: i18n.t('view.sportMemberKey.userId'),
                    },
                    {
                        disabled: true,
                        required: false,
                        type: 'datetime',
                        key: 'exchangeDate',
                        name: i18n.t('view.sportMemberKey.exchangeDate'),
                    },
                    {
                        type: 'datetime',
                        key: 'expiryDate',
                        name: i18n.t('view.sportMemberKey.expiryDate'),
                    },
                    {
                        disabled: true,
                        type: 'select',
                        key: 'state',
                        name: i18n.t('view.sportMemberKey.state'),
                        options: [
                            {
                                value: "0",
                                name: i18n.t('enum.memberKey.0'),
                            },
                            {
                                value: "1",
                                name: i18n.t('enum.memberKey.1'),
                            },
                        ],
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
                        name: i18n.t('view.sportMemberKey.id'),
                    },
                    {
                        type: 'dataSelect',
                        key: 'memberTypeId',
                        name: i18n.t('view.sportMemberKey.memberTypeName'),
                        dataSelect: {
                            url: 'sport-member-type'
                        }
                    },
                    {
                        type: 'input',
                        length: 32,
                        key: 'name',
                        name: i18n.t('view.sportMemberKey.name'),
                    },
                    {
                        type: 'input',
                        length: 128,
                        key: 'code',
                        name: i18n.t('view.sportMemberKey.code'),
                    },
                    {
                        type: 'input',
                        length: 11,
                        key: 'userId',
                        name: i18n.t('view.sportMemberKey.userId'),
                    },
                    {
                        type: 'datetime',
                        key: 'exchangeDate',
                        name: i18n.t('view.sportMemberKey.exchangeDate'),
                    },
                    {
                        type: 'datetime',
                        key: 'expiryDate',
                        name: i18n.t('view.sportMemberKey.expiryDate'),
                    },
                    {
                        type: 'select',
                        key: 'state',
                        name: i18n.t('view.sportMemberKey.state'),
                        options: [
                            {
                                value: "0",
                                name: i18n.t('enum.memberKey.0'),
                            },
                            {
                                value: "1",
                                name: i18n.t('enum.memberKey.1'),
                            },
                        ],
                    },
                    {
                        type: 'number',
                        length: 11,
                        key: 'creUserId',
                        name: i18n.t('view.sportMemberKey.creUserId'),
                    },
                    {
                        type: 'input',
                        length: 10,
                        key: 'creUserName',
                        name: i18n.t('view.sportMemberKey.creUserName'),
                    },
                    {
                        type: 'datetime',
                        key: 'creTime',
                        name: i18n.t('view.sportMemberKey.creTime'),
                    },
                    {
                        type: 'number',
                        length: 11,
                        key: 'updUserId',
                        name: i18n.t('view.sportMemberKey.updUserId'),
                    },
                    {
                        type: 'input',
                        length: 10,
                        key: 'updUserName',
                        name: i18n.t('view.sportMemberKey.updUserName'),
                    },
                    {
                        type: 'datetime',
                        key: 'updTime',
                        name: i18n.t('view.sportMemberKey.updTime'),
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
                saveSportMemberKey(data).then((res) => {
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
                const res = await queryPageSportMemberKey({...pagination, ...sort, ...this.filterData.listQuery});
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
                saveSportMemberKey(data).then((res) => {
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
                saveBatchSportMemberKey(this.batchDialogData.excelData.file).then((res) => {
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
                deleteBatchSportMemberKey(this.selected).then((res) => {
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
            exportTemplateSportMemberKey();
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
                    hasSelected ? exportChoseExcelSportMemberKey(this.selected) : this.$message.error(EXPORT_CHOOSE_NULL_ERROR_MSG);
                    break;
                }
                case EXPORT_TYPE.QUERY:
                    this.$message.success(EXPORT_SUCCESS_MSG);
                    exportParamExcelSportMemberKey({...this.filterData.listQuery});
                    break;
                case EXPORT_TYPE.ALL:
                    this.$message.success(EXPORT_SUCCESS_MSG);
                    exportExcelSportMemberKey();
                    break;
                default:
                    this.$message.error(EXPORT_ERROR_MSG);
                    break;
            }
        }
    }
}
</script>
