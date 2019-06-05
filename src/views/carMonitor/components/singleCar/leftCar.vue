<template>
  <div class="monitor-left">
    <p class="car-detail-title">
      <span class="car-detail">车牌号：{{singleVehicle.platNo}}</span>
      <span class="car-level">L{{singleVehicle.autoLevel}}</span>
    </p>
    <div class="monitor-car">
      <img class="car-img" src="@/assets/images/car/car.png" ></img>
    </div>
    <p class="monitor-title">行车统计</p>
    <div class="clearfix line-style">
      <div class="line line-1" >
        <span class="line1"></span>
      </div>
      <div class="line line-2" >
        <span class="line2"></span>
      </div>
    </div>
    <div class="clearfix">
       <ul class="statistic-style">
         <li>
           <img src="@/assets/images/car/car-1.png" class="statistic-img"/>
         </li>
         <li>
           <span class="text-font">{{drivingStatistics.cumulatedMiles}}</span>
           <span class="text-style">KM</span>
         </li>
         <li>
           <span class="text-style">行车里程</span>
         </li>
       </ul>
       <ul class="statistic-style">
         <li>
           <img src="@/assets/images/car/car-2.png" class="statistic-img"/>
         </li>
         <li>
           <span class="text-font">{{drivingStatistics.cumulatedTime}}</span>
           <span class="text-style">H</span>
         </li>
         <li>
           <span class="text-style">驾驶时长</span>
         </li>
       </ul>
       <ul class="statistic-style">
         <li>
           <img src="@/assets/images/car/car-3.png" class="statistic-img"/>
         </li>
         <li>
           <span class="text-font">{{drivingStatistics.avgSpeed}}</span>
           <span class="text-style">KM/H</span>
         </li>
         <li>
           <span class="text-style">平均速度</span>
         </li>
       </ul>
       <ul class="statistic-style">
         <li>
           <img src="@/assets/images/car/car-4.png" class="statistic-img"/>
         </li>
         <li>
           <span class="text-font">{{drivingStatistics.tripNums}}</span>
         </li>
         <li>
           <span class="text-style">行程数量</span>
         </li>
       </ul>

     </div>


    <p class="monitor-title">行程概览</p>
    <div class="clearfix line-style">
      <div class="line line-1" >
        <span class="line1"></span>
      </div>
      <div class="line line-2" >
        <span class="line2"></span>
      </div>
    </div>
    <div class="distance-overview" id="distanceContainer"></div>

    <div class="single-bottom">

        <span class="distance-detail">行驶开始时间：{{routeInfo.routeStartTime ? $dateUtil.formatTime(routeInfo.routeStartTime) : "--"}}</span>
        <span class="distance-detail">累计行驶时长：{{routeInfo.durationTime ? getRunTime(routeInfo.durationTime) : "--"}}</span>
        <span class="distance-detail">累计行驶里程：{{routeInfo.mileage ? routeInfo.mileage.toFixed(1) : "--"}}km</span>
        <span class="distance-detail">平均测速：{{routeInfo.avgSpd ? routeInfo.avgSpd.toFixed(1) : "--"}}km/h</span>

    </div>

  </div>
