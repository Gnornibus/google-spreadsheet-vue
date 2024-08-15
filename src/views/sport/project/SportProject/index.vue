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
            @close="queryPage($refs.addVideoRef)"
            @submit="add">
            <template>
                <video-upload
                    action-url="teaching"
                    :upload-auto-upload="true"
                    style="text-align: center"
                    @uploadChange="handleVideoUploadChange(addDialogData.model,$event)"
                    @uploadSuccess="handleAddVideoUploadSuccess(addDialogData.model, $event)">
                    <div v-if="addDialogData.model.projectVideoUrl" class="video-wrapper">
                        <video ref="addVideoRef" :src="addDialogData.model.projectVideoUrl" class="dialog-upload-video"
                               controls
                               type="video/mp4"
                               @canplay="getVideoTime(addDialogData.model,$refs.addVideoRef)"/>
                        <div class="reselect-button">
                            重新选择
                        </div>
                    </div>
                    <div v-else class="el-upload__text">
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">将视频文件拖到此处，或<em>点击上传</em>
                            <div slot="tip" class="el-upload__tip">只能上传MP4文件，且不超过50MB</div>
                        </div>
                    </div>
                </video-upload>
            </template>
        </my-dialog>
        <my-dialog
            :model="modifyDialogData.model"
            :modelItem="modifyDialogData.modelItem"
            :title="$t('common.dialog.dialogModifyTitle')"
            :visible.sync="modifyDialogData.visible"
            :width="dialogWidth"
            @close="queryPage($refs.modifyVideoRef)"
            @submit="modify">
            <template>
                <video-upload
                    action-url="teaching"
                    :upload-auto-upload="true"
                    style="text-align: center"
                    @uploadChange="handleVideoUploadChange(modifyDialogData.model,$event)"
                    @uploadSuccess="handleAddVideoUploadSuccess(modifyDialogData.model, $event)">
                    <div v-if="modifyDialogData.model.projectVideoUrl" class="video-wrapper">
                        <video ref="modifyVideoRef" :src="modifyDialogData.model.projectVideoUrl"
                               class="dialog-upload-video"
                               controls
                               type="video/mp4"
                               @canplay="getVideoTime(modifyDialogData.model,$refs.modifyVideoRef)"/>
                        <div class="reselect-button">
                            重新选择
                        </div>
                    </div>
                    <div v-else class="el-upload__text">
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">将视频文件拖到此处，或<em>点击上传</em>
                            <div slot="tip" class="el-upload__tip">只能上传MP4文件，且不超过50MB</div>
                        </div>
                    </div>
                </video-upload>
            </template>
        </my-dialog>
        <my-dialog
            :componentsDisabled="true"
            :model="infoDialogData.model"
            :modelItem="infoDialogData.modelItem"
            :title="$t('common.dialog.dialogInfoTitle')"
            :visible.sync="infoDialogData.visible"
            :required="false"
            :width="dialogWidth"
            @close="queryPage($refs.infoVideoRef)"
            @submit="()=>{this.infoDialogData.visible=false}">
            <div style="text-align: center;max-width: 100%">
                <video
                    ref="infoVideoRef"
                    v-if="infoDialogData.model.projectVideoUrl" :src="infoDialogData.model.projectVideoUrl"
                    style="max-width: 100%;max-height: 150px;"
                    controls
                    type="video/mp4"/>
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
import searchPane from '@/components/SearchPane';
import tablePane from '@/components/TablePane';
import MyDialog from '@/components/Dialog';
import {
    deleteBatchSportProject,
    deleteSportProject,
    exportChoseExcelSportProject,
    exportExcelSportProject,
    exportParamExcelSportProject,
    exportTemplateSportProject,
    queryPageSportProject,
    saveBatchSportProject,
    saveSportProject,
    selectSportProject,
} from "@/api/sport-project-api";
import i18n from '@/common/lang';
import UploadExcelComponent from '@/components/UploadExcel/index.vue';
import BackToTop from "@/components/BackToTop";
import {CommonEnum} from "@/common/enum/CommonEnum";
import VideoUpload from "@/components/Upload/VideoUpload.vue";

