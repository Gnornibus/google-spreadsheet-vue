<template>
    <div class="ag-theme-alpine" style="height: 400px; width: 600px;">
        <ag-grid-vue
            :columnDefs="columnDefs"
            :rowData="rowData"
            :defaultColDef="defaultColDef"
            :getRowStyle="getRowStyle"
            @grid-ready="onGridReady">
        </ag-grid-vue>
    </div>
</template>

<script>

export default {
    data() {
        return {
            columnDefs: [
                { field: 'id', headerName: 'ID', sortable: true, filter: true },
                { field: 'value', headerName: 'Value', sortable: true, filter: true }
            ],
            rowData: [
                { id: 1, value: 10 },
                { id: 2, value: 60 },
                { id: 3, value: 30 },
                { id: 4, value: 80 }
            ],
            defaultColDef: {
                flex: 1,
                resizable: true
            }
        };
    },
    methods: {
        getRowStyle(params) {
            // 根据条件改变行样式
            if (params.data.value > 50) {
                return { background: 'red' }; // 大于50的值，背景色变为红色
            } else {
                return { background: 'green' }; // 小于或等于50的值，背景色变为绿色
            }
        },
        onGridReady(params) {
            params.api.sizeColumnsToFit();
        }
    }
};
</script>

<style>
.ag-theme-alpine {
    --ag-alpine-active-color: #FF6F61; /* 可根据需要定制的主题色 */
}
</style>
