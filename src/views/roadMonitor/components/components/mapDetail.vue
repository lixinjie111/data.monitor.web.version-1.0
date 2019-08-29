<template>
  <div>
      <div :id="id" class="c-map-style"></div>
  </div>
</template>
<script>
  import {typeCross} from '@/api/roadMonitor'
  import ConvertCoord from '@/assets/js/utils/coordConvert.js'
    export default {
      props:['id','reqData'],
      data() {
          return {
            cross:{},
            map:{},
            webSocket:{},
            mapList:[],
            count:0,
          }
      },
      computed: {
        mapData(){
          return this.reqData;
        }
      },
      mounted() {  
        let _option = Object.assign(
          {},
          window.defaultMapOption,
          {
            center: window.mapOption.defaultCenterPoint,
            zoom: 18,
            mapStyle:window.mapOption.mapStyleEmpty
          }
        );
        this.map = new AMap.Map(this.id, _option);
        this.getTypeCross();
      },
      methods: {
        getTypeCross(){
            let baseData = this.mapData.baseData;
            let position;
            if(baseData.x && baseData.y) {
              position = new AMap.LngLat(baseData.x,baseData.y);
              this.map.setCenter(position);
            }
//                position = ConvertCoord.wgs84togcj02(baseData.x,baseData.y);
              let _optionWms = Object.assign(
                  {},
                  window.dlWmsDefaultOption,
                  {
                      params:{'LAYERS': window.dlWmsOption.LAYERS_gjlk, 'VERSION': window.dlWmsOption.VERSION}
                  }
              );

              let _wms  = new AMap.TileLayer.WMS(_optionWms);
              _wms.setMap(this.map);

              this.cross = this.mapData;
              this.initWebSocket();
        },
        initWebSocket(){
          let _this=this;
          if ('WebSocket' in window) {
            _this.webSocket = new WebSocket(window.config.websocketUrl);  //获得WebSocket对象
          }
          _this.webSocket.onmessage = _this.onmessage;
          _this.webSocket.onclose = _this.onclose;
          _this.webSocket.onopen = _this.onopen;
          _this.webSocket.onerror = _this.onerror;
        },
        onmessage(mesasge){
          let _this=this;
          let json = JSON.parse(mesasge.data);
          let result = json.result.vehData;
          let position;
          if(_this.count==0){
            //在接受请求前清除地图上的点
            _this.map.remove(_this.mapList);
            _this.mapList=[];
            result.forEach(item =>{
              position = new AMap.LngLat(item.longitude,item.latitude);
//                position = ConvertCoord.wgs84togcj02(item.longitude,item.latitude);
              _this.count++;
              let marker = new AMap.Marker({
                position: position,
                icon: 'static/images/road/car.png', // 添加 Icon 图标 URL
                angle: item.heading,
                offset:new AMap.Pixel(-8, -16)
              });
              _this.map.add(marker);
              _this.mapList.push(marker);

            });
            if(this.count==result.length){
              _this.count=0;
            }
          }
        },
        onclose(data){
          console.log("结束连接");
        },
        onopen(data){
          //获取在驶车辆状态
          let _params = {
            'action':'cross_real_data',
            'token':'tusvn',
            'crossId':this.cross.crossId
          }
          let _paramsMsg = JSON.stringify(_params);
          this.sendMsg(_paramsMsg);
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
      },
      destroyed(){
        //销毁Socket
        this.webSocket&&this.webSocket.close();
      }
    }
</script>

