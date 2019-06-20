<template>
  <div class="c-dialog-wrapper" v-show="dialogVisible">
    <div class="c-dialog-container" >
      <div class="c-dialog-header">
        <span class="c-dialog-title">路侧点数据</span>
        <i class="c-dialog-close" @click="closeDialog"></i>
      </div>
      <div class="device-dialog-content">

        <div class="side-device-left">
          <ul class="device-left-ul clearfix">
            <li>
              <el-select v-model="provinceValue" placeholder="请选择"  @change="getCitys" >
                <el-option
                  v-for="item in provinceOptions"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code">
                </el-option>
              </el-select>
            </li>
            <li >
              <el-select v-model="cityValue" placeholder="请选择" @change="getTree">
                <el-option
                  v-for="item in cityOptions"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code">
                </el-option>
              </el-select>
            </li>
          </ul>
          <div>
            <div class="side-device-detail">
              <span>路侧点总数:</span>
              <span class="device-detail-style">{{roadDevicePoint.rspCount}}</span>
            </div>
            <div class="side-device-detail">
              <span>路侧设备数:</span>
              <span class="device-detail-style">{{roadDevicePoint.devCount}}</span>
            </div>
          </div>
          <div class="device-distribute">
            <el-tree :data="treeData" :props="props" lazy :load="loadNode"  @node-click="handleNodeClick"
                     highlight-current node-key="code" ref="tree" :default-expanded-keys="defaultArr"></el-tree>
          </div>
        </div>
        <div class="side-device-right c-scroll-wrap">
          <div class="time-style">
            <span class="t-class">2019-06-14 16:59:57.439</span>
          </div>
          <tusvn-map :target-id="deviceMapId" ref="tusvnMap3" @showTimeStamp="showTimeStamp" @mapcomplete="mapcomplete" v-if="dialogVisible">

          </tusvn-map>
          <div class="side-device-list">
            <p class="side-device-title">设备列表</p>
            <div class="device-list-style">
              <div class="table-header-group">
                <ul class="table-row">
                  <li class="table-cell device-num">设备编号</li>
                  <li class="table-cell device-style">联网状态</li>
                  <li class="table-cell device-style">开启监控</li>
                </ul>
              </div>
              <div class="table-row-group">
                <ul class="table-row" v-for="(item,index) in deviceList" :key="item.deviceId">
                  <li class="table-cell device-num">
                    <img src="@/assets/images/monitorManage/monitor-3.png" class="monitor-device-img-1" v-if="item.deviceType=='N'"/>
                    <img src="@/assets/images/monitorManage/monitor-4.png" class="monitor-device-img-2" v-else="item.deviceType=='D'"/>
                    <span class="monitor-device-text">{{item.deviceId}}</span>
                  </li>
                  <li class="table-cell">
                    <span class="monitor-device-symbol" :class="[item.workStatus==1?'online':'offline']"></span>
                  </li>
                  <li class="table-cell">
                    <div class="c-switch-style" :class="[item.value?active:unActive]" @click="switchChange(item)" v-show="item.deviceType=='N'">
                      <i></i>
                    </div>
                  </li>
                </ul>

              </div>
            </div>
            <p class="side-device-title">监控视频</p>
            <div class="device-video-style">
              <video-player class="vjs-custom-skin" :options="option" ></video-player>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import {getDeviceList,getVideoByNum,getSideTree,getDevListByRoadId,getDeviceCountByCity} from '@/api/sideDeviceMonitor'
  import TusvnMap from '@/components/Tusvn3DMap2'
  const isProduction = process.env.NODE_ENV === 'production'
    export default {
      name: "SideDialog",
        data() {
            return {
              /*dialogVisible:false,*/
              option:{},
              provinceOptions: [],
              provinceValue: '',
              cityOptions:[],
              treeList:[],//存放返回的数据
              cityValue:'',
              props:{
                label: 'name',
                children: 'children',
                code:'code',
                type:'type',
                isLeaf:'leaf'
              },
              deviceList:[],
              active:'active',
              unActive:'close-active',
              provinceCode:'',
              cityCode:'',
              regionList:[],
              treeData:[],
              openVideoList:[],
              defaultArr: [],//默认展开
              selectAddr:[],//第一次默认选中的地址
              isFirst:true,//第一次展开，
              roadDevicePoint:{},
              time:''
            }
        },
      components:{
        TusvnMap
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
          getPlayerOptions(){
            var option={
              overNative: true,
              autoplay: true,
              controls: true,
              fluid: true,
              techOrder: ['flash', 'html5'],
              sourceOrder: true,
              flash: {
                swf: isProduction ? '/dataMonitor/static/media/video-js.swf' : '/static/media/video-js.swf'
              },
              sources: [
                {
                  type: 'rtmp/mp4',
                  src: ''
                }
              ],
              muted:true,
              width:'100%',
              height:'100%'
            }
            return option;
          },
          getDeviceList(roadId){
            var _this = this;
            _this.deviceList=[];
            getDeviceList({
              /*'roadSiderId': '130101_001',*/
              'roadSiderId': roadId,
            }).then(res => {

              _this.deviceList = res.data;
              var flag=true;
              var serialNum = "";
              _this.deviceList.forEach(function (item, index) {

                //第一次默认并且是摄像头而且在线设置其打开状态
                if(flag&&item.deviceType=='N'&&item.workStatus==1){
                  if(_this.selectedItem.camSerialNum==""){
                    flag=false;
                    //设置默认的选中值
                    _this.$set(item, 'value', true);
                    _this.openVideoList.push(item);
                    serialNum = item.serialNum;
                  }else{
                    _this.$set(item, 'value', false);
                    if(item.serialNum==_this.selectedItem.camSerialNum){
                      flag=false;
                      //设置默认的选中值
                      _this.$set(item, 'value', true);
                      _this.openVideoList.push(item);
                      serialNum = item.serialNum;
                    }
                  }
                  if(serialNum!=""){
                    getVideoByNum({
                      "protocal": 1,
                      /*"serialNum": "3402000000132000001401"*/
                      "serialNum": serialNum
                    }).then(res => {
                      var options = _this.getPlayerOptions();
                      options.sources[0].src =  res.data.rtmp;
                      _this.option =options;
                    })
                  }
                }else{
                  _this.$set(item, 'value', false);
                }
                /*_this.flagObj.push(true);*/

                /* item.value=true;*/
              })
            })
          },
          switchChange(item){
            var _this = this;
            //如果设备不在线进行提示
            if(item.workStatus!=1){
              _this.$message.error("设备不在线");
              return;
            }
            item.value=!item.value
            if(item.value){
              //如果开启一个摄像头，则将另一个开启的摄像头关闭
              _this.openVideoList.forEach(function (item1,index) {
                _this.deviceList.forEach(function (item2) {
                  if(item1.deviceId==item2.deviceId){
                    item2.value=false;
                    //将原来的删除
                    _this.openVideoList.splice(index,1);
                  }
                })
              })
              _this.openVideoList.push(item);
              //根据摄像头调取视频
//              var rtmp = _this.getVideoByNum(item.serialNum);
              getVideoByNum({
                "protocal": 1,
                /*"serialNum": "3402000000132000001401"*/
                "serialNum": item.serialNum
              }).then(res => {
                var options = _this.getPlayerOptions();
                options.sources[0].src =  res.data.rtmp;
                _this.option =options;
              })

            }else{
              var options = _this.getPlayerOptions();
              options.sources[0].src =  '';
              _this.option =options;
            }
          },
          loadNode(node, resolve){
            var _this = this;
            //懒加载路
            if(node.level==1){
              var children = [];
              _this.regionList.forEach(function (item) {
                if(item.code==node.data.code){
                  var list = item.dataList;
                  list.forEach(function (item1) {
                    var obj={};
                    obj.name=item1.name;
                    /*obj.leaf=true;*/
                    obj.code = item1.code;
                    obj.type = 2;
                    children.push(obj);
                  })
                }
              })
              resolve(children);
              if(_this.isFirst){
                _this.defaultArr.push(_this.selectAddr[3]);
                _this.isFirst = false;
              }
              return ;
            }
            if (node.level > 2) return resolve([]);

            if(node.level==2){
              getDevListByRoadId({
                'roadId':node.data.code
              }).then(res=>{
                var deviceList = res.data;
                var children=[];
                if(deviceList.length>0){
                  //默认选中的样式
                  var roadId = _this.selectedItem.roadSiderId;
                  /*var roadId = '110108_002';*/
                  deviceList.forEach(function (item1) {
                    var obj={};
                    obj.name=item1.rsPtId;
                    obj.code = item1.rsPtId;
                    obj.type = 3;
                    obj.leaf=true;
                    children.push(obj);
                    /*if(item1.rsPtId==roadId){
                      _this.$refs.tree.setCurrentKey(roadId);
                    }*/
                  })
                }
                resolve(children);
                //设置点击后默认选中项
                _this.$refs.tree.setCurrentKey(roadId);
                return ;
              })
            }


            /*var hasChild = true;
            if(node.level == 1) {
              let data = [];
              if (hasChild) {
                var areaArray = this.newData[0].children;
                for(var i=0;i<areaArray.length;i++){
                  var obj = {};
                  obj.label = areaArray[i].label;
                  obj.code = areaArray[i].code;
                  data.push(obj);
                }
              } else {
                data = [];
              }
              resolve(data);
            }
            if(node.level == 2) {
              let data = [];
              this.$api.post('dataPlatApp/road/queryRoadCamList',{
                roadCode:node.data.code
              },response => {
                if(response.status >= 200 && response.status < 300){
                  if(response.data.code == 200){
                    var roadCode = this.newData[0].children;
                    var protocal = JSON.stringify(response.data.data[0].protocol);
                    localStorage.setItem('protocal',protocal);
                    var camDetail = response.data.data;
                    for(var i=0;i<camDetail.length;i++){
                      var obj = {};
                      obj.label = camDetail[i].deviceId;
                      obj.serialNum = camDetail[i].serialNum;
                      obj.rsPtName = camDetail[i].rsPtName;
                      obj.rsPtId = camDetail[i].rsPtId;
                      obj.ptLon = camDetail[i].ptLon;
                      obj.ptLat = camDetail[i].ptLat;
                      obj.cameraRunStatus = camDetail[i].cameraRunStatus;
                      data.push(obj);
                    }
                    resolve(data);
                  }
                }
              })
            }
            if(node.level == 3) {
              resolve([]);
            }*/
          },
          handleNodeClick(node,resolve){
            //当切换树的时候，设备列表，感知结果进行切换
            this.getDeviceList(node.code);
          },
          getSideTree(){
            var _this = this;
            _this.treeList=[];
            //当点击某一个路侧设备后，默认选中的项

            getSideTree().then(res=>{
              _this.treeList = res.data;
              _this.provinceOptions=[];
              if(_this.treeList.length>0){
                _this.treeList.forEach(function (item) {
                  var obj={};
                  obj.code = item.code;
                  obj.name = item.name;
                  _this.provinceOptions.push(obj);
                })
              }
              if(_this.isFirst){
                _this.provinceCode=_this.selectAddr[0];
                _this.provinceValue=_this.selectAddr[0];
                _this.getCitys(_this.provinceCode);
                _this.cityCode=_this.selectAddr[1];
                _this.cityValue=_this.selectAddr[1];
                var childrenNodes = this.$refs.tree.children;
                _this.removeTree(childrenNodes);
                _this.getRegion();
              }
            });

          },
          getCitys(code){
            var _this = this;
            _this.cityValue='';
            _this.provinceCode=code;
            _this.cityOptions=[];
            _this.treeList.forEach(function (item) {
              if(item.code==code){
                var cityList = item.dataList;
                cityList.forEach(function (e) {
                  var obj={};
                  obj.code = e.code;
                  obj.name = e.name;
                  _this.cityOptions.push(obj);
                })
              }
            })
          },
          getTree(code){
            var _this = this;
            _this.cityCode=code;
            var childrenNodes = this.$refs.tree.children;
            _this.removeTree(childrenNodes);
            _this.getRegion();
            _this.getDeviceCountByCity();
          },
          getRegion(){
            var _this = this;
            _this.treeList.forEach(function (item) {
              if(item.code==_this.provinceCode){
                var cityList = item.dataList;
                cityList.forEach(function (e) {
                  if(e.code==_this.cityCode){
                    //找到市辖区
                    _this.regionList = e.dataList;
                    _this.regionList.forEach(function (item) {
                      //绘制树
                      var obj={};
                      obj.name=item.name;
                      /*obj.leaf=true;*/
                      obj.code = item.code;
                      obj.type = 1;
                      /*  var children = [];
                        var childrenList = item.dataList;
                        //找到路
                        childrenList.forEach(function (item1) {
                          var  obj1 = {};
                          obj1.name =item1.name;
                          obj1.leaf = true;
                          children.push(obj1);
                        })
                        obj.children=children;*/
                      _this.treeData.push(obj);

                    })
                  }
                })
                if(_this.isFirst){
                  _this.defaultArr.push(_this.selectAddr[2]);
                }
              }
            })
          },
          getDevListByRoadId: function (roadId) {
            getDevListByRoadId({
              'roadId': roadId
            }).then(res => {

            })
          },
          removeTree(childrenNodes){
            var _this = this;
            if(childrenNodes){
              childrenNodes.forEach(function (item) {
                _this.$refs.tree.remove(item);
              })
            }


          },
          getDeviceCountByCity(){
            getDeviceCountByCity({
              "distCodeCity":this.cityCode
            }).then(res=>{
              this.roadDevicePoint = res.data;
            });
          },
          closeDialog(){
//            this.dialogVisible=false;
            var options = this.getPlayerOptions();
            options.sources[0].src =  '';
            this.option =options;

            this.$emit("closeDialog");
          },
          showTimeStamp(time){
            this.time = time;
          },
          mapcomplete:function(){
            this.$refs.tusvnMap3.changeRcuId(window.cfg.websocketUrl,this.selectedItem.roadSiderId);
            this.$refs.tusvnMap3.updateCameraPosition(442454.32657890377,4427227.807879115,37.7350947252935, 0.0000028926452461693342, -0.39699074074074336, -0.730706721974606);
          }
        },
        watch:{
          dialogVisible(){
            if(this.dialogVisible){
              this.selectAddr = this.selectedItem.path.split("|");
             /* this.dialogVisible=true;*/
              //默认选中的
              this.getDeviceList(this.selectedItem.roadSiderId);
              this.getSideTree();
              this.getDeviceCountByCity();

            }
          }
        },
        mounted() {

        }
    }
