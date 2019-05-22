<template>

  <div class="car-bottom">
    <div class="curve-container">
      <div id="canvasContainer" class="curve-style">
        <img src="@/assets/images/car/car-7.png" class="img1"/>
        <img src="@/assets/images/car/car-8.png" class="img2"/>
        <img src="@/assets/images/car/car-22.png" class="img3"/>
        <canvas id="up0" class="upCanvas" width="1200" height="400" style="width: 600px; height: 200px;"></canvas>
        <canvas id="upImg0" class="upCanvas" width="1200" height="400" style="width: 600px; height: 200px;"></canvas>
        <img id="upPlan0" src="@/assets/images/car/circle.png" style="display: none;">
        <canvas id="up1" class="upCanvas" width="1200" height="400" style="width: 600px; height: 200px;"></canvas>
        <canvas id="upImg1" class="upCanvas" width="1200" height="400" style="width: 600px; height: 200px;"></canvas>
        <img id="upPlan1" src="@/assets/images/car/circle.png" style="display: none;">
        <canvas id="up2" class="upCanvas" width="1200" height="400" style="width: 600px; height: 200px;"></canvas>
        <canvas id="upImg2" class="upCanvas" width="1200" height="400" style="width: 600px; height: 200px;"></canvas>
        <img id="upPlan2" src="@/assets/images/car/circle.png" style="display: none;">
        <canvas id="up3" class="upCanvas" width="1200" height="400" style="width: 600px; height: 200px;"></canvas>
        <canvas id="upImg3" class="upCanvas" width="1200" height="400" style="width: 600px; height: 200px;"></canvas>
        <img id="upPlan3" src="@/assets/images/car/circle.png" style="display: none;">
        <canvas id="up4" class="upCanvas" width="1200" height="400" style="width: 600px; height: 200px;"></canvas>
        <canvas id="upImg4" class="upCanvas" width="1200" height="400" style="width: 600px; height: 200px;"></canvas>
        <img id="upPlan4" src="@/assets/images/car/circle.png" style="display: none;">
        <canvas id="up5" class="upCanvas" width="1200" height="400" style="width: 600px; height: 200px;"></canvas>
        <canvas id="upImg5" class="upCanvas" width="1200" height="400" style="width: 600px; height: 200px;"></canvas>
        <img id="upPlan5" src="@/assets/images/car/circle.png" style="display: none;">
        <canvas id="up6" class="upCanvas" width="1200" height="400" style="width: 600px; height: 200px;"></canvas>
        <canvas id="upImg6" class="upCanvas" width="1200" height="400" style="width: 600px; height: 200px;"></canvas>
        <img id="upPlan6" src="@/assets/images/car/circle.png" style="display: none;">
        <canvas id="up7" class="upCanvas" width="1200" height="400" style="width: 600px; height: 200px;"></canvas>
        <canvas id="upImg7" class="upCanvas" width="1200" height="400" style="width: 600px; height: 200px;"></canvas>
        <img id="upPlan7" src="@/assets/images/car/circle.png" style="display: none;">
        <canvas id="up8" class="upCanvas" width="1200" height="400" style="width: 600px; height: 200px;"></canvas>
        <canvas id="upImg8" class="upCanvas" width="1200" height="400" style="width: 600px; height: 200px;"></canvas>
        <img id="upPlan8" src="@/assets/images/car/circle.png" style="display: none;">
        <canvas id="up9" class="upCanvas" width="1200" height="400" style="width: 600px; height: 200px;"></canvas>
        <canvas id="upImg9" class="upCanvas" width="1200" height="400" style="width: 600px; height: 200px;"></canvas>
        <img id="upPlan9" src="@/assets/images/car/circle.png" style="display: none;">


        <canvas id="down0" class="downCanvas" width="1200" height="400" style="width: 600px; height: 200px;"></canvas>
        <canvas id="downImg0" class="downCanvas" width="1200" height="400" style="width: 600px; height: 200px;"></canvas>
        <img id="downPlan0" src="@/assets/images/car/circle.png" style="display: none;">
        <canvas id="down1" class="downCanvas" width="1200" height="400" style="width: 600px; height: 200px;"></canvas>
        <canvas id="downImg1" class="downCanvas" width="1200" height="400" style="width: 600px; height: 200px;"></canvas>
        <img id="downPlan1" src="@/assets/images/car/circle.png" style="display: none;">
        <canvas id="down2" class="downCanvas" width="1200" height="400" style="width: 600px; height: 200px;"></canvas>
        <canvas id="downImg2" class="downCanvas" width="1200" height="400" style="width: 600px; height: 200px;"></canvas>
        <img id="downPlan2" src="@/assets/images/car/circle.png" style="display: none;">
        <canvas id="down3" class="downCanvas" width="1200" height="400" style="width: 600px; height: 200px;"></canvas>
        <canvas id="downImg3" class="downCanvas" width="1200" height="400" style="width: 600px; height: 200px;"></canvas>
        <img id="downPlan3" src="@/assets/images/car/circle.png" style="display: none;">
        <canvas id="down4" class="downCanvas" width="1200" height="400" style="width: 600px; height: 200px;"></canvas>
        <canvas id="downImg4" class="downCanvas" width="1200" height="400" style="width: 600px; height: 200px;"></canvas>
        <img id="downPlan4" src="@/assets/images/car/circle.png" style="display: none;">
        <canvas id="down5" class="downCanvas" width="1200" height="400" style="width: 600px; height: 200px;"></canvas>
        <canvas id="downImg5" class="downCanvas" width="1200" height="400" style="width: 600px; height: 200px;"></canvas>
        <img id="downPlan5" src="@/assets/images/car/circle.png" style="display: none;">
        <canvas id="down6" class="downCanvas" width="1200" height="400" style="width: 600px; height: 200px;"></canvas>
        <canvas id="downImg6" class="downCanvas" width="1200" height="400" style="width: 600px; height: 200px;"></canvas>
        <img id="downPlan6" src="@/assets/images/car/circle.png" style="display: none;">
        <canvas id="down7" class="downCanvas" width="1200" height="400" style="width: 600px; height: 200px;"></canvas>
        <canvas id="downImg7" class="downCanvas" width="1200" height="400" style="width: 600px; height: 200px;"></canvas>
        <img id="downPlan7" src="@/assets/images/car/circle.png" style="display: none;">
        <canvas id="down8" class="downCanvas" width="1200" height="400" style="width: 600px; height: 200px;"></canvas>
        <canvas id="downImg8" class="downCanvas" width="1200" height="400" style="width: 600px; height: 200px;"></canvas>
        <img id="downPlan8" src="@/assets/images/car/circle.png" style="display: none;">
        <canvas id="down9" class="downCanvas" width="1200" height="400" style="width: 600px; height: 200px;"></canvas>
        <canvas id="downImg9" class="downCanvas" width="1200" height="400" style="width: 600px; height: 200px;"></canvas>
        <img id="downPlan9" src="@/assets/images/car/circle.png" style="display: none;">
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
  import Curve1 from '@/assets/js/utils/curve1.js';

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
        markDate:'',
        upRandom:0.1,
        downRandom:0.1,
        i:0, //控制生成的标签
        k:0,//控制有多少条线进行清除
        container:{},
        webSocket:{},
        reportWebSocket:{},
        isFirst:true,
        isMultiple:true,
        eventData:[],
        vehicleData:[]
      }
    },
    props:{
      speedData:{
        type: Object,
        default() {
          return {};
        }
      },
      time:{

      }
    },
    methods: {
      getSpeedChart(){
        var _self = this;
        var initOption = this.getOption();
        var option = {
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
            }
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
        var finalOption = Object.assign(option,initOption);

        _self.speedChart.setOption(finalOption);
      },
      getAccelerateChart(){
        var _self = this;
        var initOption = this.getOption();
        var option = {
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
        var finalOption = Object.assign(option,initOption);

        _self.accelerateChart.setOption(finalOption);
      },
      getOption(){
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
          }
        }
        return option;
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
      initWebSocket(){
        let _this=this;
        if ('WebSocket' in window) {
          _this.webSocket = new WebSocket(window.cfg.websocketUrl);  //获得WebSocket对象
        }
        _this.webSocket.onmessage = _this.onmessage;
        _this.webSocket.onclose = _this.onclose;
        _this.webSocket.onopen = _this.onopen;
        _this.webSocket.onerror = _this.onerror;
      },
      onmessage(message){
        let _this=this;
        var json = JSON.parse(message.data),
            gpsTime = json.result.gpsTime,
            speed = json.result.speed,
            acceleration = json.result.acceleration;
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

          this.xData = this.formateDate(gpsTime, 5);
          //对线的处理
          this.getSpeedChart();
          this.getAccelerateChart();
        }else {
          this.isStop = true;
        }
      },
      onclose(data){
        console.log("结束连接");
      },
      onopen(data){
        console.log("建立连接,,,,,,");

        //获取速度加速度
        var speed = {
          'action':'speedAcceleration',
          /*'vid':this.vehicleID,*/
          'vehicleId':this.vehicleId
        }
        var speedMsg = JSON.stringify(speed);
        this.sendMsg(speedMsg);
      },
      sendMsg(msg) {
        let _this=this;
        console.log("连接状态："+_this.webSocket.readyState);
        if(window.WebSocket){
          if(_this.webSocket.readyState == WebSocket.OPEN) { //如果WebSocket是打开状态
            _this.webSocket.send(msg); //send()发送消息
            console.log("已发送消息:"+ msg);
          }
        }else{
          return;
        }
      },
      realReportWebSocket(){
        let _this=this;
        if ('WebSocket' in window) {
          _this.reportWebSocket = new WebSocket(window.cfg.websocketUrl);  //获得WebSocket对象
        }
        _this.reportWebSocket.onmessage = _this.onReportMessage;
        _this.reportWebSocket.onclose = _this.onReportClose;
        _this.reportWebSocket.onopen = _this.onReportOpen;
      },
      onReportMessage(message){
        let _this=this;
        var json = JSON.parse(message.data);
        var data = json.result.vehicleLiveReportCountList;
        console.log("返回数据大小---"+data.length);
        _this.dataHandle(data);
        console.log("时间---"+new Date().getTime())
      },
      dataHandle(data){
        var _this = this;
        var curve;
        var length=0;
       /* var vehicleObj = document.getElementById("up9");
        //当清除后，将其他线进行绘制
        if(vehicleObj.height==0) {
          _this.isMultiple = false;
          vehicleObj.height = vehicleObj.height;
          _this.dataHandle(_this.vehicleData);
        }

        var eventObj = document.getElementById("down9");
        //当清除后，将其他线进行绘制
        if(eventObj.height==0) {
          _this.isMultiple = false;
          eventObj.height = eventObj.height;
          _this.dataHandle(_this.eventData);
        }
*/
        //进行多次调用，直到最后一条线删除
        /*if(_this.isMultiple){
          _this.dataHandle(data);
        }*/
        if(data.length>0){
          data.forEach(function (item) {
            length++;
            if(item.count>0){
              if(item.dataType=='vehicleEventCount'){
                if(_this.i<8){
                  curve = new Curve1([345, 60], [540, 155], '600', '200', _this.downRandom,'event',_this.i,'down');
                  curve.generateForward();
                  _this.downRandom = _this.downRandom+0.05;
                  _this.i++;
                }else{
                  _this.eventData.push(item);
                  if(length==data.length){
                    _this.downRandom=0.1;
                    _this.i=0;
                  }
                }
              }else {
                if(_this.k<8){
                  if(item.dataType=='vehicleCanCount'){
                    curve = new Curve1([110, 142], [300, 58], '600', '200', _this.upRandom,'CAN',_this.k,'up');
                    curve.generateForward();
                    _this.upRandom = _this.upRandom+0.05;
                    _this.k++;
                  }else if(item.dataType=='vehicleGpsCount'){
                    curve = new Curve1( [110, 142], [300, 58], '600', '200', _this.upRandom,'GPS',_this.k,'up');
                    curve.generateForward();
                    _this.upRandom = _this.upRandom+0.05;
                    _this.k++;
                  }else if(item.dataType=='vehicleRadarCount'){
                    curve = new Curve1( [110, 142], [300, 58], '600', '200', _this.upRandom,'radar',_this.k,'up');
                    curve.generateForward();
                    _this.upRandom = _this.upRandom+0.05;
                    _this.k++;
                  }
                }else{
                  _this.vehicleData.push(item);
                  if(length==data.length){
                    _this.upRandom=0.1;
                    _this.k=0;
                  }
                }
              }
            }
          })
          if(_this.vehicleData.length>0){
            _this.lineHandle(_this.vehicleData,'up');
          }
          if(_this.eventData.length>0){
            _this.lineHandle(_this.eventData,'down');
          }
          //第一次进入直接调用
          /*if(_this.isFirst){
            _this.dataHandle(data);
            _this.isFirst=false;
          }*/
        }
      },
      lineHandle(data,type){
        var _this = this;
        var curve;
        if(type=='up'){
          var vehicleObj = document.getElementById("up9");
         /* console.log("高度---"+vehicleObj.height);
          if(vehicleObj.height!=0){
            _this.lineHandle(data,type);
          }*/
          data.forEach(function (item) {
            if(item.dataType=='vehicleCanCount'){
              curve = new Curve1([110, 142], [300, 58], '600', '200', _this.upRandom,'CAN',_this.k,'up');
              curve.generateForward();
              _this.upRandom = _this.upRandom+0.05;
              _this.k++;
            }else if(item.dataType=='vehicleGpsCount'){
              curve = new Curve1( [110, 142], [300, 58], '600', '200', _this.upRandom,'GPS',_this.k,'up');
              curve.generateForward();
              _this.upRandom = _this.upRandom+0.05;
              _this.k++;
            }else if(item.dataType=='vehicleRadarCount'){
              curve = new Curve1( [110, 142], [300, 58], '600', '200', _this.upRandom,'radar',_this.k,'up');
              curve.generateForward();
              _this.upRandom = _this.upRandom+0.05;
              _this.k++;
            }
            curve.generateForward();
            _this.vehicleData=[];
          })
        }
        if(type=='down'){
         /* var eventObj = document.getElementById("down9");
          if(eventObj.height!=0){
            _this.lineHandle(data,type);
          }*/
          curve = new Curve1([345, 60], [540, 155], '600', '200', _this.downRandom,'event',_this.i,'down');
          curve.generateForward();
          _this.downRandom = _this.downRandom+0.05;
          _this.i++;
          _this.eventData=[];
        }
        /*if(_this.isFirst){
          _this.lineHandle(data,type);
          _this.isFirst=false;
        }*/
      },
      onReportOpen(data){
        console.log("建立连接,,,,,,");
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
        console.log("连接状态："+_this.webSocket.readyState);
        if(window.WebSocket){
          if(_this.reportWebSocket.readyState == WebSocket.OPEN) { //如果WebSocket是打开状态
            _this.reportWebSocket.send(msg); //send()发送消息
            console.log("已发送消息:"+ msg);
          }
        }else{
          return;
        }
      },
      onReportClose(data){
        console.log("结束连接");
      },
      clearLines(container,type) {
        var allCanvas;
        var lineCtx;
        if(type=='up'){

         /* allCanvas= document.querySelectorAll(".upCanvas");*/
          var obj0 = document.getElementById("up0");
          obj0.height = 0;
          /*obj0.getContext( '2d' ).clearRect( 0, 0, 1200, 1000 );*/
          var obj1 = document.getElementById("up1");
          obj1.height = 0;
          /*obj1.getContext( '2d' ).clearRect( 0, 0, 1200, 1000 );*/
          var obj2 = document.getElementById("up2");
          obj2.height = 0;
          /*obj2.getContext( '2d' ).clearRect( 0, 0, 1200, 1000 );*/
          var obj3 = document.getElementById("up3");
          obj3.height = 0;
          /*obj3.getContext( '2d' ).clearRect( 0, 0, 1200, 1000 );*/
          var obj4 = document.getElementById("up4");
          obj4.height = 0;
          /*obj4.getContext( '2d' ).clearRect( 0, 0, 1200, 1000 );*/
          var obj5 = document.getElementById("up5");
          obj5.height = 0;
         /* obj5.getContext( '2d' ).clearRect( 0, 0, 1200, 1000 );*/
          var obj6 = document.getElementById("up6");
          obj6.height = 0;
          /*obj6.getContext( '2d' ).clearRect( 0, 0, 1200, 1000 );*/
          var obj7 = document.getElementById("up7");
          obj7.height = 0;
        /*  obj7.getContext( '2d' ).clearRect( 0, 0, 1200, 1000 );*/
          var obj8 = document.getElementById("up8");
          obj8.height = 0;
          /*obj8.getContext( '2d' ).clearRect( 0, 0, 1200, 1000 );*/
          var obj9 = document.getElementById("up9");
          obj9.height = 0;
          /*obj9.getContext( '2d' ).clearRect( 0, 0, 1200, 1000 );*/
          //清除所有节点
         /* console.log("startTime---"+new Date().getTime());*/
          /*for(var i=allCanvas.length-1;i>=0;i--){
            /!*container.removeChild(allCanvas[i]);*!/
          /!*  sessionStorage.removeItem('up'+i);*!/
            console.log("id===="+allCanvas[i].id);
            lineCtx = allCanvas[i].getContext( '2d' );
            /!*lineCtx.height=lineCtx.height;*!/
            lineCtx.strokeStyle='rgba(0,0,0,0)';
            lineCtx.clearRect( 0, 0, 1000, 1000 );
          }*/
          /*console.log("endTime---"+new Date().getTime());*/
        }
        if(type=='down'){
          allCanvas= document.querySelectorAll(".downCanvas");
          allCanvas= document.querySelectorAll(".upCanvas");
          //清除所有节点
          for(var i=allCanvas.length-1;i>=0;i--){
            /*container.removeChild(allCanvas[i]);*/
            /*sessionStorage.removeItem('down'+i);*/
            lineCtx = allCanvas[i].getContext( '2d' );
            lineCtx.strokeStyle='rgba(0,0,0,0)';
            lineCtx.clearRect( 10, 10, 1000, 1000 );
          }
        }

      }

    },
    mounted () {

      var _this = this;
     _this.container = document.getElementById('canvasContainer');
      var random=0.1;
     /* _this.$curveUtil.generateForward(container, [110, 142], [292, 58], '600', '200', random,'GPS');
      _this.$curveUtil.generateForward(container, [345, 60], [532, 142], '600', '200', random,'Mds');*/
     var data=[{'dataType':'vehicleCanCount','count':1},{'dataType':'vehicleGpsCount','count':1},{'dataType':'vehicleRadarCount','count':1}]
     var time = setInterval(function () {
       _this.dataHandle(data);
     },2000);
      //速度和加速度
      _this.speedChart = _this.$echarts.init(document.getElementById('speedChart'));
      _this.accelerateChart = _this.$echarts.init(document.getElementById('accelerateChart'));

      _this.initWebSocket();
      _this.realReportWebSocket();

    },
    beforeDestroy(){


    }
  }
</script>
<style scoped>
  .downCanvas, .upCanvas {
    position: absolute;
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
    left:80px;
    top: 140px;
    width: 35px;
  }
  .img2{
    position: absolute;
    left: 290px;
    top: 35px;
    width: 55px;
  }
  .img3{
    position: absolute;
    left: 530px;
    top: 145px;
    width: 30px;
  }
  .speed-chart{
    width: 250px;
    height: 220px;
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
    width: 3px;
    height: 8px;
  }
  .title1{
    left:0;
    top: 15px;
  }
  .title2{
    right: 200px;
    top: 15px;
  }
</style>
