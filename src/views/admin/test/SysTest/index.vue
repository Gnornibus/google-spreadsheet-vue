<template>
    <div >
        <el-row type="flex" justify="center" class="header-row">
            <el-button type="primary" @click="toggleHistoryGrid">
                {{ historyGrid.visible ? '隐藏历史版本比较' : '显示历史版本比较' }}
            </el-button>
        </el-row>
        <div v-if="historyGrid.visible" class="history-grid">
            <!-- 对比数据表格 -->
            <el-row>
                <el-col :span="24">
                    <h2 class="table-header">对比数据表格</h2>
                    <ag-grid-vue
                        class="ag-theme-balham"
                        style="width: 100%; height: 300px;"
                        :columnDefs="comparisonColumnDefs"
                        :rowData="prepareRowData(comparisonRowData)"
                        :defaultColDef="defaultColDef"
                        :gridOptions="historyGrid.gridOptions"
                        @grid-ready="onGridReady">
                    </ag-grid-vue>
                </el-col>
            </el-row>
            <!-- 原始数据表格 -->
            <el-row>
                <el-col :span="24">
                    <h2 class="table-header">原始数据表格</h2>
                    <ag-grid-vue
                        class="ag-theme-balham"
                        style="width: 100%; height: 300px;"
                        :columnDefs="originalColumnDefs"
                        :rowData="prepareRowData(originalRowData)"
                        :defaultColDef="defaultColDef"
                        :gridOptions="historyGrid.gridOptions"
                        @grid-ready="onGridReady">
                    </ag-grid-vue>
                </el-col>
            </el-row>
        </div>
        <!-- 主表格 -->
        <el-row v-else>
            <el-col :span="24">
                <h2 class="table-header">主数据表格（高亮差异）</h2>
                <ag-grid-vue
                    class="ag-theme-balham"
                    style="width: 100%; height: 600px;"
                    :columnDefs="mainColumnDefs"
                    :rowData="prepareRowData(originalRowData)"
                    :defaultColDef="defaultColDef"
                    :gridOptions="historyGrid.gridOptions"
                    @grid-ready="onGridReady">
                </ag-grid-vue>
            </el-col>
        </el-row>
    </div>
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
                        defaultToolPanel: ''
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
                ["18190022166717372416", "854932226", "3333"],
                ["18190022166717372416", "854932226", "4444"],
            ],
            comparisonRowData: [
                ["记录编号", "URL"],
                ["18190022166717372416", "1111"],
                ["18190022166717372416", "3333"],
                ["18190022166717372416", "3333"],
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
        mainColumnDefs() {
            return this.getColumnDefs(this.originalRowData[0], true);
        },
        originalColumnDefs() {
            return this.getColumnDefs(this.originalRowData[0], false);
        },
        comparisonColumnDefs() {
            return this.getColumnDefs(this.comparisonRowData[0], false);
        }
    },
    methods: {
        onGridReady(params) {
            this.gridApi = params.api;
            this.gridColumnApi = params.columnApi;
            this.gridApi.sizeColumnsToFit();
        },
        toggleHistoryGrid() {
            this.historyGrid.visible = !this.historyGrid.visible;
        },
        prepareRowData(data) {
            return data.slice(1).map(row => row.reduce((acc, value, index) => ({...acc, [data[0][index]]: value}), {}));
        },
        simpleColumnDefs(headers, flag) {
            return this.getColumnDefs(headers, flag);
        },
        getColumnDefs(headers, highlightDifferences) {
            return headers.map(header => ({
                headerName: header,
                field: header,
                cellStyle: highlightDifferences ? (params) => this.computeCellStyle(params, header, headers) : null,
            }));
        },
        computeCellStyle(params, header, headers) {
            const comparisonHeaders = this.comparisonRowData[0];
            const originalHeaders = this.originalRowData[0];
            const comparisonIndex = comparisonHeaders.indexOf(header);
            const originalIndex = originalHeaders.indexOf(header);

            // 高亮显示逻辑仅适用于主表格，确保此逻辑被触发
            const isMissingInComparison = originalIndex !== -1 && comparisonIndex === -1;
            const isMissingInOriginal = comparisonIndex !== -1 && originalIndex === -1;

            if (isMissingInComparison || isMissingInOriginal) {
                return {backgroundColor: 'orange'}; // 突出显示仅存在于一个标题数组中的标题
            }

            const comparisonRow = this.comparisonRowData[params.node.rowIndex + 1];
            if (!comparisonRow || params.value !== comparisonRow[comparisonIndex]) {
                return {backgroundColor: 'yellow'}; // 突出显示具有不同值的单元格
            }
            return null;
        },
    }
};
</script>

<style scoped>
.app-container {
    margin: 10px;
}

.header-row {
    margin-bottom: 10px;
}

.table-header {
    font-size: 16px;
    color: #333;
    margin-bottom: 5px; /* 减小标题下的间隔 */
}

.ag-theme-balham {
    border-radius: 4px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1); /* 减少阴影的扩散，使得整体显得更紧凑 */
}

/* 减少行间距，使得表格间隔更紧凑 */
.el-row {
    margin-bottom: 5px;
}

/* 优化表格内部单元格的内边距，减少单元格间距 */
.ag-cell {
    padding: 4px 8px; /* 根据实际需要调整 */
}
</style>
