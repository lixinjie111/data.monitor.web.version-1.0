<template>
<div class="monitor-manage">
  <div class="monitor-manage-title">
    <img src="@/assets/images/monitorShow/monitor-1.png" class="monitor-title-img"/>
    <span class="monitor-title-style">监控管理平台</span>
  </div>
  <div class="crossing-info">
    <p class="crossing-number">路口编号：{{deviceStatus.crossId}}</p>
    <div class="crossing-overview">
      <div class="crossing-position">
        <img src="@/assets/images/monitorShow/monitor-2.png" class="crossing-position-img"/>
      </div>
      <span>{{deviceStatus.rCUPosName}}</span>
      <ul class="monitor-device">
        <li v-for="item in deviceStatus.devices">
          <span class="monitor-device-line"></span>
          <img src="@/assets/images/monitorShow/monitor-3.png" class="monitor-device-img-1" v-show="item.deviceType=='1'"/>
          <img src="@/assets/images/monitorShow/monitor-4.png" class="monitor-device-img-2" v-show="item.deviceType=='2'"/>
          <span class="monitor-device-text">N32302</span>
          <span class="monitor-device-symbol"></span>
        </li>
      <!--  <li>
          <span class="monitor-device-line"></span>
          <img src="@/assets/images/monitorShow/monitor-4.png" class="monitor-device-img-2"/>
          <span class="monitor-device-text">N32302</span>
          <span class="monitor-device-symbol"></span>
        </li>
        <li>
          <span class="monitor-device-line"></span>
          <img src="@/assets/images/monitorShow/monitor-3.png" class="monitor-device-img-1"/>
          <span class="monitor-device-text">N32302</span>
          <span class="monitor-device-symbol"></span>
        </li>
        <li>
          <span class="monitor-device-line"></span>
          <img src="@/assets/images/monitorShow/monitor-4.png" class="monitor-device-img-2"/>
          <span class="monitor-device-text">N32302</span>
          <span class="monitor-device-symbol"></span>
        </li>-->
      </ul>
    </div>
  </div>
  <div class="monitor-vedio-info">
    <div id="cmsplayer" class="monitor-vedio"></div>
  </div>
</div>
</template>
<script>
  import {findBaseData,getRTMPData,getDeviceStatus} from '@/api/monitorManage'
    export default {
        data() {
            return {
              cameraList:[],
              deviceStatus:{}
            }
        },
        methods: {
          findBaseData(){
            findBaseData({
              'rCUId': '1240',
            }).then(res => {
              if(res.code == 200){
                this.cameraList = res.data;
                this.getStream();
              }else{
                this.$message.error("获取路侧实时视频数据失败1");
              }
            }).catch(err => {
              this.$message.error("error: 获取路侧实时视频数据失败1");
            });
          },
          getStream(){
            getRTMPData({
              "procotal": this.cameraList[0].procotal,
              "serialNum": this.cameraList[0].serialNum
            }).then(res => {
              if(res.code == 200){
                //获取视频地址并赋值
                let videoUrl = res.data.rtmp;
                this.embedFlash(videoUrl);
                //直播报活调用
                //this.repeatFn();//拉取流后，保活
              }else{
                this.$message.error("获取车辆实时视频数据失败2");
              }
            }).catch(err => {
              this.$message.error("error: 获取车辆实时视频数据失败2");
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
          },
          getDeviceStatus(){
            getDeviceStatus({
              'rCUId': '1240',
            }).then(res => {
              if(res.code == 200){
                this.deviceStatus = res.data;
              }else{
                this.$message.error("获取路侧设备状态数据失败");
              }
            }).catch(err => {
              this.$message.error("error: 获取路侧设备状态数据失败");
            });
          }
        },
        mounted() {
          this.findBaseData();
          this.getDeviceStatus();
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
  }
  .monitor-manage-title{
    padding:24px 24px 24px 30px;
    position: absolute;
    top:0;
    left: 0;
    width:100%;
  }
  .monitor-title-img{
    width: 46px;
    height:auto;
  }
  .monitor-title-style{
    font-size: 30px;
    letter-spacing: 3px;
    vertical-align: middle;
    color: #ffffff;
  }
  .crossing-info{
    position: absolute;
    left: 30px;
    top: 104px;
  }
  .crossing-number{
    position: relative;
    font-size: 24px;
    letter-spacing: 2px;
    color: #e4f5ef;
    margin-bottom: 70px;
    padding-left: 18px;
  }
  .crossing-number:before{
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    margin-top: -11px;
    width: 4px;
    height: 22px;
    background-color: #51cdff;
  }
  .crossing-overview{
    color: #e4f5ef;
    font-size: 20px;
    letter-spacing: 2px;
  }
  .crossing-position{
    width: 80px;
    height: 80px;
    border-radius: 5px;
    border: solid 1px #51cdff;
    position: relative;
    display: inline-block;
    vertical-align: middle;
    margin-right: 18px;
  }
  .crossing-position-img{
    width: 60px;
    height:auto;
    left:50%;
    top:50%;
    transform:translate(-50%,-50%);
    position: absolute;
  }
  /*.crossing-position-text{
    font-size: 20px;
    letter-spacing: 2px;
  }*/
  .monitor-device{
    margin-left: 40px;
    border-left:1px solid #51cdff;
    height: 360px;
  }
  .monitor-device li{
    height: 90px;
    line-height: 90px;
  }
  .monitor-device-img-1{
    width:45px;
  }
  .monitor-device-img-2{
    width:38px;
  }
  .monitor-device-text{
    vertical-align: middle;
  }
  .monitor-device-symbol{
    width: 14px;
    height: 14px;
    border-radius: 7px;
    background-color: #19cd2e;
    display: inline-block;
    vertical-align: middle;
  }
  .monitor-device-line{
    display: inline-block;
    border-top:1px dashed #51cdff;
    width: 34px;
    height: 0px;
    vertical-align: middle;
  }
  .monitor-vedio-info{
    position: absolute;
    width: 480px;
    height: 300px;
    border:1px solid #5e5970;
    top: 100px;
    right: 24px;
    padding: 10px;
  }
  .monitor-vedio{
    width: 100%;
    height: 100%;
  }

</style>
