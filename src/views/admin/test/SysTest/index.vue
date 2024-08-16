<template>
    <ag-grid-vue
        class="ag-theme-alpine"
        style="width: 100%; height: 600px;"
        :columnDefs="columnDefs"
        :rowData="rowData">
    </ag-grid-vue>
</template>

<script>
import {AgGridVue} from "ag-grid-vue";

export default {
    name: "AgTable",
    components: {
        AgGridVue,
    },
    data() {
        return {
            gridApi: null,
            columnDefs: [
                {
                    headerName: "名称",
                    field: "title",
                },
                {
                    headerName: "网址",
                    field: "url",
                },
                {
                    headerName: "分类",
                    field: "catalog",
                    resizable: true,
                },
                {
                    headerName: "PR",
                    field: "pr",
                    resizable: true,
                },
            ],
            //需要显示的数据
            rowData: [
                {title: "谷歌", url: "www.google", catalog: "搜索引擎", pr: 10},
                {title: "微软", url: "www.microsoft.com", catalog: "操作系", pr: 10},
                {title: "ITXST", url: "www.itxst.com", catalog: "小站", pr: 1},
                {title: "淘宝", url: "www.taobao.com", catalog: "电商", pr: 8},
            ],
        };
    }
};
</script>

<style lang="less" scoped></style>
