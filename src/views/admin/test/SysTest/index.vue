<template>
    <div>
        <el-button @click="dialogTableVisible = true">显示数据表格</el-button>
        <el-dialog
            title="动态数据表格"
            :visible.sync="dialogTableVisible"
            width="70%">
            <ag-grid-vue
                class="ag-theme-alpine"
                style="width: 100%; height: 400px;"
                :columnDefs="columnDefs"
                :rowData="rowData"
                :gridOptions="gridOptions">
            </ag-grid-vue>
        </el-dialog>
    </div>
</template>

<script>
import { AgGridVue } from 'ag-grid-vue';

export default {
    components: {
        AgGridVue
    },
    data() {
        return {
            dialogTableVisible: false,
            gridOptions: {
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
            columnDefs: [],
            rowData: []
        };
    },
    mounted() {
        this.processData([
            ["日期", "姓名", "地址", "地址11"], // 标题行
            ["2021-09-01", "张三", "北京市朝阳区"],
            ["2021-09-02", "李四", "上海市浦东新区"],
            ["2021-09-03", "王五", "广州市白云区"]
        ]);
    },
    methods: {
        processData(data) {
            if (!data.length) return;

            // 第一行为列定义
            this.columnDefs = data[0].map(header => ({
                headerName: header,
                field: header.toLowerCase(),
                sortable: true,
                filter: true,
                resizable: true
            }));

            // 剩余行为行数据
            this.rowData = data.slice(1).map(row => {
                let rowData = {};
                row.forEach((cell, index) => {
                    let fieldName = data[0][index].toLowerCase();
                    rowData[fieldName] = cell;
                });
                return rowData;
            });
        }
    }
};
</script>
