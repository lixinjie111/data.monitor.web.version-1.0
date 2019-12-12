<template>
  <div class="monitor-traffic">
    <div class="travel-detail" v-show="!isStop">
      <div class="detail1">
        <span>{{trackRealData.longitude? trackRealData.longitude.toFixed(8):'--'}}</span>
        <span class="detail2">E</span>
      </div>
      <div class="detail1">
        <span>{{trackRealData.latitude ?trackRealData.latitude.toFixed(8):'--'}}</span>
        <span class="detail2">N</span>
      </div>
      <div class="detail1">
        <span>{{trackRealData.speed ? parseFloat(trackRealData.speed).toFixed(1).toString() : '--'}}</span>
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
      <el-table
          :data="cloudList"
          border>
          <el-table-column label="序号" type="index" width="100"></el-table-column>
          <el-table-column label="预警时间" min-width="25%">
            <template slot-scope="scope">{{scope.row.timestamp | dateFormat}}</template>
          </el-table-column>
          <el-table-column label="预警类型" prop="warnMsg" min-width="25%"></el-table-column>
          <el-table-column label="预警级别" min-width="25%">
            <template slot-scope="scope">
              <p class="c-alert-level">{{scope.row.warnLevel}}</p>
            </template>
          </el-table-column>
          <el-table-column label="预警位置" min-width="25%">
            <template slot-scope="scope">
              <p>{{scope.row.longitude}},{{scope.row.latitude}}</p>
            </template>
          </el-table-column>
      </el-table>
    </single-dialog>
    <single-dialog :dialogVisible="vehicleDialog" :title="'告警信息'" @closeDialog="vehicleDialog=false">
      <el-table
          :data="vehicleList"
          border>
          <el-table-column label="序号" type="index" width="100"></el-table-column>
          <el-table-column label="告警时间" min-width="25%">
            <template slot-scope="scope">{{scope.row.warningTime | dateFormat}}</template>
          </el-table-column>
          <el-table-column label="告警名称" prop="warningName" min-width="25%"></el-table-column>
          <el-table-column label="告警级别" min-width="25%">
            <template slot-scope="scope">
              <p class="c-alert-level">{{scope.row.warningLevel}}</p>
            </template>
          </el-table-column>
          <el-table-column label="告警车辆" prop="plateNo" min-width="25%"></el-table-column>
      </el-table>
    </single-dialog>
  </div>
