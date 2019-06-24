<template>
  <div class="monitor-traffic">
    <div class="travel-detail">
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
      <div class="spat-detail-style">
        <div class="spat-detail-img">
          <img src="@/assets/images/car/turn-yellow.png"/>
        </div>
        <span class="spat-detail-font" style="color: #d99f04;">10</span>
      </div>
      <div class="spat-detail-style">
        <div class="spat-detail-img">
          <img src="@/assets/images/car/car-27.png"/>
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
      </div>
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
      <div  class="pre-warning-item" v-for="item in warningList" v-show="item.flag" >
        <!--ADAS-->
        <div v-show="item.type=='ADAS_1'" class="warning-position" >
          <div class="pre-warning-img pre-warning-info" style="background: #ae3717">
            <img src="@/assets/images/car/warning/car-1.png"/>
          </div>
          <div class="pre-warning-style pre-warning-info">
            <p>
              <span class="pre-warning-font">{{item.dist}}</span>米<br/>
              前向碰撞预警
            </p>
            <!--<p></p>-->
          </div>
        </div>
        <div v-show="item.type=='ADAS_2'" class="warning-position">
          <div class="pre-warning-img pre-warning-info" style="background: #ae3717">
            <img src="@/assets/images/car/warning/car-2.png"/>
          </div>
          <div class="pre-warning-style pre-warning-info">
            <p>前车启动预警</p>
          </div>
        </div>
        <div v-show="item.type=='ADAS_3'" class="warning-position">
          <div class="pre-warning-img pre-warning-info" style="background: #ae3717">
            <img src="@/assets/images/car/warning/car-3.png"/>
          </div>
          <div class="pre-warning-style pre-warning-info">
            <p>车道偏离预警</p>
          </div>
        </div>
        <div v-show="item.type=='ADAS_4'" class="warning-position">
          <div class="pre-warning-img pre-warning-info" style="background: #fd8610">
            <img src="@/assets/images/car/warning/car-4.png"/>
          </div>
          <div class="pre-warning-style pre-warning-info">
            <p>低光照度开灯提醒</p>
          </div>
        </div>
        <!--V2X-->
        <div v-show="item.type=='V2X_1'" class="warning-position">
          <div class="pre-warning-img pre-warning-info" style="background: #ae3717">
            <img src="@/assets/images/car/warning/car-2.png"/>
          </div>
          <div class="pre-warning-style pre-warning-info">
            <p>前向碰撞预警</p>
          </div>
        </div>
        <div v-show="item.type=='V2X_2'" class="warning-position">
          <div class="pre-warning-img pre-warning-info" style="background: #ae3717">
            <img src="@/assets/images/car/warning/car-5.png"/>
          </div>
          <div class="pre-warning-style pre-warning-info">
            <p>交叉路口碰撞预警</p>
          </div>
        </div>
        <div v-show="item.type=='V2X_3'" class="warning-position">
          <div class="pre-warning-img pre-warning-info" style="background: #ae3717">
            <img src="@/assets/images/car/warning/car-6.png"/>
          </div>
          <div class="pre-warning-style pre-warning-info">
            <p>左转辅助</p>
          </div>
        </div>
        <div v-show="item.type=='V2X_4'" class="warning-position">
          <div class="pre-warning-img pre-warning-info" style="background: #ae3717">
            <img src="@/assets/images/car/warning/car-7.png"/>
          </div>
          <div class="pre-warning-style pre-warning-info">
            <p>变道预警</p>
          </div>
        </div>
        <div v-show="item.type=='V2X_5'" class="warning-position">
          <div class="pre-warning-img pre-warning-info" style="background: #ae3717">
            <img src="@/assets/images/car/warning/car-8.png"/>
          </div>
          <div class="pre-warning-style pre-warning-info">
            <p>逆向超车预警</p>
          </div>
        </div>
        <div v-show="item.type=='V2X_6'" class="warning-position">
          <div class="pre-warning-img pre-warning-info" style="background: #ae3717">
            <img src="@/assets/images/car/warning/car-9.png"/>
          </div>
          <div class="pre-warning-style pre-warning-info">
            <p>紧急制动预警</p>
          </div>
        </div>

        <div v-show="item.type=='V2X_9'" class="warning-position">
          <div class="pre-warning-img pre-warning-info" style="background: #ae3717">
            <img src="@/assets/images/car/warning/car-10.png"/>
          </div>
          <div class="pre-warning-style pre-warning-info">
            <p>紧急车辆预警</p>
          </div>
        </div>
        <div v-show="item.type=='V2X_10'" class="warning-position">
          <div class="pre-warning-img pre-warning-info" style="background: #ae3717">
            <img src="@/assets/images/car/warning/car-7.png"/>
          </div>
          <div class="pre-warning-style pre-warning-info">
            <p>盲区提醒</p>
          </div>
        </div>
        <div v-show="item.type=='V2X_12'" class="warning-position">
          <div class="pre-warning-img pre-warning-info" style="background: #ae3717">
            <img src="@/assets/images/car/warning/car-10.png"/>
          </div>
          <div class="pre-warning-style pre-warning-info">
            <p>路侧告警</p>
          </div>
        </div>

        <!--云下发-->
        <!--道路打滑-->
        <div v-show="item.type=='ICING'" class="warning-position">
          <div class="pre-warning-img pre-warning-info" style="background: #ae3717">
            <img src="@/assets/images/car/warning/car-11.png"/>
          </div>
          <div class="pre-warning-style pre-warning-info">
            <p>道路打滑</p>
          </div>
        </div>
        <!--道路施工-->
        <div v-show="item.type=='ROADWORK'" class="warning-position">
          <div class="pre-warning-img pre-warning-info" style="background: #ae3717">
            <img src="@/assets/images/car/warning/car-12.png"/>
          </div>
          <div class="pre-warning-style pre-warning-info">
            <p>道路施工</p>
          </div>
        </div>
        <!--障碍物-->
        <div v-show="item.type=='OBSTACLESAHEAD'" class="warning-position">
          <div class="pre-warning-img pre-warning-info" style="background: #ae3717">
            <img src="@/assets/images/car/warning/car-13.png"/>
          </div>
          <div class="pre-warning-style pre-warning-info">
            <p>障碍物</p>
          </div>
        </div>
        <!--公交车专用道-->
        <div v-show="item.type=='BUSLANE'" class="warning-position">
          <div class="pre-warning-img pre-warning-info" style="background: #ae3717">
            <img src="@/assets/images/car/warning/car-14.png"/>
          </div>
          <div class="pre-warning-style pre-warning-info">
            <p>公交车专用道</p>
          </div>
        </div>
      </div>
    </div>

    <div class="real-traffic" id="realTraffic">

    </div>
    <div class="travel-time" >
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
          <td>{{item.timestamp | dateFormat}}</td>
          <td>{{item.earlyWarningName}}</td>
          <td><p class="alert-level" style="background-color: #ae3717"><span class="alert-level-value">{{item.earlyWarningLvl}}</span></p></td>
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
          <td>{{item.gpstime | dateFormat}}</td>
          <td>{{item.alarmName}}</td>
          <td><p class="alert-level" style="background-color: #ae3717"><span class="alert-level-value">{{item.alarmLvl}}</span></p></td>
          <td>沪A5237490</td>
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
  export default {
    name:"main-car",
    data () {
      return {
        distanceMap:{},
        path:[],
        wholePath:[],
        marker:{},
        platNoMarker:{},
        sideVehicleList:[],
        sideObjList:[],
        sideVehicleData:[],
        hostWebsocket:{},
        sideWebsocket:{},
        deviceWebsocket:{},
        lightWebsocket:{},
        warningWebsocket:{},
        deviceMarkerList:[],
        tempDeviceList:[],
        lightMarkerList:[],
        warningData:{},
        vehicleId: this.$route.params.vehicleId,
        whetherData:{},
        vehicleCount:0,
        cloudCount:0,
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
        isAllClear:false,
        event:[]
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
      routeStartTime:{
        type:String
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
        var position = new AMap.LngLat(data.longitude,data.latitude);
        var newPosition;
        var platNo;
        var source="";
        // console.log("单车监控地图获取数据---------------------------------------------");
        // let _nowtime = new Date().getTime();
        // console.log(_nowtime, json.time, data.gpsTime, json.time-_nowtime, data.gpsTime-_nowtime);
        if(_this.isInit){
          platNo=data.platNo;
          data.source.forEach(item=>{
            source+=item+",";
          })
          source = source.substring(0,source.lastIndexOf(","));
        }
        AMap.convertFrom(position, 'gps', function (status, result) {
          if (result.info === 'ok') {
            newPosition = result.locations[0];
            if(_this.isInit){
              _this.marker = new AMap.Marker({
                map:_this.distanceMap,
                position: newPosition,
                icon: 'static/images/car/car-6.png', // 添加 Icon 图标 URL
                title: '北京',
                zIndex:500
              });
             /* _this.marker.setLabel({
//                offset: new AMap.Pixel(20, 20),  //设置文本标注偏移量
                content: "<div class='car-info'>京N123456</div>", //设置文本标注内容
                direction: 'left' //设置文本标注方位
              });*/
              _this.distanceMap.add(_this.marker);
              _this.platNoMarker = new AMap.Text({
                map: _this.distanceMap,
                text: platNo+"<br/><span style='color:#e6a23c'>"+source+'</span>',
                // text: '京N123456',
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
            }
            //设置车的位置
            var lastPosition = [];
            if(_this.wholePath.length > 0 ) {
              lastPosition = _this.wholePath[_this.wholePath.length-1];
            }else{
              lastPosition = newPosition;
            }
            //存放整个路径
            _this.wholePath.push(newPosition);
            _this.marker.setPosition(lastPosition);
            _this.platNoMarker.setPosition(lastPosition);
            //设置中心点
            _this.distanceMap.panTo(newPosition);
            //设置旋转角度
            _this.headingAngle = data.heading;
            _this.marker.setAngle(_this.headingAngle);
           /* _this.platNoMarker.setAngle(_this.headingAngle);*/
            //所要移动的位置
            _this.marker.moveTo(newPosition,data.speed);
            _this.platNoMarker.moveTo(newPosition,data.speed);
          }
        })
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
        var data = json.result;
        //新建点
        var sideVehicleData = json.result.data;
        var position;
        var existList = [];
        var newList = [];
        /*console.log("*****************");*/
        sideVehicleData.forEach(function (item) {
          var newObj;
          var oldObj;
          position = new AMap.LngLat(item.longitude, item.latitude);
            var newPosition;
            AMap.convertFrom(position, 'gps', function (status, result) {
              if (result.info === 'ok') {
                newPosition = result.locations[0];
                //判断当前车旁车是否还在
                //如果存在  遗留问题：_this.sideVehicleList不存在的旁车在地图上去掉 同时清理集合中的数据
                if (_this.sideVehicleList.indexOf(item.vehicleId)!=-1) {
                  //将已存在的车保存起来
                  _this.sideVehicleData.forEach(function (e) {
                    //找到存在的车 进行绘制线
                    if (e.vehicleId == item.vehicleId) {
                      oldObj={
                        'vehicleId':e.vehicleId,
                        'marker':e.marker
                      };
                      existList.push(oldObj);
                      //设置车的位置
                      var lastPosition = e.wholePath[e.wholePath.length - 1];
                      e.marker.setPosition(lastPosition);
                      e.marker.setAngle(item.heading);
                      e.wholePath.push(newPosition);
                      //所要移动的位置
                      e.marker.moveTo(newPosition, item.speed);
                      /*_this.distanceMap.setFitView();*/
                    }
                  })
                } else {//不存在
                  var marker = new AMap.Marker({
                    position: newPosition,
                    icon: 'static/images/car/car-7.png', // 添加 Icon 图标 URL
                    title: '北京'
                  });
                  _this.distanceMap.add(marker);
                  var sideCar = {};
                  var wholePath = [];
                  wholePath.push(newPosition);
                  sideCar.wholePath = wholePath;
                  sideCar.marker = marker;
                  sideCar.vehicleId = item.vehicleId;
                  _this.sideVehicleData.push(sideCar);
                  //将新出现车保存起来
                  newObj = {
                    'vehicleId':item.vehicleId,
                    'marker':marker,
                  };

                  newList.push(newObj);
                  _this.sideVehicleList.push(item.vehicleId);
                }
              }
            })
          /*_this.sideVehicleList = [];*/
          //第一次不需要移除没出现的旁车
          if(existList.length!=0){
            //找出原来有的车辆，此时没有的。在地图上去除
            _this.sideVehicleData.forEach(function (item) {
              var flag = false;
              existList.forEach(function (e) {
                if (item.vehicleId == e.vehicleId) {
                  flag = true;
                }
              })
              if (!flag) {
                newList.forEach(function (e) {
                  if (item.vehicleId == e.vehicleId) {
                    flag = true;
                  }
                })
              }
              //车不存在
              if (!flag) {
                //移除地图上的点
                _this.distanceMap.remove(item.marker);
                //数组数据去除不存在的对象
                var index = this.indexOf(item);
                if (index > -1) {
                  _this.splice(index, 1);
                }
                //去除保存原数组中不存在的车辆Id
                var idIndex = _this.sideVehicleList.indexOf(item.vehicleId);
                _this.sideVehicleList.splice(idIndex, 1);
              }
            })
          }
        })
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
        var position;
        var tempList = [];
        if(deviceData.length>0){
          deviceData.forEach(function (item) {
            position = new AMap.LngLat(item.ptLon, item.ptLat);
            var newPosition;
            var marker;
            AMap.convertFrom(position, 'gps', function (status, result) {
              if (result.info === 'ok') {
                newPosition = result.locations[0];
              }
              //如果地图上有该设备，无需重新绘制
              /*var flag = false;
              _this.deviceMarkerList.forEach(function (item) {
                if(item.getPosition()[0] == newPosition[0] &&item.getPosition()[1] == newPosition[1]){
                  flag=true;
                }
              })*/
                marker = new AMap.Marker({
                  position: newPosition,
                  icon: 'static/images/car/car-3.png', // 添加 Icon 图标 URL
                  title: '北京',
                });
                _this.distanceMap.add(marker);
               /* _this.deviceMarkerList.push(marker)*/
            })
          })

        }
        //去除不在范围内地图上的点
        /*if(_this.tempDeviceList.length>0){
          // debugger
          if(_this.deviceMarkerList.length==0){
            _this.deviceMarkerList = _this.tempDeviceList;
          }else{
            for(var i=0;i<_this.deviceMarkerList.length;i++){
              var tempPosition = _this.deviceMarkerList[i].getPosition();
              var flag=false;
              for(var j=0;j<_this.tempDeviceList.length;j++){
                if(_this.tempDeviceList[j].getPosition()[0] == tempPosition[0] && _this.tempDeviceList[j].getPosition()[1] == tempPosition[1]){
                  // console.log("不移除");
                  flag=true;
                  break;
                }
              }
              //如果不存在
              if(!flag){
                _this.distanceMap.remove(_this.deviceMarkerList[i]);
                // console.log("移除");
                // console.log("删除地图上设备的点"+_this.deviceMarkerList[i].getPosition())
              }
            }
            //存放上一次的点
            //  console.log("########################################################################");
            //  console.log("现在灯的长度："+this.tempDeviceList.length);
            // console.log("上次灯的长度："+this.deviceMarkerList.length);
            _this.deviceMarkerList=[];
            _this.deviceMarkerList=_this.tempDeviceList;
            // console.log("赋值后灯的长度："+this.deviceMarkerList.length);
            //有设备出现，存在本次的点
            _this.tempDeviceList = [];
          }
        }else{
          if(_this.deviceMarkerList.length > 0){
            // console.log("*********************************************************************");
            // console.log("全部移除："+_this.deviceMarkerList.length);
            _this.distanceMap.remove(_this.deviceMarkerList);
            _this.deviceMarkerList = [];
          }
        }*/
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
        var position;
        lightData.forEach(function (item) {
          var newPosition;
          var marker;
          AMap.convertFrom(position, 'gps', function (status, result) {
            newPosition = new AMap.LngLat(item.longitude, item.latitude);
            /*var flag = false;
            _this.lightMarkerList.forEach(function (item) {
              if(item.getPosition()[0] == newPosition[0] &&item.getPosition()[1] == newPosition[1]){
                flag=true;
              }
            })*/
              marker = new AMap.Marker({
                position: newPosition,
                icon: 'static/images/car/car-4.png', // 添加 Icon 图标 URL
                title: '北京',
              });
              _this.distanceMap.add(marker);
              /*_this.lightMarkerList.push(marker);*/
          })
        })
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
          this.cloudCount++;
        }
        if(warningData.length>0){
          if(type=='VEHICLE'){

            warningData.forEach(item=>{
              console.log("eventType========"+item.eventType);
              var dist = parseInt(item.dis);
              var obj = {type: item.eventType,timer: null, flag: true,dist:dist};
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
            let vehicleId = json.result.vehicleId;
            //如果发过来的数据存在，则进行计数,不存在的如果3s消失
            if(_this.event.length>0){
              _this.event.forEach(item=>{
                let flag=false;
                warningData.forEach(item1=>{
                  if(item.vehicleId==vehicleId&&item.type==item1.eventType){
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
                  if(item1.vehicleId==vehicleId&&item.type==item1.eventType){
                    flag= false;
                  }
                })
                //如果不存在，将车辆信息存储起来
                if(flag){
                  /*_this.$set(obj,'vehicleId',item.vehicleId);
                  _this.$set(obj,'count',1);
                  _this.$set(obj,'timer',null);
                  _this.$set(obj,'flag',true);
                  _this.$set(obj,'type',item.type);*/
                  obj.vehicleId=vehicleId;
                  obj.count=1;
                  obj.timer=setTimeout(()=>{
                    obj.flag=false;
//                console.log('我要消失了====='+item.vehicleId);
                  },3000);
                  obj.flag=true;
                  obj.type=item.eventType
                }
                _this.event.unshift(obj);
              }else {
                /*_this.$set(obj,'vehicleId',item.vehicleId);
                _this.$set(obj,'count',1);
                _this.$set(obj,'timer',null);
                _this.$set(obj,'flag',true);
                _this.$set(obj,'type',item.type);*/
                obj.vehicleId=vehicleId;
                obj.count=1;
                obj.timer=setTimeout(()=>{
                  obj.flag=false;
//              console.log('我要消失了===='+item.vehicleId);
                },3000);
                obj.flag=true;
                obj.type=item.eventType
                _this.event.unshift(obj);
              }
            });
            _this.event.forEach(item=>{
              _this.warningList.unshift(item);
            })
          }
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
            console.log("已发送消息:"+ msg);
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
          "startTime": this.routeStartTime,
         /* "startTime": 0,*/
          "vehicleId": this.vehicleId
        }
        getAlarmInformation(param).then(res=>{
          this.vehicleList=res.alarmInfoList;
        })
      },
      getV2xInformation(){
        var param = {
          //"startTime": this.routeStartTime,
          "startTime": 0,
          "vehicleId": this.vehicleId
        }
        getV2xInformation(param).then(res=>{
          this.cloudList=res.earlyWarningInfoList;
        })
      },
      getCloudEvent(){
        if(!this.routeStartTime||this.routeStartTime==""){
          this.$message.error("本车行程未开始");
          return;
        }
        this.cloudDialog=true;
        this.getV2xInformation();
      },
      getVehicleEvent(){
        if(!this.routeStartTime||this.routeStartTime==""){
          this.$message.error("本车行程未开始");
          return;
        }
        this.vehicleDialog=true;
        this.getAlarmInformation();
      }
    },
    mounted () {
      var _this =this;
      var i=0;
      var isAllClear=false;
      /*var time = setInterval(()=>{
        if(i==5){
          clearInterval(time);
          return;
        }
        let _attr = i.toString();
        var obj = {type: 'ADAS_'+i,timer: null, flag: true,id:'type'+i}
        obj.timer=setTimeout(()=>{
          obj.flag=false;
          this.warningList.forEach(item=>{
            if(item.flag){
              isAllClear=true;
            }
          })
          if(!isAllClear){
            this.warningList=[];
          }
        },3000)
        this.warningList.unshift(obj);
        i++;
      },2000);*/
      //v2v
      //存储发生的事件
     _this.event=[];
      var data = [[{'vehicleId':'vehicleId1','type':'ADAS_1'},{'vehicleId':'vehicleId2','type':'ADAS_2'}],[{'vehicleId':'vehicleId1','type':'ADAS_1'}],[{'vehicleId':'vehicleId1','type':'ADAS_1'}],[{'vehicleId':'vehicleId1','type':'ADAS_1'}]];
      var time = setInterval(()=>{
        if(i>3){
          clearInterval(time);
          return false;
        }
        var res = data[i];
        //控制事件的显示和消失
        //如果发过来的数据存在，则进行计数,不存在的如果事件显示少于2s则3s后消失，事件显示大于2s，立刻消失
        if(_this.event.length>0){
          _this.event.forEach(item=>{
            let flag=false;
            res.forEach(item1=>{
              if(item.vehicleId==item1.vehicleId&&item.type==item1.type){
                flag=true;
              }
            });
            if(flag){
              item.count++;
              //如果存在更新定时器
              clearTimeout(item.timer);
              item.timer = setTimeout(()=>{
                item.flag = false;//控制隐藏
//                console.log('如果存在，更新定时器'+item.count)
              },3000)
            }/*else{
              //如果不存在
              if(item.count<2){
                console.log('i====='+i);
                console.log('vehicleId======'+item.vehicleId)
                item.timer = setTimeout(()=>{
                  item.flag = false;//控制隐藏
                  console.log('我要消失了')
                },3000)
              }else{
                item.flag = false;
              }
            }*/
          })
        }
        //新推过来的数据中有新发生的事件，进行保存开始计时
        var flag = true;
        res.forEach(item=>{
          let obj = {};
          if(_this.event.length>0){
            _this.event.forEach(item1=>{
              if(item1.vehicleId==item.vehicleId&&item.type==item1.type){
                flag= false;
              }
            })
            //如果不存在，将车辆信息存储起来
            if(flag){
              /*_this.$set(obj,'vehicleId',item.vehicleId);
              _this.$set(obj,'count',1);
              _this.$set(obj,'timer',null);
              _this.$set(obj,'flag',true);
              _this.$set(obj,'type',item.type);*/
              obj.vehicleId=item.vehicleId;
              obj.count=1;
              obj.timer=setTimeout(()=>{
                obj.flag=false;
//                console.log('我要消失了====='+item.vehicleId);
              },3000);
              obj.flag=true;
              obj.type=item.type
            }
            _this.event.unshift(obj);
          }else {
            /*_this.$set(obj,'vehicleId',item.vehicleId);
            _this.$set(obj,'count',1);
            _this.$set(obj,'timer',null);
            _this.$set(obj,'flag',true);
            _this.$set(obj,'type',item.type);*/
            obj.vehicleId=item.vehicleId;
            obj.count=1;
            obj.timer=setTimeout(()=>{
              obj.flag=false;
//              console.log('我要消失了===='+item.vehicleId);
            },3000);
            obj.flag=true;
            obj.type=item.type
            _this.event.unshift(obj);
          }
        });
        i++;
      },1000)

      this.distanceMap = new AMap.Map("realTraffic", {
        center: [116.482362,39.997718],
        mapStyle:'amap://styles/3312a5b0f7d3e828edc4b2f523ba76d8',
        zoom:18,
        rotateEnable:'true'
      });
      /*this.marker = new AMap.Marker({
        map:this.distanceMap,
        position: [116.482362,39.997718],
        icon: 'static/images/car/car-6.png', // 添加 Icon 图标 URL
        title: '北京',
        zIndex:500
      });
      this.marker.setAngle(180);
      this.marker.setLabel({
        offset: new AMap.Pixel(-20, -20),  //设置文本标注偏移量
        content: "<div class='car-info'>京N123456</div>", //设置文本标注内容
        direction: 'top' //设置文本标注方位
      });
      this.distanceMap.add(this.marker);*/


      this.initWebSocket();
      this.initSideWebSocket();
      this.initDeviceWebSocket();
      this.initWarningWebSocket();
      this.initLightWebSocket();
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
  .c-table{
    border:1px solid #5e5970;
    /*background-color: #5e5970;*/
    width:96%;
    text-align: center;
    color: #ffffff;
    font-family: MicrosoftYaHei;
    letter-spacing: 1px;
    tr{
      line-height: 50px;
      th,td{
        border:1px solid #5e5970;
        opacity: 0.6;
        color: #ffffff;
      }
    }
    .alert-level{
      display: inline-block;
      width: 26px;
      height: 26px;
      border-radius: 50%;
      vertical-align: middle;
      position: relative;
      .alert-level-value{
        position: relative;
        top: -12px;
      }
    }
  }
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
      .spat-detail-style{
        width: 130px;
        height: 60px;
        border-radius: 30px;
        background-color: #313131;
        box-sizing: border-box;
        padding:6px 2px;
        float: left;
        margin-left: 20px;
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
        .spat-right{
          transform: rotate(90deg);
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
