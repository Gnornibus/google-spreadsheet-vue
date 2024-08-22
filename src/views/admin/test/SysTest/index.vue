<template>
    <div>
        <el-button @click="getEventByProperties">获取事件信息</el-button>
        <div v-if="grid.rowData.length">
            <h3>Event Data:</h3>
            <pre>{{ grid.rowData }}</pre>
        </div>
        <div v-else>
            <p>No data fetched yet.</p>
        </div>
        <my-dialog
            :title="grid.title"
            :visible.sync="grid.visible"
            top="10%"
            width="90%"
            @submit="grid.visible=false">
            <template v-slot:title-slot>
                <a type="primary" :href="grid.linkUrl" target="_blank"
                   style="color: inherit; text-decoration: none;">
                    <span style="color: deepskyblue">{{ grid.title }}</span>
                </a>
            </template>
            <ag-grid-vue
                class="ag-theme-alpine"
                style="width: 100%; height: 400px;"
                :columnDefs="grid.columnDefs"
                :children="true"
                :rowData="grid.rowData"
                :gridOptions="grid.gridOptions">
            </ag-grid-vue>
        </my-dialog>
    </div>
</template>

<script>
import axios from 'axios';
import MyDialog from "@/components/Dialog/index.vue";

export default {
    components: {MyDialog},
    data() {
        return {
            configData: {
                sourceUrl: "15nnoeazZ52Q5HKZBP6c9sOgoVZD24p8Qa-HMLLQrNE4",
                sourceSheet: "PA_ALL",
            },
            apiKey: "phx_apIWBmYRALmdzndWYpV1lh1X5V6hitAFKqjLtq4799DgO81",
            host: "https://us.posthog.com",
            project: "85867",
            data: "",
            // AgGridVue
            grid: {
                visible: false,
                linkUrl: "https://docs.google.com/spreadsheets/u/0/",
                title: "测试",
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
                            where properties.sourceUrl = '${this.configData.sourceUrl}'
                              AND properties.sourceSheet = '${this.configData.sourceSheet}'`,
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
                this.processData(response.data);
                this.grid.visible = true;
            } catch (error) {
                console.error('Error fetching data:', error);
                this.data = `Failed to fetch data: ${error.message}`;
            }
        },
        processData(data) {
            if (!data.length) return;

            // 构建列定义
            this.grid.columnDefs = data.types.map(([field, type]) => ({
                headerName: field.replace(/_/g, ' ').replace(/\$+/g, '').replace(/([a-z])([A-Z])/g, '$1 $2'), // 使列名更易读
                field: field.toLowerCase(),  // 确保 field 名称为小写
                sortable: true,
                filter: true,
                resizable: true
            }));

            // 构建行数据
            this.grid.rowData = data.map(row => {
                let rowData = {};
                row.forEach((cell, index) => {
                    // 使用小写的 field 名称来匹配列定义
                    let fieldName = data.types[index][0].toLowerCase();
                    // 特殊处理 JSON 字符串，确保 properties 能被正确解析
                    if (fieldName === 'properties' && typeof cell === 'string') {
                        try {
                            rowData[fieldName] = JSON.parse(JSON.stringify(cell));
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
