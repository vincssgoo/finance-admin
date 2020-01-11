<template>
  <div :class="className" :id="id" :style="{height:height,width:width}" :name="name" :statistics="statistics" :start_datetime="start_datetime"/>
</template>

<script>
import echarts from 'echarts'
import resize from './mixins/resize'
import { getBehindDateDiagonal } from '@/utils/index'

export default {
  mixins: [resize],
  props: {
    name: {
      type: String,
      default: 'name'
    },
    className: {
      type: String,
      default: 'chart'
    },
    id: {
      type: String,
      default: 'order_chart'
    },
    statistics: {
      type: Array,
      default: []
    },
    start_datetime: {
      type: String,
      default: ''
    },
    width: {
      type: String,
      default: '200px'
    },
    height: {
      type: String,
      default: '200px'
    },
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.initChart()
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  watch: {
    statistics() {
      this.initChart()
    }
  },
  methods: {
    initChart() {
      this.chart = echarts.init(document.getElementById(this.id))
      let statistics = this.statistics
      let start_datetime = this.start_datetime.substring(0, 10)
      const xData = (function() {
        const data = []
        for (let i = 0; i <= statistics.length; i++) {
          if (start_datetime) {
            data.push(getBehindDateDiagonal(start_datetime, i))
          } else {
            data.push(i)
          }
        }
        return data
      }())
      this.chart.setOption({
        backgroundColor: '#344b58',
        title: {
          text: this.name,
          x: '20',
          top: '20',
          textStyle: {
            color: '#fff',
            fontSize: '22'
          },
          subtextStyle: {
            color: '#90979c',
            fontSize: '16'
          },
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            textStyle: {
              color: '#fff'
            }
          }
        },
        grid: {
          left: '5%',
          right: '5%',
          borderWidth: 0,
          top: 150,
          bottom: 95,
          textStyle: {
            color: '#fff'
          }
        },
        legend: {
          x: '5%',
          top: '10%',
          textStyle: {
            color: '#90979c'
          },
          data: []
        },
        calculable: true,
        xAxis: [{
          type: 'category',
          axisLine: {
            lineStyle: {
              color: '#90979c'
            }
          },
          splitLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitArea: {
            show: false
          },
          axisLabel: {
            interval: 0

          },
          data: xData
        }],
        yAxis: [{
          type: 'value',
          splitLine: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#90979c'
            }
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            interval: 0
          },
          splitArea: {
            show: false
          }
        }],
        series: [{
          name: 'total',
          type: 'line',
          stack: 'total',
          symbolSize: 10,
          symbol: 'circle',
          itemStyle: {
            normal: {
              color: 'rgba(252,230,48,1)',
              barBorderRadius: 0,
              label: {
                show: true,
                position: 'top',
                formatter(p) {
                  return p.value > 0 ? p.value : ''
                }
              }
            }
          },
          data: this.statistics
        }
        ]
      })
    }
  }
}
</script>
