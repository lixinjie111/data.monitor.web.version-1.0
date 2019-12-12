<template>
<div class="car-view-wrapper clearfix">
    <div class="single-left">
        <left-car :vehWsData="vehWsData" :singleVehicle="singleVehicle"></left-car>
    </div>
    <div class="single-main">
        <div class="single-header">
            <header-car :real-data="realData" :singleVehicle="singleVehicle" :isStop="isStop"></header-car>
        </div>
        <div class="single-content ">
            <div class="single-content-left">
              <div class="single-content-top" :class="{'stop-style':isStop}">
                  <main-car :vehWsData="vehWsData" :real-data="realData" :isStop="isStop"></main-car>
              </div>
              <div class="single-content-bottom">
                  <bottom-car :vehWsData="vehWsData"></bottom-car>
              </div>
              <div class="stop-left-style" v-show="isStop">
                <div class="stop-left-text">
                  <div class="stop-highlight">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    车辆已停驶
                  </div>
                  <p class="stop-text-detail">停驶时，只有部分数据可查看</p>
                </div>
              </div>
            </div>
            <div class="single-content-right">
                <right-car :isStop="isStop"></right-car>
            </div>
        </div>
    </div>
</div>
</template>
<script>
  import LeftCar from './components/singleCar/leftCar.vue'
  import HeaderCar from './components/singleCar/headerCar.vue'
  import RightCar from './components/singleCar/rightCar.vue'
  import MainCar from './components/singleCar/mainCar.vue'
  import BottomCar from './components/singleCar/bottomCar.vue'
  import {getVehicleBaseData} from '@/api/carMonitor'
  export default {
    name: "SingleCarMonitor",
    components: {LeftCar,HeaderCar,RightCar,MainCar,BottomCar},
    data () {
      return {
        distancePath:[],
        isFirst:true,
        zoom:18,
        realData:{
          oilDoor:0,
          brakePedal:0,
          headingAngle:0,
          headingAngleCalc:0,
          remainElec:0,
          turnLight:'',
          transmission:'P',
          gpsTime:''
        },
        liveData:{},
        speedData:{},
        /*vehicleId:'B21E-00-017',*/
        vehicleId:this.$route.params.vehicleId,
        webSocket:null,
        webSocketVeh:null,
        isStop:false,
        singleVehicle:{},
        vehWsData:null,
        timer:null,
        timeOut:1000*60*5,
      }
    },
    methods: {
      initWebSocket(){
        let _this=this;
        if ('WebSocket' in window) {
          // _this.webSocket = new WebSocket(window.config.websocketUrl);  //获得WebSocket对象
          _this.webSocket = new WebSocket(window.config.socketTestUrl);  //获得WebSocket对象
        }
        _this.webSocket.onmessage = _this.onmessage;
        _this.webSocket.onclose = _this.onclose;
        _this.webSocket.onopen = _this.onopen;
        _this.webSocket.onerror = _this.onerror;
      },
      onmessage(mesasge){
        if(this.timer) clearTimeout(this.timer);
        let _this=this;
        var json = JSON.parse(mesasge.data);
        /*var type = json.action;*/
        var data = json.result;
        if(data.transmission=='P'){
          this.realData.transmission='P';
          this.realData.oilDoor=0;
          this.realData.brakePedal=0;
          this.routeStartTime="";
        }else{
          this.realData = json.result[0];
          this.isStop=false;
        }
        this.timer = setTimeout(() => {
            this.isStop=true;
            this.realData.transmission='P';
            this.realData.oilDoor=0;
            this.realData.brakePedal=0;
            this.routeStartTime="";
        }, this.timeOut);
      },
      onclose(data){
        console.log("结束连接");
      },
      onopen(data){
        var real = {
          action: 'can_real_data',
          token: 'fpx',
          vehicleIds: this.vehicleId
        }
        var realMsg = JSON.stringify(real);
        this.sendMsg(realMsg);
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
      },
      onerror(event){
        console.error("WebSocket error observed:", event);
      },

      initVehWebSocket(){
        let _this=this;
        if ('WebSocket' in window) {
          // _this.webSocketVeh = new WebSocket(window.config.websocketUrl);  //获得WebSocket对象
          _this.webSocketVeh = new WebSocket(window.config.socketTestUrl);  //获得WebSocket对象
        }
        _this.webSocketVeh.onmessage = _this.onmessageVeh;
        _this.webSocketVeh.onclose = _this.oncloseVeh;
        _this.webSocketVeh.onopen = _this.onopenVeh;
        _this.webSocketVeh.onerror = _this.onerrorVeh;
      },

      onmessageVeh(mesasge){
        this.vehWsData = JSON.parse(mesasge.data);
       
      },
      oncloseVeh(data){
        console.log("结束连接");
      },
      onopenVeh(data){
        let param = {
          "action": "vehicle",
          "body": {
              "vehicleId": this.vehicleId
          },
          "type": 1
        }
        var paramMsg = JSON.stringify(param);
        this.sendVehMsg(paramMsg);
      },
      sendVehMsg(msg) {
        let _this=this;
        if(window.WebSocket){
          if(_this.webSocketVeh.readyState == WebSocket.OPEN) { //如果WebSocket是打开状态
            _this.webSocketVeh.send(msg); //send()发送消息
          }
        }else{
          return;
        }
      },
      onerrorVeh(event){
        console.error("webSocketVeh error observed:", event);
      },


      getBaseData(){
        var _this = this;
        getVehicleBaseData({
          'vehicleId': this.vehicleId,
        }).then(res => {
          this.singleVehicle = res.vehicleBaseDetail[0];
        });
      },
    },
    mounted () {
       var a = sessionStorage.getItem("isStop");
      this.initWebSocket();
      this.initVehWebSocket();
      this.getBaseData();
      this.timer = setTimeout(() => {
          this.isStop=true;
          this.realData.transmission='P';
          this.realData.oilDoor=0;
          this.realData.brakePedal=0;
          this.routeStartTime="";
      }, this.timeOut);
    },
    destroyed(){
      //销毁Socket
       this.webSocket&&this.webSocket.close();
       this.webSocketVeh&&this.webSocketVeh.close();
       
    }
  }
