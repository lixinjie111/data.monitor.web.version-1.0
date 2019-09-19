<template>
  <div class="c-view-wrapper">
    <div class="c-view-side c-view-left">
      <div class="c-scroll-wrap">
        <div class="c-scroll-inner">
          <left-top></left-top>
          <left-bottom></left-bottom>
        </div>
      </div>
    </div>
    <map-container></map-container>
    <div class="c-view-side c-view-right">
      <div class=" c-scroll-wrap">
        <div class="c-scroll-inner">
          <right-list @queryCrossDetail="queryCrossDetail"></right-list>
        </div>
      </div>
    </div>
    <road-dialog v-if="dialogVisible" :selected-item="selectedItem" @closeDialog="closeDialog" :deviceMapId="'deviceMap1'"></road-dialog>
    <iframe-dialog v-if="iframeDialog" :selectedItem="selectedItem"  @closeDialog="closeDialog"></iframe-dialog>
  </div>
</template>
<script>
  import MapContainer from './components/map.vue'
  import LeftTop from './components/leftTop.vue'
  import leftBottom from './components/leftBottom.vue'
  import rightList from './components/rightList.vue'
  import roadDialog from './components/dialog.vue'
  import iframeDialog from './components/iframeDialog.vue'
export default {
  	name: "RoadMonitor",
    data () {
		  return {
        dialogVisible:false,
        iframeDialog:false,
        selectedItem:{},
        mapDialogVisible:false,
        mapSelectedItem:{}
      }
    },
    components: {MapContainer,LeftTop,leftBottom,rightList,roadDialog,iframeDialog},
    methods: {
      queryCrossDetail(item){
        if(item.source==3){
          this.iframeDialog=true;
        }else{
          this.dialogVisible=true;
        }
        this.selectedItem = item;
      },
      closeDialog(){
        this.dialogVisible = false;
        this.iframeDialog=false;
      }
    },
    mounted () {
      this.$on("crossEvent",(item) =>{
        if(item.source==3){
          this.iframeDialog=true;
        }else{
          this.dialogVisible=true;
        }
        this.selectedItem=item;
      })
    }
}
</script>
<style scoped>
  .road-left{
    padding-left: 30px!important;
    width: 430px!important;
  }
</style>
