<template>
  <div class="monitor-traffic">
    <div class="travel-detail" v-show="!isStop">
      <div class="detail1">
        <span>{{realData.longitude? realData.longitude.toFixed(8):'--'}}</span>
        <span class="detail2">E</span>
      </div>
      <div class="detail1">
        <span>{{realData.latitude ?realData.latitude.toFixed(8):'--'}}</span>
        <span class="detail2">N</span>
      </div>
      <div class="detail1">
        <span>{{realData.speed?realData.speed.toFixed(1):'--'}}</span>
        <span class="detail2">km/h</span>
      </div>
      <div class="detail1">
        <span>{{nowYear}}</span>
        <span class="detail2">{{nowTime}}</span>
      </div>
    </div>
    <div class="spat-detail">
      <div  v-for="(item,key) in lightData" class="spat-layout" :key="key">
        <div v-show="key=='key_3'&&item.flag" class="spat-detail-style">
          <div class="spat-detail-img" >
            <img src="@/assets/images/car/light/turn-yellow.png" v-show="item.lightColor=='YELLOW'"/>
            <img src="@/assets/images/car/light/turn-red.png" v-show="item.lightColor=='RED'"/>
            <img src="@/assets/images/car/light/turn-green.png" v-show="item.lightColor=='GREEN'"/>
          </div>
          <span class="spat-detail-font" :class="[item.lightColor=='YELLOW' ? 'light-yellow' : item.lightColor=='RED'?'light-red':'light-green']">{{item.spareTime}}</span>
        </div>
        <div v-show="key=='key_2'&&item.flag" class="spat-detail-style">
          <div class="spat-detail-img">
            <img src="@/assets/images/car/light/left-yellow.png" v-show="item.lightColor=='YELLOW'"/>
            <img src="@/assets/images/car/light/left-red.png" v-show="item.lightColor=='RED'"/>
            <img src="@/assets/images/car/light/left-green.png" v-show="item.lightColor=='GREEN'"/>
          </div>
          <span class="spat-detail-font" :class="[item.lightColor=='YELLOW' ? 'light-yellow' : item.lightColor=='RED'?'light-red':'light-green']">{{item.spareTime}}</span>
        </div>
        <div v-show="key=='key_1'&&item.flag" class="spat-detail-style">
          <div class="spat-detail-img spat-straight">
            <img src="@/assets/images/car/light/left-yellow.png" v-show="item.lightColor=='YELLOW'" />
            <img src="@/assets/images/car/light/left-red.png" v-show="item.lightColor=='RED'"/>
            <img src="@/assets/images/car/light/left-green.png" v-show="item.lightColor=='GREEN'"/>
          </div>
          <span class="spat-detail-font" :class="[item.lightColor=='YELLOW' ? 'light-yellow' : item.lightColor=='RED'?'light-red':'light-green']">{{item.spareTime}}</span>
        </div>
        <div v-show="key=='key_4'&&item.flag" class="spat-detail-style">
          <div class="spat-detail-img spat-right">
            <img src="@/assets/images/car/light/left-yellow.png" v-show="item.lightColor=='YELLOW'"/>
            <img src="@/assets/images/car/light/left-red.png" v-show="item.lightColor=='RED'"/>
            <img src="@/assets/images/car/light/left-green.png" v-show="item.lightColor=='GREEN'"/>
          </div>
          <span class="spat-detail-font" :class="[item.lightColor=='YELLOW' ? 'light-yellow' : item.lightColor=='RED'?'light-red':'light-green']">{{item.spareTime}}</span>
        </div>
      </div>
      <!--<div class="spat-detail-style">
        <div class="spat-detail-img">
          <img src="@/assets/images/car/left-red.png"/>
        </div>
        <span class="spat-detail-font">20</span>
      </div>
      <div class="spat-detail-style">
        <div class="spat-detail-img">
          <img src="@/assets/images/car/car-28.png"/>
        </div>

        <span class="spat-detail-font spat-detail-color">43</span>
      </div>
      <div class="spat-detail-style">
        <div class="spat-detail-img spat-right">
          <img src="@/assets/images/car/car-28.png"/>
        </div>
        <span class="spat-detail-font spat-detail-color">10</span>
      </div>-->
    </div>
    <div class="alert-event">
      <div class="event-style" @click="getCloudEvent">
        <img src="@/assets/images/car/car-20.png"/>
        <span>{{cloudCount}}</span>
      </div>

      <div class="event-style" @click="getVehicleEvent">
        <img src="@/assets/images/car/car-21.png" />
        <span>{{vehicleCount}}</span>
      </div>
    </div>
    <!--v-show="warningData.show"-->

    <div class="pre-warning">
      <div  class="pre-warning-item" v-for="item in warningList" v-show="item.flag">
        <div class="warning-position" >
          <div class="pre-warning-img pre-warning-info" >
            <img :src="item.icon"/>
          </div>
          <div class="pre-warning-style pre-warning-info">
            <p v-if="item.dist==-1">
              {{item.message}}
            </p>
            <p v-else="item.dist">
              <span class="pre-warning-font">{{item.dist}}</span>米<br/>
              {{item.message}}
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="real-traffic" id="realTraffic">

    </div>
    <div class="travel-time" v-show="!isStop">
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span class="ts1">{{nowTime}}</span>
    </div>
    <single-dialog :dialogVisible="cloudDialog" :title="'预警信息'" @closeDialog="cloudDialog=false">
      <table class="c-table">
        <tr>
          <th>序号</th>
          <th>预警时间</th>
          <th>预警类型</th>
          <th>预警级别</th>
          <th>预警位置</th>
        </tr>
        <tr v-for="(item,index) in cloudList">
          <td>{{index+1}}</td>
          <td>{{item.warningTime | dateFormat}}</td>
          <td>{{item.warningName}}</td>
          <td><p class="alert-level" style="background-color: #ae3717"><span class="alert-level-value">{{item.warningLevel}}</span></p></td>
          <td>{{item.position}}</td>
        </tr>
      </table>
    </single-dialog>
    <single-dialog :dialogVisible="vehicleDialog" :title="'告警信息'" @closeDialog="vehicleDialog=false">
      <table class="c-table">
        <tr>
          <th>序号</th>
          <th>告警时间</th>
          <th>告警名称</th>
          <th>告警级别</th>
          <th>告警车辆</th>
        </tr>
        <tr v-for="(item,index) in vehicleList">
          <td>{{index+1}}</td>
          <td>{{item.warningTime | dateFormat}}</td>
          <td>{{item.warningName}}</td>
          <td><p class="alert-level" style="background-color: #ae3717"><span class="alert-level-value">{{item.warningLevel}}</span></p></td>
          <td>{{item.plateNo}}</td>
        </tr>
        <!--<tr>
          <td>2</td>
          <td>2019-08-27 09:05:34:322</td>
          <td>前向碰撞预警</td>
          <td><p class="alert-level" style="background-color: #fd8610"><span class="alert-level-value">5</span></p></td>
          <td>沪A5237490</td>
        </tr>-->
      </table>
    </single-dialog>
  </div>
