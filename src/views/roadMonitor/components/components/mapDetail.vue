<template>
  <div>
      <div :id="id" class="c-map-style"></div>
  </div>
</template>
<script>
  import {typeCross} from '@/api/roadMonitor'
  import ConvertCoord from '@/assets/js/utils/coordConvert.js'
    export default {
        props:['id','reqData'],
        data() {
            return {
              cross:{},
              map:{},
              mapOption:{
                center: [121.262939,31.245149],
                zoom: 18,
                mapStyle: "amap://styles/bc5a63d154ee0a5221a1ee7197607a00"
              },
              webSocket:{},
              mapList:[],
              count:0,
            }
        },
        computed: {
          mapData(){
            return this.reqData;
          }
        },
        methods: {
          getTypeCross(){
              let baseData;
              let position;
              let wms;
                baseData = this.mapData.baseData;

                position = new AMap.LngLat(baseData.x,baseData.y);
//                position = ConvertCoord.wgs84togcj02(baseData.x,baseData.y);
                wms  = new AMap.TileLayer.WMS({
                  url:window.config.dlWmsUrl+'geoserver/shanghai_qcc/wms',
                  blend: false,
                  tileSize: 256,
                  params:{'LAYERS': 'shanghai_qcc:dl_shcsq_wgs84_gjlk',VERSION:'1.1.0'}
                })
                  this.cross = this.mapData;
                  wms.setMap(this.map);
                  //将坐标点转换成高德的位置
                  this.map.setCenter(position);
                  this.map.setZoom(18);
                  this.initWebSocket();
          },
          initWebSocket(){
            let _this=this;
            if ('WebSocket' in window) {
              _this.webSocket = new WebSocket(window.config.websocketUrl);  //获得WebSocket对象
            }
            _this.webSocket.onmessage = _this.onmessage;
            _this.webSocket.onclose = _this.onclose;
            _this.webSocket.onopen = _this.onopen;
            _this.webSocket.onerror = _this.onerror;
          },
          onmessage(mesasge){
            let _this=this;
            let json = JSON.parse(mesasge.data);
            let result = json.result.vehData;
            let position;
            if(_this.count==0){
              //在接受请求前清除地图上的点
              _this.map.remove(_this.mapList);
              _this.mapList=[];
              result.forEach(item =>{
                position = new AMap.LngLat(item.longitude,item.latitude);
//                position = ConvertCoord.wgs84togcj02(item.longitude,item.latitude);
                _this.count++;
                let marker = new AMap.Marker({
                  position: position,
                  icon: 'static/images/road/car.png', // 添加 Icon 图标 URL
                  angle: item.heading,
                  offset:new AMap.Pixel(-8, -16)
                });
                _this.map.add(marker);
                _this.mapList.push(marker);

              });
              if(this.count==result.length){
                _this.count=0;
              }
            }
          },
          onclose(data){
            console.log("结束连接");
          },
          onopen(data){
            //获取在驶车辆状态
            let _params = {
              'action':'cross_real_data',
              'token':'tusvn',
              'crossId':this.cross.crossId
            }
            let _paramsMsg = JSON.stringify(_params);
            this.sendMsg(_paramsMsg);
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
          },
        },
        mounted() {
          this.map = new AMap.Map(this.id, this.mapOption);
          this.getTypeCross();
        },
      destroyed(){
        //销毁Socket
        this.webSocket.close();
      }
    }
</script>

<style>
  .c-size-style .vjs-error .vjs-error-display .vjs-modal-dialog-content{
    padding:50px 24px 30px;
    color: #ccc;
  }
  .c-size-style .vjs-error .vjs-error-display:before{
    font-size: 3em;
    color: #ccc;
    top:60%;
  }
  .c-size-style .video-js{
    height: 200px!important;
  }
 /* .side-device-size .vjs-custom-skin > .video-js .vjs-control{
    width:4em;
  }*/
  .vjs-custom-skin>.video-js .vjs-control-bar .vjs-time-control{
    min-width: 3.2em!important;
  }
</style>
<style lang="scss" scoped>


    .side-device-magnify:before{
      content: "\F108";
      font-family: VideoJS;
      position: absolute;
      z-index: 3;
      right: 10px;
      bottom: 0px;
      font-size: 26px;
    }
    .side-device-shrink:before{
      content: '\F109';
      font-family: VideoJS;
      position: absolute;
      z-index: 3;
      right: 10px;
      bottom: 0px;
      font-size: 26px;
    }
    .device-control{
      position: absolute;
      width:100%;
      bottom: 0;
      height: 40px;
      left: 0px;
      right: 0px;
      box-sizing: border-box;
      padding: 5px;
      opacity: 0;
      cursor: pointer;
      z-index:3;
    }
    .device-control:hover{
      opacity: 1;
      visibility: visible;
      /*background:rgba(0,0,0,0.3) ;*/
      transition:visibility 0.1s, opacity 0.1s;
    }

    .c-mask-style{
      position: absolute;
      width: 310px;
      top: 0;
      cursor: pointer;
      z-index:1;
      p{
        margin-top: 10px;
        margin-left: 10px;
        font-size: 12px;
        color: #fff;
      }
    }


</style>
