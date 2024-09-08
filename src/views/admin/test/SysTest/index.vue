<template>
    <div>
        <button @click="toggleHistoryGrid">显示/隐藏历史版本比较</button>
        <div v-if="historyGrid.visible" class="history-grid">
            <!-- 原始数据表格 -->
            <ag-grid-vue
                class="ag-theme-alpine"
                style="width: 100%; height: 300px;"
                :columnDefs="originalColumnDefs"
                :rowData="prepareRowData(originalRowData)"
                :defaultColDef="defaultColDef"
                :gridOptions="historyGrid.gridOptions">
            </ag-grid-vue>
            <!-- 对比数据表格 -->
            <ag-grid-vue
                class="ag-theme-alpine"
                style="width: 100%; height: 300px;"
                :columnDefs="comparisonColumnDefs"
                :rowData="prepareRowData(comparisonRowData)"
                :defaultColDef="defaultColDef"
                :gridOptions="historyGrid.gridOptions">
            </ag-grid-vue>
        </div>
        <!-- 主表格 -->
        <ag-grid-vue
            class="ag-theme-alpine"
            style="width: 100%; height: 600px;"
            :columnDefs="originalColumnDefs"
            :rowData="prepareRowData(originalRowData)"
            :defaultColDef="defaultColDef"
            :gridOptions="historyGrid.gridOptions"
            @grid-ready="onGridReady">
        </ag-grid-vue>
    </div>
</template>

<script>
import { AgGridVue } from 'ag-grid-vue';

export default {
    name: 'App',
    components: {
        AgGridVue
    },
    data() {
        return {
            historyGrid: {
                visible: false,
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
                columnDefs: [],
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
                ["18190022166717372416", "2222"],
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
        originalColumnDefs() {
            return this.createColumnDefs(this.originalRowData[0]);
        },
        comparisonColumnDefs() {
            return this.createColumnDefs(this.comparisonRowData[0]);
        }
    },
    methods: {
        onGridReady(params) {
            this.gridApi = params.api;
            this.gridColumnApi = params.columnApi;
            this.gridApi.sizeColumnsToFit();  // 让列宽自适应
        },
        toggleHistoryGrid() {
            this.historyGrid.visible = !this.historyGrid.visible;
        },
        prepareRowData(data) {
            if (!data || data.length <= 1) {
                return [];
            }
            return data.slice(1).map(row => {
                return row.reduce((acc, value, index) => {
                    acc[data[0][index]] = value;
                    return acc;
                }, {});
            });
        },
        createColumnDefs(headers) {
            return headers.map(header => ({
                headerName: header,
                field: header,
                cellStyle: (params) => this.computeCellStyle(params, header, headers),
            }));
        },
        computeCellStyle(params, header, headers) {
            const comparisonHeaders = this.comparisonRowData[0];
            const originalHeaders = this.originalRowData[0];
            const comparisonIndex = comparisonHeaders.indexOf(header);
            const originalIndex = originalHeaders.indexOf(header);

            // 检查当前列的标题是否仅存在于原始数据或比较数据中
            const isMissingInComparison = originalIndex !== -1 && comparisonIndex === -1;
            const isMissingInOriginal = comparisonIndex !== -1 && originalIndex === -1;

            if (isMissingInComparison || isMissingInOriginal) {
                return {backgroundColor: 'orange'}; // 突出显示仅存在于一个标题数组中的标题
            }

            // 比较数据行的值是否不同
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
    height: 300px;
}

.history-grid {
    margin-top: 20px;
}
</style>
