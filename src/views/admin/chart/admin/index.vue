<template>
    <div class="dashboard-editor-container">

        <panel-group @handleSetLineChartData="handleSetLineChartData" />

        <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:16px;">
            <line-chart :chart-data="lineChartData" :x-axis-data="xAxisData" />
        </el-row>

        <el-row>
            <div class="chart-wrapper">
                <bar-chart :bar-chart-data="barChartData" />
            </div>
        </el-row>
        <!--        <el-row :gutter="32">-->
        <!--            <el-col :lg="8" :sm="24" :xs="24">-->
        <!--                <div class="chart-wrapper">-->
        <!--                    <raddar-chart />-->
        <!--                </div>-->
        <!--            </el-col>-->
        <!--            <el-col :lg="8" :sm="24" :xs="24">-->
        <!--                <div class="chart-wrapper">-->
        <!--                    <pie-chart />-->
        <!--                </div>-->
        <!--            </el-col>-->
        <!--            <el-col :lg="8" :sm="24" :xs="24">-->
        <!--                <div class="chart-wrapper">-->
        <!--                    <bar-chart :bar-chart-data="barChartData" />-->
        <!--                </div>-->
        <!--            </el-col>-->
        <!--        </el-row>-->

        <!--        <el-row :gutter="8">-->
        <!--            <el-col :lg="{span: 12}" :md="{span: 24}" :sm="{span: 24}" :xl="{span: 12}" :xs="{span: 24}"-->
        <!--                    style="padding-right:8px;margin-bottom:30px;">-->
        <!--                <transaction-table />-->
        <!--            </el-col>-->
        <!--            <el-col :lg="{span: 6}" :md="{span: 12}" :sm="{span: 12}" :xl="{span: 6}" :xs="{span: 24}" style="margin-bottom:30px;">-->
        <!--                <todo-list />-->
        <!--            </el-col>-->
        <!--            <el-col :lg="{span: 6}" :md="{span: 12}" :sm="{span: 12}" :xl="{span: 6}" :xs="{span: 24}" style="margin-bottom:30px;">-->
        <!--                <box-card />-->
        <!--            </el-col>-->
        <!--        </el-row>-->
    </div>
</template>

<script>
import PanelGroup from './components/PanelGroup'
import LineChart from './components/LineChart'
import RaddarChart from './components/RaddarChart'
import PieChart from './components/PieChart'
import BarChart from './components/BarChart'
import TransactionTable from './components/TransactionTable'
import TodoList from './components/TodoList'
import BoxCard from './components/BoxCard'
import {selectLineChartData} from "@/api/sys-data-api";

let lineChartData = {}

export default {
    name: 'DashboardAdmin',
    components: {
        PanelGroup,
        LineChart,
        RaddarChart,
        PieChart,
        BarChart,
        TransactionTable,
        TodoList,
        BoxCard
    },
    data() {
        return {
            xAxisData: lineChartData.xAxisData,
            lineChartData: lineChartData.userCount,
            barChartData: {
                xAxisData: [],
                userCount: [],
                termCount: [],
                orderCount: []
            }
        }
    },
    beforeCreate() {
        lineChartData = {
            xAxisData: [],
            userCount: {
                title: "近俩周用户新增数据",
                lastWeek: [],
                thisWeek: []
            },
            termCount: {
                title: "近俩周营会新增数据",
                lastWeek: [],
                thisWeek: []
            },
            orderCount: {
                title: "近俩周订单数据",
                lastWeek: [],
                thisWeek: []
            },
            totalAmount: {
                title: "近俩周收入金额",
                lastWeek: [],
                thisWeek: []
            }
        }
        selectLineChartData().then(res => {
            res.data.forEach((item, index) => {
                this.barChartData.xAxisData.push(item.axisData);
                this.barChartData.userCount.push(item.userCount);
                this.barChartData.termCount.push(item.termCount);
                this.barChartData.orderCount.push(item.orderCount);
                if (index <= 6) {
                    lineChartData.userCount.lastWeek.push(item.userCount);
                    lineChartData.termCount.lastWeek.push(item.termCount);
                    lineChartData.orderCount.lastWeek.push(item.orderCount);
                    lineChartData.totalAmount.lastWeek.push(item.totalAmount);
                } else if (index > 6) {
                    lineChartData.xAxisData.push(item.axisData);
                    lineChartData.userCount.thisWeek.push(item.userCount);
                    lineChartData.termCount.thisWeek.push(item.termCount);
                    lineChartData.orderCount.thisWeek.push(item.orderCount);
                    lineChartData.totalAmount.thisWeek.push(item.totalAmount);
                }
            })
        })
    },
    methods: {
        handleSetLineChartData(type) {
            this.lineChartData = lineChartData[type]
        },
    }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
    padding: 2px 20px;
    background-color: rgb(240, 242, 245);
    position: relative;

    .chart-wrapper {
        background: #fff;
        padding: 16px 16px 0;
        margin-bottom: 32px;
    }
}

@media (max-width: 1024px) {
    .chart-wrapper {
        padding: 8px;
    }
}
</style>
