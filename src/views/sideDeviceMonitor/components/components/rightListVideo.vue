<template>
    <div class="c-size-style">
      <div class="c-size-inner">
        <live-player
                :isStretch="true"
                :requestVideoUrl="requestVideoUrl"
                :params="forwardParam"
                type="flvUrl"
                :autoplay="false"
        >
        <a class="title" href="javascript:;" @click="queryDeviceDetail(roadItem,'video')">路侧点：{{roadItem.roadSiderName}}</a>
        </live-player>
      
      </div>
    </div>
</template>
<script>
  import {getVideoByNum} from '@/api/sideDeviceMonitor'
  import LivePlayer from '@/components/livePlayer/template'
  const isProduction = process.env.NODE_ENV === 'production'
    export default {
        data() {
            return {
              forwardParam:{},
              flvUrl:'',
              requestVideoUrl:getVideoByNum,  
            }
        },
        components: {LivePlayer},
        props:['index','visible','roadItem','roadList'],
        mounted() {
          // this.getVideoByNum();
          this.forwardParam ={
              "protocal": 1,
              "serialNum": this.roadItem.camSerialNum
          }
        },
        methods: {
          getVideoByNum(){
            var _this = this;
          if(!this.roadItem.camSerialNum){
            return;
          }
            getVideoByNum({
              "protocal": 1,
              "serialNum": this.roadItem.camSerialNum
            }).then(res => {
                _this.flvUrl = res.data.flvUrl;
               
            })
          },
          queryDeviceDetail(item,target) {

            this.$emit("queryDeviceDetail",item,target);
          },
       
       

          videoLoadCompleted(param){
              this.repeatFn(param);
          },

          repeatFn(item){//每5秒直播报活一次
              let _this = this;
              _this.keepStream(item);
              if(_this.timeObj[item.camId]){
                  clearTimeout(_this.timeObj[item.camId]);
              }
              let time = setTimeout(function(){
                  _this.repeatFn(item);
              },5000)
              _this.timeObj[item.camId] = time;
          },

          keepStream(item){
                sendStreamHeart({
                    'vehicleId': this.vehicleId,
                    'camId':item.serialNum,
                    'protocal':item.protocol
                }).then(res => {
                });
            },
       
        },
      watch:{
        visible(){
          let _this = this;
          //当窗口关闭
          if(!this.visible) {
            //重新连接数据和视频
            if(_this.roadList==0){
              
              return;
            }
          }
        }
      },

    }
</script>
<style lang="scss">
  @import '@/assets/scss/video-reset.scss';
</style>
