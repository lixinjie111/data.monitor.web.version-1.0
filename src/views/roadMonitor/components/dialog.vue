<template>
  <div class="c-dialog-wrapper">
    <div class="c-dialog-container" >
      <div class="c-dialog-header">
        <span class="c-dialog-title">路口监控</span>
        <i class="c-dialog-close" @click="closeDialog"></i>
      </div>
      <div class=" road-content">
        <div class="c-scroll-wrap left-width" id="divScroll" ref="divScroll">
          <div class="c-scroll-inner">
              <ul class="road-content-left">
                <li v-for="item in roadList" @click="getCrossInfo(item)" :key="item.id" :class="{active:item.isActive}">
                  <div class="road-map-style" :id="item.id"></div>
                  <p>{{item.crossName || item.crossId}}</p>
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
          <!-- <div class="c-map-style" id="mapContainer"></div> -->
          <!-- <tusvn-map 
            class="c-map-style" 
            ref="refTusvnMap" 
            style="height: 998px;"  
            targetId="ddd" 
            overlayContainerId="ccc" 
            :isMasker='false' 
            :isCircle='false' 
            @MapClick="mapClick" 
            @ExtentChange="extentChange" 
            @ViewLevelChange="viewLevelChange" 
            @MapInitComplete='mapInitComplete'
            @setPointer='setPointer' 
            @PublishInfo='publishInfo' 
            @UpdateInfo='updateInfo' 
            @DestroyInfo='destroyInfo' 
            @TemporaryClearPubMsg='temporaryClearPubMsg($event)'>
		      </tusvn-map> -->
          <tusvn-map
                  ref="refTusvnMap"
                  targetId="refTusvnMap"
                  overlayContainerId="overlay1"
                  :isMasker='false'
                  :isCircle='false'
                  @ExtentChange="extentChange" 
                  @MapInitComplete='mapInitComplete'>
          </tusvn-map>
        </div>
    </div>
  </div>
  </div>
