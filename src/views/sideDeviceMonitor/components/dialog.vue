<template>
  <div class="c-dialog-wrapper">
    <div class="c-dialog-container">
      <div class="c-dialog-header">
        <span class="c-dialog-title">路侧点数据</span>
        <i class="c-dialog-close" @click="closeDialog"></i>
      </div>
      <div class="c-dialog-content m-side-dialog-content">
        <div class="side-device-left">
          <div class="c-scroll-wrap">
            <div class="c-scroll-inner">
              <ul class="device-left-ul clearfix">
                <li>
                  <el-select v-model="provinceValue" placeholder="请选择" @change="getCitys">
                    <el-option
                      v-for="item in provinceOptions"
                      :key="item.code"
                      :label="item.name"
                      :value="item.code"
                    ></el-option>
                  </el-select>
                </li>
                <li>
                  <el-select v-model="cityValue" placeholder="请选择" @change="getTree">
                    <el-option
                      v-for="item in cityOptions"
                      :key="item.code"
                      :label="item.name"
                      :value="item.code"
                    ></el-option>
                  </el-select>
                </li>
              </ul>
              <div>
                <div class="side-device-detail">
                  <span>路侧点总数:</span>
                  <span class="device-detail-style">{{roadDevicePoint.rspCount}}</span>
                </div>
                <div class="side-device-detail">
                  <span>路侧设备数:</span>
                  <span class="device-detail-style">{{roadDevicePoint.devCount}}</span>
                </div>
              </div>
              <div class="device-distribute">
                <el-tree
                  :data="treeData"
                  :props="props"
                  lazy
                  :load="loadNode"
                  @node-click="handleNodeClick"
                  highlight-current
                  node-key="code"
                  ref="tree"
                  :default-expanded-keys="defaultArr"
                ></el-tree>
              </div>
            </div>
          </div>
        </div>
        <div class="side-device-right">
          <div class="side-dialog-map">
            <div v-if="target=='video'" class="video-style-height">
              <live-player
                      :isStretch="true"
                      :requestVideoUrl="videoUrl"
                      :autoplay="true"
                      ref="player"
              >
               <span></span>
              </live-player>
            </div>
            <div v-if="target=='map'" style="width: 100%;height: 100%;">
              <div style="width: 100%;height: 100%;">
                <div class="time-style">
                  <span class="t-class">{{time}}</span>
                </div>
                <!-- <tusvn-map4
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
                ></tusvn-map4> -->
                <div id="cesiumContainer" class="side-dialog-map"></div>
              </div>
            </div>
          </div>
          <div class="side-device-list">
            <div class="c-scroll-wrap">
              <div class="c-scroll-inner">
                <p class="side-device-title">设备列表</p>
                <div class="device-list-style">
                  <div class="table-header-group">
                    <ul class="table-row">
                      <li class="table-cell device-num" style="text-align: center">设备编号</li>
                      <li class="table-cell device-style">联网状态</li>
                      <li class="table-cell device-style">开启监控</li>
                    </ul>
                  </div>
                  <div class="table-row-group">
                    <ul class="table-row" v-for="(item,index) in deviceList" :key="item.deviceId">
                      <li class="table-cell device-num">
                        <img
                          src="@/assets/images/monitorManage/monitor-3.png"
                          class="monitor-device-img-1"
                          v-if="item.deviceType=='N'"
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
                          :class="[item.workStatus==1?'online':'offline']"
                        ></span>
                      </li>
                      <li class="table-cell">
                        <div
                          class="c-switch-style"
                          :class="[item.value?active:unActive]"
                          @click="switchChange(item)"
                          v-show="item.deviceType=='N'"
                        >
                          <i></i>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
                <p class="side-device-title">
                  <span v-if="target=='map'">路侧视频</span>
                  <span v-if="target=='video'">感知结果</span>
                </p>
                <div class="device-video-style">
                  <div v-if="target=='map'" class="side-video-style">
                    <live-player
                            :isStretch="true"
                            :requestVideoUrl="videoUrl"
                            :autoplay="true"
                            ref="player"
                    >
                    <span></span>
                    </live-player>
                  </div>
                  <div v-if="target=='video'" style="width: 100%;height: 100%;">
                    <div style="width: 100%;height: 100%;">
                      <div class="time-style">
                        <span class="t-class">{{time}}</span>
                      </div>
                      <!-- <tusvn-map4
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
                      ></tusvn-map4> -->
                      <div id="cesiumContainer" class="side-dialog-map"></div>
                    </div>
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
import LivePlayer from '@/components/livePlayer/template'
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
      provinceOptions: [],
      provinceValue: "",
      cityOptions: [],
      treeList: [], //存放返回的数据
      cityValue: "",
      props: {
        label: "name",
        children: "children",
        code: "code",
        type: "type",
        isLeaf: "leaf"
      },
    
      deviceList: [],
      active: "active",
      unActive: "close-active",
      provinceCode: "",
      cityCode: "",
      regionList: [],
      treeData: [],
      openVideoList: [],
      defaultArr: [], //默认展开
      selectAddr: [], //第一次默认选中的地址
      isFirst: true, //第一次展开，
      roadDevicePoint: {},
      time: "",
      serialNum: "",
      mapInit: false,
      roadId: "", //存储路的id
      rtmp: "",
      cameraParam: {},
      deviceMapId:"deviceMap1",
      selectedDevice:{},
      currentExtent:[],
      videoUrl:'',
      extend: 0.0002,
      mapOk:false,
    };
  },
  components: {
    LivePlayer
  },
  props: {
    selectedItem: {
      type: Object,
      default() {
        return {};
      }
    },
    target: {
      type: String,
      default: ""
    }
  },
  watch:{
    mapOk: {
      handler: function(newVal, oldVal) {
        if(this.mapOk){
          this.initMap();
        }    
      },
      deep: true
    }
  },
  mounted() {
    this.selectAddr = this.selectedItem.path.split("|");
    this.provinceCode = this.selectAddr[0];
    this.cityCode = this.selectAddr[1];
    //默认选中的
    this.roadId = this.selectedItem.roadSiderId;
    this.getDeviceList();
    this.getSideTree();
    this.getDeviceCountByCity();


   
  },
  methods: {

    initMap(){
      let _this = this;
      gis3d.initload("cesiumContainer",false);
      perceptionCars.viewer=gis3d.cesium.viewer;
      _this.mapParam=window.mapParam;
      _this.rsId = _this.$route.params.crossId;
      this.onMapComplete();
    },

    getDeviceList() {
      var _this = this;
      this.videoUrl = "";
      this.$refs["player"].initVideo();
      getDeviceList({
        roadSiderId: this.roadId
      }).then(res => {
        _this.deviceList = res.data;
        var flag = true;
        let deviceNList = []
        _this.deviceList.forEach(function(item, index) {
          if(item.deviceType == "N" ) {
            deviceNList.push(item)
          }
        })
        _this.deviceList = deviceNList;
        _this.deviceList.forEach(function(item, index) {
          //第一次默认并且是摄像头而且在线设置其打开状态
          if (flag && item.deviceType == "N" ) {
            _this.currentExtent = _this.getExtend(item.lon,item.lat,_this.extend)
            if (_this.selectedItem.camSerialNum == "") {//通过地图点击进来的
              flag = false;
              //设置默认的选中值
              item.value = true;
              _this.openVideoList.push(item);
              _this.serialNum = item.serialNum;
            } else {//通过右侧列表点击进来的
              item.value = false;
              if (item.serialNum == _this.selectedItem.camSerialNum) {
                flag = false;
                //设置默认的选中值
                 item.value = true;
                _this.openVideoList.push(item);
                _this.serialNum = item.serialNum;
              }
            }
            //选中的设备
            _this.selectedDevice = item;
            
            if(item.cameraParam){
              _this.cameraParam = JSON.parse(item.cameraParam);
              _this.cameraParam.x = item.lon;
              _this.cameraParam.y = item.lat;
            }else{
              _this.cameraParam = {
                x:item.lon,
                y:item.lat
              }
            }
            if (_this.serialNum != "") {
              _this.getVideo();
              //切换路侧点时，重新切换3D地图
              //第一次地图加载后调整位置即可
              if (_this.mapInit) {
                gis3d.updateCameraPosition(
                  _this.cameraParam.x,
                  _this.cameraParam.y,
                  39,
                  70,
                  -0.2369132859032279,
                  0.0029627735803421373
                );
                _this.perceptionWebsocket.close();
                _this.getExtend(item.lon,item.lat,_this.extend);
                _this.initPerceptionWebSocket();
              
              }
            }
          } else {
            /*_this.$set(item, 'value', false);*/
            item.value = false;
          }
          _this.mapOk = true;
        });

      });
    },
    switchChange(item) {
      var _this = this;
      //不在线 也可以打开
      /*if (item.workStatus != 1) {
        _this.$message({
            type: 'error',
            duration: '1500',
            message: '设备不在线',
            showClose: true
          });
        return;
      }*/
      item.value = !item.value;
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
          _this.deviceList.forEach(function(item2) {
            if (item1.deviceId == item2.deviceId) {
              //                    item2.value=false;
              _this.$set(item2, "value", false);
              //将原来的删除
              _this.openVideoList.splice(index, 1);
            }
          });
        });
        _this.openVideoList.push(item);
        _this.serialNum = item.serialNum;
        _this.selectedDevice = item;
        //根据摄像头调取视频
        _this.getVideo();
        //选中后重新请求
         if (this.$refs.tusvnMap3) {
          if(!item.cameraParam) return;
          _this.cameraParam = JSON.parse(item.cameraParam);
          _this.cameraParam.x = item.lon;
          _this.cameraParam.y = item.lat;
          gis3d.updateCameraPosition(
            _this.cameraParam.x,
            _this.cameraParam.y,
            39,
            70,
            -0.2369132859032279,
            0.0029627735803421373
          );
          this.perceptionWebsocket.close();
          this.getExtend(item.lon,item.lat,_this.extend)
          this.initPerceptionWebSocket();
        
        }
      
      }
    },
    loadNode(node, resolve) {
      var _this = this;
      //懒加载路
      if (node.level == 1) {
        var children = [];
        _this.regionList.forEach(function(item) {
          if (item.code == node.data.code) {
            var list = item.dataList;
            list.forEach(function(item1) {
              var obj = {};
              obj.name = item1.name;
              /*obj.leaf=true;*/
              obj.code = item1.code;
              obj.type = 2;
              children.push(obj);
            });
          }
        });
        resolve(children);
        if (_this.isFirst) {
          _this.defaultArr.push(_this.selectAddr[3]);
          _this.isFirst = false;
        }
        return;
      }
      if (node.level > 2) return resolve([]);

      if (node.level == 2) {
        getDevListByRoadId({
          roadId: node.data.code
        }).then(res => {
          var deviceList = res.data;
          var children = [];
          if (deviceList.length > 0) {
            //默认选中的样式
            var roadId = _this.selectedItem.roadSiderId;
            /*var roadId = '110108_002';*/
            deviceList.forEach(function(item1) {
              var obj = {};
              obj.name = item1.rsPtName;
              obj.code = item1.rsPtId;
              obj.type = 3;
              obj.leaf = true;
              children.push(obj);
              /*if(item1.rsPtId==roadId){
                      _this.$refs.tree.setCurrentKey(roadId);
                    }*/
            });
          }
          resolve(children);
          //设置点击后默认选中项
          _this.$refs.tree.setCurrentKey(roadId);
          return;
        });
      }
    },
    handleNodeClick(node, resolve) {
      //当切换树的时候，设备列表，感知结果进行切换
      this.openVideoList=[];
      this.serialNum = "";
      this.selectedItem.camSerialNum = "";
      this.roadId = node.code;
      this.getDeviceList();
      this.getDeviceCountByCity();
    },
    getSideTree() {
      var _this = this;
      _this.treeList = [];
      //当点击某一个路侧设备后，默认选中的项

      getSideTree().then(res => {
        _this.treeList = res.data;
        _this.provinceOptions = [];
        if (_this.treeList.length > 0) {
          _this.treeList.forEach(function(item) {
            var obj = {};
            obj.code = item.code;
            obj.name = item.name;
            _this.provinceOptions.push(obj);
          });
        }
        if (_this.isFirst) {
          /* _this.provinceCode=_this.selectAddr[0];*/
          _this.provinceValue = _this.selectAddr[0];
          _this.getCitys(_this.provinceCode);
          /* _this.cityCode=_this.selectAddr[1];*/
          _this.cityValue = _this.selectAddr[1];
          _this.getRegion();
        }
      });
    },
    getCitys(code) {
      var _this = this;
      _this.cityValue = "";
      _this.provinceCode = code;
      _this.cityOptions = [];
      _this.treeList.forEach(function(item) {
        if (item.code == code) {
          var cityList = item.dataList;
          cityList.forEach(function(e) {
            var obj = {};
            obj.code = e.code;
            obj.name = e.name;
            _this.cityOptions.push(obj);
          });
        }
      });
    },
    getTree(code) {
      var _this = this;
      _this.cityCode = code;
      _this.getRegion();
      _this.getDeviceCountByCity();
    },
    getRegion() {
      var _this = this;
      _this.treeList.forEach(function(item) {
        if (item.code == _this.provinceCode) {
          var cityList = item.dataList;
          cityList.forEach(function(e) {
            if (e.code == _this.cityCode) {
              //找到市辖区
              _this.regionList = e.dataList;
               _this.treeData=[];
              _this.regionList.forEach(function(item) {
              //绘制树
              var obj = {};
              obj.name = item.name;
              /*obj.leaf=true;*/
              obj.code = item.code;
              obj.type = 1;
              /*  var children = [];
                      var childrenList = item.dataList;
                      //找到路
                      childrenList.forEach(function (item1) {
                        var  obj1 = {};
                        obj1.name =item1.name;
                        obj1.leaf = true;
                        children.push(obj1);
                      })
                      obj.children=children;*/
              _this.treeData.push(obj);
            });
            }
          });
          if (_this.isFirst) {
            _this.defaultArr.push(_this.selectAddr[2]);
          }
        }
      });

    },
    getDevListByRoadId: function(roadId) {
      getDevListByRoadId({
        roadId: roadId
      }).then(res => {});
    },
    getDeviceCountByCity() {
      getDeviceCountByCity({
        distCodeCity: this.cityCode
      }).then(res => {
        this.roadDevicePoint = res.data;
      });
    },
    closeDialog() { 
      this.$emit("closeDialog");
    },
    showTimeStamp(time) {
      this.time = time;
    },
    onMapComplete(){
        gis3d.updateCameraPosition(112.94760914128275, 28.325093927226323,39,70,-0.2369132859032279, 0.0029627735803421373); 
        this.getData();
      
    },
    getData() {
      
      this.initPerceptionWebSocket();

      if (this.serialNum && this.serialNum != "") {
        this.mapInit = true;
        gis3d.updateCameraPosition(
          this.cameraParam.x,
          this.cameraParam.y,
          39,
          70,
          -0.2369132859032279,
          0.0029627735803421373
        );
     
        return;
      }
      let count = 0;
      let time = setInterval(() => {
        if (this.serialNum && this.serialNum != "") {
          this.mapInit = true;
          if(this.selectedItem.cameraParam){
            let cameraParam = JSON.parse(this.selectedItem.cameraParam);
            gis3d.updateCameraPosition(
              this.cameraParam.x,
              this.cameraParam.y,
              39,
              70,
              -0.2369132859032279,
              0.0029627735803421373
            );
          }else{
            gis3d.updateCameraPosition(
              window.defaultMapParam.x,
              window.defaultMapParam.y,
              39,
              70,
              -0.2369132859032279,
              0.0029627735803421373
            );
          }
          clearInterval(time);
        }
        //超过5s仍然没有响应 则停止渲染
        if (count == 5) {
          clearInterval(time);
        }
        count++;
      }, 1000);

    
    },
    getVideo() {
      this.videoUrl = "";
      getVideoByNum({
        protocal: 1,
        /*"serialNum": "3402000000132000001401"*/
        serialNum: this.serialNum
      }).then(res => {
        this.$refs["player"].initVideo();
        this.videoUrl = res.data.wsUrl;   
        setTimeout(() => {
             this.$refs["player"].requestVideo();
        }, 0);
      });
    },
    getExtend(x,y,r){
        this.currentExtent = [];
        let x0=x+r;
        let y0=y+r;
        let x1=x-r;
        let y1=y-r;
        this.currentExtent.push([x1, y0]);
        this.currentExtent.push([x0, y0]);
        this.currentExtent.push([x0, y1]);
        this.currentExtent.push([x1, y1]);
        return this.currentExtent;
    },

    //感知车
    initPerceptionWebSocket(){
        let _this=this;
        try{
            if ('WebSocket' in window) {
                _this.perceptionWebsocket = new WebSocket(window.config.websocketUrl);  //获得WebSocket对象
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
        // if(_this.perIsFirst){
        //     setTimeout(()=>{
        //         _this.perIsFirst=false;
        //     },_this.waitingtime);
        //     return;
        // }
      
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
    processPerData(data){
        let _this = this;
        perceptionCars.addPerceptionData(data,0);
        let cars = data.result.vehDataDTO;
        if(cars.length>0){
            _this.processDataTime = cars[0].gpsTime;
            let pcarnum = 0;
            let persons = 0;
            let zcarnum = 0;
            for (let i = 0; i < cars.length; i++) {
                let obj = cars[i];
                if (obj.type == 1) {
                    zcarnum++;
                    continue;
                }
                if (
                    obj.targetType == 0 ||
                    obj.targetType == 1 ||
                    obj.targetType == 3
                ) {
                    persons++;
                } else {
                    pcarnum++;
                }
            }
            this.statisticData ="当前数据包："+cars.length +"=" +zcarnum +"(自车)+" +pcarnum +"(感知)+" +persons +"(人)";
        }
    },
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
    
  },
 
  destroyed(){
      //销毁Socket
      this.perceptionWebsocket&&this.perceptionWebsocket.close();
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/dialog.scss";

</style>

<style lang="scss">
.m-side-dialog-content {
  .el-input__inner {
    background-color: #262626;
    border: 1px solid #5e5970;
    -webkit-border-radius: 0px;
    -moz-border-radius: 0px;
    border-radius: 0px;
    width: 90px;
    height: 30px;
  }
  .el-select .el-input.is-focus .el-input__inner,
  .el-select .el-input__inner:focus {
    border-color: #5e5970;
  }

  .el-tree {
    background: #262626;
    color: #cccccc;
  }
  // .el-tree-node.is-current > .el-tree-node__content {
  //   color: #ba7907;
  // }
  .el-tree-node .el-tree-node__children .el-tree-node__children .is-current {
    color: #ba7907 !important;
  }
    .el-tree--highlight-current
    .el-tree-node.is-current
    > .el-tree-node__content {
    background-color: transparent;
  }
}
</style>



