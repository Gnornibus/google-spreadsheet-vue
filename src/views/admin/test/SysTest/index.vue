<template>
    <div>
        <el-button @click="dialogTableVisible = true">显示收货地址</el-button>
        <el-dialog
            title="收货地址"
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
            gridOptions: {},
            columnDefs: [
                { headerName: "日期", field: "date", sortable: true, filter: true },
                { headerName: "姓名", field: "name", sortable: true, filter: true },
                { headerName: "地址", field: "address", sortable: true, filter: true }
            ],
            rowData: [
                { date: "2021-09-01", name: "张三", address: "北京市朝阳区" },
                { date: "2021-09-02", name: "李四", address: "上海市浦东新区" },
                { date: "2021-09-03", name: "王五", address: "广州市白云区" }
            ]
        };
    }
};
</script>
