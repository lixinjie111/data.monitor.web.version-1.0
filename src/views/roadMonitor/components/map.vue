<template>

  <div class="c-view-main" >
    <div :id="id" class="c-map-style"></div>
    <ul class="c-button-style clearfix">
      <li v-for="item in options" :key="item.id" :class="{active:item.isActive}" @click="getMarkers(item)">
        {{item.text}}
      </li>
    </ul>
    <div class="road-distribute" v-show="distributeShow">
      <div class="road-title">
        <span class="road-title-style">车辆分布:显示车辆再每段路上的分布情况</span>
        <i class="road-title-close" @click="closeDialog"></i>
      </div>
      <div class="road-legend">
        <div class="road-text">说明</div>
        <ul class="road-legend-style clearfix">
          <li>
            <span class="text-style style1"></span><span>1-5辆</span>
          </li>
          <li>
            <span class="text-style style2"></span><span>6-10辆</span>
          </li>
          <li>
            <span class="text-style style3"></span><span>11-20辆</span>
          </li>
          <li>
            <span class="text-style style4"></span><span>21辆以上</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
  import { rwDis } from '@/api/roadMonitor'
  import ConvertCoord from '@/assets/js/utils/coordConvert.js'
  export default {
    name: "MapContainer",
    data() {
      return {
        id: "road-map-container",
        map: null,
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
            'id':'spat',
            'text':'红绿灯',
            'isActive':true
          },
          {
            'id':'cross',
            'text':'路口',
            'isActive':false
          },
          {
            'id':'car',
            'text':'车辆分布',
            'isActive':false
          }
        ],
        distributeShow:false,
        disParams:[],
        lightList:[],
        crossList:[],
        count:0,
        zoomStyleMapping:{
          12:0,
          13:0,
          14:0,
          15:0,
          16:0,
          17:0,
          18:0,
          19:0,
          20:0
        }
      }
    },
    methods: {
      getMarkers(item) {
        var disParams=[];
        //首次加载时
        if(item.id==0){
          /*disParams.push('spat');*/
          this.getRwDis('spat');
        }else{
          item.isActive=!item.isActive;
          //当选中后才进行请求
          if(item.isActive){
            /*disParams.push(item.id);*/
            //如果是车辆分布，弹出弹出框
            if(item.id=='car'){
              this.distributeShow = true;
            }
            this.getRwDis(item.id);
          }else{
            this.distributeShow = false;
              //取消选中，将设备从地图中消除
              this.removeMarkers(item.id);
            }
          }
      },
      getRwDis(disParam){
        rwDis({
          'disType': disParam,
        }).then(res => {
          console.log("长度-----"+res.data.length)
          this.rwDisMap(res.data,disParam);
        });
      },
      rwDisMap(resultData,disParam){
        var _this = this;
        if(_this.count==0){
          if(resultData.length>0) {
            //转成高德地图的坐标
            resultData.forEach((item, index, arr)=>{
              resultData[index].position = ConvertCoord.wgs84togcj02(item.longitude, item.latitude);
                  _this.count ++;
                  if(_this.count == arr.length) {
                    //绘制线的轨迹
                    resultData.forEach(function (subItem,subIndex) {
                      //红绿灯
                      if(disParam=='spat'){
                        var marker = new AMap.Marker({
                          position: subItem.position,
                          icon: 'static/images/sideDevice/1.png', // 添加 Icon 图标 URL
                          offset:new AMap.Pixel(-15, -15)
                        });
                        /*console.log('position---'+subItem.position);
                        let marker = new AMap.ElasticMarker({
                          position:[121.1768760544491,31.26431518086504],
                          zooms:[12,20],
                          styles:[{
                            icon:{
                              img:'static/images/road/light.png',
                              size:[16,16],//可见区域的大小
                              ancher:[8,16],//锚点
                              fitZoom:12,//最合适的级别
                              scaleFactor:2,//地图放大一级的缩放比例系数
                              maxScale:2,//最大放大比例
                              minScale:0.5//最小放大比例

                            }
                          }],
                          zoomStyleMapping:_this.zoomStyleMapping
                        })*/
                        _this.map.add(marker);
                        _this.lightList.push(marker)
                      }
                      //路口
                      if(disParam=='cross'){
                        var marker = new AMap.Marker({
                          position: subItem.position,
                          icon: 'static/images/road/cross.png', // 添加 Icon 图标 URL
                          offset:new AMap.Pixel(-15, -15)
                        });
                        _this.map.add(marker);
                        var item={
                          crossId:subItem.uid
                        }
                        marker.on('click', function(e) {
                          _this.$parent.$emit("crossEvent",item);
                        });
                        _this.crossList.push(marker)
                      }
                      //rcu
                      /*if(disParam=='cross'){
                        var marker = new AMap.Marker({
                          position: subItem.position,
                          icon: 'static/images/sideDevice/2.png', // 添加 Icon 图标 URL

                        });
                        _this.map.add(marker);
                        _this.rcuList.push(marker)
                      }*/
                      //绘制完后，重新设置
                      if(subIndex==resultData.length-1){
                       /* _this.map.setFitView();*/
//                        console.log("zoom===="+_this.map.getZoom())
                     /*   _this.map.setZoom(_this.map.getZoom()-2);*/
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
      removeMarkers(type){
        if(type=='spat'&&this.lightList.length>0){
          this.map.remove(this.lightList);
          this.lightList=[];
        }
        if(type=='cross'&&this.crossList.length>0){
          this.map.remove(this.crossList);
          this.crossList=[];
        }
       /* if(type==2&&this.sideList.length>0){
          this.map.remove(this.sideList);
          this.sideList=[];
        }*/
      },
      closeDialog(){
        this.distributeShow=false;
      },
      getWms() {
        var wms  = new AMap.TileLayer.WMS({
          url:'http://10.0.1.22:8080/geoserver/shanghai_qcc/wms',
          blend: false,
          tileSize: 256,
          params:{'LAYERS': 'shanghai_qcc:gd_road_centerline',VERSION:'1.1.0'}
        })
        wms.setMap(this.map);
//        console.log("放大级别---"+this.map.getZoom())
//        this.$parent.$parent.changeCenterPoint = this.setCenter;
      },
      initWebSocket(){
        let _this=this;
        if ('WebSocket' in window) {
          _this.webSocket = new WebSocket(window.cfg.websocketUrl);  //获得WebSocket对象
        }
        _this.webSocket.onmessage = _this.onmessage;
        _this.webSocket.onclose = _this.onclose;
        _this.webSocket.onopen = _this.onopen;
        _this.webSocket.onerror = _this.onerror;
      },
      onmessage(mesasge){
        let _this=this;
        var json = JSON.parse(mesasge.data);
        var result = json.result.roadVeh;

      },
      onclose(data){
        console.log("结束连接");
      },
      onopen(data){
        //获取在驶车辆状态
        var carStatus = {
          'action':'road_veh_num',
          'token':'tusvn'
        }
        var vehicleStatusMsg = JSON.stringify(carStatus);
        this.sendMsg(vehicleStatusMsg);
      },
      sendMsg(msg) {
        let _this=this;
        if(window.WebSocket){
          if(_this.webSocket.readyState == WebSocket.OPEN) { //如果WebSocket是打开状态
            _this.webSocket.send(msg); //send()发送消息
          }
        }else{
          return;
        }
      }
    },
    mounted() {
      this.map = new AMap.Map(this.id, this.$parent.$parent.defaultMapOption);
      this.map.setZoom(12);
      this.getWms();
      var item = {
        'id':0
      };
      this.getMarkers(item);
    }
  }
</script>
<style lang="scss" scoped>
  .road-distribute{
    position: absolute;
    top: 146px;
    right: 400px;
    z-index:2;
    border:1px solid #5e5970;
    .road-title{
      padding:15px 20px;
      border-bottom: 1px solid #5e5970;
      position: relative;
      .road-title-close{
        width: 36px;
        height: 36px;
        background: url(../../../assets/images/public/dialog-close.png) no-repeat center center;
        background-size: 16px 16px;
        cursor: pointer;
        position: absolute;
        top: 18px;
        right: 20px;
      }
    }
    .road-legend{
      padding:20px;
      width: 400px;
      .road-text{
        display: inline-block;
        width: 25%;
        vertical-align: top;
      }
      .road-legend-style{
        display: inline-block;
        width: 70%;
        li{
          float: left;
          width:50%;
          .text-style{
            display: inline-block;
            width: 20px;
            height: 10px;
            margin-right: 6px;
          }
          .style1{
             background: #ffe1be;
           }
          .style2{
            background: #fba947;
          }
          .style3{
            background: #db7a06;
          }
          .style4{
            background: #9d5704;
          }
        }
      }
    }
  }
</style>

