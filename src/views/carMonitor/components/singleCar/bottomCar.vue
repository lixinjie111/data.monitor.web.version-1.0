<template>

  <div class="car-bottom">
    <div class="curve-container">
      <div id="canvasContainer" class="curve-style"  v-if="!isStop">
        <img src="@/assets/images/car/car-7.png" class="img1"/>
        <img src="@/assets/images/car/car-8.png" class="img2"/>
        <img src="@/assets/images/car/car-22.png" class="img3"/>

        <div  v-for="(item,index) in showgpsPointList" :class="item.showPoint ? 'ball run-gps' : 'ball'" ></div>
        <div  v-for="(item,index) in showbsmPointList" :class="item.showPoint ? 'ball run-bsm' : 'ball'" ></div>
        <div  v-for="(item,index) in showperPointList" :class="item.showPoint ? 'ball run-per' : 'ball'" ></div>
        <div  v-for="(item,index) in showeventPointList" :class="item.showPoint ? 'ball run-event' : 'ball'" ></div>
        <div  v-for="(item,index) in showspatPointList" :class="item.showPoint ? 'ball run-spat' : 'ball'" ></div>
        <div  v-for="(item,index) in showrsmPointList" :class="item.showPoint ? 'ball run-rsm' : 'ball'" ></div>


        <canvas id="up0" class="upCanvas"></canvas>
        <canvas id="upImg0" class="upCanvas"></canvas>
        <img id="upPlan0" src="@/assets/images/car/circle.png" style="display: none;">
        <canvas id="up1" class="upCanvas" ></canvas>
        <canvas id="upImg1" class="upCanvas"></canvas>
        <img id="upPlan1" src="@/assets/images/car/circle.png" style="display: none;">
        <canvas id="up2" class="upCanvas" ></canvas>
        <canvas id="upImg2" class="upCanvas" ></canvas>
        <img id="upPlan2" src="@/assets/images/car/circle.png" style="display: none;">
        <canvas id="up3" class="upCanvas" ></canvas>
        <canvas id="upImg3" class="upCanvas"></canvas>
        <img id="upPlan3" src="@/assets/images/car/circle.png" style="display: none;">
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
        <canvas id="downImg12" class="downCanvas" ></canvas>
        <img id="downPlan12" src="@/assets/images/car/circle.png" style="display: none;">
        <canvas id="downImg13" class="downCanvas"></canvas>
        <img id="downPlan13" src="@/assets/images/car/circle.png" style="display: none;">
      </div>
      <div class="legend-style">
        <p><span class="legend-size" style="background: #d47b24"></span>GPS+CAN</p>
        <p><span class="legend-size" style="background: #595450"></span>EVENT</p>
        <p><span class="legend-size" style="background: #2acdc2"></span>BSM</p>
        <p><span class="legend-size" style="background: #d3d12d"></span>PER</p>
        <p><span class="legend-size" style="background: #6ec9fd"></span>SPAT</p>
        <p><span class="legend-size" style="background: #8a46f1"></span>RSM</p>
      </div>
    </div>
    <div class="chart-region">
      <div class="chart-title title1">速度（km/h）</div>
      <div id="speedChart" class="speed-chart chart1"></div>
      <div class="chart-title title2">加速度（m/s²）</div>
      <div id="accelerateChart" class="speed-chart chart2"></div>
      <div class="chart-mask" v-if="isStop">车辆已停驶</div>
    </div>
  </div>

