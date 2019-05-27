<template>
<div  class="monitor-manage">
  <div id="cmsplayer" class="monitor-vedio"></div>
</div>
</template>
<script>
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
              "procotal": this.cameraList[3].procotal,
              "serialNum": this.cameraList[3].serialNum.trim()
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
<style scoped></style>
