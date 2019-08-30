<template>

  <div class="c-view-main" >
    <div :id="id" class="c-map-style"></div>
    <ul class="c-button-style clearfix trans">
      <li v-for="item in options" :key="item.id" :class="{active:item.isActive}" @click="getMarkers(item)">
        {{item.text}}
      </li>
    </ul>
    <div class="road-distribute trans" v-show="distributeShow">
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
    <traffic-dialog v-if="trafficDialog" :selectedItem="trafficeItem" @closeDialog="closeDialog"></traffic-dialog>
  </div>
</template>
<script>
  import { rwDis } from '@/api/roadMonitor'
  import ConvertCoord from '@/assets/js/utils/coordConvert.js'
  import trafficDialog from './components/trafficDialog.vue'
  export default {
    name: "MapContainer",
    components: {trafficDialog},
    data() {
      return {
        id: "road-map-container",
        map: null,
        trafficDialog:false,
        trafficeItem:{},
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
        massNum : "",
        layerList:[],
        speedList:[],
        timer:0,
        timer1:0,
        trafficMarker:{}
      }
    },
    // created() {
    //   var arr1=[{id:1,longitude:2,latitude:3},{id:2,longitude:2,latitude:3},{id:3,longitude:3,latitude:3}]
    //   var arr2=[{id:2,longitude:2,latitude:3},{id:3,longitude:2,latitude:3},{id:4,longitude:2,latitude:3}]
    //   this.compare(arr2,arr1);//新增和改变的
    // },
    watch: {
        trafficData: {
            handler: function (newVal, oldVal) {
              
              if(oldVal.length>0 && newVal.length>0){
                this.compare(newVal,oldVal);
              }else if(newVal.length<=0){
               // console.log(222222222222)
              }else{
               // console.log(33333333333)
                this.rwDisMap(newVal,"traffic")
              }
            },
            deep: true
        }
    },
    methods: {
      compare(newArr,oldArr){
        let newData = [];//新增的数据
        let sameData=[];
        let sameIdData=[];//更新的数据
        let arrData=[];
        for(let i = 0; i < newArr.length; i++){
            let newId = newArr[i].id;
            let newlon = newArr[i].longitude;
            let newlat = newArr[i].latitude;
            let isExist = false;
            for(let j = 0; j < oldArr.length; j++){
                let oldId = oldArr[j].id;
                let oldlon = oldArr[j].longitude;
                let oldlat = oldArr[j].latitude;
                if(newId == oldId){//存在id一样的数据
                    isExist = true;
                    arrData.push(oldArr[j]);
                  if(newlon==oldlon && newlat==oldlat){//存在id一样;位置相同的的数据
                    sameData.push(oldArr[j]);
                  }else{//存在id一样位置不同的数据;更新的数据
                    sameIdData.push(oldArr[j]);
                  }
                }
            }
            if(!isExist){//新增的数据
                newData.push(newArr[i]);
            }
        }
        let set=arrData.map(item=>item.id);
        let delData=oldArr.filter(item=>!set.includes(item.id));//删除的数据
      
        this.rwDisMap(newData,"traffic","newData");
        this.rwDisMap(sameIdData,"traffic","sameIdData");
        this.rwDisMap(delData,"traffic","delData");
      },
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

                if(this.layerList.length>0){
                  this.map.remove(this.layerList);
                  this.layerList=[];
                }
                //获取车辆分布数据
                this.getDistributeWms();
              },5000)
              return;
            }else if(item.id=='traffic'){
              this.initWebSocket();
            }else if(item.id=='speed'){
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
              this.getSpeedWms();
              this.timer1 = setInterval(()=>{
             
                if(this.speedList.length>0){
                  this.map.remove(this.speedList);
                  this.speedList=[];
                }
                //获取车辆分布数据
                this.getSpeedWms();
              },5000)
              return;
            }else{
              this.getRwDis(item.id);
            }
            
          }else{
            if(item.id=='car'){
              clearInterval(this.timer);
              this.distributeShow = false;
              this.getWms();
            }
            if(item.id=='speed'){
              clearInterval(this.timer1);
              this.distributeShow = false;
              this.getWms();
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
       
          this.rwDisMap(res.data,disParam);
        });
      },
      rwDisMap(resultData,disParam,type){    
        var _this = this;
        if(_this.count==0){
          if(resultData.length>0) {
            //转成高德地图的坐标
            let posotionData = [];
            resultData.forEach((item, index, arr)=>{
              // console.log(arr)
              resultData[index].position = ConvertCoord.wgs84togcj02(item.longitude, item.latitude);
                  _this.count ++;
                  if(_this.count == arr.length) {
                    //绘制线的轨迹             
                    resultData.forEach(function (subItem,subIndex) {
                      //红绿灯
                      if(disParam=='spat'){          
                        posotionData[subIndex] = {}
                        posotionData[subIndex].lnglat = resultData[subIndex].position
                        posotionData[subIndex].id = index,
                        posotionData[subIndex].style =  0 
  
                        // let marker = new AMap.ElasticMarker({
                        //   position:subItem.position,
                        //   zooms:[11,20],
                        //   styles:[{
                        //     icon:{
                        //       img:'static/images/road/light.png',
                        //       size:[8,8],//图标的原始大小
                        //       ancher:[4,4],//锚点，图标原始大小下锚点所处的位置，相对左上角
                        //       imageOffset:[0,0],
                        //       //可缺省，当使用精灵图时可用，标示图标在整个图片中左上角的位置
                        //       imageSize:[8,8],
                        //       //可缺省，当使用精灵图时可用，整张图片的大小
                        //       fitZoom:15,//最合适的级别，在此级别下显示为原始大小
                        //       scaleFactor:1.4,//地图放大一级的缩放比例系数
                        //       maxScale:2,//最大放大比例 达到此处图片不在变化
                        //       minScale:1//最小放大比例
                        //     }
                        //   }],
                        //   zoomStyleMapping:_this.zoomStyleMapping
                        // })
                        // _this.map.add(marker);
                        // _this.lightList.push(marker)
                      }
                      //路口
                      if(disParam=='cross'){

                        posotionData[subIndex] = {}
                        posotionData[subIndex].lnglat = resultData[subIndex].position
                        posotionData[subIndex].id = subItem.uid,
                        posotionData[subIndex].style =  0 


                        // let marker = new AMap.ElasticMarker({
                        //   position:subItem.position,
                        //   zooms:[11,20],
                        //   styles:[{
                        //     icon:{
                        //       img:'static/images/road/cross.png',
                        //       size:[30,30],//图标的原始大小
                        //       ancher:[15,15],//锚点，图标原始大小下锚点所处的位置，相对左上角
                        //       imageOffset:[0,0],
                        //       //可缺省，当使用精灵图时可用，标示图标在整个图片中左上角的位置
                        //       imageSize:[30,30],
                        //       //可缺省，当使用精灵图时可用，整张图片的大小
                        //       fitZoom:15,//最合适的级别，在此级别下显示为原始大小
                        //       scaleFactor:1.5,//地图放大一级的缩放比例系数
                        //       maxScale:3,//最大放大比例 达到此处图片不在变化
                        //       minScale:0.8//最小放大比例
                        //     }
                        //   }],
                        //   zoomStyleMapping:_this.zoomStyleMapping
                        // })  
                        // _this.map.add(marker);
                        // let item={
                        //   crossId:subItem.uid
                        // }
                        // marker.on('click', function(e) {
                        //   _this.$parent.$emit("crossEvent",item);
                        // });
                        // _this.crossList.push(marker)
                      }
                      //交通事件
                      if(disParam =='traffic'){
                       
                         if(type=="delData"){
                            _this.map.remove(_this.trafficMarker[subItem.id]);
                            for(var i in _this.trafficMarker){
                              if (i == subItem.id) {
                                  delete _this.trafficMarker[i];
                              }
                            }
                         }else if(_this.trafficMarker[subItem.id]){//存在需要更新的
                            _this.trafficMarker[subItem.id].setPosition(subItem.position);
                         }else{//不存在需要添加的
                            _this.trafficMarker[subItem.id] = new AMap.ElasticMarker({
                              position:subItem.position,
                              zooms:[11,20],
                              styles:[{
                                icon:{
                                  img:subItem.mapIcon,
                                  size:[44,59],//图标的原始大小
                                  ancher:[22,59],//锚点，图标原始大小下锚点所处的位置，相对左上角
                                  imageOffset:[0,0],
                                  //可缺省，当使用精灵图时可用，标示图标在整个图片中左上角的位置
                                  imageSize:[44,59],
                                  //可缺省，当使用精灵图时可用，整张图片的大小
                                  fitZoom:17,//最合适的级别，在此级别下显示为原始大小
                                  scaleFactor:1.15,//地图放大一级的缩放比例系数
                                  maxScale:1.1,//最大放大比例 达到此处图片不在变化
                                  minScale:0.45//最小放大比例
                                }
                              }],
                              zoomStyleMapping:_this.zoomStyleMapping
                            })                
                            _this.map.add(_this.trafficMarker[subItem.id]);
                            _this.trafficMarker[subItem.id].on('click', function(e) {
                              _this.trafficDialog=true;
                              _this.trafficeItem=subItem;
                            });

                         }
                        
                      }
                      //绘制完后，重新设置
                      if(subIndex==resultData.length-1){     
                        _this.count=0;
                      }
                    })
                  
                  }
                /*}
              });*/
            })
            this.setMassMarker(posotionData,disParam);
          }
        }
      },
      removeMarkers(type){
     
        if(type=='spat'&& this['massspat']){     
          this['massspat'].clear();     
          this.map.remove(this.lightList);
          this.lightList=[];
        }
        if(type=='cross'&& this['masscross']){   
          this['masscross'].clear();
          this.map.remove(this.crossList);
          this.crossList=[];
        }
        if(type=='traffic'&& Object.keys(this.trafficMarker).length>0){
          this.webSocket&&this.webSocket.close();
          this.trafficData=[];
          for(var i in this.trafficMarker){
            this.map.remove(this.trafficMarker[i])
          }
          this.trafficMarker={};
        }
       /* if(type==2&&this.sideList.length>0){
          this.map.remove(this.sideList);
          this.sideList=[];
        }*/
      },
      closeDialog(){
        this.distributeShow=false;
        this.trafficDialog=false;
      },
      getWms() {

        let _optionWms = Object.assign(
              {},
              window.dlWmsDefaultOption,
              {
                  params:{'LAYERS': window.dlWmsOption.LAYERS_centerline, 'VERSION': window.dlWmsOption.VERSION}
              }
          );

        let _wms  = new AMap.TileLayer.WMS(_optionWms);
        _wms.setMap(this.map);
      },
      getDistributeWms() {
        let _optionWms = Object.assign(
              {},
              window.dlWmsDefaultOption,
              {
                  params:{'LAYERS': window.dlWmsOption.LAYERS_centerline,'STYLES': window.dlWmsOption.STYLES, 'VERSION': window.dlWmsOption.VERSION}
              }
          );
        let _wms  = new AMap.TileLayer.WMS(_optionWms);
        this.layerList.push(_wms);
        _wms.setMap(this.map);
      },
      getSpeedWms() {

        let _optionWms = Object.assign(
              {},
              window.dlWmsDefaultOption,
              {
                  params:{'LAYERS': window.dlWmsOption.LAYERS_centerline,'STYLES': window.dlWmsOption.STYLES, 'VERSION': window.dlWmsOption.VERSION}
              }
          );
        let _wms  = new AMap.TileLayer.WMS(_optionWms);
        this.speedList.push(_wms);
        _wms.setMap(this.map);  
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
        this.trafficData = JSON.parse(mesasge.data).result.data;
        //this.drawMarker(this.trafficData,"traffic")
        //console.log(this.trafficData)
        // if(this.trafficList.length){
        //   this.map.remove(this.trafficList);
        //   this.trafficList=[];
        // }
        // console.log(this.trafficData.result.data)
        
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
      },
      setMassMarker(data,disParam){
        // 创建样式对象
        let _this = this;
        let makerUrl;
        let anchorMass;
        let sizeMass;
        let massNum;
        if(disParam=='spat'){
          makerUrl = 'static/images/road/light.png'
          anchorMass =  new AMap.Pixel(6, 6)
          sizeMass = new AMap.Size(12, 12)
          massNum = "massspat"
        }else if(disParam=='cross'){
          makerUrl = 'static/images/road/cross.png'
          anchorMass =  new AMap.Pixel(11, 11)
          sizeMass = new AMap.Size(22, 22)
          massNum = "masscross"
        }
        // else if(disParam =='traffic'){  
        //   makerUrl = 'static/images/road/light.png'
        //   anchorMass =  new AMap.Pixel(0, 0)
        //   sizeMass = new AMap.Size(11, 11)
        //   massNum = "masstraffic"
        // }
        var style = [{
            url: makerUrl,
            anchor: anchorMass,
            size: sizeMass
        }];
        this[massNum] = new AMap.MassMarks(data, {
            opacity: 1,
            zIndex: 111,
            zooms:[11,18],
            cursor: 'pointer',
            style: style
        });
        var marker = new AMap.Marker({content: ' ', map: _this.map});
        // 将海量点添加至地图实例
        this[massNum].setMap(_this.map);     
        if(disParam=='cross'){    
          this[massNum].on('click', function(e) {
            let item={
              crossId:e.data.id
            } 
            _this.$parent.$emit("crossEvent",item);
          });
        }
          
      }
      
    },
    mounted() {
      let _this = this;
      this.map = new AMap.Map(this.id, window.defaultMapOption);
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
 
</style>