</template>
<script>
  import Curve from '@/assets/js/utils/curve.js';
  import $echarts from 'echarts'
  import WebSocketObj from '@/assets/js/utils/webSocket.js'
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
        reportWebSocket:{},
        upRandom:0.1,
        canRandom:0,
        gpsRandom:0,
        perRandom:0,
        eventRandom:0,
        downRandom:0.15,
        spatRandom:0,
        rsmRandom:0,
        vehicleDataCountNum:0,
        showgpsPointList:[],
        showbsmPointList:[],
        showperPointList:[],
        showeventPointList:[],
        showspatPointList:[],
        showrsmPointList:[],
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
    mounted () {
      let pointArr = ['showgpsPointList','showbsmPointList','showperPointList','showeventPointList','showspatPointList','showrsmPointList',]
      pointArr.map((x)=>{
        for (let i = 0; i < 6; i++) {
          this[x].push({
             showPoint:false,
             timer:null
          });
        }
      });

      var _this = this;
      _this.container = document.getElementById('canvasContainer');
      //速度和加速度
      _this.speedChart = $echarts.init(document.getElementById('speedChart'));
      _this.accelerateChart = $echarts.init(document.getElementById('accelerateChart'));
      //开始画gps的第一条线
      this.curve1 = new Curve();
      this.curve1.drawLines(_this.upRandom,'#d47b24','up',0,[130, 142], [320, 58]);
      this.curve1.drawImgs(_this.upRandom,'GPS+CAN','up',12,[130, 142], [320, 58],'#6ec9fd');
      _this.gpsRandom = _this.upRandom;
      _this.upRandom=_this.upRandom+0.15;
      //开始画can的第一条线
      this.curve2 = new Curve();
      this.curve2.drawLines(_this.upRandom,'#2acdc2','up',1,[130, 142], [320, 58]);
      this.curve2.drawImgs(_this.upRandom,'BSM','up',13,[130, 142], [320, 58],'#3db765');
      _this.canRandom = _this.upRandom;
      _this.upRandom=_this.upRandom+0.15;
      //开始画perception的第一条线
      this.curve3 = new Curve();
      this.curve3.drawLines(_this.upRandom,'#d3d12d','up',2,[130, 142], [320, 58]);
      this.curve3.drawImgs(_this.upRandom,'PER','up',14,[130, 142], [320, 58],'#d47b24');
      _this.perRandom = _this.upRandom;
      _this.upRandom=_this.upRandom+0.15;
      //开始画event的第一条线
      this.curve4 = new Curve();
      this.curve4.drawLines(_this.upRandom,'#595450','up',3,[130, 142], [320, 58]);
      this.curve4.drawImgs(_this.upRandom,'EVENT','up',15,[130, 142], [320, 58],'#59d44f');
      _this.eventRandom = _this.upRandom;
      _this.upRandom=_this.upRandom+0.15; 
      //开始画spat的第一条线
      this.downCurve1 = new Curve();
      this.downCurve1.drawLines("-"+_this.downRandom,'#6ec9fd','down',0,[552, 150],[356, 60]);
      this.downCurve1.drawImgs("-"+_this.downRandom,'SPAT','down',12, [552, 150],[356, 60],'#59d44f');//信号灯
      _this.spatRandom = _this.downRandom;
      _this.downRandom=_this.downRandom-0.45;
      //开始画rsm的第一条线
      this.downCurve2 = new Curve();
      this.downCurve2.drawLines(_this.downRandom,'#8a46f1','down',1,[552, 150],[356, 60]);
      this.downCurve2.drawImgs(_this.downRandom,'RSM/RCU','down',13,[552, 150],[356, 60],'#8a46f1');
      _this.rsmRandom = _this.downRandom;
      _this.downRandom=_this.downRandom-0.45;

      _this.realReportWebSocket();
   
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
      realReportWebSocket(){
        var _params = {
          'action':'vehicleDataCount',
          'vehicleId':this.vehicleId,
          'token':''
        }
        this.reportWebSocket = new WebSocketObj(this, window.config.websocketUrl, _params, this.onReportMessage);
      },
      onReportMessage(message){
            let _this=this;
            var json = JSON.parse(message.data);
            var data = json.result.reportItems;     
            if(data.length>0) {
              data.forEach(function (item) {
                if (item.type == 'GPS+CAN') {
                  _this.setPointData('showgpsPointList');
                }
                if (item.type == 'BSM') {
                  _this.setPointData('showbsmPointList');
                }
                if (item.type == 'PER') {
                  _this.setPointData('showperPointList');
                }
                if (item.type == 'EVENT') {
                  _this.setPointData('showeventPointList');
                }
                if (item.type == 'SPAT') {
                  _this.setPointData('showspatPointList');
                }
                if (item.type == 'RSM/RCU') {
                  _this.setPointData('showrsmPointList');
                }  
              })
            }
      },
      setPointData(pointName){
          for (let i = 0; i < this[pointName].length; i++) {
              if(!this[pointName][i].showPoint){
                this[pointName][i].showPoint = true;
                this[pointName][i].timer = setTimeout(() => {
                  this[pointName][i].showPoint = false;
                }, 3000);
                return;
              }
          }
      }
     
    },
  
    destroyed(){
      //销毁Socket
      this.reportWebSocket&&this.reportWebSocket.webSocket.close();

    }
  }
</script>
<style scoped lang="scss">
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
    z-index: 99;
  }
  .img2{
    position: absolute;
    left: 310px;
    top: 35px;
    width: 55px;
    z-index: 99;
  }
  .img3{
    position: absolute;
    left: 550px;
    top: 145px;
    width: 30px;
    z-index: 99;
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
    padding-left: 12px;
    &:before{
      position: absolute;
      left: 0;
      top: 50%;
      margin-top: -4px;
      content: '';
      width: 4px;
      height: 8px;
      background-color: #DC8C00;
    }
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


.ball{
  height: 6px;
  width: 6px;
  border-radius: 50%;
  position: absolute;
  bottom: 48px;
  left: 122px;
  z-index: 10;
  background: #41C66D;
  box-shadow: 0px 0px 5px #ccc;
  opacity: 0
}

@keyframes run-right-top {
  0% {
    bottom: 48px; 
    opacity: 1
  }
  100% {
    bottom: 140px;
    opacity: 1
  }
}

@keyframes run-right-right {
  0% {
    left: 122px;
    opacity: 1
  }
  100% {
    left: 310px;
    opacity: 1
  }
}
@keyframes run-left-top {
  0% {
    bottom: 48px;
    opacity: 1
  }
  100% {
    bottom: 140px;
    opacity: 1
  }
}

@keyframes run-left-right {
  0% {
    left: 545px;
    opacity: 1
  }
  100% {
    left: 340px;
    opacity: 1
  }
}

   .run-event{
    display: block;
    animation: run-right-right 2s 0s 1 linear, run-right-top 2s 0s 1 cubic-bezier(.14,.66,0.35,1.61);
    animation-fill-mode: none;   
  }
   .run-per{
    display: block;
    animation: run-right-right 2s 0s 1 linear, run-right-top 2s 0s 1 cubic-bezier(.18,.63,0.38,1.27);
    animation-fill-mode: none;    
  }
  .run-bsm{
    display: block;
    animation: run-right-right 2s 0s 1 linear, run-right-top 2s 0s 1 cubic-bezier(0.15,.47,0.5,1);
    animation-fill-mode: none;   
  }
   .run-gps{
    display: block;
    animation: run-right-right 2s 0s 1 linear, run-right-top 2s 0s 1 cubic-bezier(.14,.34,.78,.93);
    animation-fill-mode: none;  
  }
  .run-spat{
    display: block;
    animation: run-left-right 2s 0s 1 linear, run-left-top 2s 0s 1 cubic-bezier(.12,.38,0.22,1);
    animation-fill-mode: none;    
  }
  .run-rsm{
    display: block;
    animation: run-left-right 2s 0s 1 linear, run-left-top 2s 0s 1 cubic-bezier(.15,.4,.56,.88);
    animation-fill-mode: none;    
  }


</style>
