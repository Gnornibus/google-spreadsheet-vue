<template>
    <div>
        <el-input v-model="eventId" placeholder="Enter Event ID"></el-input>
        <el-input v-model="properties" placeholder="Enter properties"></el-input>
        <el-button @click="getEventBySpreadsheetId">获取事件信息</el-button>
        <div v-if="data">
            <h3>Event Data:</h3>
            <pre>{{ data }}</pre>
        </div>
        <div v-else>
            <p>No data fetched yet.</p>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            configData: {
                id: "1819002266717372442",
                creUserId: "0",
                creTime: "2024-08-22 00:12:09",
                updUserId: "-1",
                updTime: "2024-08-22 00:15:18",
                version: 2,
                deleted: 0,
                tenantId: null,
                spreadsheetId: "15nnoeazZ52Q5HKZBP6c9sOgoVZD24p8Qa-HMLLQrNE4",
                status: "complete_config",
                statusName: "完成配置执行",
                remark: null,
                outputHeader: "TRUE",
                outputHeaderName: "是",
                ignoreDrive: "FALSE",
                ignoreDriveName: "否",
                sourceUrl: "15nnoeazZ52Q5HKZBP6c9sOgoVZD24p8Qa-HMLLQrNE4",
                sourceSheet: "PA_ALL",
                dataRange: "A4:G",
                judgeCondition: "email!=''",
                compareField: "email;submitted",
                outputField: "",
                outputMode: "first",
                cron: "5mins",
                targetUrl: "15nnoeazZ52Q5HKZBP6c9sOgoVZD24p8Qa-HMLLQrNE4",
                targetSheet: "PA_ALL_TEST",
                targetStart: ""
            },
            apiKey: "phx_apIWBmYRALmdzndWYpV1lh1X5V6hitAFKqjLtq4799DgO81",
            host: "https://us.posthog.com",
            project: "85867",
            eventId: '',
            properties: {
                sourceUrl: "15nnoeazZ52Q5HKZBP6c9sOgoVZD24p8Qa-HMLLQrNE4",
                sourceSheet: "PA_ALL",
            },
            data: "",
            showDialog: false,
            columnDefs: [
                {headerName: "UUID", field: "uuid"},
                {headerName: "Event", field: "event"},
                {headerName: "Properties", field: "properties"},
                {headerName: "Timestamp", field: "timestamp"},
                {headerName: "Service", field: "service"}
            ],
        };
    },
    methods: {
        async getEventBySpreadsheetId() {
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
                this.data = response.data.results;
            } catch (error) {
                console.error('Error fetching data:', error);
                this.data = `Failed to fetch data: ${error.message}`;
            }
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
