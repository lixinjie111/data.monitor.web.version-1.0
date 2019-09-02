<template>
  <div class="monitor-left">

    <div class="c-scroll-wrap">
      <div class="c-scroll-inner">
        <p class="car-detail-title">
          <span class="car-detail">车牌号：{{singleVehicle.platNo}}</span>
          <span class="car-level">L{{singleVehicle.autoLevel}}</span>
        </p>
        <div class="monitor-car">
          <img class="car-img" :src="singleVehicle.vehicleLogo" ></img>
        </div>
        <p class="c-title monitor-title">行车统计</p>
        <div class="clearfix">
           <ul class="statistic-style">
             <li>
               <img src="@/assets/images/car/car-1.png" class="statistic-img"/>
             </li>
             <li>
               <span class="text-font">{{filterData.cumulatedMiles || '--'}}</span>
               <span class="text-style">km</span>
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
               <span class="text-font">{{filterData.cumulatedTime || '--'}}</span>
               <span class="text-style">h</span>
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
               <span class="text-font">{{filterData.avgSpeed || '--'}}</span>
               <span class="text-style">km/h</span>
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
               <span class="text-font">{{filterData.tripNums || '--'}}</span>
             </li>
             <li>
               <span class="text-style">行程数量</span>
             </li>
           </ul>

         </div>

        <p class="c-title monitor-title">行程概览</p>
        <div class="distance-overview" id="distanceContainer"></div>
      </div>
    </div>

    <div class="single-bottom">

        <span class="distance-detail" style="width: 230px;">行驶开始时间：{{routeInfo.routeStartTime ? $dateUtil.formatTime(routeInfo.routeStartTime) : "--"}}</span>
        <span class="distance-detail" style="width: 230px;">累计行驶时长：{{showRouteInfoDurationTime ? getRunTime(showRouteInfoDurationTime) : "--"}}</span>
        <span class="distance-detail" style="width: 200px;">累计行驶里程：{{routeInfo.mileage ? routeInfo.mileage : "--"}}km</span>
        <span class="distance-detail" style="width: 200px;">平均车速：{{routeInfo.avgSpd ? routeInfo.avgSpd : "--"}}km/h</span>

    </div>

  </div>
