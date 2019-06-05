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
  import { getDevDis } from '@/api/sideDeviceMonitor'
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
            'id':3,
            'text':'红绿灯',
            'isActive':true
          },
          {
            'id':4,
            'text':'RSU',
            'isActive':false
          },
          {
            'id':6,
            'text':'路侧点',
            'isActive':false
          }
        ],
        disParams:[],
        lightList:[],
        rcuList:[],
        sideList:[]
      }
    },
    methods: {
      getMarkers(item) {
        if(item.id==1){
          this.disParams.push(3);
        }else{
          item.isActive=!item.isActive;
          if(item.isActive){
            this.disParams.push(item.id);
          }else{
            var index = this.disParams.indexOf(item.id);
            if (index > -1) {
              this.disParams.splice(index, 1);
              //取消选中，将设备从地图中消除
              this.removeDevice(item.id);
            }
          }
        }
        getDevDis({
          'devTypes': this.disParams,
        }).then(res => {

        });
      },
      deviceMap(data){
        var _this = this;
        if(data.length>0) {
          var position;
          data.forEach(function (item) {
            position = new AMap.LngLat(item.longitude, item.latitude);
            var newPosition;
            var marker;
            AMap.convertFrom(position, 'gps', function (status, result) {
              if (result.info === 'ok') {
                newPosition = result.locations[0];
              }
              //如果地图上有该设备，无需重新绘制
              /*var flag = false;
              _this.deviceMarkerList.forEach(function (item) {
                if(item.getPosition()[0] == newPosition[0] &&item.getPosition()[1] == newPosition[1]){
                  flag=true;
                }
              })*/
              //红绿灯
              if(item.type==3){
                marker = new AMap.Marker({
                  position: newPosition,
                  icon: 'static/images/sideDevice/1.png', // 添加 Icon 图标 URL
                });
                _this.AMap.add(marker);
                 _this.lightList.push(marker)
              }
              //rcu
              if(item.type==4){
                marker = new AMap.Marker({
                  position: newPosition,
                  icon: 'static/images/sideDevice/2.png', // 添加 Icon 图标 URL
                });
                _this.AMap.add(marker);
                _this.rcuList.push(marker)
              }
              if(item.type==6){
                marker = new AMap.Marker({
                  position: newPosition,
                  icon: 'static/images/sideDevice/3.png', // 添加 Icon 图标 URL
                });
                _this.AMap.add(marker);
                _this.sideList.push(marker)
              }

            })
          })
        }
      },
      removeDevice(type){
        if(type==3&&this.lightList.length>0){
          this.AMap.remove(this.lightList);
          this.lightList=[];
        }
        if(type==4&&this.rcuList.length>0){
          this.AMap.remove(this.rcuList);
          this.rcuList=[];
        }
        if(type==6&&this.sideList.length>0){
          this.AMap.remove(this.sideList);
          this.sideList=[];
        }
      }
    },
    mounted() {
     /* this.initWebSocket();*/
      this.AMap = new AMap.Map(this.id, this.mapOption);
      var item = {
        'id':'1'
      };
      this.getMarkers(item);
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
