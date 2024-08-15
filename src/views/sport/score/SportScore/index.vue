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
    deleteBatchSportScore,
    deleteSportScore,
    exportChoseExcelSportScore,
    exportExcelSportScore,
    exportParamExcelSportScore,
    exportTemplateSportScore,
    queryPageSportScore,
    saveBatchSportScore,
    saveSportScore,
    selectSportScore,
} from "@/api/sport-score-api";
import i18n from '@/common/lang';
import UploadExcelComponent from '@/components/UploadExcel/index.vue';
import BackToTop from "@/components/BackToTop";

export default {
    name: 'SportScore',
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
                        permission: '060101',
                        handleClick: this.queryPage,
                    },
                    addBtn: {
                        permission: '060102',
                        handleClick: () => {
                            this.addDialogData.visible = true
                        },
                    },
                    batchAddBtn: {
                        permission: '060103',
                        handleClick: () => {
                            this.batchDialogData.visible = true;
                        },
                    },
                    batchDeleteBtn: {
                        permission: '060105',
                        handleClick: this.batchDelete,
                    },
                },

                // 精准数据输入框
                decimal: [
                    {
                        key: 'height',
                        length: 8,
                        precision: 2,
                        name: i18n.t('view.sportScore.height'),
                    },
                    {
                        key: 'weight',
                        length: 8,
                        precision: 2,
                        name: i18n.t('view.sportScore.weight'),
                    },
                    {
                        key: 'bmi',
                        length: 8,
                        precision: 2,
                        name: i18n.t('view.sportScore.bmi'),
                    },
                    {
                        key: 'bodyFatRate',
                        length: 8,
                        precision: 2,
                        name: i18n.t('view.sportScore.bodyFatRate'),
                    },
                    {
                        key: 'dailyMetab',
                        length: 8,
                        precision: 2,
                        name: i18n.t('view.sportScore.dailyMetab'),
                    },
                    {
                        key: 'maxOxygenIntake',
                        length: 8,
                        precision: 2,
                        name: i18n.t('view.sportScore.maxOxygenIntake'),
                    },
                ],
                // 数字输入框
                numbers: [
                    {
                        key: 'id',
                        length: 11,
                        name: i18n.t('view.sportScore.id'),
                    },
                    {
                        key: 'age',
                        length: 4,
                        name: i18n.t('view.sportScore.age'),
                    },
                    {
                        key: 'creUserId',
                        length: 11,
                        name: i18n.t('view.sportScore.creUserId'),
                    },
                    {
                        key: 'updUserId',
                        length: 11,
                        name: i18n.t('view.sportScore.updUserId'),
                    },
                ],
                // 搜索输入框
                inputs: [
                    {
                        key: 'scoreResult',
                        length: 255,
                        name: i18n.t('view.sportScore.scoreResult'),
                    },
                    {
                        key: 'analysisResult',
                        length: 255,
                        name: i18n.t('view.sportScore.analysisResult'),
                    },
                    {
                        key: 'creUserName',
                        length: 10,
                        name: i18n.t('view.sportScore.creUserName'),
                    },
                    {
                        key: 'updUserName',
                        length: 10,
                        name: i18n.t('view.sportScore.updUserName'),
                    },
                ],
                // 搜索下拉框
                selects: [
                    {
                        key: 'sex',
                        name: i18n.t('view.sportScore.sex'),
                        options: [
                            {
                                key: '0',
                                name: i18n.t('enum.sex.0'),
                            },
                            {
                                key: '1',
                                name: i18n.t('enum.sex.1'),
                            },
                        ]
                    },
                    {
                        key: 'state',
                        name: i18n.t('view.sportScore.state'),
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
                // 搜索时间框
                timePickers: [
                ],
                // 搜索日期及时间框
                dateTimePickers: [
                    {
                        key: 'creTime',
                        name: i18n.t('view.sportScore.creTime'),
                    },
                    {
                        key: 'updTime',
                        name: i18n.t('view.sportScore.updTime'),
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
                        label: i18n.t('view.sportScore.id'),
                        sortable: true,
                    },
                    {
                        key: 'scoreResult',
                        label: i18n.t('view.sportScore.scoreResult'),
                        sortable: true,
                    },
                    {
                        key: 'sex',
                        label: i18n.t('view.sportScore.sex'),
                        sortable: true,
                        isSpecial: function (value) {
                            switch (value) {
                                case "0":
                                    return i18n.t('enum.sex.0');
                                case "1":
                                    return i18n.t('enum.sex.1');
                                default:
                                    return i18n.t('enum.unknown');
                            }
                        },
                    },
                    {
                        key: 'height',
                        label: i18n.t('view.sportScore.height'),
                        sortable: true,
                    },
                    {
                        key: 'weight',
                        label: i18n.t('view.sportScore.weight'),
                        sortable: true,
                    },
                    {
                        key: 'age',
                        label: i18n.t('view.sportScore.age'),
                        sortable: true,
                    },
                    {
                        key: 'bmi',
                        label: i18n.t('view.sportScore.bmi'),
                        sortable: true,
                    },
                    {
                        key: 'bodyFatRate',
                        label: i18n.t('view.sportScore.bodyFatRate'),
                        sortable: true,
                    },
                    {
                        key: 'dailyMetab',
                        label: i18n.t('view.sportScore.dailyMetab'),
                        sortable: true,
                    },
                    {
                        key: 'maxOxygenIntake',
                        label: i18n.t('view.sportScore.maxOxygenIntake'),
                        sortable: true,
                    },
                    {
                        key: 'analysisResult',
                        label: i18n.t('view.sportScore.analysisResult'),
                        sortable: true,
                    },
                    {
                        key: 'state',
                        label: i18n.t('view.sportScore.state'),
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
                        key: 'creUserId',
                        label: i18n.t('view.sportScore.creUserId'),
                        sortable: true,
                    },
                    {
                        key: 'creUserName',
                        label: i18n.t('view.sportScore.creUserName'),
                        sortable: true,
                    },
                    {
                        width: 160,
                        key: 'creTime',
                        label: i18n.t('view.sportScore.creTime'),
                        sortable: true,
                    },
                    {
                        key: 'updUserId',
                        label: i18n.t('view.sportScore.updUserId'),
                        sortable: true,
                    },
                    {
                        key: 'updUserName',
                        label: i18n.t('view.sportScore.updUserName'),
                        sortable: true,
                    },
                    {
                        width: 160,
                        key: 'updTime',
                        label: i18n.t('view.sportScore.updTime'),
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
                            permission: '060106',
                            handleRowClick: (index, row) => {
                                selectSportScore({id: row.id}).then((res) => {
                                    this.infoDialogData.model = res.data
                                    this.infoDialogData.visible = true;
                                })
                            }
                        },
                        {
                            name: i18n.t('common.btn.modifyBtnName'),
                            type: 'primary',
                            permission: '060102,060106',
                            handleRowClick: (index, row) => {
                                selectSportScore({id: row.id}).then((res) => {
                                    this.modifyDialogData.model = res.data
                                    this.modifyDialogData.visible = true;
                                })
                            }
                        },
                        {
                            name: i18n.t('common.btn.deleteBtnName'),
                            type: 'danger',
                            permission: '060104',
                            handleRowClick: (index, row) => {
                                this.$confirm(i18n.t('common.messageBox.delete.title') + row.name, i18n.t('common.messageBox.tips'), {
                                    confirmButtonText: i18n.t('common.btn.confirmBtnName'),
                                    cancelButtonText: i18n.t('common.btn.cancelBtnName'),
                                    type: 'warning'
                                }).then(() => {
                                    // 确定
                                    deleteSportScore({id: row.id}).then((res) => {
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
                        permission: '060107',
                        handleClick: this.exportTemplate,
                    },
                ],
                toolDropDown: [
                    {
                        name: i18n.t('common.tool.batchExport.choose'),
                        key: 'export',
                        permission: '060108',
                        handleClick: this.batchExport,
                        options: [
                            {
                                permission: '060108',
                                key: 'choose',
                                name: i18n.t('common.tool.batchExport.choose'),
                            },
                            {
                                permission: '060109',
                                key: 'query',
                                name: i18n.t('common.tool.batchExport.query'),
                            },
                            {
                                permission: '060110',
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
                        key: 'scoreResult',
                        name: i18n.t('view.sportScore.scoreResult'),
                    },
                    {
                        type: 'select',
                        key: 'sex',
                        name: i18n.t('view.sportScore.sex'),
                        options: [
                            {
                                value: "0",
                                name: i18n.t('enum.sex.0'),
                            },
                            {
                                value: "1",
                                name: i18n.t('enum.sex.1'),
                            },
                        ],
                    },
                    {
                        type: 'decimal',
                        length: 8,
                        precision: 2,
                        key: 'height',
                        name: i18n.t('view.sportScore.height'),
                    },
                    {
                        type: 'decimal',
                        length: 8,
                        precision: 2,
                        key: 'weight',
                        name: i18n.t('view.sportScore.weight'),
                    },
                    {
                        type: 'number',
                        length: 4,
                        key: 'age',
                        name: i18n.t('view.sportScore.age'),
                    },
                    {
                        type: 'decimal',
                        length: 8,
                        precision: 2,
                        key: 'bmi',
                        name: i18n.t('view.sportScore.bmi'),
                    },
                    {
                        type: 'decimal',
                        length: 8,
                        precision: 2,
                        key: 'bodyFatRate',
                        name: i18n.t('view.sportScore.bodyFatRate'),
                    },
                    {
                        type: 'decimal',
                        length: 8,
                        precision: 2,
                        key: 'dailyMetab',
                        name: i18n.t('view.sportScore.dailyMetab'),
                    },
                    {
                        type: 'decimal',
                        length: 8,
                        precision: 2,
                        key: 'maxOxygenIntake',
                        name: i18n.t('view.sportScore.maxOxygenIntake'),
                    },
                    {
                        type: 'input',
                        length: 255,
                        key: 'analysisResult',
                        name: i18n.t('view.sportScore.analysisResult'),
                    },
                    {
                        type: 'select',
                        key: 'state',
                        name: i18n.t('view.sportScore.state'),
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
                        type: 'number',
                        length: 11,
                        key: 'id',
                        name: i18n.t('view.sportScore.id'),
                    },
                    {
                        type: 'input',
                        length: 255,
                        key: 'scoreResult',
                        name: i18n.t('view.sportScore.scoreResult'),
                    },
                    {
                        type: 'select',
                        key: 'sex',
                        name: i18n.t('view.sportScore.sex'),
                        options: [
                            {
                                value: "0",
                                name: i18n.t('enum.sex.0'),
                            },
                            {
                                value: "1",
                                name: i18n.t('enum.sex.1'),
                            },
                        ],
                    },
                    {
                        type: 'decimal',
                        length: 8,
                        precision: 2,
                        key: 'height',
                        name: i18n.t('view.sportScore.height'),
                    },
                    {
                        type: 'decimal',
                        length: 8,
                        precision: 2,
                        key: 'weight',
                        name: i18n.t('view.sportScore.weight'),
                    },
                    {
                        type: 'number',
                        length: 4,
                        key: 'age',
                        name: i18n.t('view.sportScore.age'),
                    },
                    {
                        type: 'decimal',
                        length: 8,
                        precision: 2,
                        key: 'bmi',
                        name: i18n.t('view.sportScore.bmi'),
                    },
                    {
                        type: 'decimal',
                        length: 8,
                        precision: 2,
                        key: 'bodyFatRate',
                        name: i18n.t('view.sportScore.bodyFatRate'),
                    },
                    {
                        type: 'decimal',
                        length: 8,
                        precision: 2,
                        key: 'dailyMetab',
                        name: i18n.t('view.sportScore.dailyMetab'),
                    },
                    {
                        type: 'decimal',
                        length: 8,
                        precision: 2,
                        key: 'maxOxygenIntake',
                        name: i18n.t('view.sportScore.maxOxygenIntake'),
                    },
                    {
                        type: 'input',
                        length: 255,
                        key: 'analysisResult',
                        name: i18n.t('view.sportScore.analysisResult'),
                    },
                    {
                        type: 'select',
                        key: 'state',
                        name: i18n.t('view.sportScore.state'),
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
                        type: 'number',
                        length: 11,
                        key: 'creUserId',
                        name: i18n.t('view.sportScore.creUserId'),
                    },
                    {
                        type: 'input',
                        length: 10,
                        key: 'creUserName',
                        name: i18n.t('view.sportScore.creUserName'),
                    },
                    {
                        type: 'datetime',
                        key: 'creTime',
                        name: i18n.t('view.sportScore.creTime'),
                    },
                    {
                        type: 'number',
                        length: 11,
                        key: 'updUserId',
                        name: i18n.t('view.sportScore.updUserId'),
                    },
                    {
                        type: 'input',
                        length: 10,
                        key: 'updUserName',
                        name: i18n.t('view.sportScore.updUserName'),
                    },
                    {
                        type: 'datetime',
                        key: 'updTime',
                        name: i18n.t('view.sportScore.updTime'),
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
                        name: i18n.t('view.sportScore.id'),
                    },
                    {
                        type: 'input',
                        length: 255,
                        key: 'scoreResult',
                        name: i18n.t('view.sportScore.scoreResult'),
                    },
                    {
                        type: 'select',
                        key: 'sex',
                        name: i18n.t('view.sportScore.sex'),
                        options: [
                            {
                                value: "0",
                                name: i18n.t('enum.sex.0'),
                            },
                            {
                                value: "1",
                                name: i18n.t('enum.sex.1'),
                            },
                        ],
                    },
                    {
                        type: 'decimal',
                        length: 8,
                        precision: 2,
                        key: 'height',
                        name: i18n.t('view.sportScore.height'),
                    },
                    {
                        type: 'decimal',
                        length: 8,
                        precision: 2,
                        key: 'weight',
                        name: i18n.t('view.sportScore.weight'),
                    },
                    {
                        type: 'number',
                        length: 4,
                        key: 'age',
                        name: i18n.t('view.sportScore.age'),
                    },
                    {
                        type: 'decimal',
                        length: 8,
                        precision: 2,
                        key: 'bmi',
                        name: i18n.t('view.sportScore.bmi'),
                    },
                    {
                        type: 'decimal',
                        length: 8,
                        precision: 2,
                        key: 'bodyFatRate',
                        name: i18n.t('view.sportScore.bodyFatRate'),
                    },
                    {
                        type: 'decimal',
                        length: 8,
                        precision: 2,
                        key: 'dailyMetab',
                        name: i18n.t('view.sportScore.dailyMetab'),
                    },
                    {
                        type: 'decimal',
                        length: 8,
                        precision: 2,
                        key: 'maxOxygenIntake',
                        name: i18n.t('view.sportScore.maxOxygenIntake'),
                    },
                    {
                        type: 'input',
                        length: 255,
                        key: 'analysisResult',
                        name: i18n.t('view.sportScore.analysisResult'),
                    },
                    {
                        type: 'select',
                        key: 'state',
                        name: i18n.t('view.sportScore.state'),
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
                        type: 'number',
                        length: 11,
                        key: 'creUserId',
                        name: i18n.t('view.sportScore.creUserId'),
                    },
                    {
                        type: 'input',
                        length: 10,
                        key: 'creUserName',
                        name: i18n.t('view.sportScore.creUserName'),
                    },
                    {
                        type: 'datetime',
                        key: 'creTime',
                        name: i18n.t('view.sportScore.creTime'),
                    },
                    {
                        type: 'number',
                        length: 11,
                        key: 'updUserId',
                        name: i18n.t('view.sportScore.updUserId'),
                    },
                    {
                        type: 'input',
                        length: 10,
                        key: 'updUserName',
                        name: i18n.t('view.sportScore.updUserName'),
                    },
                    {
                        type: 'datetime',
                        key: 'updTime',
                        name: i18n.t('view.sportScore.updTime'),
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
                saveSportScore(data).then((res) => {
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
                const res = await queryPageSportScore({...pagination, ...sort, ...this.filterData.listQuery});
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
                saveSportScore(data).then((res) => {
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
                saveBatchSportScore(this.batchDialogData.excelData.file).then((res) => {
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
                deleteBatchSportScore(this.selected).then((res) => {
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
            exportTemplateSportScore();
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
                    hasSelected ? exportChoseExcelSportScore(this.selected) : this.$message.error(EXPORT_CHOOSE_NULL_ERROR_MSG);
                    break;
                }
                case EXPORT_TYPE.QUERY:
                    this.$message.success(EXPORT_SUCCESS_MSG);
                    exportParamExcelSportScore({...this.filterData.listQuery});
                    break;
                case EXPORT_TYPE.ALL:
                    this.$message.success(EXPORT_SUCCESS_MSG);
                    exportExcelSportScore();
                    break;
                default:
                    this.$message.error(EXPORT_ERROR_MSG);
                    break;
            }
        }
    }
}
</script>
