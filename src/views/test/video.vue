<template>
  <div class="liveView">
    <video-player class="vjs-custom-skin" ref="videoPlayer" :options="playerOptions" @ready="onPlayerReadied" @timeupdate="onTimeupdate">
    </video-player>
    <div style="margin-top: 50px;">
      <span @click="setProgress" class="progress">进度条调整</span>
    </div>
    <div class="time">{{time}}</div>
  </div>
</template>

<script>


  export default {
    name: 'live',
    data() {
      return {

        playerOptions: {
          overNative: true,
          autoplay: false,
          controls: true,
          techOrder: ['flash', 'html5'],
          sourceOrder: true,
          flash: {
            hls: { withCredentials: false },
            swf:  '/static/media/video-js.swf'
          },
          html5: { hls: { withCredentials: false } },
          sources: [
            {
              type: 'rtmp/mp4',
              src: 'rtmp://120.133.21.13:10085/hls/EasyGBS3402000000132000003034020000001320000030?sign=vJOs5vFZg'
            },
            {
              withCredentials: false,
              type: 'application/x-mpegURL',
              src: 'http://playertest.longtailvideo.com/adaptive/bipbop/gear4/prog_index.m3u8'
            },
          ],
          width:'600',
          height:'800',
         /* poster: isProduction ? '/vue-videojs-demo/static/images/favicon.png' : '/static/images/favicon.png'*/
           controlBar: {
             timeDivider: true, // 时间分割线
             durationDisplay: true, // 总时间
             progressControl: true, // 进度条
             customControlSpacer: true, // 未知
             fullscreenToggle: true // 全屏
           },
        },
        time:''
      }
    },
    computed: {
      player() {
        return this.$refs.videoPlayer.player
      },
      currentStream() {
        return this.currentTech === 'Flash' ? 'RTMP' : 'HLS'
      }
    },
    watch:{
      time(){
      }
    },
    methods: {
     /* myPlayer.currentSrc; //返回当前资源的URL
      myPlayer.src = value; //返回或设置当前资源的URL
      myPlayer.canPlayType(type); //是否能播放某种格式的资源
      myPlayer.networkState; //0.此元素未初始化 1.正常但没有使用网络 2.正在下载数据 3.没有找到资源
      myPlayer.load(); //重新加载src指定的资源
      myPlayer.buffered; //返回已缓冲区域，TimeRanges
      myPlayer.preload; //none:不预载 metadata:预载资源信息 auto:立即加载视频
     ————————————————
    版权声明：本文为CSDN博主「Mr.小强」的原创文章，遵循CC 4.0 by-sa版权协议，转载请附上原文出处链接及本声明。
    原文链接：https://blog.csdn.net/little__SuperMan/article/details/89203270*/
      onPlayerReadied() {
        if (!this.initialized) {
          this.initialized = true
          this.currentTech = this.player.techName_
        }
      },
      // record current time
      onTimeupdate(e) {
        this.time = e.cache_.currentTime;

//        console.log('currentTime', e.cache_.currentTime)
      },
      setProgress(){
        setInterval(()=>{
          var connectionInfo = navigator.connection
          console.log("网络下行时间："+connectionInfo.downlink)
        },1000)
//        this.$refs.videoPlayer.player.currentTime(300);
      },
      mounted() {

      }
    }
  }
</script>

<style scoped>
  .liveView {
    position: relative;
    background: #fff;
    padding-bottom:50px
  }
  .progress{
    display: block;
    border:1px solid blue;
    color: black;
    width: 150px;
    height: 30px;
    text-align: center;
    margin-left:45%;
    cursor: pointer;
  }
  .time{
    position: absolute;
    left: 10px;
    top: 10px;
    z-index:1;
    color: #ffffff;
  }
</style>
