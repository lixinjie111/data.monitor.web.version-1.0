<template>
  <div class="monitor-traffic">
    <div class="travel-detail">
      <div class="detail1">
        <span>{{realData.longitude | toFixed(8)}}</span>
        <span class="detail2">E</span>
      </div>
      <div class="detail1">
        <span>{{realData.latitude | toFixed(8)}}</span>
        <span class="detail2">N</span>
      </div>
      <div class="detail1">
        <span>{{realData.speed}}</span>
        <span class="detail2">km/h</span>
      </div>
      <div class="detail1">
        <span>{{nowYear}}</span>
        <span class="detail2">{{nowTime}}</span>
      </div>
    </div>
    <div class="alert-event">
      <div class="event-style">
        <img src="@/assets/images/car/car-20.png" />
        <span>{{cloudCount}}</span>
      </div>
      <div class="event-style">
        <img src="@/assets/images/car/car-21.png" />
        <span>{{vehicleCount}}</span>
      </div>
    </div>
    <div class="pre-warning" v-show="warningData.show">
      <div class="pre-warning-img pre-warning-info" v-bind:style="{background:warningData.warningColor}">
        <img src="@/assets/images/car/car-19.png"/>
      </div>
      <div class="pre-warning-style pre-warning-info">
        <p>
          <span class="pre-warning-font">{{warningData.dist}}</span>米
        </p>
        <p>{{warningData.msg}}</p>
      </div>
    </div>
    <!--<img src="@/assets/images/car/car-23.png" class="host-car"/>-->
    <div class="real-traffic" id="realTraffic">

    </div>
    <div class="travel-time" >
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span class="ts1">{{nowTime}}</span>
    </div>
  </div>
