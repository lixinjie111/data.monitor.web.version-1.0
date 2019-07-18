<template>
  <div class="c-info-style">
    <div class="side-device-style" >
      <div class="c-size-style" >
        <video-player class="vjs-custom-skin" :options="option1" @error="playerError1"></video-player>
        <div class="road-mask-style" >
          <div @click="queryDeviceDetail(roadItem1)" class="road-mask-title">路侧点：{{roadItem1.roadSiderId}}</div>
          <img src="@/assets/images/carMonitor/refresh.png" class="road-mask-img" @click="refresh('video1')"/>
        </div>
      </div>
      <div class="c-size-style " id="device1">
        <!--<div class="device-control">
          <div class="side-device-magnify" v-show="!isFullScreen" @click="perFullScreen"></div>
          <div class="side-device-shrink" v-show="isFullScreen" @click="perShrinkScreen"></div>
        </div>-->
        <div class="road-mask-style" >
          <div @click="queryDeviceDetail(roadItem1)" class="road-mask-title">路侧点：{{roadItem1.roadSiderId}}</div>
          <img src="@/assets/images/carMonitor/refresh.png" class="road-mask-img" @click="refresh('map1')"/>
        </div>
        <tusvn-map :target-id="'mapMonitor'" ref="tusvnMap1"
          background="black" minX=325295.155400   minY=3461941.703700  minZ=50
          maxX=326681.125700  maxY=3462723.022400  maxZ=80
          @mapcomplete="onMapComplete1">

        </tusvn-map>
       <!-- <div id="map1" class="side-road-map"></div>-->
      </div>
    </div>
    <div class="side-device-style" >
      <div class="c-size-style" >
        <video-player class="vjs-custom-skin" :options="option2" @error="playerError2"></video-player>
        <div class="road-mask-style" >
          <div @click="queryDeviceDetail(roadItem2)" class="road-mask-title">路侧点：{{roadItem2.roadSiderId}}</div>
          <img src="@/assets/images/carMonitor/refresh.png" class="road-mask-img" @click="refresh('video2')"/>
        </div>
      </div>
      <div class="c-size-style">
        <div class="road-mask-style" >
          <div @click="queryDeviceDetail(roadItem2)" class="road-mask-title">路侧点：{{roadItem2.roadSiderId}}</div>
          <img src="@/assets/images/carMonitor/refresh.png" class="road-mask-img" @click="refresh('map2')"/>
        </div>
        <tusvn-map :target-id="'mapMonitor1'"  ref="tusvnMap2"
          background="black" minX=325295.155400   minY=3461941.703700  minZ=50
          maxX=326681.125700  maxY=3462723.022400  maxZ=80
          @mapcomplete="onMapComplete2">

        </tusvn-map>
        <!--<div id="map2" class="side-road-map"></div>-->
      </div>
    </div>
  </div>