</template>
<script>
  import AMap from 'AMap';
  import { getDrivingStatisticsData, getVehicleBaseData, getRouteDataByVehId } from '@/api/carMonitor'
  import ConvertCoord from '@/assets/js/utils/coordConvert.js'
  export default {
    name: "LeftCar", // 实时数据
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

        distanceMap: null, //创建的地图对象
        prevLastPointPath:[],//上次请求的终点，
        carStartPoint:window.mapOption.defaultCenterPoint,
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
        },
        routeInfo: {},
        timer: null,
        showRouteInfoDurationTime: 0,

        countTimer: null,
        countTimeLimit: 1000*60*5,
        countTime: 0
      }
    },
    computed: {
      filterData() {
          let _filterData = {};
          for(let attr in this.drivingStatistics) {
            if(attr=='tripNums'){
              _filterData[attr] = parseFloat(this.drivingStatistics[attr]).toLocaleString() || '--';
            }else{
              _filterData[attr] = parseFloat(this.drivingStatistics[attr]).toFixed(1).toLocaleString() || '--';
            }
          }
          return _filterData;
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
          // this.webSocketData.scale = this.scale;
          // this.webSocketData.all = newVal;
          // this.webSocket.send(JSON.stringify(this.webSocketData));
          // console.log("all=0, chang，重新发起服务");
        }
      },
      'routeInfo.durationTime'(newVal, oldVal) {
        if(!oldVal) {
          this.showRouteInfoDurationTime = newVal;
          this.timer = setInterval(() => {
            this.showRouteInfoDurationTime += 1000;
            // console.log(this.showRouteInfoDurationTime);
          }, 1000);
        }
      },
      countTime(newVal, oldVal) {
        if(newVal >= this.countTimeLimit) {
          this.$router.replace({
              path: '/refresh',
              params: {
                  t: Date.now()
              }
          })
        }
      }
    },
    mounted () {
      this.initMap();
      // var roadNetLayer =  new AMap.TileLayer.RoadNet();
      // this.distanceMap.add(roadNetLayer);
      this.getRouteDataByVehId();
      // this.initWebSocket();

      this.getBaseData();
      this.getDrivingStatistics();

      setTimeout(() => {
        this.isStopHandle = true;
      }, 2000);
    },
    methods: {
      initMap() {    
        this.distanceMap = new AMap.Map('distanceContainer', window.defaultMapOption);
        // console.log(this.distanceMap.getZoom());

      
      },
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
        second = second == 0 ? "0秒" : second+"秒";
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
          // this.drivingStatistics.cumulatedMiles = this.drivingStatistics.cumulatedMiles.toFixed(1);
          // this.drivingStatistics.avgSpeed = this.drivingStatistics.avgSpeed.toFixed(1);
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
        this.carStartPoint = window.mapOption.defaultCenterPoint;
        this.routeId = "";
        this.pointPath = [];
        // this.direction = 0;
        // this.times = 1;
        this.scale = 10;
        this.all = 1;
        // this.zoom = 11;

        // this.mapTimestamp = 0;
        this.wholePath = [];
        this.count = 0;
        this.flag = true;

        this.distanceMap.remove(this.markers.polyline);
        this.markers.polyline = [];
        if(this.markers.markerStart) {
          this.distanceMap.remove(this.markers.markerStart);
          this.markers.markerStart = null;
        }
        if(this.markers.markerEnd) {
          this.distanceMap.remove(this.markers.markerEnd);
          this.markers.markerEnd = null;
        }

        this.webSocketData.scale = this.scale;
        this.webSocketData.all = this.all;

        this.routeInfo = {
          routeStartTime: "", //行驶开始时间
          durationTime: "", //累计行驶时间
          mileage: "", //累计行驶里程
          avgSpd: "" //平均测速
        };
        clearInterval(this.timer);
        this.timer = null;
        this.showRouteInfoDurationTime = 0;

        clearInterval(this.countTimer);
        this.countTimer = null;
        this.countTime = 0;
      
        // this.distanceMap.setCenter(window.mapOption.defaultCenterPoint);
        // this.distanceMap.setZoom(this.zoom);

        // this.webSocket.send(JSON.stringify(this.webSocketData));
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
        this.distanceMap.setFitView(_this.markers.markerStart);
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
            angle: _this.wholePath[_this.count].angle ? _this.wholePath[_this.count].angle-90 : 0
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
      getRouteDataByVehId() {
        getRouteDataByVehId({
          'scale': this.scale,
          'vehicleId': this.vehicleId,
        }).then(res => {
          let _result = res.data.pointList;
          if(_result && _result.length > 0) {
            this.onmessage(res);
          }
          this.initWebSocket();
        }).catch(error => {
          // console.log("hahahah");
          // this.initWebSocket();
        });
      },
      initWebSocket(){
        // debugger
        let _this=this;
        if ('WebSocket' in window) {
          _this.webSocket = new WebSocket(window.config.socketUrl);  //获得WebSocket对象
        }
        _this.webSocket.onmessage = _this.onmessage;
        _this.webSocket.onclose = _this.onclose;
        _this.webSocket.onopen = _this.onopen;
        _this.webSocket.onerror = _this.onerror;
      },
      onmessage(message){
        // console.log("行程概览 route *********************************************");
        clearInterval(this.countTimer);
        this.countTime = 0;
        this.countTimer = setInterval(() => {
          this.countTime += 1000;
        }, 1000);
        var _this=this;
        var json  = {};
        if(typeof message.data == "string") {
          json = JSON.parse(message.data);
        }else {
          json = message;
        }
        var pointList = [];
        if(this.all == 1){
          if(json.data.pointList && json.data.pointList.length > 0){
            pointList = json.data.pointList;
          }else{
            pointList = [{
              gnss_LONG: json.data.lon,
              gnss_LAT: json.data.lat,
              gnss_HEAD: json.data.head
            }];
          }
        }else{
          pointList = [{
            gnss_LONG: json.data.lon,
            gnss_LAT: json.data.lat,
            gnss_HEAD: json.data.head
          }];
        }
        // let _pointer = [json.data.lon, json.data.lat];
        // console.log("行程概览 route *********************************************");
        // console.log(_pointer);
        this.routeInfo = {
          routeStartTime: json.data.routeStartTime, //行驶开始时间
          durationTime: json.data.durationTime, //累计行驶时间
          mileage: parseFloat(json.data.mileage).toFixed(1).toLocaleString(), //累计行驶里程
          avgSpd: parseFloat(json.data.avgSpd).toFixed(1).toLocaleString() //平均测速
        };
        // console.log(this.getRunTime(json.data.durationTime));
        if(pointList && pointList.length > 0) {
          if(this.routeId != ""){
            if(this.routeId != json.data.routeId) {
              console.log("重新开启行程");
              this.all = 1;
              return false;
            }
          }else{
            console.log("第一次开启行程");
            this.routeId = json.data.routeId;
            // console.log(this.routeId);
            _this.carStartPoint = ConvertCoord.wgs84togcj02(pointList[0].gnss_LONG, pointList[0].gnss_LAT);
            _this.distanceMapStart();
          }

          if(this.prevLastPointPath.length !=0 && pointList.length==1 && this.prevLastPointPath[0] == pointList[0].gnss_LONG && this.prevLastPointPath[1] == pointList[0].gnss_LAT){
            this.changeLngLat();
            return false;
          }

          if(pointList.length!=0){
            this.prevLastPointPath = [pointList[pointList.length-1].gnss_LONG, pointList[pointList.length-1].gnss_LAT];
          }

          var handlePointList = [];
          pointList.forEach((item, index) => {
            if(item.gnss_LONG && item.gnss_LAT){
              // let lnglatArr = new AMap.LngLat(item.gnss_LONG, item.gnss_LAT);
              let lnglatArr = [item.gnss_LONG, item.gnss_LAT];
              handlePointList.push(lnglatArr);
            }
          });
          // console.log(handlePointList);
          let _dataLength = handlePointList.length;
          this.wholePath.push( {
            angle: pointList[_dataLength-1].gnss_HEAD >= 0 ? pointList[_dataLength-1].gnss_HEAD : 90,
            routeId: json.data.routeId,
            pathList: handlePointList
          });
          this.changeLngLat();

          this.all = 0;
        }
      },
      changeLngLat(){
        var _this = this;
        if(this.flag && _this.count < this.wholePath.length){
          // console.log("----------------------------------");
            this.flag = false;
            if(_this.count > 0) {
              _this.wholePath[_this.count].pathList.unshift(_this.wholePath[_this.count-1].pathList[_this.wholePath[_this.count-1].pathList.length-1]);
            }
          // console.log(_this.wholePath[_this.count].pathList);
            let _pathList = _this.wholePath[_this.count].pathList;
            _this.pointPath = [];
            for( let i = 0; i < _pathList.length; i++){
              let _position = ConvertCoord.wgs84togcj02(_pathList[i][0], _pathList[i][1]);
              _this.pointPath[i] = _position;
              // console.log(_position);
              if(i == _pathList.length-1) {
                  //绘制线的轨迹
                  _this.distanceMapLine();
                  _this.count++;
                  _this.flag = true;
              }
            };
        }
      },
      onclose(data){
        console.log("结束连接");
      },
      onopen(data){
        //行程
        this.webSocketData.vehicleId = this.vehicleId;
        this.webSocketData.scale = this.scale;
        this.webSocketData.all = this.all;
        this.sendMsg(JSON.stringify(this.webSocketData));
      },
      sendMsg(msg) {
        let _this=this;
        if(window.WebSocket){
          if(_this.webSocket.readyState == WebSocket.OPEN) { //如果WebSocket是打开状态
            _this.webSocket.send(msg); //send()发送消息
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
    destroyed(){
      //销毁Socket
      this.webSocket.close();
    }
  }
</script>
<style>
  .monitor-title{
    margin-left: 20px;
    margin-right: 20px;
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
    font-family: MicrosoftYaHei;
    letter-spacing: 2px;
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
    // width: 80%;
    // height:auto;
    width: 260px;
    height: auto;
    margin: 0 auto;

  }
  .monitor-car{
    background:#24212c;
    text-align: center;
    /*padding-top:16px;
     padding-bottom:16px;*/
    height:160px;
    line-height: 160px;
  }

  .monitor-left{
    width: 100%;
    height: calc(100% - 50px);
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
    letter-spacing: 2px;
  }
  .text-style{
    color: #b8b5ae;
    font-size: 12px;
  }

  .distance-overview{
    margin-left: 20px;
    margin-right: 20px;
    height: 200px;
    border:1px solid #ef920e;
    margin-top: 35px;

  }

  .single-bottom{
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 2;
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
  }
</style>
