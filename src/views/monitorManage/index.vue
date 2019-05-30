<template>
<div class="monitor-manage">
  <div class="monitor-manage-title">
    <img src="@/assets/images/monitorShow/monitor-1.png" class="monitor-title-img"/>
    <span class="monitor-title-style">云控智能路网系统</span>
  </div>
  <div class="crossing-info">
    <p class="crossing-number">路口编号：110108-335</p>
    <div class="crossing-overview">
      <div class="crossing-position" @click="restore">
        <img src="@/assets/images/monitorShow/monitor-2.png" class="crossing-position-img"/>
      </div>
      <span>双清路与中关村东路交叉口</span>
      <ul class="monitor-device">
        <!--<li v-for="item in deviceStatus.devices">
          <span class="monitor-device-line"></span>
          <img src="@/assets/images/monitorManage/monitor-3.png" class="monitor-device-img-1" v-show="item.deviceType=='1'"/>
          <img src="@/assets/images/monitorManage/monitor-4.png" class="monitor-device-img-2" v-show="item.deviceType=='2'"/>
          <span class="monitor-device-text">N32302</span>
          <span class="monitor-device-symbol"></span>
        </li>-->
        <li>
          <span class="monitor-device-line"></span>
          <img src="@/assets/images/monitorShow/monitor-3.png" class="monitor-device-img-1"/>
          <span class="monitor-device-text">N-191-302</span>
          <span class="monitor-device-symbol"></span>
        </li>
        <li>
          <span class="monitor-device-line"></span>
          <img src="@/assets/images/monitorShow/monitor-3.png" class="monitor-device-img-1"/>
          <span class="monitor-device-text">N-191-303</span>
          <span class="monitor-device-symbol"></span>
        </li>
        <li>
          <span class="monitor-device-line"></span>
          <img src="@/assets/images/monitorShow/monitor-4.png" class="monitor-device-img-2"/>
          <span class="monitor-device-text">M-452-121</span>
          <span class="monitor-device-symbol"></span>
        </li>
        <li>
          <span class="monitor-device-line"></span>
          <img src="@/assets/images/monitorShow/monitor-3.png" class="monitor-device-img-1"/>
          <span class="monitor-device-text">N-191-304</span>
          <span class="monitor-device-symbol"></span>
        </li>
        <li>
          <span class="monitor-device-line"></span>
          <img src="@/assets/images/monitorShow/monitor-3.png" class="monitor-device-img-1"/>
          <span class="monitor-device-text">N-191-305</span>
          <span class="monitor-device-symbol"></span>
        </li>
        <li>
          <span class="monitor-device-line"></span>
          <img src="@/assets/images/monitorShow/monitor-4.png" class="monitor-device-img-2"/>
          <span class="monitor-device-text">M-452-122</span>
          <span class="monitor-device-symbol"></span>
        </li>
      </ul>
    </div>
  </div>
  <!--<div class="monitor-vedio-info">
    <div id="cmsplayer" class="monitor-vedio"></div>
  </div>-->
  <div class="moniter-manage-map">
    <tusvn-map :target-id="'mapMonitor'" ref="tusvnMap" @showTimeStamp="showTimeStamp">

    </tusvn-map>
  </div>
  <div class="time-style">
    <span class="t-class">{{time}}</span>
  </div>
</div>
</template>
<script>
  import {findBaseData,getRTMPData,getDeviceStatus} from '@/api/monitorManage'
  import TusvnMap from '@/components/Tusvn3DMap2'
    export default {
        data() {
            return {
              cameraList:[],
              deviceStatus:{},
              monitorSocket:{},
              monitorUrl:'ws://120.133.21.14:29998/ws',
              time:''
            }
        },
        components:{TusvnMap},
        methods: {
          findBaseData(){
            findBaseData({
              'rCUId': '1240',
            }).then(res => {
              this.cameraList = res.data;
              this.getStream();
            });
          },
          getStream(){
            getRTMPData({
              "procotal": '1',
              "serialNum": '3402000000132000001401'
            }).then(res => {
              //获取视频地址并赋值
              let videoUrl = res.data.rtmp;
              this.embedFlash(videoUrl);
            });
          },
          embedFlash(rtmpSource){//部署
            var flashVars = "&src=";
            flashVars += rtmpSource; //视频文件
            flashVars += "&autoHideControlBar=true";
            flashVars += "&streamType=";
            flashVars += "live";// vod点播 live直播
            flashVars += "&autoPlay=true";
            flashVars += "&verbose=true";

            var embedCode =  '<object id="flashPlayer" name="flashPlayer" width="100%" height="100%" type="application/x-shockwave-flash"> ';
            embedCode += '<param name="movie" value="static/swf/StrobeMediaPlayback.swf"></param>';
            embedCode += '<param name="flashvars" value="' + flashVars + '"></param>';
            embedCode += '<param name="allowFullScreen" value="true"></param><param name="allowscriptaccess" value="always"></param>';
            embedCode += '<param name="wmode" value="opaque"></param>';
            embedCode += '<embed  id="flashPlayer" name="flashPlayer" src="static/swf/StrobeMediaPlayback.swf" type="application/x-shockwave-flash"';
            embedCode += ' allowscriptaccess="always" allowfullscreen="true" ';
            embedCode += ' wmode="opaque" ';
            embedCode += ' width="100%" height="100%" ';
            embedCode += 'flashvars="' + flashVars + '">';
            embedCode += '</embed></object>';
            console.log(embedCode);
            document.getElementById("cmsplayer").innerHTML = embedCode;
          },
          getDeviceStatus(){
            getDeviceStatus({
              'rCUId': '1240',
            }).then(res => {
              this.deviceStatus = res.data;
            });
          },
          initWebSocket(){
            let _this=this;
            if ('WebSocket' in window) {
              _this.monitorSocket = new WebSocket(_this.monitorUrl);  //获得WebSocket对象
            }
            _this.monitorSocket.onmessage = _this.onmessage;
            _this.monitorSocket.onclose = _this.onclose;
            _this.monitorSocket.onopen = _this.onopen;
            _this.monitorSocket.onerror = _this.onerror;
          },
          onmessage(mesasge){
            let _this=this;
            var json = JSON.parse(mesasge.data);
            /*var type = json.action;*/
            var data = json.result;

          },
          onclose(data){
            console.log("结束连接");
          },
          onopen(data){
            var monitor = {
              "action":"rcu",
              "data":{"rcuId":"2046A1035893"},
              "token":"fpx"
            }
            var monitorMsg = JSON.stringify(monitor);
            this.sendMsg(monitorMsg);
          },
          sendMsg(msg) {
            let _this=this;
            console.log("连接状态："+_this.monitorSocket.readyState);
            if(window.WebSocket){
              if(_this.monitorSocket.readyState == WebSocket.OPEN) { //如果WebSocket是打开状态
                _this.monitorSocket.send(msg); //send()发送消息
                console.log("已发送消息:"+ msg);
              }
            }else{
              return;
            }
          },
          onerror(event){
            console.error("WebSocket error observed:", event);
          },
          restore(){
            this.$refs.tusvnMap.resetCamera();
          },
          showTimeStamp(time){
            this.time=time;
          }
        },
        mounted() {
          /*this.findBaseData();
          this.getDeviceStatus();*/
         /* this.initWebSocket();*/
        }
    }
