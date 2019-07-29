<template>
  <div id="app">
    <!-- 头部 -->
    <header-bar v-if="this.$route.meta.showHeader" :changeCenterPoint='changeCenterPoint'></header-bar>

    <div class="app-container">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import HeaderBar from '@/components/header/header.vue'
export default {
  	name: 'App',
    components: {
        HeaderBar
    },
    data() {
      let defaultCenterPoint =  [121.262939,31.245149];
      let centerPoint =  [121.17265957261286,31.284096076877844];
      return {
        // defaultCenterPoint: [116.395577, 39.892257] //北京
        // defaultCenterPoint: [121.455372,31.249569], //上海
        defaultCenterPoint: defaultCenterPoint,
        defaultMapOption: {
          center: defaultCenterPoint,
          zoom: 11,
          mapStyle: "amap://styles/3312a5b0f7d3e828edc4b2f523ba76d8"
        },
        changeCenterPoint: centerPoint
      }
    },
    watch: {
      "$route"(val) {
        // console.log(val);
      }
    }
}
</script>

<style lang="scss">
#app {
  font-family: MicrosoftYaHei;
  background: #2a2a2a;
  position: relative;
	width: 100%;
	height: 100%;
  font-size: 14px;
  line-height: 40px;
  letter-spacing: 2px;
  color: #fff;
  overflow: hidden;
  .app-container {
    position: relative;
    width:100%;
    height: 100%;
    overflow:hidden;
  }
}
</style>
