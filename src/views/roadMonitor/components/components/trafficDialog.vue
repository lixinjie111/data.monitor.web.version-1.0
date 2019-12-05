<template>
  <div class="c-dialog-wrapper">
    <div class="c-dialog-container">
      <div class="c-dialog-header">
        <span class="c-dialog-title">交通事件</span>
        <i class="c-dialog-close" @click="closeDialog"></i>
      </div>
      <div class="c-dialog-content m-side-dialog-content">
        <div class="side-device-left">
          <div class="c-scroll-wrap">
            <div class="c-scroll-inner">
              <div class="side-device-detail clearfix">
                <span class="side-device-label">事件类型：</span>
                <span class="device-detail-style">{{itemData.eventName || '--'}}</span>
              </div>
              <div class="side-device-detail clearfix">
                <span class="side-device-label">发生时间：</span>
                <span
                  class="device-detail-style"
                >{{itemData.beginTime?$dateUtil.formatTime(Number(itemData.beginTime)) : '--'}}</span>
              </div>
              <div class="side-device-detail clearfix">
                <span class="side-device-label">发生地点：</span>
                <span
                  class="device-detail-style"
                >{{itemData.longitude || '--'}} , {{itemData.latitude || '--'}}</span>
              </div>
              <div class="side-device-detail clearfix">
                <span class="side-device-label">道路名称：</span>
                <span class="device-detail-style">{{itemData.roadName || '--'}}</span>
              </div>
            </div>
          </div>
        </div>
        <!-- <div class="side-dialog-map">
          <div style="width: 100%;height: 100%;">
            <div style="width: 100%;height: 100%;" v-if="sideMap"> -->
              <!-- <div class="time-style">
              <span class="t-class">{{time}}</span>
              </div>-->
              <!-- <tusvn-map
                :target-id="deviceMapId"
                ref="tusvnMap3"
                :background="mapParam.background"
                :minX="mapParam.minX"
                :minY="mapParam.minY"
                :minZ="mapParam.minZ"
                :maxX="mapParam.maxX"
                :maxY="mapParam.maxY"
                :maxZ="mapParam.maxZ"
                @mapcomplete="mapcomplete"
                @showTimeStamp="showTimeStamp"
      				  :waitingtime='50'
              ></tusvn-map> -->

              <!-- <div id="cesiumContainer" class="c-map">

              </div>
            </div>
            <div v-else class="side-map-tip side-tip-style">{{mapMessage}}</div>
          </div>
        </div> -->
        <div id="cesiumContainer" class="side-dialog-map"></div>
        <div class="side-device-list">
          <div class="c-scroll-wrap">
            <div class="c-scroll-inner">
              <p class="side-device-title">设备列表</p>
              <div class="device-list-style">
                <div class="table-header-group">
                  <ul class="table-row">
                    <li class="table-cell table-title device-num" style="text-align: center">设备编号</li>
                    <li class="table-cell table-title device-style">联网状态</li>
                    <li class="table-cell table-title device-style">开启监控</li>
                  </ul>
                </div>
                <div class="table-row-group">
                  <ul class="table-row" v-for="item in deviceObj" :key="item.deviceId">
                    <li class="table-cell device-num">
                      <img
                        src="@/assets/images/monitorManage/monitor-3.png"
                        class="monitor-device-img-1"
                        v-if="item.type=='N'"
                      />
                      <img
                        src="@/assets/images/monitorManage/monitor-4.png"
                        class="monitor-device-img-2"
                        v-else
                      />
                      <span class="monitor-device-text">{{item.deviceId}}</span>
                    </li>
                    <li class="table-cell">
                      <span
                        class="monitor-device-symbol"
                        :class="[item.cameraRunStatus==1?'online':'offline']"
                      ></span>
                    </li>
                    <li class="table-cell">
                      <div
                        class="c-switch-style"
                        :class="[item.value?active:unActive]"
                        @click="switchChange(item)"
                        v-show="item.type=='N'"
                      >
                        <i></i>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              <p class="side-device-title">
                <span>监控视频</span>
              </p>
              <div class="device-video-style">
                <div class="side-video-style">
                  <live-player
                          :isStretch="true"
                          :requestVideoUrl="wsUrl"
                          :params="forwardParam"
                          type="wsUrl"
                          :autoplay="false"
                          ref="player"
                  >
                  <span class="title">智能摄像头：{{deviceId}}</span>
                  </live-player>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {
  getDeviceList,
  getVideoByNum,
  getSideTree,
  getDevListByRoadId,
  getDeviceCountByCity
} from "@/api/sideDeviceMonitor";
import { getFeaturesByPoint } from "@/api/roadMonitor";
import ConvertCoord from "@/assets/js/utils/coordConvert.js";
import LivePlayer from '@/components/livePlayer/template';
const isProduction = process.env.NODE_ENV === "production";

