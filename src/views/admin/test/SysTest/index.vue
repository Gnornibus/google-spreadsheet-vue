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
        :componentsDisabled="true"
        :model="infoDialogData.model"
        :modelItem="infoDialogData.modelItem"
        :title="$t('common.dialog.dialogInfoTitle')"
        :visible.sync="infoDialogData.visible"
        :required="false"
        :width="dialogWidth"
        @close="queryPage()"
        @submit="()=>{this.infoDialogData.visible=false}">
    </my-dialog>
  </div>
</template>

<script>
import searchPane from '@/components/SearchPane';
import tablePane from '@/components/TablePane';
import MyDialog from '@/components/Dialog';
import i18n from '@/common/lang';
import UploadExcelComponent from '@/components/UploadExcel/index.vue';
import BackToTop from "@/components/BackToTop";
import {
  queryPageGoogleSheetConfigHistory,
} from "@/api/google-sheet-config-histroy-api";
import DataComparison from "@/components/Comparison/DataComparison.vue";
import {selectHistory} from "@/api/google-sheet-content-api";

export default {
  name: 'GoogleSheetConfigHistory',
  components: {DataComparison, searchPane, tablePane, MyDialog, UploadExcelComponent, BackToTop},
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
            permission: '020101',
            handleClick: this.queryPage,
          },
        },

        // 精准数据输入框
        decimal: [],
        // 数字输入框
        numbers: [],
        // 搜索输入框
        inputs: [
          {
            key: 'id',
            length: 64,
            name: i18n.t('view.googleSheetConfigHistory.id'),
          },
          {
            key: 'configurationId',
            length: 64,
            name: i18n.t('view.googleSheetConfigHistory.configurationId'),
          },
          {
            key: 'status',
            length: 64,
            name: i18n.t('view.googleSheetConfigHistory.status'),
          },
        ],
        // 搜索下拉框
        selects: [],
        // 搜索日期框
        datePickers: [],
        // 搜索时间框
        timePickers: [],
        // 搜索日期及时间框
        dateTimePickers: [
          {
            key: 'creTime',
            name: i18n.t('view.googleSheetConfigHistory.creTime'),
          },
          {
            key: 'updTime',
            name: i18n.t('view.googleSheetConfigHistory.updTime'),
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
            label: i18n.t('view.googleSheetConfigHistory.id'),
            sortable: true,
          },
          {
            key: 'configurationId',
            label: i18n.t('view.googleSheetConfigHistory.configurationId'),
            sortable: true,
          },
          {
            key: 'statusName',
            label: i18n.t('view.googleSheetConfigHistory.status'),
            sortable: false,
          },
          {
            key: 'remark',
            label: i18n.t('view.googleSheetConfigHistory.remark'),
            sortable: true,
          },
          {
            hide: true,
            key: 'creUserId',
            label: i18n.t('view.googleSheetConfigHistory.creUserId'),
            sortable: true,
          },
          {
            width: 160,
            key: 'creTime',
            label: i18n.t('view.googleSheetConfigHistory.creTime'),
            sortable: true,
          },
          {
            hide: true,
            key: 'updUserId',
            label: i18n.t('view.googleSheetConfigHistory.updUserId'),
            sortable: true,
          },
          {
            width: 160,
            key: 'updTime',
            label: i18n.t('view.googleSheetConfigHistory.updTime'),
            sortable: true,
          },
          {
            key: 'outputHeaderName',
            label: i18n.t('view.googleSheetConfigHistory.outputHeader'),
            sortable: false,
          },
          {
            key: 'ignoreDriveName',
            label: i18n.t('view.googleSheetConfigHistory.ignoreDrive'),
            sortable: false,
          },
          {
            key: 'sourceUrl',
            label: i18n.t('view.googleSheetConfigHistory.sourceUrl'),
            sortable: true,
          },
          {
            key: 'sourceSheet',
            label: i18n.t('view.googleSheetConfigHistory.sourceSheet'),
            sortable: true,
          },
          {
            key: 'sourceSheetId',
            label: i18n.t('view.googleSheetConfigHistory.sourceSheetId'),
            sortable: true,
          },
          {
            width: 400,
            key: 'sourceLink',
            label: i18n.t('view.googleSheetConfigHistory.sourceLink'),
            sortable: false,
            isLink: true,
            showField: "sourceUrl",
            valueField: "sourceLink",
          },
          {
            key: 'dataRange',
            label: i18n.t('view.googleSheetConfigHistory.dataRange'),
            sortable: true,
          },
          {
            key: 'judgeCondition',
            label: i18n.t('view.googleSheetConfigHistory.judgeCondition'),
            sortable: true,
          },
          {
            key: 'compareField',
            label: i18n.t('view.googleSheetConfigHistory.compareField'),
            sortable: true,
          },
          {
            key: 'outputField',
            label: i18n.t('view.googleSheetConfigHistory.outputField'),
            sortable: true,
          },
          {
            key: 'outputMode',
            label: i18n.t('view.googleSheetConfigHistory.outputMode'),
            sortable: true,
          },
          {
            key: 'cron',
            label: i18n.t('view.googleSheetConfigHistory.cron'),
            sortable: true,
          },
          {
            key: 'targetUrl',
            label: i18n.t('view.googleSheetConfigHistory.targetUrl'),
            sortable: true,
          },
          {
            key: 'targetSheet',
            label: i18n.t('view.googleSheetConfigHistory.targetSheet'),
            sortable: true,
          },
          {
            key: 'targetSheetId',
            label: i18n.t('view.googleSheetConfigHistory.targetSheetId'),
            sortable: true,
          },
          {
            width: 400,
            key: 'targetLink',
            label: i18n.t('view.googleSheetConfigHistory.targetLink'),
            sortable: false,
            isLink: true,
            showField: "targetUrl",
            valueField: "targetLink",
          },
          {
            key: 'targetStart',
            label: i18n.t('view.googleSheetConfigHistory.targetStart'),
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
          width: 80,
          data: [
            {
              name: "比对",
              type: 'primary',
              permission: '020106',
              handleRowClick: (index, row) => {
                selectHistory({historyId: row.id}).then((res) => {
                  this.infoDialogData.model = res.data
                  this.infoDialogData.visible = true;
                })
              }
            },
          ]
        },
      },

      // 多选框
      selected: [],

      /**
       * 弹出框
       */
      // 弹出框的宽度
      dialogWidth: '50%',
      // 详情
      infoDialogData: {
        visible: false,
        modelItem: [
          {
            type: 'input',
            length: 64,
            key: 'id',
            name: i18n.t('view.googleSheetConfigHistory.id'),
          },
          {
            type: 'input',
            length: 64,
            key: 'configurationId',
            name: i18n.t('view.googleSheetConfigHistory.configurationId'),
          },
          {
            type: 'input',
            length: 64,
            key: 'status',
            name: i18n.t('view.googleSheetConfigHistory.status'),
          },
          {
            type: 'input',
            length: 255,
            key: 'remark',
            name: i18n.t('view.googleSheetConfigHistory.remark'),
          },
          {
            type: 'input',
            length: 32,
            key: 'creUserId',
            name: i18n.t('view.googleSheetConfigHistory.creUserId'),
          },
          {
            type: 'datetime',
            key: 'creTime',
            name: i18n.t('view.googleSheetConfigHistory.creTime'),
          },
          {
            type: 'input',
            length: 32,
            key: 'updUserId',
            name: i18n.t('view.googleSheetConfigHistory.updUserId'),
          },
          {
            type: 'datetime',
            key: 'updTime',
            name: i18n.t('view.googleSheetConfigHistory.updTime'),
          },
          {
            type: 'input',
            length: 8,
            key: 'outputHeader',
            name: i18n.t('view.googleSheetConfigHistory.outputHeader'),
          },
          {
            type: 'input',
            length: 8,
            key: 'ignoreDrive',
            name: i18n.t('view.googleSheetConfigHistory.ignoreDrive'),
          },
          {
            type: 'input',
            length: 255,
            key: 'sourceUrl',
            name: i18n.t('view.googleSheetConfigHistory.sourceUrl'),
          },
          {
            type: 'input',
            length: 255,
            key: 'sourceSheet',
            name: i18n.t('view.googleSheetConfigHistory.sourceSheet'),
          },
          {
            type: 'input',
            length: 255,
            key: 'sourceSheetId',
            name: i18n.t('view.googleSheetConfigHistory.sourceSheetId'),
          },
          {
            type: 'input',
            length: 255,
            key: 'sourceLink',
            name: i18n.t('view.googleSheetConfigHistory.sourceLink'),
          },
          {
            type: 'input',
            length: 255,
            key: 'dataRange',
            name: i18n.t('view.googleSheetConfigHistory.dataRange'),
          },
          {
            type: 'input',
            length: 255,
            key: 'judgeCondition',
            name: i18n.t('view.googleSheetConfigHistory.judgeCondition'),
          },
          {
            type: 'input',
            length: 255,
            key: 'compareField',
            name: i18n.t('view.googleSheetConfigHistory.compareField'),
          },
          {
            type: 'input',
            length: 255,
            key: 'outputField',
            name: i18n.t('view.googleSheetConfigHistory.outputField'),
          },
          {
            type: 'input',
            length: 255,
            key: 'outputMode',
            name: i18n.t('view.googleSheetConfigHistory.outputMode'),
          },
          {
            type: 'input',
            length: 255,
            key: 'cron',
            name: i18n.t('view.googleSheetConfigHistory.cron'),
          },
          {
            type: 'input',
            length: 255,
            key: 'targetUrl',
            name: i18n.t('view.googleSheetConfigHistory.targetUrl'),
          },
          {
            type: 'input',
            length: 255,
            key: 'targetSheet',
            name: i18n.t('view.googleSheetConfigHistory.targetSheet'),
          },
          {
            type: 'input',
            length: 255,
            key: 'targetSheetId',
            name: i18n.t('view.googleSheetConfigHistory.targetSheetId'),
          },
          {
            type: 'input',
            length: 255,
            key: 'targetLink',
            name: i18n.t('view.googleSheetConfigHistory.targetLink'),
          },
          {
            type: 'input',
            length: 255,
            key: 'targetStart',
            name: i18n.t('view.googleSheetConfigHistory.targetStart'),
          },
        ],
        model: {},
      },
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
    /**
     * 搜索框
     */
    // 获取列表数据
    async queryPage() {
      this.dataSource.loading = true;
      try {
        const {pagination, sort} = this.dataSource;
        const res = await queryPageGoogleSheetConfigHistory({...pagination, ...sort, ...this.filterData.listQuery});
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
  }
}
</script>
