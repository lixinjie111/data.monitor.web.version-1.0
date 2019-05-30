<template>
  <div id="realTraffic" style="width: 900px;height: 800px;margin-left: 30%;">

  </div>
</template>
<script>
    export default {
        data() {
            return {
              distanceMap:{},
              marker:{}
            }
        },
        methods: {},
        mounted() {
          var _this =this;
          this.distanceMap = new AMap.Map("realTraffic", {
            center: [120.76587313387385,31.293174755041118],
            mapStyle:'amap://styles/3312a5b0f7d3e828edc4b2f523ba76d8',
            /*zoom:18,*/
            rotateEnable:'true'
          });
          this.marker = new AMap.Marker({
            position: new AMap.LngLat(116.482362,39.997718),
            icon: 'static/images/car/car-6.png', // 添加 Icon 图标 URL
            title: '北京',
            zIndex:500
          });
          this.distanceMap.add(this.marker);
          /*var marker1 = new AMap.Marker({
            position: [120.76590346256371,31.29110755434833],
            icon: 'static/images/car/car-7.png', // 添加 Icon 图标 URL
            title: '北京'
          });
          _this.distanceMap.add(marker1);*/

          var data  = [{'vehicleId':'1','longitude':'120.765903','latitude':'31.291107'},
            {'vehicleId':'2','longitude':'120.765873','latitude':'31.293174'},
            {'vehicleId':'3','longitude':'120.765882','latitude':'31.292635'},
            {'vehicleId':'4','longitude':'120.765890','latitude':'31.292074'},
            {'vehicleId':'5','longitude':'120.765910','latitude':'31.290620'},
            {'vehicleId':'6','longitude':'120.765886','latitude':'31.292360'}];

          var sideVehicleList=[];
          var sideData = [];
          //测试marker点不删除 地图移动 是否存在
          var time = setInterval(function () {
            if(data.length==0){
              var obj = {'vehicleId':'1','longitude':'120.765903','latitude':'31.291107'};
              var long = parseFloat(obj.longitude)+0.000003;
              var lat = parseFloat(obj.latitude)+0.000004;
              data = [{'vehicleId':'1','longitude':long,'latitude':lat,'speed':200} ]
            }
            var sideVehicleData=[];
            if(data.length>=2){
              sideVehicleData = data.splice(0,2);
            }else {
              sideVehicleData = data;
            }


            var position;
            sideVehicleData.forEach(function (item) {
              position = new AMap.LngLat(item.longitude, item.latitude);
              var newPosition;
              AMap.convertFrom(position, 'gps', function (status, result) {
                if (result.info === 'ok') {
                  newPosition = result.locations[0];
                  //判断当前车旁车是否还在
                  //如果存在  遗留问题：_this.sideVehicleList不存在的旁车在地图上去掉 同时清理集合中的数据
                  if (sideVehicleList.indexOf(item.vehicleId) != -1) {
                    //原有的车进行移动
                    sideData.forEach(function (e) {
                      //找到存在的车 进行绘制线
                      if (e.vehicleId == item.vehicleId) {
                        var lastPosition = e.wholePath[e.wholePath.length - 1];
                        e.marker.setPosition(lastPosition);
                       /* e.marker.setAngle(item.heading);*/
                        e.wholePath.push(newPosition);
                        console.log("是否移动---")
                        //所要移动的位置
                        e.marker.moveTo(newPosition, item.speed);

                        /*_this.distanceMap.setFitView();*/
                      }
                    })
                  } else {//不存在 创建marker
                    var marker = new AMap.Marker({
                      position: newPosition,
                      icon: 'static/images/car/car-7.png', // 添加 Icon 图标 URL
                      title: '北京'
                    });
                    _this.distanceMap.add(marker);
                    var sideCar = {};
                    var wholePath = [];
                    wholePath.push(newPosition);
                    sideCar.wholePath = wholePath;
                    sideCar.marker = marker;
                    sideCar.vehicleId = item.vehicleId;
                    sideData.push(sideCar);
                    sideVehicleList.push(item.vehicleId);

                  }
                }
              })
            })
          })
        }
    }
</script>
<style scoped></style>
