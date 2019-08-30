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
            crossData: {
              roadSenseCars: [], // 车辆数据
              finalFourPosition: [],
              sideVehicleObj: {}, // 地图上画车辆
              sideLight: {} //
            },
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
              this.getFourPosition();
        },
        // 获取四周的经纬度
        getFourPosition(mapOption) {
          let finalFourPosition = [];
          let bounds;
          let northEast = [];
          let southWest = [];
          let northWest = [];
          let southEast = [];
          let southwest;
          let northeast;
          let x = 0.0005;
          let y = 0.0003;
          bounds = this.map.getBounds();
          // 西南
          southWest.push(bounds.southwest.lng - x);
          southWest.push(bounds.southwest.lat - y);
          finalFourPosition.push(southWest);
          // 西北
          northWest.push(bounds.southwest.lng - x);
          northWest.push(bounds.northeast.lat + y);
          finalFourPosition.push(northWest);
          // 东北
          northEast.push(bounds.northeast.lng + x);
          northEast.push(bounds.northeast.lat + y);
          finalFourPosition.push(northEast);
          // 东南
          southEast.push(bounds.northeast.lng + x);
          southEast.push(bounds.southwest.lat - y);
          finalFourPosition.push(southEast);
          southwest = [bounds.southwest.lng, bounds.southwest.lat];
          northeast = [bounds.northeast.lng, bounds.northeast.lat];
          //   let mapBounds = new AMap.Bounds(southWest, northEast);
          //   let rectangle = new AMap.Rectangle({
          //     bounds: mapBounds,
          //     strokeColor: "red",
          //     strokeWeight: 6,
          //     strokeOpacity: 0.5,
          //     strokeDasharray: [30, 10],
          //     // strokeStyle还支持 solid
          //     strokeStyle: "dashed",
          //     fillColor: "green",
          //     fillOpacity: 0.5,
          //     cursor: "pointer",
          //     zIndex: 50
          //   });
          //   rectangle.setMap(this.aMap);
          //   this.aMap.setFitView([rectangle]);
          this.crossData.finalFourPosition = finalFourPosition;  
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
          // let _this=this;
          // let json = JSON.parse(mesasge.data);
          // let result = json.result.vehData;
          // let position;
          let _this = this;
          let jsonData = JSON.parse(message.data);
          let result = jsonData.result;
          // 车辆
                if ("vehDataDTO" in result === true) {
                   _this.crossData.roadSenseCars = result.vehDataDTO;
                  if (_this.crossData.roadSenseCars.length > 0) {
                    _this.crossData.roadSenseCars = _this.crossData.roadSenseCars.filter(
                      x => x.targetType === 2 || x.targetType === 5
                    );
                    let _filterData = {};
                    _this.crossData.roadSenseCars.forEach((item, index) => {
                      _filterData[item.vehicleId] = {
                        longitude: item.longitude,
                        latitude: item.latitude,
                        heading: item.heading,
                        speed: item.speed,
                        vehicleId: item.vehicleId,
                        devId: item.devId,
                        marker: null,
                      };
                    });
                    

                    for (let id in _this.crossData.sideVehicleObj) {
                      if(_filterData[id]) {   //表示有该点，做setPosition
                        _filterData[id].marker = _this.crossData.sideVehicleObj[id].marker;
                        let _currentCar = _filterData[id];
                        _filterData[id].marker.setAngle(_currentCar.heading);
                        _filterData[id].marker.moveTo([_currentCar.longitude, _currentCar.latitude], _currentCar.speed);
                      }else {   //表示没有该点，做remove
                        _this.aMap.remove(_this.crossData.sideVehicleObj[id].marker);
                      }
                    }
                    for (let id in _filterData) {
                      if(!_this.crossData.sideVehicleObj[id]) {   //表示新增该点，做add
                          _filterData[id].marker = new AMap.Marker({
                            position: [_filterData[id].longitude, _filterData[id].latitude],
                            map: _this.map,
                            icon: "static/images/road/car.png",
                            angle: _filterData[id].heading,
                            devId: _filterData[id].devId,
                            // offset: new AMap.Pixel(-15, -10),
                            zIndex: 1
                          });
                          _this.map.add(
                            _filterData[id].marker
                          );
                      }
                    }
                    _this.crossData.sideVehicleObj = _filterData;
                  } else {
                    // 返回的数据为空
                    for (let id in _this.crossData.sideVehicleObj) {
                      _this.map.remove(_this.crossData.sideVehicleObj[id].marker);
                    }
                    _this.crossData.sideVehicleObj = {};
                  }
                }
          //  if(_this.count==0){
//             //在接受请求前清除地图上的点
//             _this.map.remove(_this.mapList);
//             _this.mapList=[];
//             result.forEach(item =>{
//               position = new AMap.LngLat(item.longitude,item.latitude);
// //                position = ConvertCoord.wgs84togcj02(item.longitude,item.latitude);
//               _this.count++;
//               let marker = new AMap.Marker({
//                 position: position,
//                 icon: 'static/images/road/car.png', // 添加 Icon 图标 URL
//                 angle: item.heading,
//                 offset:new AMap.Pixel(-8, -16)
//               });
//               _this.map.add(marker);
//               _this.mapList.push(marker);

//             });
//             if(this.count==result.length){
//               _this.count=0;
//             }
//           }
        },
        onclose(data){
          console.log("结束连接");
        },
        onopen(data){
          //获取在驶车辆状态
          // let _params = {
          //   'action':'cross_real_data',
          //   'token':'tusvn',
          //   'crossId':this.cross.crossId
          // }
          let _params = {
            action: "road_real_data",
            data: {
              polygon: this.crossData.finalFourPosition,
              fuselType: 1
            }
          };
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

