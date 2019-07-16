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
            <li v-for="item in options" :key="item.id" :class="{active:item.isActive}" @click="getAllRoads(item)">
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
  import {allCross,getCrossById} from '@/api/roadMonitor'
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
              isFirst:true
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
        getAllCross(){
          let _this = this;
          allCross(
            {
              'page':{
                'pageIndex': _this.pageIndex,
                'pageSize':_this.pageSize,
                'type':_this.type
              }
            }
          ).then((res,index)=>{
            let result = res.data.data.data;
            let position;
           /* _this.roadList=[];*/
            result.forEach((item,index)=>{
              _this.index++;
              position = ConvertCoord.wgs84togcj02(item.x,item.y);
              let obj = {};
              obj.id = "road"+_this.index;
              obj.crossId = item.uid;
              obj.position = position;
              obj.isActive=false;
              _this.roadList.push(obj);

            });
            setTimeout(() => {
              _this.roadList.forEach(item=>{
                item.map=new AMap.Map(item.id, this.mapOption);
                let wms  = new AMap.TileLayer.WMS({
                  url:'http://10.0.1.22:8080/geoserver/shanghai_qcc/wms',
                  blend: false,
                  tileSize: 256,
                  params:{'LAYERS': 'shanghai_qcc:gd_road_centerline',VERSION:'1.1.0'}
                })
                wms.setMap(item.map);
                item.map.setCenter(item.position);
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
            //获取下一页的数据
            _this.pageIndex++;
            _this.getAllCross();
          }
          //滚动到顶部
          if(scrollTop==0&&_this.isFirst){
            if(_this.pageIndex==0){
              return;
            }else{
              _this.pageIndex--;
              _this.getAllCross();
              _this.isFirst=false;
            }
          }
        },
        getAllRoads(item){
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
          this.getAllCross();
        },
        getCrossById(crossId){
          if(this.markerList.length>0){
            this.map.remove(this.markerList);
            this.markerList=[];
          }
          getCrossById({
            "crossId": crossId
          }).then(res=>{
            let result = res.data.data;
            let wms  = new AMap.TileLayer.WMS({
              url:'http://10.0.1.22:8080/geoserver/shanghai_qcc/wms',
              blend: false,
              tileSize: 256,
              params:{'LAYERS': 'shanghai_qcc:gd_road_centerline',VERSION:'1.1.0'}
            })
            wms.setMap(this.map);
            let position = ConvertCoord.wgs84togcj02(result[0].x,result[0].y);
            this.map.setCenter(position);
            let p;
            result.forEach(item=>{
              p =  ConvertCoord.wgs84togcj02(item.x,item.y);
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
            this.getCrossById(item.crossId);
          }
        }
      },

      watch:{
        dialogVisible(){
          if(this.dialogVisible){
            this.roadList=[];
            this.options.forEach(item=>{
              if(item.id==0){
                item.isActive=true;
              }else{
                item.isActive=false;
              }
            })
            this.type=null;
            this.getAllCross();
            this.getCrossById(this.selectedItem.crossId);
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
      }
    }
  }
  .active{
    color: #dc8c00;
    border:1px solid #dc8c00!important;
  }
</style>
