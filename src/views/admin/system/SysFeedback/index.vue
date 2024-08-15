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
            <image-upload
                :action-url=feedbackActionUrl
                :upload-auto-upload="true"
                style="text-align: center"
                @uploadSuccess="handleAddUploadSuccess">
                <el-image v-if="addDialogData.model.screenshot" :src="addDialogData.model.screenshot | imageFileFilter"
                          class="dialog-upload-image"
                          lazy/>
                <div v-else>
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em>
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
                :action-url=feedbackActionUrl
                :upload-auto-upload="true"
                style="text-align: center"
                @uploadSuccess="handleModifyUploadSuccess">
                <el-image v-if="modifyDialogData.model.screenshot"
                          :src="modifyDialogData.model.screenshot | imageFileFilter"
                          class="dialog-upload-image"
                          lazy/>
                <div v-else>
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em>
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
            @submit="()=>{this.infoDialogData.visible=false}"/>
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
import searchPane from '@/components/SearchPane';
import tablePane from '@/components/TablePane';
import MyDialog from '@/components/Dialog';
import {
    deleteBatchSysFeedback,
    deleteSysFeedback,
    exportChoseExcelSysFeedback,
    exportExcelSysFeedback,
    exportParamExcelSysFeedback,
    exportTemplateSysFeedback,
    queryPageSysFeedback,
    saveBatchSysFeedback,
    saveSysFeedback,
    selectSysFeedback,
} from "@/api/sys-feedback-api";
import i18n from '@/common/lang';
import UploadExcelComponent from '@/components/UploadExcel/index.vue';
import BackToTop from "@/components/BackToTop";
import ImageUpload from "@/components/Upload/ImageUpload";
import {selectAllSysUserDict} from "@/api/dict-api";