</script>
<style>
  .vjs-custom-skin > .video-js .vjs-big-play-button{
    display: none!important;
  }
  .device-video-style .video-js{
    height: 240px;
  }
  .device-left-ul .el-input__inner{
    background-color: #262626 ;
    border:1px solid #5e5970;
    -webkit-border-radius: 0px;
    -moz-border-radius: 0px;
    border-radius: 0px;
    width: 90px;
    height: 30px;
  }
  .device-left-ul .el-select .el-input.is-focus .el-input__inner,.el-select .el-input__inner:focus{
    border-color: #5e5970;
  }
  .el-popper .popper__arrow, .el-popper .popper__arrow::after{
    border-style:none!important;
  }
  .el-select-dropdown{
    background-color: #262626!important;
    border:1px solid #535457!important;
    margin-top: -2px !important;
  }

  .el-select-dropdown__list{
    padding: 0px !important;
  }
  .device-distribute .el-tree{
    background: #262626;
    color: #cccccc;
  }
  /*  .device-distribute .el-tree-node__expand-icon{
      color: #5e5970;
    }*/

  .device-distribute  .el-tree-node.is-current > .el-tree-node__content {
    color: #ba7907;
  }
  .device-distribute  .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content{
    background-color: transparent;
  }

  .device-distribute .el-tree-node__content:hover{
    background-color: #262626;
  }
  .device-distribute .el-tree-node:focus>.el-tree-node__content{
    background-color: #262626;
  }
