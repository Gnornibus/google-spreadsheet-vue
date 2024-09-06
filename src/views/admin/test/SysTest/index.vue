<template>
    <ag-grid-vue
        class="ag-theme-alpine"
        style="width: 100%; height: 600px;"
        :columnDefs="columnDefs"
        :rowData="preparedRowData">
    </ag-grid-vue>
</template>

<script>

export default {
    name: "AgTable",
    data() {
        return {
            gridApi: null,
            columnDefs: [
                {
                    headerName: "名称",
                    field: "title",
                    cellStyle: params => this.highlightDiff(params, 'title')
                },
                {
                    headerName: "网址",
                    field: "url",
                    cellStyle: params => this.highlightDiff(params, 'url')
                },
                {
                    headerName: "分类",
                    field: "catalog",
                    resizable: true,
                    cellStyle: params => this.highlightDiff(params, 'catalog')
                },
                {
                    headerName: "PR",
                    field: "pr",
                    resizable: true,
                    cellStyle: params => this.highlightDiff(params, 'pr')
                },
            ],
            originalRowData: [
                {title: "谷歌", url: "www.google.com", catalog: "搜索引擎", pr: 10},
                {title: "微软", url: "www.microsoft.com", catalog: "操作系统", pr: 10},
                {title: "ITXST", url: "www.itxst.com", catalog: "小站", pr: 1},
                {title: "淘宝", url: "www.taobao.com", catalog: "电商", pr: 8},
            ],
            comparisonRowData: [
                {title: "谷歌", url: "www.google.com", catalog: "广告平台", pr: 9},
                {title: "微软", url: "www.microsoft.com", catalog: "操作系统", pr: 10},
                {title: "ITXST", url: "www.itxst.com", catalog: "资源站", pr: 2},
                {title: "阿里巴巴", url: "www.alibaba.com", catalog: "电商", pr: 8},
            ],
            preparedRowData: [],
        };
    },
    created() {
        this.prepareRowData();
    },
    methods: {
        prepareRowData() {
            this.preparedRowData = this.originalRowData.map((row, index) => {
                const compRow = this.comparisonRowData[index] || {};
                return {
                    ...row,
                    _diff: {
                        title: row.title !== compRow.title,
                        url: row.url !== compRow.url,
                        catalog: row.catalog !== compRow.catalog,
                        pr: row.pr !== compRow.pr,
                    }
                };
            });
        },
        highlightDiff(params, field) {
            return params.data._diff[field] ? { backgroundColor: 'yellow' } : null;
        }
    }
};
</script>

<style>
/* 样式可以根据需求进一步定义 */
</style>
