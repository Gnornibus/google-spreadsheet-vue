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
    deleteBatchSysMenu,
    deleteSysMenu,
    exportChoseExcelSysMenu,
    exportExcelSysMenu,
    exportParamExcelSysMenu,
    exportTemplateSysMenu,
    queryPageSysMenu,
    saveBatchSysMenu,
    saveSysMenu,
    selectSysMenu,
} from "@/api/sys-menu-api";
import i18n from '@/common/lang';
import UploadExcelComponent from '@/components/UploadExcel/index.vue';
import BackToTop from "@/components/BackToTop";
import {selectAllSysPlatDict} from "@/api/dict-api";

export default {
    name: 'SysMenu',
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
                        permission: '020401',
                        handleClick: this.queryPage,
                    },
                    addBtn: {
                        permission: '020402',
                        handleClick: () => {
                            // 初始化平台下拉框
                            this.initDropdownBox(this.addDialogData, "platId");
                            this.addDialogData.visible = true
                        },
                    },
                    batchAddBtn: {
                        permission: '020403',
                        handleClick: () => {
                            this.batchDialogData.visible = true;
                        },
                    },
                    batchDeleteBtn: {
                        permission: '020405',
                        handleClick: this.batchDelete,
                    },
                },

                // 数字输入框
                numbers: [
                    {
                        key: 'sortId',
                        length: 11,
                        name: i18n.t('view.sysMenu.sortId'),
                    },
                ],
                // 搜索输入框
                inputs: [
                    {
                        key: 'id',
                        length: 11,
                        name: i18n.t('view.sysMenu.id'),
                    },
                    {
                        key: 'platId',
                        length: 11,
                        name: i18n.t('view.sysMenu.platId'),
                    },
                    {
                        key: 'title',
                        length: 10,
                        name: i18n.t('view.sysMenu.title'),
                    },
                    {
                        key: 'menuType',
                        length: 1,
                        name: i18n.t('view.sysMenu.menuType'),
                    },
                    {
                        key: 'parentId',
                        length: 11,
                        name: i18n.t('view.sysMenu.parentId'),
                    },
                    {
                        key: 'toUrl',
                        length: 20,
                        name: i18n.t('view.sysMenu.toUrl'),
                    },
                    {
                        key: 'icon',
                        length: 20,
                        name: i18n.t('view.sysMenu.icon'),
                    },
                ],
                // 搜索下拉框
                selects: [
                    {
                        key: 'state',
                        name: i18n.t('view.sysMenu.state'),
                        options: [
                            {
                                key: '0',
                                name: i18n.t('enum.state.0'),
                            },
                            {
                                key: '1',
                                name: i18n.t('enum.state.1'),
                            },
                        ]
                    },
                ],
                // 搜索日期框
                datePickers: [
                ],
                // 搜索日期及时间框
                dateTimePickers: [
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
                        label: i18n.t('view.sysMenu.id'),
                        sortable: true,
                    },
                    {
                        key: 'platId',
                        label: i18n.t('view.sysMenu.platId'),
                        sortable: true,
                    },
                    {
                        key: 'title',
                        label: i18n.t('view.sysMenu.title'),
                        sortable: true,
                    },
                    {
                        key: 'menuType',
                        label: i18n.t('view.sysMenu.menuType'),
                        sortable: true,
                    },
                    {
                        key: 'parentId',
                        label: i18n.t('view.sysMenu.parentId'),
                        sortable: true,
                    },
                    {
                        key: 'sortId',
                        label: i18n.t('view.sysMenu.sortId'),
                        sortable: true,
                    },
                    {
                        key: 'toUrl',
                        label: i18n.t('view.sysMenu.toUrl'),
                        sortable: true,
                    },
                    {
                        key: 'icon',
                        label: i18n.t('view.sysMenu.icon'),
                        sortable: true,
                    },
                    {
                        key: 'state',
                        label: i18n.t('view.sysMenu.state'),
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
                            permission: '020406',
                            handleRowClick: (index, row) => {
                                // 初始化平台下拉框
                                this.initDropdownBox(this.infoDialogData, "platId");
                                selectSysMenu({id: row.id}).then((res) => {
                                    this.infoDialogData.model = res.data
                                    this.infoDialogData.visible = true;
                                })
                            }
                        },
                        {
                            name: i18n.t('common.btn.modifyBtnName'),
                            type: 'primary',
                            permission: '020402,020406',
                            handleRowClick: (index, row) => {
                                // 初始化平台下拉框
                                this.initDropdownBox(this.modifyDialogData, "platId");
                                selectSysMenu({id: row.id}).then((res) => {
                                    this.modifyDialogData.model = res.data
                                    this.modifyDialogData.visible = true;
                                })
                            }
                        },
                        {
                            name: i18n.t('common.btn.deleteBtnName'),
                            type: 'danger',
                            permission: '020404',
                            handleRowClick: (index, row) => {
                                this.$confirm(i18n.t('common.messageBox.delete.title') + row.name, i18n.t('common.messageBox.tips'), {
                                    confirmButtonText: i18n.t('common.btn.confirmBtnName'),
                                    cancelButtonText: i18n.t('common.btn.cancelBtnName'),
                                    type: 'warning'
                                }).then(() => {
                                    // 确定
                                    deleteSysMenu({id: row.id}).then((res) => {
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
                        permission: '020407',
                        handleClick: this.exportTemplate,
                    },
                ],
                toolDropDown: [
                    {
                        name: i18n.t('common.tool.batchExport.choose'),
                        key: 'export',
                        permission: '020408',
                        handleClick: this.batchExport,
                        options: [
                            {
                                permission: '020408',
                                key: 'choose',
                                name: i18n.t('common.tool.batchExport.choose'),
                            },
                            {
                                permission: '020409',
                                key: 'query',
                                name: i18n.t('common.tool.batchExport.query'),
                            },
                            {
                                permission: '020410',
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
                        type: 'select',
                        key: 'platId',
                        name: i18n.t('view.sysMenu.platId'),
                        options: [],
                    },
                    {
                        type: 'input',
                        length: 10,
                        key: 'title',
                        name: i18n.t('view.sysMenu.title'),
                    },
                    {
                        type: 'input',
                        length: 1,
                        key: 'menuType',
                        name: i18n.t('view.sysMenu.menuType'),
                    },
                    {
                        type: 'input',
                        length: 11,
                        key: 'parentId',
                        name: i18n.t('view.sysMenu.parentId'),
                    },
                    {
                        type: 'number',
                        length: 11,
                        key: 'sortId',
                        name: i18n.t('view.sysMenu.sortId'),
                    },
                    {
                        type: 'input',
                        length: 20,
                        key: 'toUrl',
                        name: i18n.t('view.sysMenu.toUrl'),
                    },
                    {
                        type: 'input',
                        length: 20,
                        key: 'icon',
                        name: i18n.t('view.sysMenu.icon'),
                    },
                    {
                        type: 'select',
                        key: 'state',
                        name: i18n.t('view.sysMenu.state'),
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
                ],
                model: {},
            },
            // 修改
            modifyDialogData: {
                visible: false,
                modelItem: [
                    {
                        disabled: true,
                        type: 'input',
                        length: 11,
                        key: 'id',
                        name: i18n.t('view.sysMenu.id'),
                    },
                    {
                        type: 'select',
                        key: 'platId',
                        name: i18n.t('view.sysMenu.platId'),
                        options: [],
                    },
                    {
                        type: 'input',
                        length: 10,
                        key: 'title',
                        name: i18n.t('view.sysMenu.title'),
                    },
                    {
                        type: 'input',
                        length: 1,
                        key: 'menuType',
                        name: i18n.t('view.sysMenu.menuType'),
                    },
                    {
                        type: 'input',
                        length: 11,
                        key: 'parentId',
                        name: i18n.t('view.sysMenu.parentId'),
                    },
                    {
                        type: 'number',
                        length: 11,
                        key: 'sortId',
                        name: i18n.t('view.sysMenu.sortId'),
                    },
                    {
                        type: 'input',
                        length: 20,
                        key: 'toUrl',
                        name: i18n.t('view.sysMenu.toUrl'),
                    },
                    {
                        type: 'input',
                        length: 20,
                        key: 'icon',
                        name: i18n.t('view.sysMenu.icon'),
                    },
                    {
                        type: 'select',
                        key: 'state',
                        name: i18n.t('view.sysMenu.state'),
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
                ],
                model: {},
            },
            // 详情
            infoDialogData: {
                visible: false,
                modelItem: [
                    {
                        type: 'input',
                        length: 11,
                        key: 'id',
                        name: i18n.t('view.sysMenu.id'),
                    },
                    {
                        type: 'select',
                        key: 'platId',
                        name: i18n.t('view.sysMenu.platId'),
                        options: [],
                    },
                    {
                        type: 'input',
                        length: 10,
                        key: 'title',
                        name: i18n.t('view.sysMenu.title'),
                    },
                    {
                        type: 'input',
                        length: 1,
                        key: 'menuType',
                        name: i18n.t('view.sysMenu.menuType'),
                    },
                    {
                        type: 'input',
                        length: 11,
                        key: 'parentId',
                        name: i18n.t('view.sysMenu.parentId'),
                    },
                    {
                        type: 'number',
                        length: 11,
                        key: 'sortId',
                        name: i18n.t('view.sysMenu.sortId'),
                    },
                    {
                        type: 'input',
                        length: 20,
                        key: 'toUrl',
                        name: i18n.t('view.sysMenu.toUrl'),
                    },
                    {
                        type: 'input',
                        length: 20,
                        key: 'icon',
                        name: i18n.t('view.sysMenu.icon'),
                    },
                    {
                        type: 'select',
                        key: 'state',
                        name: i18n.t('view.sysMenu.state'),
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
        // 初始化下拉框列表
        async initDropdownBox(dialogData, key, value) {
            let DropdownBox = [];
            switch (key) {
                case "platId":
                    const allSysPlat = await selectAllSysPlatDict();
                    DropdownBox = await allSysPlat.data.map(
                        item => {
                            return {
                                value: item.id,
                                name: item.name,
                            }
                        }
                    );
                    break;
                default:
                    break;
            }
            dialogData.modelItem.forEach(item => {
                if (item.key === key) {
                    item.options = DropdownBox;
                }
            })
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
                saveSysMenu(data).then((res) => {
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
                const res = await queryPageSysMenu({ ...pagination, ...sort, ...this.filterData.listQuery });
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
                saveSysMenu(data).then((res) => {
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
                saveBatchSysMenu(this.batchDialogData.excelData.file).then((res) => {
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
                deleteBatchSysMenu(this.selected).then((res) => {
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
            exportTemplateSysMenu();
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
                    hasSelected ? exportChoseExcelSysMenu(this.selected) : this.$message.error(EXPORT_CHOOSE_NULL_ERROR_MSG);
                    break;
                }
                case EXPORT_TYPE.QUERY:
                    this.$message.success(EXPORT_SUCCESS_MSG);
                    exportParamExcelSysMenu({...this.filterData.listQuery});
                    break;
                case EXPORT_TYPE.ALL:
                    this.$message.success(EXPORT_SUCCESS_MSG);
                    exportExcelSysMenu();
                    break;
                default:
                    this.$message.error(EXPORT_ERROR_MSG);
                    break;
            }
        }
    }
}
</script>
