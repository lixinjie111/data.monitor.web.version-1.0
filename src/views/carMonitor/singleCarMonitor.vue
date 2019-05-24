<template>
<div class="car-view-wrapper">
    <div class="single-top">
        <div class="single-left">
            <left-car ></left-car>
        </div>
        <div class="single-main">
            <div class="single-header">
                <header-car :real-data="realData" ></header-car>
            </div>
            <div class="single-content ">
                <div class="single-content-left">
                    <div class="single-content-top">
                        <main-car :real-data="realData"></main-car>
                    </div>
                    <div class="single-content-bottom">
                        <bottom-car ></bottom-car>
                    </div>
                </div>
                <div class="single-content-right">
                    <right-car></right-car>
                </div>
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
        vehicleId:'B21E-00-017'
      }
    },
    methods: {
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
      onmessage(mesasge){
        let _this=this;
        var json = JSON.parse(mesasge.data);
        /*var type = json.action;*/
        var data = json.result;

        if(data.transmission=='P'){
          this.realData.transmission='P';
          this.realData.oilDoor=0;
          this.realData.brakePedal=0;
        }else{
          this.realData = json.result;
          console.log("转向灯---"+this.realData.turnLight)
        }
      },
      onclose(data){
        console.log("结束连接");
      },
      onopen(data){
        var real = {
          'action':'vehicleDetail',
          /*'vid':this.vehicleID,*/
          'vehicleId':this.vehicleId
        }
        var realMsg = JSON.stringify(real);
        this.sendMsg(realMsg);
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
      onerror(event){
        console.error("WebSocket error observed:", event);
      }
    },
    mounted () {
      this.initWebSocket();
    }
  }
</script>
<style scoped>
  .car-view-wrapper{
    position:relative;
    display: flex;
    justify-content: center;
    flex-direction:column;
    background: #17181c;
    width:1920px;
    height: 1080px;
    overflow:hidden;
  }
  .single-top{
    width:100%;
    height: 1030px;
    display: flex;
  }
  .single-bottom{
    width:100%;
    height: 50px;
    background: #24212c;
  }
  .single-left,.single-content-right{
    width: 300px;
    height:100%;
  }
  .single-main{
    width: 1620px;
    height:100%;
  }
  @media screen and (max-width:1280px) {
    .single-main{
      width: 1000px;
    }
  }
  .single-header{
    height: 80px;
    width: 100%;
    margin-left: 15px;
  }
  .single-content-left{
    width: 1305px;
    height:100%;
    margin-left: 15px;
    margin-top: 15px;
    margin-bottom: 15px;
  }
  .single-content-top{
    height: 700px;
    /*height: 600px;*/
    width:100%;
  }
  .single-content-bottom{
    height: 220px;
    width:100%;
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
    display: flex;
  }
</style>