</template>
<script>
  import AMap from 'AMap';
  export default {
    name:"main-car",
    data () {
      return {
        distanceMap:{},
        path:[],
        wholePath:[],
        marker:{},
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
        headingAngle:0
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
      }
    },
    computed:{
      nowYear(){
        return this.$dateUtil.formatTime(this.realData.gpsTime).split(" ")[0];
      },
      nowTime(){
        return this.$dateUtil.formatTime(this.realData.gpsTime).split(" ")[1];
      }
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
        AMap.convertFrom(position, 'gps', function (status, result) {
          if (result.info === 'ok') {
            newPosition = result.locations[0];
            /*console.log("longitude:"+data.longitude+"-----"+"latitude:"+data.latitude);*/
            /*this.wholePath.push(to);*/
            //设置车的位置
            var lastPosition = [];
            if(_this.wholePath.length > 0 ) {
              lastPosition = _this.wholePath[_this.wholePath.length-1];
            }else{
              lastPosition = newPosition;
            }
            /*var angle = this.getAngle(this.distanceMap,lastPosition,position);
            this.marker.setAngle(angle);*/
            //存放整个路径
            _this.wholePath.push(newPosition);
            _this.marker.setPosition(lastPosition);
            //设置中心点
            _this.distanceMap.panTo(newPosition);
            //设置旋转角度
            _this.headingAngle = data.heading;
            /*console.log("航向角-----"+_this.headingAngle);*/
            /*_this.distanceMap.setRotation(-_this.headingAngle);*/
            _this.marker.setAngle(_this.headingAngle);
            //所要移动的位置
            _this.marker.moveTo(newPosition,data.speed);
            /*_this.distanceMap.setZoom(18);*/
            /*_this.distanceMap.setFitView();*/
          }
        })
      },
      onclose(data){
        console.log("结束连接");
      },
      onopen(data){
        console.log("建立连接,,,,,,");
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
            console.log("已发送消息:"+ msg);
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
        console.log("建立连接,,,,,,");
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
            console.log("已发送消息:"+ msg);
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
              marker = new AMap.Marker({
                position: newPosition,
                icon: 'static/images/car/car-3.png', // 添加 Icon 图标 URL
                title: '北京',
                /*angle:90*/
              });
              // console.log("航向角："+_this.headingAngle);
             /* marker.setAngle(_this.headingAngle);*/
              _this.distanceMap.add(marker);
              _this.tempDeviceList.push(marker)
              /*_this.deviceMarkerList.push(marker);*/
            })
          })

            // console.log("现在灯的长度："+this.tempDeviceList.length);
            // console.log("上次灯的长度："+this.deviceMarkerList.length);
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
        console.log("建立连接,,,,,,");
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
            console.log("已发送消息:"+ msg);
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
            marker = new AMap.Marker({
              position: newPosition,
              icon: 'static/images/car/car-4.png', // 添加 Icon 图标 URL
              title: '北京',
            });
            _this.distanceMap.add(marker);
            _this.lightMarkerList.push(marker);
          })
        })
      },
      onLightClose(data){
        console.log("结束连接");
      },
      onLightOpen(data){
        console.log("建立连接,,,,,,");
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
            console.log("已发送消息:"+ msg);
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
        var _this=this;
        var json = JSON.parse(mesasge.data);
        var warning = json.result.data;
        var type = json.result.type;
        var type1 = warning.event;
        if(type=='VEHICLE'){
          this.vehicleCount++;
        }
        if(type=='CLOUD'){
          this.cloudCount++;
        }

        //没有预警
        switch (type1) {
          case 0: {
            _this.warningData.show = false;
            _this.warningData.warningColor = '';
            _this.warningData.dist = 0;
            _this.warningData.msg = '无预警/解除预警';
            break;
          }
          case 1: {
            _this.warningData.show = true;
            _this.warningData.warningColor = '#ae3717';
            _this.warningData.dist = warning.dist;
            _this.warningData.msg = '前向碰撞预警';
            break;
          }
          case 2: {
            _this.warningData.show = true;
            _this.warningData.warningColor = '#ae1116';
            _this.warningData.dist = warning.dist;
            _this.warningData.msg = '交叉路口碰撞预警';
            break;
          }
          case 3: {
            _this.warningData.show = true;
            _this.warningData.warningColor = '#ae7039';
            _this.warningData.dist = warning.dist;
            _this.warningData.msg = '左转辅助';
            break;
          }
          case 4: {
            _this.warningData.show = true;
            _this.warningData.warningColor = '#aea04a';
            _this.warningData.dist = warning.dist;
            _this.warningData.msg = '变道预警';
            break;
          }
          case 5: {
            _this.warningData.show = true;
            _this.warningData.warningColor = '#ae4935';
            _this.warningData.dist = warning.dist;
            _this.warningData.msg = '逆向超车预警';
            break;
          }
          case 6: {
            _this.warningData.show = true;
            _this.warningData.warningColor = '#ae5d25';
            _this.warningData.dist = warning.dist;
            _this.warningData.msg = '紧急制动预警';
            break;
          }
          case 9: {
            _this.warningData.show = true;
            _this.warningData.warningColor = '#ae8f46';
            _this.warningData.dist = warning.dist;
            _this.warningData.msg = '紧急车辆提醒';
            break;
          }
          case 10: {
            _this.warningData.show = true;
            _this.warningData.warningColor = '#ae9b41';
            _this.warningData.dist = warning.dist;
            _this.warningData.msg = '盲区提醒';
            break;
          }
          case 12: {
            _this.warningData.show = true;
            _this.warningData.warningColor = '#ae642b';
            _this.warningData.dist = warning.dist;
            _this.warningData.msg = '路侧告警';
            break;
          }

        }
      },
      onWarningClose(data){
        console.log("结束连接");
      },
      onWarningOpen(data){
        console.log("建立连接,,,,,,");
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
      }
    },
    mounted () {
      this.distanceMap = new AMap.Map("realTraffic", {
        center: [116.482362,39.997718],
        mapStyle:'amap://styles/3312a5b0f7d3e828edc4b2f523ba76d8',
        zoom:18,
        rotateEnable:'true'
      });
      this.marker = new AMap.Marker({
        position: new AMap.LngLat(116.482362,39.997718),
        icon: 'static/images/car/car-6.png', // 添加 Icon 图标 URL
        title: '北京',
        zIndex:500
      });
      this.distanceMap.add(this.marker);
      this.initWebSocket();
      this.initSideWebSocket();
      this.initDeviceWebSocket();
      this.initWarningWebSocket();
      this.initLightWebSocket();
    }
  }
</script>
<style scoped>
  .monitor-traffic{
    width: 100%;
    /*height: 600px;*/
    height:100%;
    position: relative;
    background: #1c1c1c;
    color: #ccc8c6;
    font-size: 16px;
  }
  .travel-detail{
    position: absolute;
    left: 0px;
    top: 20px;
    background: #24212c;
    z-index:1;
  }
  .detail1{
    display: inline-block;
    padding:5px 10px;
  }
  .detail2{
    color: #37ba7b;
    display: inline-block;
    padding: 0px 2px;
  }
  .alert-event{
    position: absolute;
    top: 30px;
    right: 25px;
    z-index:1;
    text-align: center;
  }
  .event-style{
    text-align: center;
  }
  .event-style img{
    display: block;
    margin: 0 auto;
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
    position: absolute;
    right: 0px;
    top: 130px;
    width: 250px;
    height: 100px;
    color: #fff;
    z-index: 2;
  }
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
</style>
