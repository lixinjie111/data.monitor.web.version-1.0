<template>
  <div class="monitor-right">
    <div class="c-scroll-wrap">
      <div class="c-scroll-inner">
        <p class="monitor-title c-title">车端视频</p>
        <div class="monitor-video right-title">
          <live-player
                  :isStretch="true"
                  :requestVideoUrl="startStream"
                  :params="streamParam"
                  type="rtmp"
                  :autoplay="false"
                  ref="player"
                  @videoLoadCompleted="videoLoadCompleted"
          >
          <span></span>
          </live-player>
          <div class="stop-style" v-show="isStop">
            <img src="@/assets/images/car/stop.png"/>
            <p>无数据提示</p>
          </div>
        </div>
        <p class="monitor-title c-title">车端感知</p>
        <div class="monitor-perception right-title">
          <div class="car-container" :style="{transform:'rotate(-'+currentCar.heading+'deg)'}">
            <img src="@/assets/images/car/car-11.png" class="host-vehicle" :style="{transform:'rotate('+currentCar.heading+'deg)'}"/>
            <div class="otherCarsContainer">
              <div class="item" v-for="(carItem,index) in carsDataformate" :style="{left:carItem.Sx+'px',top:carItem.Sy+'px',transform:'rotate('+carItem.heading+'deg)'}">
                  <img src="@/assets/images/car/car-17.png" class="car-position1"/>
              </div>
            </div>
          </div>
          <div class="stop-style" v-show="isStop">
            <img src="@/assets/images/car/stop.png"/>
            <p>无数据提示</p>
          </div>
        </div>
        <p class="monitor-title c-title">行车日历</p>
        <div class="drive-container" id="driveContainer">

        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import { getVehicleCalendarData, getLiveDeviceInfo, startStream, sendStreamHeart } from '@/api/carMonitor'
  import $echarts from 'echarts'
  import LivePlayer from '@/components/livePlayer/template';
  const isProduction = process.env.NODE_ENV === 'production'
  export default {
    data () {
      return {
        calendarMap:{},
        mapData:[],
        liveDeviceInfo:{},
        streamInfo:{},
        timer:{},
        vehicleId: this.$route.params.vehicleId,//车辆id
        socket:'',
        screenConfig:{
            scrWidth: 270, //屏幕宽 px
            scrHeight: 180, //屏幕高 
            
            // showHeight: 1800000, //显示高 m
            showHeight: 300, //显示高 m
            meterPerDegree: 108000, //1度=108000 m 固定值
            scalefactor: 0,//一个像素相当于多少度
        },
        //自车数据
        currentCar:{},
        carsData:[],
        rtmp:'',
        startStream: startStream,
        streamParam: {}
      }
    },
    components: { LivePlayer },
    props:{
      isStop:{
        type:Boolean,
        default:false
      }
    },
    created() {
      // this.rtmp = 'rtmp://218.76.44.22:10085/hls/EasyGBS3402000005132000001534020000051320000015?sign=MVoQPApWg';
      this.screenConfig.scalefactor = this.screenConfig.showHeight/(this.screenConfig.scrHeight*this.screenConfig.meterPerDegree);
    },
    watch:{
      isStop(oldValue,newValue){
        if(this.isStop){
          this.$refs['player'].initVideo();
          this.carsData=[];
        }else {
          this.getDeviceInfo();
        }
      }
    },
    computed:{
      carsDataformate(){
          var that = this;
          if(this.carsData && this.carsData.length > 0) {
            var carsDataformate = this.carsData.map(function(item,index,self){
                var formateItem = that.mapPtToScrPt(item);
                item.Sx = formateItem.Sx;
                item.Sy = formateItem.Sy;
                return item;
            });
            return carsDataformate;
          }else{
            return [];
          }
      }
    },
    methods: {
      getDriveCalendar(){
        var _this = this;
        this.calendarMap = $echarts.init(document.getElementById('driveContainer'));
        this.mapData=[];
        getVehicleCalendarData({
          'vehicleId': this.vehicleId,
        }).then(res => {
          var list = res.vehicleCalendarDetail;
          if(!list){
            this.$message({
                type: 'error',
                duration: '1500',
                message: '行车日历结果不存在',
                showClose: true
            });
            return;
          }
          var xDate;
          list.forEach(function (e) {
            xDate = e.date.substring(0,4)+"-"+e.date.substring(4,6)+"-"+e.date.substring(6,8);
            _this.mapData.push([
              xDate,
              e.driveTime
            ]);
          })
          var range = list[0].date.substring(0,4)+"-"+list[0].date.substring(4,6);
          var option = {
            tooltip:{
              trigger:'item',
              formatter: function(a) {
                return (
                         '日期 : ' + a.value[0]
                  + '<br/>时长 : ' +(parseFloat(a.value[1])/(1000*60*60)).toFixed(1) +'小时'
                 );
              },
            },
            visualMap: {
               type:'piecewise',
              calculable: true,
              orient: 'horizontal',
             /* min:0,*/
              /*max:1000,*/
              color:['#d28601','#895a0c','#2b2219'],
              show:false,
              hoverLink:true,
              pieces: [
                {min: 0, max: 7200000, color: '#2b2218'},//0-2小时
                {min: 7200000, max: 14400000, color: '#503512'},//2-4小时
                {min: 14400000, max: 21600000, color: '#503913'},//4-6小时
                {min: 21600000, max: 28800000, color: '#885a0b'},//6-8小时
                {min: 28800000, color: '#d38600'},//8小时以上
              ]
              /* left: '670',
               top: 'center'*/
            },
            calendar:  {
              orient: 'vertical',
              range: range,
              dayLabel:{
                /*nameMap:['周日','周一','周二','周三','周四','周五','周六']*/
                nameMap:'cn',
                color:'#bbb8b1'
              },
              monthLabel:{
                show:false
              },
              yearLabel:{
                show:false
              },
              itemStyle:{
                borderWidth:1,
                borderColor:'#18171b',
                opacity:0.5,
                color:'#18171b'
              },
              splitLine:{
                lineStyle:{
                  color:'#18171b',
                  width:3
                }
              },
              cellSize: [38, 30],
              left:'center'
            },
            series: {
              type: 'heatmap',
              coordinateSystem: 'calendar',
              calendarIndex: 0,
              data: _this.mapData
            }
          }
          _this.calendarMap.setOption(option);
        });
      },
      getVirtulData() {
        var _this = this;
        var date = +$echarts.number.parseDate('2019-05');
        var end = +$echarts.number.parseDate('2019-06');
        var dayTime = 3600 * 24 * 1000;
        var data = [];
        for (var time = date; time < end; time += dayTime) {
          data.push([
            $echarts.format.formatTime('yyyy-MM-dd', time),
            Math.floor(Math.random() * 1000)
          ]);
        }
        return data;
      },
      getDeviceInfo(){
        getLiveDeviceInfo({
          'vehicleId': this.vehicleId,
        }).then(res => {
          let result = res.data;
          if(result.length>0) {
            result.forEach(item=>{
              //前向
              if(item.toward==0){
                this.liveDeviceInfo=item;
                if(this.liveDeviceInfo.serialNum==''){
                  this.rtmp = "";
                  this.$refs['player'].initVideo();
                }else{
                  this.streamParam = {
                    vehicleId: this.vehicleId,
                    camId: this.liveDeviceInfo.serialNum,
                    protocal: this.liveDeviceInfo.protocol
                  }
                }
              }
            })
          }
        });
      },
      videoLoadCompleted() {
        this.repeatFn();//拉取流后，保活
      },
      // getStream(){
      //   startStream({
      //     'vehicleId': this.vehicleId,
      //     'camId':this.liveDeviceInfo.serialNum,
      //     'protocal':this.liveDeviceInfo.protocol
      //   }).then(res => {
      //     this.$refs['player'].initVideo();
      //     this.streamInfo = res.streamInfoRes;
      //     //获取视频地址并赋值
      //     this.rtmp = this.streamInfo.rtmp;
      //     if(this.rtmp&&this.rtmp!=''){
      //       //直播报活调用
      //       this.repeatFn();//拉取流后，保活
      //     }
      //   });
      // },
      keepStream(){
        sendStreamHeart(this.streamParam).then(res => {});
      },
      repeatFn(){//每5秒直播报活一次
        let _this = this;
        _this.keepStream();
        clearInterval(_this.timer);
        _this.timer = null;//清除直播报活
        _this.timer = setInterval(function(){
          _this.keepStream();
        },5000)
      },
      initSocket(){
          if(typeof(WebSocket) === "undefined"){
              alert("您的浏览器不支持socket");
              return;
          }
          // 实例化socket
          this.socket = new WebSocket(window.config.socketUrl)
          // 监听socket连接
          this.socket.onopen = this.openSocket
          // 监听socket错误信息
          this.socket.onerror = this.error
          // 监听socket消息
          this.socket.onmessage = this.getMessage
      },
      openSocket(){
          this.sendMsg();
      },
      sendMsg(){
          var params = {
                  action:'vehPer',
                  vehicleId:this.vehicleId
              }
          this.socket.send(JSON.stringify(params));
      },
      error(msg){
          console.log('Socked连接失败',msg);
      },
      getMessage(msg){
          // console.log("感知数据 vehicleRadar %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%");
//        console.log("感知事件----")
          var that = this;
          var res = JSON.parse(msg.data);
          // let _currentCar = res.result.data.vechicleInfo;
          // this.currentCar = {
          //   longitude: _currentCar.longitude,
          //   latitude: _currentCar.latitude,
          //   heading: _currentCar.heading
          // };
          this.currentCar = res.result.data.vechicleInfo;
          this.carsData = res.result.data.liveRadarDetailList ? res.result.data.liveRadarDetailList : [];
      },
      close(){
          console.log('Socket已经关闭');
      },
      /**
       * mapPtToScrPt 地理坐标转换屏幕坐标
       * @param {*} longitude 经度
       * @param {*} latitude 纬度
       */
      mapPtToScrPt(item){
        /*console.log('当前车的经度：'+this.currentCar.longitude);
        console.log('当前车的维度：'+this.currentCar.latitude);
        console.log("旁车的经度"+longitude);
        console.log("旁车的维度"+latitude);*/
          var srcCenterPtX = this.screenConfig.scrWidth/2,//视图中心点x
              srcCenterPtY = this.screenConfig.scrHeight*3/4,//视图中心点y
              // srcCenterPtY = this.screenConfig.scrHeight/2,//视图中心点y
              srcMapCenterLng = this.currentCar.longitude, //当前车经度
              srcMapCenterLat = this.currentCar.latitude,//当前车纬度
              lng1 = item.longitude, //其他车经度
              lat1 = item.latitude; //其他车纬度

          //根据比例尺1像素=多少度，计算出其他车相对于中心点的偏移量(像素值)
          // console.log('比例尺：',this.screenConfig.scalefactor*270*108000)
          // console.log('srcCenterPtX',srcCenterPtX,'srcCenterPtY',srcCenterPtY)

          var Ssx = (lng1 - srcMapCenterLng)/this.screenConfig.scalefactor,
              Ssy = (lat1 - srcMapCenterLat)/this.screenConfig.scalefactor,
              Sx = srcCenterPtX + Ssx,
              Sy = srcCenterPtY - Ssy;

              // console.log('SX',Ssx,'Sy',Ssy)

          //判断是否需要旋转坐标
          // if(this.currentCar.heading != 0){
          //     //var rotatedData = this.rotateCoordinateAxis(Sx,Sy,this.currentCar.heading);
          //     var rotatedData = this.rotateCoordinateAxis(Ssx,Ssy,this.currentCar.heading);
          //     Sx = srcCenterPtX + rotatedData.s;
          //     Sy = srcCenterPtY + rotatedData.t;
          // }
          return {
              Sx: parseInt(Sx),
              Sy: parseInt(Sy)
          };
      },
      //旋转坐标
      rotateCoordinateAxis(x,y,angel){
        var theta = angel * Math.PI / 180;
        console.log('theta',theta);
        //逆时针变换公式
        var s = x * Math.cos(angel) + y * Math.sin(angel),
            t = y * Math.cos(angel) - x * Math.sin(angel);
        return {
            s:s,
            t:t
        }
      },
      /**
       * movePt 平移坐标
       * @param {*} moveX x平移量 单位px
       * @param {*} moveY y平移量 单位px
       * @param {*} longitude 平移后的经度
       * @param {*} latitude  平移后的纬度
       */
      // movePt(moveX,moveY,longitude,latitude){

      //     //地理偏移量 单位度
      //     moveLng = moveX*this.screenConfig.scalefactor;
      //     moveLat = moveY*this.screenConfig.scalefactor;
      //     // console.log('平移后的经纬度：',longitude + moveLng,latitude + moveLat);
      //     return {
      //         lng: longitude + moveLng,
      //         lat: latitude + moveLat,
      //     }

      // },
    },
    mounted () {
      this.getDriveCalendar();
      this.getDeviceInfo();
      this.initSocket();
    },
    beforeDestroy(){
      clearTimeout(this.timer);
      this.timer = null;//清除直播报活

    },

    destroyed(){
        //销毁Socket
        this.socket.close();
    }
  }
