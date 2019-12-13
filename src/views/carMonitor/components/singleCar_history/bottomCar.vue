<template>

  <div class="car-bottom">
    <div class="curve-container">
      <div id="canvasContainer" class="curve-style">
        <img src="@/assets/images/car/car-7.png" class="img1"/>
        <img src="@/assets/images/car/car-8.png" class="img2"/>
        <img src="@/assets/images/car/car-22.png" class="img3"/>
        <canvas id="up0" class="upCanvas"></canvas>
        <canvas id="upImg0" class="upCanvas"></canvas>
        <img id="upPlan0" src="@/assets/images/car/circle.png"style="display: none;">
        <canvas id="up1" class="upCanvas" ></canvas>
        <canvas id="upImg1" class="upCanvas"></canvas>
        <img id="upPlan1" src="@/assets/images/car/circle.png" style="display: none;">
        <canvas id="up2" class="upCanvas" ></canvas>
        <canvas id="upImg2" class="upCanvas" ></canvas>
        <img id="upPlan2" src="@/assets/images/car/circle.png" style="display: none;">
        <canvas id="up3" class="upCanvas" ></canvas>
        <canvas id="upImg3" class="upCanvas"></canvas>
        <img id="upPlan3" src="@/assets/images/car/circle.png" style="display: none;">
        <canvas id="upImg4" class="upCanvas" ></canvas>
        <img id="upPlan4" src="@/assets/images/car/circle.png" style="display: none;">
        <canvas id="upImg5" class="upCanvas" ></canvas>
        <img id="upPlan5" src="@/assets/images/car/circle.png" style="display: none;">
        <canvas id="upImg6" class="upCanvas" ></canvas>
        <img id="upPlan6" src="@/assets/images/car/circle.png" style="display: none;">
        <canvas id="upImg7" class="upCanvas" ></canvas>
        <img id="upPlan7" src="@/assets/images/car/circle.png" style="display: none;">
        <canvas id="upImg8" class="upCanvas" ></canvas>
        <img id="upPlan8" src="@/assets/images/car/circle.png" style="display: none;">
        <canvas id="upImg9" class="upCanvas"></canvas>
        <img id="upPlan9" src="@/assets/images/car/circle.png" style="display: none;">
        <canvas id="upImg10" class="upCanvas" ></canvas>
        <img id="upPlan10" src="@/assets/images/car/circle.png" style="display: none;">
        <canvas id="upImg11" class="upCanvas"></canvas>
        <img id="upPlan11" src="@/assets/images/car/circle.png" style="display: none;">

        <canvas id="upImg12" class="upCanvas"></canvas>
        <img id="upPlan12" src="@/assets/images/car/circle.png" style="display: none;" >
        <canvas id="upImg13" class="upCanvas"></canvas>
        <img id="upPlan13" src="@/assets/images/car/circle.png" style="display: none;" >
        <canvas id="upImg14" class="upCanvas"></canvas>
        <img id="upPlan14" src="@/assets/images/car/circle.png" style="display: none;">
        <canvas id="upImg15" class="upCanvas"></canvas>
        <img id="upPlan15" src="@/assets/images/car/circle.png" style="display: none;">



        <canvas id="down0" class="downCanvas" ></canvas>
        <canvas id="downImg0" class="downCanvas" ></canvas>
        <img id="downPlan0" src="@/assets/images/car/circle.png" style="display: none;">
        <canvas id="down1" class="downCanvas" ></canvas>
        <canvas id="downImg1" class="downCanvas" ></canvas>
        <img id="downPlan1" src="@/assets/images/car/circle.png" style="display: none;">
        <canvas id="down2" class="downCanvas"></canvas>
        <canvas id="downImg2" class="downCanvas"></canvas>
        <img id="downPlan2" src="@/assets/images/car/circle.png" style="display: none;">
        <canvas id="down3" class="downCanvas"></canvas>
        <canvas id="downImg3" class="downCanvas"></canvas>
        <img id="downPlan3" src="@/assets/images/car/circle.png" style="display: none;">
        <canvas id="downImg4" class="downCanvas"></canvas>
        <img id="downPlan4" src="@/assets/images/car/circle.png" style="display: none;">
        <canvas id="downImg5" class="downCanvas"></canvas>
        <img id="downPlan5" src="@/assets/images/car/circle.png" style="display: none;">
        <canvas id="downImg6" class="downCanvas"></canvas>
        <img id="downPlan6" src="@/assets/images/car/circle.png" style="display: none;">
        <canvas id="downImg7" class="downCanvas"></canvas>
        <img id="downPlan7" src="@/assets/images/car/circle.png" style="display: none;">
        <canvas id="downImg8" class="downCanvas" ></canvas>
        <img id="downPlan8" src="@/assets/images/car/circle.png" style="display: none;">
        <canvas id="downImg9" class="downCanvas" ></canvas>
        <img id="downPlan9" src="@/assets/images/car/circle.png" style="display: none;">
        <canvas id="downImg10" class="downCanvas" ></canvas>
        <img id="downPlan10" src="@/assets/images/car/circle.png" style="display: none;">
        <canvas id="downImg11" class="downCanvas" ></canvas>
        <img id="downPlan11" src="@/assets/images/car/circle.png" style="display: none;">

        <canvas id="downImg12" class="downCanvas" ></canvas>
        <img id="downPlan12" src="@/assets/images/car/circle.png" style="display: none;">
        <canvas id="downImg13" class="downCanvas"></canvas>
        <img id="downPlan13" src="@/assets/images/car/circle.png" style="display: none;">
        <canvas id="downImg14" class="downCanvas"></canvas>
        <img id="downPlan14" src="@/assets/images/car/circle.png" style="display: none;" >

      </div>
      <div class="legend-style">
        <p><span class="legend-size" style="background: #d47b24"></span>GPS+CAN</p>
        <p><span class="legend-size" style="background: #595450"></span>EVENT</p>
        <p><span class="legend-size" style="background: #2acdc2"></span>BSM</p>
        <p><span class="legend-size" style="background: #d3d12d"></span>PER</p>
        <p><span class="legend-size" style="background: #6ec9fd"></span>SPAT</p>

      </div>
    </div>
    <div class="chart-region">
      <div class="chart-title title1">
        <img src="@/assets/images/car/car-10.png" class="chart-title-img"/>
        <span>速度（km/h）</span>
      </div>
      <div id="speedChart" class="speed-chart chart1"></div>
      <div class="chart-title title2">
        <img src="@/assets/images/car/car-10.png" class="chart-title-img"/>
        <span>加速度（m/s²）</span>
      </div>
      <div id="accelerateChart" class="speed-chart chart2"></div>
      <div class="chart-mask" v-if="isStop">车辆已停驶</div>
    </div>
  </div>

