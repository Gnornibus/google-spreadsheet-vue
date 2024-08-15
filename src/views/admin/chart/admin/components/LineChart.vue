<template>
    <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
import resize from './mixins/resize'

require('echarts/theme/macarons') // echarts theme

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
            default: '350px'
        },
        autoResize: {
            type: Boolean,
            default: true
        },
        chartData: {
            type: Object,
            required: true
        },
        xAxisData: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            chart: null
        }
    },
    watch: {
        chartData: {
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
            this.chart = echarts.init(this.$el, 'macarons')
            this.setOptions(this.chartData)
        },
        setOptions({title, lastWeek, thisWeek} = {}) {
            this.chart.setOption({
                title: {
                    text: title,
                    left: 'right',
                    top: 0
                },
                xAxis: {
                    data: this.xAxisData,
                    boundaryGap: false,
                    axisTick: {
                        show: false
                    }
                },
                grid: {
                    left: 10,
                    right: 10,
                    bottom: 20,
                    top: 30,
                    containLabel: true
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross'
                    },
                    padding: [5, 10]
                },
                yAxis: {
                    axisTick: {
                        show: false
                    }
                },
                legend: {
                    data: ['上周', '本周']
                },
                series: [{
                    name: '上周', itemStyle: {
                        normal: {
                            color: '#3888fa',
                            lineStyle: {
                                color: '#3888fa',
                                width: 2
                            }
                        }
                    },
                    smooth: true,
                    type: 'line',
                    data: lastWeek,
                    animationDuration: 2800,
                    animationEasing: 'cubicInOut'
                }, {
                    name: '本周',
                    smooth: true,
                    type: 'line',
                    itemStyle: {
                        normal: {
                            color: '#FF005A',
                            lineStyle: {
                                color: '#FF005A',
                                width: 2
                            },
                            areaStyle: {
                                color: '#f3f8ff'
                            }
                        }
                    },
                    data: thisWeek,
                    animationDuration: 2800,
                    animationEasing: 'quadraticOut'
                }]
            })
        }
    }
}
</script>
