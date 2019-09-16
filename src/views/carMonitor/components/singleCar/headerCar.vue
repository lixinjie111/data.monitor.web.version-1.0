<template>
  <div class="real-detail">
    <ul class="base-detail monitor-header ">
      <li class="base-detail-style">
        <span>油门</span>
        <div class="pedal-icon">
          <span class="pedal-icon1"></span>
          <span class="pedal-icon2" v-bind:style="{ top:'-' +pedalBottomWidth+ 'px', borderBottomWidth: pedalBottomWidth + 'px', borderLeftWidth: pedalLeftWidth + 'px' }"></span>
        </div>
      </li>
      <li class="base-detail-style">
        <span>刹车</span>
        <div class="pedal-icon">
          <span class="pedal-icon1"></span>
          <span class="pedal-icon2"  v-bind:style="{ top:'-' +stopBottomWidth+ 'px', borderBottomWidth: stopBottomWidth + 'px', borderLeftWidth: stopLeftWidth + 'px' }"></span>
        </div>
      </li>
      <li class="base-detail-direction">
        <div class="header-angle" :style="{transform:'rotate('+realData.headingAngle+'deg)'}">
          <img src="@/assets/images/car/car-11.png"/>
        </div>
        <span class="header-angle-style">{{realData.headingAngleName}} {{realData.headingAngleCalc  | toFixed(1)}}°</span>
      </li>
      <li class="director">

        <div class="director-icon">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <!--向左转 亮-->
          <!--<img src="@/assets/images/car/car-12.png" v-if="realData.turnLight=='left'">-->
          <!--左-->
          <img src="@/assets/images/car/car-12.png" v-if="realData.turnLight=='left'">
          <img src="@/assets/images/car/car-13.png" class="director-left " v-else>
          <!--向右转 亮-->
          <!--<img src="@/assets/images/car/car-12.png" class="director-right" v-if="realData.turnLight=='right'">-->
          <img src="@/assets/images/car/car-12.png" class="director-right" v-if="realData.turnLight=='right'">
          <img src="@/assets/images/car/car-13.png" v-else >
        </div>

      </li>
      <li>
        <span>当前档位</span>
        <!--<img src="@/assets/images/car/car-14.png"/>-->
        <span class="current-gear">{{realData.transmission}}</span>
      </li>
      <li>
        <span>剩余里程</span>
        <!--<img src="@/assets/images/car/car-15.png"/>-->
        <span class="current-electric">{{realData.remainElec | toFixed(1)}} km</span>
      </li>
    </ul>
    <ul class="monitor-header signal-detail">
      <li>
        <div class="signal-item1 signal-style">
          <span class="signal-icon1" :class="[vehicleStatus.gpsStatus==1 ? liveUsed : vehicleStatus.gpsStatus==2?liveBroken:liveUnused]"></span>
          <span>GPS</span>
        </div>
        <div class="signal-item1">
          <span class="signal-icon1" :class="[vehicleStatus.cameraStatus==1 ? liveUsed : vehicleStatus.cameraStatus==2?liveBroken:liveUnused]"></span>
          <span>Camera</span>
        </div>
        <div class="signal-item1 signal-style">
          <span class="signal-icon1" :class="[vehicleStatus.canStatus==1 ? liveUsed : vehicleStatus.canStatus==2?liveBroken:liveUnused]"></span>
          <span>V2X</span>
        </div>
        <div class="signal-item1">
          <span class="signal-icon1" :class="[vehicleStatus.radarStatus==1 ? liveUsed : vehicleStatus.radarStatus==2?liveBroken:liveUnused]"></span>
          <span>Radar</span>
        </div>
      </li>
      <li>
        <div class="signal-item2">
          <span class="signal-icon2" :class="[naviStatus.naviControlStatus==1 ? liveUsed : naviStatus.naviControlStatus==2?liveBroken:liveUnused]"></span>
          <span>Navi Control</span>
        </div>
        <div class="signal-item2">
          <span class="signal-icon2" :class="[naviStatus.naviPlanningStatus==1 ? liveUsed : naviStatus.naviPlanningStatus==2?liveBroken:liveUnused]"></span>
          <span>Navi Planning</span>
        </div>
        <div class="signal-item2">
          <span class="signal-icon2" :class="[naviStatus.naviPerceptionStatus==1 ? liveUsed : naviStatus.naviPerceptionStatus==2?liveBroken:liveUnused]"></span>
          <span>Navi Perception</span>
        </div>
        <div class="signal-item2">
          <span class="signal-icon2" :class="[naviStatus.naviPredictionStatus==1 ? liveUsed : naviStatus.naviPredictionStatus==2?liveBroken:liveUnused]"></span>
          <span>Navi Prediction</span>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
  export default {
    name: "header-car",
    data () {
      return {
        liveUsed:'live-used',
        liveUnused:'live-unused',
        liveBroken:'live-broken',
        webSocket:null,
        vehicleStatus:{},
        naviStatus:{}
      }
    },
    props:{
      realData:{
        type:Object,
        default() {
          return {

          };
        }
      },
      singleVehicle:{
        type:Object,
        default() {
          return {

          };
        }
      },
      isStop:{
        type:Boolean,
        default:false
      }
    },
    computed:{
      pedalLeftWidth(){
        let pedalData = parseFloat(this.realData.oilDoor/100);
        return parseInt(pedalData*70);
      },
      pedalBottomWidth(){
        let pedalData = parseFloat(this.realData.oilDoor/100);
        return parseInt(this.pedalLeftWidth*2/7)
      },
      stopLeftWidth(){
        let pedalData = parseFloat(this.realData.brakePedal/100);
        return parseInt(pedalData*70)
      },
      stopBottomWidth(){
        let pedalData = parseFloat(this.realData.brakePedal/100);
        return parseInt(this.stopLeftWidth*2/7);
      },
      /*lastTime(){
        var time = new Date().getTime()-this.realData.gpsTime;
        console.log("time---------"+time)
        return time;
      }*/
    },
    watch:{
      isStop(newVal,oldVal){
        if(newVal){
          this.vehicleStatus.gpsStatus=3;
          this.vehicleStatus.cameraStatus=3;
          this.vehicleStatus.canStatus=3;
          this.vehicleStatus.radarStatus=3;

          this.naviStatus.naviControlStatus=3;
          this.naviStatus.naviPlanningStatus=3;
          this.naviStatus.naviPerceptionStatus=3;
          this.naviStatus.naviPredictionStatus=3;
          this.webSocket&&this.webSocket.close()
        }
      },
      lastTime(oldValue,newValue){
        if(oldValue>=30000){
          this.realData.transmission='P';
          this.pedalLeftWidth=0;
          this.stopLeftWidth=0;
        }
      }
    },
    mounted () {
      this.initWebSocket();
      let level = this.singleVehicle.autoLevel;
      if(level<3){
        this.vehicleStatus.gpsStatus=3;
        this.vehicleStatus.cameraStatus=3;
        this.vehicleStatus.canStatus=3;
        this.vehicleStatus.radarStatus=3;

        this.naviStatus.naviControlStatus=3;
        this.naviStatus.naviPlanningStatus=3;
        this.naviStatus.naviPerceptionStatus=3;
        this.naviStatus.naviPredictionStatus=3;
      }else{
        this.vehicleStatus.gpsStatus=1;
        this.vehicleStatus.cameraStatus=1;
        this.vehicleStatus.canStatus=1;
        this.vehicleStatus.radarStatus=1;

        this.naviStatus.naviControlStatus=1;
        this.naviStatus.naviPlanningStatus=1;
        this.naviStatus.naviPerceptionStatus=1;
        this.naviStatus.naviPredictionStatus=1;
      }
    },
    methods: {
      initWebSocket(){
        let _this=this;
        if ('WebSocket' in window) {
          _this.webSocket = new WebSocket(window.config.websocketUrl);  //获得WebSocket对象
        }
        _this.webSocket.onmessage = _this.onmessage;
        _this.webSocket.onclose = _this.onclose;
        _this.webSocket.onopen = _this.onopen;
        _this.webSocket.onerror = _this.onerror;
      },
      onmessage(mesasge){
        let _this=this;
        var json = JSON.parse(mesasge.data);
        var type = json.action;
        switch(type) {
          case 'vehicleStatus': {//bsm数据
            this.vehicleStatus = json.result;
            break;
          }
          case 'vehicleNaviStatus': {//速度加速度
            this.naviStatus = json.result;
            break;
          }
        }
      },
      onclose(data){
        console.log("结束连接");
      },
      onopen(data){
        //获取车辆状态
        var vehicleStatus = {
          'action':'vehicleStatus',
          'vehicleId': this.$route.params.vehicleId,
          'token':''
        }
        var vehicleStatusMsg = JSON.stringify(vehicleStatus);
        this.sendMsg(vehicleStatusMsg);
        //获取车辆驾驶状态
        var naviStatus = {
          'action':'vehicleNaviStatus',
          'vehicleId': this.$route.params.vehicleId,
          'token':''
        }
        var naviStatusMsg = JSON.stringify(naviStatus);
        this.sendMsg(naviStatusMsg);
      },
      sendMsg(msg) {
        let _this=this;
        if(window.WebSocket){
          if(_this.webSocket.readyState == WebSocket.OPEN) { //如果WebSocket是打开状态
            _this.webSocket.send(msg); //send()发送消息
          }
        }else{
          return;
        }
      }
    },
    destroyed(){
      //销毁Socket
       this.webSocket&&this.webSocket.close();
    }
  }
