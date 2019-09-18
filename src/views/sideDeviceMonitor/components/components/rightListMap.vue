<template>
    <div class="c-size-style">
      <div class="c-size-inner" :id="roadItem.camSerialNum">
        <div class="c-mask-title">
          <div @click="queryDeviceDetail(roadItem,'map')">路侧点：{{roadItem.roadSiderName}}</div>
          <img src="@/assets/images/carMonitor/refresh.png" class="c-mask-refresh" v-if="roadItem.online==1" @click="refresh('map')"/>
        </div>
        <div class="c-mask-tip" v-show="mapShow">
          <div class="c-mask-text">
            {{message}}
          </div>
        </div>
        <tusvn-map
          class="c-map-video-style"
          v-if="sideMap"
          :target-id="'mapMonitor'+roadItem.camSerialNum"
          :ref="roadItem.camSerialNum"
          minX=325295.155400
          minY=3461941.703700
          minZ=50
          maxX=326681.125700
          maxY=3462723.022400
          maxZ=80
          @mapcomplete="onMapComplete">
        </tusvn-map>
       <!-- <div class="c-mask-tip" v-else>
          {{mapMessage}}
        </div>-->
      </div>
    </div>
</template>
<script>
  import {getVideoByNum} from '@/api/sideDeviceMonitor'
  import {getMap} from '@/utils/tusvnMap.js';
  const isProduction = process.env.NODE_ENV === 'production'

  import TusvnMap from '@/components/Tusvn3DMap2'
    export default {
        data() {
            return {
              isFullScreen:false,
              rtmp:"",
              mapShow:false,
              message:'',
              sideMap:true,
              mapMessage:'该路口没有数据，请稍候再试！',
            }
        },
        components:{
          TusvnMap
        },
        props:['visible','roadItem','roadList'],
        methods: {
          onMapComplete:function(){
            getMap(this.$refs[this.roadItem.camSerialNum]);
            if(this.roadItem.camSerialNum&&this.roadItem.camSerialNum!=''){
              let cameraParam = JSON.parse(this.roadItem.cameraParam);
              this.$refs[this.roadItem.camSerialNum].updateCameraPosition(cameraParam.x,cameraParam.y,cameraParam.z,cameraParam.radius,cameraParam.pitch,cameraParam.yaw);
              this.$refs[this.roadItem.camSerialNum].changeRcuId(window.config.websocketUrl,this.roadItem.camSerialNum);
              return;
            }
          },
          queryDeviceDetail(item,target) {
            this.$emit("queryDeviceDetail",item,target);
          },
          //后端请求超时的解决办法
          refresh(){
            let _this = this;
            this.$refs[this.roadItem.camSerialNum].changeRcuId(window.config.websocketUrl,this.roadItem.camSerialNum);
            this.mapShow=true;
            this.message='数据正在加载，请稍候...';
            setTimeout(()=>{
              this.mapShow=false;
            },3000)
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
        console.log(this.roadItem)
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
  @import '@/assets/scss/theme.scss';
</style>
