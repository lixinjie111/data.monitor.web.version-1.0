<template>

  <div class="c-view-main" >
    <div :id="id" class="c-map-style"></div>
    <ul class="c-button-style clearfix">
      <li v-for="item in options" :key="item.id" :class="{active:item.isActive}" @click="getMarkers(item)">
        {{item.text}}
      </li>
    </ul>

  </div>
</template>
<script>
  import { getDevDis } from '@/api/sideDeviceMonitor'
  import ConvertCoord from '@/assets/js/utils/coordConvert.js'
  export default {
    name: "MapContainer",
    data() {
      return {
        id: "device-map-container",
        map: null,

        // 获取在驶车辆实时数据（辆）
        webSocket: null,
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
            'isActive':false
          },
          {
            'id':2,
            'text':'路侧点',
            'isActive':true
          },
          {
            'id':3,
            'text':'RSU',
            'isActive':false
          }
        ],
        disParams:[],
        lightList:[],
        rcuList:[],
        sideList:[],
        count:0
      }
    },
    methods: {
      getMarkers(item) {
        var disParams=[];
        if(item.id==0){
          disParams.push(2);
          this.getDevDis(disParams);
        }else{
          item.isActive=!item.isActive;
          //当选中后才进行请求
          if(item.isActive){
            disParams.push(item.id);
            this.getDevDis(disParams);
          }else{
            /*var index = this.disParams.indexOf(item.id);
            if (index > -1) {
              this.disParams.splice(index, 1);*/
              //取消选中，将设备从地图中消除
              this.removeDevice(item.id);
            }
          }
      },
      getDevDis(disParams){
        getDevDis({
          'devTypes': disParams,
        }).then(res => {
          // console.log("长度-----"+res.data.length)
          this.deviceMap(res.data);
        });
      },
      deviceMap(data){
        var _this = this;
        if(_this.count==0){
          if(data.length>0) {
            var resultData=[];
            data.forEach(item=>{
              let option;
              if(item.longitude|| item.latitude){
                option={
                  position:new AMap.LngLat(item.longitude, item.latitude),
                  type:item.type,
                  deviceId:item.deviceId,
                  path:item.path,
                  longitude:item.longitude,
                  latitude:item.latitude,
                  title:item.devName
                }
                resultData.push(option);
              }
            });
            //转成高德地图的坐标
            resultData.forEach((item, index, arr)=>{
             /* AMap.convertFrom(resultData[index].position, 'gps', function (status, result){
                if (result.info === 'ok') {
                  let _point = result.locations[0];
                  resultData[index].position = _point;*/
              resultData[index].position = ConvertCoord.wgs84togcj02(item.longitude, item.latitude);
                  _this.count ++;
                  if(_this.count == arr.length) {
                    //绘制线的轨迹
                    resultData.forEach(function (subItem,subIndex) {
                      if(subItem.type==1){
                        var marker = new AMap.Marker({
                          position: subItem.position,
                          icon: 'static/images/sideDevice/1.png', // 添加 Icon 图标 URL
                          offset:new AMap.Pixel(-15, -15)
                        });
                        _this.map.add(marker);
                        _this.lightList.push(marker)
                      }
                      //路侧点
                      if(subItem.type==2){
                        var marker = new AMap.Marker({
                          position: subItem.position,
                          icon: 'static/images/sideDevice/3.png', // 添加 Icon 图标 URL
                          offset:new AMap.Pixel(-15, -15),
                          title:subItem.title
                        });
                        _this.map.add(marker);
                        var item={
                          path:subItem.path,
                          roadSiderId:subItem.deviceId,
                          camSerialNum:"",
                          target:'map'
                        }
                        marker.on('click', function(e) {
                          _this.$parent.$emit("sideEvent",item,'map');
                        });
                        _this.sideList.push(marker)
                      }
                      //rcu
                      if(subItem.type==3){
                        var marker = new AMap.Marker({
                          position: subItem.position,
                          icon: 'static/images/sideDevice/2.png', // 添加 Icon 图标 URL
                          offset:new AMap.Pixel(-15, -15)

                        });
                        _this.map.add(marker);
                        _this.rcuList.push(marker)
                      }
                      //绘制完后，重新设置
                      if(subIndex==resultData.length-1){
                        _this.map.setFitView();
//                        console.log("zoom===="+_this.map.getZoom())
                        _this.map.setZoom(_this.map.getZoom()-2);
                        _this.count=0;
//                        console.log("zoom1===="+_this.map.getZoom())
                      }
                    })
                  }
                /*}
              });*/
            })
          }
        }
      },
      removeDevice(type){
        if(type==1&&this.lightList.length>0){
          this.map.remove(this.lightList);
          this.lightList=[];
        }
        if(type==3&&this.rcuList.length>0){
          this.map.remove(this.rcuList);
          this.rcuList=[];
        }
        if(type==2&&this.sideList.length>0){
          this.map.remove(this.sideList);
          this.sideList=[];
        }
      }
    },
    mounted() {
      this.map = new AMap.Map(this.id, window.defaultMapOption);
      console.log("地图样式："+this.map.getMapStyle());
      this.map.setMapStyle("amap://styles/3312a5b0f7d3e828edc4b2f523ba76d8");
      var item = {
        'id':'0'
      };
      this.getMarkers(item);
    }
  }
</script>

