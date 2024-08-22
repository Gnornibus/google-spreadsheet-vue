<template>
    <div>
        <el-button @click="getEventByProperties">获取事件信息</el-button>
        {{ datetimeScope }}
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
                :gridOptions="grid.gridOptions"
                :masterDetail="true"
                :detailCellRendererParams="grid.gridOptions.detailCellRendererParams">
            </ag-grid-vue>
        </div>
        <div v-else>
            <p>No data fetched yet.</p>
        </div>
        {{ grid.rowData }}
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
            data: "",
            datetimeScope: this.getDefaultDateRange(),
            // AgGridVue
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
                            columnDefs: [
                                {field: 'detailField1'},
                                {field: 'detailField2'}
                            ],
                            domLayout: 'autoHeight'
                        },
                        getDetailRowData: function (params) {
                            params.successCallback(params.data.details);
                        }
                    },
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
                        defaultToolPanel: ''
                    }
                },
                columnDefs: [],
                rowData: []
            },
            pickerOptions: {
                shortcuts: [{
                    text: '最近一周',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近一个月',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近三个月',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                        picker.$emit('pick', [start, end]);
                    }
                }]
            },
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
                              AND properties.sourceUrl = '${this.configData.sourceUrl}'
                              AND properties.sourceSheet = '${this.configData.sourceSheet}'
                              AND timestamp
                                > '${this.datetimeScope[0]}'
                              AND timestamp
                                < '${this.datetimeScope[1]}'
                            order by timestamp asc
                    `,
                }
            };
            const config = {
                headers: {
                    'content-type': "application/json",
                    'Authorization': `Bearer ${this.apiKey}`,
                },
                data: JSON.stringify(body)
            };

            try {
                const response = await axios.post(url, body, config);
                this.processData(response.data.types, response.data.results);
                this.grid.visible = true;
            } catch (error) {
                console.error('Error fetching data:', error);
                this.data = `Failed to fetch data: ${error.message}`;
            }
        },
        processData(columnDefsList, data) {
            if (!data.length) return;

            // 构建列定义
            this.grid.columnDefs = columnDefsList.map(([field, type]) => ({
                headerName: field.replace(/_/g, ' ').replace(/\$+/g, '').replace(/([a-z])([A-Z])/g, '$1 $2'), // 使列名更易读
                field: field.toLowerCase(),  // 确保 field 名称为小写
                sortable: true,
                filter: true,
                resizable: true
            }));

            let flag = true;
            // 构建行数据
            this.grid.rowData = data.map(row => {
                let rowData = {};
                row.forEach((cell, index) => {
                    // 使用小写的 field 名称来匹配列定义
                    let fieldName = columnDefsList[index][0].toLowerCase();
                    // 特殊处理 JSON 字符串，确保 properties 能被正确解析
                    if (fieldName === 'properties' && typeof cell === 'string') {
                        try {
                            rowData[fieldName] = JSON.parse(JSON.stringify(cell));
                            if (flag) {
                                this.processChildrenColDefs(rowData[fieldName]);
                                flag = false;
                            }
                            rowData["details"] = JSON.parse(rowData[fieldName]);
                        } catch (e) {
                            rowData[fieldName] = cell; // 如果解析失败，保留原始字符串
                        }
                    } else {
                        rowData[fieldName] = cell;
                    }
                });
                return rowData;
            });
        },
        processChildrenColDefs(data) {
            const obj = JSON.parse(data);
            this.grid.gridOptions.detailCellRendererParams.detailGridOptions.columnDefs = Object.keys(obj).map(key => ({
                headerName: key.replace(/_/g, ' ').replace(/\$+/g, '').replace(/([a-z])([A-Z])/g, '$1 $2'), // 使列名更易读
                field: key.toLowerCase(),  // 确保 field 名称为小写
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
        async getEvent() {
            const url = `${this.host}/api/projects/${this.project}/events/?event=${this.eventId}`;
            const headers = {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json'
            };

            try {
                const response = await axios.get(url, {headers});
                this.data = response.data;
            } catch (error) {
                console.error('Failed to fetch event data:', error);
                this.data = `Failed to fetch data: ${error.message}`;
            }
        },
        async getPerson() {
            const url = `${this.host}/api/projects/${this.project}/persons/?distinct_id=${this.eventId}`;
            const headers = {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json'
            };

            try {
                const response = await axios.get(url, {headers});
                this.data = response.data;
            } catch (error) {
                console.error('Failed to fetch person data:', error);
                this.data = `Failed to fetch data: ${error.message}`;
            }
        },
        async getDashboard() {
            const url = `${this.host}/api/projects/${this.project}/dashboards/`;
            const headers = {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json'
            };

            try {
                const response = await axios.get(url, {headers});
                this.data = response.data;
            } catch (error) {
                console.error('Failed to fetch dashboard data:', error);
                this.data = `Failed to fetch data: ${error.message}`;
            }
        },
        async getInsight() {
            const url = `${this.host}/api/projects/${this.project}/insights/?short_id=${this.eventId}`;
            const headers = {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json'
            };

            try {
                const response = await axios.get(url, {headers});
                this.data = response.data;
            } catch (error) {
                console.error('Failed to fetch insight data:', error);
                this.data = `Failed to fetch data: ${error.message}`;
            }
        },
        async getCohort() {
            const url = `${this.host}/api/projects/${this.project}/cohorts/?id=${this.eventId}`;
            const headers = {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json'
            };

            try {
                const response = await axios.get(url, {headers});
                this.data = response.data;
            } catch (error) {
                console.error('Failed to fetch cohort data:', error);
                this.data = `Failed to fetch data: ${error.message}`;
            }
        },
    }
};
</script>
