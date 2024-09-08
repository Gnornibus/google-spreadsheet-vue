<template>
    <ag-grid-vue
        class="ag-theme-alpine"
        style="width: 100%; height: 600px;"
        :columnDefs="columnDefs"
        :rowData="rowData"
        :defaultColDef="defaultColDef"
        :gridOptions="historyGrid.gridOptions"
        @grid-ready="onGridReady">
    </ag-grid-vue>
</template>

<script>
import {AgGridVue} from 'ag-grid-vue';

export default {
    name: 'App',
    components: {
        AgGridVue
    },
    data() {
        return {
            // 缓存弹框配置
            historyGrid: {
                visible: false,
                linkUrl: "https://docs.google.com/spreadsheets/u/0/",
                title: "测试",
                gridOptions: {
                    enableRangeSelection: true,
                    enableClipboard: true,
                    sideBar: {
                        toolPanels: [
                            {
                                id: 'columns',
                                labelDefault: 'Columns',
                                labelKey: 'columns',
                                iconKey: 'columns',
                                toolPanel: 'agColumnsToolPanel',
                                toolPanelParams: {
                                    suppressRowGroups: true,
                                    suppressValues: true,
                                    suppressPivots: true,
                                    suppressPivotMode: true
                                }
                            },
                            {
                                id: 'filters',
                                labelDefault: 'Filters',
                                labelKey: 'filters',
                                iconKey: 'filter',
                                toolPanel: 'agFiltersToolPanel',
                            }
                        ],
                        defaultToolPanel: 'columns'
                    }
                },
                columnDefs: "",
                rowData: [],
            },
            gridApi: null,
            gridColumnApi: null,
            originalRowData: [
                ["记录编号", "产品ID", "URL"],
                ["18190022166717372416", "85493226", "1111"],
                ["18190022166717372416", "854932226", "2222"],
            ],
            comparisonRowData: [
                ["记录编号", "URL"],
                ["18190022166717372416", "1111"],
            ],
        };
    },
    computed: {
        defaultColDef() {
            return {
                resizable: true,
                sortable: true
            };
        },
        columnDefs() {
            const originalHeaders = this.originalRowData[0];
            const comparisonHeaders = this.comparisonRowData[0];
            return originalHeaders.map(header => {
                const comparisonIndex = comparisonHeaders.indexOf(header);
                const missingOrDifferent = comparisonIndex === -1;
                return {
                    headerName: header,
                    field: header,
                    cellStyle: (params) => this.computeCellStyle(params, comparisonIndex, missingOrDifferent)
                };
            });
        },
        rowData() {
            return this.originalRowData.slice(1).map(row => {
                return row.reduce((acc, value, index) => {
                    acc[this.originalRowData[0][index]] = value;
                    return acc;
                }, {});
            });
        }
    },
    methods: {
        onGridReady(params) {
            this.gridApi = params.api;
            this.gridColumnApi = params.columnApi;
        },
        computeCellStyle(params, comparisonIndex, missingOrDifferent) {
            if (missingOrDifferent) {
                return {backgroundColor: 'orange'}; // 突出显示缺失或不同的标题
            }
            const comparisonRow = this.comparisonRowData[params.node.rowIndex + 1];
            if (!comparisonRow || params.value !== comparisonRow[comparisonIndex]) {
                return {backgroundColor: 'yellow'}; // 突出显示具有不同值的单元格
            }
            return null;
        }
    }
};
</script>

<style>
/* 样式可以根据需求进一步定义 */
.ag-theme-alpine {
    width: 100%;
    height: 600px;
}
</style>
