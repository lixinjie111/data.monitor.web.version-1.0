<template>
    <div class="c-size-style">
      <div class="c-size-inner">
        <video-player class="c-map-video-style" :options="option" @error="playerError"></video-player>
        <div class="c-mask-title" >
          <div @click="queryDeviceDetail(roadItem,'video')">路侧点：{{roadItem.roadSiderName}}</div>
          <img src="@/assets/images/carMonitor/refresh.png" class="c-mask-refresh" v-if="roadItem.online==1" @click="refresh"/>
        </div>
      </div>
    </div>
</template>
<script>
  import {getVideoByNum} from '@/api/sideDeviceMonitor'
  const isProduction = process.env.NODE_ENV === 'production'
    export default {
        data() {
            return {
              option:{
                overNative: true,
                autoplay: true,
                controls: true,
                preload: 'auto',
                fluid: true,
                techOrder: ['flash', 'html5'],
                sourceOrder: true,
                flash: {
                  swf: isProduction ? '/monPlatform/static/media/video-js.swf' : '/static/media/video-js.swf'
                },
                sources: [
                  {
                    type: 'rtmp/mp4',
                    src: ''
                  }
                ],
                muted:true,
                width:'100%',
                height:'100%',
                notSupportedMessage: '此视频暂无法播放，请稍候再试',
                /*errorDisplay : false,*/
                controlBar: {
                  timeDivider: false,
                  durationDisplay: false,
                  remainingTimeDisplay: false,
                  currentTimeDisplay:false,
                  fullscreenToggle: true, //全屏按钮
                  captionsButton : false,
                  chaptersButton: false,
                  subtitlesButton:false,
                  liveDisplay:false,
                  playbackRateMenuButton:false
                }
              },
              rtmp:"",
            }
        },
        props:['visible','roadItem','roadList'],
        mounted() {
          this.getVideoByNum();
        },
        methods: {
          getVideoByNum(){
            var _this = this;
//          if(this.roadItem.online!=1){
//            this.option.notSupportedMessage='路侧设备不在线!';
//            return;
//          }
          setTimeout(()=>{
            if(_this.rtmp=='') {
              _this.option.notSupportedMessage = '视频流不存在，请稍候再试！';
            }
          },1000)
          if(!this.roadItem.camSerialNum){
            return;
          }
            getVideoByNum({
              "protocal": 1,
              "serialNum": this.roadItem.camSerialNum
            }).then(res => {
                _this.rtmp = res.data.rtmp;
                if(_this.rtmp==''){
                  _this.option.notSupportedMessage='视频流不存在，请稍候再试！';
                }else{
                  _this.option.sources[0].src=_this.rtmp;
                }
            })
          },
          queryDeviceDetail(item,target) {
            this.$emit("queryDeviceDetail",item,target);
          },
          //视频报错的方法
          playerError(e) {
            if(this.option.sources[0].src != '') {
              let _videoUrl = this.option.sources[0].src;
              this.option.sources[0].src = '';
              setTimeout(() => {
                this.option.sources[0].src = _videoUrl;
              }, 2000);
            }
          },
          //后端请求超时的解决办法
          refresh(){
            let _this = this;
            if(_this.roadList.length==0){
              _this.getVideoByNum();
              return;
            }
            if(_this.rtmp==''){
              _this.getVideoByNum();
            }else{
              _this.option.sources[0].src='';
              _this.option.sources[0].src=_this.rtmp;
            }
          }
        },
      watch:{
        visible(){
          let _this = this;
          //当窗口关闭
          if(!this.visible) {
            //重新连接数据和视频
            if(_this.roadList==0){
              _this.option.notSupportedMessage='';
              _this.option.notSupportedMessage='路侧设备不存在!';
              return;
            }
            // if(this.roadItem.online!=1){
            //   this.option.notSupportedMessage='路侧设备不在线!';
            //   return;
            // }
            if(_this.rtmp==''){
              _this.option.notSupportedMessage='视频流不存在，请稍候重试';
            }else{
              _this.option.sources[0].src=_this.rtmp;
            }
          }else{
            //打开窗口之前，关闭连接
            _this.option.notSupportedMessage='连接关闭';
            _this.option.sources[0].src='';
          }
        }
      },

    }
</script>
<style lang="scss">
  @import '@/assets/scss/video-reset.scss';
</style>
