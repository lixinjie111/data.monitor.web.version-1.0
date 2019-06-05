<template>

  <div class="c-view-main" >
    <div :id="id" class="side-device-map"></div>
    <ul class="side-device-button clearfix">
      <li v-for="item in options" :key="item.id" :class="{active:item.isActive}" @click="getMarkers(item)">
        {{item.text}}
      </li>
    </ul>
  </div>
</template>
<script>
  export default {
    name: "MapContainer",
    data() {
      return {
        id: "device-map-container",
        AMap: null,
        mapOption: {
          center: this.$parent.defalutCenterPoint,
          zoom: 11,
          mapStyle: "amap://styles/7b007636f01d8a19e9cc2841a85dc083"
        },
        // 获取在驶车辆实时数据（辆）
        webSocket: {},
        webSocketData: {
          action: "trackAll",
          token: 'fpx',
          vehicleId: 'trackAll'
        },
        responseData: {},
        options:[
          {
            'id':1,
            'text':'红绿灯',
            'isActive':true
          },
          {
            'id':2,
            'text':'RSU',
            'isActive':false
          },
          {
            'id':3,
            'text':'路侧点',
            'isActive':false
          }
        ]
      }
    },
    methods: {
      getMarkers(item) {
        item.isActive=!item.isActive;
      }
    },
    mounted() {
     /* this.initWebSocket();*/
      this.AMap = new AMap.Map(this.id, this.mapOption);
    }
  }
</script>
<style lang="scss" scoped>
  @import "@/assets/scss/theme.scss";
  .side-device-map{
    height:100%;
  }
  .side-device-button{
    font-size:14px;
    position: absolute;
    top: 100px;
    right:400px;
    color: #ccc;
    li{
      float: left;
      border:1px solid #5e5970;
      width: 100px;
      height: 30px;
      @include layoutMode();
      margin-left: -1px;
      cursor: pointer;
    }
    .active{
      color: #dc8c00;
      border:1px solid #dc8c00!important;
      position: relative;
    }
  }
</style>
