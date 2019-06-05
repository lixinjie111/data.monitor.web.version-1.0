<template>
  <div class="c-view-wrapper">
    <div class="c-view-side c-view-left">
      <left-top></left-top>
      <left-middle></left-middle>
      <left-bottom></left-bottom>
    </div>
    <map-container></map-container>
    <div class="c-view-side side-device-right">
      <right-list></right-list>
    </div>
  </div>
</template>
<script>
  import LeftTop from './components/leftTop.vue'
  import LeftMiddle from './components/leftMiddle.vue'
  import LeftBottom from './components/leftBottom.vue'
  import MapContainer from './components/map.vue'
  import RightList from './components/rightList.vue'
  export default {
    data() {
      return {}
    },
    components: { LeftTop,LeftMiddle,LeftBottom,MapContainer,RightList},
    methods: {},
    mounted() {

    }
  }
</script>
<style lang="scss" scoped>
  .side-device-right{
    right:0;
  }
</style>