export default {
    name: 'SysFeedback',
    components: {ImageUpload, searchPane, tablePane, MyDialog, UploadExcelComponent, BackToTop},
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
                        permission: '020901',
                        handleClick: this.queryPage,
                    },
                    addBtn: {
                        permission: '020902',
                        handleClick: () => {
                            // 初始化反馈用户下拉框
                            this.addDialogData.visible = true
                        },
                    },
                    batchAddBtn: {
                        permission: '020903',
                        handleClick: () => {
                            this.batchDialogData.visible = true;
                        },
                    },
                    batchDeleteBtn: {
                        permission: '020905',
                        handleClick: this.batchDelete,
                    },
                },

                // 精准数据输入框
                decimal: [],
                // 数字输入框
                numbers: [
                    {
                        key: 'id',
                        length: 11,
                        name: i18n.t('view.sysFeedback.id'),
                    },
                ],
                // 搜索输入框
                inputs: [
                    {
                        key: 'feedbackContent',
                        length: 255,
                        name: i18n.t('view.sysFeedback.feedbackContent'),
                    },
                    {
                        key: 'screenshot',
                        length: 255,
                        name: i18n.t('view.sysFeedback.screenshot'),
                    },
                    {
                        key: 'feedbackUserId',
                        length: 255,
                        name: i18n.t('view.sysFeedback.feedbackUserId'),
                    },
                    {
                        key: 'feedbackResult',
                        length: 255,
                        name: i18n.t('view.sysFeedback.feedbackResult'),
                    },
                    {
                        key: 'remark',
                        length: 255,
                        name: i18n.t('view.sysFeedback.remark'),
                    },
                ],
                // 搜索下拉框
                selects: [
                    {
                        key: 'feedbackType',
                        name: i18n.t('view.sysFeedback.feedbackType'),
                        dictSelect: {
                            dictCode: 'sys.feedback.type'
                        }
                    },
                    {
                        key: 'priority',
                        name: i18n.t('view.sysFeedback.priority'),
                        dictSelect: {
                            dictCode: 'sys.feedback.priority'
                        }
                    },
                    {
                        key: 'feedbackState',
                        name: i18n.t('view.sysFeedback.feedbackState'),
                        dictSelect: {
                            dictCode: 'sys.feedback.state'
                        }
                    },
                    {
                        key: 'creUserName',
                        name: i18n.t('view.sysFeedback.creUserName'),
                        dataSelect: {
                            url: 'sys-user',
                        }
                    },
                    {
                        key: 'updUserName',
                        name: i18n.t('view.sysFeedback.updUserName'),
                        dataSelect: {
                            url: 'sys-user',
                        }
                    },
                ],
                // 搜索日期框
                datePickers: [],
                // 搜索时间框
                timePickers: [],
                // 搜索日期及时间框
                dateTimePickers: [
                    {
                        key: 'creTime',
                        name: i18n.t('view.sysFeedback.creTime'),
                    },
                    {
                        key: 'updTime',
                        name: i18n.t('view.sysFeedback.updTime'),
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
                        label: i18n.t('view.sysFeedback.id'),
                        sortable: true,
                    },
                    {
                        key: 'id',
                        label: i18n.t('view.sysFeedback.id'),
                        sortable: true,
                    },
                    {
                        key: 'feedbackContent',
                        label: i18n.t('view.sysFeedback.feedbackContent'),
                        sortable: true,
                    },
                    {
                        key: 'screenshot',
                        label: i18n.t('view.sysFeedback.screenshot'),
                        sortable: true,
                        isImage: true,
                    },
                    {
                        key: 'feedbackUserId',
                        label: i18n.t('view.sysFeedback.feedbackUserId'),
                        sortable: true,
                    },
                    {
                        key: 'feedbackType',
                        label: i18n.t('view.sysFeedback.feedbackType'),
                        sortable: true,
                        isSpecial: function (value) {
                            switch (value) {
                                case "0":
                                    return i18n.t('enum.feedbackType.0');
                                case "1":
                                    return i18n.t('enum.feedbackType.1');
                                default:
                                    return i18n.t('enum.unknown');
                            }
                        },
                    },
                    {
                        key: 'priority',
                        label: i18n.t('view.sysFeedback.priority'),
                        sortable: true,
                        isSpecial: function (value) {
                            switch (value) {
                                case "0":
                                    return i18n.t('enum.priority.0');
                                case "1":
                                    return i18n.t('enum.priority.1');
                                case "2":
                                    return i18n.t('enum.priority.2');
                                default:
                                    return i18n.t('enum.unknown');
                            }
                        },
                    },
                    {
                        key: 'feedbackState',
                        label: i18n.t('view.sysFeedback.feedbackState'),
                        sortable: true,
                        isSpecial: function (value) {
                            switch (value) {
                                case "0":
                                    return i18n.t('enum.feedbackState.0');
                                case "1":
                                    return i18n.t('enum.feedbackState.1');
                                case "2":
                                    return i18n.t('enum.feedbackState.2');
                                case "3":
                                    return i18n.t('enum.feedbackState.3');
                                default:
                                    return i18n.t('enum.unknown');
                            }
                        },
                    },
                    {
                        key: 'feedbackResult',
                        label: i18n.t('view.sysFeedback.feedbackResult'),
                        sortable: true,
                    },
                    {
                        key: 'remark',
                        label: i18n.t('view.sysFeedback.remark'),
                        sortable: true,
                    },
                    {
                        key: 'creUserName',
                        label: i18n.t('view.sysFeedback.creUserName'),
                        sortable: true,
                    },
                    {
                        width: 160,
                        key: 'creTime',
                        label: i18n.t('view.sysFeedback.creTime'),
                        sortable: true,
                    },
                    {
                        key: 'updUserName',
                        label: i18n.t('view.sysFeedback.updUserName'),
                        sortable: true,
                    },
                    {
                        width: 160,
                        key: 'updTime',
                        label: i18n.t('view.sysFeedback.updTime'),
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
                            permission: '020906',
                            handleRowClick: (index, row) => {
                                // 初始化反馈用户下拉框
                                selectSysFeedback({id: row.id}).then((res) => {
                                    this.infoDialogData.model = res.data
                                    this.infoDialogData.visible = true;
                                })
                            }
                        },
                        {
                            name: i18n.t('common.btn.modifyBtnName'),
                            type: 'primary',
                            permission: '020902,020906',
                            handleRowClick: (index, row) => {
                                // 初始化反馈用户下拉框
                                selectSysFeedback({id: row.id}).then((res) => {
                                    this.modifyDialogData.model = res.data
                                    this.modifyDialogData.visible = true;
                                })
                            }
                        },
                        {
                            name: i18n.t('common.btn.deleteBtnName'),
                            type: 'danger',
                            permission: '020904',
                            handleRowClick: (index, row) => {
                                this.$confirm(i18n.t('common.messageBox.delete.title') + row.name, i18n.t('common.messageBox.tips'), {
                                    confirmButtonText: i18n.t('common.btn.confirmBtnName'),
                                    cancelButtonText: i18n.t('common.btn.cancelBtnName'),
                                    type: 'warning'
                                }).then(() => {
                                    // 确定
                                    deleteSysFeedback({id: row.id}).then((res) => {
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
                        permission: '020907',
                        handleClick: this.exportTemplate,
                    },
                ],
                toolDropDown: [
                    {
                        name: i18n.t('common.tool.batchExport.choose'),
                        key: 'export',
                        permission: '020908',
                        handleClick: this.batchExport,
                        options: [
                            {
                                permission: '020908',
                                key: 'choose',
                                name: i18n.t('common.tool.batchExport.choose'),
                            },
                            {
                                permission: '020909',
                                key: 'query',
                                name: i18n.t('common.tool.batchExport.query'),
                            },
                            {
                                permission: '020910',
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
             * 头像上传地址
             */
            feedbackActionUrl: "/file/image/uploadFeedback",

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
                        key: 'id',
                        name: i18n.t('view.sysFeedback.id'),
                        options: [],
                    },
                    {
                        type: 'textarea',
                        length: 255,
                        key: 'feedbackContent',
                        name: i18n.t('view.sysFeedback.feedbackContent'),
                    },
                    {
                        required: false,
                        type: 'input',
                        length: 255,
                        key: 'screenshot',
                        name: i18n.t('view.sysFeedback.screenshot'),
                    },
                    {
                        required: false,
                        type: 'dataSelect',
                        key: 'feedbackUserId',
                        name: i18n.t('view.sysFeedback.feedbackUserId'),
                        dataSelect: {
                            url: "sys-user"
                        },
                    },
                    {
                        type: 'select',
                        key: 'feedbackType',
                        name: i18n.t('view.sysFeedback.feedbackType'),
                        options: [
                            {
                                value: "0",
                                name: i18n.t('enum.feedbackType.0'),
                            },
                            {
                                value: "1",
                                name: i18n.t('enum.feedbackType.1'),
                            },
                        ],
                    },
                    {
                        type: 'select',
                        key: 'priority',
                        name: i18n.t('view.sysFeedback.priority'),
                        options: [
                            {
                                value: "0",
                                name: i18n.t('enum.priority.0'),
                            },
                            {
                                value: "1",
                                name: i18n.t('enum.priority.1'),
                            },
                            {
                                value: "2",
                                name: i18n.t('enum.priority.2'),
                            },
                            {
                                value: "3",
                                name: i18n.t('enum.priority.3'),
                            },
                        ],
                    },
                    {
                        type: 'select',
                        key: 'feedbackState',
                        name: i18n.t('view.sysFeedback.feedbackState'),
                        options: [
                            {
                                value: "0",
                                name: i18n.t('enum.feedbackState.0'),
                            },
                            {
                                value: "1",
                                name: i18n.t('enum.feedbackState.1'),
                            },
                            {
                                value: "2",
                                name: i18n.t('enum.feedbackState.2'),
                            },
                            {
                                value: "3",
                                name: i18n.t('enum.feedbackState.3'),
                            },
                        ],
                    },
                    {
                        required: false,
                        type: 'input',
                        length: 255,
                        key: 'feedbackResult',
                        name: i18n.t('view.sysFeedback.feedbackResult'),
                    },
                    {
                        required: false,
                        type: 'textarea',
                        length: 255,
                        key: 'remark',
                        name: i18n.t('view.sysFeedback.remark'),
                    },
                ],
                model: {
                    screenshot: "",
                },
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
                        name: i18n.t('view.sysFeedback.id'),
                    },
                    {
                        type: 'select',
                        key: 'id',
                        name: i18n.t('view.sysFeedback.id'),
                        options: [],
                    },
                    {
                        type: 'textarea',
                        length: 255,
                        key: 'feedbackContent',
                        name: i18n.t('view.sysFeedback.feedbackContent'),
                    },
                    {
                        type: 'input',
                        length: 255,
                        key: 'screenshot',
                        name: i18n.t('view.sysFeedback.screenshot'),
                    },
                    {
                        type: 'dataSelect',
                        key: 'feedbackUserId',
                        name: i18n.t('view.sysFeedback.feedbackUserId'),
                        dataSelect: {
                            url: "sys-user"
                        },
                    },
                    {
                        type: 'select',
                        key: 'feedbackType',
                        name: i18n.t('view.sysFeedback.feedbackType'),
                        options: [
                            {
                                value: "0",
                                name: i18n.t('enum.feedbackType.0'),
                            },
                            {
                                value: "1",
                                name: i18n.t('enum.feedbackType.1'),
                            },
                        ],
                    },
                    {
                        type: 'select',
                        key: 'priority',
                        name: i18n.t('view.sysFeedback.priority'),
                        options: [
                            {
                                value: "0",
                                name: i18n.t('enum.priority.0'),
                            },
                            {
                                value: "1",
                                name: i18n.t('enum.priority.1'),
                            },
                            {
                                value: "2",
                                name: i18n.t('enum.priority.2'),
                            },
                        ],
                    },
                    {
                        type: 'select',
                        key: 'feedbackState',
                        name: i18n.t('view.sysFeedback.feedbackState'),
                        options: [
                            {
                                value: "0",
                                name: i18n.t('enum.feedbackState.0'),
                            },
                            {
                                value: "1",
                                name: i18n.t('enum.feedbackState.1'),
                            },
                            {
                                value: "2",
                                name: i18n.t('enum.feedbackState.2'),
                            },
                            {
                                value: "3",
                                name: i18n.t('enum.feedbackState.3'),
                            },
                        ],
                    },
                    {
                        type: 'input',
                        length: 255,
                        key: 'feedbackResult',
                        name: i18n.t('view.sysFeedback.feedbackResult'),
                    },
                    {
                        required: false,
                        type: 'textarea',
                        length: 255,
                        key: 'remark',
                        name: i18n.t('view.sysFeedback.remark'),
                    },
                ],
                model: {
                    screenshot: "",
                },
            },
            // 详情
            infoDialogData: {
                visible: false,
                modelItem: [
                    {
                        type: 'number',
                        length: 11,
                        key: 'id',
                        name: i18n.t('view.sysFeedback.id'),
                    },
                    {
                        type: 'select',
                        key: 'id',
                        name: i18n.t('view.sysFeedback.id'),
                        options: [],
                    },
                    {
                        type: 'textarea',
                        length: 255,
                        key: 'feedbackContent',
                        name: i18n.t('view.sysFeedback.feedbackContent'),
                    },
                    {
                        type: 'input',
                        length: 255,
                        key: 'screenshot',
                        name: i18n.t('view.sysFeedback.screenshot'),
                    },
                    {
                        type: 'dataSelect',
                        key: 'feedbackUserId',
                        name: i18n.t('view.sysFeedback.feedbackUserId'),
                        dataSelect: {
                            url: "sys-user"
                        },
                    },
                    {
                        type: 'select',
                        key: 'feedbackType',
                        name: i18n.t('view.sysFeedback.feedbackType'),
                        options: [
                            {
                                value: "0",
                                name: i18n.t('enum.feedbackType.0'),
                            },
                            {
                                value: "1",
                                name: i18n.t('enum.feedbackType.1'),
                            },
                        ],
                    },
                    {
                        type: 'select',
                        key: 'priority',
                        name: i18n.t('view.sysFeedback.priority'),
                        options: [
                            {
                                value: "0",
                                name: i18n.t('enum.priority.0'),
                            },
                            {
                                value: "1",
                                name: i18n.t('enum.priority.1'),
                            },
                            {
                                value: "2",
                                name: i18n.t('enum.priority.2'),
                            },
                        ],
                    },
                    {
                        type: 'select',
                        key: 'feedbackState',
                        name: i18n.t('view.sysFeedback.feedbackState'),
                        options: [
                            {
                                value: "0",
                                name: i18n.t('enum.feedbackState.0'),
                            },
                            {
                                value: "1",
                                name: i18n.t('enum.feedbackState.1'),
                            },
                            {
                                value: "2",
                                name: i18n.t('enum.feedbackState.2'),
                            },
                            {
                                value: "3",
                                name: i18n.t('enum.feedbackState.3'),
                            },
                        ],
                    },
                    {
                        type: 'input',
                        length: 255,
                        key: 'feedbackResult',
                        name: i18n.t('view.sysFeedback.feedbackResult'),
                    },
                    {
                        type: 'textarea',
                        length: 255,
                        key: 'remark',
                        name: i18n.t('view.sysFeedback.remark'),
                    },
                    {
                        type: 'number',
                        length: 11,
                        key: 'creUserName',
                        name: i18n.t('view.sysFeedback.creUserName'),
                    },
                    {
                        type: 'datetime',
                        key: 'creTime',
                        name: i18n.t('view.sysFeedback.creTime'),
                    },
                    {
                        type: 'number',
                        length: 11,
                        key: 'updUserName',
                        name: i18n.t('view.sysFeedback.updUserName'),
                    },
                    {
                        type: 'datetime',
                        key: 'updTime',
                        name: i18n.t('view.sysFeedback.updTime'),
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
                saveSysFeedback(data).then((res) => {
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
                const res = await queryPageSysFeedback({...pagination, ...sort, ...this.filterData.listQuery});
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
                saveSysFeedback(data).then((res) => {
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
                saveBatchSysFeedback(this.batchDialogData.excelData.file).then((res) => {
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
                deleteBatchSysFeedback(this.selected).then((res) => {
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
            exportTemplateSysFeedback();
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
                    hasSelected ? exportChoseExcelSysFeedback(this.selected) : this.$message.error(EXPORT_CHOOSE_NULL_ERROR_MSG);
                    break;
                }
                case EXPORT_TYPE.QUERY:
                    this.$message.success(EXPORT_SUCCESS_MSG);
                    exportParamExcelSysFeedback({...this.filterData.listQuery});
                    break;
                case EXPORT_TYPE.ALL:
                    this.$message.success(EXPORT_SUCCESS_MSG);
                    exportExcelSysFeedback();
                    break;
                default:
                    this.$message.error(EXPORT_ERROR_MSG);
                    break;
            }
        },

        /**
         * 反馈截图上传
         */
        // 添加上传成功回调
        handleAddUploadSuccess(response, file, fileList) {
            if (response.code === 20000) {
                //响应式渲染深层对象vue2不会监听
                this.$set(this.addDialogData.model, 'screenshot', response.data)
            } else {
                this.$message.error(response.data)
            }
        },
        // 编辑上传成功回调
        handleModifyUploadSuccess(response, file, fileList) {
            if (response.code === 20000) {
                //响应式渲染深层对象vue2不会监听
                this.$set(this.modifyDialogData.model, 'screenshot', response.data)
            } else {
                this.$message.error(response.data)
            }
        },
    }
}
</script>