</template>
<script>
  import AMap from 'AMap';
  import { getDrivingStatisticsData, getVehicleBaseData } from '@/api/carMonitor'
  export default {
    name: "LeftCar", // 实时数据
    props:{
      path: {
        type: Array,
        default() {
          return [];
        }
      }/*,
      zoom:{
        type:Number,
        default:18
      }*/
    },
    data () {
      return {
        map: {
          id: 'monitorCar',
          layerId: 'monitorCarLayer'
        },
       /* path:[],*/
        vehicleId: this.$route.params.vehicleId,//车编号
        drivingStatistics:{},
        singleVehicle:{},

        distanceMap:{}, //创建的地图对象
        prevLastPointPath:[],//上次请求的终点，
        carStartPoint:this.$parent.defalutCenterPoint,
        routeId: "",
        pointPath:[],//整个行程路径
        markers: {
          markerStart: null,
          polyline: [],
          markerEnd: null
        },

        // times: 1,
        scale: 10,
        all: 1,
        handleZoom: 11,

        zoom: 11,
        // direction: 0,  //航向角--方向
        routeInfo: {},
        // mapTimestamp: 0,
        wholePath: [],

        count: 0,
        flag: true,

        webSocket:{},

        webSocketData: {
            'action':'route',
            'vehicleId': '',
            'scale': 0,
            'all': 1
        }
      }
    },
    watch: {
      deep: true,
      handleZoom(newVal, oldVal){
          // this.all = 1;  //可以不用重绘

          this.setScale();
          console.log("zoom, change");
      },
      all(newVal, oldVal){
        if(newVal == 1){
          this.initDistanceMap();
          console.log("all=1, change重绘路线");
        }else{
          // this.onopen();
          this.webSocketData.scale = this.scale;
          this.webSocketData.all = newVal;
          this.webSocket.send(JSON.stringify(this.webSocketData));
          console.log("all=0, chang，重新发起服务");
        }
      }
    },
    methods: {
      getRunTime(nS) {
        nS = nS / 1000;
        var year = Math.floor(nS / 86400 / 365);
        nS = nS % (86400 * 365);
        var month = Math.floor(nS / 86400 / 30);
        nS = nS % (86400 * 30);
        var day = Math.floor(nS / 86400);
        nS = nS % 86400;
        var hour = Math.floor(nS / 3600);
        nS = nS % 3600;
        var minute = Math.floor(nS / 60);
        nS = nS % 60;
        var second = Math.floor(nS);

        year = year == 0 ? "" : year+"年";
        month = month == 0 ? "" : month+"个月";
        day = day == 0 ? "" : day+"天";
        hour = hour == 0 ? "" : hour+"小时";
        minute = minute == 0 ? "" : minute+"分";
        second = second == 0 ? "" : second+"秒";
       // console.log(year,month,day,hour,minute,second);
    　　return year+month+day+hour+minute+second;
      },
      calcAngle(start, end, map) {
        // debugger
        var p_start = map.lngLatToContainer(start),
        p_end = map.lngLatToContainer(end);
        var diff_x = p_end.x - p_start.x,
        diff_y = p_end.y - p_start.y;
        return 360*Math.atan2(diff_y, diff_x)/(2*Math.PI);
      },
      getDrivingStatistics(){
        var _this = this;
        this.drivingStatistics = {};
        getDrivingStatisticsData({
          'vehicleId': this.vehicleId,
        }).then(res => {
          this.drivingStatistics = res.vehicleBaseDetail[0];
          this.drivingStatistics.cumulatedMiles = this.drivingStatistics.cumulatedMiles.toFixed(1);
          this.drivingStatistics.avgSpeed = this.drivingStatistics.avgSpeed.toFixed(1);
        });
      },
      getBaseData(){
        var _this = this;
        this.drivingStatistics = {};
        getVehicleBaseData({
          'vehicleId': this.vehicleId,
        }).then(res => {
          this.singleVehicle = res.vehicleBaseDetail[0];
        });
      },
      //重绘形成初始化
      initDistanceMap(){
        this.prevLastPointPath = [];//上次请求的终点，
        this.carStartPoint = this.$parent.defalutCenterPoint;
        this.routeId = "";
        this.pointPath = [];
        // this.direction = 0;
        // this.times = 1;
        this.scale = 10;
        this.all = 1;

        // this.mapTimestamp = 0;
        this.wholePath = [];
        this.count = 0;
        this.flag = true;

        this.distanceMap.remove(this.markers.polyline);
        this.markers.polyline = [];
        this.distanceMap.remove(this.markers.markerStart);
        this.markers.markerStart = null;
        this.distanceMap.remove(this.markers.markerEnd);
        this.markers.markerEnd = null;

        this.webSocketData.scale = this.scale;
        this.webSocketData.all = this.all;

        this.webSocket.send(JSON.stringify(this.webSocketData));
      },
      //行程概览--绘制起点
      distanceMapStart(){
        let _this = this;
        if(!this.markers.markerStart) {
          this.markers.markerStart = new AMap.Marker({
            position: _this.carStartPoint,   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
            icon:'static/images/car/car-2.png',
            offset: new AMap.Pixel(-8, -20)
          });
          // 将创建的点标记添加到已有的地图实例：
          this.distanceMap.add(_this.markers.markerStart);
        }else{
          this.markers.markerStart.setPosition(_this.carStartPoint);
        }
        // this.distanceMap.setFitView(_this.markers.markerStart);
      },
      //行程概览--绘制路径
      distanceMapLine(){
        let _this = this,
            polyline = new AMap.Polyline({
              map: _this.distanceMap,
              path: _this.pointPath,
              strokeColor: "#03812e",
              strokeWeight: 2,
              // 折线样式还支持 'dashed'
              strokeStyle: "solid",
              /* // strokeStyle是dashed时有效
               strokeDasharray: [10, 5],*/
              lineJoin: 'round',
              lineCap: 'round',
              zIndex: 50
            });
        this.markers.polyline.push(polyline);
        //绘制终点
        _this.distanceMapEnd();
        // 缩放地图到合适的视野级别
        this.distanceMap.setFitView();
        //获取缩放级别
        this.zoom = this.distanceMap.getZoom();

        if(this.handleZoom != this.zoom) {
          this.handleZoom = this.zoom
        }
      },
      //行程概览--绘制终点
      distanceMapEnd(){
        let _this = this;
        if(!this.markers.markerEnd) {
          var _pointPath = _this.pointPath;
          this.markers.markerEnd = new AMap.Marker({
            position: _pointPath[_pointPath.length-1],
            icon:'static/images/car/car-1.png',
            offset: new AMap.Pixel(-20, -10),
            autoRotation: true,
            // angle: _this.direction-90
            angle: _this.wholePath[_this.count].angle-90
          });
          // 将创建的点标记添加到已有的地图实例：
          this.distanceMap.add(_this.markers.markerEnd);
        }else{
          this.markers.markerEnd.setPosition(_this.pointPath[_this.pointPath.length-1]);
          this.markers.markerEnd.setAngle(_this.wholePath[_this.count].angle-90);
        }
        /*console.log("缩放级别:"+this.distanceMap.getZoom())*/
      },
      setScale(){
        switch(this.handleZoom) {
          case 11:
            this.scale = 20;
            break;
          case 12:
            this.scale = 18;
            break;
          case 13:
            this.scale = 16;
            break;
          case 14:
            this.scale = 12;
            break;
          case 15:
            this.scale = 8;
            break;
          case 16:
            this.scale = 5;
            break;
          default:
            this.scale = 20;
        }
      },
      initWebSocket(){
        // debugger
        let _this=this;
        if ('WebSocket' in window) {
          _this.webSocket = new WebSocket(window.cfg.socketUrl);  //获得WebSocket对象
        }
        _this.webSocket.onmessage = _this.onmessage;
        _this.webSocket.onclose = _this.onclose;
        _this.webSocket.onopen = _this.onopen;
        _this.webSocket.onerror = _this.onerror;
      },
      onmessage(message){
        var _this=this;
        var json = JSON.parse(message.data);
        var pointList = [];
        if(this.all == 1){
          if(json.data.pointList && json.data.pointList.length > 0){
            pointList = json.data.pointList;
          }else{
            pointList = [{
              gNSS_LONG: json.data.lon,
              gNSS_LAT: json.data.lat,
              gNSS_HEAD: json.data.head
            }];
          }
        }else{
          pointList = [{
            gNSS_LONG: json.data.lon,
            gNSS_LAT: json.data.lat,
            gNSS_HEAD: json.data.head
          }];
        }
        // pointList.forEach((item) => {
        //   console.log(item.gNSS_LONG, item.gNSS_LAT);
        // });
        this.routeInfo = {
          routeStartTime: json.data.routeStartTime, //行驶开始时间
          durationTime: json.data.durationTime, //累计行驶时间
          mileage: json.data.mileage, //累计行驶里程
          avgSpd: json.data.avgSpd //平均测速
        };
        if(pointList && pointList.length > 0) {
          // this.direction = pointList[pointList.length-1].gNSS_HEAD;
          if(this.routeId != ""){
            if(this.routeId != json.data.routeId) {
              console.log("重新开启行程");
              console.log(this.routeId);
              console.log(json.data.routeId);
              this.all = 1;
              return false;
            }
          }else{
            console.log("第一次开启行程");
            this.routeId = json.data.routeId;
            // console.log(this.routeId);
            AMap.convertFrom(new AMap.LngLat(pointList[0].gNSS_LONG, pointList[0].gNSS_LAT), 'gps', function (status, result){
                if (result.info === 'ok') {
                  let firstPoint = result.locations[0];
                  // console.log(firstPoint);
                  // 绘制起点
                  _this.carStartPoint = firstPoint;
                  _this.distanceMapStart();
                }
            });
          }

          if(this.prevLastPointPath.length !=0 && pointList.length==1 && this.prevLastPointPath[0] == pointList[0].gNSS_LONG && this.prevLastPointPath[1] == pointList[0].gNSS_LAT){
            this.changeLngLat();
            return false;
          }

          if(pointList.length!=0){
            this.prevLastPointPath = [pointList[pointList.length-1].gNSS_LONG, pointList[pointList.length-1].gNSS_LAT];
          }
          // if(pointList.length==1){
          //   this.prevLastPointPath = [pointList[0].gNSS_LONG, pointList[0].gNSS_LAT];
          //   // console.log(pointList[0].gNSS_LONG, pointList[0].gNSS_LAT);
          // }else{
          //   this.prevLastPointPath = [pointList[pointList.length-1].gNSS_LONG, pointList[pointList.length-1].gNSS_LAT];
          //   // console.log(pointList);
          // }

          var handlePointList = [];
          // console.log("--------------------------------------------");
          // console.log(pointList);
          pointList.forEach((item, index) => {
            if(item.gNSS_LONG && item.gNSS_LAT){
              let lnglatArr = new AMap.LngLat(item.gNSS_LONG, item.gNSS_LAT);
              handlePointList.push(lnglatArr);
            }
          });

          let _dataLength = handlePointList.length,
              _limitLength = 200;
          if(_dataLength > _limitLength) {
            let _newLength = Math.ceil(_dataLength/_limitLength);
            // console.log(_newLength);
            for(let i = 0; i < _newLength; i++){
              this.wholePath.push({
                angle: (i+1)*_limitLength < _dataLength ? pointList[(i+1)*_limitLength-1].gNSS_HEAD : pointList[_dataLength-1].gNSS_HEAD,
                routeId: json.data.routeId,
                pathList: handlePointList.slice(i*_limitLength, (i+1)*_limitLength)
              });
            }
            // console.log(this.wholePath);
          }else{
            let _newWholeJson = {
              angle: pointList[_dataLength-1].gNSS_HEAD >= 0 ? pointList[_dataLength-1].gNSS_HEAD : 90,
              routeId: json.data.routeId,
              pathList: handlePointList
            }
            // console.log("航向角："+_newWholeJson.angle);
            // console.log("坐标轴："+handlePointList.toString());

            this.wholePath.push(_newWholeJson);
          }
            // console.log("wholePath------------");
            // console.log(this.wholePath.length);
            // console.log(this.wholePath);
          this.changeLngLat();


          this.all = 0;
        }
      },
      changeLngLat(){
        var _this = this;
        if(this.flag && _this.count < this.wholePath.length){
            this.flag = false;
            // console.log(this.wholePath);
            if(_this.count > 0) {
              _this.wholePath[_this.count].pathList.unshift(_this.wholePath[_this.count-1].pathList[_this.wholePath[_this.count-1].pathList.length-1]);
            }
            AMap.convertFrom(_this.wholePath[_this.count].pathList, 'gps', function (status, result) {
              if (result.info === 'ok') {
                // debugger
                _this.pointPath = result.locations;

                //绘制线的轨迹
                _this.distanceMapLine();

                _this.count++;
                _this.flag = true;
                _this.changeLngLat();
              }
            });
        }
      },
      onclose(data){
        console.log("结束连接");
      },
      onopen(data){
        console.log("建立连接,,,,,,");
        //行程
        this.webSocketData.vehicleId = this.vehicleId;
        this.webSocketData.scale = this.scale;
        this.webSocketData.all = this.all;
        this.sendMsg(JSON.stringify(this.webSocketData));
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
      /**
       * 传入最小最大像素坐标
       * **/
      computedGeoRange(min,mx,zoom){
        //通过像素坐标算出地理坐标
        var minPixel = new AMap.Pixel(min[0],min[1]);
        var minLnglat = map.pixelToLngLat(minPixel,zoom);
        var maxPixel = new AMap.Pixel(max[0],max[1]);
        var maxLnglat = map.pixelToLngLat(maxPixel,zoom);
        var bounds = new AMap.Bounds(minLnglat, maxLnglat);
        return bounds;
      }
    },
    mounted () {
      var _this = this;
      this.distanceMap = new AMap.Map("distanceContainer", {
        center: _this.carStartPoint,
        zoom: _this.zoom,
        zooms: [11, 16],
        mapStyle:'amap://styles/7b007636f01d8a19e9cc2841a85dc083'
      });
      // var roadNetLayer =  new AMap.TileLayer.RoadNet();
      // this.distanceMap.add(roadNetLayer);
      this.initWebSocket();

      this.getBaseData();
      this.getDrivingStatistics();
    }
  }
</script>
<style>
  .line-style{
    padding-left: 5%;
    margin-top: 2%;
  }
  .line{
    float: left;
  }
  .line-1{
    width: 10%;
  }
  .line-2{
    width: 85%;
  }
  .line1{
    border-top: 2px solid #ef920e;
    display: block;
  }
  .line2{
    border-top: 1px solid #ef920e;
    display: block;
    margin-top: 0.5px;
  }
  .monitor-title{
    font-size: 18px;
    color: #fff;
    padding-left: 5%;
    margin-top: 55px;
  }
</style>
<style scoped lang="scss">

  .car-detail-title{
    position: relative;
    height: 50px;
    background: #423e4e;
    letter-spacing: 1px;
  }
  .car-detail{
    font-size: 16px;
    color: #fff;
    line-height: 50px;
    display: block;
    padding-left: 5%;
  }
  .car-level{
    font-size: 16px;
    color: #38b87a;
    position: absolute;
    top: 0;
    right: 0;
    line-height: 50px;
    width: 50px;
    background: #353142;
    text-align: center;
  }
  .car-img{
    width: 80%;
    height:auto;

  }
  .monitor-car{
    background:#24212c;
    text-align: center;
    padding-top:34px;
     padding-bottom:34px;
  }

/*  @media screen and (max-width: 1280px){
    .monitor-left{
      width: 200px;
      background: #24212c;
      min-width: 200px;
      height:100%;
    }

  }
  @media (max-width: 1920px)  and (min-width: 1281px){
    .monitor-left{
      width: 300px;
      background: #24212c;
      min-width: 200px;
      height:100%;
    }
  }*/
  .monitor-left{
    width: 100%;
   /* background: #24212c;*/
    min-width: 200px;
    height:100%;
  }

  .statistic-style{
    float: left;
    width: 50%;
   /* padding-left:5%;*/
    padding-top:10%;
  }
  .statistic-style li:first-of-type{
    height: 50px;
    margin-bottom: 10px;
  }
  .statistic-style li{
    text-align: center;
  }
  .statistic-img{
    width: 40px;
    height:auto;
  }
  .text-font{
    font-family: carFont;
    color: #33b175;
    font-size: 14px;
  }
  .text-style{
    color: #b8b5ae;
    font-size: 12px;
  }

  .distance-overview{
    margin-left:5%;
    margin-right:5%;
    height: 200px;
    border:1px solid #ef920e;
    margin-top: 35px;

  }

  .single-bottom{
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    height: 50px;
    background: #24212c;
  }

  .distance-detail{
    vertical-align: top;
    display: inline-block;
    line-height: 50px;
    color: #ddd9d1;
    text-align: left;
    padding: 0 20px 0 20px;
    width: 160px;
    &:first-child {
      width: 230px;
    }
  }
</style>