</template>
<script>
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
      
        hostWebsocket:null,
        sideWebsocket:null,
        deviceWebsocket:null,
        lightWebsocket:null,
        warningWebsocket:null,
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
        cloudIdList:[],
        vehicleIdList:[],
        event:[],
        count: 0,
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
        lastPoint:[],
        lightPrevData: [],
        devicePrevData: [],
        sidePrevData:[],
        zoomStyleMapping:{
          10:0,
          11:0,
          12:0,
          13:0,
          14:0,
          15:0,
          16:0,
          17:0,
          18:0,
          19:0,
          20:0
        },
        timeOut:1000*60*5,
        wsFlag:true,
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
      },
      vehWsData:{
        type:Object,
        default() {
          return {};
        }
      }
    },
    computed:{
      routeRealData(){
        if(this.vehWsData){
           return this.vehWsData.result.route;
        }else{
           return "";
        }
      },
      trackRealData(){
        if(this.vehWsData){
          return this.vehWsData.result.track[0];
        }else{
           return "";
        }    
      },
      nowYear(){
        if(this.trackRealData.gpsTime==''){
          return '--';
        }else{
          return this.$dateUtil.formatTime(this.trackRealData.gpsTime).split(" ")[0];
        }
      },
      nowTime(){
        if(this.trackRealData.gpsTime==''){
          return '--';
        }else{
          return this.$dateUtil.formatTime(this.trackRealData.gpsTime).split(" ")[1];
        }
      },
    },
    filters: {
      dateFormat: function (value) {
        let ms = value%1000;
        let time = DateFormat.formatTime(value);
        return time+":"+ms;
      }
    },
    watch:{
      deep: true,
      isStop(newVal,oldVal){
        if(newVal){
          this.sideWebsocket.close();
        }else{
          console.log("第一次是否走此方法")
          this.initSideWebSocket();
        }
      },
      // 自车WS
      vehWsData(newVal,oldVal){
        this.onmessage(newVal);
      },
      realData(newVal,oldVal){
        if(this.wsFlag){
          this.$nextTick(()=>{
            this.initSideWebSocket();
            this.wsFlag = false;
          })
        }
      },
      
    },
    components:{
      SingleDialog
    },
    mounted () {
    
      let _option = Object.assign(
        {},
        window.defaultMapOption,
        {
          center: window.mapOption.singlePoint,
          zoom: 18
        }
      );
      this.distanceMap = new AMap.Map('realTraffic', _option);
      setTimeout(()=>{
            this.distanceMap.setMapStyle(window.defaultMapOption.mapStyle);
      },0);

      // this.initWebSocket();
     

      // 杆
      this.initDeviceWebSocket();
      // 事件
      this.initWarningWebSocket();
      // 红绿灯
      this.initLightWebSocket();
      //云端和车端此次行程统计
      this.getV2xInformation();
      this.getAlarmInformation();
    },
    methods: {
      getAngle(map,start, end) {
        let p_start = map.lngLatToContainer(start),
          p_end = map.lngLatToContainer(end);
        let diff_x = p_end.x - p_start.x,
          diff_y = p_end.y - p_start.y;
        return 360*Math.atan2(diff_y, diff_x)/(2*Math.PI);
      },
      getMapAngle(map,start){
        let map_center = map.lngLatToContainer([116.478935,39.997761]);
        let p_start = map.lngLatToContainer(start);
        let diff_x = map_center.x - p_start.x,
          diff_y = map_center.y - p_start.y;
        return 360*Math.atan2(diff_y, diff_x)/(2*Math.PI);
      },
      // initWebSocket(){
      //   let _this=this;
      //   if ('WebSocket' in window) {
      //     // _this.hostWebsocket = new WebSocket(window.config.socketUrl);  //获得WebSocket对象
      //     _this.hostWebsocket = new WebSocket(window.config.socketTestUrl);  //获得WebSocket对象
      //   }
      //   _this.hostWebsocket.onmessage = _this.onmessage;
      //   _this.hostWebsocket.onclose = _this.onclose;
      //   _this.hostWebsocket.onopen = _this.onopen;
      //   _this.hostWebsocket.onerror = _this.onerror;
      // },
      onmessage(mesasge){
        if(!mesasge.result.track || !mesasge.result.track[0]){
          return;
        }
        let _this=this;
        let json = mesasge;

        let data = mesasge.result.track[0];

          let platNo;
          let source="";

          if(_this.isInit){
            platNo=data.plateNo;
            data.source.forEach(item=>{
              source+=item+",";
            })
            source = source.substring(0,source.lastIndexOf(","));
          }
             let newPosition = ConvertCoord.wgs84togcj02(data.longitude, data.latitude);
              if(_this.isInit){
             
                _this.marker = new AMap.ElasticMarker({
                  position:newPosition,
                  zooms:[6,20],
                  styles:[{
                    icon:{
                      img:'static/images/car/car-6.png',
                      size:[17,40],
                      ancher:[8,20],
                      fitZoom:18,//最合适的级别，在此级别下显示为原始大小
                      scaleFactor:1.1,//地图放大一级的缩放比例系数
                      maxScale:1,//最大放大比例 达到此处图片不在变化
                      minScale:0.2//最小放大比例
                    }
                  }],
                  zoomStyleMapping:_this.zoomStyleMapping
                })

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
           
              //设置中心点
              _this.distanceMap.setCenter(newPosition);
              //设置旋转角度
              _this.headingAngle = data.heading;
              _this.marker.setAngle(_this.headingAngle);
              _this.marker.setPosition(newPosition);
              _this.platNoMarker.setPosition(newPosition);

      },
      // onclose(data){
      //   console.log("结束连接");
      // },
      // onopen(data){
      //   //自车
      //   let hostVehicle ={
      //       "action": "vehicle",
      //       "body": {
      //           "vehicleId": this.vehicleId
      //       },
      //       "type": 1
      //   }
      //   // let hostVehicle = {
      //   //   "action": "hostVehicle",
      //   //   "vehicleId": this.vehicleId
      //   // }
      //   let hostVehicleMsg = JSON.stringify(hostVehicle);
      //   this.sendMsg(hostVehicleMsg);
      // },
      // sendMsg(msg) {
      //   let _this=this;
      //   if(window.WebSocket){
      //     if(_this.hostWebsocket.readyState == WebSocket.OPEN) { //如果WebSocket是打开状态
      //       _this.hostWebsocket.send(msg); //send()发送消息
      //     }
      //   }else{
      //     return;
      //   }
      // },
      initSideWebSocket(){
        let _this=this;
        if ('WebSocket' in window) {
          // _this.sideWebsocket = new WebSocket(window.config.socketUrl);  //获得WebSocket对象
          _this.sideWebsocket = new WebSocket(window.config.socketTestUrl);  //获得WebSocket对象
        }
        _this.sideWebsocket.onmessage = _this.onSideMessage;
        _this.sideWebsocket.onclose = _this.onSideClose;
        _this.sideWebsocket.onopen = _this.onSideOpen;
        _this.sideWebsocket.onerror = _this.onSideError;
      },
      onSideMessage(message){

        let _this=this;

        let _json = JSON.parse(message.data);
        let deviceData = _json.result.data;
        if (deviceData) {
              let _filterData = {};
              let maxGpsTime = 0;
              for (const k in deviceData) {
                if( k == _this.realData.vehicleId){
                  return;
                }
                deviceData[k].forEach((item, index) => {
                    _filterData[item.vehicleId] = {
                        vehicleId:item.vehicleId,
                        position:ConvertCoord.wgs84togcj02(item.longitude, item.latitude),
                        heading:item.heading,
                        speed:item.speed,
                        longitude:item.longitude,
                        latitude: item.latitude,
                        icon:'static/images/car/car-7.png',
                        size:[17,40],
                        ancher:[8,20],
                        zIndex:50
                    }; 
                });

                deviceData[k].map(item=>{
                    if(item.gpsTime > maxGpsTime){
                      maxGpsTime = item.gpsTime;
                      _filterData = {
                          vehicleId:item.vehicleId,
                          position:ConvertCoord.wgs84togcj02(item.longitude, item.latitude),
                          heading:item.heading,
                          speed:item.speed,
                          longitude:item.longitude,
                          latitude: item.latitude,
                          icon:'static/images/car/car-7.png',
                          size:[17,40],
                          ancher:[8,20],
                          zIndex:50,
                          timer:null
                      }; 
                    }
                })  
               
                for (let id in _this.sidePrevData) {
                    if(_filterData.vehicleId == id) {   //表示有该点，做setPosition
                        clearTimeout(_this.sidePrevData[_filterData.vehicleId].timer)
                        _filterData.marker = _this.sidePrevData[_filterData.vehicleId].marker;
                        let _currentCar = _filterData;
                        _filterData.marker.setAngle(_currentCar.heading);
                        _filterData.marker.setPosition(_currentCar.position);
                    } 
                }
               
                if(!_this.sidePrevData[_filterData.vehicleId]) {   //表示新增该点，做add
                    _this.addMarker(_filterData);
                }    

                if(_this.setFitViewFlag) {
                    setTimeout(_ => {
                        _this.distanceMap.setFitView();
                        _this.setFitViewFlag = false;
                    }, 500);  
                }

                _this.sidePrevData[_filterData.vehicleId] = _filterData;
                _this.sidePrevData[_filterData.vehicleId].timer = setTimeout(() => {
                  _this.distanceMap.remove(_this.sidePrevData[_filterData.vehicleId].marker);
                  delete _this.sidePrevData[_filterData.vehicleId];
                }, this.timeOut);
              }    
        } 
     
      },
      onSideClose(data){
        console.log("结束连接");
      },
      onSideOpen(data){
        //旁车
        let sideVehicle ={
            "action": "vehicle",
            "body": {
                "vehicleId": this.vehicleId
            },
            "type": 2
        }
        // let sideVehicle = {
        //   "action": "sideVehicle",
        //   "vehicleId": this.vehicleId
        // }
        let sideVehicleMsg = JSON.stringify(sideVehicle);
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
          _this.deviceWebsocket = new WebSocket(window.config.socketUrl);  //获得WebSocket对象
        }
        _this.deviceWebsocket.onmessage = _this.onDeviceMessage;
        _this.deviceWebsocket.onclose = _this.onDeviceClose;
        _this.deviceWebsocket.onopen = _this.onDeviceOpen;
      },
      onDeviceMessage(mesasge){
          let _this=this;
          let json = JSON.parse(mesasge.data);
          let deviceData = json.result.data;
          if (deviceData.length > 0) {
                let _filterData = {};
                deviceData.forEach((item, index) => {
                    _filterData[item.rsPtId] = {
                        position:ConvertCoord.wgs84togcj02(item.ptLon, item.ptLat),
                        marker: null,
                        icon:'static/images/car/car-3.png',
                        size:[29,50],
                        ancher:[15,50],
                        zIndex:49
                    };
                 
                });
                for (let id in _this.devicePrevData) {
                    if(_filterData[id]) {   //表示有该点，做setPosition
                        _filterData[id].marker = _this.devicePrevData[id].marker;
                        let _currentCar = _filterData[id];
                        _filterData[id].marker.setAngle(_currentCar.heading);
                        _filterData[id].marker.setPosition(_currentCar.position);
                    } 
                }
                for (let id in _filterData) {       
                    if(!_this.devicePrevData[id]) {   //表示新增该点，做add
                        _this.addMarker(_filterData[id]);
                    }       
                }
                if(_this.setFitViewFlag) {
                    setTimeout(_ => {
                        _this.distanceMap.setFitView();
                        _this.setFitViewFlag = false;
                    }, 500);  
                }
                _this.devicePrevData = _filterData;
          } else {
                // 返回的数据为空
                // console.log(_this.devicePrevData)
                // for (let id in _this.devicePrevData) {
                //   console.log(111111)
                //     _this.distanceMap.remove(_this.devicePrevData[id].marker);
                //     // delete _this.devicePrevData[id];
                // }
          } 

      },
      onDeviceClose(data){
        console.log("结束连接");
      },
      onDeviceOpen(data){
        let deviceVehicle = {
          "action": "rsb",
          "vehicleId": this.vehicleId
        }
        let deviceVehicleMsg = JSON.stringify(deviceVehicle);
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
          _this.lightWebsocket = new WebSocket(window.config.socketUrl);  //获得WebSocket对象
        }
        _this.lightWebsocket.onmessage = _this.onLightMessage;
        _this.lightWebsocket.onclose = _this.onLightClose;
        _this.lightWebsocket.onopen = _this.onLightOpen;
      },
      onLightMessage(mesasge){
        let _this=this;
        let json = JSON.parse(mesasge.data);
        let lightData = json.result.data;
        if (lightData.length > 0) {
              let _filterData = {};
              lightData.forEach((item, index) => {
                  _filterData[item.spatId] = {
                      position:ConvertCoord.wgs84togcj02(item.longitude, item.latitude),
                      leftTime:item.leftTime,
                      light:item.light,
                      direction:item.direction,
                      longitude:item.longitude,
                      latitude:item.latitude,
                      marker: null,
                      icon:'static/images/car/car-4.png',
                      size:[54,21],
                      ancher:[27,10],
                      zIndex:48
                  };
                 
                  let direction = item.direction+"";
                  let key = 'key_'+direction;
                  if( _this.lightData[key].time){
                      clearTimeout(_this.lightData[key].time)
                  }
        
                  _this.lightData[key].spareTime = item.leftTime;
                  _this.lightData[key].lightColor = item.light;
                  if(_this.lightData[key].spareTime && _this.lightData[key].lightColor){
                     _this.lightData[key].flag=true;
                  }
                 
                  //延长时间
                  _this.lightData[key].time=setTimeout(item=>{
                    _this.lightData[key].flag=false;
                  },3000)
                  // }
              });
              for (let id in _this.lightPrevData) {
                  if(_filterData[id]) {   //表示有该点，做setPosition
                      _filterData[id].marker = _this.lightPrevData[id].marker;
                      let _currentCar = _filterData[id];
                      _filterData[id].marker.setAngle(_currentCar.heading);
                      _filterData[id].marker.setPosition(_currentCar.position);
                  } 
              }
              for (let id in _filterData) {       
                  if(!_this.lightPrevData[id]) {   //表示新增该点，做add
                      _this.addMarker(_filterData[id]);
                  }       
              }
              if(_this.setFitViewFlag) {
                  setTimeout(_ => {
                      _this.distanceMap.setFitView();
                      _this.setFitViewFlag = false;
                  }, 500);  
              }
              _this.lightPrevData = _filterData;
        } else {
              // 返回的数据为空
              for (let id in _this.lightPrevData) {
                  _this.distanceMap.remove(_this.lightPrevData[id].marker);
                  delete _this.lightPrevData[id];
              }
        }
       
      },
      onLightClose(data){
        console.log("结束连接");
      },
      onLightOpen(data){
        //旁车
        let light = {
          "action": "spat",
          "vehicleId": this.vehicleId,
          "type":1
        }
        let lightMsg = JSON.stringify(light);
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
          _this.warningWebsocket = new WebSocket(window.config.socketUrl);  //获得WebSocket对象
        }
        _this.warningWebsocket.onmessage = _this.onWarningMessage;
        _this.warningWebsocket.onclose = _this.onWarningClose;
        _this.warningWebsocket.onopen = _this.onWarningOpen;
      },
      onWarningMessage(mesasge){
        let _this=this;
        let json = JSON.parse(mesasge.data);
        let warningData = json.result.data;
        let type = json.result.type;
        if(warningData.length>0){
         
          if(type=='VEHICLE'){
            let warningId;
            warningData.forEach(item=>{
              warningId = item.warnId;
              if(_this.vehicleIdList.indexOf(warningId) >= 0){
                 return;
              }
              // else{
              //   this.vehicleIdList.push(item.warnId);
              //   _this.vehicleList.push(item)
              // }
              
              //如果告警id不存在 右侧弹出
              if(!_this.warningData[warningId]){
                _this.vehicleCount++;
                let dist = parseInt(item.dis);
                if(!dist){
                  dist=-1;
                }
                let obj = {type: item.eventType,timer: null, flag: true,dist:dist,message:item.warnMsg,icon:item.warnIcon,warnColor:item.warnColor};
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
                _this.warningData[warningId]=obj;
              }
            })
          }
          if(type=='CLOUD'){
            let warningId;
            let eventType = json.result.eventType;
            warningData.forEach(item=>{
              warningId = item.warnId;
              // warningId = warningId.substring(0,warningId.lastIndexOf("_"));
              let msg = item.warnMsg+" "+item.dis+"米";
              let warningObj={
                longitude:item.longitude,
                latitude:item.latitude
              }
              let warningHash = _this.hashcode(JSON.stringify(warningObj));
              let position = ConvertCoord.wgs84togcj02(item.longitude, item.latitude);
              //如果告警id不存在 右侧弹出          
              if(!_this.warningData[warningId]){
          
                //在地图上标记交通事件
                let marker = new AMap.ElasticMarker({
                  position:position,
                  zooms:[10,20],
                  zIndex:47,
                  styles:[{
                    icon:{
                      img:item.warnMapIcon,
                      size:[44,60],
                      ancher:[22,60],
                      fitZoom:18,//最合适的级别，在此级别下显示为原始大小
                      scaleFactor:1.3,//地图放大一级的缩放比例系数
                      maxScale:1.3,//最大放大比例 达到此处图片不在变化
                      minScale:0.5//最小放大比例
                    }
                  }],
                  zoomStyleMapping:_this.zoomStyleMapping
                })
                _this.distanceMap.add(marker);
                //同时
                let eventObj = {
                  marker:marker,
                  hash:warningHash
                }
                _this.warningData[warningId]=eventObj;

                // 先打点 在预警信息中的内容不在右下角弹出 但是会在地图上打点
              
                if(_this.cloudIdList.indexOf(warningId) >= 0){
                    return;
                }else{
                    this.cloudIdList.push(item.warnId);
                    _this.cloudList.push(item)
                }
                // debugger
                let dist = parseInt(item.dis);
                if(!dist){
                  dist=-1;
                }
                let obj = {type:eventType,timer:null,flag:true,dist:dist,message:item.warnMsg,icon:item.warnIcon,warnColor:item.warnColor};
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
                _this.cloudCount++;

              }else{
                //判断是否需要更新
                let eventObj = _this.warningData[warningId];
                if(eventObj.hash!=warningHash){
                  //进行更新
                  eventObj.marker.setPosition(position);
                }
              }
            })
          }
        }
      },
      onWarningClose(data){
        console.log("结束连接");
      },
      onWarningOpen(data){
        //旁车
        let warning = {
          "action":"warning",
          "type":1,
          "body":{
            "vehicleId": this.vehicleId
          }
        }
        
        let warningMsg = JSON.stringify(warning);
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
    hashcode(str) {
      let hash = 0, i, chr, len;
      if (str.length === 0) return hash;
      for (i = 0, len = str.length; i < len; i++) {
        chr   = str.charCodeAt(i);
        hash  = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
      }
      return hash;
    },
      getAlarmInformation(){
        let param = {
          "vehicleId": this.vehicleId
        }
        this.vehicleList= [];
        getAlarmInformation(param).then(res=>{
          this.vehicleList=res.alarmInfoList;
          if(this.alertInit){
            this.vehicleCount = this.vehicleList.length;
            this.alertInit=  false;
            this.vehicleList.forEach(item=>{
              this.vehicleIdList.push(item.warnId);
            })
          }
        })
      },
       getV2xInformation(){
        let param = {
          "vehicleId": this.vehicleId
        }
        this.cloudList = [];
        getV2xInformation(param).then(res=>{
          this.cloudList=res.earlyWarningInfoList;
          if(this.v2xInit){
            this.cloudCount = this.cloudList.length;
            this.v2xInit=  false;
            this.cloudList.forEach((item,k)=>{
              this.v2xUuid.push(item.uuid);
              this.cloudIdList.push(item.warnId);
              this.cloudList[k].timestamp = item.warningTime;
              this.cloudList[k].warnMsg = item.warningName;
              this.cloudList[k].warnLevel = item.warningLevel;
              this.cloudList[k].longitude = item.position.split(",")[0];
              this.cloudList[k].latitude = item.position.split(",")[1];
            })
          }
        })
      },
      getCloudEvent(){
        this.cloudDialog=true;
        // this.getV2xInformation();
      },
      getVehicleEvent(){
        this.vehicleDialog=true;
        this.getAlarmInformation();
      },
      addMarker(obj) {
          obj.marker = new AMap.ElasticMarker({
            map: this.distanceMap,
            position: obj.position,
            zooms:[10,20],
            zIndex: obj.zIndex,
            styles:[{
              icon:{
                img: obj.icon,
                size:obj.size,
                ancher:obj.ancher,
                fitZoom:18,//最合适的级别，在此级别下显示为原始大小
                scaleFactor:1.1,//地图放大一级的缩放比例系数
                maxScale:1,//最大放大比例 达到此处图片不在变化
                minScale:0.2//最小放大比例
              }
            }],
            zoomStyleMapping:this.zoomStyleMapping
          })
      },
    },
    
    destroyed(){
      //销毁Socket
      this.hostWebsocket&&this.hostWebsocket.close();
      this.sideWebsocket&&this.sideWebsocket.close();
      this.deviceWebsocket&&this.deviceWebsocket.close();
      this.lightWebsocket&&this.lightWebsocket.close();
      this.warningWebsocket&&this.warningWebsocket.close();
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
      margin: 0 auto;
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
