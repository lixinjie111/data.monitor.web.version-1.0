<template>
  <div class="c-info-style">
    <div class="side-device-style" v-for="item in roadList" :key="item.camSerialNum">
      <right-list-video :roadItem="item"  :visible="visible" :roadList="roadList" @queryDeviceDetail="queryDeviceDetail" ></right-list-video>
      <right-list-map   :roadItem="item" :roadList="roadList" @queryDeviceDetail="queryDeviceDetail"></right-list-map>
    </div>
  </div>
</template>
<script>
  import {getRoadList} from '@/api/sideDeviceMonitor'
  import rightListVideo from './components/rightListVideo.vue'
  import rightListMap from './components/rightListMap.vue'
    export default {
        data() {
            return {
              roadList:[],
            }
        },
        components:{
          rightListVideo,
          rightListMap
        },
        props:['visible'],
        mounted() {
          this.getRoadList();
        },
        methods: {
          getRoadList(param){
            var _this = this;
            getRoadList().then(res=>{
              console.log(res.data)
              _this.roadList = res.data;
            });
          },
          queryDeviceDetail(item,target) {
            this.$emit("queryDeviceDetail",item,target);
          },
        }

    }
</script>

<style>
  .c-size-style .vjs-custom-skin > .video-js .vjs-big-play-button{
    display: none!important;
  }
  .c-size-style .vjs-error .vjs-error-display .vjs-modal-dialog-content{
    padding:80px 24px 30px!important;
    color: #ccc;
  }
  .c-size-style .vjs-error .vjs-error-display:before{
    font-size: 3em;
    color: #ccc;
    top:60%;
    display: none;
  }

  .c-size-style .video-js{
      height: 200px!important;
    }
  .side-map-tip{
    text-align: center;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    padding-top:25%;
    color: #ccc;
    background: #000;
  }
</style>
