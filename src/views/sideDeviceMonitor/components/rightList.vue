<template>
  <div class="c-info-style">
    <div class="side-device-style" >
      <div class="c-size-style" >
        <video-player class="vjs-custom-skin" :options="option1" @error="playerError1"></video-player>
        <div class="road-mask-style" >
          <div @click="queryDeviceDetail(roadItem1,'video')" class="road-mask-title">路侧点：{{roadItem1.roadSiderId}}</div>
          <img src="@/assets/images/carMonitor/refresh.png" class="road-mask-img" @click="refresh('video1')"/>
        </div>
      </div>
      <div class="c-size-style " id="device1">
        <div class="road-mask-style" >
          <div @click="queryDeviceDetail(roadItem1,'map')" class="road-mask-title">路侧点：{{roadItem1.roadSiderId}}</div>
          <img src="@/assets/images/carMonitor/refresh.png" class="road-mask-img" @click="refresh('map1')"/>
        </div>
        <div class="map-show-style" v-show="map1Show">
          <div class="text-show">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            {{message1}}
          </div>
        </div>
        <div style="width: 100%;height: 100%;" v-if="sideMap1">
          <tusvn-map :target-id="'mapMonitor'" ref="tusvnMap1"
                     background="black" minX=325295.155400   minY=3461941.703700  minZ=50
          maxX=326681.125700  maxY=3462723.022400  maxZ=80
          @mapcomplete="onMapComplete1">
          </tusvn-map>
        </div>
        <div v-show="!sideMap1" class="side-map-tip">
          {{map1Message}}
        </div>
       <!-- <div id="map1" class="side-road-map"></div>-->
      </div>
    </div>
    <div class="side-device-style" >
      <div class="c-size-style" >
        <video-player class="vjs-custom-skin" :options="option2" @error="playerError2"></video-player>
        <div class="road-mask-style" >
          <div @click="queryDeviceDetail(roadItem2,'video')" class="road-mask-title">路侧点：{{roadItem2.roadSiderId}}</div>
          <img src="@/assets/images/carMonitor/refresh.png" class="road-mask-img" @click="refresh('video2')"/>
        </div>
      </div>
      <div class="c-size-style">
        <div class="road-mask-style" >
          <div @click="queryDeviceDetail(roadItem2,'map')" class="road-mask-title">路侧点：{{roadItem2.roadSiderId}}</div>
          <img src="@/assets/images/carMonitor/refresh.png" class="road-mask-img" @click="refresh('map2')"/>
        </div>
        <div class="map-show-style" v-show="map2Show">
          <div class="text-show">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            {{message2}}
          </div>
        </div>
        <div style="width: 100%;height: 100%;" v-if="sideMap2">
          <tusvn-map :target-id="'mapMonitor1'"  ref="tusvnMap2"
                     background="black" minX=325295.155400   minY=3461941.703700  minZ=50
          maxX=326681.125700  maxY=3462723.022400  maxZ=80
          @mapcomplete="onMapComplete2">

          </tusvn-map>
        </div>
        <div v-show="!sideMap2" class="side-map-tip">
          {{map2Message}}
        </div>
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
                  swf: isProduction ? '/monPlatform/static/media/video-js.swf' : '/static/media/video-js.swf'
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
                notSupportedMessage: '此视频暂无法播放，请稍候再试',
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
                  swf: isProduction ? '/monPlatform/static/media/video-js.swf' : '/static/media/video-js.swf'
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
                notSupportedMessage: '此视频暂无法播放，请稍候再试',
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
              rtmp2:"",
              map1Show:false,
              message1:'',
              message2:'',
              map2Show:false,
              sideMap1:false,
              sideMap2:false,
              map1Message:'该路口没有数据，请稍候再试！',
              map2Message:'该路口没有数据，请稍候再试！'

            }
        },
        components:{
          VideoPlayer
          ,TusvnMap
        },
        props:{
          visible: {
            type: Boolean,
            default:false
          }
        },
        methods: {
          onMapComplete1:function(){
            console.log("onMapComplete1");
            getMap(this.$refs.tusvnMap1);
            /*this.$refs.tusvnMap1.updateCameraPosition(326297.1669125299,3462321.135051115,30.651420831899046,30.905553118989463,-0.5303922863908559,-2.6312825799826953);
            setInterval(()=>{
              let obj = this.$refs.tusvnMap1.getCamera();
              console.log("x:"+obj.x+",y"+obj.y+",z:"+obj.z+",radius:"+obj.radius+",pitch:"+obj.pitch+",yaw:"+obj.yaw);
            },5000)
            return;*/
            /*this.map1Show=true;
            this.message1='暂无数据，请稍候重试';
            setTimeout(()=>{
              this.map1Show=false;
            },3000)*/
            if(this.roadItem1.roadSiderId&&this.roadItem1.roadSiderId!=''){
              let cameraParam = JSON.parse(this.roadItem1.cameraParam);
              this.$refs.tusvnMap1.updateCameraPosition(cameraParam.x,cameraParam.y,cameraParam.z,cameraParam.radius,cameraParam.pitch,cameraParam.yaw);
              this.$refs.tusvnMap1.changeRcuId(window.config.websocketUrl,this.roadItem1.camSerialNum);
              return;
            }
          },
          onMapComplete2:function(){
            console.log("onMapComplete2");
            getMap(this.$refs.tusvnMap2);
           /* this.$refs.tusvnMap2.updateCameraPosition(325994.544950895,3462549.120490024,26.547772446367873,23.382136948463224,-0.5808973368959062,1.47249100492297);
            return;*/
            //            x:326013.47880100686,y3462543.2482192274,z:26.765194756566043,radius:27.596884800750946,pitch:-0.4192811752797446,yaw:1.4410444640424662
           /* setInterval(()=>{
              let obj = this.$refs.tusvnMap2.getCamera();
              console.log("x:"+obj.x+",y"+obj.y+",z:"+obj.z+",radius:"+obj.radius+",pitch:"+obj.pitch+",yaw:"+obj.yaw);
            },5000)*/
//            this.$refs.tusvnMap2.updateCameraPosition(326307.52403642295,3462319.729835483,55.56183747132579,61.31110395146773,-0.6314023874009567,0.8750067281934094);
           /* this.map2Show=true;
            this.message2='暂无数据，请稍候重试';
            setTimeout(()=>{
              this.map2Show=false;
            },3000)
            return;*/
            if(this.roadItem2.roadSiderId&&this.roadItem2.roadSiderId!=''){
              let cameraParam = JSON.parse(this.roadItem2.cameraParam);
              this.$refs.tusvnMap2.updateCameraPosition(cameraParam.x,cameraParam.y,cameraParam.z,cameraParam.radius,cameraParam.pitch,cameraParam.yaw);
              this.$refs.tusvnMap2.changeRcuId(window.config.websocketUrl, this.roadItem2.camSerialNum);
              return;
            }
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
                swf: isProduction ? '/monPlatform/static/media/video-js.swf' : '/static/media/video-js.swf'
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
          getRoadList(param){
            var _this = this;
            if(param){
              _this.option1.notSupportedMessage='';
              _this.option1.notSupportedMessage='路侧设备不存在!';
              _this.option2.notSupportedMessage='';
              _this.option2.notSupportedMessage='路侧设备不存在!';
              setTimeout(()=>{
                _this.map1Message='路侧设备不存在!';
              },100)
              setTimeout(()=>{
                _this.map2Message='路侧设备不存在!';
              },100)
            }
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
                    if(_this.rtmp1==''){
                      _this.option1.notSupportedMessage='视频流不存在，请稍候再试！';
                    }else{
                      _this.option1.sources[0].src=_this.rtmp1;
                      _this.sideMap1=true;
                    }
                    _this.roadItem1=item;
                  }
                  if(index==1){
                    _this.rtmp2 = res.data.rtmp;
                    if(_this.rtmp2==''){
                      _this.option2.notSupportedMessage='视频流不存在，请稍候再试！';
                    }else{
                      _this.option2.sources[0].src=_this.rtmp2;
                      _this.sideMap2=true;
                    }
                    _this.roadItem2=item;
                  }
                })
              })
            });
          },
          queryDeviceDetail(item,target) {
            var _this = this;
            this.$emit("queryDeviceDetail",item,target);
            /*_this.selectedItem = item;
            this.dialogVisible = true;*/
          },
          initWebSocket1(){
            let _this=this;
            if ('WebSocket' in window) {
              _this.websocket1 = new WebSocket(window.config.websocketUrl);  //获得WebSocket对象
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
              _this.websocket2 = new WebSocket(window.config.websocketUrl);  //获得WebSocket对象
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
          getRoad1Info(){
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
                _this.option1.notSupportedMessage='视频流不存在，请稍候重试';
              }else{
                _this.option1.notSupportedMessage= '此视频暂无法播放，请稍候再试';
                _this.option1.sources[0].src=_this.rtmp1;
              }
              _this.roadItem1=_this.roadList[0];
            })
          },
          getRoad2Info(){
            let _this=this;
            getVideoByNum({
              "protocal": 1,
              /*"serialNum": "3402000000132000001401"*/
              "serialNum": _this.roadList[1].camSerialNum
            }).then(res => {
              _this.rtmp2 = res.data.rtmp;
              if(_this.rtmp2==""){
                _this.option2.notSupportedMessage="";
                _this.option2.notSupportedMessage='视频流不存在，请稍候重试';
              }else{
                _this.option2.notSupportedMessage= '此视频暂无法播放，请稍候再试';
                _this.option2.sources[0].src=_this.rtmp2;
              }
              _this.roadItem2=_this.roadList[1];
            })
          },

          //后端请求超时的解决办法
          refresh(param){
            let _this = this;
            if(_this.roadList.length==0){
              _this.getRoadList('refresh');
              return;
            }
            if(param=='video1'){
              if(_this.rtmp1==''){
                _this.getRoad1Info();
              }else{
                _this.option1.sources[0].src='';
                _this.option1.sources[0].src=_this.rtmp1;
              }
            }
            if(param=='video2'){
              if(_this.rtmp2==''){
                _this.getRoad2Info();
              }else{
                _this.option2.sources[0].src='';
                _this.option2.sources[0].src=_this.rtmp2;
              }
            }
            if(param=='map1'){
              if(_this.rtmp1==''){
                _this.map1Message='';
                setTimeout(()=>{
                  _this.map1Message='该路口没有数据，请稍候再试！';
                },100)
                _this.sideMap1=false;
              }else{
                if(_this.sideMap1){
//                  this.$refs.tusvnMap1.reset3DMap();
                  this.$refs.tusvnMap1.changeRcuId(window.config.websocketUrl,this.roadItem1.camSerialNum);
                  this.map1Show=true;
                  this.message1='数据正在加载，请稍候...';
                  setTimeout(()=>{
                    this.map1Show=false;
                  },3000)
                }else{
                  _this.sideMap1=true;
                }
              }
            }
            if(param=='map2'){
              if(_this.rtmp2==''){
                _this.map2Message='';
                setTimeout(()=>{
                  _this.map2Message='该路口没有数据，请稍候再试！';
                },100)
                _this.sideMap2=false;
              }else{
                if(_this.sideMap2){
//                  this.$refs.tusvnMap2.reset3DMap();
                  this.$refs.tusvnMap2.changeRcuId(window.config.websocketUrl,this.roadItem2.camSerialNum);
                  this.map2Show=true;
                  this.message2='数据正在加载，请稍候...';
                  setTimeout(()=>{
                    this.map2Show=false;
                  },3000)
                }else {
                  _this.sideMap2=true;
                }
              }
            }
          }
        },
      watch:{
        visible(){
          let _this = this;
          //当窗口关闭
          if(!this.visible) {
            //重新连接数据和视频
            if(_this.roadList==0){
              _this.option1.notSupportedMessage='';
              _this.option1.notSupportedMessage='路侧设备不存在!';
              _this.option2.notSupportedMessage='';
              _this.option2.notSupportedMessage='路侧设备不存在!';
              _this.map1Message='路侧设备不存在!';
              _this.map2Message='路侧设备不存在!';
              return;
            }
            if(_this.rtmp1==''){
              _this.option1.notSupportedMessage='视频流不存在，请稍候重试';
              _this.map1Message='该路口没有数据，请稍候再试！';
            }else{
              _this.option1.sources[0].src=_this.rtmp1;
              _this.sideMap1=true;
            }

            if(_this.rtmp2==''){
              _this.option2.notSupportedMessage='视频流不存在，请稍候重试';
              _this.map2Message='该路口没有数据，请稍候再试！';
            }else{

              _this.option2.sources[0].src=_this.rtmp2;
              _this.sideMap2=true;
            }
          }else{
            //打开窗口之前，关闭连接
            _this.option1.notSupportedMessage='连接关闭';
            _this.option1.sources[0].src='';
            _this.option2.notSupportedMessage='连接关闭';
            _this.option2.sources[0].src='';
            _this.sideMap1=false;
            _this.map1Message='连接关闭';
            _this.sideMap2=false;
            _this.map2Message='连接关闭';
          }
        }
      },
      mounted() {
        this.getRoadList();
      },
      destroyed(){
        //销毁Socket
        if(this.$refs.tusvnMap1){
          this.$refs.tusvnMap1.reset3DMap();
        }
        if(this.$refs.tusvnMap2){
          this.$refs.tusvnMap2.reset3DMap();
        }
      }
    }
