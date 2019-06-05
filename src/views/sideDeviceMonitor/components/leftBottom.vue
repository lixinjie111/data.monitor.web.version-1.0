<template>
  <div>
    <h3 class="c-title">累计数据</h3>
    <div id="sideTotalId" class="side-total-echarts"></div>
    <h3 class="c-title">设备实时数据</h3>
    <div id="sideRealId" class="side-real-echarts"></div>
  </div>
</template>
<script>
    export default {
        data() {
            return {
              sideTotalEcharts:{},
              sideRealEcharts:{}
            }
        },
        methods: {
          totalOption(data) {
            let option = {
              grid:{
                x: 0,
                y: 0,
                x2: 0,
                y2: 0
              },
              xAxis: {
                type: 'category',
                splitLine: {
                  show:false
                },
                axisLine:{
                  lineStyle:{
                    color:'rgba(211, 134, 0 , 0.4)'
                  }
                },
                axisTick:{
                  show:false
                },
                axisLabel:{
                  interval: 5,
                  textStyle: {
                    color: "#918d84"
                  }
                }
              },
              yAxis:  {
                type: 'value',
                show: false
              },
              series: [{
                name: "累计数据",
                type: 'line',
                smooth: true,
                symbol: 'none',
                symbolSize: 2,
                lineStyle: {
                  color: 'rgba(55, 186, 123, .2)',
                  opacity: 0
                },
                areaStyle: {
                  color: 'rgba(55, 186, 123, .2)'
                },
               /* data: data*/
                data: [245, 182, 434, 791, 390, 245, 465, 245, 182, 434, 791, 390, 245, 465, 245, 182, 434, 791, 390, 245, 465, 245, 182, 434, 121]
              }]
            };
            return option;
          },
          realOption(){
            let option = {
              grid:{
                x: 0,
                y: 0,
                x2: 0,
                y2: 0
              },
              xAxis: {
                type: 'category',
                show:false
              },
              yAxis: {
                type: 'value',
                splitLine: {
                  show:false
                },
                show:false
              },
              series: [{
                data: [820, 932, 901, 934, 1290, 1330, 1320],
                type: 'line',
                smooth: true,
                symbol: 'none',
                lineStyle: {
                  color: '#936314',
                }
              },
                {
                  data: [700, 632, 501, 334, 990, 730, 520],
                  type: 'line',
                  smooth: true,
                  symbol: 'none',
                  lineStyle: {
                    color: '#2c815f',
                  }
                },
                {
                  data: [770, 632, 801, 734, 690, 230, 120],
                  type: 'line',
                  smooth: true,
                  symbol: 'none',
                  lineStyle: {
                    color: '#368099',
                  }
                },
                {
                  data: [420, 532, 101,734, 190, 830, 920],
                  type: 'line',
                  smooth: true,
                  symbol: 'none',
                  lineStyle: {
                    color: '#ff0000',
                  }
                }]
            };
            return option;
          }
        },
        mounted() {
          this.sideTotalEcharts = this.$echarts.init(document.getElementById("sideTotalId"));
          var option = this.totalOption();
          this.sideTotalEcharts.setOption(option);
          this.sideRealEcharts = this.$echarts.init(document.getElementById("sideRealId"));
          var realOption = this.realOption();
          this.sideRealEcharts.setOption(realOption);
        }
    }
</script>
<style scoped>
  .side-total-echarts{
    margin:28px 0px 58px 0px;
    height: 68px;
  }
  .side-real-echarts{
    height: 60px;
    margin-top: 28px;
  }
</style>