</style>

<style lang="scss" scoped>

  .online{
    background-color: #19cd2e;
  }
  .offline{
    background-color: #cd4642;
  }
  .active{
    background: #dc8c00;
  i{
    right:0;
  }
  }
  .close-active{
    background: #5e5970;
  i{
    left:0;
  }
  }
  .c-switch-style{
    width: 36px;
    height: 14px;
    border-radius: 7px;
    /*background: #5e5970;*/
    position: relative;
    display: inline-block;
    cursor: pointer;
  i{
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #fff;
    position: absolute;
    /* left:0;*/
  }
  }
  .device-dialog-content{
    position: absolute;
    left:0;
    right:0;
    top: 69px;
    bottom:0;
    padding:20px 0px 0px 20px;
    .side-device-left{
      width: 264px;
      height: 100%;

      .device-left-ul{
        /*margin-bottom: 20px;*/
        li{
          float: left;
          width: 90px;
          margin-right:10px;
          line-height: 40px;
        }
      }
      .side-device-detail{
        display: inline-block;
        font-size: 12px;
      }
      .device-detail-style{
        color: #dc8c00;
      }
      .device-distribute{
        margin-top: 10px;
      }
    }
    .side-device-right{
      position: absolute;
      top: 0!important;
      left: 296px;
      bottom: 0!important;
      right: 0;
      .time-style{
        position: absolute;
        top: 20px;
        left: 10px;
        height:40px;
        color: #736e6e;
        z-index:1;
        .t-class{
          width: 250px;
          text-align: left;
          display: block;
          font-size: 12px;
        }
      }
    }
    .side-device-list{
      position: absolute;
      right: 0;
      top:0;
      width: 400px;
      background-color: #000;
      cursor: pointer;
      .side-device-title{
        position: relative;
        font-size: 16px;
        margin-top: 14px;
        margin-bottom: 6px;
        color: #ffffff;
        padding-left: 10px;
        &:before{
          content: '';
          width: 2px;
          height: 16px;
          position: absolute;
          top:50%;
          left:0;
          margin-top: -8px;
          background:#37ba7b ;
        }
      }
      .device-list-style{
        display:table;
        border:1px solid #5e5970;
        border-collapse:collapse;
        width: 370px;
        text-align: center;
        margin-bottom: 20px;
        .table-header-group{
          display:table-header-group;
          font-weight:bold;

        }
        .table-row{
          display:table-row;
          border-bottom:1px solid #5e5970;
          .table-cell{
            display:table-cell;
            padding:0 5px;
          }
          .device-num{
            width:40%;
          }
          .device-style{
            width:30%;
          }
        }
        .table-row-group{
          display:table-row-group;
          .table-row{
            line-height: 32px;
          }

        }
        .monitor-device-symbol{
          width: 10px;
          height: 10px;
          border-radius: 50%;
          /* background-color: #19cd2e;*/
          display: inline-block;
        }
        .monitor-device-img-1{
          width:20px;
        }
        .monitor-device-img-2{
          width:16px;
          padding: 0px 2px;
        }
        .monitor-device-text{
          font-size: 12px;
          color: #ccc;
        }
      }
      .device-video-style{
        width: 370px;
        height: 240px;
        border:1px solid #5e5970;
      }
    }
  }
</style>
