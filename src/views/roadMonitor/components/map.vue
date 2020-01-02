<template>

  <div class="c-view-main" >
    <div :id="id" class="c-map-style"></div>
    <ul class="c-button-style clearfix">
      <li v-for="item in options" :key="item.id" :class="{active:item.isActive}" @click="getMarkers(item)">
        {{item.text}}
      </li>
    </ul>
    <div class="c-car-list" v-show="distributeShow">
      <div class="road-title">
        <span >{{message.title}}</span>
        <i class="road-title-close" @click="closeDistributeDialog"></i>
      </div>
      <div class="road-legend">
        <div class="road-text">说明</div>
        <ul class="road-legend-style clearfix">
          <li v-for="(item,index) in message.legend" :key="index">
            <span class="text-style" :style="{background:item.color}"></span><span>{{item.msg}}</span>
          </li>
        </ul>
      </div>
    </div>
    <traffic-dialog v-if="trafficDialog" :selectedItem="trafficeItem" @closeDialog="closeDialog"></traffic-dialog>
  </div>
</template>
<script>
  import { rwDis,tpSignalLight } from '@/api/roadMonitor'
  import ConvertCoord from '@/assets/js/utils/coordConvert.js'
  import trafficDialog from './components/trafficDialog.vue'
  export default {
    name: "MapContainer",
    components: {trafficDialog},
    data() {
      return {
        id: "road-map-container",
        map: null,
        trafficDialog:false,
        trafficeItem:{},
        webSocket: null,
        webSocketData: {
          action: "event_real_data",
          token: 'tusvn',
        },
        // 获取在驶车辆实时数据（辆）
        options:[
          {
            'id':'spat',
            'text':'信号灯',
            'isActive':true
          },
          {
            'id':'cross',
            'text':'路口',
            'isActive':false
          },
          {
            'id':'car',
            'text':'车辆分布',
            'isActive':false
          },
          {
            'id':'traffic',
            'text':'交通事件',
            'isActive':false
          },
          {
            'id':'speed',
            'text':'通行速度',
            'isActive':false
          },
        ],
        distributeShow:false,
        message:{},
        disParams:[],
        trafficData:[],
        count:0,
        massNum : "",
				carWms: null,
				speedWms: null,
        carTimer:0,
        speedTimer:0,
        masstraffic:null,
        wms:null,
        carSpeedFlag:{},
        distributeDialogFlag:null,
      }
    },
  
    watch: {
        trafficData: {
            handler(newVal, oldVal) {
              this.rwDisMap(newVal,"traffic")
            },
            deep: true
        },
        options:{
          handler(newVal,oldVal) {
            for (let i = 0; i < newVal.length; i++) {
                if(newVal[i].id == "car" || newVal[i].id == "speed"){
                  if(newVal[i].isActive){
                    this.wms.hide();
                    break;
                  }else{
                    this.wms.show();  
                  }
                }else{
                    this.wms.show();
                }  
            }
            for (let i = 0; i < newVal.length; i++) {
              if(newVal[i].id == "car" || newVal[i].id == "speed"){
                  if(newVal[i].isActive){
                    this.carSpeedFlag[newVal[i].id] = true;
                  }else{
                    this.carSpeedFlag[newVal[i].id] = false;             
                  }
                }
            }
            if(this.distributeDialogFlag){
              this.distributeShow = false; 
            }else{
              if(!this.carSpeedFlag.car && !this.carSpeedFlag.speed){
                this.distributeShow = false; 
              }
            }
          },      
          deep: true   
        } 
        
    },
    mounted() {
      let _this = this;
      this.map = new AMap.Map(this.id, window.defaultMapOption);
      setTimeout(()=>{
          this.map.setMapStyle(window.defaultMapOption.mapStyle);
      },0);
      this.map.setZoom(12);
      this.getWms();
      //  this.map.on('click', function(e){
      //    alert(e.lnglat.getLng()+';'+e.lnglat.getLat())
      //  });
      
      var item = {
        'id':0
      };
      this.getMarkers(item);
    },
    methods: {
      getMarkers(item) {
     
        var disParams=[];
        //首次加载时
        if(item.id==0){
          this.getRwDis('spat');
        }else{
          item.isActive=!item.isActive;
          //当选中后才进行请求
          if(item.isActive){
            //如果是车辆分布，弹出弹出框
            this.distributeDialogFlag = false;
            if(item.id=='car'){
//              clearInterval(this.carTimer);
              this.distributeDialogFlag = false;
              this.setMessage("car");
              
              this.distributeShow = true;
              //获取车辆分布数据
              this.getCarWms();
              this.carTimer = setInterval(()=>{
                //获取车辆分布数据
                this.getCarWms();
              },180000)
              return;
            }else if(item.id=='traffic'){
              this.initWebSocket();
            }else if(item.id=='speed'){
//              clearInterval(this.carTimer);
              this.distributeDialogFlag = false;
              this.setMessage("speed");
              this.distributeShow = true;
              //获取车辆分布数据
              this.getSpeedWms();
              this.speedTimer = setInterval(()=>{
                //获取车辆分布数据
                this.getSpeedWms();
              },5000)
              return;
            }else{
              this.getRwDis(item.id);
            }
            
          }else{
            if(item.id=='car' || item.id=='speed'){
              if(item.id=='car'){
                clearInterval(this.carTimer);
                this.map.remove(this.carWms);
                this.carWms = null;
              }
              if(item.id=='speed'){
                clearInterval(this.speedTimer);
                this.map.remove(this.speedWms);
                this.speedWms = null;
              }

              this.options.map((x)=>{
                if(x.id=='car' || x.id=='speed'){
                  if(x.isActive){
                    this.setMessage(x.id)
                  }
                }    
              })
            }
           
      
            //取消选中，将设备从地图中消除
            this.removeMarkers(item.id);
            this.webSocket && this.webSocket.close();
           
          }
        }
      },
      setMessage(type){
        if(type == "car"){
          this.message={
            title:"车辆分布:显示每段道路5分钟内的车辆分布情况",
            legend:[{
              msg:"1-50辆",
              color:'#ffe1be'
            },
            {
              msg:"51-100辆",
              color:'#fba947'
            },
            {
              msg:"101-200辆",
              color:'#db7a06'
            },
            {
              msg:"200辆以上",
              color:'#9d5704'
            }
            ]
          };
        }else if(type == "speed"){
          this.message={
            title:"通行速度:显示每条车道的通行速度",
            legend:[{
              msg:"≤ 10 km/h",
              color:'#7a0a09'
            },
            {
              msg:"10-15 km/h",
              color:'#db3131'
            },
            {
              msg:"15-25 km/h",
              color:'#db7a06'
            },
            {
              msg:"25-35 km/h",
              color:'#e7cc19'
            },
            {
              msg:"> 35 km/h",
              color:'#5cc93a'
            }]
          };
        }
      },
      getRwDis(disParam){
        rwDis({
          'disType': disParam,
        }).then(res => {
          this.rwDisMap(res.data,disParam);
        });
      },
      rwDisMap(resultData,disParam,type){    
        var _this = this;
        if(_this.count==0){
          if(resultData.length>0) {
            //转成高德地图的坐标
            let posotionData = [];
            resultData.forEach((item, index, arr)=>{
                resultData[index].position = ConvertCoord.wgs84togcj02(item.longitude, item.latitude);
                  _this.count ++;
                  if(_this.count == arr.length) {
                    //绘制线的轨迹     
                    resultData.forEach(function (subItem,subIndex) {
                      //信号灯
                      if(disParam=='spat'){          
                        posotionData.push({
                          lnglat: subItem.position
                        });
                      }
                      //路口
                      if(disParam=='cross'){
                        posotionData.push({
                          lnglat: subItem.position,
                          id: subItem.uid,
                          style: subIndex,
                          source: subItem.source
                        });
                      }
                      //交通事件
                      if(disParam =='traffic'){
                        posotionData.push({
                          lnglat: subItem.position,
                          id: subItem.id,
                          icon: subItem.mapIcon,
                          style: subIndex,
                          subItem: subItem
                        });
                      }
                      //绘制完后，重新设置
                      if(subIndex==resultData.length-1){     
                        _this.count=0;
                      }
                    })
                  
                  }
                /*}
              });*/
            })
            this.setMassMarker(posotionData,disParam);    
          }
        }
      },
      removeMarkers(type){
        if(type=='spat'&& this.massspat){  
          this.massspat.hide();
        }
        if(type=='cross'&& this.masscross){   
          this.masscross.hide();
        }
        if(type=='traffic'&& this.masstraffic){  
          this.webSocket&&this.webSocket.close();
          this.webSocket = null;
          this.masstraffic.clear();
          this.map.remove(this.masstraffic);
          this.masstraffic=null;
        }
      },
      closeDialog(){
        // this.distributeShow=false;
        this.trafficDialog=false;
      },
      closeDistributeDialog(){
        this.distributeDialogFlag = true;
        this.distributeShow=false;
        // this.trafficDialog=false;
      },
      getWms() {
        let _optionWms = Object.assign(
              {},
              window.dlWmsDefaultOption,
              {
                  params:{'LAYERS': window.dlWmsOption.LAYERS_centerline, 'VERSION': window.dlWmsOption.VERSION}
              }
          );

        this.wms  = new AMap.TileLayer.WMS(_optionWms);
        this.wms.setMap(this.map);
      },
      getCarWms() {
        let _params = {'LAYERS': window.dlWmsOption.LAYERS_centerline,'STYLES': window.dlWmsOption.STYLES, 'VERSION': window.dlWmsOption.VERSION, 'TIME': new Date().getTime()};
        if(this.carWms) {
          // this.map.remove(this.carWms);
          this.carWms.setParams(_params);
        }else {
          let _optionWms = Object.assign(
                {},
                window.dlWmsDefaultOption,
                {
                    params: _params
                }
            );
          this.carWms  = new AMap.TileLayer.WMS(_optionWms);
          //this.layerList.push(_wms);
          this.carWms.setMap(this.map);
        }
      },
      getSpeedWms() {
        let _params = {'LAYERS': window.dlWmsOption.LAYERS_laneavgspeed, 'VERSION': window.dlWmsOption.VERSION, 'TIME': new Date().getTime()};
        if(this.speedWms) {
          // this.map.remove(this.speedWms);
          this.speedWms.setParams(_params);
        }else {
          let _optionWms = Object.assign(
                {},
                window.dlWmsDefaultOption,
                {
                    params: _params
                }
            );
          this.speedWms = new AMap.TileLayer.WMS(_optionWms);
          //this.speedList.push(_wms);
          this.speedWms.setMap(this.map);  
        }
      },
      initWebSocket(){
        let _this=this;
        if ('WebSocket' in window) {
          _this.webSocket = new WebSocket(window.config.websocketUrl);  //获得WebSocket对象
          _this.webSocket.onmessage = _this.onmessage;
          _this.webSocket.onclose = _this.onclose;
          _this.webSocket.onopen = _this.onopen;
          _this.webSocket.onerror = _this.onerror;
        }

      },
      onmessage(mesasge){
        let _this=this;
        this.trafficData = JSON.parse(mesasge.data).result.data;
      },
      onclose(data){
        console.log("结束连接");
      },
      onerror(data){
        console.log("连接错误");
      },
      onopen(data){
        //获取在驶车辆状态
        var _traffic = JSON.stringify(this.webSocketData);
        this.sendMsg(_traffic);
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
      setMassMarker(data,disParam,type){
        // 创建样式对象
        let _this = this;
        let makerUrl;
        let anchorMass;
        let sizeMass;
        let massNum;
        let style=[];
        if(disParam=='spat'){
          makerUrl = './static/images/road/light.png';
          anchorMass =  new AMap.Pixel(6, 6);
          sizeMass = new AMap.Size(12, 12);
          massNum = "massspat";
          style.push({
              url: makerUrl,
              anchor: anchorMass,
              size: sizeMass
          });
        }else if(disParam=='cross'){
          anchorMass =  new AMap.Pixel(11, 11);
          sizeMass = new AMap.Size(22, 22);
          massNum = "masscross";
          data.map(item => {
            if(item.source==2){ //百度不可点
               makerUrl = './static/images/road/cross2.png';
            }else if(item.source==3){ //地平线数据  source 3 iframe
               makerUrl = './static/images/road/cross1.png';
            }else{  //迪路
               makerUrl = './static/images/road/cross.png';
            }
            style.push({
                url: makerUrl,
                anchor: anchorMass,
                size: sizeMass
            });        
          });
        }else if(disParam =='traffic'){ 
          anchorMass =  new AMap.Pixel(12,34);
          sizeMass = new AMap.Size(24,34);
          massNum = "masstraffic";
          data.map(item => {
              style.push({
                  url: item.icon,
                  anchor: anchorMass,
                  size: sizeMass
              });        
          });
        }

        if(massNum == "masstraffic" && this.masstraffic){ 
            this.masstraffic.setStyle(style);
            this.masstraffic.setData(data);
            this.masstraffic.on('click', function(e) {
              _this.trafficDialog=true;
              _this.trafficeItem=e.data.subItem;
            }); 
        }else{
            if(!this[massNum]) {
              this[massNum] = new AMap.MassMarks(data, {
                opacity: 1,
                zIndex: 111,
                zooms:[11,18],
                cursor: 'pointer',
                style: style
              });
              // 将海量点添加至地图实例
              this[massNum].setMap(_this.map);

              if(disParam=='cross'){    
                this[massNum].on('click', function(e) {
                  let item={
                    crossId:e.data.id,
                    source:e.data.source
                  } 
                  _this.$parent.$emit("crossEvent",item);
                });
              }else if(disParam == "traffic"){
                this[massNum].on('click', function(e) {
                  _this.trafficDialog=true;
                  _this.trafficeItem=e.data.subItem;
                });  
              }
            }else {
              this[massNum].show();
            }
        }
      }
    },
    destroyed(){
      //清除定时器
      clearInterval(this.carTimer);
      clearInterval(this.speedTimer);
      //清除websocket
      this.webSocket&&this.webSocket.close();
    }
  }
</script>
<style lang="scss" scoped>

  .c-car-list{
    position: absolute;
    top: 146px;
    right: 400px;
    z-index:2;
    .road-title{
      padding:13px 20px;
      border-bottom: 1px solid #5e5970;
      position: relative;
      font-size:14px;
      line-height: 14px;
      .road-title-close{
        position: absolute;
        top: 3px;
        right: 20px;
        width: 36px;
        height: 36px;
        background: url(../../../assets/images/public/dialog-close.png) no-repeat center center;
        background-size: 16px 16px;
        cursor: pointer;
      }
    }
    .road-legend{
      padding:20px;
      width: 400px;
      .road-text{
        display: inline-block;
        width: 20%;
        vertical-align: top;
      }
      .road-legend-style{
        display: inline-block;
        width: 70%;
        li{
          float: left;
          width:50%;
          .text-style{
            display: inline-block;
            width: 20px;
            height: 10px;
            margin-right: 6px;
          }
         
        }
      }
    }
  } 
</style>

