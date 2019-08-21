<template>
  <div class="c-info-style">
    <div v-for="item in roadList" :key="item.camSerialNum">
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
