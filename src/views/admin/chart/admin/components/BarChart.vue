<template>
    <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
import resize from './mixins/resize'

require('echarts/theme/macarons') // echarts theme

const animationDuration = 6000

export default {
    mixins: [resize],
    props: {
        className: {
            type: String,
            default: 'chart'
        },
        width: {
            type: String,
            default: '100%'
        },
        height: {
            type: String,
            default: '300px'
        },
        barChartData: {
            type: Object,
            required: true
        },
    },
    data() {
        return {
            chart: null,
        }
    },
    watch: {
        barChartData: {
            deep: true,
            handler(val) {
                this.setOptions(val)
            }
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.initChart()
        })
    },
    beforeDestroy() {
        if (!this.chart) {
            return
        }
        this.chart.dispose()
        this.chart = null
    },
    methods: {
        initChart() {
            this.chart = echarts.init(this.$el, 'macarons');
            this.setOptions(this.barChartData);
        },
        setOptions({xAxisData, userCount, termCount, orderCount} = {}) {
            this.chart.setOption({
                title: {
                    text: "近俩周各项数据对比",
                    left: 'center',
                    top: 15
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: { // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                grid: {
                    top: 10,
                    left: '2%',
                    right: '2%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: [{
                    type: 'category',
                    data: xAxisData,
                    axisTick: {
                        alignWithLabel: true
                    }
                }],
                yAxis: [{
                    type: 'value',
                    axisTick: {
                        show: false
                    }
                }],
                series: [
                    {
                        name: '用户数',
                        type: 'bar',
                        stack: 'vistors',
                        barWidth: '60%',
                        data: userCount,
                        animationDuration
                    },
                    {
                        name: '营会数',
                        type: 'bar',
                        stack: 'vistors',
                        barWidth: '60%',
                        data: termCount,
                        animationDuration
                    },
                    {
                        name: '订单数',
                        type: 'bar',
                        stack: 'vistors',
                        barWidth: '60%',
                        data: orderCount,
                        animationDuration
                    }
                ]
            })
        }
    }
}
</script>
