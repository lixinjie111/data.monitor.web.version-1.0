<template>
    <div class="c-size-style">
      <div class="c-size-inner">
        <div class="c-mask-title">
          <a href="javascript:;"  class="title" @click="queryDeviceDetail(roadItem,'map')">路侧点：{{roadItem.roadSiderName}}</a>
          <!-- <img src="@/assets/images/carMonitor/refresh.png" class="c-mask-refresh" v-if="roadItem.online==1" @click="refresh('map')"/> -->
          <!-- <i class="c-mask-refresh el-icon-refresh" @click="refresh('map')"></i> -->
        </div>
        <div class="c-mask-tip" v-show="mapShow">
          <div class="c-mask-text">
            {{message}}
          </div>
        </div>
        <div v-if="!visible" :id="roadItem.camSerialNum" class="c-map-style"></div>
        <!-- <iframe v-if="!visible" class="m-iframe" :src="roadItem.iframeUrl"></iframe> -->

        <!-- <tusvn-map
          class="c-map-video-style"
          v-if="sideMap"
          :targetId="'mapMonitor'+roadItem.camSerialNum"
          :ref="roadItem.camSerialNum"
          :background="mapParam.background"
          :minX="mapParam.minX"
          :minY="mapParam.minY"
          :minZ="mapParam.minZ"
          :maxX="mapParam.maxX"
          :maxY="mapParam.maxY"
          :maxZ="mapParam.maxZ"
          @mapcomplete="onMapComplete">
        </tusvn-map> -->
       <!-- <div class="c-mask-tip" v-else>
          {{mapMessage}}
        </div>-->
      </div>
    </div>
</template>
<script>
  import {getVideoByNum} from '@/api/sideDeviceMonitor'
  const isProduction = process.env.NODE_ENV === 'production'
  import GIS3D from '@/utils/GIS3D.js'
  import PerceptionCars from '@/utils/PerceptionCars.js'
  let gis3d=new GIS3D();
  let perceptionCars1 = new PerceptionCars();
  let perceptionCars0 = new PerceptionCars();
 
    export default {
        data() {
            return {
              mapParam:window.mapParam,
              isFullScreen:false,
              rtmp:"",
              mapShow:false,
              message:'',
              mapMessage:'该路口没有数据，请稍候再试！',
              currentExtent:[],
            }
        },
        components:{
          // TusvnMap
        },
        props:['visible','roadItem','index'],
        mounted() {
          this.getExtend(
            this.roadItem.lon,
            this.roadItem.lat,
            0.0002
          );
          this.initMap();
        },
        methods: {

          initMap(){
            let _this = this;
            gis3d.initload(_this.roadItem.camSerialNum,false);
            if(this.index){
              perceptionCars1.viewer=gis3d.cesium.viewer;
            }else{
              perceptionCars0.viewer=gis3d.cesium.viewer;  
            }
            
            _this.mapParam=window.mapParam;
            _this.rsId = _this.$route.params.crossId;
            this.onMapComplete();
          },  

          onMapComplete:function(){
            if(this.roadItem.camSerialNum&&this.roadItem.camSerialNum!='' && this.roadItem.cameraParam){
              let cameraParam = JSON.parse(this.roadItem.cameraParam);
              cameraParam.x = this.roadItem.lon;
              cameraParam.y = this.roadItem.lat;
              gis3d.updateCameraPosition(cameraParam.x,cameraParam.y,39,70,-0.2369132859032279, 0.0029627735803421373); 
            }
            this.getData();
          },
          getData() {
            this.initPerceptionWebSocket();   
          },
          queryDeviceDetail(item,target) {
            this.$emit("queryDeviceDetail",item,target);
          },
          //后端请求超时的解决办法
          refresh(){
            let _this = this;
         
            this.mapShow=true;
            this.message='数据正在加载，请稍候...';
            setTimeout(()=>{
              this.mapShow=false;
            },3000)
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
              if(this.index){
                perceptionCars1.addPerceptionData(fiterData.data,0);
              }else{
                perceptionCars0.addPerceptionData(fiterData.data,0);
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
      watch:{
        visible(){
          let _this = this;
          //当窗口关闭
          if(!this.visible) {
            //重新连接数据和视频
            if(!_this.roadItem){
              _this.mapMessage='路侧设备不存在!';
              return;
            }
            this.$nextTick(() => {
              this.initMap();
            })   
          }else{
            //打开窗口，关闭连接
            _this.mapMessage='连接关闭';
            this.perceptionWebsocket&&this.perceptionWebsocket.close();
          }
        }
      },
     
      destroyed(){
        //销毁Socket
        this.perceptionWebsocket&&this.perceptionWebsocket.close();
      }
    }
</script>
<style lang="scss" scoped>
.c-size-inner {
  background: #000;
}
.m-iframe {
  border: none;
  background: #000;
  width: 100%;
  height: 100%;
}
</style>
