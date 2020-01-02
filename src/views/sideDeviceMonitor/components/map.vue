<template>

  <div class="c-view-main" >
    <div :id="id" class="c-map-style"></div>
    <ul class="c-button-style clearfix">
      <li v-for="item in options" :key="item.id" :class="{active:item.isActive}" @click="getMarkers(item)">
        {{item.text}}
      </li>
    </ul>
    <bus-dialog v-if="busDialog" :wescoketData="lightData" :selectedItem="busItem"  @closeDialog="closeDialog"></bus-dialog>
  </div>
</template>
<script>
  import { tpSignalLight } from '@/api/roadMonitor'
  import { getDevDis } from '@/api/sideDeviceMonitor'
  import ConvertCoord from '@/assets/js/utils/coordConvert.js'
  import busDialog from './components/busDialog.vue'
  export default {
    name: "MapContainer",
    components: {busDialog},
    data() {
      return {
        id: "device-map-container",
        map: null,

        // 获取在驶车辆实时数据（辆）
        webSocket: null,
        webSocketData: {
          action: "trackAll",
          token: 'fpx',
          vehicleId: 'trackAll'
        },
        responseData: {},
        options:[
          // {
          //   'id':1,
          //   'text':'信号灯',
          //   'isActive':false
          // },
          {
            'id':2,
            'text':'路侧点',
            'isActive':true
          },
          {
            'id':3,
            'text':'RSU',
            'isActive':false
          },
          {
            'id':'smartBus',
            'text':'智慧信号灯',
            'isActive':false
          },
        ],
        disParams:[],
        lightList:[],
        rcuList:[],
        sideList:[],
        count:0,

        busWebSocket: null,
        busWebSocketData: {
          action: "third_spat",
        },
        smartBus:null,
        busItem:null,
        busDialog:false,
        smartBusData:[], //初始化
        lightData: {}, //格式化
      }
    },
    methods: {
      initBusWebSocket() {
        if ("WebSocket" in window) {
          this.busWebSocket = new WebSocket(window.config.socketUrl); //获得WebSocket对象
        }
        this.busWebSocket.onmessage = this.onBusMessage;
        this.busWebSocket.onclose = this.onBusClose;
        this.busWebSocket.onopen = this.onBusOpen;
        this.busWebSocket.onerror = this.onBusError;
      },
      onBusMessage(mesasge) {
        let _data = JSON.parse(mesasge.data).data;
        for(var key in _data){
          if(this.lightData[key]) {
            this.$set(this.lightData[key], 'light', _data[key].light);
            this.$set(this.lightData[key], 'likelyTime', _data[key].likelyTime);
          }
        }
        this.smartBusData.forEach((item, index) => {
          let _first=true;
          if(item.subItem&&item.subItem.length) {
            item.subItem.forEach(subItem1=>{
                 if(_first){
                   let _id=item.id+'_'+subItem1.phaseId;
                    for(var key in this.lightData){
                      if(_id==key){
                        if(this.lightData[key].light){
                          subItem1.light = this.lightData[key].light;
                           _first=false;
                        }
                      }
                    }
                 }
            })
          }
        });
        this.setMassMarker(this.smartBusData,"smartBus")
      },
      onBusClose(data) {
      },
      onBusError(data) {
        console.log("连接错误");
      },
      onBusOpen(data) {
        var _traffic = JSON.stringify(this.busWebSocketData);
        this.busSendMsg(_traffic);
      },
      busSendMsg(msg) {
        if (window.WebSocket) {
          if (this.busWebSocket.readyState == WebSocket.OPEN) {
            //如果WebSocket是打开状态
            this.busWebSocket.send(msg); //send()发送消息
          }
        } else {
          return;
        }
      },
      getMarkers(item) {
        var disParams=[];
        if(item.id==0){
          disParams.push(2);
          this.getDevDis(disParams);
        }else{
          item.isActive=!item.isActive;
          //当选中后才进行请求
          if(item.isActive){
            if(item.id=='smartBus'){
              this.tpSignalLight('smartBus');
            }else{
              disParams.push(item.id);
              this.getDevDis(disParams);
            }
          }else{
            /*var index = this.disParams.indexOf(item.id);
            if (index > -1) {
              this.disParams.splice(index, 1);*/
              //取消选中，将设备从地图中消除
              this.removeDevice(item.id);
            }
          }
      },
      getDevDis(disParams){
        getDevDis({
          'devTypes': disParams,
        }).then(res => {
          // console.log("长度-----"+res.data.length)
          this.deviceMap(res.data);
        });
      },
      tpSignalLight(disParam){
        tpSignalLight({}).then(res => {
          if(res.data && res.data.length) {
            this.rwDisMap(res.data,disParam);
            this.initBusWebSocket();
          }
        });
      },
      rwDisMap(resultData,disParam){    
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
                      //智慧公交
                      if(disParam=='smartBus'){ 
                        posotionData.push({
                          lnglat: subItem.position,
                          id: subItem.lightId,
                          style: subIndex,
                          crossingName:subItem.crossingName,
                          subItem: subItem.tpPhaseList
                        });
                      }
                      //绘制完后，重新设置
                      if(subIndex==resultData.length-1){     
                        _this.count=0;
                      }
                    })
                }
            })
            if(disParam=='smartBus'){ 
              this.lightData = {};
              this.smartBusData=posotionData;
              this.smartBusData.forEach(item => {
                if(item.subItem && item.subItem.length) {
                  item.subItem.forEach(subItem => {
                    let _id = item.id+'_'+subItem.phaseId;
                    if(!this.lightData[_id]) {
                      let _item = {
                        lightId: item.id, 
                        phaseId: subItem.phaseId, 
                        light: '', 
                        likelyTime:''
                      };
                      this.$set(this.lightData, _id, _item);
                    }
                  });
                }
              });
            }
            this.setMassMarker(posotionData,disParam);    
          }
        }
      },
      deviceMap(data){
        var _this = this;
        if(_this.count==0){
          if(data.length>0) {
            var resultData=[];
            data.forEach(item=>{
              let option;
              if(item.longitude|| item.latitude){
                option={
                  position:new AMap.LngLat(item.longitude, item.latitude),
                  type:item.type,
                  deviceId:item.deviceId,
                  path:item.path,
                  longitude:item.longitude,
                  latitude:item.latitude,
                  title:item.devName
                }
                resultData.push(option);
              }
            });
            //转成高德地图的坐标
            resultData.forEach((item, index, arr)=>{
             /* AMap.convertFrom(resultData[index].position, 'gps', function (status, result){
                if (result.info === 'ok') {
                  let _point = result.locations[0];
                  resultData[index].position = _point;*/
              resultData[index].position = ConvertCoord.wgs84togcj02(item.longitude, item.latitude);
                  _this.count ++;
                  if(_this.count == arr.length) {
                    //绘制线的轨迹
                    resultData.forEach(function (subItem,subIndex) {
                      if(subItem.type==1){
                        var marker = new AMap.Marker({
                          position: subItem.position,
                          icon: 'static/images/sideDevice/1.png', // 添加 Icon 图标 URL
                          offset:new AMap.Pixel(-15, -15)
                        });
                        _this.map.add(marker);
                        _this.lightList.push(marker)
                      }
                      //路侧点
                      if(subItem.type==2){
                        var marker = new AMap.Marker({
                          position: subItem.position,
                          icon: 'static/images/sideDevice/3.png', // 添加 Icon 图标 URL
                          offset:new AMap.Pixel(-15, -15),
                          title:subItem.title
                        });
                        _this.map.add(marker);
                        var item={
                          path:subItem.path,
                          roadSiderId:subItem.deviceId,
                          camSerialNum:"",
                          target:'map'
                        }
                        marker.on('click', function(e) {
                          _this.$parent.$emit("sideEvent",item,'map');
                        });
                        _this.sideList.push(marker)
                      }
                      //rcu
                      if(subItem.type==3){
                        var marker = new AMap.Marker({
                          position: subItem.position,
                          icon: 'static/images/sideDevice/2.png', // 添加 Icon 图标 URL
                          offset:new AMap.Pixel(-15, -15)

                        });
                        _this.map.add(marker);
                        _this.rcuList.push(marker)
                      }
                      //绘制完后，重新设置
                      if(subIndex==resultData.length-1){
                        _this.map.setFitView();
//                        console.log("zoom===="+_this.map.getZoom())
                        _this.map.setZoom(_this.map.getZoom()-2);
                        _this.count=0;
//                        console.log("zoom1===="+_this.map.getZoom())
                      }
                    })
                  }
                /*}
              });*/
            })
          }
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
       if(disParam =='smartBus'){ 
          anchorMass =  new AMap.Pixel(5,13);
          sizeMass = new AMap.Size(10,26);
          massNum="smartBus";
          data.map(item => {
              makerUrl='./static/images/smartlight/noLight.png';
              if(item.subItem&&item.subItem.length>0){
                item.subItem.forEach(subItem=>{
                  if(subItem.light) {
                    let _color = subItem.light.toLowerCase();
                    makerUrl='./static/images/smartlight/'+_color+'Light.png';
                  }else {
                    return ''
                  }
                })
              }
              style.push({
                url: makerUrl,
                anchor: anchorMass,
                size: sizeMass
              });      
          });
        }
        if(massNum == "smartBus" && this.smartBus){ 
            this.smartBus.setStyle(style);
            this.smartBus.setData(data);
            this.smartBus.on('click', function(e) {
              _this.busDialog=true;
              _this.busItem=e.data;
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
               if(disParam == "smartBus"){
                this[massNum].on('click', function(e) {
                    _this.busDialog=true;
                    _this.busItem=e.data;
                });  
              }
            }else {
              this[massNum].show();
            }
        }
      },
      removeDevice(type){
        if(type==1&&this.lightList.length>0){
          this.map.remove(this.lightList);
          this.lightList=[];
        }
        if(type==3&&this.rcuList.length>0){
          this.map.remove(this.rcuList);
          this.rcuList=[];
        }
        if(type==2&&this.sideList.length>0){
          this.map.remove(this.sideList);
          this.sideList=[];
        }
        if(type=='smartBus'&& this.smartBus){
          this.busWebSocket&&this.busWebSocket.close();  
          this.smartBus.clear();
          this.map.remove(this.smartBus);
          this.smartBus=null;
        }
      },
      closeDialog(){
        this.busDialog=false;
      },
    },
    mounted() {
      this.map = new AMap.Map(this.id, window.defaultMapOption);
      setTimeout(()=>{
          this.map.setMapStyle(window.defaultMapOption.mapStyle);
      },0);
      var item = {
        'id':'0'
      };
      this.getMarkers(item);
    }
  }
</script>

