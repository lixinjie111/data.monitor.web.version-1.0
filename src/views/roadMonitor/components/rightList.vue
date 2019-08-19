<template>
  <div class="c-info-style">
      <div class="c-size-style" v-for="item in resultData" :key="item.crossId">
        <div class="c-mask-style" >
          <p @click="queryCrossDetail(item)">路口：{{item.crossId}}</p>
        </div>
        <map-detail :id="'map'+item.crossId" class="c-map-style" :reqData="item"></map-detail>
      </div>
  </div>
</template>
<script>
  import {typeCross} from '@/api/roadMonitor'
  import ConvertCoord from '@/assets/js/utils/coordConvert.js'
  import mapDetail from './components/mapDetail.vue'
    export default {
      components:{
        mapDetail
      },
        data() {
            return {
              resultData:''
            }
        },
        methods: {
          queryCrossDetail(item) {
            var _this = this;
            this.$emit("queryCrossDetail",item);
          },
          getTypeCross(){
            typeCross().then(res=>{
              this.resultData=res.data;
            });
          },
        },
        mounted() {
          this.getTypeCross();
        },
    }
</script>

<style>
  .c-size-style .vjs-error .vjs-error-display .vjs-modal-dialog-content{
    padding:50px 24px 30px;
    color: #ccc;
  }
  .c-size-style .vjs-error .vjs-error-display:before{
    font-size: 3em;
    color: #ccc;
    top:60%;
  }
  .c-size-style .video-js{
    height: 200px!important;
  }
 /* .side-device-size .vjs-custom-skin > .video-js .vjs-control{
    width:4em;
  }*/
  .vjs-custom-skin>.video-js .vjs-control-bar .vjs-time-control{
    min-width: 3.2em!important;
  }
</style>
<style lang="scss" scoped>


    .side-device-magnify:before{
      content: "\F108";
      font-family: VideoJS;
      position: absolute;
      z-index: 3;
      right: 10px;
      bottom: 0px;
      font-size: 26px;
    }
    .side-device-shrink:before{
      content: '\F109';
      font-family: VideoJS;
      position: absolute;
      z-index: 3;
      right: 10px;
      bottom: 0px;
      font-size: 26px;
    }
    .device-control{
      position: absolute;
      width:100%;
      bottom: 0;
      height: 40px;
      left: 0px;
      right: 0px;
      box-sizing: border-box;
      padding: 5px;
      opacity: 0;
      cursor: pointer;
      z-index:3;
    }
    .device-control:hover{
      opacity: 1;
      visibility: visible;
      /*background:rgba(0,0,0,0.3) ;*/
      transition:visibility 0.1s, opacity 0.1s;
    }

    .c-mask-style{
      position: absolute;
      width: 310px;
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


</style>
