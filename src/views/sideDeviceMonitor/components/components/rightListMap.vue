<template>
    <div class="c-size-style">
      <div class="c-size-inner" :id="roadItem.camSerialNum">
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

        <iframe class="m-iframe" v-if="sideMap" :src="roadItem.iframeUrl"></iframe>
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
  import {getMap} from '@/utils/tusvnMap_roadside.js';
  const isProduction = process.env.NODE_ENV === 'production'

  // import TusvnMap from '@/utils/Tusvn3DMap3'
    export default {
        data() {
            return {
              mapParam:window.mapParam,
              isFullScreen:false,
              rtmp:"",
              mapShow:false,
              message:'',
              sideMap:true,
              mapMessage:'该路口没有数据，请稍候再试！',
              currentExtent:[],
            }
        },
        components:{
          // TusvnMap
        },
        props:['visible','roadItem','roadList'],
        methods: {
          onMapComplete:function(){
            if(this.roadItem.camSerialNum&&this.roadItem.camSerialNum!='' && this.roadItem.cameraParam){
              let cameraParam = JSON.parse(this.roadItem.cameraParam);
              getMap(this.$refs[this.roadItem.camSerialNum]);
              this.$refs[this.roadItem.camSerialNum].updateCameraPosition(cameraParam.x,cameraParam.y,cameraParam.z,cameraParam.radius,cameraParam.pitch,cameraParam.yaw);  
              this.$refs[this.roadItem.camSerialNum].changeRcuId2(
                window.config.websocketUrl,
                this.getExtend(this.roadItem.lon,this.roadItem.lat,0.0002)
              );
              return;
            }
          },
          queryDeviceDetail(item,target) {
            this.$emit("queryDeviceDetail",item,target);
          },
          //后端请求超时的解决办法
          refresh(){
            let _this = this;
            this.$refs[this.roadItem.camSerialNum].changeRcuId2(
              window.config.websocketUrl,
              _this.getExtend(this.roadItem.lon,this.roadItem.lat,0.0002)
            );
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
          }
        },
      watch:{
        visible(){
          let _this = this;
          //当窗口关闭
          if(!this.visible) {
            //重新连接数据和视频
            if(_this.roadList==0){
              this.sideMap=false;
              _this.mapMessage='路侧设备不存在!';
              return;
            }
            _this.sideMap=true;
          }else{
            //打开窗口，关闭连接
            _this.sideMap=false;
            _this.mapMessage='连接关闭';
            if(this.$refs[this.roadItem.camSerialNum]){
              this.$refs[this.roadItem.camSerialNum].reset3DMap();
            }
          }
        }
      },
      mounted() {
        //console.log(this.roadItem)
      },
      destroyed(){
        //销毁Socket
        if(this.$refs[this.roadItem.camSerialNum]){
          this.$refs[this.roadItem.camSerialNum].reset3DMap();
        }
      }
    }
</script>
<style lang="scss" scoped>
.m-iframe {
  border: none;
  background: #000;
  width: 100%;
  height: 100%;
}
</style>
