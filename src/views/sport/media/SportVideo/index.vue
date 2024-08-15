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
                <image-upload
                    action-url="videoCoverImg"
                    :upload-auto-upload="true"
                    style="text-align: center"
                    @uploadSuccess="handleImageUploadSuccess(addDialogData.model, $event)">
                    <el-image v-if="addDialogData.model.coverUrl" :src="addDialogData.model.coverUrl | imageFileFilter"
                              class="dialog-upload-image"
                              lazy/>
                    <div v-else>
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">将图片封面拖到此处，或<em>点击上传</em>
                            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过1M</div>
                        </div>
                    </div>
                </image-upload>
                <video-upload
                    action-url="teaching"
                    :upload-auto-upload="true"
                    style="text-align: center"
                    @uploadChange="handleVideoUploadChange(addDialogData.model,$event)"
                    @uploadSuccess="handleAddVideoUploadSuccess(addDialogData.model, $event)">
                    <div v-if="addDialogData.model.url" class="video-wrapper">
                        <video ref="addVideoRef" :src="addDialogData.model.url" class="dialog-upload-video" controls
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
                <image-upload
                    action-url="videoCoverImg"
                    :upload-auto-upload="true"
                    style="text-align: center"
                    @uploadSuccess="handleImageUploadSuccess(modifyDialogData.model, $event)">
                    <el-image v-if="modifyDialogData.model.coverUrl"
                              :src="modifyDialogData.model.coverUrl | imageFileFilter"
                              class="dialog-upload-image"
                              lazy/>
                    <div v-else>
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">将图片封面拖到此处，或<em>点击上传</em>
                            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过1M</div>
                        </div>
                    </div>
                </image-upload>
                <video-upload
                    action-url="teaching"
                    :upload-auto-upload="true"
                    style="text-align: center"
                    @uploadChange="handleVideoUploadChange(modifyDialogData.model,$event)"
                    @uploadSuccess="handleAddVideoUploadSuccess(modifyDialogData.model, $event)">
                    <div v-if="modifyDialogData.model.url" class="video-wrapper">
                        <video ref="modifyVideoRef" :src="modifyDialogData.model.url" class="dialog-upload-video"
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
            <div>
                <div style="text-align: center">
                    <el-image
                        v-if="infoDialogData.model.coverUrl"
                        :src="infoDialogData.model.coverUrl | imageFileFilter"
                        class="dialog-upload-image"
                        style="max-width: 100%;max-height: 150px;"
                        lazy/>
                </div>
                <div style="text-align: center;max-width: 100%">
                    <video
                        ref="infoVideoRef"
                        v-if="infoDialogData.model.url" :src="infoDialogData.model.url"
                        style="max-width: 100%;max-height: 150px;"
                        controls
                        type="video/mp4"/>
                </div>
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
    deleteBatchSportVideo,
    deleteSportVideo,
    exportChoseExcelSportVideo,
    exportExcelSportVideo,
    exportParamExcelSportVideo,
    exportTemplateSportVideo,
    queryPageSportVideo,
    saveBatchSportVideo,
    saveSportVideo,
    selectSportVideo,
} from "@/api/sport-video-api";
import i18n from '@/common/lang';
import UploadExcelComponent from '@/components/UploadExcel/index.vue';
import BackToTop from "@/components/BackToTop";
import VideoUpload from "@/components/Upload/VideoUpload.vue";
import ImageUpload from "@/components/Upload/ImageUpload.vue";
import {CommonEnum} from "@/common/enum/CommonEnum";

