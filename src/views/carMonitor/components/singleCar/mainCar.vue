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
  import WebSocketObj from '@/assets/js/utils/webSocket.js'
  export default {
    name:"main-car",
    data () {
      return {
        distanceMap:{},
        marker:{},
        platNoMarker:{},
      
        sideWebsocket:null,
        deviceWebsocket:null,
        lightWebsocket:null,
        warningWebsocket:null,
        eventCancelWebsocket:null,
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
        makerPosition:null,
        mountedFlag:true,
        addLightMarker:null,
        addWarningMarker:null,
        clearLightTimer:false,
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
          this.sideWebsocket.webSocket.close();
        }else{
          // console.log("第一次是否走此方法")
          this.initSideWebSocket();
        }
      },
      // 自车WS
      vehWsData(newVal,oldVal){
        this.onmessage(newVal);

        if(this.mountedFlag){
              // 杆
          this.initDeviceWebSocket();   
          // 信号灯
          this.initLightWebSocket();
          //云端和车端此次行程统计
          this.getV2xInformation();
          this.getAlarmInformation();
          // 事件
          this.initWarningWebSocket();
          // rsi事件取消
          this.initEventCancelWebSocket();
          this.mountedFlag = false;
        }
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
                  cursor: 'auto',
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
                  cursor: 'auto',
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
              _this.makerPosition = newPosition;

      },
      initSideWebSocket(){
        let _params ={
            "action": "vehicle",
            "body": {
                "vehicleId": this.vehicleId
            },
            "type": 2
        };
        this.sideWebsocket = new WebSocketObj(this, window.config.socketUrl, _params, this.onSideMessage);
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

                _this.sidePrevData[_filterData.vehicleId] = _filterData;
                _this.sidePrevData[_filterData.vehicleId].timer = setTimeout(() => {
                  _this.distanceMap.remove(_this.sidePrevData[_filterData.vehicleId].marker);
                  delete _this.sidePrevData[_filterData.vehicleId];
                }, this.timeOut);
              }    
        } 
      },
      initDeviceWebSocket(){
        let _params = {
          "action": "rsb",
          "vehicleId": this.vehicleId
        };
        this.deviceWebsocket = new WebSocketObj(this, window.config.socketUrl, _params, this.onDeviceMessage);
      },
      onDeviceMessage(mesasge){
          let _this=this;
          let json = JSON.parse(mesasge.data);
          let deviceData = json.result.data;
          if (deviceData.length > 0) {
                if(this.clearLightTimer){
                  clearTimeout(this.clearLightTimer)
                }
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
                this.setMassMarker(_filterData,"addLightMarker");

          }     
          this.clearLightTimer = setTimeout(() => {  
            if(this.addLightMarker){
               this.addLightMarker.setData([]);
            }     
          }, 3000);       
      },
      initLightWebSocket(){
        let _params = {
          "action": "spat",
          "vehicleId": this.vehicleId,
          "type":1
        };
        this.lightWebsocket = new WebSocketObj(this, window.config.socketUrl, _params, this.onLightMessage);
      },
      onLightMessage(mesasge){
        let _this=this;
        let json = JSON.parse(mesasge.data);
        let lightData = json.result.data;
        if (lightData.length > 0) {
              let _filterData = {};
              lightData.forEach((item, index) => {
                  if(_this.lightPrevData[item.spatId]){
                    clearTimeout(_this.lightPrevData[item.spatId].timer)
                  }
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
                      zIndex:48,
                      heading:item.heading || 0,
                      timer:setTimeout(() => {
                        _this.distanceMap.remove(_this.lightPrevData[item.spatId].marker);
                        delete _this.lightPrevData[item.spatId];
                      }, 3500)  
                  };
                 
                  let direction = item.direction+"";
                  let key = 'key_'+direction;
                  if( _this.lightData[key].time){
                      clearTimeout(_this.lightData[key].time)
                  }
        
                  this.$set(_this.lightData[key],'spareTime',item.leftTime);
                  this.$set(_this.lightData[key],'lightColor',item.light);
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
              _this.lightPrevData = _filterData;
        }
      },
      initEventCancelWebSocket(){
          let _params = {
            "action":"event_cancel",
            "type":1,
            "body":{
              "busType": "rsi"
            }
          };
          this.eventCancelWebsocket = new WebSocketObj(this, window.config.socketUrl, _params, this.onEventCancelMessage);
      },
      onEventCancelMessage(message){
         let _this=this;
         let warningId = JSON.parse(message.data).result;
         let _params = {
              "action":"event_cancel",
              "type":2,
              "body":{
                "events": warningId,
                "status":1
              }
          };
          _params = JSON.stringify(_params);
          this.eventCancelWebsocket.sendMsg(_params);
          if(_this.warningData[warningId]){
            delete _this.warningData[warningId]; 
          } 
        
      },
      initWarningWebSocket(){
        let _params = {
          "action":"warning",
          "type":1,
          "body":{
            "vehicleId": this.vehicleId
          }
        };
        this.warningWebsocket = new WebSocketObj(this, window.config.socketUrl, _params, this.onWarningMessage);
      },
      onWarningMessage(mesasge){
        let _this=this;
        let json = JSON.parse(mesasge.data);
        let warningData = json.result;
        
        if(warningData.length>0){
          warningData.map((v,k)=>{  
              let type = v.type;     
              if(type=='VEHICLE'){
                let warningId = v.data.warnId;
                  if(_this.vehicleIdList.indexOf(warningId) >= 0){
                    return;
                  }
                  
                  //如果告警id不存在 右侧弹出
                  if(!_this.warningData[warningId]){
                    _this.vehicleCount++;
                    let dist = parseInt(v.data.dis);
                    if(!dist){
                      dist=-1;
                    }
                    let obj = {
                      type: v.data.eventType,
                      timer: null, 
                      flag: true,
                      dist:dist,
                      message:v.data.warnMsg,
                      icon:window.config.iconPath+'rsi_'+v.data.eventType.split('_')[1]+'.png',
                      warnColor:v.data.warnColor
                    };
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
                    // _this.warningData[warningId]=obj;
                  }
                
              }
              if(type=='CLOUD'){
                  // isD true 为动态事件  false 为静态事件
                  if(v.data.isD){                         
                    let warningId = v.data.warnId;
                    let eventType = v.eventType;
                    let warningObj={
                      longitude:v.data.longitude,
                      latitude:v.data.latitude
                    }
                    let position = ConvertCoord.wgs84togcj02(v.data.longitude, v.data.latitude);
                    //如果告警id不存在 右侧弹出  

                    if(!_this.warningData[warningId]){
                      _this.warningData[warningId] = {
                        position:position,
                        icon: window.config.iconPath+'rsi_map_'+v.data.eventType.split("_")[1]+'.png',
                        timer:setTimeout(() => {
                                delete _this.warningData[warningId];
                              }, 3000)  
                      }
                    
                      // 在预警信息中的内容不在右下角弹出 但是会在地图上打点     
                      if(_this.cloudIdList.indexOf(warningId) >= 0){
                          return;
                      }else{
                          this.cloudIdList.push(v.data.warnId);
                          _this.cloudList.push(v.data)
                      }
                      let dist;
                    
                      let dis = AMap.GeometryUtil.distance([this.makerPosition[0],this.makerPosition[1]], [v.data.longitude,v.data.latitude]);
                      dist = parseInt(dis);
                      if(!dist){
                        dist=-1;
                      }
                        
                      let obj = {
                        type:eventType,
                        timer:null,
                        flag:true,
                        dist:dist,
                        message:v.data.warnMsg,
                        icon:window.config.iconPath+'rsi_'+v.data.eventType.split('_')[1]+'.png',
                        warnColor:v.data.warnColor
                      };
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
                      if(_this.warningData[warningId].timer){  
                        clearTimeout(_this.warningData[warningId].timer)
                      }
                      _this.warningData[warningId] = {
                        position:position,
                        icon: window.config.iconPath+'rsi_map_'+v.data.eventType.split("_")[1]+'.png',
                        timer:setTimeout(() => {
                                delete _this.warningData[warningId];
                              }, 3000)  
                      }
                    } 

                  }else{        
                    let warningId = v.data.warnId;  
                    let eventType = v.eventType; 
                    let warningObj={
                      longitude:v.data.longitude,
                      latitude:v.data.latitude
                    }
                    let position = ConvertCoord.wgs84togcj02(v.data.longitude, v.data.latitude);
                    //如果告警id不存在 右侧弹出  

                    if(!_this.warningData[warningId]){
                      let _params = {
                        "action":"warning",
                        "type":2,
                        "body":{
                          "warnId": warningId,
                          "status":1
                        }
                      };
                      _params = JSON.stringify(_params);
                      this.warningWebsocket.sendMsg(_params);
                        _this.warningData[warningId] = {
                          position:position,
                          icon: window.config.iconPath+'rsi_map_'+v.data.eventType.split("_")[1]+'.png',
                      }
                    
                      // 在预警信息中的内容不在右下角弹出 但是会在地图上打点     
                      if(_this.cloudIdList.indexOf(warningId) >= 0){
                          return;
                      }else{
                          this.cloudIdList.push(v.data.warnId);
                          _this.cloudList.push(v.data)
                      }
                      let dist;
                    
                      let dis = AMap.GeometryUtil.distance([this.makerPosition[0],this.makerPosition[1]], [v.data.longitude,v.data.latitude]);
                      dist = parseInt(dis);
                      if(!dist){
                        dist=-1;
                      }
                        
                      let obj = {
                        type:eventType,
                        timer:null,
                        flag:true,
                        dist:dist,
                        message:v.data.warnMsg,
                        icon:window.config.iconPath+'rsi_'+v.data.eventType.split('_')[1]+'.png',
                        warnColor:v.data.warnColor
                      };
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
                      delete _this.warningData[warningId];
                    } 
                  }
              }
          }) 
          this.setMassMarker(this.warningData,"addWarningMarker");
        }
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
            cursor: 'auto',
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


       setMassMarker(data,markerName){
          // 创建样式对象
          let style=[];
          let massData = [];
        
          for (const item in data) {
            style.push({
                url: data[item].icon,
                anchor: new AMap.Pixel(12,34),
                size: new AMap.Size(24,34),
            });   
            massData.push({
                lnglat: data[item].position,  
                name:massData.length,
                id:massData.length,
                style:massData.length
            })   
          }

          if(!this[markerName]){
              this[markerName] = new AMap.MassMarks(massData, {
              opacity: 1,
              zIndex: 111,
              zooms:[11,18],
              cursor: 'auto',
              style: style
            });
            // 将海量点添加至地图实例
            this[markerName].setMap(this.distanceMap);
          }else{
            this[markerName].setStyle(style);
            this[markerName].setData(massData);
          } 
        },
  
    },
    
    destroyed(){
      //销毁Socket
      this.sideWebsocket&&this.sideWebsocket.webSocket.close();
      this.deviceWebsocket&&this.deviceWebsocket.webSocket.close();
      this.lightWebsocket&&this.lightWebsocket.webSocket.close();
      this.warningWebsocket&&this.warningWebsocket.webSocket.close();
      this.eventCancelWebsocket&&this.eventCancelWebsocket.webSocket.close();

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
