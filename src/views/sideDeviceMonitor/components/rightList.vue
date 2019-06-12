<template>
  <div class="side-device-info">
    <div class="side-device-style" v-for="(item,index) in roadList" >
      <div class="side-device-size" >
        <video-player class="vjs-custom-skin" :options="playerOptions[index]" :width="330" :height="210"></video-player>
      </div>
      <div class="side-device-mask" @click="queryDeviceDetail(item)"></div>
      <div class="side-device-size">
        <!--<tusvn-map :target-id="'mapMonitor'" ref="tusvnMap" >

        </tusvn-map>-->
      </div>
    </div>
    <side-dialog :dialogVisible="dialogVisible" :selected-item="selectedItem" @closeDialog="closeDialog"></side-dialog>
  </div>
</template>
<script>
  import VideoPlayer from "../../../../node_modules/vue-video-player/src/player.vue";
  import SideDialog from '@/views/sideDeviceMonitor/components/dialog.vue'
  import {getVideoByNum,getRoadList} from '@/api/sideDeviceMonitor'
  const isProduction = process.env.NODE_ENV === 'production'

  import TusvnMap from '@/components/Tusvn3DMap2'
    export default {
        data() {
            return {
              playerOptions:[],
              roadList:[],
              dialogVisible:false,
              selectedItem:{}

            }
        },
        components:{
          VideoPlayer,
          TusvnMap,
          SideDialog
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
                  var options = _this.getPlayerOptions();
                  options.sources[0].src=res.data.rtmp;
                  /*item.option = options;*/
                  _this.playerOptions.push(options);
                })
              })
            });
          },
          queryDeviceDetail(item){
            var _this = this;
            _this.selectedItem = item;
            this.dialogVisible=true;
          },
          closeDialog() {
            this.dialogVisible = false;
          }
        },
       watch:{

       },
        mounted() {
          this.getRoadList();
        }
    }
</script>

<style lang="scss" scoped>

  .side-device-info{
    position: absolute;
    right:20px;
    .side-device-style{
      position: relative;
     /* margin-bottom: 30px;*/
    }
    .side-device-size{
      width: 330px;
      height: 210px;
      margin-bottom: 30px;
    }
    .side-device-mask{
      position: absolute;
      width: 330px;
      height: 450px;
      top: 0;
      cursor: pointer;
      z-index:1;
    }
  }


</style>
