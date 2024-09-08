<template>
    <div>
        <el-row type="flex" justify="center" class="header-row">
            <el-button type="primary" @click="toggleHistoryGrid">
                {{ historyGrid.visible ? '隐藏历史版本比较' : '显示历史版本比较' }}
            </el-button>
        </el-row>
        <div v-if="historyGrid.visible" class="history-grid">
            <!-- 原始数据表格 -->
            <el-row>
                <el-col :span="24">
                    <h2 class="table-header">{{ originalTitle }}</h2>
                    <ag-grid-vue
                        class="ag-theme-balham"
                        :columnDefs="originalColumnDefs"
                        :rowData="prepareRowData(originalData)"
                        :defaultColDef="defaultColDef"
                        :gridOptions="historyGrid.gridOptions"
                        @grid-ready="onGridReady">
                    </ag-grid-vue>
                </el-col>
            </el-row>
            <!-- 对比数据表格 -->
            <el-row>
                <el-col :span="24">
                    <h2 class="table-header">{{ comparisonTitle }}</h2>
                    <ag-grid-vue
                        class="ag-theme-balham"
                        :columnDefs="comparisonColumnDefs"
                        :rowData="prepareRowData(comparisonData)"
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
                <h2 class="table-header">{{ computedMainTitle }}</h2>
                <ag-grid-vue
                    class="ag-theme-balham"
                    :columnDefs="mainColumnDefs"
                    :rowData="prepareRowData(originalData)"
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
    name: 'DataComparison',
    components: {AgGridVue},
    props: {
        mainTitle: {
            type: String,
            default: ""
        },
        originalTitle: {
            type: String,
            default: "原始数据表格"
        },
        originalData: {
            type: Array,
            default: []
        },
        comparisonTitle: {
            type: String,
            default: "对比数据表格"
        },
        comparisonData: {
            type: Array,
            default: []
        }
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
                                iconKey: 'columns',
                                toolPanel: 'agColumnsToolPanel'
                            },
                            {id: 'filters', labelDefault: 'Filters', iconKey: 'filter', toolPanel: 'agFiltersToolPanel'}
                        ],
                        defaultToolPanel: ''
                    }
                },
                columnDefs: [],
                rowData: [],
            }
        };
    },
    computed: {
        computedMainTitle() {
            // 如果mainTitle有值，就使用mainTitle，否则使用originalTitle
            return this.mainTitle || this.originalTitle;
        },
        defaultColDef() {
            return {resizable: true, sortable: true};
        },
        mainColumnDefs() {
            return this.getColumnDefs(this.originalData[0], true);
        },
        originalColumnDefs() {
            return this.getColumnDefs(this.originalData[0], false);
        },
        comparisonColumnDefs() {
            return this.getColumnDefs(this.comparisonData[0], false);
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
        getColumnDefs(headers, highlightDifferences) {
            return headers.map(header => ({
                headerName: header,
                field: header,
                cellStyle: highlightDifferences ? (params) => this.computeCellStyle(params, header, headers) : null,
            }));
        },
        computeCellStyle(params, header, headers) {
            const comparisonHeaders = this.comparisonData[0];
            const originalHeaders = this.originalData[0];
            const comparisonIndex = comparisonHeaders.indexOf(header);
            const originalIndex = originalHeaders.indexOf(header);

            if ((originalIndex !== -1 && comparisonIndex === -1) || (comparisonIndex !== -1 && originalIndex === -1)) {
                return {backgroundColor: 'orange'};
            }
            const comparisonRow = this.comparisonData[params.node.rowIndex + 1];
            const originalRow = this.originalData[params.node.rowIndex + 1];
            if (!comparisonRow || params.value !== comparisonRow[comparisonIndex]) {
                return {backgroundColor: 'yellow'};
            }
            return null;
        }
    }
};
</script>

<style scoped>
/* Styles can be adjusted according to needs */
.ag-theme-balham {
    width: 100%;
    height: 300px;
}

.history-grid {
    margin-top: 20px;
}

.table-header {
    font-size: 16px;
    color: #333;
    margin-bottom: 10px;
}

.header-row {
    margin-bottom: 10px;
}
</style>