</template>
<script>
  import ConvertCoord from '@/assets/js/utils/coordConvert.js'
  import TusvnMap from './TusvnMap.vue';
  import {allCross,getCrossById,getCrossPageById} from '@/api/roadMonitor'
    export default {
      	components: {
          TusvnMap
        },
        data() {
            return {
              mapOption:{
                center: window.mapOption.defaultCenterPoint,
                zoom: 18,
                mapStyle: window.mapOption.mapStyleEmpty
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
              prevPageIndex:null,
              nextPageIndex:null,
              pageSize:5,
              index:0,
              type:null,
              map:{},
              markerList:[],
              pageInitIndex:0,
              totalRoadCount:0,
              webSocket:null,
              crossId:"",
              count:0,
              // mapList:[],
              wms:null,
              finalFourPosition: [],
              prevData: {},
              prevLight:[],
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
      watch:{
        "finalFourPosition"(newVal, oldVal) {
            if(this.webSocket) {
              this.onopen();
            }else {
              this.initWebSocket();
            }
        }
      },
      mounted() {
       
      },
      methods: {
         mapInitComplete(){
            this.$refs.refTusvnMap.centerAt(window.mapOption.defaultCenterPoint[0],window.mapOption.defaultCenterPoint[1]);   
            this.$refs.refTusvnMap.addWms(
              window.dlWmsOption.LAYERS_gjlk,
              window.dlWmsDefaultOption.url,
              window.dlWmsOption.LAYERS_gjlk,
              "",
              1,true,null
            ); // 上海汽车城

            this.getCrossPageById();
            this.crossId = this.selectedItem.crossId;
            this.getCrossById();

            // this.map = new AMap.Map('mapContainer', this.mapOption);
            // setTimeout(()=>{
            //     this.map.setMapStyle(window.mapOption.mapStyleEmpty);
            // },0);
          
          
            let divScroll = document.getElementById("divScroll");
            if (this && !this._isDestroyed) {
              divScroll.addEventListener("scroll",this.scrollHandler,true);
            }
        },
        extentChange(){
          this.getFourPosition();
        },
        // 获取四周的经纬度
        getFourPosition() {
          let finalFourPosition = [];
          let bounds = {};
          let northEast = [];
          let southWest = [];
          let northWest = [];
          let southEast = [];
          let southwest;
          let northeast;
          let x = 0.0005;
          let y = 0.0003;
          
          let boundsArr = this.$refs.refTusvnMap.getCurrentExtent();   
          
          bounds.southwest = {
            lng:boundsArr[0],
            lat:boundsArr[1]
          }
          bounds.northeast = {
            lng:boundsArr[2],
            lat:boundsArr[3]
          }
          // 西南
          southWest.push(bounds.southwest.lng - x);
          southWest.push(bounds.southwest.lat - y);
          finalFourPosition.push(southWest);
          // 西北
          northWest.push(bounds.southwest.lng - x);
          northWest.push(bounds.northeast.lat + y);
          finalFourPosition.push(northWest);
          // 东北
          northEast.push(bounds.northeast.lng + x);
          northEast.push(bounds.northeast.lat + y);
          finalFourPosition.push(northEast);
          // 东南
          southEast.push(bounds.northeast.lng + x);
          southEast.push(bounds.southwest.lat - y);
          finalFourPosition.push(southEast);
          southwest = [bounds.southwest.lng, bounds.southwest.lat];
          northeast = [bounds.northeast.lng, bounds.northeast.lat];
     
          this.finalFourPosition = finalFourPosition;  
        
        },
        closeDialog(){
          this.clearCars();
          this.clearLight();
          this.webSocket && this.webSocket.close();
          var divScroll = document.getElementById("divScroll");
          divScroll.removeEventListener("scroll",this.scrollHandler,true);
          this.$emit("closeDialog");
        },
        getAllCross(param){
          let _this = this;
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
            let roadListTmp = [];
            result.forEach((item,index)=>{
              _this.index++;
//              position = ConvertCoord.wgs84togcj02(item.x,item.y);
              position = new AMap.LngLat(item.x,item.y);
              let obj = {};
              obj.id = "road"+_this.index;
              obj.crossId = item.uid;
              obj.position = position;
              obj.crossName = item.crossName;
              obj.isActive=false;
              //向上滚动
              if(param=='up'){
                // _this.roadList.unshift(obj);
              
                roadListTmp.push(obj)
              }else{
                _this.roadList.push(obj);
              }
            });
            if(param == 'up'){
              _this.roadList = roadListTmp.concat(_this.roadList);
              roadListTmp = [];
            }
            setTimeout(() => {
              _this.roadList.forEach(item=>{
                item.map=new AMap.Map(item.id, this.mapOption);
                setTimeout(()=>{
                      item.map.setMapStyle(window.mapOption.mapStyleEmpty);
                },0);
                item.map.setStatus({zoomEnable:false});
                item.map.setStatus({dragEnable:false});
                let _optionWms = Object.assign(
                    {},
                    window.dlWmsDefaultOption,
                    {
                        params:{'LAYERS': window.dlWmsOption.LAYERS_gjlk, 'VERSION': window.dlWmsOption.VERSION}
                    }
                );

                let _wms  = new AMap.TileLayer.WMS(_optionWms);
                _wms.setMap(item.map);


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
            _this.nextPageIndex++;
            _this.pageIndex = _this.nextPageIndex;
            _this.getAllCross();
          }
          //滚动到顶部
          if(scrollTop==0){
            if(_this.prevPageIndex==0){
              return;
            }else{
              
              _this.prevPageIndex--;
              _this.pageIndex = _this.prevPageIndex;
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
          this.$refs.divScroll.scrollTop = 0;
          this.pageIndex=0;
          this.roadList=[];
          this.index=0;
          this.getAllCross();
        },
        getCrossById(item){
          getCrossById({
            "crossId": this.crossId
          }).then(res=>{
            if(res.data.state!=1){
              this.$message({
                type: 'error',
                duration: '1500',
                message: res.data.message,
                showClose: true
              });
              return;
            }
            let result = res.data.data;
          
            // 清空车辆
            this.clearCars();
            this.clearLight();
         
            setTimeout(() => {
              this.$refs.refTusvnMap.zoomTo(18);
              if(item){
                this.$refs.refTusvnMap.centerAt(item.position.lng,item.position.lat);
              }else{
                if(result.length) {
                  this.$refs.refTusvnMap.centerAt(result[0].centerX,result[0].centerY);
                }else{
                  this.$refs.refTusvnMap.centerAt(this.selectedItem.baseData.x,this.selectedItem.baseData.y);
                }
              }
            }, 0);
            result.forEach(item=>{
              this.prevLight.push(item.uid);
              let id = item.uid;
              let imgUrl =  'static/images/car/car-4.png';
              let courseAngle = null;
              let bdata = null;
              let offset = [0,0];
              let callback = null;
              this.$refs.refTusvnMap.addImgOverlay(id, 
                imgUrl, 
                courseAngle, 
                item.centerX,
                item.centerY, 
                bdata, 
                offset, 
                callback
              );   

            })
          });
        },
        getCrossInfo(item){
          //当选中的
          if(!item.isActive){
            this.roadList.forEach(item=>{
              item.isActive=false;
            });
            item.isActive = true;
            this.crossId = item.crossId;
            this.getCrossById(item);
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
            _this.prevPageIndex = _this.pageInitIndex;
            _this.nextPageIndex = _this.pageInitIndex;

            
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
              obj.crossName = item.crossName;
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
                setTimeout(()=>{
                      item.map.setMapStyle(window.mapOption.mapStyleEmpty);
                },0);
                item.map.setStatus({zoomEnable:false});
                item.map.setStatus({dragEnable:false});
                let _optionWms = Object.assign(
                    {},
                    window.dlWmsDefaultOption,
                    {
                        params:{'LAYERS': window.dlWmsOption.LAYERS_gjlk, 'VERSION': window.dlWmsOption.VERSION}
                    }
                );
                let _wms  = new AMap.TileLayer.WMS(_optionWms);
                _wms.setMap(item.map);
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
          let result = json.result.vehDataDTO;
          // 车辆3
        
          if (result.length > 0) {
            let _filterResult = result;
            _filterResult = _filterResult.filter(
              x => x.targetType === 2 || x.targetType === 5
            );
            let _filterData = {};
            _filterResult.forEach((item, index) => {
              _filterData[item.vehicleId] = {
                longitude: item.longitude,
                latitude: item.latitude,
                heading: item.heading,
                speed: item.speed,
                vehicleId: item.vehicleId,
                marker: null,
              };
            });

            for (let id in _this.prevData) {
              if(_filterData[id]) {   //表示有该点，做move
                _filterData[id].marker = _this.prevData[id].marker;
                let _currentCar = _filterData[id];
                _this.$refs.refTusvnMap.setOverlayPosition(id,_currentCar.longitude, _currentCar.latitude,_currentCar.heading)
              } else {   //表示没有该点，做remove
           
                _this.$refs.refTusvnMap.removeOverlayById(id);
                delete _this.prevData[id];
              }
            }
         
            for (let id in _filterData) {
              if(!_this.prevData[id]) {   //表示新增该点，做add
                  let imgUrl =  "static/images/road/car.png";
                  let courseAngle = _filterData[id].heading;
                  let bdata = null;
                  let offset = [0,0];
                  let callback = null;
                 
                  _this.$refs.refTusvnMap.addImgOverlay(
                    id, 
                    imgUrl, 
                    courseAngle, 
                    _filterData[id].longitude,
                    _filterData[id].latitude,
                    bdata, 
                    offset, 
                    callback
                  );  
         
              }
            }
            _this.prevData = _filterData;

          } else {
            // 返回的数据为空
            this.clearCars();
          }
        },
        clearCars() {
          for (let id in this.prevData) {
            this.$refs.refTusvnMap.removeOverlayById(id);
          }
          this.prevData = {};
        },
        clearLight(){
          this.prevLight.map((i)=>{
            this.$refs.refTusvnMap.removeOverlayById(i);
          })
          this.prevLight = [];
        },
        onclose(data){
          this.webSocket = null;
          console.log("结束连接");
        },
        onopen(data){
          //获取在驶车辆状态
          let _params = {
            action: "road_real_data_reg",
            data: {
              polygon: this.finalFourPosition,
              fuselType: 1
            }
          };
          var _paramsMsg = JSON.stringify(_params);
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
