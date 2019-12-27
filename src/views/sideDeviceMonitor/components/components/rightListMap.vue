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
        <!-- <div v-if="!visible" :id="roadItem.camSerialNum" class="c-map-style"></div> -->
        <iframe @load ="onLoadMap" :id=roadItem.camSerialNum :name ="roadItem.camSerialNum" ref="iframe1" v-if="!visible" class="c-iframe" :src="roadItem.iframeSrc"></iframe>

      </div>
    </div>
</template>
<script>
  import {getVideoByNum} from '@/api/sideDeviceMonitor'
 
    export default {
        data() {
            return {
              isFullScreen:false,
              rtmp:"",
              mapShow:false,
              message:'',
              mapMessage:'该路口没有数据，请稍候再试！',
              currentExtent:[],
            }
        },
        components:{},
        props:['visible','roadItem','index'],
        mounted() {
          this.getExtend(
            this.roadItem.lon,
            this.roadItem.lat,
            0.0002
          );
          // this.initMap();
           
        },
      
        methods: {
          onLoadMap(){
            let msgData = {
              type:"position",
              data:{
                currentExtent:this.currentExtent
              }
            }
            document.getElementById(this.roadItem.camSerialNum).contentWindow.postMessage(msgData,'*');
            this.onMapComplete();
          },

          onMapComplete:function(){
            if(this.roadItem.camSerialNum&&this.roadItem.camSerialNum!='' && this.roadItem.cameraParam){
              let cameraParam = JSON.parse(this.roadItem.cameraParam);
              cameraParam.x = this.roadItem.lon;
              cameraParam.y = this.roadItem.lat;
              let msgData = {
                type:"updateCam",
                data:{
                  x:cameraParam.x,
                  y:cameraParam.y,
                  z:cameraParam.z,
                  radius:cameraParam.radius,
                  pitch:cameraParam.pitch,
                  yaw:cameraParam.yaw
                }
              }
              for (const i in msgData.data) {
                if(!msgData.data[i] && msgData.data[i] != 0){
                  return;
                }
              }
              document.getElementById(this.roadItem.camSerialNum).contentWindow.postMessage(msgData,'*');   
            }
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
              // this.initMap();
            })   
          }else{
            //打开窗口，关闭连接
            _this.mapMessage='连接关闭';
          }
        }
      }
    }
</script>
<style lang="scss" scoped>
.c-size-inner {
  background: #000;
}
</style>
