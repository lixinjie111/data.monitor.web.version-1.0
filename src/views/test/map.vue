<style>
  .container{
    width: 500px;
    height: 600px;
  }
</style>
<template>
  <div class="container" id="echart"></div>
</template>
<script>
    export default {
        data() {
            return {
              chart:{},
              xData:[],
              data:[],
              markDate:''
            }
        },
        methods: {
          getChart(){
            this.chart = this.$echarts.init(document.getElementById('echart'));
            var option = {
              title: {
                text: '未来一周气温变化',
                subtext: '纯属虚构'
              },
              tooltip: {
                trigger: 'axis'
              },
              xAxis:  {
                type: 'category',
                boundaryGap: false,
                data: this.xData,
                splitLine: {
                  lineStyle:{
                    color:['gray'],
                    type: "dashed"
                  },
                  show:true
                },
                axisLine:{
                  lineStyle:{
                    color:'red'
                  }
                },
                axisTick:{
                  inside:true,
                  lineStyle:{
                    color:'green'
                  }
                },
                axisLabel:{
                  color:'black'
                },
              },
              yAxis: {
                type: 'value',
                axisLabel: {
                  formatter: '{value} °C'
                },
                data:[-25, -20, -15, -10, -5, 0, 5,10,15,20,25]
              },
              series: [
                {
                  name:'最高气温',
                  type:'line',
                  data:this.data
                }
              ]
            };
            this.chart.setOption(option);
          }
        },
        mounted() {
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
            if(_this.xData!=null&&_this.xData.length>2){
              _this.xData.shift();
              _this.data.shift();

            }
            //有原点的点处理
            if(_this.data.length>0){
              let oldData = _this.data.pop();
              _this.data.push(oldData.value);
            }

            let lastSpeedData={
              "value": d[i],
              "symbol": "circle",
              "symbolSize": 8,
              itemStyle:{
                color:'#ddd9d1'
              }
            };
            _this.data.push(lastSpeedData);

            /*let date = _this.formateDate(json.result.timestamp);*/
            _this.xData.push(time);
            //对线的处理
            _this.markDate= d1[i];
            i++
            _this.getChart();

          },1000)
        }
    }
</script>
<style scoped></style>
