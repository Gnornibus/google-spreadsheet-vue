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
                action-url="avatar"
                :upload-auto-upload="true"
                style="text-align: center"
                @uploadSuccess="handleAddUploadSuccess">
                <el-image v-if="addDialogData.model.avatar" :src="addDialogData.model.avatar | imageFileFilter"
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
                action-url="avatar"
                :upload-auto-upload="true"
                style="text-align: center"
                @uploadSuccess="handleModifyUploadSuccess">
                <el-image v-if="modifyDialogData.model.avatar" :src="modifyDialogData.model.avatar | imageFileFilter"
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
            @submit="()=>{this.infoDialogData.visible=false}">
            <div v-if="infoDialogData.model.avatar" style="text-align: center;">
                <el-image :preview-src-list="[infoPreviewSrcList]"
                          :src="infoDialogData.model.avatar | imageFileFilter"
                          class="dialog-upload-image" lazy/>
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
    deleteBatchSysUser,
    deleteSysUser,
    exportChoseExcelSysUser,
    exportExcelSysUser,
    exportParamExcelSysUser,
    exportTemplateSysUser,
    queryPageSysUser,
    saveBatchSysUser,
    saveSysUser,
    selectSysUser,
} from "@/api/sys-user-api";
import i18n from '@/common/lang';
import UploadExcelComponent from '@/components/UploadExcel/index.vue';
import BackToTop from "@/components/BackToTop";
import ImageUpload from "@/components/Upload/ImageUpload";
import {resetPwd} from "@/api/sys-uaa-api";