</script>

<style>
  .c-size-style .vjs-custom-skin > .video-js .vjs-big-play-button{
    display: none!important;
  }
  .c-size-style .vjs-error .vjs-error-display .vjs-modal-dialog-content{
    padding:80px 24px 30px!important;
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
  .side-map-tip{
    text-align: center;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    padding-top:25%;
    color: #ccc;
    background: #000;
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
    .map-show-style{
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      @include layoutMode(both);
      z-index:3;
      text-align: center;
      padding: 80px 60px;
      .text-show{
        position: relative;
        padding:0 4px;
        background:#d6922b;
      }

    }
  .text-show > span:nth-child(1){
    position: absolute;
    left: 0px;
    top: 0px;
    padding: 4px;
    border-style: solid;
    border-color: #a3c8b0;
    border-width: 0px;
    box-shadow: -2px -2px 0px 0px #dc8c00;
  }
  .text-show > span:nth-child(2){
    position: absolute;
    right: 0px;
    top: 0px;
    padding: 4px;
    border-style: solid;
    border-color: #a3c8b0;
    border-width: 0px;
    box-shadow: 2px -2px 0px 0px #dc8c00;
  }
  .text-show > span:nth-child(3){
    position: absolute;
    right: 0px;
    bottom: 0px;
    padding: 4px;
    border-style: solid;
    border-color: #a3c8b0;
    border-width: 0px;
    box-shadow: 2px 2px 0px 0px #dc8c00;
  }
  .text-show> span:nth-child(4){
    position: absolute;
    left: 0px;
    bottom: 0px;
    padding: 4px;
    border-style: solid;
    border-color: #a3c8b0;
    border-width:0px;
    box-shadow: -2px 2px 0px 0px #dc8c00;
  }
  .tips-show{
    animation: myfirst 5s;
  }
  @keyframes myfirst
  {
    from {opacity: 1;}
    to {opacity: 0;}
  }

</style>
