<template>
  <div class="side-device-info">
    <div class="side-device-style" >
      <div class="side-device-size" >
        <video-player class="vjs-custom-skin" :options="option1" ></video-player>
        <div class="side-device-mask" @click="queryDeviceDetail(roadItem1)">
          <p>路侧点：{{roadItem1.roadSiderId}}</p>
        </div>
      </div>
      <div class="side-device-size">
        <tusvn-map :target-id="'mapMonitor'" ref="tusvnMap1" >

        </tusvn-map>
      </div>
    </div>
    <div class="side-device-style" >
      <div class="side-device-size" >
        <video-player class="vjs-custom-skin" :options="option2" ></video-player>
        <div class="side-device-mask" @click="queryDeviceDetail(roadItem2)">
          <p>路侧点：{{roadItem2.roadSiderId}}</p>
        </div>
      </div>
      <div class="side-device-size">
        <tusvn-map :target-id="'mapMonitor1'"  ref="tusvnMap2">

        </tusvn-map>
      </div>
    </div>
  </div>
</template>
<script>
  import VideoPlayer from "../../../../node_modules/vue-video-player/src/player.vue";
  import {getVideoByNum,getRoadList} from '@/api/sideDeviceMonitor'
  const isProduction = process.env.NODE_ENV === 'production'

  import TusvnMap from '@/components/Tusvn3DMap2'
    export default {
        data() {
            return {
              option1:{
                overNative: true,
                autoplay: true,
                controls: true,
                fluid: true,
                techOrder: ['flash', 'html5'],
                sourceOrder: true,
                flash: {
                  swf: isProduction ? '/dataMonitor/static/media/video-js.swf' : '/static/media/video-js.swf'
                },
                sources: [
                  {
                    type: 'rtmp/mp4',
                    src: ''
                  }
                ],
                muted:true,
                width:'100%',
                height:'100%'
              },
              option2:{
                overNative: true,
                autoplay: true,
                controls: true,
                fluid: true,
                techOrder: ['flash', 'html5'],
                sourceOrder: true,
                flash: {
                  swf: isProduction ? '/dataMonitor/static/media/video-js.swf' : '/static/media/video-js.swf'
                },
                sources: [
                  {
                    type: 'rtmp/mp4',
                    src: ''
                  }
                ],
                muted:true,
                width:'100%',
                height:'100%'
              },
              roadItem1:{},
              roadItem2:{},
              roadList:[]

            }
        },
        components:{
          VideoPlayer,
          TusvnMap
        },
        methods: {
          getPlayerOptions(){
            var option={
              overNative: true,
              autoplay: true,
              controls: true,
              fluid: true,
              techOrder: ['flash', 'html5'],
              sourceOrder: true,
              flash: {
                swf: isProduction ? '/dataMonitor/static/media/video-js.swf' : '/static/media/video-js.swf'
              },
              sources: [
                {
                  type: 'rtmp/mp4',
                  src: ''
                }
              ],
              muted:true,
              width:'100%',
              height:'100%'
            }
            return option;
          },
          getRoadList(){
            var _this = this;
            getRoadList().then(res=>{
              _this.roadList = res.data;
              _this.roadList.forEach(function (item,index) {
                getVideoByNum({
                  "protocal": 1,
                  /*"serialNum": "3402000000132000001401"*/
                  "serialNum": item.camSerialNum
                }).then(res => {
                  /*var options = _this.getPlayerOptions();
                  options.sources[0].src=res.data.rtmp;*/
                  /*item.option = options;*/
                  /*_this.playerOptions.push(options);*/
                  if(index==0){
                    _this.option1.sources[0].src=res.data.rtmp;
                    _this.roadItem1=item;
                    _this.$refs.tusvnMap1.changeRcuId(item.roadSiderId,window.cfg.websocketUrl);
                    _this.$refs.tusvnMap1.updateCameraPosition(442694.03980794636,4427074.696229081,348.0686852189313,0.0000028926452461693342,-0.39699074074074336,-0.730706721974606);
//                    console.log("ref------"+ _this.$refs.tusvnMap1);
                  }
                  if(index==1){
                    _this.option2.sources[0].src=res.data.rtmp;
                    _this.roadItem2=item;
                    _this.$refs.tusvnMap2.changeRcuId(item.roadSiderId,window.cfg.websocketUrl);
                    _this.$refs.tusvnMap2.updateCameraPosition(432957.6545664083,4329707.890129204,330.36384870177665,0.0000028926452461693342,-0.39699074074074336,-0.730706721974606);
//                    console.log("ref------"+ _this.$refs.tusvnMap1);
                  }
                })
              })
            });
          },
          queryDeviceDetail(item) {
            var _this = this;
            this.$emit("queryDeviceDetail",item);
            /*_this.selectedItem = item;
            this.dialogVisible = true;*/
          }
        },
       watch:{

       },
        mounted() {
          this.getRoadList();
        }
    }
</script>

<style>
  .side-device-size .vjs-error .vjs-error-display .vjs-modal-dialog-content{
    padding:50px 24px 30px;
    color: #ccc;
  }
  .side-device-size .vjs-error .vjs-error-display:before{
    font-size: 3em;
    color: #ccc;
    top:60%;
  }
  .side-device-size .video-js{
    height: 200px;
  }
</style>
<style lang="scss" scoped>

  .side-device-info{
    position: absolute;
    right:20px;
    /*.side-device-style{
      position: relative;
     !* margin-bottom: 30px;*!
    }*/
    .side-device-size{
      width: 330px;
      height: 210px;
      margin-bottom: 30px;
      position: relative;
      padding: 5px;
      border:1px solid #5e5970;
      box-sizing: border-box;
    }
    .side-device-mask{
      position: absolute;
      width: 310px;
      height: 170px;
      top: 0;
      cursor: pointer;
      z-index:1;
      p{
        margin-top: 10px;
        margin-left: 10px;
        font-size: 12px;
        color: #fff;
      }
    }
  }


</style>
