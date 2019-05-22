<template>
  <div class="wrapper">
    <div class="container c-pos-wrap clearfix">
      <div class="echarts-wrap c-pos-inner" id="echarts-1"></div>
    </div>
    <div class="container c-pos-wrap" id="echarts">
      <div class="echarts-wrap c-pos-inner" id="echarts-2"></div>
    </div>
    <div class="container c-pos-wrap" id="echarts">
      <div class="echarts-wrap c-pos-inner" id="echarts-3"></div>
    </div>
  </div>
</template>
<script>
    export default {
        name: "EchartsTest",
        data() {
            return {
                chart1:null,
                xData1:[],
                data1:[],

                xData: ['周一','周二','周三','周四','周五','周六','周日'],

                chart2:null,
                data2:[820, 932, 901, 934, 1290, 1330, {
                        value: 1320,
                        symbol: "circle",
                        symbolSize: 8,
                        itemStyle:{
                          color:'#fff'
                        }
                    }],

                chart3:null,
                data3:[{
                        name:'邮件营销',
                        type:'line',
                        stack: '总量',
                        smooth: true,
                        symbol: 'none',
                        data:[120, 132, 101, 134, 90, 230, {
                            value: 210,
                            symbol: "circle",
                            symbolSize: 8,
                            itemStyle:{
                              color:'#fff'
                            }
                        }]
                    },
                    {
                        name:'联盟广告',
                        type:'line',
                        stack: '总量',
                        smooth: true,
                        symbol: 'none',
                        data:[220, 182, 191, 234, 290, 330, {
                            value: 310,
                            symbol: "circle",
                            symbolSize: 8,
                            itemStyle:{
                              color:'#fff'
                            }
                        }]
                    },
                    {
                        name:'视频广告',
                        type:'line',
                        stack: '总量',
                        smooth: true,
                        symbol: 'none',
                        data:[150, 232, 201, 154, 190, 330, {
                            value: 410,
                            symbol: "circle",
                            symbolSize: 8,
                            itemStyle:{
                              color:'#fff'
                            }
                        }]
                    },
                    {
                        name:'直接访问',
                        type:'line',
                        stack: '总量',
                        smooth: true,
                        symbol: 'none',
                        data:[320, 332, 301, 334, 390, 330, {
                            value: 320,
                            symbol: "circle",
                            symbolSize: 8,
                            itemStyle:{
                              color:'#fff'
                            }
                        }]
                    },
                    {
                        name:'搜索引擎',
                        type:'line',
                        stack: '总量',
                        smooth: true,
                        symbol: 'none',
                        // symbol: 'circle',
                        // symbolSize: 8,
                        data:[820, 932, 901, 934, 1290, 1330, {
                            value: 1320,
                            symbol: "circle",
                            symbolSize: 8,
                            itemStyle:{
                              color:'#fff'
                            }
                        }]
                    }
                ]
            }
        },
        methods: {
            chartData1() {
                var _this = this;
                var i = 0;
                var d = [16, 18, 21, 22, 21, 21, 20];
                var d1 =  ['周一','周二','周三','周四','周五','周六','周日'];
                setInterval(function () {
                    if(i>6){
                        return;
                    }
                    let date = new Date();
                    let hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
                    let minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
                    let second = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
                    let time = hour + ':' + minute + ':' + second;
                    if(_this.xData1!=null&&_this.xData1.length>2){
                        _this.xData1.shift();
                        _this.data1.shift();

                    }
                    //有原点的点处理
                    if(_this.data1.length>0){
                        let oldData = _this.data1.pop();
                        _this.data1.push(oldData.value);
                    }

                    let lastSpeedData={
                        "value": d[i],
                        "symbol": "circle",
                        "symbolSize": 8,
                        itemStyle:{
                            color:'#ddd9d1'
                        }
                    };
                    _this.data1.push(lastSpeedData);

                    /*let date = _this.formateDate(json.result.timestamp);*/
                    _this.xData1.push(time);
                    i++
                    _this.getChart1();

                },1000)
            },
            getChart1(){
                this.chart1 = this.$echarts.init(document.getElementById('echarts-1'));
                var option = {
                    xAxis:  {
                        type: 'category',
                        boundaryGap: false,
                        data: this.xData1,
                        splitLine: {
                            lineStyle:{
                                color: '#fff',
                                lineStyle: {
                                    width: 4
                                }
                            },
                            show:true
                        },
                        axisLine:{
                            lineStyle:{
                                color:'#918d84'
                            }
                        },
                        axisTick:{
                            inside:true,
                            lineStyle:{
                                color:'#918d84'
                            }
                        },
                        axisLabel:{
                            color:'#918d84'
                        }
                    },
                    yAxis: {
                        type: 'value',
                        splitLine: {
                            lineStyle:{
                                color: '#918d84',
                                type: "dashed"
                            },
                            show:true
                        },
                        axisLine:{
                            show: false
                        },
                        axisTick:{
                            show: false
                        },
                        axisLabel:{
                            formatter: '{value} °C',
                            color:'#918d84'
                        },
                        data:[-25, -20, -15, -10, -5, 0, 5,10,15,20,25]
                    },
                    series: [{
                        name:'最高气温',
                        type:'line',
                        smooth: true,
                        symbol: 'none',
                        symbolSize: 2,
                        itemStyle: {
                            normal: {
                                color: "#fff"
                            }
                        },
                        data:this.data1
                    }]
                };
                this.chart1.setOption(option);
            },
            chartData2() {
                this.chart2 = this.$echarts.init(document.getElementById("echarts-2"));

                var initOption = this.getOption();
                var option = {
                    series: [{
                        name: "echart2",
                        type: 'line',
                        smooth: true,
                        symbol: 'none',
                        symbolSize: 2,
                        data: this.data2,
                        areaStyle: {}
                    }]
                };
                if (option && typeof option === "object") {
                    var finalOption = Object.assign(option,initOption);
                    this.chart2.setOption(finalOption, true);
                }
            },
            chartData3() {
                this.chart3 = this.$echarts.init(document.getElementById("echarts-3"));

                var initOption = this.getOption();
                var option = {
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data:['邮件营销','联盟广告','视频广告','直接访问','搜索引擎']
                    },
                    series: this.data3
                };
                if (option && typeof option === "object") {
                    var finalOption = Object.assign(option,initOption);
                    this.chart3.setOption(finalOption, true);
                }
            },
            getOption() {
                let option = {
                    grid:{
                        left:40
                    },
                    animation: false,
                    xAxis: {
                        type: 'category',
                        boundaryGap : false,
                        splitLine: {
                            interval(index, val) {
                                if(index == 6){
                                    return true;
                                }else{
                                    return false;
                                }
                            },
                            lineStyle:{
                                color: '#fff',
                                lineStyle: {
                                    width: 4
                                }
                            },
                            show:true
                        },
                        axisLine:{
                            lineStyle:{
                                color:'#918d84'
                            }
                        },
                        axisTick:{
                            inside:true,
                            lineStyle:{
                                color:'#918d84'
                            }
                        },
                        axisLabel:{
                            color:'#918d84'
                        },
                        data: this.xData
                    },
                    yAxis:  {
                        type: 'value',
                        splitLine: {
                            lineStyle:{
                            color: '#918d84',
                                type: "dashed"
                            },
                            show:true
                        },
                        axisLine:{
                            show: false
                        },
                        axisTick:{
                            show: false
                        },
                        axisLabel:{
                            color:'#918d84'
                        }
                    }
                }
                return option;
            },
        },
        mounted() {
            this.chartData1();
            this.chartData2();
            this.chartData3();
        }
    }
</script>
<style lang="scss" style scoped>
@import '@/assets/scss/theme.scss';
  .container{
    position: relative;
    float: left;
    width: 33%;
    padding-bottom: 33%;
    background-color: #000;
  }
</style>