import GIS3D from '@/utils/GIS3D.js'
import PerceptionCars from '@/utils/PerceptionCars.js'
let gis3d=new GIS3D();
let perceptionCars = new PerceptionCars();

export default {
  name: "SideDialog",
  data() {
    return {
      mapParam:window.mapParam,
      webSocket: null,
      webSocketData: {
        action: "event_detail_data",
        token: "tusvn",
        taskCode: ""
      },
      currentExtent: [],
      carData: null,
      webSocket1: null, //交通事件车辆
      platformWebsocket: null, //平台车
      perceptionWebsocket: null, //感知车
      perceptionCar: "",
      webSocketData1: {},
      itemData: {},
      deviceList: [],
      deviceId: "",
      active: "active",
      unActive: "close-active",
      openVideoList: [],
      time: "",
      serialNum: "",
      sideMap: true,
      mapMessage: "该路口没有数据，请稍候再试！",
      cameraParam: null,
      deviceMapId: "deviceMap1",
      deviceObj: {},
      isFirst: true,
      isOne: true,
      heading: "", //航向角
      position: [],
      wsUrl:"",
      forwardParam:{},
      platformConnectCount:0,
      mapOk:false,
    };
  },
  components: {
    LivePlayer
  },
  props: ["selectedItem"],
  created() {
    this.webSocketData.taskCode = this.selectedItem.taskCode;
    this.serialNum = this.selectedItem.cameraId; //点击进来的设备编号
    this.getExtend(
      this.selectedItem.longitude,
      this.selectedItem.latitude,
      0.002
    );
  },
  mounted() {
      let _this = this;
      gis3d.initload("cesiumContainer",false);
      perceptionCars.viewer=gis3d.cesium.viewer;

      _this.mapParam=window.mapParam;
      _this.rsId = _this.$route.params.crossId;
    
      this.mapOk = true;
      this.onMapComplete();
  },
  watch: {
    deviceList: {
      handler: function(newVal, oldVal) {
        if(this.mapOk){
           if (oldVal.length > 0 && newVal.length > 0) {
            //大于一次的
            this.compare(newVal, oldVal);
          } else if (newVal.length <= 0) {
            //返回空列表
            this.handleData(newVal);
          } else {
            //第一次
            this.handleData(newVal);
          }
        }
       
      },
      deep: true
    }
  },
  methods: {
    compare(newArr, oldArr) {
      let newData = []; //新增的数据
      let sameData = []; //相同的数据
      let sameIdData = []; //更新的数据
      let arrData = [];
      for (let i = 0; i < newArr.length; i++) {
        let newId = newArr[i].deviceId;
        let newCameraRunStatus = newArr[i].cameraRunStatus;
        let isExist = false;
        for (let j = 0; j < oldArr.length; j++) {
          let oldId = oldArr[j].deviceId;
          let oldCameraRunStatus = newArr[i].cameraRunStatus;
          if (newId == oldId) {
            //存在id一样的数据
            isExist = true;
            arrData.push(oldArr[j]);
            if (newCameraRunStatus == oldCameraRunStatus) {
              //存在id一样;在线状态相同的的数据
              sameData.push(oldArr[j]);
            } else {
              //存在id一样状态不同的数据;更新的数据
              sameIdData.push(oldArr[j]);
            }
          }
        }
        if (!isExist) {
          //新增的数据
          newData.push(newArr[i]);
        }
      }
      let set = arrData.map(item => item.deviceId);
      let delData = oldArr.filter(item => !set.includes(item.deviceId)); //删除的数据
      this.handleData(newData, "traffic", "newData");
      this.handleData(sameIdData, "traffic", "sameIdData");
      this.handleData(delData, "traffic", "delData");
    },
    handleData(resultData, type) {
      resultData.forEach(item => {
        if (type == "delData") {
          for (var i in this.deviceObj) {
            if (i == item.deviceId) {
              if (item.value) {
                //如果切换的按钮是正在播放状态，先清除视频源，后删除
                this.wsUrl = "";
                this.$refs['player'].initVideo();
              }
              delete this.deviceObj[i];
            }
          }
        } else if (this.deviceObj[item.deviceId]) {
          //已经存在的数据需要更新
          this.deviceObj[item.deviceId].cameraRunStatus = item.cameraRunStatus;
        } else {
          //不存在设备id,需要添加的
          this.deviceObj[item.deviceId] = item;
        }
      });
    
      let selectFlag = false;
      for (var i in this.deviceObj) {
        let item = this.deviceObj[i];
        if (this.isFirst) {
          if (item.type == "N" && item.cameraRunStatus == 1) {
            item.value = false;
            if (item.serialNum == this.selectedItem.cameraId) {
              this.isFirst = false;
              //设置默认的选中值
              this.deviceId = item.deviceId;
              item.value = true;
              this.openVideoList.push(item);
              this.getVideo();
              this.cameraParam = JSON.parse(item.cameraParam);
            }
          } else {
            item.value = false;
          }
          if(item.value == true){
            selectFlag = true;
          }
        }
      }
      if(!selectFlag && this.deviceObj && this.isFirst){
        for (var i in this.deviceObj) {
            this.switchChange(this.deviceObj[i])
            return;
        }  
      }
     
      if (this.mapOk) {
        if (this.isOne) {
          this.isOne = false;
          if (this.selectedItem.cameraId) {
            if (this.cameraParam) {
              gis3d.updateCameraPosition(
                this.cameraParam.x,
                this.cameraParam.y,
                this.cameraParam.z,
                this.cameraParam.radius,
                this.cameraParam.pitch,
                this.cameraParam.yaw
              );
            } else {
              this.updateCameraPosition();
            }
          } else {
            this.updateCameraPosition();
          }
          let formData = new FormData(); //创建form对象
          formData.append("featureclass", "dl_shcsq_wgs84_lb_points");
          formData.append("lng", this.selectedItem.longitude); //通过append向form对象添加数据
          formData.append("lat", this.selectedItem.latitude); //通过append向form对象添加数据
          formData.append("distance", 10); //  附近5米
          formData.append("limit", 1); // 查找的附近的道路条数
          let config = {
            headers: {
              Accept: "*/*",
              "Content-Type": "application/x-www-form-urlencoded"
            }
          };
          //获取航向角
          getFeaturesByPoint(formData, config).then(res => {
            if (res.state == 1) {
              if(res.data.length>1){
                 this.heading = res.data[0].heading;
              }
              if (!this.cameraParam) {
                this.updateCameraPosition();
              }
              let _length = this.itemData.modelIcon.split("/").length;
              let _name = this.itemData.modelIcon.split("/")[_length - 1];
              let _url = "./static/map3d/traffic_models/" + _name;

              _url = "./static/map3d/model/zhui_tong.glb";
              // gis3d.addModel(
              //   _name,
              //   _url,
              //   this.position[0],
              //   this.position[1],
              //   0
              // );
              gis3d.addModeCar({
                longitude:this.position[0],
                latitude:this.position[1],
                heading:0,
                vehicleId:""
              },
              _name,
              "zhui_tong"
              );
            }
          });
          } else {
       
        }
      }
    },
    getHeading: function(heading) {
      //导航角度转换为3D角度
      if (heading > 180) {
        return (heading = -(Math.PI / 180.0) * (heading - 180));
      } else {
        return (heading = -(Math.PI / 180.0) * heading);
      }
    },
    updateCameraPosition() {
      
      if(!this.position.length){
        this.position = [112.94760914128275, 28.325093927226323]
      }
    
      if (this.heading) {
        gis3d.updateCameraPosition(
          this.position[0],
          this.position[1],
          39,
          70,
          -0.2369132859032279,
          (Math.PI / 180.0) * (this.heading+25)
        );
      } else {
        gis3d.updateCameraPosition(
          this.position[0],
          this.position[1],
          39,
          70,
          -0.2369132859032279,
          0.0029627735803421373
        );
      }
    },
    initWebSocket() {
      if ("WebSocket" in window) {
        // this.webSocket = new WebSocket(window.config.websocketUrl); //获得WebSocket对象
        this.webSocket = new WebSocket(window.config.socketTestUrl); //获得WebSocket对象
      }
      this.webSocket.onmessage = this.onmessage;
      this.webSocket.onclose = this.onclose;
      this.webSocket.onopen = this.onopen;
      this.webSocket.onerror = this.onerror;
    },
    onmessage(message) {
      //console.log(JSON.parse(message.data))
	  this.itemData = JSON.parse(message.data).result.data;
	  this.getExtend(
      this.itemData.longitude,
      this.itemData.latitude,
      0.002
	  );
      this.position = [this.itemData.longitude,this.itemData.latitude];
      let list = JSON.parse(message.data).result.deviceList;
      if (list) {
        this.deviceList = JSON.parse(message.data).result.deviceList;
      } else {
        this.deviceList = [];
      }
    },
    onclose(data) {
      console.log("结束连接");
    },
    onopen(data) {
      var _traffic = JSON.stringify(this.webSocketData);
      this.sendMsg(_traffic);
    },
    sendMsg(msg) {
      if (window.WebSocket) {
        if (this.webSocket.readyState == WebSocket.OPEN) {
          //如果WebSocket是打开状态
          this.webSocket.send(msg); //send()发送消息
        }
      } else {
        return;
      }
    },
    //平台车 小汽车
  
    // initPlatformWebSocket(){
    //     let _this=this;
    //     try{
    //         if ('WebSocket' in window) {
    //             _this.platformWebsocket = new WebSocket(window.config.websocketUrl);  //获得WebSocket对象
    //             _this.platformWebsocket.onmessage = _this.onPlatformMessage;
    //             _this.platformWebsocket.onclose = _this.onPlatformClose;
    //             _this.platformWebsocket.onopen = _this.onPlatformOpen;
    //             _this.platformWebsocket.onerror=_this.onPlatformError;
    //         }else{
    //             _this.$message("此浏览器不支持websocket");
    //         }
    //     }catch (e){
    //         this.platformReconnect();
    //     }
    // },
    // onPlatformMessage(message) {
    //   let _this=this;
    //   let json = JSON.parse(message.data);
    //   platCars.onCarMessage(json,0);

    //   let keys = Object.keys(platCars.cacheAndInterpolateDataByVid);
    //   if(keys&&keys.length>0){
    //       let key = keys[0];
    //       _this.$parent.vehData = platCars.cacheAndInterpolateDataByVid[key].data;
    //   }
    // },

    // onPlatformClose(data) {
    //   console.log("结束连接");
    //   this.platformReconnect();
    // },
    // onPlatformError(){
    //   console.log("平台车连接error");
    //   this.platformReconnect();
    // },
    // onPlatformOpen(data) {
    //   //旁车
    //   var platform = {
    //     action: "road_real_data_reg",
    //     data: {
    //       polygon: this.currentExtent
    //     }
    //   };
    //   var platformMsg = JSON.stringify(platform);
    //   this.sendPlatformMsg(platformMsg);
    // },
    // sendPlatformMsg(msg) {
    //   let _this = this;
    //   if (window.WebSocket) {
    //     if (_this.platformWebsocket.readyState == WebSocket.OPEN) {
    //       //如果WebSocket是打开状态
    //       _this.platformWebsocket.send(msg); //send()发送消息
    //     }
    //   } else {
    //     return;
    //   }
    // },
    //感知车
    initPerceptionWebSocket(){
        let _this=this;
        try{
            if ('WebSocket' in window) {
                _this.perceptionWebsocket = new WebSocket(window.config.socketTestUrl);  //获得WebSocket对象
                _this.perceptionWebsocket.onmessage = _this.onPerceptionMessage;
                _this.perceptionWebsocket.onclose = _this.onPerceptionClose;
                _this.perceptionWebsocket.onopen = _this.onPerceptionOpen;
                _this.perceptionWebsocket.onerror= _this.onPerceptionError;
            }else{
                _this.$message("此浏览器不支持websocket");
            }
        }catch (e){
            this.perceptionReconnect();
        }

    },
    onPerceptionMessage(mesasge){
        let _this=this;
        let data = JSON.parse(mesasge.data)
        _this.processPerData(data);
    },
    onPerceptionClose(data) {
      console.log("结束连接");
    },
    onPerceptionError(){
        console.log("感知车连接error");
        this.perceptionReconnect();
    },
    onPerceptionOpen(data) {
      //旁车
      // var perception = {
      //   action: "road_real_data_per",
      //   data: {
      //     polygon: this.currentExtent
      //   }
      // };
      // var perceptionMsg = JSON.stringify(perception);
      // this.sendPerceptionMsg(perceptionMsg);

      var perception = {
      action:"road_real_data_per",
      data:{
          type:1,
          polygon:[[121.17403069999999,31.2836193],[121.1760307,31.2836193],[121.1760307,31.2816193],[121.17403069999999,31.2816193]]
          }
      }
      var perceptionMsg = JSON.stringify(perception);
      this.sendPerceptionMsg(perceptionMsg);
    },
    processPerData(data){
        let _this = this;
        let maxGpsTime = 0;
        let fiterData;
        if(data.result.perList.length){
          data.result.perList.map(item=>{
            if(item.gpsTime > maxGpsTime){
              maxGpsTime = item.gpsTime;
              fiterData = item;
            }
          })
              
        }
        perceptionCars.addPerceptionData(fiterData.data,0);
      
    },
    sendPerceptionMsg(msg) {
      let _this = this;
      if (window.WebSocket) {
        if (_this.perceptionWebsocket.readyState == WebSocket.OPEN) {
          //如果WebSocket是打开状态
          _this.perceptionWebsocket.send(msg); //send()发送消息
        }
      } else {
        return;
      }
    },
   
    coordinateTransfer(sourceProject, destinatePorject, longitude, latitude) {
      let targetCoor = proj4(sourceProject, destinatePorject, [
        longitude,
        latitude
      ]);
      return targetCoor;
    },
    getExtend(x, y, r) {
      //1度=108000米；方圆200米
      this.currentExtent = [];
      let x0 = x + r;
      let y0 = y + r;
      let x1 = x - r;
      let y1 = y - r;
      this.currentExtent.push([x1, y0]);
      this.currentExtent.push([x0, y0]);
      this.currentExtent.push([x0, y1]);
      this.currentExtent.push([x1, y1]);
    },
    switchChange(item) {
      this.isFirst = false;
      var _this = this;
      //如果设备不在线进行提示
      // if(item.cameraRunStatus != 1) {
      // 	_this.$message({
      // 		type: 'error',
      // 		duration: '1500',
      // 		message: '设备不在线',
      // 		showClose: true
      // 	});
      // 	return;
      // }
      item.value = !item.value;
      this.deviceId = item.deviceId;
      if (item.value) {
        _this.$nextTick(function() {
          _this.$set(item, "value", true);
        });
      }
      if (!item.value) {
        _this.$nextTick(function() {
          _this.$set(item, "value", false);
        });
      }
      if (item.value) {
        //如果开启一个摄像头，则将另一个开启的摄像头关闭
        _this.openVideoList.forEach(function(item1, index) {
          for (var i in _this.deviceObj) {
            let item2 = _this.deviceObj[i];
            if (item1.deviceId == item2.deviceId) {
              //                    item2.value=false;
              _this.$set(_this.deviceObj[i], "value", false);
              //将原来的删除
              _this.openVideoList.splice(index, 1);
            }
          }
        });
        _this.openVideoList.push(item);
        _this.serialNum = item.serialNum;
        //根据摄像头调取视频
        _this.getVideo();
      } else {
        _this.wsUrl = "";
        _this.$refs['player'].initVideo();
      }
    },
    closeDialog() {
      this.$emit("closeDialog");
    },
    showTimeStamp(time) {
      this.time = time;
    },
    onMapComplete(){ 
        this.updateCameraPosition(112.94760914128275, 28.325093927226323,39,70,-0.2369132859032279, 0.0029627735803421373); 
        this.getData();
      
    },
    getData(){
        this.initWebSocket();
        this.initPerceptionWebSocket();
        // this.initPlatformWebSocket();
    },
    // platformReconnect(){
    //     //实例销毁后不进行重连
    //     if(this._isDestroyed){
    //         return;
    //     }
    //     //重连不能超过10次
    //     if(this.platformConnectCount>=10){
    //         return;
    //     }
    //     this.initPlatformWebSocket();
    //     //重连不能超过5次
    //     this.platformConnectCount++;
    // },
    perceptionReconnect(){
        //实例销毁后不进行重连
        if(this._isDestroyed){
            return;
        }
        //重连不能超过10次
        if(this.perceptionConnectCount>=10){
            return;
        }
        this.initPerceptionWebSocket();
        //重连不能超过5次
        this.perceptionConnectCount++;
    },
    getVideo() {
      this.wsUrl = "";
      getVideoByNum({
        protocal: 1,
        serialNum: this.serialNum
      }).then(res => {
        this.$refs['player'].initVideo();
        if (res.status == 200) {
          this.wsUrl = res.data.wsUrl;
          setTimeout(() => {
             this.$refs["player"].requestVideo();
          }, 0);
        }
   
      });

    },
  },
  destroyed() {
    this.webSocket && this.webSocket.close();
    // this.platformWebsocket && this.platformWebsocket.close();
    this.perceptionWebsocket && this.perceptionWebsocket.close();
  }
};
</script>
<style lang="scss" scoped>
@import "@/assets/scss/dialog.scss";
.m-side-dialog-content {
  padding: 0;
  background-color: #000;
  .side-device-left {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    z-index: 2;
    padding: 20px 0 20px 20px;
    height: auto;
    width: 315px;
    line-height: 36px;
    font-size: 16px;
    background: linear-gradient(
      to right,
      rgba(0, 0, 0, 0.6) 30%,
      rgba(0, 0, 0, 0)
    );
    /* 标准的语法 */
    .side-device-detail {
      display: block !important;
      font-size: 16px !important;
      .side-device-label {
        float: left;
      }
      .device-detail-style {
        display: block;
        margin-left: 90px;
        color: #fff;
      }
    }
  }
  .side-dialog-map {
    width: 100%;
    height: 100%;
  }
  .side-device-list {
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 2;
    margin: 0;
    height: auto;
    padding: 20px 0 20px 20px;
    background: linear-gradient(
      90deg,
      rgba(0, 0, 0, 0),
      rgba(0, 0, 0, 0.5) 70%
    );
    /* 标准的语法 */
    .device-list-style {
      background-color: #000;
      .table-title {
        color: #fff;
      }
      .monitor-device-text {
        font-size: 14px;
      }
    }
    .side-device-title {
      &:first-child {
        margin-top: 0;
      }
    }
    .m-mask-title {
      color: #fff;
      font-size: 15px;
      line-height: 40px;
      padding-left: 9px;
    }
  }
}
</style>