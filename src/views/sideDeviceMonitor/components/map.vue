<template>

  <div class="c-view-main" >
    <div :id="id" class="side-device-map"></div>
    <ul class="side-device-button clearfix">
      <li v-for="item in options" :key="item.id" :class="{active:item.isActive}" @click="getMarkers(item)">
        {{item.text}}
      </li>
    </ul>
    <side-dialog :dialog-visible.sync="dialogVisible" :selected-item="selectedItem" @closeDialog="dialogVisible=false"></side-dialog>
  </div>
</template>
<script>
  import { getDevDis } from '@/api/sideDeviceMonitor'
  import SideDialog from '@/views/sideDeviceMonitor/components/dialog.vue'
  export default {
    name: "MapContainer",
    data() {
      return {
        id: "device-map-container",
        map: null,
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
        dialogVisible:false,
        selectedItem:{}
      }
    },
    components:{
      SideDialog
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
          console.log("长度-----"+res.data.length)
          this.deviceMap(res.data);
        });
      },
      deviceMap(data){
        var _this = this;
        if(data.length>0) {
          var resultData=[];
          data.forEach(item=>{
            let option;
            if(item.longitude|| item.latitude){
              option={
                position:new AMap.LngLat(item.longitude, item.latitude),
                type:item.type,
                deviceId:item.deviceId,
                path:item.path
              }
              resultData.push(option);
            }
          });
          var count=0;
          //转成高德地图的坐标
          resultData.forEach((item, index, arr)=>{
            AMap.convertFrom(resultData[index].position, 'gps', function (status, result){
//              console.log("status============="+status);
//              console.log("count============="+count);
              if (result.info === 'ok') {
                let _point = result.locations[0];
                resultData[index].position = _point;
                count ++;
//                console.log("count-------"+count);
                if(count == arr.length) {
                  //绘制线的轨迹
                  resultData.forEach(function (item,index) {
                    if(item.type==1){
                     /* console.log("红绿灯----"+item.position);*/
                      var marker = new AMap.Marker({
                        position: item.position,
                        icon: 'static/images/sideDevice/1.png', // 添加 Icon 图标 URL
                      });
                      _this.map.add(marker);
                      _this.lightList.push(marker)
                    }
                    //路侧点
                    if(item.type==2){
                     /* console.log("路测点----"+item.position);*/
                      var marker = new AMap.Marker({
                        position: item.position,
                        icon: 'static/images/sideDevice/3.png', // 添加 Icon 图标 URL
                      });
                      _this.map.add(marker);
                      var item={
                        path:item.path,
                        roadSiderId:item.deviceId,
                        camSerialNum:""
                      }
                      marker.on('click', function(e) {
                        _this.dialogVisible=true;
                        _this.selectedItem=item;
                      });
                      _this.sideList.push(marker)
                    }
                    //rcu
                    if(item.type==3){
                      var marker = new AMap.Marker({
                        position: item.position,
                        icon: 'static/images/sideDevice/2.png', // 添加 Icon 图标 URL
                      });
                      _this.map.add(marker);
                      _this.rcuList.push(marker)
                    }
                    //绘制完后，重新设置
                   /* console.log("index-------"+index);*/
                    if(index==resultData.length-1){
                      _this.map.setFitView();
                    }
                  })

                }
              }
            });
          })
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
      this.map = new AMap.Map(this.id, this.mapOption);
      /*var marker = new AMap.Marker({
        position: [120.774007,31.286014],
        icon: 'static/images/sideDevice/1.png', // 添加 Icon 图标 URL
      });
      120.774005,31.285981
      this.map.add(marker);
      var marker1 = new AMap.Marker({
        position: [120.774005,31.285981],
        icon: 'static/images/sideDevice/1.png', // 添加 Icon 图标 URL
      });
      this.map.add(marker1);*/
      var item = {
        'id':'0'
      };
      this.getMarkers(item);
     /* var data=[{"type":'3','longitude':120.7688836,'latitude':31.2880208}]
      this.deviceMap(data);*/
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