</script>
<style scoped>
  .monitor-manage{
    position: fixed;
    top:0;
    left:0;
    bottom:0;
    right:0;
    /*position: absolute;
    top:50%;
    margin-top: -540px;
    left:50%;
    margin-left: -960px;
    !*background: #d2a458;*!
    width:1920px;
    height: 1080px;*/
    overflow:hidden;
    background: #2a2a2a;
  }
  .monitor-vedio{
    width: 100%;
    height: 100%;
  }
  .monitor-manage-title{
    padding:24px 24px 24px 30px;
    position: absolute;
    top:0;
    left: 0;
    width:100%;
    border-bottom:1px solid #4d4d4d;
    padding:16px 10px;
    z-index:1;
  }
  .monitor-title-img{
    width: 46px;
    height:auto;
    padding-right: 10px; ;
  }
  .monitor-title-style{
    font-size: 40px;
    letter-spacing: 3px;
    vertical-align: middle;
    color: #ffffff;
  }
  .crossing-info{
    position: absolute;
    left: 30px;
    top: 104px;
    z-index:1;
  }
  .crossing-number{
    position: relative;
    font-size: 24px;
    letter-spacing: 2px;
    color: #e4f5ef;
    /*margin-bottom: 70px;*/
    padding-left: 18px;
    margin-top: 20px;
    margin-bottom: 24px;
  }
  .crossing-number:before{
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    margin-top: -11px;
    width: 4px;
    height: 22px;
    background-color: #51cdff;
  }
  .crossing-overview{
    color: #c0c4cc;
    font-size: 20px;
    letter-spacing: 2px;
    font-family: MicrosoftYaHei;
    background: #000;
  }
  .crossing-position{
    width: 60px;
    height: 60px;
    border-radius: 5px;
    border: solid 1px #51cdff;
    position: relative;
    display: inline-block;
    vertical-align: middle;
    margin-right: 18px;
  }
  .crossing-position-img{
    width: 46px;
    height:auto;
    left:50%;
    top:50%;
    transform:translate(-50%,-50%);
    position: absolute;
  }
  /*.crossing-position-text{
    font-size: 20px;
    letter-spacing: 2px;
  }*/
  .monitor-device{
    margin-left: 30px;
    border-left:1px solid #51cdff;
  }
  .monitor-device li{
    height: 70px;
    line-height: 70px;
  }
  .monitor-device-img-1{
    width:38px;
  }
  .monitor-device-img-2{
    width:34px;
    padding: 0px 2px;
  }
  .monitor-device-text{
    vertical-align: middle;
  }
  .monitor-device-symbol{
    width: 14px;
    height: 14px;
    border-radius: 7px;
    background-color: #19cd2e;
    display: inline-block;
    vertical-align: middle;
  }
  .monitor-device-line{
    display: inline-block;
    border-top:1px dashed #51cdff;
    width: 34px;
    height: 0px;
    vertical-align: middle;
  }
  .monitor-vedio-info{
    position: absolute;
    width: 480px;
    height: 300px;
    border:1px solid #5e5970;
    top: 130px;
    right: 24px;
    padding: 10px;
    z-index:1;
    background: #000;
  }
  .moniter-manage-map{
    position: absolute;
    width: 100%;
    height: 100%;
    z-index:0;
  }
  .time-style{
    position: absolute;
    bottom: 100px;
    right: 150px;
  }
  .t-class{
    width: 250px;
    text-align: left;
    display: block;
    font-size: 16px;
  }

</style>
