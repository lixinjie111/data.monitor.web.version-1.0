<template>
  <div id="app">
    <!-- 头部 -->
    <header-bar v-if="this.$route.meta.showHeader"></header-bar>

    <div class="app-container" v-if="this.$route.meta.showHeader">
      <router-view></router-view>
    </div>
    <div class="app-view-container" v-else>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import HeaderBar from '@/components/header.vue'
export default {
  	name: 'App',
    components: {
        HeaderBar
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
  position: relative;
	width: 100%;
	height: 100%;
  overflow: hidden;
  .app-container {
    position: absolute;
    left: 0;
    right: 0;
    top: 64px;
    bottom: 0;
    overflow-y: auto;
  }
  .app-view-container {
    position: relative;
    background: #17181c;
    width:100%;
    height: 100%;
    overflow:hidden;
  }
}
</style>