</template>
<script>
  import AMap from 'AMap';
  import SingleDialog from '@/views/carMonitor/components/singleCar/dialog.vue'
  import { getAlarmInformation,getV2xInformation } from '@/api/carMonitor'
  import DateFormat from '@/assets/js/utils/date.js'
  import ConvertCoord from '@/assets/js/utils/coordConvert.js'
  export default {
    name:"main-car",
    data () {
      return {
        distanceMap:{},
        marker:{},
        platNoMarker:{},
        sideList:[],
        hostWebsocket:{},
        sideWebsocket:{},
        deviceWebsocket:{},
        lightWebsocket:{},
        warningWebsocket:{},
        warningData:{},
        vehicleId: this.$route.params.vehicleId,
        whetherData:{},
        cloudCount:0,
        vehicleCount:0,
        deviceCount:0,
        headingAngle:0,
        isInit:true,
        isShow:'none',
        warningList:[],
        i:0,
        isAllClear:false,
        cloudDialog:false,
        vehicleDialog:false,
        cloudList:[],
        vehicleList:[],
        event:[],
        count: 0,
        lightCount:0,
        hostCount:0,
        startTime:'',
        lightData:{
         /* '3':{spareTime:10,time:null,lightColor:'GREEN',flag:true},
          '2':{spareTime:10,time:null,lightColor:'RED',flag:true},
          '1':{spareTime:10,time:null,lightColor:'YELLOW',flag:true},
          '4':{spareTime:10,time:null,lightColor:'RED',flag:true},*/
          'key_3':{},
          'key_2':{},
          'key_1':{},
          'key_4':{}
        },
        alertInit:true,
        v2xInit:true,
        v2xUuid:[],
        lastPoint:[]
      }
    },
    props:{
      realData:{
        type:Object,
        default() {
          return {};
        }
      },
      time:{
        type:String
      },
      isStop:{
        type:Boolean,
        default:false
      }
    },
    computed:{
      nowYear(){
        if(this.realData.gpsTime==''){
          return '--';
        }else{
          return this.$dateUtil.formatTime(this.realData.gpsTime).split(" ")[0];
        }
      },
      nowTime(){
        if(this.realData.gpsTime==''){
          return '--';
        }else{
          return this.$dateUtil.formatTime(this.realData.gpsTime).split(" ")[1];
        }
      }
    },
    filters: {
      dateFormat: function (value) {
        let ms = value%1000;
        let time = DateFormat.formatTime(value);
        return time+":"+ms;
      }
    },
    watch:{
      isStop(newVal,oldVal){
        if(newVal){
          //旁车处理,本车保留最后位置
          if(this.sideList.length>0){
            this.distanceMap.remove(this.sideList);
          }
          this.sideWebsocket.close();
        }else{
          console.log("第一次是否走此方法")
          this.initSideWebSocket();
        }
      }
    },
    components:{
      SingleDialog
    },
    methods: {
      getAngle(map,start, end) {
        var p_start = map.lngLatToContainer(start),
          p_end = map.lngLatToContainer(end);
        var diff_x = p_end.x - p_start.x,
          diff_y = p_end.y - p_start.y;
        return 360*Math.atan2(diff_y, diff_x)/(2*Math.PI);
      },
      getMapAngle(map,start){
        var map_center = map.lngLatToContainer([116.478935,39.997761]);
        var p_start = map.lngLatToContainer(start);
        var diff_x = map_center.x - p_start.x,
          diff_y = map_center.y - p_start.y;
        return 360*Math.atan2(diff_y, diff_x)/(2*Math.PI);
      },
      initWebSocket(){
        let _this=this;
        if ('WebSocket' in window) {
          _this.hostWebsocket = new WebSocket(window.cfg.socketUrl);  //获得WebSocket对象
        }
        _this.hostWebsocket.onmessage = _this.onmessage;
        _this.hostWebsocket.onclose = _this.onclose;
        _this.hostWebsocket.onopen = _this.onopen;
        _this.hostWebsocket.onerror = _this.onerror;
      },
      onmessage(mesasge){
        var _this=this;
        var json = JSON.parse(mesasge.data);
        var data = json.result;
        var type = json.action;
          var platNo;
          var source="";
          // let _nowtime = new Date().getTime();
          // console.log(_nowtime, json.time, data.gpsTime, json.time-_nowtime, data.gpsTime-_nowtime);
          if(_this.isInit){
            platNo=data.platNo;
            data.source.forEach(item=>{
              source+=item+",";
            })
            source = source.substring(0,source.lastIndexOf(","));
          }
             let newPosition = ConvertCoord.wgs84togcj02(data.longitude, data.latitude);
              if(_this.isInit){
                _this.marker = new AMap.Marker({
                  position: newPosition,
                  icon: 'static/images/car/car-6.png', // 添加 Icon 图标 URL
                  zIndex:500
                });
                _this.distanceMap.add(_this.marker);
                _this.platNoMarker = new AMap.Text({
                  map: _this.distanceMap,
                  text: platNo+"<br/><span style='color:#e6a23c'>"+source+'</span>',
                  anchor: 'center', // 设置文本标记锚点
                  style: {
                    'padding': '0 5px',
                    'border-radius': '4px',
                    'background-color': 'rgba(55, 186, 123, .2)',
                    'border-width': 0,
                    'text-align': 'center',
                    'font-size': '10px',
                    'line-height': '16px',
                    'letter-spacing': '0',
                    'margin-top': '-36px', //车头
                    'color': '#ccc'
                  },
                  position: newPosition
                });
                _this.isInit=false;
                _this.lastPoint = newPosition;
              }
             /* let lastPoint = _this.lastPoint;
              _this.lastPoint = newPosition;*/
              //设置中心点
//              console.log("newPosition----"+newPosition)
              _this.distanceMap.setCenter(newPosition);
              //设置旋转角度
              _this.headingAngle = data.heading;
              _this.marker.setAngle(_this.headingAngle);
              _this.marker.setPosition(newPosition);
              _this.platNoMarker.setPosition(newPosition);
        /* _this.marker.setPosition(lastPoint);
         _this.platNoMarker.setPosition(lastPoint);
         _this.marker.moveTo(newPosition,data.speed);
         _this.platNoMarker.moveTo(newPosition,data.speed);*/

      },
      onclose(data){
        console.log("结束连接");
      },
      onopen(data){
        //自车
        var hostVehicle = {
          "action": "hostVehicle",
          "vehicleId": this.vehicleId
        }
        var hostVehicleMsg = JSON.stringify(hostVehicle);
        this.sendMsg(hostVehicleMsg);
      },
      sendMsg(msg) {
        let _this=this;
        if(window.WebSocket){
          if(_this.hostWebsocket.readyState == WebSocket.OPEN) { //如果WebSocket是打开状态
            _this.hostWebsocket.send(msg); //send()发送消息
          }
        }else{
          return;
        }
      },
      initSideWebSocket(){
        let _this=this;
        if ('WebSocket' in window) {
          _this.sideWebsocket = new WebSocket(window.cfg.socketUrl);  //获得WebSocket对象
        }
        _this.sideWebsocket.onmessage = _this.onSideMessage;
        _this.sideWebsocket.onclose = _this.onSideClose;
        _this.sideWebsocket.onopen = _this.onSideOpen;
        _this.sideWebsocket.onerror = _this.onSideError;
      },
      onSideMessage(mesasge){
        var _this=this;
        var json = JSON.parse(mesasge.data);
        if(this.count == 0) {
          this.count++;
          //新建点
          var sideVehicleData = json.result.data;
          var resultData=[];
          sideVehicleData.forEach(item=>{
            let option={
              vehicleId:item.vehicleId,
              position:new AMap.LngLat(item.longitude, item.latitude),
              heading:item.heading,
              speed:item.speed,
              longitude:item.longitude,
              latitude: item.latitude

            }
            resultData.push(option);
          });
         if(_this.sideList.length>0){
           _this.distanceMap.remove(_this.sideList);
           _this.sideList=[];
         }
          resultData.forEach(function (item,index,arr) {
              resultData[index].position = ConvertCoord.wgs84togcj02(item.longitude, item.latitude);
              _this.count++;
              if(_this.count == arr.length+1){
                resultData.forEach((subItem, subIndex, subArr)=>{
                  let marker = new AMap.Marker({
                    position: subItem.position,
                    icon: 'static/images/car/car-7.png', // 添加 Icon 图标 URL
                    angle: subItem.heading
                  });
                  _this.sideList.push(marker);
                  _this.distanceMap.add(marker);
                  if(subIndex == subArr.length - 1) {
                    setTimeout(() => {
                      _this.count = 0;
                    }, 0);
                  }
                })
              }
          });
        }
      },
      onSideClose(data){
        console.log("结束连接");
      },
      onSideOpen(data){
        //旁车
        var sideVehicle = {
          "action": "sideVehicle",
          "vehicleId": this.vehicleId
        }
        var sideVehicleMsg = JSON.stringify(sideVehicle);
        this.sendSideMsg(sideVehicleMsg);
      },
      sendSideMsg(msg) {
        let _this=this;
        if(window.WebSocket){
          if(_this.sideWebsocket.readyState == WebSocket.OPEN) { //如果WebSocket是打开状态
            _this.sideWebsocket.send(msg); //send()发送消息
          }
        }else{
          return;
        }
      },
      initDeviceWebSocket(){
        let _this=this;
        if ('WebSocket' in window) {
          _this.deviceWebsocket = new WebSocket(window.cfg.socketUrl);  //获得WebSocket对象
        }
        _this.deviceWebsocket.onmessage = _this.onDeviceMessage;
        _this.deviceWebsocket.onclose = _this.onDeviceClose;
        _this.deviceWebsocket.onopen = _this.onDeviceOpen;
      },
      onDeviceMessage(mesasge){
        var _this=this;
        var json = JSON.parse(mesasge.data);
        var deviceData = json.result.data;
        if(_this.deviceCount==0){
          if(deviceData.length>0){
            var resultData=[];
            deviceData.forEach(item=>{
            let option={
              position:new AMap.LngLat(item.ptLon, item.ptLat),
              longitude:item.ptLon,
              latitude:item.ptLat
            }
            resultData.push(option);
          });
            resultData.forEach(function (item,index,arr) {
              /*AMap.convertFrom(item.position, 'gps', function (status, result) {
                if (result.info === 'ok') {

                  item.position = result.locations[0];*/
                  item.position = ConvertCoord.wgs84togcj02(item.longitude, item.latitude);
//                  console.log("position-------"+ item.position)
                  _this.deviceCount++;
                  if(_this.deviceCount==arr.length){
                    resultData.forEach((subItem,subIndex,subArr)=>{
                      var marker = new AMap.Marker({
                        position: subItem.position,
                        icon: 'static/images/car/car-3.png', // 添加 Icon 图标 URL
                        offset:new AMap.Pixel(-15, -25)

                      });
                      _this.distanceMap.add(marker);
                      if(subIndex==resultData.length-1){
                        _this.deviceCount=0;
                      }
                    })
                  }
                /*}
              })*/
            })

          }
        }

      },
      onDeviceClose(data){
        console.log("结束连接");
      },
      onDeviceOpen(data){
        //旁车
        var deviceVehicle = {
          "action": "rsb",
          "vehicleId": this.vehicleId
        }
        var deviceVehicleMsg = JSON.stringify(deviceVehicle);
        this.sendDeviceMsg(deviceVehicleMsg);
      },
      sendDeviceMsg(msg) {
        let _this=this;
        if(window.WebSocket){
          if(_this.deviceWebsocket.readyState == WebSocket.OPEN) { //如果WebSocket是打开状态
            _this.deviceWebsocket.send(msg); //send()发送消息
          }
        }else{
          return;
        }
      },
      initLightWebSocket(){
        let _this=this;
        if ('WebSocket' in window) {
          _this.lightWebsocket = new WebSocket(window.cfg.socketUrl);  //获得WebSocket对象
        }
        _this.lightWebsocket.onmessage = _this.onLightMessage;
        _this.lightWebsocket.onclose = _this.onLightClose;
        _this.lightWebsocket.onopen = _this.onLightOpen;
      },
      onLightMessage(mesasge){
        var _this=this;
        var json = JSON.parse(mesasge.data);
        var lightData = json.result.data;
        var resultData=[];
        lightData.forEach(item=>{
          let option={
            position:new AMap.LngLat(item.longitude, item.latitude),
            leftTime:item.leftTime,
            light:item.light,
            direction:item.direction,
            longitude:item.longitude,
            latitude:item.latitude
          }
          resultData.push(option);
        });
        if(_this.lightCount==0){
          resultData.forEach(function (item,index,arr) {
            /*AMap.convertFrom(item.position, 'gps', function (status, result) {
              if (result.info === 'ok') {
                item.position = result.locations[0];
                console.log("红绿灯转换成position---"+result.locations[0])*/
                item.position = ConvertCoord.wgs84togcj02(item.longitude, item.latitude);
                _this.lightCount++;
                if(_this.lightCount==arr.length){
                  resultData.forEach((subItem,subIndex,subArr)=>{
                    var marker = new AMap.Marker({
                      position: subItem.position,
                      icon: 'static/images/car/car-4.png', // 添加 Icon 图标 URL
                    });
                    _this.distanceMap.add(marker);
                    if(subIndex==subArr.length-1){
                      _this.lightCount=0;
                    }
                  })
                }
              /*}
            })*/
            let direction = item.direction+"";
//          console.log("direction----"+item.direction)
            let key = 'key_'+direction;
            if(_this.lightData[key].flag){
              /*_this.$set(_this.lightData[direction],'spareTime',item.leftTime);*/
              _this.lightData[key].spareTime = item.leftTime;
              _this.lightData[key].lightColor = item.light;
              _this.lightData[key].flag=true;
              _this.lightData[key].time = null;
              //延长时间
              _this.lightData[key].time=setTimeout(item=>{
                _this.lightData[key].flag=false;
              },3000)
//            console.log("light-----"+_this.lightData[direction].lightColor);

            }/*else{
              _this.lightData[direction]={spareTime:item.leftTime,time:null,lightColor:item.light,flag:true};
              _this.lightData[direction].time=setTimeout(item=>{
                _this.lightData[direction].flag=false;
              },3000)
//              console.log("========"+_this.lightData[direction])
            }*/
          })
        }

      },
      onLightClose(data){
        console.log("结束连接");
      },
      onLightOpen(data){
        //旁车
        var light = {
          "action": "spat",
          "vehicleId": this.vehicleId
        }
        var lightMsg = JSON.stringify(light);
        this.sendLightMsg(lightMsg);
      },
      sendLightMsg(msg) {
        let _this=this;
        if(window.WebSocket){
          if(_this.lightWebsocket.readyState == WebSocket.OPEN) { //如果WebSocket是打开状态
            _this.lightWebsocket.send(msg); //send()发送消息
          }
        }else{
          return;
        }
      },
      initWarningWebSocket(){
        let _this=this;
        if ('WebSocket' in window) {
          _this.warningWebsocket = new WebSocket(window.cfg.socketUrl);  //获得WebSocket对象
        }
        _this.warningWebsocket.onmessage = _this.onWarningMessage;
        _this.warningWebsocket.onclose = _this.onWarningClose;
        _this.warningWebsocket.onopen = _this.onWarningOpen;
      },
      onWarningMessage(mesasge){
//        console.log("时间----"+new Date().getTime())
        var _this=this;
        /*if(this.i>4){
          return;
        }*/
        var json = JSON.parse(mesasge.data);
        var warningData = json.result.data;
        var type = json.result.type;
        if(type=='VEHICLE'){
            this.vehicleCount++;
        }
        if(type=='CLOUD'){
          warningData.forEach(item=>{
            _this.v2xUuid.forEach(e=>{
//              console.log("uuid-------"+e);
            })
//            console.log("集合是否包含某个元素-----"+_this.v2xUuid.indexOf(item.uuid));
            if(_this.v2xUuid.indexOf(item.uuid)==-1){
              this.cloudCount++;
            }
          })
        }
        if(warningData.length>0){
          if(type=='VEHICLE'){
            warningData.forEach(item=>{
              var dist = parseInt(item.dis);
              if(!dist){
                dist=-1;
              }

              var obj = {type: item.eventType,timer: null, flag: true,dist:dist,message:item.warnMsg,icon:item.warnIcon,warnColor:item.warnColor};
              console.log("dist...."+obj.dist);
              obj.timer=setTimeout(()=>{
                obj.flag=false;
                _this.warningList.forEach(item=>{
                  if(item.flag){
                    _this.isAllClear=true;
                  }
                })
                if(!_this.isAllClear){
                  this.warningList=[];
                }
              },3000)
              _this.warningList.unshift(obj);
            })
          }
          if(type=='CLOUD'){
            let eventType = json.result.eventType;
            warningData.forEach(item=>{
              var dist = parseInt(item.dis);
              if(!dist){
                dist=-1;
              }
              var obj = {type:eventType,timer:null,flag:true,dist:dist,message:item.warnMsg,icon:item.warnIcon,warnColor:item.warnColor};
              obj.timer=setTimeout(()=>{
                obj.flag=false;
                _this.warningList.forEach(item=>{
                  if(item.flag){
                    _this.isAllClear=true;
                  }
                })
                if(!_this.isAllClear){
                  this.warningList=[];
                }
              },3000)
              _this.warningList.unshift(obj);
            })
          }
         /* if(type=='CLOUD'){
            let eventType = json.result.eventType;
            //如果发过来的数据存在，则进行计数,不存在的如果3s消失
            if(_this.event.length>0){
              _this.event.forEach(item=>{
                console.log(item.uuid+"-----uuid")
                console.log(item.type+"-----eventType")
                let flag=false;
                warningData.forEach(item1=>{
                  if(item.uuid==item1.uuid){
                    flag=true;
                  }
                });
                //如果存在
                if(flag){
                  item.count++;
                  //如果存在更新定时器
                  clearTimeout(item.timer);
                  item.timer = setTimeout(()=>{
                    item.flag = false;//控制隐藏
//                console.log('如果存在，更新定时器'+item.count)
                  },3000)
                }
              })
            }
            //新推过来的数据中有新发生的事件，进行保存开始计时
            let flag = true;
            warningData.forEach(item=>{
              let obj = {};
              if(_this.event.length>0){
                _this.event.forEach(item1=>{
                  if(item.uuid==item1.uuid){
                    flag= false;
                  }
                })
                //如果不存在，将车辆信息存储起来
                if(flag){
                  obj.count=1;
                  obj.timer=setTimeout(()=>{
                    obj.flag=false;
//                console.log('我要消失了====='+item.vehicleId);
                  },3000);
                  obj.flag=true;
                  obj.type=eventType;
                  obj.uuid = item.uuid;
                }
                _this.event.unshift(obj);
              }else {
                obj.count=1;
                obj.timer=setTimeout(()=>{
                  obj.flag=false;
//              console.log('我要消失了===='+item.vehicleId);
                },3000);
                obj.flag=true;
                obj.type=eventType;
                obj.uuid = item.uuid;
                _this.event.push(obj);
              }
            });
            _this.warningList = [];
            _this.event.forEach(item=>{
              _this.warningList.unshift(item);
            })
          }*/
        }

      },
      onWarningClose(data){
        console.log("结束连接");
      },
      onWarningOpen(data){
        //旁车
        var warning = {
          "action": "warning",
          "vehicleId": this.vehicleId
        }
        var warningMsg = JSON.stringify(warning);
        this.sendWarningMsg(warningMsg);
      },
      sendWarningMsg(msg) {
        let _this=this;
        if(window.WebSocket){
          if(_this.warningWebsocket.readyState == WebSocket.OPEN) { //如果WebSocket是打开状态
            _this.warningWebsocket.send(msg); //send()发送消息
            console.log("warning已发送消息:"+ msg);
          }
        }else{
          return;
        }
      },
      /**
       * 传入最小最大像素坐标
       * **/
      computedGeoRange(){
        //通过像素坐标算出地理坐标
        var minPixel = new AMap.Pixel(0,700);
        var minLnglat = this.distanceMap.containerToLngLat(minPixel,18);
        var maxPixel = new AMap.Pixel(1300,0);
        var maxLnglat = this.distanceMap.containerToLngLat(maxPixel,18);
        var bounds = new AMap.Bounds(minLnglat, maxLnglat);
        return bounds;
      },
      getAlarmInformation(){
        var param = {
          "vehicleId": this.vehicleId
        }
        this.vehicleList= [];
        getAlarmInformation(param).then(res=>{
          this.vehicleList=res.alarmInfoList;
          if(this.alertInit){
            this.vehicleCount = this.vehicleList.length;
            this.alertInit=  false;
          }
        })
      },
      getV2xInformation(){
        var param = {
          "vehicleId": this.vehicleId
        }
        this.cloudList = [];
        getV2xInformation(param).then(res=>{
          this.cloudList=res.earlyWarningInfoList;
          if(this.v2xInit){
            this.cloudCount = this.cloudList.length;
            this.v2xInit=  false;
            this.cloudList.forEach(item=>{
              this.v2xUuid.push(item.uuid);
            })
          }
        })
      },
      getCloudEvent(){
        this.cloudDialog=true;
        this.getV2xInformation();
      },
      getVehicleEvent(){
        this.vehicleDialog=true;
        this.getAlarmInformation();
      }
    },
    mounted () {
      var _this =this;
      this.distanceMap = new AMap.Map("realTraffic", {
        center: [121.18653381418872,31.274421462567677],
        mapStyle:'amap://styles/3312a5b0f7d3e828edc4b2f523ba76d8',
        zoom:18,
        rotateEnable:'true'
      });
      /*let marker1 = new AMap.Marker({
        position: [121.18653381418872,31.274421462567677],
        icon: 'static/images/car/car-1.png', // 添加 Icon 图标 URL
        zIndex:500
      });
      let marker2 = new AMap.Marker({
        position: [121.18696087827043,31.274363226403192],
        icon: 'static/images/car/car-2.png', // 添加 Icon 图标 URL
        zIndex:500
      });
      let marker3 = new AMap.Marker({
        position: [121.18684514591077,31.27437144715565],
        icon: 'static/images/car/car-6.png', // 添加 Icon 图标 URL
        zIndex:500
      });
      this.distanceMap.add(marker1);
      this.distanceMap.add(marker2);
      this.distanceMap.add(marker3);*/
      this.initWebSocket();
      this.initSideWebSocket();
      this.initDeviceWebSocket();
      this.initWarningWebSocket();
      this.initLightWebSocket();
      //云端和车端此次行程统计
      this.getV2xInformation();
      this.getAlarmInformation();
    },
    destroyed(){
      //销毁Socket
      this.hostWebsocket.close();
      this.sideWebsocket.close();
      this.deviceWebsocket.close();
      this.lightWebsocket.close();
      this.warningWebsocket.close();
    }
  }
