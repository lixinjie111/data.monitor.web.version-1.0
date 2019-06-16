<template>
  <div class="side-device-info">
    <div class="side-device-style" >
      <div class="side-device-size" >
        <video-player class="vjs-custom-skin" :options="option1" ></video-player>
        <div class="side-device-mask" @click="queryDeviceDetail(roadItem1)">
          <p>路侧点：{{roadItem1.roadSiderId}}</p>
        </div>
      </div>
      <div class="side-device-size">
        <!--<tusvn-map :target-id="'mapMonitor'" ref="tusvnMap1" @mapcomplet="onMapComplet">

        </tusvn-map>-->
        <div id="map1" class="side-road-map"></div>
      </div>
    </div>
    <div class="side-device-style" >
      <div class="side-device-size" >
        <video-player class="vjs-custom-skin" :options="option2" ></video-player>
        <div class="side-device-mask" @click="queryDeviceDetail(roadItem2)">
          <p>路侧点：{{roadItem2.roadSiderId}}</p>
        </div>
      </div>
      <div class="side-device-size">
        <div id="map2" class="side-road-map"></div>
        <!--<tusvn-map :target-id="'mapMonitor1'"  ref="tusvnMap2">

        </tusvn-map>-->
      </div>
    </div>
  </div>
</template>
<script>
  import VideoPlayer from "../../../../node_modules/vue-video-player/src/player.vue";
  import {getVideoByNum,getRoadList} from '@/api/sideDeviceMonitor'
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
                height:'100%'
              },
              option2:{
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
              center2:[]

            }
        },
        components:{
          VideoPlayer
//          ,TusvnMap
        },
        methods: {
          onMapComplet:function(map){
            console.log(map);
            this.$refs.tusvnMap1.updateCameraPosition(442454.32658068417,4427227.807881102,37.735093606867046,0.0000028926452461693342,-0.39699074074074336,-0.730706721974606);
          },
          onMapComplete1:function(){
            // this.getRoadList();
            console.log("onMapComplete1");
            setTimeout(()=>{
              // _this.$refs.tusvnMap1.changeRcuId(window.cfg.websocketUrl,item.roadSiderId);
//              this.$refs.tusvnMap1.updateCameraPosition(442483.4140577592,4427251.954939776,31.211585511525108,31.559324326695666,-0.5889099326599347,-0.6520903697733481);
            },2000);
            // this.$refs.tusvnMap1.updateCameraPosition(442483.4140577592,4427251.954939776,31.211585511525108,31.559324326695666,-0.5889099326599347,-0.6520903697733481);
          },
          onMapComplete2:function(){
            // this.getRoadList();
            console.log("onMapComplete2");
            // _this.$refs.tusvnMap2.changeRcuId(window.cfg.websocketUrl,item.roadSiderId);
//            this.$refs.tusvnMap2.updateCameraPosition(442483.4140577592,4427251.954939776,31.211585511525108,31.559324326695666,-0.5889099326599347,-0.6520903697733481);
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
                  /*var options = _this.getPlayerOptions();
                  options.sources[0].src=res.data.rtmp;*/
                  /*item.option = options;*/
                  /*_this.playerOptions.push(options);*/
                  if(index==0){
                    _this.option1.sources[0].src=res.data.rtmp;
                    _this.roadItem1=item;
                    _this.initWebSocket1();
//                    _this.$refs.tusvnMap1.changeRcuId(window.cfg.websocketUrl,item.roadSiderId);//2046A1037E1F   item.roadSiderId
//                    _this.$refs.tusvnMap1.updateCameraPosition( 442454.32657890377,4427227.807879115,37.7350947252935, 0.0000028926452461693342, -0.39699074074074336, -0.730706721974606);
//                    console.log("ref------"+ _this.$refs.tusvnMap1);
                  }
                  if(index==1){
                    _this.option2.sources[0].src=res.data.rtmp;
                    _this.roadItem2=item;
                    _this.initWebSocket2();
//                    _this.$refs.tusvnMap2.changeRcuId(window.cfg.websocketUrl,item.roadSiderId);
//                    _this.$refs.tusvnMap2.updateCameraPosition( 442454.32657890377,4427227.807879115,37.7350947252935, 0.0000028926452461693342, -0.39699074074074336, -0.730706721974606);
//                    console.log("ref------"+ _this.$refs.tusvnMap1);
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
          }
        },
       watch:{

       },
        mounted() {
          this.map1 = new AMap.Map("map1", {
           /* center: [123.456789,39.123456],*/
            mapStyle:'amap://styles/3312a5b0f7d3e828edc4b2f523ba76d8',
            zoom:1,
            rotateEnable:'true',
            defaultCursor:'pointer'
          });
          this.map2 = new AMap.Map("map2", {
            /*center: [116.482362,39.997718],*/
            mapStyle:'amap://styles/3312a5b0f7d3e828edc4b2f523ba76d8',
            zoom:1,
            rotateEnable:'true',
            defaultCursor:'pointer'
          });
          this.getRoadList();
          //给地图绑定点击事件
          this.map1.on('click',()=>{
            this.$emit("queryDeviceDetail",this.roadItem1);
          });
          this.map2.on('click',()=>{
            this.$emit("queryDeviceDetail",this.roadItem2);
          });
          setTimeout(()=>{
            console.log("设置aaa");
//            this.$refs.tusvnMap1.updateCameraPosition(442483.4140577592,4427251.954939776,31.211585511525108,31.559324326695666,-0.5889099326599347,-0.6520903697733481);
          },10000);
        }
    }
</script>

<style>
  .side-device-size .vjs-error .vjs-error-display .vjs-modal-dialog-content{
    padding:50px 24px 30px;
    color: #ccc;
  }
  .side-device-size .vjs-error .vjs-error-display:before{
    font-size: 3em;
    color: #ccc;
    top:60%;
  }
  .side-device-size .video-js{
    height: 200px;
  }
 /* .side-device-size .vjs-custom-skin > .video-js .vjs-control{
    width:4em;
  }*/
</style>
<style lang="scss" scoped>

  .side-device-info{
    position: absolute;
    right:20px;
    /*.side-device-style{
      position: relative;
     !* margin-bottom: 30px;*!
    }*/
    .side-device-size{
      width: 330px;
      height: 210px;
      margin-bottom: 30px;
      position: relative;
      padding: 5px;
      border:1px solid #5e5970;
      box-sizing: border-box;
      .side-road-map{
        height:100%;
      }
    }
    .side-device-mask{
      position: absolute;
      width: 310px;
      height: 170px;
      top: 0;
      cursor: pointer;
      z-index:1;
      p{
        margin-top: 10px;
        margin-left: 10px;
        font-size: 12px;
        color: #fff;
      }
    }
  }


</style>
