<template>
    <div>
        <search-pane :filter-data="dictFilterData" :sort="this.dictDataSource.sort"/>
        <el-collapse v-model="collapseModel">
            <el-collapse-item title="字典列表" name="dict">
                <table-pane
                    ref="dictTable"
                    :data-source="dictDataSource"
                    @changeCurrent="dictChangeCurrent"
                    @changeSize="dictChangeSize"
                    @selectionChange="dictSelectionChange"
                    @sortChange="dictSortChange"/>
            </el-collapse-item>
            <el-collapse-item :title="`${dict.name !== undefined ? '【' + dict.name + '】' : ''}字典项列表`"
                              name="dictItem">
                <table-pane
                    ref="dictItemTable"
                    :data-source="dictItemDataSource"
                    @changeCurrent="changeCurrent"
                    @changeSize="changeSize"
                    @selectionChange="selectionChange"
                    @sortChange="sortChange"/>
            </el-collapse-item>
        </el-collapse>
        <!-- 字典 -->
        <my-dialog
            :model="dictAddDialogData.model"
            :modelItem="dictAddDialogData.modelItem"
            :title="$t('common.dialog.dialogAddTitle')"
            :visible.sync="dictAddDialogData.visible"
            :width="dialogWidth"
            @close="dictQueryPage()"
            @submit="dictAdd"/>
        <my-dialog
            :model="dictModifyDialogData.model"
            :modelItem="dictModifyDialogData.modelItem"
            :title="$t('common.dialog.dialogModifyTitle')"
            :visible.sync="dictModifyDialogData.visible"
            :width="dialogWidth"
            @close="dictQueryPage()"
            @submit="dictModify"/>
        <!-- 字典项 -->
        <my-dialog
            :model="dictItemAddDialogData.model"
            :modelItem="dictItemAddDialogData.modelItem"
            :title="$t('common.dialog.dialogAddTitle')"
            :visible.sync="dictItemAddDialogData.visible"
            :width="dialogWidth"
            @close="dictItemQueryPage()"
            @submit="dictItemAdd"/>
        <my-dialog
            :model="dictItemModifyDialogData.model"
            :modelItem="dictItemModifyDialogData.modelItem"
            :title="$t('common.dialog.dialogModifyTitle')"
            :visible.sync="dictItemModifyDialogData.visible"
            :width="dialogWidth"
            @close="dictItemQueryPage()"
            @submit="dictItemModify"/>
    </div>
</template>

<script>
import searchPane from '@/components/SearchPane'
import tablePane from '@/components/TablePane'
import MyDialog from '@/components/Dialog'
import {deleteBatchSysDict, deleteSysDict, queryPageSysDict, saveSysDict, selectSysDict} from '@/api/sys-dict-api'
import i18n from '@/common/lang'
import UploadExcelComponent from '@/components/UploadExcel/index.vue'
import BackToTop from '@/components/BackToTop'
import {deleteSysDictItem, queryPageSysDictItem, saveSysDictItem, selectSysDictItem} from '@/api/sys-dict-item-api'
import {CommonEnum} from '@/common/enum/CommonEnum'

