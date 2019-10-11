<template>
  <div>
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
          <div class="side-dialog-map">
            <div style="width: 100%;height: 100%;">
              <div style="width: 100%;height: 100%;" v-if="sideMap">
                <!-- <div class="time-style">
                <span class="t-class">{{time}}</span>
                </div>-->
                <tusvn-map
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
                ></tusvn-map>
              </div>
              <div v-else class="side-map-tip side-tip-style">{{mapMessage}}</div>
            </div>
          </div>
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
                            :requestVideoUrl="flvUrl"
                            :params="forwardParam"
                            type="flvUrl"
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
import TusvnMap from "@/utils/Tusvn3DMap4";
import ConvertCoord from "@/assets/js/utils/coordConvert.js";
import LivePlayer from '@/components/livePlayer/template';
const isProduction = process.env.NODE_ENV === "production";
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
      PlatformCar: "",
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
      flvUrl:"",
      forwardParam:{},
    };
  },
  components: {
    TusvnMap,LivePlayer
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
    // this.webSocketData1 = {
    // 	"action": "fusel_event_veh",
    // 	"region": {
    // 		"longitude": this.selectedItem.longitude,
    // 		"latitude": this.selectedItem.latitude,
    // 		"taskCode": this.selectedItem.taskCode
    // 	}
    // }
  },
  mounted() {
  },
  watch: {
    deviceList: {
      handler: function(newVal, oldVal) {
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
                this.flvUrl = "";
                this.$refs['player'].initVideo();
              }
              if (item.serialNum == this.selectedItem.cameraId) {
                //如果事件源数据被要删除，先清空模型;后删除
                if (
                  this.$refs.tusvnMap3.getStaticModel(
                    this.selectedItem.cameraId
                  )
                ) {
                  this.$refs.tusvnMap3.removeStaticModel(
                    this.selectedItem.cameraId
                  );
                }
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
        }
      }
      if (this.$refs.tusvnMap3) {
        // if (this.PlatformCar) {
        //   this.$refs.tusvnMap3.onCarMessage(this.PlatformCar);
        // }
        // if (this.perceptionCar) {
        //   this.$refs.tusvnMap3.addPerceptionData(this.perceptionCar);
        // }
        if (this.isOne) {
          this.isOne = false;
          if (this.selectedItem.cameraId) {
            if (this.cameraParam) {
              this.$refs.tusvnMap3.updateCameraPosition1(
                this.cameraParam.x,
                this.cameraParam.y,
                this.cameraParam.z,
                this.cameraParam.radius,
                this.cameraParam.pitch,
                this.cameraParam.yaw
              );
              //this.updateCameraPosition();
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
              let _url = "./static/map3d/models/" + _name;
              //let _url = "./static/map3d/models/carEventModel.3ds";
              this.$refs.tusvnMap3.addStaticModel(
                this.selectedItem.cameraId,
                _url,
                this.position[0],
                this.position[1],
                20,
                0,
                0,
                (Math.PI / 180.0) * (-this.heading + 80)
              ); //添加模型
            }
          });
          //this.$refs.tusvnMap3.addModel(this.selectedItem.cameraId,this.itemData.modelIcon,this.position[0],this.position[1],13); //添加模型
          //this.$refs.tusvnMap3.addStaticModel(this.selectedItem.cameraId, "./static/map3d/models/carEventModel.3ds", this.position[0], this.position[1], 13); //添加模型
        } else {
          if (this.$refs.tusvnMap3.getStaticModel(this.selectedItem.cameraId)) {
            this.$refs.tusvnMap3.updateStaticModelPostion(
              this.selectedItem.cameraId,
              this.position[0],
              this.position[1],
              20,
              (Math.PI / 180.0) * (-this.heading + 80)
            );
          }
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
      if (this.heading) {
        this.$refs.tusvnMap3.updateCameraPosition1(
          this.position[0],
          this.position[1],
          25,
          20,
          -0.2,
          (Math.PI / 180.0) * (this.heading+25)
        );
      } else {
        this.$refs.tusvnMap3.updateCameraPosition1(
          this.position[0],
          this.position[1],
          25,
          20,
          -0.2,
          5
        );
      }
    },
    initWebSocket() {
      if ("WebSocket" in window) {
        this.webSocket = new WebSocket(window.config.websocketUrl); //获得WebSocket对象
      }
      this.webSocket.onmessage = this.onmessage;
      this.webSocket.onclose = this.onclose;
      this.webSocket.onopen = this.onopen;
      this.webSocket.onerror = this.onerror;
    },
    onmessage(mesasge) {
      //console.log(JSON.parse(mesasge.data))
	  this.itemData = JSON.parse(mesasge.data).result.data;
	  this.getExtend(
		this.itemData.longitude,
		this.itemData.latitude,
		0.002
	  );
      this.position = this.coordinateTransfer(
        "EPSG:4326",
        "+proj=utm +zone=51 +ellps=WGS84 +datum=WGS84 +units=m +no_defs",
        this.itemData.longitude,
        this.itemData.latitude
      );
      let list = JSON.parse(mesasge.data).result.deviceList;
      if (list) {
        this.deviceList = JSON.parse(mesasge.data).result.deviceList;
      } else {
        this.deviceList = [];
      }
      if (this.itemData.status == 2) {
        //事件消失取消模型
        if (this.$refs.tusvnMap3.getStaticModel(this.selectedItem.cameraId)) {
          this.$refs.tusvnMap3.removeStaticModel(this.selectedItem.cameraId);
        }
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
    initPlatformWebSocket() {
      let _this = this;
      if ("WebSocket" in window) {
        _this.platformWebsocket = new WebSocket(window.config.websocketUrl); //获得WebSocket对象
        _this.platformWebsocket.onmessage = _this.onPlatformMessage;
        _this.platformWebsocket.onclose = _this.onPlatformClose;
        _this.platformWebsocket.onopen = _this.onPlatformOpen;
      }
    },
    onPlatformMessage(messasge) {
      this.PlatformCar = messasge;
      this.$refs.tusvnMap3.onCarMessage(messasge);
    },
    onPlatformClose(data) {
      console.log("结束连接");
    },
    onPlatformOpen(data) {
      //旁车
      var platform = {
        action: "road_real_data_reg",
        data: {
          polygon: this.currentExtent
        }
      };
      var platformMsg = JSON.stringify(platform);
      this.sendPlatformMsg(platformMsg);
    },
    sendPlatformMsg(msg) {
      let _this = this;
      if (window.WebSocket) {
        if (_this.platformWebsocket.readyState == WebSocket.OPEN) {
          //如果WebSocket是打开状态
          _this.platformWebsocket.send(msg); //send()发送消息
        }
      } else {
        return;
      }
    },
    //感知车
    initPerceptionWebSocket() {
      let _this = this;
      if ("WebSocket" in window) {
        _this.perceptionWebsocket = new WebSocket(window.config.websocketUrl); //获得WebSocket对象
        _this.perceptionWebsocket.onmessage = _this.onPerceptionMessage;
        _this.perceptionWebsocket.onclose = _this.onPerceptionClose;
        _this.perceptionWebsocket.onopen = _this.onPerceptionOpen;
      }
    },
    onPerceptionMessage(messasge) {
      this.perceptionCar = messasge;
      this.$refs.tusvnMap3.addPerceptionData(messasge);
    },
    onPerceptionClose(data) {
      console.log("结束连接");
    },
    onPerceptionOpen(data) {
      //旁车
      var perception = {
        action: "road_real_data_per",
        data: {
          polygon: this.currentExtent
        }
      };
      var perceptionMsg = JSON.stringify(perception);
      this.sendPerceptionMsg(perceptionMsg);
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
    // initWebSocket1() {
    // 	if("WebSocket" in window) {
    // 		this.webSocket1 = new WebSocket(window.config.websocketUrl); //获得WebSocket对象
    // 	}
    // 	this.webSocket1.onmessage = this.onmessage1;
    // 	this.webSocket1.onclose = this.onclose1;
    // 	this.webSocket1.onopen = this.onopen1;
    // 	this.webSocket1.onerror = this.onerror1;
    // },
    // onmessage1(mesasge) {
    // 	this.carData = mesasge;
    // },

    // onclose1(data) {
    // 	console.log("结束连接");
    // },
    // onopen1(data) {
    // 	let _traffic1 = JSON.stringify(this.webSocketData1);
    // 	this.sendMsg1(_traffic1);
    // },
    // sendMsg1(msg) {
    // 	if(window.WebSocket) {
    // 		if(this.webSocket1.readyState == WebSocket.OPEN) {
    // 			//如果WebSocket是打开状态
    // 			this.webSocket1.send(msg); //send()发送消息
    // 		}
    // 	} else {
    // 		return;
    // 	}
    // },
    coordinateTransfer(sourceProject, destinatePorject, longitude, latitude) {
      let targetCoor = proj4(sourceProject, destinatePorject, [
        longitude,
        latitude
      ]);
      return targetCoor;
    },
    getExtend(x, y, r) {
      //1度=108000米；方圆200米
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
        _this.flvUrl = "";
        _this.$refs['player'].initVideo();
      }
    },
    closeDialog() {
      if (this.$refs.tusvnMap3) {
        this.$refs.tusvnMap3.reset3DMap();
      }
      this.$emit("closeDialog");
    },
    showTimeStamp(time) {
      this.time = time;
    },
    mapcomplete() {
      this.initWebSocket();
      this.initPlatformWebSocket();
      this.initPerceptionWebSocket();
    },
    getVideo() {
      this.flvUrl = "";
      getVideoByNum({
        protocal: 1,
        serialNum: this.serialNum
      }).then(res => {
        this.$refs['player'].initVideo();
        if (res.status == 200) {
          this.flvUrl = res.data.flvUrl;
        }
      });
    },
  },
  destroyed() {
    this.webSocket && this.webSocket.close();
    this.platformWebsocket && this.platformWebsocket.close();
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