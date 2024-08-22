<template>
    <div>
        <el-button @click="getEventByProperties">获取事件信息</el-button>
        <br>
        <el-date-picker
            v-model="datetimeScope"
            type="datetimerange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd HH:mm:ss">
        </el-date-picker>
        <div v-if="grid.rowData.length">
            <ag-grid-vue
                class="ag-theme-alpine"
                style="width: 100%; height: 400px;"
                :columnDefs="grid.columnDefs"
                :rowData="grid.rowData"
                :gridOptions="grid.gridOptions">
            </ag-grid-vue>
        </div>
        <div v-else>
            <p>No data fetched yet.</p>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import MyDialog from "@/components/Dialog/index.vue";
import {
    formatDate,
} from "@/common/utils/validate";

export default {
    components: {MyDialog},
    data() {
        return {
            configData: {
                status: "complete_config",
                sourceUrl: "15nnoeazZ52Q5HKZBP6c9sOgoVZD24p8Qa-HMLLQrNE4",
                sourceSheet: "PA_ALL",
            },
            apiKey: "phx_apIWBmYRALmdzndWYpV1lh1X5V6hitAFKqjLtq4799DgO81",
            host: "https://us.posthog.com",
            project: "85867",
            datetimeScope: this.getDefaultDateRange(),
            pickerOptions: {
                shortcuts: [
                    {
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date(end.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    },
                    // Other shortcuts...
                ]
            },
            grid: {
                visible: false,
                linkUrl: "https://docs.google.com/spreadsheets/u/0/",
                title: "测试",
                gridOptions: {
                    enableRangeSelection: true,
                    enableClipboard: true,
                    masterDetail: true,
                    detailCellRendererParams: {
                        detailGridOptions: {
                            columnDefs: [],
                            domLayout: 'autoHeight'
                        },
                        getDetailRowData: function (params) {
                            if (params.data && params.data.details) {
                                params.successCallback(params.data.details);
                            } else {
                                params.successCallback([]);
                            }
                        }
                    }
                },
                columnDefs: [],
                rowData: []
            }
        };
    },
    methods: {
        async getEventByProperties() {
            const url = `${this.host}/api/projects/${this.project}/query/`;
            const body = {
                query: {
                    kind: "HogQLQuery",
                    query: `select *
                            from events
                            where event = '${this.configData.status}'
                              and properties.sourceUrl = '${this.configData.sourceUrl}'
                              and properties.sourceSheet = '${this.configData.sourceSheet}'
                              and timestamp
                                > '${this.datetimeScope[0]}'
                              and timestamp
                                < '${this.datetimeScope[1]}'
                            order by timestamp asc`
                }
            };
            const config = {
                headers: {
                    'Content-Type': "application/json",
                    'Authorization': `Bearer ${this.apiKey}`,
                }
            };

            try {
                const response = await axios.post(url, body, config);
                this.processData(response.data.types, response.data.results);
            } catch (error) {
                console.error('Error fetching data:', error);
                this.data = `Failed to fetch data: ${error.message}`;
            }
        },
        processData(columnDefsList, data) {
            if (!data.length) return;

            this.grid.columnDefs = columnDefsList.map(([field, type]) => ({
                headerName: field.replace(/_/g, ' ').replace(/\$+/g, '').replace(/([a-z])([A-Z])/g, '$1 $2'),
                field: field.toLowerCase(),
                sortable: true,
                filter: true,
                resizable: true,
                cellRenderer: field.toLowerCase() === 'properties' ? 'agGroupCellRenderer' : null
            }));

            let flag = true; // 控制只执行一次
            this.grid.rowData = data.map(row => {
                let rowData = {};
                columnDefsList.forEach(([field], index) => {
                    if (field.toLowerCase() === "properties") {
                        try {
                            let details = JSON.parse(row[index]);
                            if (flag) {
                                this.processChildrenColDefs(details);
                                flag = false;
                            }
                            rowData[field.toLowerCase()] = row[index];
                            rowData["details"] = [details];
                        } catch (e) {
                            console.error('Error parsing properties:', e);
                            rowData[field.toLowerCase()] = {};
                            rowData["details"] = [];
                        }
                    } else {
                        rowData[field.toLowerCase()] = row[index];
                    }
                });
                return rowData;
            });
        },
        processChildrenColDefs(data) {
            this.grid.gridOptions.detailCellRendererParams.detailGridOptions.columnDefs = Object.keys(data).map(key => ({
                headerName: key.replace(/_/g, ' ').replace(/\$+/g, '').replace(/([a-z])([A-Z])/g, '$1 $2'), // 使列名更易读
                field: key,  // 确保 field 名称为小写
                sortable: true,
                filter: true,
                resizable: true
            }));
        },
        getDefaultDateRange() {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            return [formatDate(start), formatDate(end)];
        },
    }
};
</script>

<style scoped>
::v-deep .ag-details-row {
    padding: 0px 0px 0px 20px;
}
</style>