</template>
<script>
  import VideoPlayer from "../../../../node_modules/vue-video-player/src/player.vue";
  import {getVideoByNum,getRoadList} from '@/api/sideDeviceMonitor'
  import {getMap} from '@/utils/tusvnMap.js';
  const isProduction = process.env.NODE_ENV === 'production'

  import TusvnMap from '@/components/Tusvn3DMap2'
    export default {
        data() {
            return {
              option1:{
                overNative: true,
                autoplay: true,
                controls: true,
                fluid: true,
                techOrder: ['flash', 'html5'],
                sourceOrder: true,
                flash: {
                  swf: isProduction ? '/dataMonitor/static/media/video-js.swf' : '/static/media/video-js.swf'
                },
                sources: [
                  {
                    type: 'rtmp/mp4',
                    src: ''
                  }
                ],
                muted:true,
                width:'100%',
                height:'100%',
                notSupportedMessage: '此视频暂无法播放，请稍后再试',
                /*errorDisplay : false,*/
                controlBar: {
                  timeDivider: false,
                  durationDisplay: false,
                  remainingTimeDisplay: false,
                  currentTimeDisplay:false,
                  fullscreenToggle: true, //全屏按钮
                  captionsButton : false,
                  chaptersButton: false,
                  subtitlesButton:false,
                  liveDisplay:false,
                  playbackRateMenuButton:false
                }
              },
              option2:{
                overNative: true,
                autoplay: true,
                controls: true,
                /*fluid: true,*/
                techOrder: ['flash', 'html5'],
                sourceOrder: true,
                flash: {
                  swf: isProduction ? '/dataMonitor/static/media/video-js.swf' : '/static/media/video-js.swf'
                },
                sources: [
                  {
                    type: 'rtmp/mp4',
                    src: ''
                  }
                ],
                muted:true,
                width:'100%',
                height:'100%',
                notSupportedMessage: '此视频暂无法播放，请稍后再试',
               /* errorDisplay : false,*/
                controlBar: {
                  timeDivider: false,
                  durationDisplay: false,
                  remainingTimeDisplay: false,
                  currentTimeDisplay:false,
                  fullscreenToggle: true, //全屏按钮
                  captionsButton : false,
                  chaptersButton: false,
                  subtitlesButton:false,
                  liveDisplay:false,
                  playbackRateMenuButton:false
               }
              },
              roadItem1:{},
              roadItem2:{},
              roadList:[],
              map1:{},
              map2:{},
              websocket1:{},
              websocket2:{},
              roadList1:[],//第一个路侧点的marker集合
              roadList2:[],//第二个路侧点的marker集合
              center1:[],
              center2:[],
              isFullScreen:false,
              rtmp1:"",
              rtmp2:""

            }
        },
        components:{
          VideoPlayer
          ,TusvnMap
        },
        methods: {
          onMapComplete1:function(){
            console.log("onMapComplete1");
            getMap(this.$refs.tusvnMap1);
            this.$refs.tusvnMap1.updateCameraPosition(326298.47687949863,3462315.620723144,32.88598020600586,32.403931760940445,-0.6415033975019673,-2.7256222026242036);
            /*setInterval(()=>{
              let obj = this.$refs.tusvnMap1.getCamera();
              console.log("x:"+obj.x+",y"+obj.y+",z:"+obj.z+",radius:"+obj.radius+",pitch:"+obj.pitch+",yaw:"+obj.yaw);
            },5000)*/
            return;
            if(!this.roadItem1.roadSiderId||this.roadItem1.roadSiderId==''){
              this.$refs.tusvnMap1.updateCameraPosition(326282.75554201024,3462316.8664064347,25.710786551667653,49.684198177964,-0.5303922863908559,-2.1753077372153995);
            }
            if(this.roadItem1.roadSiderId&&this.roadItem1.roadSiderId!=''){
              let cameraParam = JSON.parse(this.roadItem1.cameraParam);
              this.$refs.tusvnMap1.updateCameraPosition(cameraParam.x,cameraParam.y,cameraParam.z,cameraParam.radius,cameraParam.pitch,cameraParam.yaw);
              this.$refs.tusvnMap1.changeRcuId(window.cfg.websocketUrl,this.roadItem1.camSerialNum);
              return;
            }
            let count = 0;
            let time = setInterval(()=>{
              if(this.roadItem1.roadSiderId&&this.roadItem1.roadSiderId!=''){
                console.log('roadItem1------'+this.roadItem1.camSerialNum+"====roadId1"+this.roadItem1.roadSiderId);
                this.$refs.tusvnMap1.updateCameraPosition(442483.4140577592,4427251.954939776,31.211585511525108,31.559324326695666,-0.5889099326599347,-0.6520903697733481);
                let cameraParam = JSON.parse(this.roadItem1.cameraParam);
                this.$refs.tusvnMap1.updateCameraPosition(cameraParam.x,cameraParam.y,cameraParam.z,cameraParam.radius,cameraParam.pitch,cameraParam.yaw);
                this.$refs.tusvnMap1.changeRcuId(window.cfg.websocketUrl,this.roadItem1.camSerialNum);
                clearInterval(time);
              }
              //超过一分钟仍然没有响应 则停止渲染
              if(count==5){
                clearInterval(time);
              }
              count++;
            },1000)
          },
          onMapComplete2:function(){
            console.log("onMapComplete2");
            getMap(this.$refs.tusvnMap2);
            this.$refs.tusvnMap2.updateCameraPosition(326307.52403642295,3462319.729835483,55.56183747132579,61.31110395146773,-0.6314023874009567,0.8750067281934094);
            return;
            if(!this.roadItem2.roadSiderId||this.roadItem2.roadSiderId==''){
              this.$refs.tusvnMap2.updateCameraPosition( 442486.3454129422,4427261.806106671, 47.90669656890555 , 34.88838511357024, -0.7656910059927339,  2.4898596954809307);
            }
            if(this.roadItem2.roadSiderId&&this.roadItem2.roadSiderId!=''){
              let cameraParam = JSON.parse(this.roadItem2.cameraParam);
              this.$refs.tusvnMap2.updateCameraPosition(cameraParam.x,cameraParam.y,cameraParam.z,cameraParam.radius,cameraParam.pitch,cameraParam.yaw);
              this.$refs.tusvnMap2.changeRcuId(window.cfg.websocketUrl, this.roadItem2.camSerialNum);
              return;
            }
            let count = 0;
            let time = setInterval(()=>{
              if(this.roadItem2.roadSiderId&&this.roadItem2.roadSiderId!=''){
                console.log('roadItem2------'+this.roadItem2.camSerialNum+"====roadId2"+this.roadItem2.roadSiderId);
                let cameraParam = JSON.parse(this.roadItem2.cameraParam);
                this.$refs.tusvnMap2.updateCameraPosition(cameraParam.x,cameraParam.y,cameraParam.z,cameraParam.radius,cameraParam.pitch,cameraParam.yaw);
                this.$refs.tusvnMap2.changeRcuId(window.cfg.websocketUrl, this.roadItem2.camSerialNum);
                clearInterval(time);
              }
              //超过一分钟仍然没有响应 则停止渲染
              if(count==5){
                clearInterval(time);
              }
              count++;
            },1000)
          },
          getPlayerOptions(){
            var option={
              overNative: true,
              autoplay: true,
              controls: true,
              fluid: true,
              techOrder: ['flash', 'html5'],
              sourceOrder: true,
              flash: {
                swf: isProduction ? '/dataMonitor/static/media/video-js.swf' : '/static/media/video-js.swf'
              },
              sources: [
                {
                  type: 'rtmp/mp4',
                  src: ''
                }
              ],
              muted:true,
              width:'100%',
              height:'100%'
            }
            return option;
          },
          getRoadList(){
            var _this = this;
            getRoadList().then(res=>{
              _this.roadList = res.data;
              _this.roadList.forEach(function (item,index) {
                getVideoByNum({
                  "protocal": 1,
                  /*"serialNum": "3402000000132000001401"*/
                  "serialNum": item.camSerialNum
                }).then(res => {
                  if(index==0){
                    _this.rtmp1 = res.data.rtmp;
                    _this.option1.sources[0].src=_this.rtmp1;
                    _this.roadItem1=item;
                  }
                  if(index==1){
                    _this.rtmp2 = res.data.rtmp;
                    _this.option2.sources[0].src=_this.rtmp2;
                    _this.roadItem2=item;
                  }
                })
              })
            });
          },
          queryDeviceDetail(item) {
            var _this = this;
            this.$emit("queryDeviceDetail",item);
            /*_this.selectedItem = item;
            this.dialogVisible = true;*/
          },
          initWebSocket1(){
            let _this=this;
            if ('WebSocket' in window) {
              _this.websocket1 = new WebSocket(window.cfg.websocketUrl);  //获得WebSocket对象
            }
            _this.websocket1.onmessage = _this.onmessage1;
            _this.websocket1.onclose = _this.onclose1;
            _this.websocket1.onopen = _this.onopen1;
          },
          onmessage1(mesasge){
            var _this=this;
            var json = JSON.parse(mesasge.data);
            var data = json.result;

            if(_this.center1.length==0){
              console.log("设置中心点----")
              var longitude = json.result[0].target.longitude;
              var latitude = json.result[0].target.latitude;
              _this.center1 = new AMap.LngLat(longitude, latitude);
              //设置中心点
              _this.map1.setCenter(_this.center1);
            }

            if(data.length>0) {
              //从地图上清除marker点
              if(_this.roadList1.length>0){
                _this.map1.remove(_this.roadList1);
                _this.roadList1=[];
              }
              var resultData=[];
              data.forEach(item=>{
                let option;
                let target = item.target;
                if(target.longitude|| target.latitude){
                  option={
                    position:new AMap.LngLat(target.longitude, target.latitude),
                    type:target.type
                    /*type:item.type,
                    deviceId:item.deviceId,
                    path:item.path*/
                  }
                  resultData.push(option);
                }
              });
              var count=0;
              //转成高德地图的坐标
              resultData.forEach((item, index, arr)=>{
                AMap.convertFrom(resultData[index].position, 'gps', function (status, result){
                  if (result.info === 'ok') {
                    let _point = result.locations[0];
                    resultData[index].position = _point;
                    count ++;
//                console.log("count-------"+count);
                    if(count == arr.length) {
                      //绘制线的轨迹
                      var color;
                      resultData.forEach(function (item,index) {
                        if(item.type==0||item.type==1||item.type==3){
                          color='#C4B17A';
                        }else{
                          color='#7337E3';
                        }
                        var circleMarker = new AMap.CircleMarker({
                          center:item.position,
                          radius:6,//3D视图下，CircleMarker半径不要超过64px
                          strokeColor:color,
                          strokeWeight:0,
                          strokeOpacity:0.5,
                          fillColor:color,
                          fillOpacity:0.5,
                          zIndex:10
                        });
                        _this.map1.add(circleMarker);
                        _this.roadList1.push(circleMarker);
                        //绘制完后，重新设置
                        /* console.log("index-------"+index);*/
                        if(index==resultData.length-1){
                          _this.map1.setFitView();
                        }
                      })

                    }
                  }
                });
              })
            }
          },
          onclose1(data){
            console.log("结束连接");
          },
          onopen1(data){
            //自车
            var roadSide1 = {
              "action": "RCUPer",
              "devId": this.roadItem1.camSerialNum
            }
            var roadSide1Msg = JSON.stringify(roadSide1);
            this.sendMsg1(roadSide1Msg);
          },
          sendMsg1(msg) {
            let _this=this;
            if(window.WebSocket){
              if(_this.websocket1.readyState == WebSocket.OPEN) { //如果WebSocket是打开状态
                _this.websocket1.send(msg); //send()发送消息
              }
            }else{
              return;
            }
          },
          initWebSocket2(){
            let _this=this;
            if ('WebSocket' in window) {
              _this.websocket2 = new WebSocket(window.cfg.websocketUrl);  //获得WebSocket对象
            }
            _this.websocket2.onmessage = _this.onmessage2;
            _this.websocket2.onclose = _this.onclose2;
            _this.websocket2.onopen = _this.onopen2;
          },
          onmessage2(mesasge){
            var _this=this;
            var json = JSON.parse(mesasge.data);
            var data = json.result;
            if(_this.center2.length==0){
              console.log("设置中心点----")
              var longitude = json.result[0].target.longitude;
              var latitude = json.result[0].target.latitude;
              _this.center2 = new AMap.LngLat(longitude, latitude);
              //设置中心点
              _this.map2.setCenter(_this.center2);
              //给地图绑定点击事件

            }

            if(data.length>0) {
              //从地图上清除marker点
              if(_this.roadList1.length>0){
                _this.map1.remove(_this.roadList1);
                _this.roadList1=[];
              }
              var resultData=[];
              data.forEach(item=>{
                let option;
                let target = item.target;
                if(target.longitude|| target.latitude){
                  option={
                    position:new AMap.LngLat(target.longitude, target.latitude),
                    type:target.type
                    /*type:item.type,
                    deviceId:item.deviceId,
                    path:item.path*/
                  }
                  resultData.push(option);
                }
              });
              var count=0;
              //转成高德地图的坐标
              resultData.forEach((item, index, arr)=>{
                AMap.convertFrom(resultData[index].position, 'gps', function (status, result){
                  console.log("status============="+status);
                  console.log("count============="+count);
                  if (result.info === 'ok') {
                    let _point = result.locations[0];
                    resultData[index].position = _point;
                    count ++;
//                console.log("count-------"+count);
                    if(count == arr.length) {
                      //绘制线的轨迹
                      var color;
                      resultData.forEach(function (item,index) {
                        if(item.type==0||item.type==1||item.type==3){
                          color='#C4B17A';
                        }else{
                          color='#7337E3';
                        }
                        var circleMarker = new AMap.CircleMarker({
                          center:item.position,
                          radius:6,//3D视图下，CircleMarker半径不要超过64px
                          strokeColor:color,
                          strokeWeight:0,
                          strokeOpacity:0.5,
                          fillColor:color,
                          fillOpacity:0.5,
                          zIndex:10,
                          bubble:true,
                          cursor:'pointer'
                        });
                        _this.map2.add(circleMarker);
                        _this.roadList2.push(circleMarker);
                        //绘制完后，重新设置
                        /* console.log("index-------"+index);*/
                        if(index==resultData.length-1){
                          _this.map2.setFitView();
                        }
                      })

                    }
                  }
                });
              })
            }
          },
          onclose2(data){
            console.log("结束连接");
          },
          onopen2(data){
            //自车
            var roadSide2 = {
              "action": "RCUPer",
              "devId": this.roadItem1.camSerialNum
            }
            var roadSide2Msg = JSON.stringify(roadSide2);
            this.sendMsg2(roadSide2Msg);
          },
          sendMsg2(msg) {
            let _this=this;
            if(window.WebSocket){
              if(_this.websocket2.readyState == WebSocket.OPEN) { //如果WebSocket是打开状态
                _this.websocket2.send(msg); //send()发送消息
              }
            }else{
              return;
            }
          },
          perFullScreen(e){
            this.isFullScreen=true;
            let element = document.getElementById('device1');
            this.openFullscreen(element);
          },
          perShrinkScreen(e){
            this.isFullScreen=false;
            this.exitFullScreen();
          },
          //打开全屏方法
          openFullscreen(element) {
            if (element.requestFullscreen) {
              element.requestFullscreen();
            } else if (element.mozRequestFullScreen) {
              element.mozRequestFullScreen();
            } else if (element.msRequestFullscreen) {
              element.msRequestFullscreen();
            } else if (element.webkitRequestFullscreen) {
              element.webkitRequestFullScreen();
            }
          },

          //退出全屏方法
          exitFullScreen() {
            if (document.exitFullscreen) {
              document.exitFullscreen();
            } else if (document.mozCancelFullScreen) {
              document.mozCancelFullScreen();
            } else if (document.msExitFullscreen) {
              document.msExiFullscreen();
            } else if (document.webkitCancelFullScreen) {
              document.webkitCancelFullScreen();

            } else if (document.webkitExitFullscreen) {
              document.webkitExitFullscreen();
            }
          },
          //视频报错的方法
          playerError1(e) {
            console.log("playerError");
            if(this.option1.sources[0].src != '') {
              let _videoUrl = this.option1.sources[0].src;
              this.option1.sources[0].src = '';
              setTimeout(() => {
                this.option1.sources[0].src = _videoUrl;
              }, 2000);
            }
          },
          playerError2(e) {
            console.log("playerError");
            if(this.option2.sources[0].src != '') {
              let _videoUrl = this.option2.sources[0].src;
              this.option2.sources[0].src = '';
              setTimeout(() => {
                this.option2.sources[0].src = _videoUrl;
              }, 2000);
            }
          },
          getRoad1Info(param){
            let _this=this;
            getVideoByNum({
              "protocal": 1,
              /*"serialNum": "3402000000132000001401"*/
              "serialNum": _this.roadList[0].camSerialNum
            }).then(res => {
              _this.rtmp1 = res.data.rtmp;
              if(_this.rtmp1==""){
//                console.log("rtmp1----")
                _this.option1.notSupportedMessage="";
                _this.option1.notSupportedMessage='视频流不存在，请稍后重试';
              }else{
                _this.option1.notSupportedMessage= '此视频暂无法播放，请稍后再试';
                _this.option1.sources[0].src=_this.rtmp1;
              }
              _this.roadItem1=_this.roadList[0];
              if(param!=''){
                this.$refs.tusvnMap1.changeRcuId(window.cfg.websocketUrl,this.roadItem1.camSerialNum);
              }
            })
          },
          getRoad2Info(param){
            let _this=this;
            getVideoByNum({
              "protocal": 1,
              /*"serialNum": "3402000000132000001401"*/
              "serialNum": _this.roadList[1].camSerialNum
            }).then(res => {
              _this.rtmp2 = res.data.rtmp;
              if(_this.rtmp2==""){
                _this.option2.notSupportedMessage="";
                _this.option2.notSupportedMessage='视频流不存在，请稍后重试';
              }else{
                _this.option2.notSupportedMessage= '此视频暂无法播放，请稍后再试';
                _this.option2.sources[0].src=_this.rtmp2;
              }
              _this.roadItem2=_this.roadList[1];
              if(param!=''){
                this.$refs.tusvnMap2.changeRcuId(window.cfg.websocketUrl,this.roadItem2.camSerialNum);
              }
            })
          },

          //后端请求超时的解决办法
          refresh(param){
            let _this = this;
            if(_this.roadList.length==0){
              _this.getRoadList();
              return;
            }
            if(param=='video1'){
              if(_this.rtmp1==''){
                _this.getRoad1Info();
              }else{
                _this.option1.sources[0].src=_this.rtmp1;
              }
            }
            if(param=='video2'){
              if(_this.rtmp2==''){
                _this.getRoad2Info();
              }else{
                _this.option2.sources[0].src=_this.rtmp2;
              }
            }
            if(param=='map1'){
              if(_this.roadItem1.camSerialNum&&_this.roadItem1.camSerialNum!=""){
                this.$refs.tusvnMap1.changeRcuId(window.cfg.websocketUrl,this.roadItem1.camSerialNum);
              }else {
                _this.getRoad1Info('map');
              }
            }
            if(param=='map2'){
              if(_this.roadItem2.camSerialNum&&_this.roadItem2.camSerialNum!=""){
                this.$refs.tusvnMap2.changeRcuId(window.cfg.websocketUrl,this.roadItem2.camSerialNum);
              }else {
                _this.getRoad2Info('map');
              }
            }
          }
        },
       watch:{
       },
      mounted() {
        this.getRoadList();
      },
      destroyed(){
        //销毁Socket
      }
    }