export default {
    name: 'SysDict',
    components: {searchPane, tablePane, MyDialog, UploadExcelComponent, BackToTop},
    // 生命周期-页面创建
    created() {
        // 初始化方法
        this.init()
    },
    data() {
        return {
            /**
             * 搜索栏配置
             */
            dictFilterData: {
                // 重置
                reset: true,
                // 查询参数
                listQuery: {},
                // 查询按钮
                filterBtn: {
                    searchBtn: {
                        permission: '020101',
                        handleClick: this.dictQueryPage
                    },
                    addBtn: {
                        permission: '020102',
                        handleClick: () => {
                            this.$set(this.dictAddDialogData.model, 'state', CommonEnum.enableDisable.enable)
                            this.$set(this.dictAddDialogData.model, 'type', CommonEnum.dictType.sys)
                            this.dictAddDialogData.visible = true
                        }
                    },
                    batchDeleteBtn: {
                        permission: '020105',
                        handleClick: this.dictBatchDelete
                    }
                },

                // 精准数据输入框
                decimal: [],
                // 数字输入框
                numbers: [
                    {
                        key: 'id',
                        length: 11,
                        name: i18n.t('view.sysDict.id')
                    }
                ],
                // 搜索输入框
                inputs: [
                    {
                        key: 'code',
                        length: 32,
                        name: i18n.t('view.sysDict.code')
                    },
                    {
                        key: 'name',
                        length: 32,
                        name: i18n.t('view.sysDict.name')
                    },
                    {
                        key: 'remark',
                        length: 255,
                        name: i18n.t('view.sysDict.remark')
                    }
                ],
                // 搜索下拉框
                selects: [
                    {
                        key: 'type',
                        name: i18n.t('view.sysDict.type'),
                        dictSelect: {
                            dictCode: 'sys.dict.type'
                        }
                    },
                    {
                        key: 'state',
                        name: i18n.t('view.sysDict.state'),
                        dictSelect: {
                            dictCode: 'sys.enable.disable'
                        }
                    },
                    {
                        key: 'creUserId',
                        name: i18n.t('view.sysDict.creUserName'),
                        dataSelect: {
                            url: 'sys-user'
                        }
                    },
                    {
                        key: 'updUserId',
                        name: i18n.t('view.sysDict.updUserName'),
                        dataSelect: {
                            url: 'sys-user'
                        }
                    }
                ],
                // 搜索日期框
                datePickers: [],
                // 搜索时间框
                timePickers: [],
                // 搜索日期及时间框
                dateTimePickers: [
                    {
                        key: 'creTime',
                        name: i18n.t('view.sysDict.creTime')
                    },
                    {
                        key: 'updTime',
                        name: i18n.t('view.sysDict.updTime')
                    }
                ]
            },

            /**
             * 折叠面板
             */
            collapseModel: ['dict', 'dictItem'],

            // 弹出框的宽度
            dialogWidth: '50%',

            /**
             * 字典
             */
            // 选中字典
            dict: {},

            /**
             * 表格配置
             */
            dictDataSource: {
                // 序号
                indexAble: false,
                // 序号
                isSelect: false,
                // 表格加载
                loading: true,
                // 列表项
                columns: [
                    {
                        key: 'id',
                        width: 100,
                        label: i18n.t('view.sysDict.id'),
                        sortable: true
                    },
                    {
                        key: 'code',
                        label: i18n.t('view.sysDict.code'),
                        sortable: true
                    },
                    {
                        key: 'name',
                        label: i18n.t('view.sysDict.name'),
                        sortable: true
                    },
                    {
                        key: 'type',
                        label: i18n.t('view.sysDict.type'),
                        sortable: true,
                        isSpecial: function (value) {
                            switch (value) {
                                case '0':
                                    return i18n.t('enum.dict.type.0')
                                case '1':
                                    return i18n.t('enum.dict.type.1')
                                default:
                                    return i18n.t('enum.unknown')
                            }
                        }
                    },
                    {
                        key: 'state',
                        label: i18n.t('view.sysDict.state'),
                        sortable: true,
                        isSpecial: function (value) {
                            switch (value) {
                                case '0':
                                    return i18n.t('enum.state.0')
                                case '1':
                                    return i18n.t('enum.state.1')
                                default:
                                    return i18n.t('enum.unknown')
                            }
                        }
                    },
                    {
                        key: 'remark',
                        label: i18n.t('view.sysDict.remark'),
                        sortable: true
                    }
                ],
                // 表格数据
                data: [],
                // 表格排序
                sort: {
                    sortProp: '',
                    sortOrder: ''
                },
                // 分页插件
                pagination: {
                    size: 5, // 页数
                    current: 1, // 页码
                    total: 10 // 总计
                },
                // 操作按钮项
                operation: {
                    label: i18n.t('table.operation'),
                    width: 90 * 4,
                    data: [
                        {
                            name: i18n.t('common.btn.dictItemBtnName'),
                            type: 'primary',
                            permission: '020106',
                            handleRowClick: (index, row) => {
                                this.dict = row
                                this.dictItemQueryPage()
                            }
                        },
                        {
                            name: i18n.t('common.btn.dictItemAddBtnName'),
                            type: 'primary',
                            permission: '020106',
                            handleRowClick: (index, row) => {
                                this.dict = row
                                this.$set(this.dictItemAddDialogData.model, 'dictId', this.dict.id)
                                this.$set(this.dictItemAddDialogData.model, 'state', CommonEnum.enableDisable.enable)
                                this.dictItemAddDialogData.visible = true
                            }
                        },
                        {
                            name: i18n.t('common.btn.modifyBtnName'),
                            type: 'primary',
                            permission: '020102,020106',
                            handleRowClick: (index, row) => {
                                selectSysDict({id: row.id}).then(res => {
                                    this.dictModifyDialogData.model = res.data
                                    this.dictModifyDialogData.visible = true
                                })
                            }
                        },
                        {
                            name: i18n.t('common.btn.deleteBtnName'),
                            type: 'danger',
                            permission: '020104',
                            handleRowClick: (index, row) => {
                                this.$confirm(i18n.t('common.messageBox.delete.title') + row.name, i18n.t('common.messageBox.tips'), {
                                    confirmButtonText: i18n.t('common.btn.confirmBtnName'),
                                    cancelButtonText: i18n.t('common.btn.cancelBtnName'),
                                    type: 'warning'
                                }).then(() => {
                                    // 确定
                                    deleteSysDict({id: row.id}).then(res => {
                                        if (res.data) {
                                            this.dictQueryPage()
                                            this.$message.success(i18n.t('common.success'))
                                            this.dictAddDialogData.visible = false
                                        } else {
                                            this.$message.error(i18n.t('common.error') + ':' + res.data)
                                        }
                                    })
                                })
                            }
                        }
                    ]
                }
            },

            // 多选框
            dictSelected: [],

            /**
             * 弹出框
             */
            // 新增
            dictAddDialogData: {
                visible: false,
                modelItem: [
                    {
                        type: 'input',
                        length: 32,
                        key: 'code',
                        name: i18n.t('view.sysDict.code')
                    },
                    {
                        type: 'input',
                        length: 32,
                        key: 'name',
                        name: i18n.t('view.sysDict.name')
                    },
                    {
                        type: 'select',
                        key: 'type',
                        name: i18n.t('view.sysDict.type'),
                        options: [
                            {
                                value: '0',
                                name: i18n.t('enum.dict.type.0')
                            },
                            {
                                value: '1',
                                name: i18n.t('enum.dict.type.1')
                            }
                        ]
                    },
                    {
                        type: 'select',
                        key: 'state',
                        name: i18n.t('view.sysDict.state'),
                        options: [
                            {
                                value: '0',
                                name: i18n.t('enum.state.0')
                            },
                            {
                                value: '1',
                                name: i18n.t('enum.state.1')
                            }
                        ]
                    },
                    {
                        required: false,
                        type: 'input',
                        length: 255,
                        key: 'remark',
                        name: i18n.t('view.sysDict.remark')
                    }
                ],
                model: {}
            },
            // 修改
            dictModifyDialogData: {
                visible: false,
                modelItem: [
                    {
                        disabled: true,
                        required: false,
                        type: 'number',
                        length: 11,
                        key: 'id',
                        name: i18n.t('view.sysDict.id')
                    },
                    {
                        type: 'input',
                        length: 32,
                        key: 'code',
                        name: i18n.t('view.sysDict.code')
                    },
                    {
                        type: 'input',
                        length: 32,
                        key: 'name',
                        name: i18n.t('view.sysDict.name')
                    },
                    {
                        type: 'select',
                        key: 'type',
                        name: i18n.t('view.sysDict.type'),
                        options: [
                            {
                                value: '0',
                                name: i18n.t('enum.dict.type.0')
                            },
                            {
                                value: '1',
                                name: i18n.t('enum.dict.type.1')
                            }
                        ]
                    },
                    {
                        type: 'select',
                        key: 'state',
                        name: i18n.t('view.sysDict.state'),
                        options: [
                            {
                                value: '0',
                                name: i18n.t('enum.state.0')
                            },
                            {
                                value: '1',
                                name: i18n.t('enum.state.1')
                            }
                        ]
                    },
                    {
                        required: false,
                        type: 'input',
                        length: 255,
                        key: 'remark',
                        name: i18n.t('view.sysDict.remark')
                    }
                ],
                model: {}
            },

            /**
             * 字典项
             */

            /**
             * 表格配置
             */
            dictItemDataSource: {
                // 序号
                selectAble: false,
                // 序号
                indexAble: false,
                // 表格加载
                loading: true,
                // 列表项
                columns: [
                    {
                        key: 'id',
                        width: 120,
                        label: i18n.t('view.sysDictItem.id'),
                        sortable: true
                    },
                    {
                        key: 'dictName',
                        label: i18n.t('view.sysDictItem.dictName'),
                        sortable: true
                    },
                    {
                        key: 'code',
                        label: i18n.t('view.sysDictItem.code'),
                        sortable: true
                    },
                    {
                        key: 'name',
                        label: i18n.t('view.sysDictItem.name'),
                        sortable: true
                    },
                    {
                        key: 'state',
                        label: i18n.t('view.sysDictItem.state'),
                        sortable: true,
                        isSpecial: function (value) {
                            switch (value) {
                                case '0':
                                    return i18n.t('enum.state.0')
                                case '1':
                                    return i18n.t('enum.state.1')
                                default:
                                    return i18n.t('enum.unknown')
                            }
                        }
                    },
                    {
                        key: 'remark',
                        label: i18n.t('view.sysDictItem.remark'),
                        sortable: true
                    }
                ],
                // 表格数据
                data: [],
                // 表格排序
                sort: {
                    sortProp: '',
                    sortOrder: ''
                },
                // 分页插件
                pagination: {
                    size: 10, // 页数
                    current: 1, // 页码
                    total: 10 // 总计
                },
                // 操作按钮项
                operation: {
                    label: i18n.t('table.operation'),
                    width: 80 * 2,
                    data: [
                        {
                            name: i18n.t('common.btn.modifyBtnName'),
                            type: 'primary',
                            permission: '020102,020106',
                            handleRowClick: (index, row) => {
                                selectSysDictItem({id: row.id}).then(res => {
                                    this.dictItemModifyDialogData.model = res.data
                                    this.dictItemModifyDialogData.visible = true
                                })
                            }
                        },
                        {
                            name: i18n.t('common.btn.deleteBtnName'),
                            type: 'danger',
                            permission: '020104',
                            handleRowClick: (index, row) => {
                                this.$confirm(i18n.t('common.messageBox.delete.title') + row.name, i18n.t('common.messageBox.tips'), {
                                    confirmButtonText: i18n.t('common.btn.confirmBtnName'),
                                    cancelButtonText: i18n.t('common.btn.cancelBtnName'),
                                    type: 'warning'
                                }).then(() => {
                                    // 确定
                                    deleteSysDictItem({id: row.id}).then(res => {
                                        if (res.data) {
                                            this.dictItemQueryPage()
                                            this.$message.success(i18n.t('common.success'))
                                            this.dictItemAddDialogData.visible = false
                                        } else {
                                            this.$message.error(i18n.t('common.error') + ':' + res.data)
                                        }
                                    })
                                })
                            }
                        }
                    ]
                }
            },

            // 多选框
            selected: [],

            /**
             * 弹出框
             */
            // 新增
            dictItemAddDialogData: {
                visible: false,
                modelItem: [
                    {
                        disabled: true,
                        required: true,
                        type: 'dataSelect',
                        key: 'dictId',
                        name: i18n.t('view.sysDictItem.dictId'),
                        dataSelect: {
                            url: 'sys-dict'
                        }
                    },
                    {
                        type: 'input',
                        length: 32,
                        key: 'code',
                        name: i18n.t('view.sysDictItem.code')
                    },
                    {
                        type: 'input',
                        length: 64,
                        key: 'name',
                        name: i18n.t('view.sysDictItem.name')
                    },
                    {
                        type: 'select',
                        key: 'state',
                        name: i18n.t('view.sysDictItem.state'),
                        options: [
                            {
                                value: '0',
                                name: i18n.t('enum.state.0')
                            },
                            {
                                value: '1',
                                name: i18n.t('enum.state.1')
                            }
                        ]
                    },
                    {
                        required: false,
                        type: 'input',
                        length: 255,
                        key: 'remark',
                        name: i18n.t('view.sysDictItem.remark')
                    }
                ],
                model: {}
            },
            // 修改
            dictItemModifyDialogData: {
                visible: false,
                modelItem: [
                    {
                        disabled: true,
                        required: false,
                        type: 'number',
                        length: 11,
                        key: 'id',
                        name: i18n.t('view.sysDictItem.id')
                    },
                    {
                        disabled: true,
                        required: false,
                        type: 'number',
                        length: 11,
                        key: 'dictId',
                        name: i18n.t('view.sysDictItem.dictId')
                    },
                    {
                        type: 'input',
                        length: 32,
                        key: 'code',
                        name: i18n.t('view.sysDictItem.code')
                    },
                    {
                        type: 'input',
                        length: 64,
                        key: 'name',
                        name: i18n.t('view.sysDictItem.name')
                    },
                    {
                        type: 'select',
                        key: 'state',
                        name: i18n.t('view.sysDictItem.state'),
                        options: [
                            {
                                value: '0',
                                name: i18n.t('enum.state.0')
                            },
                            {
                                value: '1',
                                name: i18n.t('enum.state.1')
                            }
                        ]
                    },
                    {
                        required: false,
                        type: 'input',
                        length: 255,
                        key: 'remark',
                        name: i18n.t('view.sysDictItem.remark')
                    }
                ],
                model: {}
            }
        }
    },
    watch: {
        collapseModel(value) {
            this.$refs.dictTable.$refs.table.$ready = false
            this.$refs.dictItemTable.$refs.table.$ready = false
        }
    },
    methods: {
        /**
         * 页面初始化方法
         */
        async init() {
            // 获取列表
            await this.dictQueryPage()
        },

        /**
         * 字典
         */

        /**
         * 表格内部
         */
        // 页数事件
        dictChangeSize(size) {
            this.dictDataSource.pagination.size = size
            this.dictQueryPage()
        },
        // 页码事件
        dictChangeCurrent(current) {
            this.dictDataSource.pagination.current = current
            this.dictQueryPage()
        },
        // 当表格的排序条件发生改变并且数据被重新排序时，触发该事件
        dictSortChange(sort) {
            if (sort.order !== null) {
                this.dictDataSource.sort.sortOrder = sort.order === 'ascending' ? 'ASC' : 'DESC'
                this.dictDataSource.sort.sortProp = sort.prop
            } else {
                this.dictDataSource.sort.sortOrder = null
                this.dictDataSource.sort.sortProp = null
            }
            this.dictQueryPage()
        },
        // 多选事件
        dictSelectionChange(selectRows) {
            this.dictSelected = selectRows.map(item => item.id)
        },
        // 编辑
        dictModify(data) {
            this.$confirm(i18n.t('common.messageBox.modify.title'), i18n.t('common.messageBox.tips'), {
                confirmButtonText: i18n.t('common.btn.confirmBtnName'),
                cancelButtonText: i18n.t('common.btn.cancelBtnName'),
                type: 'warning'
            }).then(() => {
                saveSysDict(data).then(res => {
                    if (res.data) {
                        this.$message.success(i18n.t('common.success'))
                        this.dictModifyDialogData.visible = false
                        this.dictQueryPage()
                    } else {
                        this.$message.error(i18n.t('common.error') + ':' + res.data)
                    }
                })
            })
        },

        /**
         * 搜索框
         */
        // 获取列表数据
        async dictQueryPage() {
            this.dictDataSource.loading = true
            try {
                const {pagination, sort} = this.dictDataSource
                const res = await queryPageSysDict({...pagination, ...sort, ...this.dictFilterData.listQuery})
                const {records, size, current, total} = res.data
                this.dictDataSource.data = records
                this.dictDataSource.pagination.size = records.length > 0 ? size : 10
                this.dictDataSource.pagination.current = records.length > 0 ? current : 1
                this.dictDataSource.pagination.total = records.length > 0 ? total : 0
                this.$nextTick(() => {
                    this.dictDataSource.loading = false
                })
            } catch (error) {
                this.$message.error(i18n.t('common.error') + ':' + error)
                this.dictDataSource.loading = false
            }
        },
        // 新增
        dictAdd(data) {
            this.$confirm(i18n.t('common.messageBox.add.title'), i18n.t('common.messageBox.tips'), {
                confirmButtonText: i18n.t('common.btn.confirmBtnName'),
                cancelButtonText: i18n.t('common.btn.cancelBtnName'),
                type: 'warning'
            }).then(() => {
                // 确定
                saveSysDict(data)
                    .then(res => {
                        if (res.data) {
                            this.dictQueryPage()
                            this.$message.success(i18n.t('common.success'))
                            this.dictAddDialogData.visible = false
                            this.dictQueryPage()
                        } else {
                            this.$message.error(i18n.t('common.error') + ':' + res.data)
                        }
                    })
                    .finally(() => {
                        this.dictAddDialogData.visible = false
                    })
            })
        },
        // 批量删除
        dictBatchDelete() {
            this.$confirm(i18n.t('common.messageBox.batchDelete.title'), i18n.t('common.messageBox.tips'), {
                confirmButtonText: i18n.t('common.btn.confirmBtnName'),
                cancelButtonText: i18n.t('common.btn.cancelBtnName'),
                type: 'warning'
            }).then(() => {
                // 确定
                deleteBatchSysDict(this.dictSelected)
                    .then(res => {
                        if (res.data) {
                            this.dictQueryPage()
                            this.$message.success(i18n.t('common.success'))
                        } else {
                            this.$message.error(i18n.t('common.error') + ':' + res.data)
                        }
                    })
                    .finally(() => {
                        this.dictSelected = []
                    })
            })
        },

        /**
         * 字典项
         */

        /**
         * 表格内部
         */
        // 页数事件
        changeSize(size) {
            this.dictItemDataSource.pagination.size = size
            this.dictItemQueryPage()
        },
        // 页码事件
        changeCurrent(current) {
            this.dictItemDataSource.pagination.current = current
            this.dictItemQueryPage()
        },
        // 当表格的排序条件发生改变并且数据被重新排序时，触发该事件
        sortChange(sort) {
            if (sort.order !== null) {
                this.dictItemDataSource.sort.sortOrder = sort.order === 'ascending' ? 'ASC' : 'DESC'
                this.dictItemDataSource.sort.sortProp = sort.prop
            } else {
                this.dictItemDataSource.sort.sortOrder = null
                this.dictItemDataSource.sort.sortProp = null
            }
            this.dictItemQueryPage()
        },
        // 多选事件
        selectionChange(selectRows) {
            this.selected = selectRows.map(item => item.id)
        },
        /**
         * 搜索框
         */
        // 获取列表数据
        async dictItemQueryPage() {
            this.dictItemDataSource.loading = true
            try {
                const {pagination, sort} = this.dictItemDataSource
                const res = await queryPageSysDictItem({...pagination, ...sort, dictId: this.dict.id})
                const {records, size, current, total} = res.data
                this.dictItemDataSource.data = records
                this.dictItemDataSource.pagination.size = records.length > 0 ? size : 10
                this.dictItemDataSource.pagination.current = records.length > 0 ? current : 1
                this.dictItemDataSource.pagination.total = records.length > 0 ? total : 0
                this.$nextTick(() => {
                    this.dictItemDataSource.loading = false
                })
            } catch (error) {
                this.$message.error(i18n.t('common.error') + ':' + error)
                this.dictItemDataSource.loading = false
            }
        },
        // 新增
        dictItemAdd(data) {
            this.$confirm(i18n.t('common.messageBox.add.title'), i18n.t('common.messageBox.tips'), {
                confirmButtonText: i18n.t('common.btn.confirmBtnName'),
                cancelButtonText: i18n.t('common.btn.cancelBtnName'),
                type: 'warning'
            }).then(() => {
                // 确定
                saveSysDictItem(data)
                    .then(res => {
                        if (res.data) {
                            this.dictItemQueryPage()
                            this.$message.success(i18n.t('common.success'))
                            this.dictItemAddDialogData.visible = false
                            this.dictItemQueryPage()
                        } else {
                            this.$message.error(i18n.t('common.error') + ':' + res.data)
                        }
                    })
                    .finally(() => {
                        this.dictItemAddDialogData.visible = false
                    })
            })
        },
        // 编辑
        dictItemModify(data) {
            this.$confirm(i18n.t('common.messageBox.modify.title'), i18n.t('common.messageBox.tips'), {
                confirmButtonText: i18n.t('common.btn.confirmBtnName'),
                cancelButtonText: i18n.t('common.btn.cancelBtnName'),
                type: 'warning'
            }).then(() => {
                saveSysDictItem(data).then(res => {
                    if (res.data) {
                        this.$message.success(i18n.t('common.success'))
                        this.dictItemModifyDialogData.visible = false
                        this.dictItemQueryPage()
                    } else {
                        this.$message.error(i18n.t('common.error') + ':' + res.data)
                    }
                })
            })
        }
    }
}
</script>
