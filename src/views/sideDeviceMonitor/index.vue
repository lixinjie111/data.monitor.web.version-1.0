<template>
  <div class="c-view-wrapper">
    <div class="c-view-side c-view-left">
      <div class="c-scroll-wrap">
        <div class="c-scroll-inner">
          <left-top></left-top>
          <!--<left-middle></left-middle>-->
          <circle-progress title="设备状态" :requestUrl="getDevStatus"></circle-progress>
          <left-bottom></left-bottom>
        </div>
      </div>
    </div>
    <map-container></map-container>
    <div class="c-view-side c-view-right">
      <div class=" c-scroll-wrap">
        <div class="c-scroll-inner">
          <right-list @queryDeviceDetail="queryDeviceDetail" :visible="dialogVisible"></right-list>
        </div>
      </div>
    </div>
    <side-dialog  v-if="dialogVisible" :dialogVisible="dialogVisible" :selected-item="selectedItem" @closeDialog="closeDialog" :deviceMapId="'deviceMap1'" :target="target"></side-dialog>
  </div>
</template>
<script>
  import LeftTop from './components/leftTop.vue'
  import LeftMiddle from './components/leftMiddle.vue'
  import CircleProgress from '@/components/circleProgress.vue'
  import LeftBottom from './components/leftBottom.vue'
  import MapContainer from './components/map.vue'
  import RightList from './components/rightList.vue'
  import SideDialog from './components/dialog.vue'
  import { getDevStatus } from '@/api/sideDeviceMonitor'
  export default {
    data() {
      return {
        dialogVisible:false,
        selectedItem:{},
        getDevStatus:getDevStatus,
        target:""
      }
    },
    components: { LeftTop,CircleProgress,LeftMiddle,LeftBottom,MapContainer,RightList,SideDialog},
    methods: {
      closeDialog() {
        this.dialogVisible = false;
      },
      queryDeviceDetail(item,target){
        this.dialogVisible=true;
        this.selectedItem = item;
        this.target = target;
      }
    },
    mounted() {
      this.$on("sideEvent",(item,target) =>{
          this.dialogVisible=true;
          this.selectedItem=item;
          this.target = target;
      })
    }
  }
</script>

<style lang="scss" scoped>
  .side-device-right{
    right:0;
  }
</style>
