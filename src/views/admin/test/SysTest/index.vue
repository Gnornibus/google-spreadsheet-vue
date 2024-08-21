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
            apiKey: "phx_apIWBmYRALmdzndWYpV1lh1X5V6hitAFKqjLtq4799DgO81",
            host: "https://us.posthog.com",
            project: "85867",
            eventId: '',
            properties: '',
            data: "",
        };
    },
    methods: {
        async getEventBySpreadsheetId() {
            const url = `${this.host}/api/projects/${this.project}/query/`;
            const body = {
                query: {
                    kind: "HogQLQuery",
                    query: "select properties.sourceUrl AS '来源路径' from persons where properties.sourceUrl is not null",
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
                this.data = response.data;
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
                const response = await axios.get(url, { headers });
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