export default {
    name: 'SportVideo',
    components: {ImageUpload, VideoUpload, searchPane, tablePane, MyDialog, UploadExcelComponent, BackToTop},
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
                        permission: '070101',
                        handleClick: this.queryPage,
                    },
                    addBtn: {
                        permission: '070102',
                        handleClick: () => {
                            this.addDialogData.visible = true
                        },
                    },
                    batchAddBtn: {
                        permission: '070103',
                        handleClick: () => {
                            this.batchDialogData.visible = true;
                        },
                    },
                    batchDeleteBtn: {
                        permission: '070105',
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
                        name: i18n.t('view.sportVideo.id'),
                    },
                    {
                        key: 'videoSize',
                        length: 16,
                        name: i18n.t('view.sportVideo.videoSize'),
                    },
                ],
                // 搜索输入框
                inputs: [
                    {
                        key: 'name',
                        length: 64,
                        name: i18n.t('view.sportVideo.name'),
                    },
                    {
                        key: 'url',
                        length: 255,
                        name: i18n.t('view.sportVideo.url'),
                    },
                    {
                        key: 'coverUrl',
                        length: 255,
                        name: i18n.t('view.sportVideo.coverUrl'),
                    },
                    {
                        key: 'time',
                        length: 255,
                        name: i18n.t('view.sportVideo.time'),
                    },
                    {
                        key: 'format',
                        length: 32,
                        name: i18n.t('view.sportVideo.format'),
                    },
                    {
                        key: 'content',
                        length: 255,
                        name: i18n.t('view.sportVideo.content'),
                    },
                ],
                // 搜索下拉框
                selects: [
                    {
                        key: 'type',
                        name: i18n.t('view.sportVideo.type'),
                        options: [
                            {
                                key: '0',
                                name: i18n.t('enum.sport.video.type.0'),
                            },
                            {
                                key: '1',
                                name: i18n.t('enum.sport.video.type.1'),
                            },
                        ]
                    },
                    {
                        key: 'state',
                        name: i18n.t('view.sportVideo.state'),
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
                    {
                        key: 'authorUserId',
                        name: i18n.t('view.sportVideo.authorUserId'),
                        dataSelect: {
                            url: "sys-user",
                            param: {
                                other: {
                                    roleId: CommonEnum.roleIdEnum.coach,
                                }
                            }
                        },
                    },
                    {
                        key: 'projectClassId',
                        name: i18n.t('view.sportVideo.projectClassName'),
                        dataSelect: {
                            url: 'sport-project-class',
                        },
                    },
                    {
                        key: 'creUserId',
                        name: i18n.t('view.sportVideo.creUserName'),
                        dataSelect: {
                            url: 'sys-user',
                        },
                    },
                    {
                        key: 'updUserId',
                        name: i18n.t('view.sportVideo.updUserName'),
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
                        name: i18n.t('view.sportVideo.creTime'),
                    },
                    {
                        key: 'updTime',
                        name: i18n.t('view.sportVideo.updTime'),
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
                        label: i18n.t('view.sportVideo.id'),
                        sortable: true,
                    },
                    {
                        key: 'projectClassName',
                        label: i18n.t('view.sportVideo.projectClassName'),
                        sortable: true,
                    },
                    {
                        key: 'name',
                        label: i18n.t('view.sportVideo.name'),
                        sortable: true,
                    },
                    {
                        key: 'type',
                        label: i18n.t('view.sportVideo.type'),
                        sortable: true,
                        isSpecial: function (value) {
                            switch (value) {
                                case "0":
                                    return i18n.t('enum.sport.video.type.0');
                                case "1":
                                    return i18n.t('enum.sport.video.type.1');
                                default:
                                    return i18n.t('enum.unknown');
                            }
                        },
                    },
                    {
                        isImage: true,
                        key: 'coverUrl',
                        label: i18n.t('view.sportVideo.coverImg'),
                        sortable: true,
                    },
                    {
                        key: 'url',
                        label: i18n.t('view.sportVideo.url'),
                        sortable: true,
                    },
                    {
                        key: 'time',
                        label: i18n.t('view.sportVideo.time'),
                        sortable: true,
                    },
                    {
                        key: 'videoSize',
                        label: i18n.t('view.sportVideo.videoSize'),
                        sortable: true,
                    },
                    {
                        key: 'format',
                        label: i18n.t('view.sportVideo.format'),
                        sortable: true,
                    },
                    {
                        key: 'authorUserId',
                        label: i18n.t('view.sportVideo.authorUserId'),
                        sortable: true,
                    },
                    {
                        key: 'content',
                        label: i18n.t('view.sportVideo.content'),
                        sortable: true,
                    },
                    {
                        key: 'state',
                        label: i18n.t('view.sportVideo.state'),
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
                        label: i18n.t('view.sportVideo.creUserName'),
                        sortable: true,
                    },
                    {
                        width: 160,
                        key: 'creTime',
                        label: i18n.t('view.sportVideo.creTime'),
                        sortable: true,
                    },
                    {
                        key: 'updUserName',
                        label: i18n.t('view.sportVideo.updUserName'),
                        sortable: true,
                    },
                    {
                        width: 160,
                        key: 'updTime',
                        label: i18n.t('view.sportVideo.updTime'),
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
                            permission: '070106',
                            handleRowClick: (index, row) => {
                                selectSportVideo({id: row.id}).then((res) => {
                                    this.infoDialogData.model = res.data
                                    this.infoDialogData.visible = true;
                                })
                            }
                        },
                        {
                            name: i18n.t('common.btn.modifyBtnName'),
                            type: 'primary',
                            permission: '070102,070106',
                            handleRowClick: (index, row) => {
                                selectSportVideo({id: row.id}).then((res) => {
                                    this.modifyDialogData.model = res.data
                                    this.modifyDialogData.visible = true;
                                })
                            }
                        },
                        {
                            name: i18n.t('common.btn.deleteBtnName'),
                            type: 'danger',
                            permission: '070104',
                            handleRowClick: (index, row) => {
                                this.$confirm(i18n.t('common.messageBox.delete.title') + row.name, i18n.t('common.messageBox.tips'), {
                                    confirmButtonText: i18n.t('common.btn.confirmBtnName'),
                                    cancelButtonText: i18n.t('common.btn.cancelBtnName'),
                                    type: 'warning'
                                }).then(() => {
                                    // 确定
                                    deleteSportVideo({id: row.id}).then((res) => {
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
                        permission: '070107',
                        handleClick: this.exportTemplate,
                    },
                ],
                toolDropDown: [
                    {
                        name: i18n.t('common.tool.batchExport.choose'),
                        key: 'export',
                        permission: '070108',
                        handleClick: this.batchExport,
                        options: [
                            {
                                permission: '070108',
                                key: 'choose',
                                name: i18n.t('common.tool.batchExport.choose'),
                            },
                            {
                                permission: '070109',
                                key: 'query',
                                name: i18n.t('common.tool.batchExport.query'),
                            },
                            {
                                permission: '070110',
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
                        key: 'projectClassId',
                        name: i18n.t('view.sportProjectClass.name'),
                        dataSelect: {
                            url: "sport-project-class"
                        },
                    },
                    {
                        type: 'input',
                        length: 64,
                        key: 'name',
                        name: i18n.t('view.sportVideo.name'),
                    },
                    {
                        type: 'input',
                        length: 255,
                        key: 'content',
                        name: i18n.t('view.sportVideo.content'),
                    },
                    {
                        type: 'select',
                        key: 'type',
                        name: i18n.t('view.sportVideo.type'),
                        options: [
                            {
                                value: "0",
                                name: i18n.t('enum.sport.video.type.0'),
                            },
                            {
                                value: "1",
                                name: i18n.t('enum.sport.video.type.1'),
                            },
                        ],
                    },
                    {
                        type: 'dataSelect',
                        key: 'authorUserId',
                        name: i18n.t('view.sportVideo.authorUserId'),
                        dataSelect: {
                            url: "sys-user",
                            param: {
                                other: {
                                    roleId: CommonEnum.roleIdEnum.coach,
                                }
                            }
                        },
                    },
                    {
                        type: 'select',
                        key: 'state',
                        name: i18n.t('view.sportVideo.state'),
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
                        disabled: true,
                        type: 'input',
                        length: 255,
                        key: 'url',
                        name: i18n.t('view.sportVideo.url'),
                    },
                    {
                        disabled: true,
                        type: 'input',
                        length: 255,
                        key: 'coverUrl',
                        name: i18n.t('view.sportVideo.coverUrl'),
                    },
                    {
                        disabled: true,
                        type: 'input',
                        length: 255,
                        key: 'time',
                        name: i18n.t('view.sportVideo.time'),
                    },
                    {
                        disabled: true,
                        type: 'input',
                        length: 16,
                        key: 'videoSize',
                        name: i18n.t('view.sportVideo.videoSize'),
                    },
                    {
                        disabled: true,
                        type: 'input',
                        length: 32,
                        key: 'format',
                        name: i18n.t('view.sportVideo.format'),
                    },
                ],
                model: {
                    filePath: ""
                },
                // 视频临时地址
                filePath: ""
            },
            // 修改
            modifyDialogData: {
                visible: false,
                modelItem: [
                    {
                        type: 'dataSelect',
                        key: 'projectClassId',
                        name: i18n.t('view.sportProjectClass.name'),
                        dataSelect: {
                            url: "sport-project-class"
                        },
                    },
                    {
                        type: 'number',
                        length: 11,
                        key: 'projectClassId',
                        name: i18n.t('view.sportVideo.projectClassId'),
                    },
                    {
                        type: 'input',
                        length: 64,
                        key: 'name',
                        name: i18n.t('view.sportVideo.name'),
                    },
                    {
                        type: 'input',
                        length: 255,
                        key: 'content',
                        name: i18n.t('view.sportVideo.content'),
                    },
                    {
                        type: 'select',
                        key: 'type',
                        name: i18n.t('view.sportVideo.type'),
                        options: [
                            {
                                value: "0",
                                name: i18n.t('enum.sport.video.type.0'),
                            },
                            {
                                value: "1",
                                name: i18n.t('enum.sport.video.type.1'),
                            },
                        ],
                    },
                    {
                        type: 'dataSelect',
                        key: 'authorUserId',
                        name: i18n.t('view.sportVideo.authorUserId'),
                        dataSelect: {
                            url: "sys-user",
                            param: {
                                other: {
                                    roleId: CommonEnum.roleIdEnum.coach,
                                }
                            }
                        },
                    },
                    {
                        type: 'select',
                        key: 'state',
                        name: i18n.t('view.sportVideo.state'),
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
                        disabled: true,
                        type: 'input',
                        length: 255,
                        key: 'url',
                        name: i18n.t('view.sportVideo.url'),
                    },
                    {
                        disabled: true,
                        type: 'input',
                        length: 255,
                        key: 'coverUrl',
                        name: i18n.t('view.sportVideo.coverUrl'),
                    },
                    {
                        disabled: true,
                        type: 'input',
                        length: 255,
                        key: 'time',
                        name: i18n.t('view.sportVideo.time'),
                    },
                    {
                        disabled: true,
                        type: 'input',
                        length: 16,
                        key: 'videoSize',
                        name: i18n.t('view.sportVideo.videoSize'),
                    },
                    {
                        disabled: true,
                        type: 'input',
                        length: 32,
                        key: 'format',
                        name: i18n.t('view.sportVideo.format'),
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
                        name: i18n.t('view.sportVideo.id'),
                    },
                    {
                        type: 'number',
                        length: 11,
                        key: 'projectClassId',
                        name: i18n.t('view.sportVideo.projectClassId'),
                    },
                    {
                        type: 'input',
                        length: 64,
                        key: 'name',
                        name: i18n.t('view.sportVideo.name'),
                    },
                    {
                        type: 'input',
                        length: 255,
                        key: 'content',
                        name: i18n.t('view.sportVideo.content'),
                    },
                    {
                        type: 'select',
                        key: 'type',
                        name: i18n.t('view.sportVideo.type'),
                        options: [
                            {
                                value: "0",
                                name: i18n.t('enum.sport.video.type.0'),
                            },
                            {
                                value: "1",
                                name: i18n.t('enum.sport.video.type.1'),
                            },
                        ],
                    },
                    {
                        type: 'dataSelect',
                        key: 'authorUserId',
                        name: i18n.t('view.sportVideo.authorUserId'),
                        dataSelect: {
                            url: "sys-user",
                            param: {
                                other: {
                                    roleId: CommonEnum.roleIdEnum.coach,
                                }
                            }
                        },
                    },
                    {
                        type: 'select',
                        key: 'state',
                        name: i18n.t('view.sportVideo.state'),
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
                        type: 'input',
                        length: 255,
                        key: 'url',
                        name: i18n.t('view.sportVideo.url'),
                    },
                    {
                        type: 'input',
                        length: 255,
                        key: 'coverUrl',
                        name: i18n.t('view.sportVideo.coverUrl'),
                    },
                    {
                        type: 'input',
                        length: 255,
                        key: 'time',
                        name: i18n.t('view.sportVideo.time'),
                    },
                    {
                        type: 'input',
                        length: 16,
                        key: 'videoSize',
                        name: i18n.t('view.sportVideo.videoSize'),
                    },
                    {
                        type: 'input',
                        length: 32,
                        key: 'format',
                        name: i18n.t('view.sportVideo.format'),
                    },
                    {
                        type: 'number',
                        length: 11,
                        key: 'creUserId',
                        name: i18n.t('view.sportVideo.creUserId'),
                    },
                    {
                        type: 'input',
                        length: 10,
                        key: 'creUserName',
                        name: i18n.t('view.sportVideo.creUserName'),
                    },
                    {
                        type: 'datetime',
                        key: 'creTime',
                        name: i18n.t('view.sportVideo.creTime'),
                    },
                    {
                        type: 'number',
                        length: 11,
                        key: 'updUserId',
                        name: i18n.t('view.sportVideo.updUserId'),
                    },
                    {
                        type: 'input',
                        length: 10,
                        key: 'updUserName',
                        name: i18n.t('view.sportVideo.updUserName'),
                    },
                    {
                        type: 'datetime',
                        key: 'updTime',
                        name: i18n.t('view.sportVideo.updTime'),
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
                saveSportVideo(data).then((res) => {
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
                const res = await queryPageSportVideo({...pagination, ...sort, ...this.filterData.listQuery});
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
                saveSportVideo(data).then((res) => {
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
                saveBatchSportVideo(this.batchDialogData.excelData.file).then((res) => {
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
                deleteBatchSportVideo(this.selected).then((res) => {
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
            exportTemplateSportVideo();
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
                    hasSelected ? exportChoseExcelSportVideo(this.selected) : this.$message.error(EXPORT_CHOOSE_NULL_ERROR_MSG);
                    break;
                }
                case EXPORT_TYPE.QUERY:
                    this.$message.success(EXPORT_SUCCESS_MSG);
                    exportParamExcelSportVideo({...this.filterData.listQuery});
                    break;
                case EXPORT_TYPE.ALL:
                    this.$message.success(EXPORT_SUCCESS_MSG);
                    exportExcelSportVideo();
                    break;
                default:
                    this.$message.error(EXPORT_ERROR_MSG);
                    break;
            }
        },

        /**
         *  图片上传
         */
        // 添加上传成功回调
        handleImageUploadSuccess(model, response, file, fileList) {
            if (response.code === 20000) {
                this.$set(model, "coverUrl", response.data)// 在视频可以播放时获取视频时长
            } else {
                this.$message.error(response.data)
            }
        },
        // 编辑上传成功回调
        handleModifyImageUploadSuccess(response, file, fileList) {
            if (response.code === 20000) {
                this.$set(this.modifyDialogData.model, "coverUrl", response.data)
            } else {
                this.$message.error(response.data)
            }
        },

        /**
         * 视频上传
         */
        // 添加上传视频变化回调
        handleVideoUploadChange(model, file, fileList) {
            // 视频上传
            this.$set(model, "url", URL.createObjectURL(file))
        },
        // 添加上传成功回调
        handleAddVideoUploadSuccess(model, response, file, fileList) {
            if (response.code === 20000) {
                const data = response.data
                this.$set(model, "url", data.filePath)
                this.$set(model, "videoSize", data.fileSize)
                this.$set(model, "format", data.fileType)
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

<style scoped>
.image-container,
.video-container {
    text-align: center;
    height: 300px; /* 优先高度，可根据需要调整 */
    display: flex;
    justify-content: center;
    align-items: center;
}

.dialog-upload-image,
.video-player {
    max-width: 100%;
    max-height: 100%;
}
</style>