</script>
<style scoped>
  .stop-left-text{
    margin: 200px 500px;
    text-align: center;
    color: #dc8c00;
    width: 340px;
    margin-top:20%;
    margin-left:auto;
    margin-right: auto;
  }
  .stop-highlight{
    font-size: 48px;
    background: #333333;
    position: relative;
  }
  .stop-text-detail{
    letter-spacing: 4px;
    line-height: 40px;
    font-size: 18px;
  }
  .stop-highlight > span:nth-child(1){
    position: absolute;
    left: 0px;
    top: 0px;
    padding: 6px;
    border-style: solid;
    border-color: #a3c8b0;
    border-width: 0px;
    box-shadow: -2px -2px 0px 0px #dc8c00;
  }
  .stop-highlight > span:nth-child(2){
    position: absolute;
    right: 0px;
    top: 0px;
    padding: 6px;
    border-style: solid;
    border-color: #a3c8b0;
    border-width: 0px;
    box-shadow: 2px -2px 0px 0px #dc8c00;
  }
  .stop-highlight > span:nth-child(3){
    position: absolute;
    right: 0px;
    bottom: 0px;
    padding: 6px;
    border-style: solid;
    border-color: #a3c8b0;
    border-width: 0px;
    box-shadow: 2px 2px 0px 0px #dc8c00;
  }
  .stop-highlight> span:nth-child(4){
    position: absolute;
    left: 0px;
    bottom: 0px;
    padding: 6px;
    border-style: solid;
    border-color: #a3c8b0;
    border-width:0px;
    box-shadow: -2px 2px 0px 0px #dc8c00;
  }
  .car-view-wrapper{
    position: fixed;
    top:0;
    left:0;
    bottom:0;
    right:0;
    background: #17181c;
    overflow:hidden;
    line-height: 1.42857143;
    letter-spacing: 0;
    font-family: "Helvetica Neue",Helvetica,Arial,sans-serif;
    background-image:url("../../assets/images/car/background.png") ;
    background-size: 100% 100%;
  }
  .single-bottom{
    width:100%;
    height: 50px;
    background: #24212c;
  }
  .single-left,.single-content-right{
    width: 300px;
    height: 100%;
  }
  .single-left {
    float: left;
  }
  .single-main{
    position: relative;
    margin-left: 300px;
    height:100%;
  }

  .single-header{
    height: 80px;
    width: 100%;
    margin-left: 15px;
  }
  .single-content-left{
    position: absolute;
    left: 15px;
    right: 300px;
    top: 15px;
    bottom: 0;
  }
  .stop-left-style{
    position: absolute;
    left: 0;
    top:0;
    right: 0;
    bottom: 0;
    background: #1c1c1c00;
    z-index: 2;
  }
  .single-content-right {
    float: right;
  }
  .single-content-top{
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 200px;
  }
  .stop-style{
    bottom:0!important;
    z-index: 1;
  }
  .single-content-bottom{
    position: absolute;
    left: 15px;
    bottom: 0;
    right: 0;
    height: 200px;
  }
  .distance-detail{
    display: inline-block;
    line-height: 50px;
    color: #ddd9d1;
    width: 200px;
    text-align: left;
    padding-left: 20px;
  }
  .single-content{
    position: absolute;
    left: 0;
    top: 80px;
    right: 0;
    bottom: 50px;
    width: 100%;
  }
</style>
