<template>
  <div class="c-info-style">
    <template v-if="roadList.length">
      <div v-for="(item,index) in roadList" :key="item.camSerialNum" class="m-info-list">
        <right-list-video :index="index" :roadItem="item"  :visible="visible" :roadList="roadList" @queryDeviceDetail="queryDeviceDetail" ></right-list-video>
        <right-list-map   :roadItem="item" :visible="visible"  @queryDeviceDetail="queryDeviceDetail"></right-list-map>
      </div>
    </template>
    <template v-else>
      <div class="c-size-style" v-for="item in new Array(4)">
        <div class="c-size-inner">
          <div class="c-mask-tip">
            暂无数据
          </div>
        </div>
      </div>
    </template>
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
//          setInterval(()=>{
//            let connectionInfo = navigator.connection;
//            let date = new Date();
//            let time = date.toLocaleString();
////          let time =
//            console.log("下载速度："+connectionInfo.downlink);
//          },10)
        },
        methods: {
          getRoadList(param){
            var _this = this;
            getRoadList().then(res=>{
              // _this.roadList = res.data;

              let _data = res.data;
              _data[0].iframeUrl = "http://218.76.44.22:9090/fusionMonitorIframe/#/perception/112.9492872/28.3258268/{%22x%22:691103.6173607388,%22y%22:3134850.4835530985,%22z%22:26.561017479195296,%22radius%22:0.001,%22pitch%22:-0.3885046601282296,%22yaw%22:-7.263025201420584}/0.002";
              _data[1].iframeUrl = "http://218.76.44.22:9090/fusionMonitorIframe/#/perception/113.0600445/28.3208253/{%22x%22:701989.0712304089,%22y%22:3134461.1291018035,%22z%22:25.37795181155824,%22radius%22:9.347650869470886,%22pitch%22:-0.45100466012823004,%22yaw%22:-8.286060431772894}/0.002";
              _this.roadList = _data;
            });
          },
          queryDeviceDetail(item,target) {
            this.$children.map((item,index)=>{
               if(item.$children[0].initVideo){
                 item.$children[0].initVideo();
               } 
            })
            this.$emit("queryDeviceDetail",item,target);
          },
        }

    }
</script>
<style lang="scss" scoped>
.m-info-list {
  .c-size-style {
    &:last-child {
      margin-bottom: 30px;
    }
  }
  &:last-child {
    .c-size-style {
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}
</style>
