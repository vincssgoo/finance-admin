<template>
  <div class="app-container" v-loading="listLoading">
    <div class="filter-container">时间段
      <el-date-picker
        v-model="detailQuery.start_datetime"
        type="date"
        value-format="yyyy-MM-dd"
        style="width: 200px"
      />至
      <el-date-picker
        v-model="detailQuery.end_datetime"
        type="date"
        value-format="yyyy-MM-dd"
        style="width: 200px;margin-right:20px"
      />
      <el-button type="success" @click="searcher">搜索</el-button>
      <div style="margin-top:20px;">
        <span style="margin-right:50px;">总收入：{{income_sum}}</span>
        <span>总收入：{{pay_sum}}</span>
      </div>
    </div>
    <!-- 折线图 -->
    <div class="chartBox">
      <div id="myChart1" :style="{width: '', height: '500px'}"></div>
      <div id="myChart2" ></div>
      <div id="myChart3" :style="{width: '', height: '500px'}"></div>
      <div id="myChart4" ></div>
    </div>
  </div>
</template>

<script>
// import statistical from "@/views/data/user_statistical";
import request from "@/utils/request";
let echarts = require("echarts/lib/echarts");
// 引入折线图组件
require("echarts/lib/chart/line");
require("echarts/lib/chart/pie");
// 引入提示框和title组件
require("echarts/lib/component/tooltip");
require("echarts/lib/component/title");
require("echarts/lib/component/legend");