export default {
    name: 'SportProject',
    components: {VideoUpload, searchPane, tablePane, MyDialog, UploadExcelComponent, BackToTop},
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
                        permission: '050201',
                        handleClick: this.queryPage,
                    },
                    addBtn: {
                        permission: '050202',
                        handleClick: () => {
                            this.$set(this.addDialogData.model, "state", CommonEnum.enableDisable.enable)
                            this.addDialogData.visible = true
                        },
                    },
                    batchAddBtn: {
                        permission: '050203',
                        handleClick: () => {
                            this.batchDialogData.visible = true;
                        },
                    },
                    batchDeleteBtn: {
                        permission: '050205',
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
                        name: i18n.t('view.sportProject.id'),
                    },
                ],
                // 搜索输入框
                inputs: [
                    {
                        key: 'name',
                        length: 16,
                        name: i18n.t('view.sportProject.name'),
                    },
                    {
                        key: 'unit',
                        length: 4,
                        name: i18n.t('view.sportProject.unit'),
                    },
                    {
                        key: 'introduce',
                        length: 255,
                        name: i18n.t('view.sportProject.introduce'),
                    },
                ],
                // 搜索下拉框
                selects: [
                    {
                        key: 'projectClassId',
                        name: i18n.t('view.sportProject.projectClassName'),
                        dataSelect: {
                            url: 'sport-project-class',
                        },
                    },
                    {
                        key: 'parentId',
                        name: i18n.t('view.sportProject.parentName'),
                        dataSelect: {
                            url: 'sport-project',
                        },
                    },
                    {
                        key: 'state',
                        name: i18n.t('view.sportProject.state'),
                        dictSelect: {
                            dictCode: 'sys.enable.disable'
                        }
                    },
                    {
                        key: 'creUserId',
                        name: i18n.t('view.sportProject.creUserName'),
                        dataSelect: {
                            url: 'sys-user',
                        },
                    },
                    {
                        key: 'updUserId',
                        name: i18n.t('view.sportProject.updUserName'),
                        dataSelect: {
                            url: 'sys-user',
                        },
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
                        name: i18n.t('view.sportProject.creTime'),
                    },
                    {
                        key: 'updTime',
                        name: i18n.t('view.sportProject.updTime'),
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
                        label: i18n.t('view.sportProject.id'),
                        sortable: true,
                    },
                    {
                        key: 'name',
                        label: i18n.t('view.sportProject.name'),
                        sortable: true,
                    },
                    {
                        key: 'projectClassName',
                        label: i18n.t('view.sportProject.projectClassName'),
                        sortable: true,
                    },
                    {
                        key: 'parentName',
                        label: i18n.t('view.sportProject.parentName'),
                        sortable: true,
                    },
                    {
                        key: 'unit',
                        label: i18n.t('view.sportProject.unit'),
                        sortable: true,
                    },
                    {
                        key: 'introduce',
                        width: 300,
                        label: i18n.t('view.sportProject.introduce'),
                        sortable: true,
                    },
                    {
                        key: 'state',
                        label: i18n.t('view.sportProject.state'),
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
                        key: 'creUserName',
                        label: i18n.t('view.sportProject.creUserName'),
                        sortable: true,
                    },
                    {
                        width: 160,
                        key: 'creTime',
                        label: i18n.t('view.sportProject.creTime'),
                        sortable: true,
                    },
                    {
                        key: 'updUserName',
                        label: i18n.t('view.sportProject.updUserName'),
                        sortable: true,
                    },
                    {
                        width: 160,
                        key: 'updTime',
                        label: i18n.t('view.sportProject.updTime'),
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
                            permission: '050206',
                            handleRowClick: (index, row) => {
                                selectSportProject({id: row.id}).then((res) => {
                                    this.infoDialogData.model = res.data
                                    this.infoDialogData.visible = true;
                                })
                            }
                        },
                        {
                            name: i18n.t('common.btn.modifyBtnName'),
                            type: 'primary',
                            permission: '050202,050106',
                            handleRowClick: (index, row) => {
                                selectSportProject({id: row.id}).then((res) => {
                                    this.$set(this.modifyDialogData.model, "state", CommonEnum.enableDisable.enable)
                                    this.modifyDialogData.model = res.data
                                    this.modifyDialogData.visible = true;
                                })
                            }
                        },
                        {
                            name: i18n.t('common.btn.deleteBtnName'),
                            type: 'danger',
                            permission: '050204',
                            handleRowClick: (index, row) => {
                                this.$confirm(i18n.t('common.messageBox.delete.title') + row.name, i18n.t('common.messageBox.tips'), {
                                    confirmButtonText: i18n.t('common.btn.confirmBtnName'),
                                    cancelButtonText: i18n.t('common.btn.cancelBtnName'),
                                    type: 'warning'
                                }).then(() => {
                                    // 确定
                                    deleteSportProject({id: row.id}).then((res) => {
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
                        permission: '050207',
                        handleClick: this.exportTemplate,
                    },
                ],
                toolDropDown: [
                    {
                        name: i18n.t('common.tool.batchExport.choose'),
                        key: 'export',
                        permission: '050208',
                        handleClick: this.batchExport,
                        options: [
                            {
                                permission: '050208',
                                key: 'choose',
                                name: i18n.t('common.tool.batchExport.choose'),
                            },
                            {
                                permission: '050209',
                                key: 'query',
                                name: i18n.t('common.tool.batchExport.query'),
                            },
                            {
                                permission: '050210',
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
                        length: 16,
                        key: 'name',
                        name: i18n.t('view.sportProject.name'),
                    },
                    {
                        type: 'dataSelect',
                        key: 'projectClassId',
                        name: i18n.t('view.sportProject.projectClassName'),
                        dataSelect: {
                            url: 'sport-project-class'
                        }
                    },
                    {
                        required: false,
                        type: 'dataSelect',
                        key: 'parentId',
                        name: i18n.t('view.sportProject.parentName'),
                        dataSelect: {
                            url: 'sport-project'
                        }
                    },
                    {
                        type: 'input',
                        length: 4,
                        key: 'unit',
                        name: i18n.t('view.sportProject.unit'),
                    },
                    {
                        disabled: true,
                        required: false,
                        type: 'input',
                        length: 255,
                        key: 'projectVideoUrl',
                        name: i18n.t('view.sportProject.projectVideoUrl'),
                    },
                    {
                        required: false,
                        type: 'input',
                        length: 255,
                        key: 'introduce',
                        name: i18n.t('view.sportProject.introduce'),
                    },
                    {
                        type: 'select',
                        key: 'state',
                        name: i18n.t('view.sportProject.state'),
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
                        name: i18n.t('view.sportProject.id'),
                    },
                    {
                        type: 'input',
                        length: 16,
                        key: 'name',
                        name: i18n.t('view.sportProject.name'),
                    },
                    {
                        type: 'dataSelect',
                        key: 'projectClassId',
                        name: i18n.t('view.sportProject.projectClassName'),
                        dataSelect: {
                            url: 'sport-project-class'
                        }
                    },
                    {
                        required: false,
                        type: 'dataSelect',
                        key: 'parentId',
                        name: i18n.t('view.sportProject.parentName'),
                        dataSelect: {
                            url: 'sport-project'
                        }
                    },
                    {
                        type: 'input',
                        length: 4,
                        key: 'unit',
                        name: i18n.t('view.sportProject.unit'),
                    },
                    {
                        disabled: true,
                        required: false,
                        type: 'input',
                        length: 255,
                        key: 'projectVideoUrl',
                        name: i18n.t('view.sportProject.projectVideoUrl'),
                    },
                    {
                        required: false,
                        type: 'input',
                        length: 255,
                        key: 'introduce',
                        name: i18n.t('view.sportProject.introduce'),
                    },
                    {
                        type: 'select',
                        key: 'state',
                        name: i18n.t('view.sportProject.state'),
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
                        type: 'number',
                        length: 11,
                        key: 'id',
                        name: i18n.t('view.sportProject.id'),
                    },
                    {
                        type: 'input',
                        length: 16,
                        key: 'name',
                        name: i18n.t('view.sportProject.name'),
                    },
                    {
                        type: 'dataSelect',
                        key: 'projectClassId',
                        name: i18n.t('view.sportProject.projectClassName'),
                        dataSelect: {
                            url: 'sport-project-class'
                        }
                    },
                    {
                        type: 'dataSelect',
                        key: 'parentId',
                        name: i18n.t('view.sportProject.parentName'),
                        dataSelect: {
                            url: 'sport-project'
                        }
                    },
                    {
                        type: 'input',
                        length: 4,
                        key: 'unit',
                        name: i18n.t('view.sportProject.unit'),
                    },
                    {
                        type: 'input',
                        length: 255,
                        key: 'projectVideoUrl',
                        name: i18n.t('view.sportProject.projectVideoUrl'),
                    },
                    {
                        type: 'input',
                        length: 255,
                        key: 'introduce',
                        name: i18n.t('view.sportProject.introduce'),
                    },
                    {
                        type: 'select',
                        key: 'state',
                        name: i18n.t('view.sportProject.state'),
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
                        name: i18n.t('view.sportProject.creUserId'),
                    },
                    {
                        type: 'input',
                        length: 10,
                        key: 'creUserName',
                        name: i18n.t('view.sportProject.creUserName'),
                    },
                    {
                        type: 'datetime',
                        key: 'creTime',
                        name: i18n.t('view.sportProject.creTime'),
                    },
                    {
                        type: 'number',
                        length: 11,
                        key: 'updUserId',
                        name: i18n.t('view.sportProject.updUserId'),
                    },
                    {
                        type: 'input',
                        length: 10,
                        key: 'updUserName',
                        name: i18n.t('view.sportProject.updUserName'),
                    },
                    {
                        type: 'datetime',
                        key: 'updTime',
                        name: i18n.t('view.sportProject.updTime'),
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
                saveSportProject(data).then((res) => {
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
        async queryPage(refs) {
            // 如果视频正在播放，则暂停视频
            if (refs && typeof refs === 'object') {
                // 检查refs对象是否具有paused属性
                if (refs.paused !== undefined) {
                    // 如果paused属性存在，则可以执行相应的操作
                    if (!refs.paused) {
                        refs.pause();
                    }
                }
            }
            this.dataSource.loading = true;
            try {
                const {pagination, sort} = this.dataSource;
                const res = await queryPageSportProject({...pagination, ...sort, ...this.filterData.listQuery});
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
                saveSportProject(data).then((res) => {
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
                saveBatchSportProject(this.batchDialogData.excelData.file).then((res) => {
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
                deleteBatchSportProject(this.selected).then((res) => {
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
            exportTemplateSportProject();
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
                    hasSelected ? exportChoseExcelSportProject(this.selected) : this.$message.error(EXPORT_CHOOSE_NULL_ERROR_MSG);
                    break;
                }
                case EXPORT_TYPE.QUERY:
                    this.$message.success(EXPORT_SUCCESS_MSG);
                    exportParamExcelSportProject({...this.filterData.listQuery});
                    break;
                case EXPORT_TYPE.ALL:
                    this.$message.success(EXPORT_SUCCESS_MSG);
                    exportExcelSportProject();
                    break;
                default:
                    this.$message.error(EXPORT_ERROR_MSG);
                    break;
            }
        },

        /**
         * 视频上传
         */
        // 添加上传视频变化回调
        handleVideoUploadChange(model, file, fileList) {
            // 视频上传
            this.$set(model, "projectVideoUrl", URL.createObjectURL(file))
        },
        // 添加上传成功回调
        handleAddVideoUploadSuccess(model, response, file, fileList) {
            if (response.code === 20000) {
                const data = response.data
                this.$set(model, "projectVideoUrl", data.filePath)
            } else {
                this.$message.error(response.data)
            }
        },
        // 格式化时间时长
        formattedDuration(time) {
            const hours = Math.floor(time / 3600);
            const minutes = Math.floor((time % 3600) / 60);
            const seconds = Math.ceil(time % 60);

            const formattedHours = hours < 10 ? "0" + hours : hours;
            const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
            const formattedSeconds = seconds < 10 ? "0" + seconds : seconds;

            return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
        },
        // 获取视频时长
        getVideoTime(model, refs) {
            const videoElement = refs;
            if (videoElement && !isNaN(videoElement.duration)) {
                this.$set(model, "time", this.formattedDuration(videoElement.duration))
            } else {
                // 如果获取时长为NaN，可以等待视频加载完成后再次尝试获取
                videoElement.addEventListener('loadedmetadata', () => {
                    this.$set(model, "time", this.formattedDuration(videoElement.duration))
                });
            }
        },
    }
}
</script>
