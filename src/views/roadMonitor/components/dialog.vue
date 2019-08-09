<template>
  <div class="c-dialog-wrapper" v-show="dialogVisible">
    <div class="c-dialog-container" >
      <div class="c-dialog-header">
        <span class="c-dialog-title">车辆数据</span>
        <i class="c-dialog-close" @click="closeDialog"></i>
      </div>
      <div class=" road-content">
        <div class="c-scroll-wrap left-width" id="divScroll">
          <div class="c-scroll-inner">
              <ul class="road-content-left">
                <li v-for="item in roadList" @click="getCrossInfo(item)" :class="{active:item.isActive}">
                  <div class="road-map-style" :id="item.id"></div>
                  <p>{{item.crossId}}</p>
                </li>

              </ul>
          </div>
        </div>
        <div class="road-content-right">
          <ul class="road-button-style clearfix">
            <li v-for="item in options" :key="item.id" :class="{active:item.isActive}" @click="getAllRoadsByType(item)">
              {{item.text}}
            </li>
          </ul>
          <div class="c-map-style" id="mapContainer"></div>
        </div>
    </div>
  </div>
  </div>
</template>
<script>
  import ConvertCoord from '@/assets/js/utils/coordConvert.js'
  import {allCross,getCrossById,getCrossPageById} from '@/api/roadMonitor'
    export default {
        data() {
            return {
              mapOption:{
                center: [121.262939,31.245149],
                zoom: 18,
                mapStyle: "amap://styles/bc5a63d154ee0a5221a1ee7197607a00"
              },
              options:[
                {
                  'id':0,
                  'text':'全部',
                  'isActive':true
                },
                {
                  'id':1,
                  'text':'T形路口',
                  'isActive':false
                },
                {
                  'id':2,
                  'text':'十字路口',
                  'isActive':false
                },
                {
                  'id':3,
                  'text':'Y形路口',
                  'isActive':false
                },
                {
                  'id':8,
                  'text':'环形路口',
                  'isActive':false
                }
              ],
              roadList:[],
              pageIndex:0,
              pageSize:5,
              index:0,
              type:null,
              map:{},
              markerList:[],
              pageInitIndex:0,
              totalRoadCount:0,
              webSocket:{},
              crossId:"",
              count:0,
              mapList:[]
            }
        },
      props:{
        dialogVisible: {
          type: Boolean,
          default:false
        },
        selectedItem:{
          type:Object,
          default() {
            return {

            };
          }
        },
        deviceMapId:{
          type:String,
          default:""
        }
      },
      methods: {
        closeDialog(){
          this.$emit("closeDialog");
        },
        getAllCross(param){
          let _this = this;
//          console.log("pageIndex----"+_this.pageIndex);
          allCross(
            {
              'page':{
                'pageIndex': _this.pageIndex,
                'pageSize':_this.pageSize
              },
              'type':_this.type
            }
          ).then((res,index)=>{
            let result = res.data.data.data;
            _this.totalRoadCount = res.data.data.total;
            let position;
           /* _this.roadList=[];*/
            result.forEach((item,index)=>{
              _this.index++;
//              position = ConvertCoord.wgs84togcj02(item.x,item.y);
              position = new AMap.LngLat(item.x,item.y);
              let obj = {};
              obj.id = "road"+_this.index;
              obj.crossId = item.uid;
              obj.position = position;
              obj.isActive=false;
              //向上滚动
              if(param=='up'){
                _this.roadList.unshift(obj);
              }else{
                _this.roadList.push(obj);
              }
            });
            setTimeout(() => {
              _this.roadList.forEach(item=>{
                item.map=new AMap.Map(item.id, this.mapOption);
                let wms  = new AMap.TileLayer.WMS({
                  url:window.config.dlWmsUrl+'geoserver/shanghai_qcc/wms',
                  blend: false,
                  tileSize: 256,
                  params:{'LAYERS': 'shanghai_qcc:dl_shcsq_wgs84_gjlk',VERSION:'1.1.0'}
                })
                wms.setMap(item.map);
                item.map.setCenter(item.position);
                item.map.setZoom(17);
              })
            }, 0);
          })
        },
        scrollHandler(){
          var _this = this;
          let divScroll = document.getElementById("divScroll");
          //获取元素滚动高度
          let scrollTop = divScroll.scrollTop;
          //获取元素的可视高度
          let offsetHeight =  divScroll.offsetHeight;
          //总高度
          let scrollHeight = divScroll.scrollHeight;
          //滚动条滚动到底部
          if(scrollTop+offsetHeight==scrollHeight){
            if(_this.roadList.length==_this.totalRoadCount){
              return;
            }
            //获取下一页的数据
            _this.pageIndex++;
            _this.getAllCross();
          }
          //滚动到顶部
          if(scrollTop==0){
            if(_this.pageInitIndex==0){
              return;
            }else{
              _this.pageInitIndex--;
              _this.pageIndex = _this.pageInitIndex;
              _this.getAllCross('up');
            }
          }
        },
        getAllRoadsByType(item){
          if(item.id==0){
            this.type=null;
            this.options.forEach(item=>{
              if(item.id!=0){
                item.isActive=false;
              }
            })
            if(item.isActive){
              return;
            }
          }else{
            this.options[0].isActive=false;
            //当其他取消选中，则判断是否全部取消选中
            if(item.isActive){
              let flag = false;
              for(let i=0;i<this.options.length;i++){
                if(this.options[i].id!=item.id&&this.options[i].isActive){
                  flag=true;
                }
              }
              if(!flag){
                this.options[0].isActive=true;
                this.type=null;
              }
            }else{
              this.options.forEach(item=>{
                item.isActive=false;
              })
              this.type=item.id;
            }
          }
          item.isActive=!item.isActive;
          this.pageIndex=0;
          this.roadList=[];
          this.index=0;
          this.getAllCross();
        },
        getCrossById(){
          if(this.markerList.length>0){
            this.map.remove(this.markerList);
            this.markerList=[];
          }
          getCrossById({
            "crossId": this.crossId
          }).then(res=>{
            let result = res.data.data;
            let wms  = new AMap.TileLayer.WMS({
              url:window.config.dlWmsUrl+'geoserver/shanghai_qcc/wms',
              blend: false,
              tileSize: 256,
              params:{'LAYERS': 'shanghai_qcc:dl_shcsq_wgs84_gjlk',VERSION:'1.1.0'}
            })
            wms.setMap(this.map);
//            let position = ConvertCoord.wgs84togcj02(result[0].x,result[0].y);
            let position = new AMap.LngLat(result[0].x,result[0].y);
            this.map.setCenter(position);
            let p;
            result.forEach(item=>{
//              p =  ConvertCoord.wgs84togcj02(item.x,item.y);
              p=new AMap.LngLat(item.x,item.y);
              //画灯的位置
              let marker = new AMap.Marker({
                position: p,
                icon: 'static/images/car/car-4.png', // 添加 Icon 图标 URL
              });
              this.markerList.push(marker)
              this.map.add(marker);
            })
          });
        },
        getCrossInfo(item){
          //当选中的
          if(!item.isActive){
            this.roadList.forEach(item=>{
              item.isActive=false;
            })
          }
          item.isActive=!item.isActive;
          if(item.isActive){
            this.crossId = item.crossId;
            this.getCrossById();
            this.webSocket.close();
            this.initWebSocket();
          }
        },
        getCrossPageById(){
          let _this = this;
          getCrossPageById(
            {
              "crossId": this.selectedItem.crossId,
              "page": {

                "pageIndex": 0,
                "pageSize": 5
              }
            }
          ).then(res=>{
            let result = res.data.data.data;
            _this.pageInitIndex = res.data.data.pageIndex;
            _this.pageIndex=_this.pageInitIndex;
            _this.totalRoadCount=res.data.data.total;
            let position;
            /* _this.roadList=[];*/
            result.forEach((item,index)=>{
              _this.index++;
//              position = ConvertCoord.wgs84togcj02(item.x,item.y);
              position = new AMap.LngLat(item.x,item.y);
              let obj = {};
              obj.id = "road"+_this.index;
              obj.crossId = item.uid;
              obj.position = position;
              if(_this.selectedItem.crossId==item.uid){
                obj.isActive=true;
              }else {
                obj.isActive=false;
              }

              _this.roadList.push(obj);
            });
            setTimeout(() => {
              _this.roadList.forEach(item=>{
                item.map=new AMap.Map(item.id, this.mapOption);
                let wms  = new AMap.TileLayer.WMS({
                  url:window.config.dlWmsUrl+'geoserver/shanghai_qcc/wms',
                  blend: false,
                  tileSize: 256,
                  params:{'LAYERS': 'shanghai_qcc:dl_shcsq_wgs84_gjlk',VERSION:'1.1.0'}
                })
                wms.setMap(item.map);
                item.map.setCenter(item.position);
                item.map.setZoom(17);
              })
            }, 0);
          });
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
          if(_this.count==0) {
            //在接受请求前清除地图上的点
            _this.map.remove(_this.mapList);
            _this.mapList = [];
            result.forEach(item => {
              /*  position = ConvertCoord.wgs84togcj02(item.longitude, item.latitude);*/
              position = new AMap.LngLat(item.longitude,item.latitude);
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
            if (this.count == result.length) {
              _this.count = 0;
            }
          }

        },
        onclose(data){
          console.log("结束连接");
        },
        onopen(data){
          //获取在驶车辆状态
          var carStatus = {
            'action':'cross_real_data',
            'token':'tusvn',
            'crossId':this.crossId
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

      watch:{
        dialogVisible(){
          if(this.dialogVisible){
            this.roadList=[];
            this.index=0;
            this.pageIndex=0;
            this.options.forEach(item=>{
              if(item.id==0){
                item.isActive=true;
              }else{
                item.isActive=false;
              }
            })
            this.type=null;
            this.getCrossPageById();
            this.crossId = this.selectedItem.crossId;
            this.getCrossById();
            this.initWebSocket();
          }
        }
      },
      mounted() {
        this.map=new AMap.Map('mapContainer', this.mapOption);
        let divScroll = document.getElementById("divScroll");
        if (this && !this._isDestroyed) {
          divScroll.addEventListener("scroll",this.scrollHandler,true);
        }
      },
      destroy:function () {
        var _self = this;
        var divScroll = document.getElementById("divScroll");
        divScroll.removeEventListener("scroll",_self.scrollHandler,true);
      }
    }
</script>
<style>
  .road-content-left .amap-container{
    cursor: pointer;
  }
</style>
<style lang="scss" scoped>
  @import '@/assets/scss/theme.scss';
  .road-content{
    position: absolute;
    top: 68px;
    left: 0;
    bottom: 0;
    right: 0;
    .left-width{
      width: 256px;
    }
  }
  .road-content-left{
    width: 220px;
    padding: 16px 18px;
    li{
      width: 100%;
      height: 146px;
      margin-bottom: 8px;
      cursor: pointer;
      border:1px solid #262626;
      .road-map-style{
        height: 110px;
      }
      p{
        text-align: center;
      }
    }
  }
  .road-content-right{
    background: #222222;
    position: absolute;
    top: 0;
    left: 256px;
    bottom: 0;
    right: 0;
    .road-button-style{
      position: absolute;
      z-index:1;
      top: 20px;
      right: 20px;
      li{
        float: left;
        border:1px solid #5e5970;
        margin-right: 10px;
        width: 100px;
        height: 30px;
        padding: 5px;
        box-sizing: border-box;
        @include layoutMode();
        cursor: pointer;
        background: #2a2a2a;
      }
    }
  }
  .active{
    color: #dc8c00;
    border:1px solid #dc8c00!important;
  }
</style>
