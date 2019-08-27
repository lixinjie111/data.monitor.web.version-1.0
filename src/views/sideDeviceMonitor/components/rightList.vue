<template>
  <div class="c-info-style">
    <template v-if="roadList.length">
      <div v-for="item in roadList" :key="item.camSerialNum" class="m-info-list" >
        <right-list-video :roadItem="item"  :visible="visible" :roadList="roadList" @queryDeviceDetail="queryDeviceDetail" ></right-list-video>
        <right-list-map   :roadItem="item" :visible="visible" :roadList="roadList" @queryDeviceDetail="queryDeviceDetail"></right-list-map>
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
