<template>
    <div class="c-size-style">
      <div class="c-size-inner">
        <live-player
                v-if="roadItem.camSerialNum"
                :isStretch="true"
                :requestVideoUrl="requestVideoUrl"
                :params="forwardParam"
                type="flvUrl"
                :autoplay="false"
        >
        <a class="title" href="javascript:;" @click="queryDeviceDetail(roadItem,'video')">路侧点：{{roadItem.roadSiderName}}</a>
        </live-player>
        <template v-else>
          <a href="javascript:;" class="c-video-title">
              <span class="title">路侧点：{{roadItem.roadSiderName}}</span>
          </a>
          <div class="c-mask-tip">
            未获取到摄像头数据，请稍后重试
          </div>
        </template>

        </div>
      
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