</script>

<style>
  .monitor-video .vjs-custom-skin > .video-js .vjs-big-play-button{
    font-size: 0.5em!important;
  }
  .monitor-video .vjs-custom-skin > .video-js .vjs-control{
    width:2.5em!important;
  }
  .monitor-video .video-js .vjs-mute-control{
    padding-left: 0!important;
    padding-right: 0!important;
  }
  .monitor-video .vjs-error .vjs-error-display .vjs-modal-dialog-content{
    /*padding:60px 24px 30px!important;
    color: #ccc;*/
  }
  .monitor-video .vjs-error .vjs-error-display:before{
    font-size: 3em;
    color: #ccc;
    top:60%;
    display: none;
  }
  .monitor-video .video-js{
    height: 180px!important;
  }
</style>
<style scoped lang="scss">
  @import "@/assets/scss/theme.scss";
  .stop-style{
    background: #333;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    position: absolute;
    z-index: 3;
    text-align: center;
    // @include layoutMode(pack);
    img{
      display: inline-block;
      margin-top: 30px;
    }
    p{
      letter-spacing: 4px;
      color: #666666;
      font-size: 18px;
    }
  }

  .monitor-right{
    width: 300px;
    min-width: 200px;
    height:100%;
  }
  .monitor-perception{
    position: relative;
    border:1px solid #402800;
    height: 180px;
    margin: 20px;
    min-width: 250px;
    overflow: hidden;
    perspective: 400px;
    perspective-origin: 50% 50%;
    &:before {
      content: "";
      position: absolute;
      left: 50%;
      bottom: 0;
      width:100%;
      height: 2000%;
      margin-left: -50%;
      border-left: 1px solid #fff;
      border-right: 1px solid #fff;
      // background-color: rgba(255, 255, 255, .2);
      transform-style:preserve-3d;
      transform-origin: center bottom;
      transform: rotateX(65deg);
    }
  }

  .monitor-video{
    margin-left:auto;
    margin-right: auto;
    width:250px;
    height:180px;
    border:1px solid #402800;
    position: relative;
  }
  .car-container {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    transform-origin: center 75% !important;
  }
  .drive-container{
    width: 250px;
    height: 250px;
    margin-left:5%;
  }
  .right-title{
    margin-top: 40px!important;
  }
  .otherCarsContainer{
    width: 270px;
    height: 180px;
    position: absolute;
    left: 0;
    top: 0;
    // transform-style:preserve-3d;
    // transform-origin: center bottom;
    // transform: rotateX(70deg);
  }
  .host-vehicle{
    position: absolute;
    left: 50%;
    top: 75%;
    margin: -13px 0 0 -10px;
    z-index: 2;
    width: 20px;
    height: 26px;
    transform-origin: center center !important;
  }
  .item{
    position: absolute;
    z-index: 1;
    width: 16px;
    height: 24px;
    margin: -12px 0 0 -8px;
    transform-origin: center center !important;
  }
  .car-position1{
    width: 16px;
    height: 24px;
  }
  .platNo {
    position: absolute;
    left: 50%;
    top: 100%;
    transform:translate(-50%, 0);
    font-size: 10px;
    line-height: 16px;
    padding: 0 5px;
    border-radius: 4px;
    background-color: rgba(55, 186, 123, .2);
    text-align: center;
    letter-spacing: 0;
    color: #ccc;
  }
  .single-mask-style{
    position: absolute;
    width: 250px;
    top: 0;
    cursor: pointer;
    z-index:2;
    right: 10px;
    top: 10px;
    height: 20px;
    .single-mask-img{
      float: right;
      width: 14px;
      height: 14px;
    }
  }
</style>