</script>
<style scoped>

  .real-detail{
    overflow: hidden;
    color: #ddd9d1;
  }
  .pedal-icon{
    position: relative;
    height: 22px;
  }
  .pedal-icon1{
    display: block;
    height: 0;
    width:0;
    border-bottom: 20px solid #89857f;
    border-left:70px solid transparent;
  }
  .pedal-icon2{
    display: block;
    height: 0;
    width:0;
    position: relative;
    top: -10px;
    border-bottom: 0px solid #dc8c00;
    border-left:0px solid transparent;
  }

  .monitor-header{
    background: #423e4e;
    float: left;
    height: 80px;
    border-left:4px solid #dc8c00;
    box-sizing: border-box;
  }
  .base-detail{
    width:60%;
    margin-right: 1%;

  }
  .base-detail li{
    display: table-cell;
    vertical-align: middle;
    padding: 0 20px;
    height: 80px;
    /*width: 130px;
    box-sizing: border-box;*/
  }
  .base-detail-style{
    width: 80px;
  }
  .base-detail-direction{
    width:120px;
    padding:0px 10px!important;
  }
  .director-icon{
    display: flex;
    align-items: center;
    position: relative;
    width: 50px;
    height: 38px;
  }
  .director-icon img:first-of-type{
    margin-right: 5px;
  }

  .director-icon .light-style-right{
    width: 36px;
    position: relative;
    left:-8px;
  }
  .director-icon > span:nth-child(1){
    position: absolute;
    left: -3px;
    top: 0px;
    padding: 3px;
    border-style: solid;
    border-color: #a3c8b0;
    border-width: 0px;
    box-shadow: -1px -1px 0px 0px #fff;
  }
  .director-icon > span:nth-child(2){
    position: absolute;
    right: -3px;
    top: 0px;
    padding: 3px;
    border-style: solid;
    border-color: #a3c8b0;
    border-width: 0px;
    box-shadow: 1px -1px 0px 0px #fff;
  }
  .director-icon > span:nth-child(3){
    position: absolute;
    right: -3px;
    bottom: 0px;
    padding: 3px;
    border-style: solid;
    border-color: #a3c8b0;
    border-width: 0px;
    box-shadow: 1px 1px 0px 0px #fff;
  }
  .director-icon> span:nth-child(4){
    position: absolute;
    left: -3px;
    bottom: 0px;
    padding: 3px;
    border-style: solid;
    border-color: #a3c8b0;
    border-width:0px;
    box-shadow: -1px 1px 0px 0px #fff;
  }

  .signal-detail{
    width:39%;
  }
  img{
    vertical-align: middle;
  }

  .signal-icon1{
    width: 10px;
    height: 10px;
    display: inline-block;
    background: green;
  }

  .signal-icon2{
    width: 10px;
    height: 10px;
    display: inline-block;
    background: red;
    border-radius: 5px;
  }
  .signal-item1{
    display: inline-block;
    width: 30%;
    text-align: left;
  }
  .signal-item2{
    display: inline-block;
    width: 40%;
    text-align: left;
  }
  .signal-detail li{
    display: table-cell;
    vertical-align: middle;
    height: 80px;
    width: 50%;
  }
  .signal-style{
    padding-left:15%;
  }
  .director-right,.director-left{
    transform: rotate(180deg);
  }
  .current-gear{
    border:1px solid #dc8c00;
    -webkit-border-radius: 15px;
    -moz-border-radius: 15px;
    border-radius: 15px; ;
    width: 30px;
    height: 30px;
    color: #dc8c00;
    font-weight: 600;
    display: inline-block;
    vertical-align: middle;
    text-align: center;
    line-height: 30px;
    font-size: 16px;
  }

  .current-electric{
    width: 64px;
    height: 24px;
    color: #dc8c00;
    display: inline-block;
    vertical-align: middle;
    text-align: center;
    line-height: 24px;
  }
  .live-used{
    background: green;
  }
  .live-unused{
    background: grey;
  }
  .live-broken{
    background: red;
  }

  .header-angle img{
    position: relative;
    top: 5px;
    display: inline-block;
  }
  .header-angle {
    width: 40px;
    height: 40px;
    border-radius: 20px;
    border: 1px solid #d28704;
    text-align: center;
    display: inline-block;
    vertical-align: middle;
    position: relative;
    /*transform: rotate(50deg);*/
  }
  .header-angle-style{
    display: inline-block;
  }
</style>