</script>

<style>
  .c-size-style .vjs-error .vjs-error-display .vjs-modal-dialog-content{
    padding:80px 24px 30px;
    color: #ccc;
  }
  .c-size-style .vjs-error .vjs-error-display:before{
    font-size: 3em;
    color: #ccc;
    top:60%;
    display: none;
  }
  .c-size-style .video-js{
      height: 200px!important;
    }
</style>
<style lang="scss" scoped>
  @import '@/assets/scss/theme.scss';
    .side-device-magnify:before{
      content: "\F108";
      font-family: VideoJS;
      position: absolute;
      z-index: 3;
      right: 10px;
      bottom: 0px;
      font-size: 26px;
    }
    .side-device-shrink:before{
      content: '\F109';
      font-family: VideoJS;
      position: absolute;
      z-index: 3;
      right: 10px;
      bottom: 0px;
      font-size: 26px;
    }
    .device-control{
      position: absolute;
      width:100%;
      bottom: 0;
      height: 40px;
      left: 0px;
      right: 0px;
      box-sizing: border-box;
      padding: 5px;
      opacity: 0;
      cursor: pointer;
      z-index:3;
    }
    .device-control:hover{
      opacity: 1;
      visibility: visible;
      /*background:rgba(0,0,0,0.3) ;*/
      transition:visibility 0.1s, opacity 0.1s;
    }
    .road-mask-style{
      position: absolute;
      width: 310px;
      top: 0;
      cursor: pointer;
      z-index:1;
      @include layoutMode(all);
      .road-mask-title{
        padding-left: 5px;
        font-size: 12px;
        color: #fff;
      }
      .road-mask-img{
        width: 14px;
        height: 14px;
      }
    }
</style>