export default {
    name: 'SysUser',
    components: {ImageUpload, searchPane, tablePane, MyDialog, UploadExcelComponent, BackToTop},
    // 重构图片详情
    computed: {
        infoPreviewSrcList() {
            // 遍历图片列表，对每个图片应用过滤器
            return this.$options.filters.imageFileFilter(this.infoDialogData.model.avatar);
        },
    },
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
                        permission: '030101',
                        handleClick: this.queryPage,
                    },
                    addBtn: {
                        permission: '030102',
                        handleClick: () => {
                            // 初始化角色下拉框
                            this.addDialogData.visible = true
                        },
                    },
                    batchAddBtn: {
                        permission: '030103',
                        handleClick: () => {
                            this.batchDialogData.visible = true;
                        },
                    },
                    batchDeleteBtn: {
                        permission: '030105',
                        handleClick: this.batchDelete,
                    },
                },

                // 数字输入框
                numbers: [
                    {
                        key: 'id',
                        length: 11,
                        name: i18n.t('view.sysUser.id'),
                    },
                    {
                        key: 'loginCount',
                        length: 10,
                        name: i18n.t('view.sysUser.loginCount'),
                    },
                ],
                // 搜索输入框
                inputs: [
                    {
                        key: 'openId',
                        length: 64,
                        name: i18n.t('view.sysUser.account'),
                    },
                    {
                        key: 'unionId',
                        length: 64,
                        name: i18n.t('view.sysUser.account'),
                    },
                    {
                        key: 'account',
                        length: 64,
                        name: i18n.t('view.sysUser.account'),
                    },
                    {
                        key: 'name',
                        length: 10,
                        name: i18n.t('view.sysUser.name'),
                    },
                    {
                        key: 'nickName',
                        length: 10,
                        name: i18n.t('view.sysUser.nickName'),
                    },
                    {
                        key: 'avatar',
                        length: 255,
                        name: i18n.t('view.sysUser.avatar'),
                    },
                    {
                        key: 'mobile',
                        length: 11,
                        name: i18n.t('view.sysUser.mobile'),
                    },
                    {
                        key: 'email',
                        length: 64,
                        name: i18n.t('view.sysUser.email'),
                    },
                    {
                        key: 'cardId',
                        length: 18,
                        name: i18n.t('view.sysUser.cardId'),
                    },
                    {
                        key: 'loginIpAddress',
                        length: 20,
                        name: i18n.t('view.sysUser.loginIpAddress'),
                    },
                    {
                        key: 'oldLoginIpAddress',
                        length: 20,
                        name: i18n.t('view.sysUser.oldLoginIpAddress'),
                    },
                ],
                // 搜索下拉框
                selects: [
                    {
                        key: 'sex',
                        name: i18n.t('view.sysUser.sex'),
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
                        name: i18n.t('view.sysUser.state'),
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
                        key: 'roleId',
                        name: i18n.t('view.sysRole.name'),
                        dataSelect: {
                            url: 'sys-role',
                        },
                    },
                    {
                        key: 'creUserId',
                        name: i18n.t('view.sysUser.creUserName'),
                        dataSelect: {
                            url: 'sys-user',
                        },
                    },
                    {
                        key: 'updUserId',
                        name: i18n.t('view.sysUser.updUserName'),
                        dataSelect: {
                            url: 'sys-user',
                        },
                    },
                ],

                // 搜索日期框
                datePickers: [
                    {
                        key: 'memberExpiryDate',
                        name: i18n.t('view.sysUser.memberExpiryDate'),
                    },
                ],
                // 搜索日期及时间框
                dateTimePickers: [
                    {
                        key: 'loginTime',
                        name: i18n.t('view.sysUser.loginTime'),
                    },
                    {
                        key: 'oldLoginTime',
                        name: i18n.t('view.sysUser.oldLoginTime'),
                    },
                    {
                        key: 'creTime',
                        name: i18n.t('view.sysUser.creTime'),
                    },
                    {
                        key: 'updTime',
                        name: i18n.t('view.sysUser.updTime'),
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
                        label: i18n.t('view.sysUser.id'),
                        sortable: true,
                    },
                    {
                        key: 'roleName',
                        label: i18n.t('view.sysUser.roleName'),
                        sortable: true,
                    },
                    {
                        key: 'account',
                        label: i18n.t('view.sysUser.account'),
                        sortable: true,
                    },
                    {
                        key: 'name',
                        label: i18n.t('view.sysUser.name'),
                        sortable: true,
                    },
                    {
                        key: 'nickName',
                        label: i18n.t('view.sysUser.nickName'),
                        sortable: true,
                    },
                    {
                        key: 'sex',
                        label: i18n.t('view.sysUser.sex'),
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
                        key: 'avatar',
                        label: i18n.t('view.sysUser.avatar'),
                        sortable: true,
                        isImage: true,
                    },
                    {
                        key: 'memberExpiryDate',
                        label: i18n.t('view.sysUser.memberExpiryDate'),
                        sortable: true
                    },
                    {
                        key: 'state',
                        label: i18n.t('view.sysUser.state'),
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
                        key: 'mobile',
                        label: i18n.t('view.sysUser.mobile'),
                        sortable: true,
                    },
                    {
                        key: 'email',
                        label: i18n.t('view.sysUser.email'),
                        sortable: true,
                    },
                    {
                        key: 'cardId',
                        label: i18n.t('view.sysUser.cardId'),
                        sortable: true,
                    },
                    {
                        key: 'loginCount',
                        label: i18n.t('view.sysUser.loginCount'),
                        sortable: true,
                    },
                    {
                        key: 'loginIpAddress',
                        label: i18n.t('view.sysUser.loginIpAddress'),
                        sortable: true,
                    },
                    {
                        key: 'oldLoginIpAddress',
                        label: i18n.t('view.sysUser.oldLoginIpAddress'),
                        sortable: true,
                    },
                    {
                        width: 160,
                        key: 'loginTime',
                        label: i18n.t('view.sysUser.loginTime'),
                        sortable: true,
                    },
                    {
                        width: 160,
                        key: 'oldLoginTime',
                        label: i18n.t('view.sysUser.oldLoginTime'),
                        sortable: true,
                    },
                    {
                        key: 'creUserName',
                        label: i18n.t('view.sysUser.creUserName'),
                        sortable: true,
                    },
                    {
                        width: 160,
                        key: 'creTime',
                        label: i18n.t('view.sysUser.creTime'),
                        sortable: true,
                    },
                    {
                        key: 'updUserName',
                        label: i18n.t('view.sysUser.updUserName'),
                        sortable: true,
                    },
                    {
                        width: 160,
                        key: 'updTime',
                        label: i18n.t('view.sysUser.updTime'),
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
                    width: 80 * 4,
                    data: [
                        {
                            name: i18n.t('common.btn.infoBtnName'),
                            type: 'primary',
                            permission: '030106',
                            handleRowClick: (index, row) => {
                                // 初始化角色下拉框
                                selectSysUser({id: row.id}).then((res) => {
                                    this.infoDialogData.model = res.data
                                    this.infoDialogData.visible = true;
                                })
                            }
                        },
                        {
                            name: i18n.t('common.btn.modifyBtnName'),
                            type: 'primary',
                            permission: '030102,030106',
                            handleRowClick: (index, row) => {
                                // 初始化角色下拉框
                                selectSysUser({id: row.id}).then((res) => {
                                    this.modifyDialogData.model = res.data
                                    this.modifyDialogData.visible = true;
                                })
                            }
                        },
                        {
                            name: i18n.t('common.btn.resetPwdBtnName'),
                            type: 'primary',
                            permission: '030111',
                            handleRowClick: (index, row) => {
                                this.resetPwd(row.id)
                            },
                        },
                        {
                            name: i18n.t('common.btn.deleteBtnName'),
                            type: 'danger',
                            permission: '030104',
                            handleRowClick: (index, row) => {
                                this.$confirm(i18n.t('common.messageBox.delete.title') + row.name, i18n.t('common.messageBox.tips'), {
                                    confirmButtonText: i18n.t('common.btn.confirmBtnName'),
                                    cancelButtonText: i18n.t('common.btn.cancelBtnName'),
                                    type: 'warning'
                                }).then(() => {
                                    // 确定
                                    deleteSysUser({id: row.id}).then((res) => {
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
                        permission: '030107',
                        handleClick: this.exportTemplate,
                    },
                ],
                toolDropDown: [
                    {
                        name: i18n.t('common.tool.batchExport.choose'),
                        key: 'export',
                        permission: '030108',
                        handleClick: this.batchExport,
                        options: [
                            {
                                permission: '030108',
                                key: 'choose',
                                name: i18n.t('common.tool.batchExport.choose'),
                            },
                            {
                                permission: '030109',
                                key: 'query',
                                name: i18n.t('common.tool.batchExport.query'),
                            },
                            {
                                permission: '030110',
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
                        key: 'roleId',
                        name: i18n.t('view.sysUser.roleName'),
                        dataSelect: {
                            url: 'sys-role',
                        },
                    },
                    {
                        type: 'input',
                        length: 64,
                        key: 'account',
                        name: i18n.t('view.sysUser.account'),
                    },
                    {
                        type: 'input',
                        length: 10,
                        key: 'name',
                        name: i18n.t('view.sysUser.name'),
                    },
                    {
                        required: false,
                        disabled: true,
                        type: 'input',
                        length: 32,
                        key: 'nickName',
                        name: i18n.t('view.sysUser.name'),
                    },
                    {
                        type: 'dictSelect',
                        key: 'sex',
                        name: i18n.t('view.sysUser.sex'),
                        dictSelect: {
                            dictCode: "sys.sex"
                        },
                    },
                    {
                        required: false,
                        disabled: true,
                        type: 'input',
                        length: 255,
                        key: 'avatar',
                        name: i18n.t('view.sysUser.avatar'),
                    },
                    {
                        type: 'select',
                        key: 'state',
                        name: i18n.t('view.sysUser.state'),
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
                        required: false,
                        type: 'input',
                        length: 11,
                        key: 'mobile',
                        name: i18n.t('view.sysUser.mobile'),
                    },
                    {
                        required: false,
                        type: 'input',
                        length: 64,
                        key: 'email',
                        name: i18n.t('view.sysUser.email'),
                    },
                    {
                        required: false,
                        type: 'input',
                        length: 18,
                        key: 'cardId',
                        name: i18n.t('view.sysUser.cardId'),
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
                        name: i18n.t('view.sysUser.id'),
                    },
                    {
                        type: 'dataSelect',
                        key: 'roleId',
                        name: i18n.t('view.sysUser.roleName'),
                        dataSelect: {
                            url: 'sys-role',
                        },
                    },
                    {
                        type: 'input',
                        length: 32,
                        key: 'nickName',
                        name: i18n.t('view.sysUser.name'),
                    },
                    {
                        type: 'dictSelect',
                        key: 'sex',
                        name: i18n.t('view.sysUser.sex'),
                        dictSelect: {
                            dictCode: "sys.sex"
                        },
                    },
                    {
                        disabled: true,
                        type: 'input',
                        length: 255,
                        key: 'avatar',
                        name: i18n.t('view.sysUser.avatar'),
                    },
                    {
                        type: 'select',
                        key: 'state',
                        name: i18n.t('view.sysUser.state'),
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
                        required: false,
                        type: 'input',
                        length: 11,
                        key: 'mobile',
                        name: i18n.t('view.sysUser.mobile'),
                    },
                    {
                        required: false,
                        type: 'input',
                        length: 64,
                        key: 'email',
                        name: i18n.t('view.sysUser.email'),
                    },
                    {
                        required: false,
                        type: 'input',
                        length: 18,
                        key: 'cardId',
                        name: i18n.t('view.sysUser.cardId'),
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
                        name: i18n.t('view.sysUser.id'),
                    },
                    {
                        type: 'dataSelect',
                        key: 'roleId',
                        name: i18n.t('view.sysUser.roleName'),
                        dataSelect: {
                            url: "sys-role"
                        }
                    },
                    {
                        type: 'input',
                        length: 128,
                        key: 'openId',
                        name: i18n.t('view.sysUser.openId'),
                    },
                    {
                        type: 'input',
                        length: 128,
                        key: 'unionId',
                        name: i18n.t('view.sysUser.unionId'),
                    },
                    {
                        type: 'input',
                        length: 128,
                        key: 'sessionKey',
                        name: i18n.t('view.sysUser.sessionKey'),
                    },
                    {
                        type: 'input',
                        length: 64,
                        key: 'account',
                        name: i18n.t('view.sysUser.account'),
                    },
                    {
                        type: 'input',
                        length: 10,
                        key: 'name',
                        name: i18n.t('view.sysUser.name'),
                    },
                    {
                        type: 'input',
                        length: 32,
                        key: 'nickName',
                        name: i18n.t('view.sysUser.name'),
                    },
                    {
                        type: 'select',
                        key: 'sex',
                        name: i18n.t('view.sysUser.sex'),
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
                        type: 'input',
                        length: 255,
                        key: 'avatar',
                        name: i18n.t('view.sysUser.avatar'),
                    },
                    {
                        type: 'date',
                        key: 'memberExpiryDate',
                        name: i18n.t('view.sysUser.memberExpiryDate'),
                    },
                    {
                        type: 'select',
                        key: 'state',
                        name: i18n.t('view.sysUser.state'),
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
                        length: 11,
                        key: 'mobile',
                        name: i18n.t('view.sysUser.mobile'),
                    },
                    {
                        type: 'input',
                        length: 64,
                        key: 'email',
                        name: i18n.t('view.sysUser.email'),
                    },
                    {
                        type: 'input',
                        length: 18,
                        key: 'cardId',
                        name: i18n.t('view.sysUser.cardId'),
                    },
                    {
                        type: 'number',
                        length: 10,
                        key: 'loginCount',
                        name: i18n.t('view.sysUser.loginCount'),
                    },
                    {
                        type: 'input',
                        length: 20,
                        key: 'loginIpAddress',
                        name: i18n.t('view.sysUser.loginIpAddress'),
                    },
                    {
                        type: 'input',
                        length: 20,
                        key: 'oldLoginIpAddress',
                        name: i18n.t('view.sysUser.oldLoginIpAddress'),
                    },
                    {
                        type: 'datetime',
                        key: 'loginTime',
                        name: i18n.t('view.sysUser.loginTime'),
                    },
                    {
                        type: 'datetime',
                        key: 'oldLoginTime',
                        name: i18n.t('view.sysUser.oldLoginTime'),
                    },
                    {
                        type: 'number',
                        length: 11,
                        key: 'creUserName',
                        name: i18n.t('view.sysUser.creUserName'),
                    },
                    {
                        type: 'datetime',
                        key: 'creTime',
                        name: i18n.t('view.sysUser.creTime'),
                    },
                    {
                        type: 'number',
                        length: 11,
                        key: 'updUserName',
                        name: i18n.t('view.sysUser.updUserName'),
                    },
                    {
                        type: 'datetime',
                        key: 'updTime',
                        name: i18n.t('view.sysUser.updTime'),
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
                saveSysUser(data).then((res) => {
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
        // 重置密码
        resetPwd(id) {
            this.$confirm(i18n.t('common.messageBox.resetPwd.title'), i18n.t('common.messageBox.tips'), {
                confirmButtonText: i18n.t('common.btn.confirmBtnName'),
                cancelButtonText: i18n.t('common.btn.cancelBtnName'),
                type: 'warning'
            }).then(() => {
                resetPwd({"id": id}).then((res) => {
                    if (res.data) {
                        this.$message.success(i18n.t('common.success'));
                        this.queryPage();
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
                const res = await queryPageSysUser({...pagination, ...sort, ...this.filterData.listQuery});
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
                saveSysUser(data).then((res) => {
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
                saveBatchSysUser(this.batchDialogData.excelData.file).then((res) => {
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
                deleteBatchSysUser(this.selected).then((res) => {
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
            exportTemplateSysUser();
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
                    hasSelected ? exportChoseExcelSysUser(this.selected) : this.$message.error(EXPORT_CHOOSE_NULL_ERROR_MSG);
                    break;
                }
                case EXPORT_TYPE.QUERY:
                    this.$message.success(EXPORT_SUCCESS_MSG);
                    exportParamExcelSysUser({...this.filterData.listQuery});
                    break;
                case EXPORT_TYPE.ALL:
                    this.$message.success(EXPORT_SUCCESS_MSG);
                    exportExcelSysUser();
                    break;
                default:
                    this.$message.error(EXPORT_ERROR_MSG);
                    break;
            }
        },

        /**
         * 附件上传
         */
        // 添加上传成功回调
        handleAddUploadSuccess(response, file, fileList) {
            if (response.code === 20000) {
                //响应式渲染深层对象vue2不会监听
                this.$set(this.addDialogData.model, 'avatar', response.data)
            } else {
                this.$message.error(response.data)
            }
        },
        // 编辑上传成功回调
        handleModifyUploadSuccess(response, file, fileList) {
            if (response.code === 20000) {
                //响应式渲染深层对象vue2不会监听
                this.$set(this.modifyDialogData.model, 'avatar', response.data)
            } else {
                this.$message.error(response.data)
            }
        },
    }
}
</script>