export default {
  data() {
    return {
      listLoading: false,
      listQuery: {
        starttime: "",
        endtime: ""
      },
      detailQuery: {
        start_datetime: "",
        end_datetime: ""
      },
      pay_sum: 0,
      income_sum: 0,
      lineData: [],
      detail: {}
    };
  },
  mounted() {
    this.month = new Date().getMonth() + 1;
    let MonthNextFirstDay = new Date(
      new Date().getFullYear(),
      new Date().getMonth() + 1,
      1
    );
    let MonthLastDay = new Date(MonthNextFirstDay - 86400000);
    this.lastDay = MonthLastDay.getDate();
    if (this.month < 10) {
      this.detailQuery.start_datetime =
        new Date().getFullYear() + "-" + "0" + this.month + "-" + "01";
      this.detailQuery.end_datetime =
        new Date().getFullYear() + "-" + "0" + this.month + "-" + this.lastDay;
    } else {
      this.detailQuery.start_datetime =
        new Date().getFullYear() + "-" + this.month + "-" + "01";
      this.detailQuery.end_datetime =
        new Date().getFullYear() + "-" + this.month + "-" + this.lastDay;
    }
    this.getDetail();
  },
  methods: {
    getDetail() {
      this.detailQuery.start_datetime = this.detailQuery.start_datetime ? this.detailQuery.start_datetime + " 00:00:00" : ""
      this.detailQuery.end_datetime = this.detailQuery.end_datetime ? this.detailQuery.end_datetime + " 23:59:59" : ""
      this.listLoading = true
      request({
        url: "/api/backend/finance/index",
        method: "get",
        params: this.detailQuery
      }).then(res => {
        this.income_sum = res.data.income_sum;
        this.pay_sum = res.data.pay_sum;
        this.lineData[0] = res.data.to_day_income_list;
        this.drawLine(
          this.detailQuery.start_datetime,
          this.detailQuery.end_datetime,
          "myChart1"
        );
        this.lineData[2] = res.data.to_day_pay_list;
        this.drawLine(
          this.detailQuery.start_datetime,
          this.detailQuery.end_datetime,
          "myChart3"
        );
        this.myChart2 = echarts.init(document.getElementById('myChart2'))
        this.lineData[1] = res.data.income_percent;
        this.lineData[4] = res.data.income_type
        this.myChart4 = echarts.init(document.getElementById('myChart4'))
        this.lineData[3] = res.data.pay_percent;
        this.lineData[5] = res.data.pay_type
        this.myChart2.setOption({
          title: {
            text:'收入详情',
            left: 'center',
            top:50
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          legend: {
              orient: 'vertical',
              left: 'left',
              data: this.lineData[4]
            },
          series: [
            {
              name: '收入来源',
              type: 'pie',
              radius: '55%',
              center: ['50%', '60%'],
              data:this.lineData[1].sort(function (a, b) { return a.value - b.value; }),
              emphasis: {
                itemStyle: {
                  color: '#c23531',
                  shadowBlur: 200,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                },
              }
            }
          ]
        })
        this.myChart4.setOption({
            title: {
              text:'支出详情',
              left: 'center',
            top:50
            },
            tooltip: {
              trigger: 'item',
              formatter: '{a} <br/>{b} : {c} ({d}%)'
            },
            legend: {
              orient: 'vertical',
              left: 'left',
              data: this.lineData[5]
            },
            series: [
              {
                name: '支出来源',
                type: 'pie',
                radius: '55%',
                center: ['50%', '60%'],
                data:this.lineData[3],
                emphasis: {
                  itemStyle: {
                    color: '#c23531',
                    shadowBlur: 200,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                  },
                }
              }
            ]
          })
        });
        this.listLoading = false;
    },
    searcher() {
      if (!this.detailQuery.start_datetime || !this.detailQuery.end_datetime) {
        this.$message.warning("请选择开始和结束日期");
        return;
      }
      this.getDetail();
    },
    getText(value) {
      if (value == "myChart1") {
        return "收入";
      } else if (value == "myChart2") {
        return "收入详情";
      } else if (value == "myChart3") {
        return "支出";
      } else if (value == "myChart4") {
        return "支出详情";
      }
    },
    getName(value) {
      if (value == "myChart1") {
        return "收入";
      } else if (value == "myChart2") {
        // return "用户发布帖子次数";
      } else if (value == "myChart3") {
        return "支出";
      } else if (value == "myChart4") {
        // return "用户预订场地数量";
      }
    },
    getlineData(value) {
      if (value == "myChart1") {
        return this.lineData[0];
      } else if (value == "myChart2") {
        return this.lineData[1];
      } else if (value == "myChart3") {
        return this.lineData[2];
      } else if (value == "myChart4") {
        return this.lineData[3];
      }
    },
    drawLine(startdate, enddate, my_Chart) {
      // 基于准备好的dom，初始化echarts实例
      let starttime = startdate;
      let endtime = enddate;
      let date = this.get(starttime, endtime);
      // console.log(date)
      let myChart = echarts.init(document.getElementById(my_Chart));
      let temporary = [];
      for (let i = 0; i < date.length; i++) {
        temporary.push(date[i]);
      }
      // 绘制图表
      myChart.setOption({
        title: {
          text: this.getText(my_Chart)
        },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: ["流水量"]
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: temporary
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            name: this.getName(my_Chart),
            type: "line",
            stack: "总量",
            data: this.getlineData(my_Chart)
          }
        ]
      });
    },
    initChartsTwo() {
      // 基于准备好的dom，初始化echarts实例
      let starttime = this.detailQuery.start_datetime;
      let endtime = this.detailQuery.end_datetime;
      let date = this.get(starttime, endtime);
      let myChart2 = echarts.init(document.getElementById(myChart2));
      let temporary = [];
      this.myChart2.setOption({
        title: {
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        series: [
          {
            name: '收入详情',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            // data: this.getlineData(myChart2),
            data:[
                {value: 335, name: '直接访问'},
                {value: 310, name: '邮件营销'},
                {value: 274, name: '联盟广告'},
                {value: 235, name: '视频广告'},
                {value: 400, name: '搜索引擎'}
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
    },
    // drawCircle(startdate, enddate, my_Chart) {
    //   // 基于准备好的dom，初始化echarts实例
    //   let starttime = startdate;
    //   let endtime = enddate;
    //   let date = this.get(starttime, endtime);
    //   // console.log(date)
    //   let myChart = echarts.init(document.getElementById(my_Chart));
    //   let temporary = [];
    //   for (let i = 0; i < date.length; i++) {
    //     temporary.push(date[i]);
    //   }
    //   // temporary.push(date)
    //   // for (let i = 0; i < this.lineData.length; i++) {
    //   //   let day = parseInt(date[2]) + i
    //   //   if (day < 10) {
    //   //     day = '0'+day
    //   //   }
    //   //   temporary.push(date[1] + '/' + day)
    //   // }
    //   // console.log(this.lineData)
    //   // 绘制图表
    //   myChart.setOption({
    //     title: {
    //       text: this.getText(my_Chart)
    //     },
    //     tooltip: {
    //       trigger: "item",
    //       formatter: "{a} <br/>{b} : {c} ({d}%)"
    //     },

    //     visualMap: {
    //       show: false,
    //       min: 80,
    //       max: 600,
    //       inRange: {
    //         colorLightness: [0, 1]
    //       }
    //     },
    //     xAxis: {
    //       type: "category",
    //       boundaryGap: false,
    //       data: temporary
    //     },
    //     yAxis: {
    //       type: "value"
    //     },
    //     series: [
    //       {
    //         name: this.getName(my_Chart),
    //         type: "pie",
    //         radius: "55%",
    //         center: ["50%", "50%"],
    //         data: this.this.lineData[1].sort(function (a, b) { return a.price_sum - b.price_sum; }),
    //         roseType: "radius",
    //         label: {
    //           color: "rgba(255, 255, 255, 0.3)"
    //         },
    //         labelLine: {
    //           lineStyle: {
    //             color: "rgba(255, 255, 255, 0.3)"
    //           },
    //           smooth: 0.2,
    //           length: 10,
    //           length2: 20
    //         },
    //         itemStyle: {
    //           color: "#c23531",
    //           shadowBlur: 200,
    //           shadowColor: "rgba(0, 0, 0, 0.5)"
    //         },
    //         animationType: "scale",
    //         animationEasing: "elasticOut",
    //         animationDelay: function(idx) {
    //           return Math.random() * 200;
    //         }
    //       }
    //     ]
    //   });
    // },
    get(day1, day2) {
      let end_day =
        day2.split(" ")[0].split("-")[1] +
        "/" +
        day2.split(" ")[0].split("-")[2];
      //  console.log(end_day)
      var getDate = function(str) {
        var tempDate = new Date();
        var list = str.split("-");
        tempDate.setFullYear(list[0]);
        tempDate.setMonth(list[1] - 1);
        tempDate.setDate(list[2]);
        return tempDate;
      };
      var date1 = getDate(day1.split(" ")[0]);
      var date2 = getDate(day2.split(" ")[0]);
      if (date1 > date2) {
        var tempDate = date1;
        date1 = date2;
        date2 = tempDate;
      }
      date1.setDate(date1.getDate());
      var dateArr = [];
      var i = 0;
      while (
        !(
          date1.getFullYear() == date2.getFullYear() &&
          date1.getMonth() == date2.getMonth() &&
          date1.getDate() == date2.getDate()
        )
      ) {
        var dayStr = date1.getDate().toString();
        let monthStr = date1.getMonth() + 1;
        if (dayStr.length == 1) {
          dayStr = "0" + dayStr;
        }
        if (monthStr < 10) {
          monthStr = "0" + monthStr;
        }
        dateArr[i] = monthStr + "/" + dayStr; // date1.getFullYear() + "/" +
        i++;
        /*
         * document.write("<div style='display:block'>" + date1.getFullYear() +
         * "-" + (date1.getMonth() + 1) + "-" + date1.getDate() + "</div>");
         */
        // document.write(dateArr[i] + "<br>");
        date1.setDate(date1.getDate() + 1);
      }
      // dateArr.splice(0,0,day1)
      dateArr.push(end_day);
      // console.log(dateArr)
      return dateArr;
    }
  }
};
</script>

<style lang="scss" scoped>
.app-container {
  .chartBox {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    div {
      width: 49%;
    }
  }
}
</style>
