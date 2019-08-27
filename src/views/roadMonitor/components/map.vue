<template>

  <div class="c-view-main" >
    <div :id="id" class="c-map-style"></div>
    <ul class="c-button-style clearfix trans">
      <li v-for="item in options" :key="item.id" :class="{active:item.isActive}" @click="getMarkers(item)">
        {{item.text}}
      </li>
    </ul>
    <div class="road-distribute trans1" v-show="distributeShow">
      <div class="road-title">
        <span >{{message.title}}</span>
        <i class="road-title-close" @click="closeDialog"></i>
      </div>
      <div class="road-legend">
        <div class="road-text">说明</div>
        <ul class="road-legend-style clearfix">
          <li v-for="(item,index) in message.legend" :key="index">
            <span class="text-style" :style="{background:item.color}"></span><span>{{item.msg}}</span>
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
        webSocket: {},
        webSocketData: {
          action: "event_real_data",
          token: 'tusvn',
        },
        // 获取在驶车辆实时数据（辆）
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
          },
          {
            'id':'traffic',
            'text':'交通事件',
            'isActive':false
          },
          {
            'id':'speed',
            'text':'通行速度',
            'isActive':false
          }
        ],
        distributeShow:false,
        message:{},
        disParams:[],
        lightList:[],
        crossList:[],
        trafficList:[],
        trafficData:[],
        count:0,
        zoomStyleMapping:{
          11:0,
          12:0,
          13:0,
          14:0,
          15:0,
          16:0,
          17:0,
          18:0,
          19:0,
          20:0
        },
        layerList:[],
        timer:0
      }
    },
    watch: {
        trafficData: {
            handler: function (newVal, oldVal) {
              if(newVal.length>0){
                  oldVal.forEach(item=>{
                    newVal.forEach(item1=>{
                      newVal.for
                    })
                  })
              }
            },
            deep: true
        }
    },
    watch:{
        trafficData:function(newVal,oldVal){
            if(this.trafficList.length){
              this.trafficData.forEach(item=>{
           
          })
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
//              clearInterval(this.timer);

                this.message={
                  title:"车辆分布:显示车辆在每段路上的分布情况",
                  legend:[{
                    msg:"1-5辆",
                    color:'#ffe1be'
                  },
                  {
                    msg:"6-10辆",
                    color:'#fba947'
                  },
                  {
                    msg:"11-20辆",
                    color:'#db7a06'
                  },
                  {
                    msg:"21辆以上",
                    color:'#9d5704'
                  }
                 ]
                };
              this.distributeShow = true;
              //获取车辆分布数据
              this.getDistributeWms();
              this.timer = setInterval(()=>{
                // console.log("调用了---")
                if(this.layerList.length>0){
                  this.map.remove(this.layerList);
                  this.layerList=[];
                }
                //获取车辆分布数据
                this.getDistributeWms();
              },5000)
              return;
            }
            if(item.id=='traffic'){
              this.initWebSocket();
            }
            this.getRwDis(item.id);
            if(item.id=='speed'){
//              clearInterval(this.timer);
              this.message={
                title:"通行速度:显示每条车道的通行速度",
                legend:[{
                  msg:"<=10 km/h",
                  color:'#7a0a09'
                },
                {
                  msg:"10-15 km/h",
                  color:'#db3131'
                },
                {
                  msg:"15-25 km/h",
                  color:'#db7a06'
                },
                {
                  msg:"25-35 km/h",
                  color:'#e7cc19'
                },
                {
                  msg:">=35 km/h",
                  color:'#5cc93a'
                }]
              };
              this.distributeShow = true;
              //获取车辆分布数据
              //this.getDistributeWms();
              this.timer = setInterval(()=>{
                // console.log("调用了---")
                if(this.layerList.length>0){
                  this.map.remove(this.layerList);
                  this.layerList=[];
                }
                //获取车辆分布数据
                this.getDistributeWms();
              },5000)
              return;
            }
            
          }else{
            if(item.id=='car'){
              clearInterval(this.timer);
              this.distributeShow = false;
              this.getWms();
            }
            if(item.id=='speed'){
              //clearInterval(this.timer);
              this.distributeShow = false;
              //this.getWms();
            }
              //取消选中，将设备从地图中消除
              this.removeMarkers(item.id);
            }
          }
      },
      getRwDis(disParam){
        rwDis({
          'disType': disParam,
        }).then(res => {
          // console.log("长度-----"+res.data.length)
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
                        /*var marker = new AMap.Marker({
                          position: subItem.position,
                          icon: 'static/images/sideDevice/1.png', // 添加 Icon 图标 URL
                          offset:new AMap.Pixel(-15, -15)
                        });*/
                        // console.log('position---'+subItem.position);
                        let marker = new AMap.ElasticMarker({
                          position:subItem.position,
                          zooms:[11,20],
                          styles:[{
                            icon:{
                              img:'static/images/road/light.png',
                              size:[16,16],//图标的原始大小
                              ancher:[4,8],//锚点，图标原始大小下锚点所处的位置，相对左上角
                              imageOffset:[0,0],
                              //可缺省，当使用精灵图时可用，标示图标在整个图片中左上角的位置
                              imageSize:[4,4],
                              //可缺省，当使用精灵图时可用，整张图片的大小
                              fitZoom:11,//最合适的级别，在此级别下显示为原始大小
                              scaleFactor:2,//地图放大一级的缩放比例系数
                              maxScale:3,//最大放大比例 达到此处图片不在变化
                              minScale:1//最小放大比例

                            }
                          }],
                          zoomStyleMapping:_this.zoomStyleMapping
                        })
                        /*marker.on('click', function(e) {
                          console.log("position:"+subItem.position);
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
                       //交通事件
                       if(disParam=='traffic'){
                        var marker = new AMap.Marker({
                          position: subItem.position,
                          icon: subItem.icon, // 添加 Icon 图标 URL
                          offset:new AMap.Pixel(-15, -15)
                        });
                        _this.map.add(marker);
                        var item={
                          crossId:subItem.id
                        }
                        marker.on('click', function(e) {
                          _this.$parent.$emit("trafficEvent",item);
                        });
                        _this.trafficList.push(marker)
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
        if(type=='traffic'&&this.trafficList.length>0){
          this.map.remove(this.trafficList);
          this.trafficList=[];
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
          url:window.config.dlWmsUrl+'geoserver/shanghai_qcc/wms',
          blend: false,
          tileSize: 256,
          params:{'LAYERS': 'shanghai_qcc:gd_road_centerline',VERSION:'1.1.0'}
        })
        wms.setMap(this.map);
      },
      getDistributeWms() {
        var wms  = new AMap.TileLayer.WMS({
          url:window.config.dlWmsUrl+'geoserver/shanghai_qcc/wms',
          blend: false,
          tileSize: 256,
          params:{'LAYERS': 'shanghai_qcc:gd_road_centerline','STYLES':'shanghai_qcc:dl_shcsq_wgs84_road_centerline_car_statistics',VERSION:'1.1.0'}
        })
        this.layerList.push(wms);
        wms.setMap(this.map);
//        console.log("放大级别---"+this.map.getZoom())
//        this.$parent.$parent.changeCenterPoint = this.setCenter;
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
            this.trafficData = JSON.parse(mesasge.data);
            if(this.trafficList.length){
              this.map.remove(this.trafficList);
              this.trafficList=[];
            }
            console.log(this.trafficData.result.data)
            this.rwDisMap(this.trafficData.result.data,"traffic")
          },
          onclose(data){
            console.log("结束连接");
          },
          onopen(data){
            //获取在驶车辆状态
            var _traffic = JSON.stringify(this.webSocketData);
            this.sendMsg(_traffic);
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
      let _this = this;
      this.map = new AMap.Map(this.id, this.$parent.$parent.defaultMapOption);
      this.map.setZoom(12);
      this.getWms();
      
      /*let resultData=[{'position':[121.1796317576793,31.2798334778146]},{'position':[121.17986126056147,31.280158303639116]},{'position':[121.1796317576793,31.2798334778146]},{'position':[121.1796317576793,31.2798334778146]}];
      resultData.forEach(function (subItem,subIndex) {
        let marker = new AMap.ElasticMarker({
          position: subItem.position,
          zooms: [12, 20],
          styles: [{
            icon: {
              img: 'static/images/road/light.png',
              size: [16, 16],//图标的原始大小
              ancher: [8, 8],//锚点，图标原始大小下锚点所处的位置，相对左上角
              imageOffset: [0, 0],
              //可缺省，当使用精灵图时可用，标示图标在整个图片中左上角的位置
              imageSize: [2, 2],
              //可缺省，当使用精灵图时可用，整张图片的大小
              fitZoom: 12,//最合适的级别，在此级别下显示为原始大小
              scaleFactor: 2,//地图放大一级的缩放比例系数
              maxScale: 6,//最大放大比例
              minScale: 1//最小放大比例

            }
          }],
          zoomStyleMapping: _this.zoomStyleMapping
        })
        marker.on('click', function (e) {
          console.log("position:" + subItem.position);
        })
        _this.map.add(marker);
      })*/
      var item = {
        'id':0
      };
      this.getMarkers(item);
    },
    destroyed(){
      //清除定时器
      clearInterval(this.timer);
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
      padding:13px 20px;
      border-bottom: 1px solid #5e5970;
      position: relative;
      font-size:14px;
      line-height: 14px;
      .road-title-close{
        position: absolute;
        top: 3px;
        right: 20px;
        width: 36px;
        height: 36px;
        background: url(../../../assets/images/public/dialog-close.png) no-repeat center center;
        background-size: 16px 16px;
        cursor: pointer;
      }
    }
    .road-legend{
      padding:20px;
      width: 400px;
      .road-text{
        display: inline-block;
        width: 20%;
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
         
        }
      }
    }
  }
  .trans{
    background-color: rgba(94,89,112,.2);
  }
  .trans1{
    background-color: rgba(31,29,37,.5);
  }
</style>

