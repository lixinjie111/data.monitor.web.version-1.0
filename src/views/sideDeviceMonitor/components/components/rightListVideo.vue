<template>
    <div class="c-size-style">
      <div class="c-size-inner">
        <live-player
                :isStretch="true"
                :requestVideoUrl="requestVideoUrl"
                :params="forwardParam"
                type="wsUrl"
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
    export default {
        data() {
            return {
              forwardParam:{},
              requestVideoUrl:getVideoByNum,  
            }
        },
        components: {LivePlayer},
        props:['index','visible','roadItem','roadList'],
        mounted() {
          this.forwardParam ={
              "protocal": 1,
              "serialNum": this.roadItem.camSerialNum
          }
        },
        methods: {
          queryDeviceDetail(item,target) {
            this.$emit("queryDeviceDetail",item,target);
          }
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