</template>
<script>
  import Curve from '@/assets/js/utils/curve.js';
  import $echarts from 'echarts'
  export default {
    name:"bottom-car",
    data () {
      return {
        vehicleId: this.$route.params.vehicleId,

        speedChart:{},
        accelerateChart:{},
        xData:[],
        data:[NaN,NaN,NaN,NaN,NaN],
        accelerateData:[NaN,NaN,NaN,NaN,NaN],
        isStop: false,

        container:{},
        webSocket:null,
        reportWebSocket:{},

        i:0,
        k:3,
        m : 6,
        n :9,

        j:0,
        upRandom:0.1,
        canRandom:0,
        gpsRandom:0,
        perRandom:0,
        eventRandom:0,

        downRandom:0.2,
        spatRandom:0,

        n1:0

      }
    },
    props:{
      vehWsData:{
        type:Object,
        default() {
          return {};
        }
      }
    },
    watch:{
      vehWsData(newVal,oldVal){
        this.onmessage(newVal);
      },
    },
    methods: {
      getSpeedChart(){
        var _self = this;
        var option = {
          animation: false,
          grid:{
            left:32,
            bottom: 40
          },
          xAxis: {
            type: 'category',
            boundaryGap : false,
            splitLine: {
              interval(index, val) {
                if(index == 4){
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
              color:'#918d84'
            },
            min: 0,
            max: 120
          },
          series: [
            {
              name:'速度',
              type:'line',
              smooth: true,
              symbol: 'none',
              symbolSize: 2,
              itemStyle: {
                normal: {
                    color: "#fff"
                }
              },
              data: this.data,
              animationDuration: 500,
              animationEasing: "quadraticOut"
            }
          ]
        }
        _self.speedChart.setOption(option);
      },
      getAccelerateChart(){
        var _self = this;
        var option = {
          animation: false,
          grid:{
            left:20,
            bottom: 40
          },
          xAxis: [{
              type: 'category',
              boundaryGap : false,
              data: this.xData,
              onZero:true,
              show:false
            },{
              type: 'category',
              boundaryGap : false,
              position:'bottom',
              splitLine: {
                interval(index, val) {
                  if(index == 4){
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
          }],
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
              color:'#918d84'
            },
            min: -3,
            max: 3
          },
          series: [
            {
              name:'加速度',
              type:'line',
              smooth: true,
              symbol: 'none',
              symbolSize: 2,
              itemStyle: {
                normal: {
                    color: "#fff"
                }
              },
              data: this.accelerateData
            }
          ]
        }
        _self.accelerateChart.setOption(option);
      },
      formateDate(timestamp, subNum){
        let timeArr = [];
        for(let i = subNum-1; i >= 0; i--){
          let _date = new Date(timestamp - i*1000),
              _minute = 0,
              _second = 0;
          _minute = _date.getMinutes() < 10 ? "0" + _date.getMinutes() : _date.getMinutes();
          _second = _date.getSeconds() < 10 ? "0" + _date.getSeconds() : _date.getSeconds();
          timeArr.push(_minute + ':' + _second);
        };
        return timeArr;
      },
      // initWebSocket(){
      //   let _this=this;
      //   if ('WebSocket' in window) {
      //     _this.webSocket = new WebSocket(window.config.socketUrl);  //获得WebSocket对象
      //   }
      //   _this.webSocket.onmessage = _this.onmessage;
      //   _this.webSocket.onclose = _this.onclose;
      //   _this.webSocket.onopen = _this.onopen;
      //   _this.webSocket.onerror = _this.onerror;
      // },
      onmessage(message){
        let _this=this;
        
        var json = message.result.track[0],
            gpsTime = json.gpsTime,
            speed = json.speed,
            acceleration = json.acceleration;
        if(gpsTime){
          //动态数据
          this.isStop = false;
          if(_this.data.length>4){
            _this.data.shift();
          }
          if(_this.accelerateData.length>4){
            _this.accelerateData.shift();
          }
          this.data.push(speed);
          this.data = this.data.map((item, index, arr) => {
            return index != arr.length -1 ? ( item.value != undefined   ? item.value : item ) : {
                value: item,
                symbol: "circle",
                symbolSize: 8,
                itemStyle:{
                  color:'#fff'
                }
              }
          });
          this.accelerateData.push(acceleration);
          this.accelerateData = this.accelerateData.map((item, index, arr) => {
            return index != arr.length -1 ? (  item.value != undefined ? item.value : item ) : {
                value: item,
                symbol: "circle",
                symbolSize: 8,
                itemStyle:{
                  color:'#fff'
                }
              }
          });
          // console.log("速度： "+speed, "加速度： "+acceleration);
          this.xData = this.formateDate(gpsTime, 5);
          //对线的处理
          this.getSpeedChart();
          this.getAccelerateChart();
          // console.log(gpsTime,this.formateDate(gpsTime, 1));
          // console.log(json);
        }else {
          this.isStop = true;
        }
      },
      // onclose(data){
      //   console.log("结束连接");
      // },
      // onopen(data){
      //   console.log("建立连接,,,,,,");

      //   //获取速度加速度
      //   var speed = {
      //     'action':'track',
      //     /*'vid':this.vehicleID,*/
      //     'vehicleId':this.vehicleId
      //   }
      //   var speedMsg = JSON.stringify(speed);
      //   this.sendMsg(speedMsg);
      // },
      // sendMsg(msg) {
      //   let _this=this;
      //   if(window.WebSocket){
      //     if(_this.webSocket.readyState == WebSocket.OPEN) { //如果WebSocket是打开状态
      //       // console.log("speedAcceleration 发送请求成功");
      //       _this.webSocket.send(msg); //send()发送消息
      //     }
      //   }else{
      //     return;
      //   }
      // },
      realReportWebSocket(){
        let _this=this;
        if ('WebSocket' in window) {
          _this.reportWebSocket = new WebSocket(window.config.websocketUrl);  //获得WebSocket对象
        }
        _this.reportWebSocket.onmessage = _this.onReportMessage;
        _this.reportWebSocket.onclose = _this.onReportClose;
        _this.reportWebSocket.onopen = _this.onReportOpen;
      },
      onReportMessage(message){
        let _this=this;
        var json = JSON.parse(message.data);
        var data = json.result.reportItems;
        _this.n1++;

        var canGpsData=[];
        var bsmData=[];
        var perData=[];
        var eventData=[];

        var spatData = [];

        if(_this.i>=3){
          _this.i=0;
        }
        if(_this.k>=6){
          _this.k=3;
        }
        if(_this.m>=9){
          _this.m=6;
        }
        if(_this.n>=12){
          _this.n=9;
        }

        if(_this.j>=4){
          _this.j=0;
        }


        if(data.length>0) {
          data.forEach(function (item) {
            if (item.type == 'GPS+CAN') {
              canGpsData.push(item);
            }
            if (item.type == 'BSM') {
              bsmData.push(item);
            }
            if (item.type == 'PER') {
              perData.push(item);
            }
            if (item.type == 'EVENT') {
              eventData.push(item);
            }

            if (item.type == 'SPAT') {
              spatData.push(item);
            }
          })

          if(canGpsData.length>0){
            let curve1 = new Curve();
            curve1.drawImgs(_this.gpsRandom,'GPS+CAN','up',_this.i,[130, 142], [320, 58],'#6ec9fd');
            _this.i++;
          }
          if(bsmData.length>0){
            let curve2 = new Curve();
            curve2.drawImgs(_this.canRandom,'BSM','up',_this.k,[130, 142], [320, 58],'#3db765');
            _this.k++;
          }

          if(perData.length>0){
            let curve3 = new Curve();
            curve3.drawImgs(_this.perRandom,'PER','up',_this.m,[130, 142], [320, 58],'#d47b24');
            _this.m++;
          }

          if(eventData.length>0){
            let curve4 = new Curve();
            curve4.drawImgs(_this.eventRandom,'EVENT','up',_this.n,[130, 142], [320, 58],'#59d44f');
            _this.n++;
          }


          if(spatData.length>0){
            let downCurve1 = new Curve();
            downCurve1.drawImgs("-"+_this.spatRandom,'SPAT','down',_this.j,[552, 150],[356, 55],'#59d44f');//信号灯
            _this.j++;
          }
        }
      },
      onReportOpen(data){
        //获取速度加速度
        var reportData = {
          'action':'vehicleDataCount',
          /*'vid':this.vehicleID,*/
          'vehicleId':this.vehicleId,
          'token':''
        }
        var reportMsg = JSON.stringify(reportData);
        this.sendReportMsg(reportMsg);
      },
      sendReportMsg(msg) {
        let _this=this;
        if(window.WebSocket){
          if(_this.reportWebSocket.readyState == WebSocket.OPEN) { //如果WebSocket是打开状态
            _this.reportWebSocket.send(msg); //send()发送消息
          }
        }else{
          return;
        }
      },
      onReportClose(data){
        console.log("结束连接");
      }

    },
    mounted () {
      var _this = this;
      _this.container = document.getElementById('canvasContainer');
      //速度和加速度
      _this.speedChart = $echarts.init(document.getElementById('speedChart'));
      _this.accelerateChart = $echarts.init(document.getElementById('accelerateChart'));
      //开始画gps的第一条线
      let curve1 = new Curve();
      curve1.drawLines(_this.upRandom,'#d47b24','up',0,[130, 142], [320, 58]);
      curve1.drawImgs(_this.upRandom,'GPS+CAN','up',12,[130, 142], [320, 58],'#6ec9fd');
      _this.gpsRandom = _this.upRandom;
      _this.upRandom=_this.upRandom+0.2;
      //开始画can的第一条线
      let curve2 = new Curve();
      curve2.drawLines(_this.upRandom,'#2acdc2','up',1,[130, 142], [320, 58]);
      curve2.drawImgs(_this.upRandom,'BSM','up',13,[130, 142], [320, 58],'#3db765');
      _this.canRandom = _this.upRandom;
      _this.upRandom=_this.upRandom+0.2;
      //开始画perception的第一条线
      let curve3 = new Curve();
      curve3.drawLines(_this.upRandom,'#d3d12d','up',2,[130, 142], [320, 58]);
      curve3.drawImgs(_this.upRandom,'PER','up',14,[130, 142], [320, 58],'#d47b24');
      _this.perRandom = _this.upRandom;
      _this.upRandom=_this.upRandom+0.2;
      //开始画event的第一条线
      let curve4 = new Curve();
      curve4.drawLines(_this.upRandom,'#595450','up',3,[130, 142], [320, 58]);
      curve4.drawImgs(_this.upRandom,'EVENT','up',15,[130, 142], [320, 58],'#59d44f');
      _this.eventRandom = _this.upRandom;
      _this.upRandom=_this.upRandom+0.2;
      //开始画spat的第一条线
      let downCurve1 = new Curve();
      downCurve1.drawLines("-"+_this.downRandom,'#6ec9fd','down',0,[552, 150],[356, 55]);
      downCurve1.drawImgs("-"+_this.downRandom,'SPAT','down',12, [552, 150],[356, 55],'#59d44f');//信号灯
      _this.spatRandom = _this.downRandom;

      // _this.initWebSocket();
      _this.realReportWebSocket();
    },
    destroyed(){
      //销毁Socket
      this.reportWebSocket.close();
      this.webSocket&&this.webSocket.close();

    }
  }
</script>
<style scoped>
  .downCanvas, .upCanvas {
    position: absolute;
    color: #000;
  }
  .car-bottom{
    overflow: hidden;
    width:100%;
    height:100%;
  }

  .curve-container{
    width:50%;
    height:100%;
    float: left;
    position: relative;
  }
  .chart-region{
    width: 50%;
    height:100%;
    float: left;
    position: relative;
  }
  .chart-mask {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    background-color: rgba(255,255,255,.5);
    color: #000;
  }
  .curve-style{
    height:100%;
    position: relative;
  }
  .img1{
    position: absolute;
    left:100px;
    top: 140px;
    width: 36px;
  }
  .img2{
    position: absolute;
    left: 310px;
    top: 35px;
    width: 55px;
  }
  .img3{
    position: absolute;
    left: 550px;
    top: 145px;
    width: 30px;
  }
  .speed-chart{
    width: 250px;
    height: 100%;
    position: absolute;
  }
  .chart2{
    right:0;
  }
  .chart-title{
    font-size: 12px;
    color: #ddd9d1;
    position: absolute;
  }
  .chart-title-img{
    width: 4px;
    height: 8px;
  }
  .title1{
    left:0;
    top: 16px;
  }
  .title2{
    right: 160px;
    top: 16px;
  }
  .legend-style{
    position: absolute;
    left: 6px;
    top: 26px;
  }
  .legend-style p{
    margin-bottom: 6px;
    font-size: 12px;
    transform:scale(0.8);
  }
  .legend-size{
    width: 16px;
    height: 10px;
    display: inline-block;
    margin-right: 6px;
  }
</style>
