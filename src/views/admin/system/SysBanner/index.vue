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
            @sortChange="sortChange"/>
        <my-dialog
            :model="addDialogData.model"
            :modelItem="addDialogData.modelItem"
            :title="$t('common.dialog.dialogAddTitle')"
            :visible.sync="addDialogData.visible"
            :width="dialogWidth"
            @close="queryPage()"
            @submit="add">
            <image-upload
                action-url="banner"
                :upload-auto-upload="true"
                style="text-align: center"
                @uploadSuccess="handleAddUploadSuccess">
                <el-image
                    v-if="addDialogData.model.imgUrl"
                    :src="addDialogData.model.imgUrl | imageFileFilter"
                    class="dialog-upload-image"
                    lazy/>
                <div v-else>
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">
                        将文件拖到此处，或
                        <em>点击上传</em>
                        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                    </div>
                </div>
            </image-upload>
        </my-dialog>
        <my-dialog
            :model="modifyDialogData.model"
            :modelItem="modifyDialogData.modelItem"
            :title="$t('common.dialog.dialogModifyTitle')"
            :visible.sync="modifyDialogData.visible"
            :width="dialogWidth"
            @close="queryPage()"
            @submit="modify">
            <image-upload
                action-url="banner"
                :upload-auto-upload="true"
                style="text-align: center"
                @uploadSuccess="handleModifyUploadSuccess">
                <el-image
                    v-if="modifyDialogData.model.imgUrl"
                    :src="modifyDialogData.model.imgUrl | imageFileFilter"
                    class="dialog-upload-image"
                    lazy/>
                <div v-else>
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">
                        将文件拖到此处，或
                        <em>点击上传</em>
                        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                    </div>
                </div>
            </image-upload>
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
            @submit="() => {this.infoDialogData.visible = false}">
            <div v-if="infoDialogData.model.imgUrl" style="text-align: center">
                <el-image
                    :preview-src-list="[infoPreviewSrcList]"
                    :src="infoDialogData.model.imgUrl | imageFileFilter"
                    class="dialog-upload-image"
                    lazy/>
            </div>
        </my-dialog>
        <my-dialog
            :fullscreen="batchDialogData.fullscreen"
            :title="$t('common.dialog.dialogBatchTitle')"
            :visible.sync="batchDialogData.visible"
            :width="batchDialogData.width"
            @submit="batchAdd">
            <upload-excel-component :excelData="batchDialogData.excelData"/>
        </my-dialog>
    </div>
</template>

<script>
import searchPane from '@/components/SearchPane'
import tablePane from '@/components/TablePane'
import MyDialog from '@/components/Dialog'
import {
    deleteBatchSysBanner,
    deleteSysBanner,
    exportChoseExcelSysBanner,
    exportExcelSysBanner,
    exportParamExcelSysBanner,
    exportTemplateSysBanner,
    queryPageSysBanner,
    saveBatchSysBanner,
    saveSysBanner,
    selectSysBanner
} from '@/api/sys-banner-api'
import i18n from '@/common/lang'
import UploadExcelComponent from '@/components/UploadExcel/index.vue'
import BackToTop from '@/components/BackToTop'
import ImageUpload from '@/components/Upload/ImageUpload.vue'

