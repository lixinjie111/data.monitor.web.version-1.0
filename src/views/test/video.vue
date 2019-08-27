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
              src: 'rtmp://120.133.21.13:10085/hls/a1f47d6ae96df85bf5e501abac7bc02b3402000000132000003134020000001320000031?sign=mB9DPfIZg'
            },
            {
              withCredentials: false,
              type: 'application/x-mpegURL',
              src: 'http://playertest.longtailvideo.com/adaptive/bipbop/gear4/prog_index.m3u8'
            },
          ],
          width:'600',
          height:'800'
         /* poster: isProduction ? '/vue-videojs-demo/static/images/favicon.png' : '/static/images/favicon.png'*/
          // controlBar: {
          //   timeDivider: false, // 时间分割线
          //   durationDisplay: false, // 总时间
          //   progressControl: true, // 进度条
          //   customControlSpacer: true, // 未知
          //   fullscreenToggle: true // 全屏
          // },
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
    methods: {
      onPlayerReadied() {
        if (!this.initialized) {
          this.initialized = true
          this.currentTech = this.player.techName_
        }
      },
      // record current time
      onTimeupdate(e) {
        this.time = e.cache_.currentTime;

        console.log('currentTime', e.cache_.currentTime)
      },
      setProgress(){
        this.$refs.videoPlayer.player.currentTime(300);
      },
      mounted() {
        console.log("获取播放时长"+this.player.currentTime())
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
