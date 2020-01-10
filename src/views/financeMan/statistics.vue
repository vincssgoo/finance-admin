<template>
  <div class="app-container">
    <div class="block"
         style="margin-bottom:15px;">
      <span style="margin-left:40px;">时间段</span>
      <el-date-picker style="margin-left:20px;"
                      type="date"
                      placeholder="开始日期时间"
                      value-format="yyyy-MM-dd"></el-date-picker>
      至
      <el-date-picker type="date"
                      placeholder="结束日期时间"
                      value-format="yyyy-MM-dd">
      </el-date-picker>
      <el-button type="primary"
                 plain
                 style="float:right;"
                 icon="el-icon-search">搜索</el-button>
    </div>

    <div>
      <span style="font-size:15px;">总收入:1111111</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <span style="font-size:15px;">总支出:1111111</span>
    </div>

    <div class="two-charts">
      <div style="margin-top:40px;margin-left:50px;">
        <span>收入</span>
        <div id="chartOne"
             class="chart"></div>
      </div>

      <div style="margin-top:40px;margin-left:50px;">
        <span>收入占比</span>
        <div id="chartTwo"
             class="chart"></div>
      </div>
    </div>
    <div class="two-charts">
      <div style="margin-top:40px;margin-left:50px;">
        <span>支出</span>
        <div id="chartThree"
             class="chart"></div>
      </div>

      <div style="margin-top:40px;margin-left:50px;">
        <span>支出占比</span>
        <div id="chartFour"
             class="chart"></div>
      </div>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
export default {
  data () {
    return {
      myChartOne: null,
      myChartTwo: null,
      myChartThree: null,
      myChartFour: null,
      dataAll: {
        dataOne: [10, 15, 28, 12, 15],
        dataTwo: [15, 10, 20, 18, 10],
        dataThree: [10, 20, 30, 20, 10]
      },
      date: '',
      typeBoolean: true,
      data: '',
    }
  },
  computed: {
    type: function () {
      return this.typeBoolean ? 'bar' : 'line'
    }
  },
  methods: {
    initCharts () {
      this.myChartOne = echarts.init(document.getElementById('chartOne'))
      this.myChartTwo = echarts.init(document.getElementById('chartTwo'))
      this.myChartThree = echarts.init(document.getElementById('chartThree'))
      this.myChartFour = echarts.init(document.getElementById('chartFour'))
      this.myChartOne.setOption({
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: [820, 932, 901, 934, 1290, 1330, 1320],
          type: 'line'
        }]
      })

      this.myChartTwo.setOption({
        title: {
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
        },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: [
              { value: 335, name: '直接访问' },
              { value: 310, name: '邮件营销' },
              { value: 234, name: '联盟广告' },
              { value: 135, name: '视频广告' },
              { value: 1548, name: '搜索引擎' }
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]

      })
      // this.myChartOne.showLoading()
      this.myChartThree.setOption({
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: [820, 932, 901, 934, 1290, 1330, 1320],
          type: 'line'
        }]
      })

      this.myChartFour.setOption({
        title: {
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
        },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: [
              { value: 335, name: '直接访问' },
              { value: 310, name: '邮件营销' },
              { value: 234, name: '联盟广告' },
              { value: 135, name: '视频广告' },
              { value: 1548, name: '搜索引擎' }
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]

      })
      // echarts.connect([chartOne, chartTwo]);
      // echarts.connect([chartThree, chartFour]);
    },
  },
  mounted () {
    this.initCharts()
  }
}
</script>

<style scoped lang="scss">
.filter-charts {
  border: 1px solid rgba(155, 155, 155, 0.2);
}
.two-charts {
  display: flex;
  display: -webkit-flex;
  flex-wrap: wrap;
  .chart {
    height: 500px;
    width: 50%;
    min-width: 500px;
    padding-top: 20px;
  }
}
</style>
