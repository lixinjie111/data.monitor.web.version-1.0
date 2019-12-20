<template>
  <div>
      <div :id="id" class="c-map-style"></div>
  </div>
</template>
<script>
  import {typeCross} from '@/api/roadMonitor'
  import ConvertCoord from '@/assets/js/utils/coordConvert.js'
  import WebSocketObj from '@/assets/js/utils/webSocket.js'
    export default {
      props:['id','reqData'],
      data() {
          return {
            cross:{},
            map:{},
            webSocket:null,
            mapList:[],
            count:0,
            crossData: {
              roadSenseCars: [], // 车辆数据
              finalFourPosition: [],
              sideVehicleObj: {}, // 地图上画车辆
              sideLight: {} //
            },
            prevData: {},
            timeOut:1000*60*5
          }
      },
      computed: {
        mapData(){
          return this.reqData;
        }
      },
      watch:{
        "crossData.finalFourPosition"(newVal, oldVal) {
            // console.log("finalFourPosition");
            if(this.webSocket) {
              this.webSocket.onOpen();
            }else {
              this.initWebSocket();
            }
        }
      },
      mounted() {  
        let _option = {
          center: window.mapOption.defaultCenterPoint,
          zoom: 18,
          mapStyle: window.mapOption.mapStyleEmpty,
          // dragEnable: false,
          // zoomEnable:  false,
          resizeEnable: true, //是否监控地图容器尺寸变化
          rotateEnable: true,
        };
        this.map = new AMap.Map(this.id, _option);
        setTimeout(()=>{
              this.map.setMapStyle(window.mapOption.mapStyleEmpty);
        },0);
        this.getTypeCross();
        this.map.on('moveend', this.getFourPosition);
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
        getFourPosition() {
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
          // this.initWebSocket();
        },
        initWebSocket(){
          let _params = {
              "action": "vehicle",
              "body": {
                  "polygon": this.crossData.finalFourPosition,
              },
              "type": 3
          };
          this.webSocket = new WebSocketObj(this, window.config.socketUrl, _params, this.onmessage);
        },
        onmessage(message){
          let _this = this;
          let jsonData = JSON.parse(message.data);
          let result = jsonData.result;
          // 车辆
          if (result.data) {
            for (const k in  result.data) {        
                  _this.crossData.roadSenseCars = result.data[k];
                 if (_this.crossData.roadSenseCars.length > 0) {
                    _this.crossData.roadSenseCars = _this.crossData.roadSenseCars.filter(
                      x => x.targetType === 2 || x.targetType === 5
                    );
                    let _filterData = {};
                    let maxGpsTime = 0;
                    let fiterData;      
                    _this.crossData.roadSenseCars.map(item=>{
                      if(item.gpsTime > maxGpsTime){
                        maxGpsTime = item.gpsTime;
                        _filterData = {
                          longitude: item.longitude,
                          latitude: item.latitude,
                          heading: item.heading,
                          speed: item.speed,
                          vehicleId: item.vehicleId,
                          devId: item.devId,
                          marker: null,
                          timer:null,
                        };
                      }
                    })
                        
                    for (let id in _this.prevData) {
                      if(_filterData.vehicleId == id) {   //表示有该点，做move
                        clearTimeout(_this.prevData[_filterData.vehicleId].timer)
                        _filterData.marker = _this.prevData[id].marker;
                        let _currentCar = _filterData;
                        _filterData.marker.setAngle(_currentCar.heading);
                        // _filterData[id].marker.moveTo([_currentCar.longitude, _currentCar.latitude], _currentCar.speed);
                        _filterData.marker.setPosition([_currentCar.longitude, _currentCar.latitude]);
                      } 
                      // else {   //表示没有该点，做remove
                      //   // _this.prevData[id].marker.stopMove();
                      //   _this.map.remove(_this.prevData[id].marker);
                      //   delete _this.prevData[id];
                      // }
                    }
      
                    if(!_this.prevData[_filterData.vehicleId]) {   //表示新增该点，做add
                        _filterData.marker = new AMap.Marker({
                          position: [_filterData.longitude, _filterData.latitude],
                          map: _this.map,
                          icon: "static/images/road/car.png",
                          angle: _filterData.heading,
                          devId: _filterData.devId,
                          zIndex: 1
                        });
                    }
            
                    _this.prevData[_filterData.vehicleId] = _filterData;
                    _this.prevData[_filterData.vehicleId].timer = setTimeout(() => {
                      _this.map.remove(_this.prevData[_filterData.vehicleId].marker);
                      delete _this.prevData[_filterData.vehicleId];
                    }, this.timeOut);

                 }
            }
          }
        }
      },
      destroyed(){
        //销毁Socket
        this.webSocket&&this.webSocket.webSocket.close();
      }
    }
</script>

