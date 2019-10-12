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
        <span>{{filterData.speed || '--'}}</span>
        <span class="detail2">km/h</span>
      </div>
      <div class="detail1">
        <span>{{nowYear}}</span>
        <span class="detail2">{{nowTime}}</span>
      </div>
    </div>
    <ul class="bake-style">
      <li>
        <span>9号门东杆-进/出</span>
        <span :class="geat.status3.value == '开' ? 'park-green-bgc' : 'park-red-bgc'" class="park-switch">{{geat.status3.value}}</span>
      </li>
      <li>
        <span>9号门西杆-进/出</span>
        <span :class="geat.status4.value == '开' ? 'park-green-bgc' : 'park-red-bgc'" class="park-switch">{{geat.status4.value}}</span>
      </li>
      <li>
        <span>停车场-进</span>
        <span :class="geat.status6.value == '开' ? 'park-green-bgc' : 'park-red-bgc'" class="park-switch">{{geat.status6.value}}</span>
      </li>
      <li>
        <span>停车场-出</span>
        <span :class="geat.status5.value == '开' ? 'park-green-bgc' : 'park-red-bgc'" class="park-switch">{{geat.status5.value}}</span>
      </li>
    </ul>
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
      <el-table
          :data="cloudList"
          border>
          <el-table-column label="序号" type="index" width="100"></el-table-column>
          <el-table-column label="预警时间" min-width="25%">
            <template slot-scope="scope">{{scope.row.warningTime | dateFormat}}</template>
          </el-table-column>
          <el-table-column label="预警类型" prop="warningName" min-width="25%"></el-table-column>
          <el-table-column label="预警级别" min-width="25%">
            <template slot-scope="scope">
              <p class="c-alert-level">{{scope.row.warningLevel}}</p>
            </template>
          </el-table-column>
          <el-table-column label="预警位置" prop="position" min-width="25%"></el-table-column>
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
  import { getAlarmInformation,getV2xInformation,getBrakeInfo } from '@/api/carMonitor'
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
        geatWebsocket:null,
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
        timerTime:7000,
        geat:{
          status5:{
            value:'', 
            timer:null
          },
          status6:{
            value:'',
            timer:null
          },
          status3:{
            value:'',
            timer:null
          },
          status4:{
            value:'',
            timer:null
          },
        },
     
        geatListArr:[],
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
        rsuPl:{
          1:[ 115.908519,39.046633],
          2:[ 115.905150,39.046712],
          3:[ 115.909713,39.047693],
          4:[ 115.908525,39.047519],
          5:[ 115.905044,39.047584],
          6:[ 115.909566,39.049398],
          7:[ 115.908472,39.049454],
          8:[ 115.905020,39.049431],
          9:[ 115.909394,39.051029],
          10:[ 115.907396,39.051035],
          11:[ 115.905091,39.050994],
          12:[ 115.878286,39.041891],
          13:[ 115.872194,39.041960],
          14:[ 115.866564,39.042019],
          15:[ 115.867074,39.041671],
          16:[ 115.859773,39.041669],
          17:[ 115.892292,39.036231],
          18:[ 115.894425,39.033434],
        },
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
      },
      filterData() {
          let _filterData = {};
          for(let attr in this.realData) {
            if(attr=='speed'){
              _filterData[attr] = parseFloat(this.realData[attr]).toFixed(1).toLocaleString() || '--';
            }
          }
          return _filterData;
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
          this.sideWebsocket.close();
        }else{
        
          this.initSideWebSocket();
        }
      },
      'geat.status5.value'(newVal,oldVal){
           this.showGeat(newVal,"status6");  
      },
      'geat.status6.value'(newVal,oldVal){
           this.showGeat(newVal,"status5");
      },
      'geat.status3.value'(newVal,oldVal){
           this.showGeat(newVal,"status4"); 
      },
      'geat.status4.value'(newVal,oldVal){
           this.showGeat(newVal,"status3");     
      },
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
          _this.hostWebsocket = new WebSocket(window.config.socketUrl);  //获得WebSocket对象
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
          if(_this.isInit){
            platNo=data.plateNo;
            data.source.forEach(item=>{
              source+=item+",";
            })
            source = source.substring(0,source.lastIndexOf(","));
          }
             let newPosition = ConvertCoord.wgs84togcj02(data.longitude, data.latitude);
              if(_this.isInit){
                // _this.marker = new AMap.Marker({
                //   position: newPosition,
                //   icon: 'static/images/car/car-6.png', // 添加 Icon 图标 URL
                //   zIndex:500
                // });

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
          _this.sideWebsocket = new WebSocket(window.config.socketUrl);  //获得WebSocket对象
        }
        _this.sideWebsocket.onmessage = _this.onSideMessage;
        _this.sideWebsocket.onclose = _this.onSideClose;
        _this.sideWebsocket.onopen = _this.onSideOpen;
        _this.sideWebsocket.onerror = _this.onSideError;
      },
      onSideMessage(mesasge){

        var _this=this;
        var json = JSON.parse(mesasge.data);
        var deviceData = json.result.data;
        if (deviceData.length > 0) {
              let _filterData = {};
              deviceData.forEach((item, index) => {
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
              for (let id in _this.sidePrevData) {
                  if(_filterData[id]) {   //表示有该点，做setPosition
                      _filterData[id].marker = _this.sidePrevData[id].marker;
                      let _currentCar = _filterData[id];
                      _filterData[id].marker.setAngle(_currentCar.heading);
                      _filterData[id].marker.setPosition(_currentCar.position);
                  } 
              }
              for (let id in _filterData) {       
                  if(!_this.sidePrevData[id]) {   //表示新增该点，做add
                      _this.addMarker(_filterData[id]);
                  }       
              }
              if(_this.setFitViewFlag) {
                  setTimeout(_ => {
                      _this.distanceMap.setFitView();
                      _this.setFitViewFlag = false;
                  }, 500);  
              }
              _this.sidePrevData = _filterData;
        } else {
              // 返回的数据为空
              for (let id in _this.sidePrevData) {
                  _this.distanceMap.remove(_this.sidePrevData[id].marker);
                  delete _this.sidePrevData[id];
              }
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
          _this.deviceWebsocket = new WebSocket(window.config.socketUrl);  //获得WebSocket对象
        }
        _this.deviceWebsocket.onmessage = _this.onDeviceMessage;
        _this.deviceWebsocket.onclose = _this.onDeviceClose;
        _this.deviceWebsocket.onopen = _this.onDeviceOpen;
      },
      onDeviceMessage(mesasge){
          var _this=this;
          var json = JSON.parse(mesasge.data);
          var deviceData = json.result.data;
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
                for (let id in _this.devicePrevData) {
                    _this.distanceMap.remove(_this.devicePrevData[id].marker);
                    delete _this.devicePrevData[id];
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
          _this.lightWebsocket = new WebSocket(window.config.socketUrl);  //获得WebSocket对象
        }
        _this.lightWebsocket.onmessage = _this.onLightMessage;
        _this.lightWebsocket.onclose = _this.onLightClose;
        _this.lightWebsocket.onopen = _this.onLightOpen;
      },
      onLightMessage(mesasge){
        var _this=this;
        var json = JSON.parse(mesasge.data);
        var lightData = json.result.data;
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
            let longitude;
            let latitude;
            let position;
            warningData.forEach(item=>{
              warningId = item.warnId;
              warningId = warningId.substring(0,warningId.lastIndexOf("_"));
              let msg = item.warnMsg+" "+item.dis+"米";
              let warningObj={
                longitude:item.longitude,
                latitude:item.latitude
              }
              let warningHash = _this.hashcode(JSON.stringify(warningObj));
              let position = ConvertCoord.wgs84togcj02(item.longitude, item.latitude);
              //如果告警id不存在 右侧弹出
 	      if(!_this.warningData[warningId]){ 
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
              longitude = item.longitude;
              latitude = item.longitude;
              position = ConvertCoord.wgs84togcj02(item.longitude, item.latitude);
              let marker = new AMap.ElasticMarker({
                position:position,
                zooms:[10,20],
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
      initGeatWebSocket(){
        let _this=this;
        if ('WebSocket' in window) {
          _this.geatWebsocket = new WebSocket(window.config.websocketUrl);  //获得WebSocket对象
        }
        _this.geatWebsocket.onmessage = _this.onGeatMessage;
        _this.geatWebsocket.onclose = _this.onGeatClose;
        _this.geatWebsocket.onopen = _this.onGeatOpen;
      },
      onGeatMessage(mesasge){
        var json = JSON.parse(mesasge.data);
        var geatData = json.result;
        var geatStatus = geatData.status;
        var statusText = geatStatus == "01" ? "开" : "关";
        // 01-开 02-关
        switch(geatData.devId) {
          case "05":
            this.geat.status5.value = statusText;
            break;
          case "06":
            this.geat.status6.value = statusText;
            break;
          case "03":
            this.geat.status3.value = statusText;
            break;
          case "04":
            this.geat.status4.value = statusText;
            break;
        }
        // this.showGeat();
      },
      onGeatClose(){
        console.log("结束连接");
      },
      onGeatOpen(){  
        //闸机     
        var geat = {
          "action": "dtu_dev_status",
          "devId": this.geatListArr.join(",")
        }
        var geatMsg = JSON.stringify(geat);
        this.sendGeatMsg(geatMsg);
      },
      sendGeatMsg(msg) {
        let _this=this;
        if(window.WebSocket){
          if(_this.geatWebsocket.readyState == WebSocket.OPEN) { //如果WebSocket是打开状态
            _this.geatWebsocket.send(msg); //send()发送消息
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
      },
      showGeat(value,flag){
  
        let geatAnother
        let geatNow
        let markerArr = {};
        switch (flag) {
          case "status5":
            geatAnother = this.geat.status5.value;
            geatNow = this.geat.status6.value;
            markerArr = {
              '00':'geat-3',
              '01':'geat-5',
              '10':'geat-4',
              '11':'geat-1',
            };
            this.geatTimeout("geat.status6.timer")
            break;
          case "status6":
            geatAnother = this.geat.status6.value;
            geatNow = this.geat.status5.value;
            markerArr = {
              '00':'geat-3',
              '01':'geat-5',
              '10':'geat-4',
              '11':'geat-1',
            };
            this.geatTimeout("geat.status5.timer")
            break;
          case "status3":
            geatAnother = this.geat.status3.value;
            geatNow = this.geat.status4.value;
            markerArr = {
              '00':'geat-6',
              '11':'geat-2',
            };
             this.geatTimeout("geat.status3.timer")
            break;
          case "status4":
            geatAnother = this.geat.status4.value;
            geatNow = this.geat.status3.value;
            markerArr = {
              '00':'geat-6',
              '11':'geat-2',
            };
             this.geatTimeout("geat.status4.timer")
            break;       
        }

        // 00为开 开  11 为关 关
      
    
        if(geatNow == "开" && geatAnother == "开"){
          for(let i in markerArr) {          
              if(i == '00'){
                this[markerArr[i]].show();
              }else{
                this[markerArr[i]].hide();  
              }
          }
        }else if(geatNow == "开" && geatAnother == "关"){
          for(let i in markerArr) {
            if(this.geat.status5.value == "开" || this.geat.status3.value == "开"){
                if(i == '01'){
                this[markerArr[i]].show();
                }else{
                this[markerArr[i]].hide();  
                }
            }else{     
                if(i == '10'){
                this[markerArr[i]].show();
                }else{
                this[markerArr[i]].hide();  
                }
            }
             
          }
        }else if(geatNow == "关" && geatAnother == "开"){
           if(this.geat.status5.value == "开" || this.geat.status3.value == "开"){
            for(let i in markerArr) {
                if(i == '01'){
                  this[markerArr[i]].show();
                }else{
                  this[markerArr[i]].hide();  
                }
            }
           }else{
            for(let i in markerArr) {
                if(i == '10'){
                  this[markerArr[i]].show();
                }else{
                  this[markerArr[i]].hide();  
                }
            }
           }       
        }else if(geatNow == "关" && geatAnother == "关"){
          for(let i in markerArr) {
              if(i == '11'){
                this[markerArr[i]].show();
              }else{
                this[markerArr[i]].hide();  
              }
          }
        }
 
      },
      geatTimeout(timer){
       
        clearTimeout(this[timer]);
        this[timer] = setTimeout(() => {   
          if(timer == "geat.status3.timer"){
            if(this.geat.status3.value == "开"){
              this.geat.status3.value = "关"
              this.geat.status4.value = "关"
            }
          }else if(timer == "geat.status4.timer"){
            if(this.geat.status4.value == "开"){
              this.geat.status3.value = "关"
              this.geat.status4.value = "关"
            }
          }else if(timer == "geat.status5.timer"){
            // 5-出
            if(this.geat.status5.value == "开"){
              this.geat.status5.value = "关"
            }
          }else if(timer == "geat.status6.timer"){
             // 6-进
            if(this.geat.status6.value == "开"){
              this.geat.status6.value = "关"
            }
          }
        }, this.timerTime);
      },
      getBrakeInfo(){
        let _this = this;
        getBrakeInfo().then(res=>{
          let data = res.data;  
          let pFlag = true;
          let gFlag = true;
          data.forEach(item=>{
            this.geatListArr.push(item.devId);
            let newPosition = ConvertCoord.wgs84togcj02(item.lon, item.lat);
            let geatImgPath = '';
            let geatImgSize = '';
            let geatImgAncher = '';
            let geatImgArr = [];
            
            if((item.devId == "05" || item.devId == "06") && pFlag){
              geatImgArr = ['geat-1','geat-3','geat-4','geat-5'];
              pFlag = false;
              for (let i = 0; i < geatImgArr.length; i++) {
                this[geatImgArr[i]] = new AMap.ElasticMarker({
                  position:newPosition,
                  zooms:[10,20],
                  styles:[{
                    icon:{
                      img:'static/images/car/'+geatImgArr[i]+'.png',
                      size:[48,53],
                      ancher:[24,53],
                      fitZoom:17,//最合适的级别，在此级别下显示为原始大小
                      scaleFactor:1.3,//地图放大一级的缩放比例系数
                      maxScale:1.3,//最大放大比例 达到此处图片不在变化
                      minScale:0.5//最小放大比例
                    }
                  }],
                  zoomStyleMapping:_this.zoomStyleMapping
                })
                _this.distanceMap.add(this[geatImgArr[i]]);   
                this[geatImgArr[i]].hide();            
              }
            }else if((item.devId == "03" || item.devId == "04") && gFlag){
              geatImgArr = ['geat-2','geat-6'];
              gFlag = false;
              for (let i = 0; i < geatImgArr.length; i++) {
                this[geatImgArr[i]] = new AMap.ElasticMarker({
                  position:newPosition,
                  zooms:[10,20],
                  styles:[{
                    icon:{
                      img:'static/images/car/'+geatImgArr[i]+'.png',
                      size:[36,90],
                      ancher:[18,45],
                      fitZoom:17,//最合适的级别，在此级别下显示为原始大小
                      scaleFactor:1.3,//地图放大一级的缩放比例系数
                      maxScale:1.3,//最大放大比例 达到此处图片不在变化
                      minScale:0.5//最小放大比例
                    }
                  }],
                  zoomStyleMapping:_this.zoomStyleMapping
                })
                _this.distanceMap.add(this[geatImgArr[i]]); 
                this[geatImgArr[i]].hide();                 
              }
            }
              
            var geatStatus = item.status;
            var statusText = geatStatus == "01" ? "开" : "关";
            // 01-开 02-关
            switch(item.devId) {
              case "05":
                this.geat.status5.value = statusText;
                break;
              case "06":
                this.geat.status6.value = statusText;
                break;
              case "03":
                this.geat.status3.value = statusText;
                break;
              case "04":
                this.geat.status4.value = statusText;
                break;
            }


          })
     
          this.initGeatWebSocket();
        })
      },
      initAddRsu(){
        let _this = this;
        for (let i in this.rsuPl) {
          let _positon = ConvertCoord.wgs84togcj02(this.rsuPl[i][0], this.rsuPl[i][1]);
          let marker = new AMap.ElasticMarker({
            position:_positon,
            zooms:[9,20],
            styles:[{
              icon:{
                img:'static/images/car/rsu.png',
                size:[24,24],
                ancher:[12,24],
                fitZoom:16,//最合适的级别，在此级别下显示为原始大小
                scaleFactor:1.3,//地图放大一级的缩放比例系数
                maxScale:1.5,//最大放大比例 达到此处图片不在变化
                minScale:0.6//最小放大比例
              }
            }],
            zoomStyleMapping:_this.zoomStyleMapping
          })
         
         
          // let marker = new AMap.Marker({
          //   position: _positon,
          //   icon: 'static/images/car/rsu.png', // 添加 Icon 图标 URL
          // });
          _this.distanceMap.add(marker);
        }
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
      this.initWebSocket();
      this.initSideWebSocket();
      this.initDeviceWebSocket();
      this.initWarningWebSocket();
      this.initLightWebSocket();
      //云端和车端此次行程统计
      this.getV2xInformation();
      this.getAlarmInformation();
      this.getBrakeInfo();
      this.initAddRsu();
     
    },
    destroyed(){
      //销毁Socket
      this.hostWebsocket && this.hostWebsocket.close();
      this.sideWebsocket && this.sideWebsocket.close();
      this.deviceWebsocket && this.deviceWebsocket.close();
      this.lightWebsocket && this.lightWebsocket.close();
      this.warningWebsocket && this.warningWebsocket.close();
      this.geatWebsocket && this.geatWebsocket.close();
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
    .bake-style{
      position: absolute;
      right: 70px;
      top: 20px;
      z-index:1;
      li{
        margin-right: 30px;
        float: left;
        @include layoutMode(align);
        .park-switch{
          margin: 5px 0;
          width: 22px;
          height: 22px;  
          font-size: 16px;
          display: inline-block;
          text-align: center;
          margin-left: 10px;
        }
        .park-green-bgc{
           background-color: #156f33;
        }
        .park-red-bgc{
           background-color: #aa1111;
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
