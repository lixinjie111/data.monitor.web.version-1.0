<template>
  <div class="c-view-wrapper">
    <div class="c-view-side c-view-left road-left">
        <left-top></left-top>
        <left-bottom></left-bottom>
    </div>
    <map-container></map-container>
    <div class="c-view-side c-view-right">
      <div class=" c-scroll-wrap">
        <div class="c-scroll-inner">
          <right-list @queryCrossDetail="queryCrossDetail"></right-list>
        </div>
      </div>
    </div>
    <road-dialog :dialogVisible="dialogVisible" :selected-item="selectedItem" @closeDialog="closeDialog" :deviceMapId="'deviceMap1'"></road-dialog>
  </div>
</template>
<script>
  import MapContainer from './components/map.vue'
  import LeftTop from './components/leftTop.vue'
  import leftBottom from './components/leftBottom.vue'
  import rightList from './components/rightList.vue'
  import roadDialog from './components/dialog.vue'
export default {
  	name: "RoadMonitor",
    data () {
		  return {
        dialogVisible:false,
        selectedItem:{},
        mapDialogVisible:false,
        mapSelectedItem:{}
      }
    },
    components: {MapContainer,LeftTop,leftBottom,rightList,roadDialog},
    methods: {
      queryCrossDetail(item){
        this.dialogVisible=true;
        this.selectedItem = item;
      },
      closeDialog(){
        this.dialogVisible = false;
      }
    },
    mounted () {
      this.$on("crossEvent",(item) =>{
        this.dialogVisible=true;
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
