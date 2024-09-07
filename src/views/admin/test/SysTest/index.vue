<template>
    <ag-grid-vue
        class="ag-theme-alpine"
        style="width: 100%; height: 600px;"
        :columnDefs="columnDefs"
        :rowData="preparedRowData">
    </ag-grid-vue>
</template>

<script>
import { AgGridVue } from 'ag-grid-vue';

export default {
    name: "AgTable",
    components: {
        AgGridVue
    },
    data() {
        return {
            gridApi: null,
            columnDefs: [],
            originalRowData: [
                ["记录编号", "产品ID", "URL", "提交时间", "姓名", "性别", "openid", "邮箱", "电话", "城市", "公司", "公司规模", "角色", "角色说明", "职级", "职级说明", "领域", "领域说明", "googledevcommunity", "活动主题", "谷歌员工名字", "饮食偏好", "无障碍需求", "无障碍需求说明", "年龄", "订阅", "声明1", "声明2", "渠道", "utm-source", "utm-content", "utm-medium", "utm-campaign", "utm-term", "fbx-version", "来源"],
                ["18190022166717372416", "85493226", "1111", "2024-06-04 12:31:00", "Chunyi Zhou", "Male", "openid1", "ying@babafish.com", "+86177", "Shenzhen", "Cloud Ace", "Established company", "Business leader/executive", "", "Specialist", "", "Technology", "", "Notany", "AI", "Cloud Ace", "no", "", "", "TRUE", "TRUE", "TRUE", "TRUE", "cloud-wch", "", "", "", "", "", "english", "PAENG99"],
                ["18190022166717372416", "854932226", "2222", "2024-06-04 12:31:00", "Chunyi Zhou", "Male", "openid1", "ying@babafish.com", "+86177", "Shenzhen", "Cloud Ace", "Established company", "Business leader/executive", "", "Specialist", "", "Technology", "", "Notany", "AI", "Cloud Ace", "no", "", "", "TRUE", "TRUE", "TRUE", "TRUE", "cloud-wch", "", "", "", "", "", "english", "PAENG99"],
                // 更多行数据...
            ],
            comparisonRowData: [
                ["记录编号", "产品ID", "URL", "提交时间", "姓名", "性别", "openid", "邮箱", "电话", "城市", "公司", "公司规模", "角色", "角色说明", "职级", "职级说明", "领域", "领域说明", "googledevcommunity", "活动主题", "谷歌员工名字", "饮食偏好", "无障碍需求", "无障碍需求说明", "年龄", "订阅", "声明1", "声明2", "渠道", "utm-source", "utm-content", "utm-medium", "utm-campaign", "utm-term", "fbx-version", "来源"],
                ["18190022166717372416", "854932226", "2222", "2024-06-04 12:31:00", "Chunyi Zhou", "Male", "openid1", "ying@babafish.com", "+86177", "Shenzhen", "Cloud Ace", "Established company", "Business leader/executive", "", "Specialist", "", "Technology", "", "Notany", "AI", "Cloud Ace", "no", "", "", "TRUE", "TRUE", "TRUE", "TRUE", "cloud-wch", "", "", "", "", "", "english", "PAENG99"],
                // 更多行数据...
            ],
            preparedRowData: [],
        };
    },
    created() {
        this.generateColumnDefs();
        this.prepareRowData();
    },
    methods: {
        generateColumnDefs() {
            if (this.originalRowData.length > 0 && this.comparisonRowData.length > 0) {
                const titleDifferences = this.originalRowData[0].map((header, index) => header !== (this.comparisonRowData[0][index]));
                this.columnDefs = this.originalRowData[0].map((header, index) => ({
                    headerName: header,
                    field: index.toString(),
                    cellStyle: (params) => this.highlightDiff(params, index, titleDifferences[index]),
                    cellRenderer: function(params) {
                        // 使用单元格渲染器返回正确的值
                        return params.value.value;
                    }
                }));
            }
        },
        prepareRowData() {
            this.preparedRowData = this.originalRowData.slice(1).map((row, rowIndex) => {
                const compRow = this.comparisonRowData[rowIndex + 1] || [];
                return row.map((cell, cellIndex) => ({
                    value: cell,
                    diff: this.columnDefs[cellIndex].cellStyle({value: {diff: cell !== compRow[cellIndex]}})
                }));
            });
        },
        highlightDiff(params, fieldIndex, columnDiff) {
            if (columnDiff || (params.value && params.value.diff)) {
                return { backgroundColor: 'yellow' }; // 根据差异高亮显示
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