export default {
    name: 'SysBanner',
    components: {ImageUpload, searchPane, tablePane, MyDialog, UploadExcelComponent, BackToTop},
    // 重构图片详情
    computed: {
        infoPreviewSrcList() {
            // 遍历图片列表，对每个图片应用过滤器
            return this.$options.filters.imageFileFilter(this.infoDialogData.model.imgUrl)
        }
    },
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
            filterData: {
                // 重置
                reset: true,
                // 查询参数
                listQuery: {},
                // 查询按钮
                filterBtn: {
                    searchBtn: {
                        permission: '020701',
                        handleClick: this.queryPage
                    },
                    addBtn: {
                        permission: '020702',
                        handleClick: () => {
                            this.addDialogData.visible = true
                        }
                    },
                    batchAddBtn: {
                        permission: '020703',
                        handleClick: () => {
                            this.batchDialogData.visible = true
                        }
                    },
                    batchDeleteBtn: {
                        permission: '020705',
                        handleClick: this.batchDelete
                    }
                },

                // 精准数据输入框
                decimal: [],
                // 数字输入框
                numbers: [
                    {
                        key: 'id',
                        length: 11,
                        name: i18n.t('view.sysBanner.id')
                    },
                    {
                        key: 'creUserId',
                        length: 11,
                        name: i18n.t('view.sysBanner.creUserId')
                    },
                    {
                        key: 'updUserId',
                        length: 11,
                        name: i18n.t('view.sysBanner.updUserId')
                    }
                ],
                // 搜索输入框
                inputs: [
                    {
                        key: 'name',
                        length: 64,
                        name: i18n.t('view.sysBanner.name')
                    },
                    {
                        key: 'content',
                        length: 255,
                        name: i18n.t('view.sysBanner.content')
                    },
                    {
                        key: 'imgUrl',
                        length: 255,
                        name: i18n.t('view.sysBanner.imgUrl')
                    },
                    {
                        key: 'toUrl',
                        length: 255,
                        name: i18n.t('view.sysBanner.toUrl')
                    },
                    {
                        key: 'remark',
                        length: 255,
                        name: i18n.t('view.sysBanner.remark')
                    },
                    {
                        key: 'creUserName',
                        length: 10,
                        name: i18n.t('view.sysBanner.creUserName')
                    },
                    {
                        key: 'updUserName',
                        length: 10,
                        name: i18n.t('view.sysBanner.updUserName')
                    }
                ],
                // 搜索下拉框
                selects: [
                    {
                        key: 'type',
                        name: i18n.t('view.sysBanner.type'),
                        options: [
                            {
                                key: '0',
                                name: i18n.t('enum.banner.type.0')
                            },
                            {
                                key: '1',
                                name: i18n.t('enum.banner.type.1')
                            }
                        ]
                    },
                    {
                        key: 'state',
                        name: i18n.t('view.sysBanner.state'),
                        options: [
                            {
                                key: '0',
                                name: i18n.t('enum.state.0')
                            },
                            {
                                key: '1',
                                name: i18n.t('enum.state.1')
                            }
                        ]
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
                        name: i18n.t('view.sysBanner.creTime')
                    },
                    {
                        key: 'updTime',
                        name: i18n.t('view.sysBanner.updTime')
                    }
                ]
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
                        label: i18n.t('view.sysBanner.id'),
                        sortable: true
                    },
                    {
                        key: 'name',
                        label: i18n.t('view.sysBanner.name'),
                        sortable: true
                    },
                    {
                        key: 'content',
                        label: i18n.t('view.sysBanner.content'),
                        sortable: true
                    },
                    {
                        key: 'imgUrl',
                        label: i18n.t('view.sysBanner.bannerImg'),
                        sortable: true,
                        isImage: true
                    },
                    {
                        key: 'type',
                        label: i18n.t('view.sysBanner.type'),
                        sortable: true,
                        isSpecial: function (value) {
                            switch (value) {
                                case '0':
                                    return i18n.t('enum.banner.type.0')
                                case '1':
                                    return i18n.t('enum.banner.type.1')
                                default:
                                    return i18n.t('enum.unknown')
                            }
                        }
                    },
                    {
                        key: 'imgUrl',
                        label: i18n.t('view.sysBanner.imgUrl'),
                        sortable: true
                    },
                    {
                        key: 'toUrl',
                        label: i18n.t('view.sysBanner.toUrl'),
                        sortable: true
                    },
                    {
                        key: 'state',
                        label: i18n.t('view.sysBanner.state'),
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
                        label: i18n.t('view.sysBanner.remark'),
                        sortable: true
                    },
                    {
                        key: 'creUserId',
                        label: i18n.t('view.sysBanner.creUserId'),
                        sortable: true
                    },
                    {
                        key: 'creUserName',
                        label: i18n.t('view.sysBanner.creUserName'),
                        sortable: true
                    },
                    {
                        width: 160,
                        key: 'creTime',
                        label: i18n.t('view.sysBanner.creTime'),
                        sortable: true
                    },
                    {
                        key: 'updUserId',
                        label: i18n.t('view.sysBanner.updUserId'),
                        sortable: true
                    },
                    {
                        key: 'updUserName',
                        label: i18n.t('view.sysBanner.updUserName'),
                        sortable: true
                    },
                    {
                        width: 160,
                        key: 'updTime',
                        label: i18n.t('view.sysBanner.updTime'),
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
                    width: 80 * 3,
                    data: [
                        {
                            name: i18n.t('common.btn.infoBtnName'),
                            type: 'primary',
                            permission: '020706',
                            handleRowClick: (index, row) => {
                                selectSysBanner({id: row.id}).then(res => {
                                    this.infoDialogData.model = res.data
                                    this.infoDialogData.visible = true
                                })
                            }
                        },
                        {
                            name: i18n.t('common.btn.modifyBtnName'),
                            type: 'primary',
                            permission: '020702,020706',
                            handleRowClick: (index, row) => {
                                selectSysBanner({id: row.id}).then(res => {
                                    this.modifyDialogData.model = res.data
                                    this.modifyDialogData.visible = true
                                })
                            }
                        },
                        {
                            name: i18n.t('common.btn.deleteBtnName'),
                            type: 'danger',
                            permission: '020704',
                            handleRowClick: (index, row) => {
                                this.$confirm(i18n.t('common.messageBox.delete.title') + row.name, i18n.t('common.messageBox.tips'), {
                                    confirmButtonText: i18n.t('common.btn.confirmBtnName'),
                                    cancelButtonText: i18n.t('common.btn.cancelBtnName'),
                                    type: 'warning'
                                }).then(() => {
                                    // 确定
                                    deleteSysBanner({id: row.id}).then(res => {
                                        if (res.data) {
                                            this.queryPage()
                                            this.$message.success(i18n.t('common.success'))
                                            this.addDialogData.visible = false
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

            /**
             * 底部工具按钮
             */
            tool: {
                toolBtn: [
                    {
                        name: i18n.t('common.tool.exportTemplate'),
                        permission: '020707',
                        handleClick: this.exportTemplate
                    }
                ],
                toolDropDown: [
                    {
                        name: i18n.t('common.tool.batchExport.choose'),
                        key: 'export',
                        permission: '020708',
                        handleClick: this.batchExport,
                        options: [
                            {
                                permission: '020708',
                                key: 'choose',
                                name: i18n.t('common.tool.batchExport.choose')
                            },
                            {
                                permission: '020709',
                                key: 'query',
                                name: i18n.t('common.tool.batchExport.query')
                            },
                            {
                                permission: '020710',
                                key: 'all',
                                name: i18n.t('common.tool.batchExport.all')
                            }
                        ]
                    }
                ]
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
                        length: 64,
                        key: 'name',
                        name: i18n.t('view.sysBanner.name')
                    },
                    {
                        required: false,
                        type: 'input',
                        length: 255,
                        key: 'content',
                        name: i18n.t('view.sysBanner.content')
                    },
                    {
                        type: 'select',
                        key: 'type',
                        name: i18n.t('view.sysBanner.type'),
                        options: [
                            {
                                value: '0',
                                name: i18n.t('enum.banner.type.0')
                            },
                            {
                                value: '1',
                                name: i18n.t('enum.banner.type.1')
                            }
                        ]
                    },
                    {
                        disabled: true,
                        type: 'input',
                        length: 255,
                        key: 'imgUrl',
                        name: i18n.t('view.sysBanner.imgUrl')
                    },
                    {
                        required: false,
                        type: 'input',
                        length: 255,
                        key: 'toUrl',
                        name: i18n.t('view.sysBanner.toUrl')
                    },
                    {
                        type: 'select',
                        key: 'state',
                        name: i18n.t('view.sysBanner.state'),
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
                        name: i18n.t('view.sysBanner.remark')
                    }
                ],
                model: {}
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
                        name: i18n.t('view.sysBanner.id')
                    },
                    {
                        type: 'input',
                        length: 64,
                        key: 'name',
                        name: i18n.t('view.sysBanner.name')
                    },
                    {
                        required: false,
                        type: 'input',
                        length: 255,
                        key: 'content',
                        name: i18n.t('view.sysBanner.content')
                    },
                    {
                        type: 'select',
                        key: 'type',
                        name: i18n.t('view.sysBanner.type'),
                        options: [
                            {
                                value: '0',
                                name: i18n.t('enum.banner.type.0')
                            },
                            {
                                value: '1',
                                name: i18n.t('enum.banner.type.1')
                            }
                        ]
                    },
                    {
                        disabled: true,
                        type: 'input',
                        length: 255,
                        key: 'imgUrl',
                        name: i18n.t('view.sysBanner.imgUrl')
                    },
                    {
                        required: false,
                        type: 'input',
                        length: 255,
                        key: 'toUrl',
                        name: i18n.t('view.sysBanner.toUrl')
                    },
                    {
                        type: 'select',
                        key: 'state',
                        name: i18n.t('view.sysBanner.state'),
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
                        name: i18n.t('view.sysBanner.remark')
                    },
                ],
                model: {}
            },
            // 详情
            infoDialogData: {
                visible: false,
                modelItem: [
                    {
                        type: 'number',
                        length: 11,
                        key: 'id',
                        name: i18n.t('view.sysBanner.id')
                    },
                    {
                        type: 'input',
                        length: 64,
                        key: 'name',
                        name: i18n.t('view.sysBanner.name')
                    },
                    {
                        type: 'input',
                        length: 255,
                        key: 'content',
                        name: i18n.t('view.sysBanner.content')
                    },
                    {
                        type: 'select',
                        key: 'type',
                        name: i18n.t('view.sysBanner.type'),
                        options: [
                            {
                                value: '0',
                                name: i18n.t('enum.banner.type.0')
                            },
                            {
                                value: '1',
                                name: i18n.t('enum.banner.type.1')
                            }
                        ]
                    },
                    {
                        type: 'input',
                        length: 255,
                        key: 'imgUrl',
                        name: i18n.t('view.sysBanner.imgUrl')
                    },
                    {
                        type: 'input',
                        length: 255,
                        key: 'toUrl',
                        name: i18n.t('view.sysBanner.toUrl')
                    },
                    {
                        type: 'select',
                        key: 'state',
                        name: i18n.t('view.sysBanner.state'),
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
                        type: 'input',
                        length: 255,
                        key: 'remark',
                        name: i18n.t('view.sysBanner.remark')
                    },
                    {
                        type: 'number',
                        length: 11,
                        key: 'creUserId',
                        name: i18n.t('view.sysBanner.creUserId')
                    },
                    {
                        type: 'input',
                        length: 10,
                        key: 'creUserName',
                        name: i18n.t('view.sysBanner.creUserName')
                    },
                    {
                        type: 'datetime',
                        key: 'creTime',
                        name: i18n.t('view.sysBanner.creTime')
                    },
                    {
                        type: 'number',
                        length: 11,
                        key: 'updUserId',
                        name: i18n.t('view.sysBanner.updUserId')
                    },
                    {
                        type: 'input',
                        length: 10,
                        key: 'updUserName',
                        name: i18n.t('view.sysBanner.updUserName')
                    },
                    {
                        type: 'datetime',
                        key: 'updTime',
                        name: i18n.t('view.sysBanner.updTime')
                    }
                ],
                model: {}
            },
            // 批量新增
            batchDialogData: {
                width: '80%',
                visible: false,
                fullscreen: false,
                excelData: {
                    tableHeader: [],
                    tableData: [],
                    file: null
                }
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
            this.dataSource.pagination.size = size
            this.queryPage()
        },
        // 页码事件
        changeCurrent(current) {
            this.dataSource.pagination.current = current
            this.queryPage()
        },
        // 当表格的排序条件发生改变并且数据被重新排序时，触发该事件
        sortChange(sort) {
            if (sort.order !== null) {
                this.dataSource.sort.sortOrder = sort.order === 'ascending' ? 'ASC' : 'DESC'
                this.dataSource.sort.sortProp = sort.prop
            } else {
                this.dataSource.sort.sortOrder = null
                this.dataSource.sort.sortProp = null
            }
            this.queryPage()
        },
        // 多选事件
        selectionChange(selectRows) {
            this.selected = selectRows.map(item => item.id)
        },
        // 编辑
        modify(data) {
            this.$confirm(i18n.t('common.messageBox.modify.title'), i18n.t('common.messageBox.tips'), {
                confirmButtonText: i18n.t('common.btn.confirmBtnName'),
                cancelButtonText: i18n.t('common.btn.cancelBtnName'),
                type: 'warning'
            }).then(() => {
                saveSysBanner(data).then(res => {
                    if (res.data) {
                        this.$message.success(i18n.t('common.success'))
                        this.modifyDialogData.visible = false
                        this.queryPage()
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
        async queryPage() {
            this.dataSource.loading = true
            try {
                const {pagination, sort} = this.dataSource
                const res = await queryPageSysBanner({...pagination, ...sort, ...this.filterData.listQuery})
                const {records, size, current, total} = res.data
                this.dataSource.data = records
                this.dataSource.pagination.size = records.length > 0 ? size : 10
                this.dataSource.pagination.current = records.length > 0 ? current : 1
                this.dataSource.pagination.total = records.length > 0 ? total : 0
                this.$nextTick(() => {
                    this.dataSource.loading = false
                })
            } catch (error) {
                this.$message.error(i18n.t('common.error') + ':' + error)
                this.dataSource.loading = false
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
                saveSysBanner(data)
                    .then(res => {
                        if (res.data) {
                            this.queryPage()
                            this.$message.success(i18n.t('common.success'))
                            this.addDialogData.visible = false
                            this.queryPage()
                        } else {
                            this.$message.error(i18n.t('common.error') + ':' + res.data)
                        }
                    })
                    .finally(() => {
                        this.addDialogData.visible = false
                    })
            })
        },
        // 批量新增
        batchAdd() {
            try {
                saveBatchSysBanner(this.batchDialogData.excelData.file).then(res => {
                    if (res.data) {
                        this.queryPage()
                        this.$message.success(i18n.t('common.success'))
                        this.batchDialogData.visible = false
                    } else {
                        this.$message.error(i18n.t('common.error') + ':' + res.data)
                    }
                })
            } catch (error) {
                this.$message.error(i18n.t('common.error') + ':' + error)
            } finally {
                this.batchDialogData.visible = false
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
                deleteBatchSysBanner(this.selected)
                    .then(res => {
                        if (res.data) {
                            this.queryPage()
                            this.$message.success(i18n.t('common.success'))
                        } else {
                            this.$message.error(i18n.t('common.error') + ':' + res.data)
                        }
                    })
                    .finally(() => {
                        this.selected = []
                    })
            })
        },

        /**
         * 工具栏
         */
        // 导出模板
        exportTemplate() {
            exportTemplateSysBanner()
        },
        // 批量导出
        batchExport(key) {
            const EXPORT_TYPE = {
                EXPORT: 'export',
                CHOOSE: 'choose',
                QUERY: 'query',
                ALL: 'all'
            }
            const EXPORT_SUCCESS_MSG = i18n.t('common.tool.exportSuccess')
            const EXPORT_CHOOSE_NULL_ERROR_MSG = i18n.t('common.tool.exportChooseNullError')
            const EXPORT_ERROR_MSG = i18n.t('common.tool.exportError')
            switch (key) {
                case EXPORT_TYPE.EXPORT:
                case EXPORT_TYPE.CHOOSE: {
                    const hasSelected = this.selected.length > 0
                    this.$message.success(EXPORT_SUCCESS_MSG)
                    hasSelected ? exportChoseExcelSysBanner(this.selected) : this.$message.error(EXPORT_CHOOSE_NULL_ERROR_MSG)
                    break
                }
                case EXPORT_TYPE.QUERY:
                    this.$message.success(EXPORT_SUCCESS_MSG)
                    exportParamExcelSysBanner({...this.filterData.listQuery})
                    break
                case EXPORT_TYPE.ALL:
                    this.$message.success(EXPORT_SUCCESS_MSG)
                    exportExcelSysBanner()
                    break
                default:
                    this.$message.error(EXPORT_ERROR_MSG)
                    break
            }
        },

        /**
         * 附件上传
         */
        // 添加上传成功回调
        handleAddUploadSuccess(response, file, fileList) {
            if (response.code === 20000) {
                //响应式渲染深层对象vue2不会监听
                this.$set(this.addDialogData.model, 'imgUrl', response.data)
            } else {
                this.$message.error(response.data)
            }
        },
        // 编辑上传成功回调
        handleModifyUploadSuccess(response, file, fileList) {
            if (response.code === 20000) {
                //响应式渲染深层对象vue2不会监听
                this.$set(this.modifyDialogData.model, 'imgUrl', response.data)
            } else {
                this.$message.error(response.data)
            }
        }
    }
}
</script>