</script>
<style>
  .car-info{
    color: #ccc;
  }
</style>
<style lang="scss" scoped>
  @import "@/assets/scss/theme.scss";
  .monitor-traffic{
    width: 100%;
    /*height: 600px;*/
    height:100%;
    position: relative;
    background: #1c1c1c;
    color: #ccc8c6;
    font-size: 16px;
    .travel-detail{
      position: absolute;
      left: 0px;
      top: 20px;
      background: #24212c;
      z-index:1;
      .detail1{
        display: inline-block;
        padding:5px 10px;
        .detail2{
          color: #37ba7b;
          display: inline-block;
          padding: 0px 2px;
        }
      }
    }
    .spat-detail{
      position: absolute;
      top: 66px;
      left: 0;
      z-index: 1;
      .spat-layout{
        float: left;
        margin-left: 20px;
      }
      .spat-detail-style{
        width: 130px;
        height: 60px;
        border-radius: 30px;
        background-color: #313131;
        box-sizing: border-box;
        padding:6px 2px;
        /*float: left;
        margin-left: 20px;*/
        @include layoutMode(align);
        .spat-detail-img{
          width: 48px;
          height: 48px;
          background-color: #454545;
          border-radius: 50%;
          display: inline-block;
          position: relative;
          img{
            position: absolute;
            top: 50%;
            margin-top:-15px;
            left: 50%;
            margin-left: -14px;
          }
        }
        .spat-detail-font{
          letter-spacing: 4px;
          color: #c8360f;
          font-size: 36px;
          display: inline-block;
          margin-left: 12px;
        }
        .spat-detail-color{
          color: #23b318;
        }
        .spat-straight{
          transform: rotate(90deg);
        }
        .spat-right{
          transform: rotate(180deg);
        }
        .light-yellow{
          color: #d99f04;
        }
        .light-red{
          color: #c93710;
        }
        .light-green{
          color: #28b51d;
        }
      }
    }
    .alert-event{
      position: absolute;
      top: 30px;
      right: 25px;
      z-index:1;
      text-align: center;
      .event-style{
        text-align: center;
        cursor: pointer;
        img{
          display: block;
          margin: 0 auto;
        }
      }
    }
  }

  .travel-time{
    position: absolute;
    bottom: 10px;
    left:48%;
    width: 100px;
    text-align: center;
    padding: 4px;
  }
  .real-traffic{
    width: 100%;
    height: 100%;
  }
  .travel-time > span:nth-child(1){
    position: absolute;
    left: -3px;
    top: 1px;
    padding: 3px;
    border-style: solid;
    border-color: #8e5a00;
    border-width: 0px;
    box-shadow: -1px -1px 0px 0px #8e5a00;
  }
  .travel-time > span:nth-child(2){
    position: absolute;
    right: -3px;
    top: 1px;
    padding: 3px;
    border-style: solid;
    border-color: #8e5a00;
    border-width: 0px;
    box-shadow: 1px -1px 0px 0px #8e5a00;
  }
  .travel-time > span:nth-child(3){
    position: absolute;
    right: -3px;
    bottom: 1px;
    padding: 3px;
    border-style: solid;
    border-color: #8e5a00;
    border-width: 0px;
    box-shadow: 1px 1px 0px 0px #8e5a00;
  }
  .travel-time> span:nth-child(4){
    position: absolute;
    left: -3px;
    bottom: 1px;
    padding: 3px;
    border-style: solid;
    border-color: #8e5a00;
    border-width:0px;
    box-shadow: -1px 1px 0px 0px #8e5a00;
  }
  .ts1{
    font-family: carFont;
    color: #37ba7b;
    font-size: 16px;
    letter-spacing: 4px;
  }
  .pre-warning{
    overflow: hidden;
    position: absolute;
    right: 0;
    top: 150px;
    z-index: 1;
    height: 460px;
  }
  .pre-warning-item{
    margin-bottom: 16px;
    /*-webkit-animation:show 1s ease-in;
    transition-delay: 50s;*/
  }
  @-webkit-keyframes show
  {
    0% {width:100px;}
    100% {width:250px;}
  }
  /*.pre-warning{
    position: absolute;
    right: 0px;
    !*width: 0px;*!
    width: 250px;
   !* height: 100px;*!
    color: #fff;
    z-index: 2;
    transition:width 2s;
  }*/

  .pre-warning-img{
    background: #ae3717;
    width: 100px;
  }
  .pre-warning-info{
    display: table-cell;
    vertical-align: middle;
    height: 100px;
    text-align: center;
    img{
      width:60px;
      height:auto;
    }
  }
  .pre-warning-style{
    background: #2f2d35;
    width: 150px;
  }
  .pre-warning-style p{
    text-align: center;
    font-size: 14px;
  }
  .pre-warning-font{
    font-size: 20px;
  }
  .host-car{
    position: absolute;
    left: 50%;
    top: 50%;
    width: 18px;
    margin-left: -9px;
    z-index: 999;
  }
  .warning-position{
    position: relative;
  }
</style>
