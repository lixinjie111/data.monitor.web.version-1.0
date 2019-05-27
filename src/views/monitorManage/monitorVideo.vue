<template>
<div  class="monitor-manage">
  <div id="cmsplayer" class="monitor-vedio"></div>
</div>
</template>
<script>
  import {findBaseData,getRTMPData,getDeviceStatus} from '@/api/monitorManage'
    export default {
        data() {
            return {
              deviceStatus:{}
            }
        },
        methods: {
          findBaseData(){
            findBaseData({
              'rCUId': '1240',
            }).then(res => {
              this.cameraList = res.data;
              this.getStream();
            });
          },
          getStream(){
            getRTMPData({
              "procotal": '1',
              "serialNum": '3402000000132000001701'
            }).then(res => {
              //获取视频地址并赋值
              let videoUrl = res.data.rtmp;
              this.embedFlash(videoUrl);
            });
          },
          embedFlash(rtmpSource){//部署
            var flashVars = "&src=";
            flashVars += rtmpSource; //视频文件
            flashVars += "&autoHideControlBar=true";
            flashVars += "&streamType=";
            flashVars += "live";// vod点播 live直播
            flashVars += "&autoPlay=true";
            flashVars += "&verbose=true";

            var embedCode =  '<object id="flashPlayer" name="flashPlayer" width="100%" height="100%" type="application/x-shockwave-flash"> ';
            embedCode += '<param name="movie" value="static/swf/StrobeMediaPlayback.swf"></param>';
            embedCode += '<param name="flashvars" value="' + flashVars + '"></param>';
            embedCode += '<param name="allowFullScreen" value="true"></param><param name="allowscriptaccess" value="always"></param>';
            embedCode += '<param name="wmode" value="opaque"></param>';
            embedCode += '<embed  id="flashPlayer" name="flashPlayer" src="static/swf/StrobeMediaPlayback.swf" type="application/x-shockwave-flash"';
            embedCode += ' allowscriptaccess="always" allowfullscreen="true" ';
            embedCode += ' wmode="opaque" ';
            embedCode += ' width="100%" height="100%" ';
            embedCode += 'flashvars="' + flashVars + '">';
            embedCode += '</embed></object>';
            console.log(embedCode);
            document.getElementById("cmsplayer").innerHTML = embedCode;
          }
        },
        mounted() {
          this.findBaseData();
        }
    }
</script>
<style scoped>
  .monitor-manage{
    position: fixed;
    top:0;
    left:0;
    bottom:0;
    right:0;
    /*position: absolute;
    top:50%;
    margin-top: -540px;
    left:50%;
    margin-left: -960px;
    !*background: #d2a458;*!
    width:1920px;
    height: 1080px;*/
    overflow:hidden;
    background: #2a2a2a;
  }
  .monitor-vedio{
    width: 100%;
    height: 900px;
    position: absolute;
    top: 50%;
    margin-top: -450px;
  }
</style>
