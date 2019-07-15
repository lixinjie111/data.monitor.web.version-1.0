<template>
  <div class="side-device-info">
    <div class="side-device-style" >
      <div class="side-device-size" >
        <video-player class="vjs-custom-skin" :options="option1" ></video-player>
        <div class="side-device-mask" >
          <p @click="queryDeviceDetail(roadItem1)">路侧点：{{roadItem1.roadSiderId}}</p>
        </div>
      </div>
      <div class="side-device-size " id="device1">
        <!--<div class="device-control">
          <div class="side-device-magnify" v-show="!isFullScreen" @click="perFullScreen"></div>
          <div class="side-device-shrink" v-show="isFullScreen" @click="perShrinkScreen"></div>
        </div>-->
        <div class="side-device-mask" >
          <p @click="queryDeviceDetail(roadItem1)">路侧点：{{roadItem1.roadSiderId}}</p>
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
      <div class="side-device-size" >
        <video-player class="vjs-custom-skin" :options="option2" ></video-player>
        <div class="side-device-mask" >
          <p @click="queryDeviceDetail(roadItem2)">路侧点：{{roadItem2.roadSiderId}}</p>
        </div>
      </div>
      <div class="side-device-size">
        <div class="side-device-mask" >
          <p @click="queryDeviceDetail(roadItem2)">路侧点：{{roadItem2.roadSiderId}}</p>
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
              center2:[],
              isFullScreen:false

            }
        },
        components:{
          VideoPlayer
          ,TusvnMap
        },
        methods: {
          onMapComplete1:function(){
            console.log("onMapComplete1");
            //上海自测
            this.$refs.tusvnMap1.addShape("intersection","./static/map3d/dl_shcsq_zc/Intersection.shp",dl.styles.intersection.color)
            this.$refs.tusvnMap1.addShape("Crosswalk","./static/map3d/dl_shcsq_zc/Crosswalk.shp",dl.styles.crosswalk.color)
            this.$refs.tusvnMap1.addShape("lane_marking","./static/map3d/dl_shcsq_zc/Lane_marking.shp",dl.styles.lane_marking.color)
            this.$refs.tusvnMap1.addShape("lane_arrow","./static/map3d/dl_shcsq_zc/Direction_arrow.shp",dl.styles.lane_arrow.color)
            this.$refs.tusvnMap1.addShape("lane_boundary","./static/map3d/dl_shcsq_zc/Lane_boundary.shp",dl.styles.lane_boundary.color)

            //添加路灯
            this.$refs.tusvnMap1.addModel('street_lamp_two_0','./static/map3d/models/street_lamp_two.3ds',325605.9620401191,3462422.087016858,12.68);
            this.$refs.tusvnMap1.addModel('street_lamp_two_1','./static/map3d/models/street_lamp_two.3ds',325644.5698510726,3462439.737268414,12.68);
            this.$refs.tusvnMap1.addModel('street_lamp_two_2','./static/map3d/models/street_lamp_two.3ds',325678.213173572,3462456.845491925,12.68);
            this.$refs.tusvnMap1.addModel('street_lamp_two_3','./static/map3d/models/street_lamp_two.3ds',325714.8015379905,3462475.9571395535,12.68);
            this.$refs.tusvnMap1.addModel('street_lamp_two_4','./static/map3d/models/street_lamp_two.3ds',325751.7192636788,3462494.9147299756,12.68);
            this.$refs.tusvnMap1.addModel('street_lamp_two_5','./static/map3d/models/street_lamp_two.3ds',325791.2291744284,3462513.0858777757,12.68);
            this.$refs.tusvnMap1.addModel('street_lamp_two_6','./static/map3d/models/street_lamp_two.3ds',325839.45728057146,3462528.673690394,12.68);
            this.$refs.tusvnMap1.addModel('street_lamp_two_7','./static/map3d/models/street_lamp_two.3ds',325871.50033267133,3462535.577747621,12.68);
            this.$refs.tusvnMap1.addModel('street_lamp_two_8','./static/map3d/models/street_lamp_two.3ds',325927.26942355325,3462540.7501094346,12.68);
            this.$refs.tusvnMap1.addModel('street_lamp_two_9','./static/map3d/models/street_lamp_two.3ds',325971.1791292096,3462539.308385897,12.68);
            this.$refs.tusvnMap1.addModel('street_lamp_two_10','./static/map3d/models/street_lamp_two.3ds',326011.51930734934,3462530.549954456,12.68);
            this.$refs.tusvnMap1.addModel('street_lamp_two_11','./static/map3d/models/street_lamp_two.3ds',326060.29745298775,3462517.6961886724,12.68);
            this.$refs.tusvnMap1.addModel('street_lamp_two_12','./static/map3d/models/street_lamp_two.3ds',326110.0640013865,3462499.7403886765,12.68);
            this.$refs.tusvnMap1.addModel('street_lamp_two_13','./static/map3d/models/street_lamp_two.3ds',326146.8028378673,3462478.6396884797,12.68);
            this.$refs.tusvnMap1.addModel('street_lamp_two_14','./static/map3d/models/street_lamp_two.3ds',326184.09992171597,3462451.135337721,12.68);
            this.$refs.tusvnMap1.addModel('street_lamp_two_15','./static/map3d/models/street_lamp_two.3ds',326213.6642104323,3462424.026798547,12.68);
            this.$refs.tusvnMap1.addModel('street_lamp_two_16','./static/map3d/models/street_lamp_two.3ds',326239.9417744168,3462394.325700396,12.68);
            this.$refs.tusvnMap1.addModel('street_lamp_two_17','./static/map3d/models/street_lamp_two.3ds',326261.54341858963,3462364.523596104,12.68);
            this.$refs.tusvnMap1.addModel('street_lamp_two_18','./static/map3d/models/street_lamp_two.3ds',326283.7656650753,3462325.9076287984,12.68);
            this.$refs.tusvnMap1.addModel('street_lamp_two_19','./static/map3d/models/street_lamp_two.3ds',326293.7409365265,3462305.101613318,12.68);
            this.$refs.tusvnMap1.addModel('street_lamp_two_20','./static/map3d/models/street_lamp_two.3ds',326317.89209304436,3462233.2914442807,12.68);
            this.$refs.tusvnMap1.addModel('street_lamp_two_21','./static/map3d/models/street_lamp_two.3ds',326338.3463113972,3462166.509419441,12.68);
            this.$refs.tusvnMap1.addModel('street_lamp_two_22','./static/map3d/models/street_lamp_two.3ds',326360.74210184,3462124.440723257,12.68);
            this.$refs.tusvnMap1.addModel('street_lamp_two_23','./static/map3d/models/street_lamp_two.3ds',326381.50148141605,3462094.623117925,12.68);
            this.$refs.tusvnMap1.addModel('street_lamp_two_24','./static/map3d/models/street_lamp_two.3ds',326404.88685793115,3462064.49447238,12.68)



            this.$refs.tusvnMap1.addModel('street_lamp_two_opposite_0','./static/map3d/models/street_lamp_two.3ds',326539.9124336911,3461961.7054950483,12.68);
            this.$refs.tusvnMap1.addModel('street_lamp_two_opposite_1','./static/map3d/models/street_lamp_two.3ds',326513.87203228497,3461985.7805497725,12.68);
            this.$refs.tusvnMap1.addModel('street_lamp_two_opposite_2','./static/map3d/models/street_lamp_two.3ds',326481.66853339976,3462015.608493991,12.68);
            this.$refs.tusvnMap1.addModel('street_lamp_two_opposite_3','./static/map3d/models/street_lamp_two.3ds',326437.26901612466,3462057.088796324,12.68);
            this.$refs.tusvnMap1.addModel('street_lamp_two_opposite_4','./static/map3d/models/street_lamp_two.3ds',326407.9536514446,3462091.627984262,12.68);
            this.$refs.tusvnMap1.addModel('street_lamp_two_opposite_5','./static/map3d/models/street_lamp_two.3ds',326376.1808195288,3462139.740524388,12.68);
            this.$refs.tusvnMap1.addModel('street_lamp_two_opposite_6','./static/map3d/models/street_lamp_two.3ds',326350.5054369998,3462201.284972825,12.68);
            this.$refs.tusvnMap1.addModel('street_lamp_two_opposite_7','./static/map3d/models/street_lamp_two.3ds',326336.9131020676,3462244.3383032307,12.68);
            this.$refs.tusvnMap1.addModel('street_lamp_two_opposite_8','./static/map3d/models/street_lamp_two.3ds',326348.00984258053,3462274.3429545504,12.68);
            this.$refs.tusvnMap1.addModel('street_lamp_two_opposite_9','./static/map3d/models/street_lamp_two.3ds',326342.11978901166,3462296.5981887174,12.68);
            this.$refs.tusvnMap1.addModel('street_lamp_two_opposite_10','./static/map3d/models/street_lamp_two.3ds',326312.36564479594,3462319.9917033706,12.68);
            this.$refs.tusvnMap1.addModel('street_lamp_two_opposite_11','./static/map3d/models/street_lamp_two.3ds',326293.32005615474,3462357.6330448994,12.68);
            this.$refs.tusvnMap1.addModel('street_lamp_two_opposite_12','./static/map3d/models/street_lamp_two.3ds',326269.8965779829,3462393.1162129235,12.68);
            // this.addModel('street_lamp_two_opposite_13','./static/map3d/models/street_lamp_two.3ds',326269.5184563148,3462393.419889987,12.68);
            this.$refs.tusvnMap1.addModel('street_lamp_two_opposite_14','./static/map3d/models/street_lamp_two.3ds',326254.2686340613,3462413.4506998067,12.68);
            this.$refs.tusvnMap1.addModel('street_lamp_two_opposite_15','./static/map3d/models/street_lamp_two.3ds',326225.2493836086,3462442.6320404094,12.68);
            this.$refs.tusvnMap1.addModel('street_lamp_two_opposite_16','./static/map3d/models/street_lamp_two.3ds',326183.79399392195,3462476.6293645953,12.68);
            this.$refs.tusvnMap1.addModel('street_lamp_two_opposite_17','./static/map3d/models/street_lamp_two.3ds',326152.984818381,3462497.958909394,12.68);
            this.$refs.tusvnMap1.addModel('street_lamp_two_opposite_18','./static/map3d/models/street_lamp_two.3ds',326109.57493707456,3462521.876607037,12.68);
            this.$refs.tusvnMap1.addModel('street_lamp_two_opposite_19','./static/map3d/models/street_lamp_two.3ds',326064.91023163777,3462539.4207325154,12.68);
            this.$refs.tusvnMap1.addModel('street_lamp_two_opposite_20','./static/map3d/models/street_lamp_two.3ds',326018.01353881694,3462553.284279363,12.68);
            this.$refs.tusvnMap1.addModel('street_lamp_two_opposite_21','./static/map3d/models/street_lamp_two.3ds',325971.39649421745,3462560.897562495,12.68);
            this.$refs.tusvnMap1.addModel('street_lamp_two_opposite_22','./static/map3d/models/street_lamp_two.3ds',325938.60034148674,3462562.482200762,12.68);
            this.$refs.tusvnMap1.addModel('street_lamp_two_opposite_23','./static/map3d/models/street_lamp_two.3ds',325904.6023904722,3462584.014099191,12.68);
            this.$refs.tusvnMap1.addModel('street_lamp_two_opposite_24','./static/map3d/models/street_lamp_two.3ds',325881.56604034174,3462581.124477936,12.68);
            this.$refs.tusvnMap1.addModel('street_lamp_two_opposite_25','./static/map3d/models/street_lamp_two.3ds',325858.1721216263,3462556.677784916,12.68);
            this.$refs.tusvnMap1.addModel('street_lamp_two_opposite_26','./static/map3d/models/street_lamp_two.3ds',325821.3680088696,3462547.6220940743,12.68);
            this.$refs.tusvnMap1.addModel('street_lamp_two_opposite_27','./static/map3d/models/street_lamp_two.3ds',325782.45188748406,3462534.4376719757,12.68);
            this.$refs.tusvnMap1.addModel('street_lamp_two_opposite_28','./static/map3d/models/street_lamp_two.3ds',325748.2227811228,3462518.9449371654,12.68);
            this.$refs.tusvnMap1.addModel('street_lamp_two_opposite_29','./static/map3d/models/street_lamp_two.3ds',325723.55472146743,3462502.401337263,12.68);
            this.$refs.tusvnMap1.addModel('street_lamp_two_opposite_30','./static/map3d/models/street_lamp_two.3ds',325704.09742565616,3462492.017142771,12.68);


            //添加红绿灯
            this.$refs.tusvnMap1.addModel('traffic_light_0','./static/map3d/models/traffic_light.3ds',325921.545860186,3462541.0160225183,12.68);
            this.$refs.tusvnMap1.addModel('traffic_light_1','./static/map3d/models/traffic_light.3ds',325868.4327871947,3462561.2291684817,12.68);
            this.$refs.tusvnMap1.addModel('traffic_light_2','./static/map3d/models/traffic_light.3ds',325898.55675146834,3462539.0550170965,12.68);
            this.$refs.tusvnMap1.addModel('traffic_light_3','./static/map3d/models/traffic_light.3ds',326325.78270624415,3462247.0504668984,12.68);
            this.$refs.tusvnMap1.addModel('traffic_light_4','./static/map3d/models/traffic_light.3ds',326314.74230815104,3462313.111718161,12.68);
            this.$refs.tusvnMap1.addModel('traffic_light_5','./static/map3d/models/traffic_light.3ds',326343.54615430237,3462286.313593357,12.68);

            // //添加标识牌
            this.$refs.tusvnMap1.addModel('traffic_sign_stop_0','./static/map3d/models/traffic_sign_stop.3ds',325894.67930130404,3462580.1783312797,12.68);
            this.$refs.tusvnMap1.addModel('traffic_sign_stop_1','./static/map3d/models/traffic_sign_stop.3ds',326253.3704410266,3462374.6075555324,12.68);
            this.$refs.tusvnMap1.addModel('traffic_sign_stop_2','./static/map3d/models/traffic_sign_stop.3ds',326260.07575023104,3462409.3542993385,12.68);

            //矮路灯
            this.$refs.tusvnMap1.addModel("lamppost_01","./static/map3d/models/lamppost_01.3ds",442496.96,4427294.44,16);
            this.$refs.tusvnMap1.getModel("lamppost_01").setHeading(30);
            this.$refs.tusvnMap1.getModel("lamppost_01").setUpdate(true);



            //大路灯
            this.$refs.tusvnMap1.addModel("street_lamp_two","./static/map3d/models/street_lamp_two.3ds",442501.99,4427272.65,16);
            this.$refs.tusvnMap1.getModel("street_lamp_two").setHeading(30);
            this.$refs.tusvnMap1.getModel("street_lamp_two").setUpdate(true);
            //红绿灯
            this.$refs.tusvnMap1.addModel("traffic_light","./static/map3d/models/traffic_light.3ds",442533.95,4427306.77,16);
            this.$refs.tusvnMap1.getModel("traffic_light").setHeading(30);
            this.$refs.tusvnMap1.getModel("traffic_light").setUpdate(true);

            //标识牌
            this.$refs.tusvnMap1.addModel("traffic_sign_stop","./static/map3d/models/traffic_sign_stop.3ds",442529.62,4427323.70,16);
            this.$refs.tusvnMap1.getModel("traffic_sign_stop").setHeading(120);
            this.$refs.tusvnMap1.getModel("traffic_sign_stop").setUpdate(true);

            //女人
            this.$refs.tusvnMap1.addModel("Girl walking N090814","./static/map3d/models/Girl walking N090814.3DS",442529.62,4427325.70,16);
            this.$refs.tusvnMap1.getModel("Girl walking N090814").setHeading(120);
            this.$refs.tusvnMap1.getModel("Girl walking N090814").setUpdate(true);
            //男人
            this.$refs.tusvnMap1.addModel("Man N151016.3DS","./static/map3d/models/Man N151016.3DS",442531.62,4427325.70,16);
            this.$refs.tusvnMap1.getModel("Man N151016.3DS").setHeading(120);
            this.$refs.tusvnMap1.getModel("Man N151016.3DS").setUpdate(true);

            // //障碍物
            // this.$refs.tusvnMap1.addModel("traffic_cone","./static/map3d/models/traffic_cone.3ds",442492.797,4427280.995,16);
            // this.$refs.tusvnMap1.getModel("traffic_cone").setHeading(30);
            // this.$refs.tusvnMap1.getModel("traffic_cone").setUpdate(true);


            if(!this.roadItem1.roadSiderId||this.roadItem1.roadSiderId==''){
              this.$refs.tusvnMap1.updateCameraPosition(442483.4140577592,4427251.954939776,31.211585511525108,31.559324326695666,-0.5889099326599347,-0.6520903697733481);
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
                    _this.option1.sources[0].src=res.data.rtmp;
                    _this.roadItem1=item;
                  }
                  if(index==1){
                    _this.option2.sources[0].src=res.data.rtmp;
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
          }
        },
       watch:{
       },
        mounted() {
         /* this.map1 = new AMap.Map("map1", {
           /!* center: [123.456789,39.123456],*!/
            mapStyle:'amap://styles/3312a5b0f7d3e828edc4b2f523ba76d8',
            zoom:1,
            rotateEnable:'true',
            defaultCursor:'pointer'
          });
          this.map2 = new AMap.Map("map2", {
            /!*center: [116.482362,39.997718],*!/
            mapStyle:'amap://styles/3312a5b0f7d3e828edc4b2f523ba76d8',
            zoom:1,
            rotateEnable:'true',
            defaultCursor:'pointer'
          });*/
          this.getRoadList();
          //给地图绑定点击事件
        /*  this.map1.on('click',()=>{
            this.$emit("queryDeviceDetai



            l",this.roadItem1);
          });
          this.map2.on('click',()=>{
            this.$emit("queryDeviceDetail",this.roadItem2);
          });*/
          /*setTimeout(()=>{
            console.log("设置aaa");
            this.$refs.tusvnMap1.updateCameraPosition(442483.4140577592,4427251.954939776,31.211585511525108,31.559324326695666,-0.5889099326599347,-0.6520903697733481);
          },10000);*/
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
    height: 200px!important;
  }
 /* .side-device-size .vjs-custom-skin > .video-js .vjs-control{
    width:4em;
  }*/
  .vjs-custom-skin>.video-js .vjs-control-bar .vjs-time-control{
    min-width: 3.2em!important;
  }
</style>
<style lang="scss" scoped>

  .side-device-info{
    position: absolute;
    right:20px;

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
