<template>

  <div class="c-view-main" >
    <div :id="id" class="c-map-style"></div>
    <ul class="c-button-style clearfix trans">
      <li v-for="item in options" :key="item.id" :class="{active:item.isActive}" @click="getMarkers(item)">
        {{item.text}}
      </li>
    </ul>
    <div class="road-distribute trans" v-show="distributeShow">
      <div class="road-title">
        <span >{{message.title}}</span>
        <i class="road-title-close" @click="closeDialog"></i>
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
  import { rwDis } from '@/api/roadMonitor'
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
        responseData: {},
        options:[
          {
            'id':'spat',
            'text':'红绿灯',
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
         }
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
        masstraffic:null
      }
    },
    watch: {
        trafficData: {
            handler: function (newVal, oldVal) {
              this.rwDisMap(newVal,"traffic")
            },
            deep: true
        }
    },
    mounted() {
      let _this = this;
      this.map = new AMap.Map(this.id, window.defaultMapOption);
      this.map.setZoom(12);
      this.getWms();
      
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
            if(item.id=='car'){
//              clearInterval(this.carTimer);
                this.message={
                  title:"车辆分布:显示车辆在每段路上的分布情况",
                  legend:[{
                    msg:"1-5辆",
                    color:'#ffe1be'
                  },
                  {
                    msg:"6-10辆",
                    color:'#fba947'
                  },
                  {
                    msg:"11-20辆",
                    color:'#db7a06'
                  },
                  {
                    msg:"21辆以上",
                    color:'#9d5704'
                  }
                 ]
                };
              this.distributeShow = true;
              //获取车辆分布数据
              this.getCarWms();
              this.carTimer = setInterval(()=>{
                //获取车辆分布数据
                this.getCarWms();
              },5000)
              return;
            }else if(item.id=='traffic'){
              this.initWebSocket();
            }else if(item.id=='speed'){
//              clearInterval(this.carTimer);
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
            if(item.id=='car'){
              clearInterval(this.carTimer);
              this.distributeShow = false;
              this.map.remove(this.carWms);
            }
            if(item.id=='speed'){
              clearInterval(this.speedTimer);
              this.distributeShow = false;
              this.map.remove(this.speedWms);
            }
              //取消选中，将设备从地图中消除
              this.removeMarkers(item.id);
            }
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
              // console.log(arr)
              resultData[index].position = ConvertCoord.wgs84togcj02(item.longitude, item.latitude);
                  _this.count ++;
                  if(_this.count == arr.length) {
                    //绘制线的轨迹             
                    resultData.forEach(function (subItem,subIndex) {
                      //红绿灯
                      if(disParam=='spat'){          
                        posotionData.push({
                          lnglat: subItem.position
                        });
                      }
                      //路口
                      if(disParam=='cross'){        
                        posotionData.push({
                          lnglat: subItem.position,
                          id: subItem.uid
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
        //console.log(type)
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
        this.distributeShow=false;
        this.trafficDialog=false;
      },
      getWms() {
        let _optionWms = Object.assign(
              {},
              window.dlWmsDefaultOption,
              {
                  params:{'LAYERS': window.dlWmsOption.LAYERS_centerline, 'VERSION': window.dlWmsOption.VERSION}
              }
          );

        let _wms  = new AMap.TileLayer.WMS(_optionWms);
        _wms.setMap(this.map);
      },
      getCarWms() {
      	if(this.carWms) {
      		this.map.remove(this.carWms);
      	}
        let _optionWms = Object.assign(
              {},
              window.dlWmsDefaultOption,
              {
                  params:{'LAYERS': window.dlWmsOption.LAYERS_centerline,'STYLES': window.dlWmsOption.STYLES, 'VERSION': window.dlWmsOption.VERSION}
              }
          );
        this.carWms  = new AMap.TileLayer.WMS(_optionWms);
        //this.layerList.push(_wms);
        this.carWms.setMap(this.map);
      },
      getSpeedWms() {
      	if(this.speedWms) {
      		this.map.remove(this.speedWms);
      	}
        let _optionWms = Object.assign(
              {},
              window.dlWmsDefaultOption,
              {
                  params:{'LAYERS': window.dlWmsOption.LAYERS_laneavgspeed, 'VERSION': window.dlWmsOption.VERSION}
              }
          );
        this.speedWms = new AMap.TileLayer.WMS(_optionWms);
        //this.speedList.push(_wms);
        this.speedWms.setMap(this.map);  
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
          makerUrl = './static/images/road/cross.png';
          anchorMass =  new AMap.Pixel(11, 11);
          sizeMass = new AMap.Size(22, 22);
          massNum = "masscross";
          style.push({
              url: makerUrl,
              anchor: anchorMass,
              size: sizeMass
          });
        }
        else if(disParam =='traffic'){ 
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
            //this.masstraffic.clear();
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
                    crossId:e.data.id
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

  .road-distribute{
    position: absolute;
    top: 146px;
    right: 400px;
    z-index:2;
    border:1px solid #5e5970;
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
  .trans{
    background-color: rgba(94,89,112,.2);
  }
 
</style>

