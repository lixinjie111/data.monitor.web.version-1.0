<template>
  <div class="monitor-right">
    <p class="monitor-title right-title">视频数据</p>
    <div class="clear line-style">
      <div class="line line-1" >
        <span class="line1"></span>
      </div>
      <div class="line line-2" >
        <span class="line2"></span>
      </div>
    </div>
    <div class="monitor-video right-title">
      <!--<video src="movie.ogg" controls="controls" autoplay width="270" height="200">
        您的浏览器不支持 video 标签。
      </video>-->
      <video-player class="vjs-custom-skin" ref="videoPlayer" :options="playerOptions">
      </video-player>
      <!--<div id="cmsplayer" style="width:100%;height:100%"></div>-->
    </div>
    <p class="monitor-title right-title">感知数据</p>
    <div class="clear line-style">
      <div class="line line-1" >
        <span class="line1"></span>
      </div>
      <div class="line line-2" >
        <span class="line2"></span>
      </div>
    </div>
    <div class="monitor-perception right-title">
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <img src="@/assets/images/car/car-6.png" class="host-vehicle" :style="{left:screenConfig.scrWidth/2-13+'px',top:screenConfig.scrHeight*3/4-10+'px'}"/>
      <div class="otherCarsContainer">
        <div class="item" v-for="(carItem,index) in carsDataformate" :style="{left:carItem.Sx+'px',top:carItem.Sy+'px',transform:'rotate('+(carItem.headingAngle-currentCar.headingAngle)+'deg)'}">
            <img src="@/assets/images/car/car-17.png" class="car-position1"/>
        </div>
      </div>
    </div>
    <p class="monitor-title right-title">行车日历</p>
    <div class="clear line-style">
      <div class="line line-1" >
        <span class="line1"></span>
      </div>
      <div class="line line-2" >
        <span class="line2"></span>
      </div>
    </div>
    <div class="drive-container" id="driveContainer">

    </div>
  </div>
</template>
<script>
  import { getVehicleCalendarData, getLiveDeviceInfo, startStream, sendStreamHeart } from '@/api/carMonitor'
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
        socketPath: 'ws://10.0.1.57:9982/mon',
        socket:'',
        screenConfig:{
            scrWidth: 270, //屏幕宽 px
            scrHeight: 180, //屏幕高 px
            // showHeight: 1800000, //显示高 m
            showHeight: 200, //显示高 m
            meterPerDegree: 108000, //1度=108000 m 固定值
            scalefactor: 0,//一个像素相当于多少度
        },
        //自车数据
        currentCar:{
        },
        carsData:[
        ],
        playerOptions: {
          overNative: true,
            autoplay: true,
            controls: true,
            techOrder: ['flash', 'html5'],
            sourceOrder: true,
            flash: {
              swf:  isProduction ? '/dataMonitor/static/media/video-js.swf' : '/static/media/video-js.swf'
            },
          sources: [
            {
              type: 'rtmp/mp4',
              src: ''
            }
          ],
          width:'270',
          height:'180'
        }
      }
    },
    created() {
      this.screenConfig.scalefactor = this.screenConfig.showHeight/(this.screenConfig.scrHeight*this.screenConfig.meterPerDegree);
    },
    methods: {
      getDriveCalendar(){
        var _this = this;
        this.calendarMap = this.$echarts.init(document.getElementById('driveContainer'));
        this.mapData=[];
        getVehicleCalendarData({
          'vehicleId': this.vehicleId,
        }).then(res => {
          var list = res.vehicleCalendarDetail;
          if(list==null&&list.length<=0){
            this.$message.error("行车日历结果不存在");
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
        var date = +_this.$echarts.number.parseDate('2019-05');
        var end = +_this.$echarts.number.parseDate('2019-06');
        var dayTime = 3600 * 24 * 1000;
        var data = [];
        for (var time = date; time < end; time += dayTime) {
          data.push([
            _this.$echarts.format.formatTime('yyyy-MM-dd', time),
            Math.floor(Math.random() * 1000)
          ]);
        }
        return data;
      },
      getDeviceInfo(){
        getLiveDeviceInfo({
          'vehicleId': this.vehicleId,
        }).then(res => {
          this.liveDeviceInfo = res.liveDeviceData;
          this.getStream();
        });
      },
      getStream(){
        startStream({
          'vehicleId': this.vehicleId,
          'camId':this.liveDeviceInfo.serialNum,
          'protocal':this.liveDeviceInfo.protocol
        }).then(res => {
          this.streamInfo = res.streamInfoRes;
          //获取视频地址并赋值
          let videoUrl = this.streamInfo.rtmp;
          this.playerOptions.sources[0].src=videoUrl;
          //直播报活调用
          this.repeatFn();//拉取流后，保活
        });
      },
      keepStream(){
        sendStreamHeart({
          'vehicleId': this.vehicleId,
          'camId':this.liveDeviceInfo.serialNum,
          'protocal':this.liveDeviceInfo.protocol
        }).then(res => {
        });
      },
      repeatFn(){//每5秒直播报活一次
        let _this = this;
        _this.keepStream();
        clearTimeout(_this.timer);
        _this.timer = null;//清除直播报活
        _this.timer = setTimeout(function(){
          _this.repeatFn();
        },5000)
      },
      initSocket(){
          if(typeof(WebSocket) === "undefined"){
              alert("您的浏览器不支持socket");
              return;
          }
          // 实例化socket
          this.socket = new WebSocket(this.socketPath)
          // 监听socket连接
          this.socket.onopen = this.openSocket
          // 监听socket错误信息
          this.socket.onerror = this.error
          // 监听socket消息
          this.socket.onmessage = this.getMessage
      },
      openSocket(){
          console.log('Socket建立连接');
          this.sendMsg();
      },
      sendMsg(){
          var params = {
                  action:'vehicleRadar',
                  vehicleId:this.vehicleId
              }
          this.socket.send(JSON.stringify(params));
      },
      error(msg){
          console.log('Socked连接失败',msg);
      },
      getMessage(msg){
          var that = this;
          var res = JSON.parse(msg.data);
          this.currentCar = res.result;
          this.carsData = res.result.liveRadarDetailList ? res.result.liveRadarDetailList : [];

      },
      close(){
          console.log('Socket已经关闭');
      },
      /**
       * mapPtToScrPt 地理坐标转换屏幕坐标
       * @param {*} longitude 经度
       * @param {*} latitude 纬度
       */
      mapPtToScrPt(longitude,latitude){
        /*console.log('当前车的经度：'+this.currentCar.longitude);
        console.log('当前车的维度：'+this.currentCar.latitude);
        console.log("旁车的经度"+longitude);
        console.log("旁车的维度"+latitude);*/
          var srcCenterPtX = this.screenConfig.scrWidth/2,//视图中心点x
              srcCenterPtY = this.screenConfig.scrHeight*3/4,//视图中心点y
              srcMapCenterLng = this.currentCar.longitude, //当前车经度
              srcMapCenterLat = this.currentCar.latitude,//当前车纬度
              lng1 = longitude, //其他车经度
              lat1 = latitude; //其他车纬度

          //当前车是否偏移中心点  假设在3/4高度处
          // var movedMapPt = this.movePt(0,this.screenConfig.scrHeight/4,longitude,latitude);
          // var srcMapCenterLng = movedMapPt.lng,
          //     srcMapCenterLat = movedMapPt.lat;

          //根据比例尺1像素=多少度，计算出其他车相对于中心点的偏移量
          var Ssx = (lng1 - srcMapCenterLng)/this.screenConfig.scalefactor,
              Ssy = (lat1 - srcMapCenterLat)/this.screenConfig.scalefactor;
              // console.log('Ssx',Ssx,'Ssy',Ssy)
          //判断是否需要旋转坐标
          if(this.currentCar.headingAngle != 0){
              var rotatedData = this.rotateCoordinateAxis(Ssx,Ssy,this.currentCar.headingAngle);
              Ssx = rotatedData.s;
              Ssy = rotatedData.t;
          }
          var Sx = srcCenterPtX - Ssx,
              Sy = srcCenterPtY + Ssy;
          // console.log(this.currentCar.longitude, this.currentCar.latitude);
          // console.log('Ssx',lng1 - srcMapCenterLng,'Ssy',lat1 - srcMapCenterLat);
          // console.log('Sx',Sx,'Sy',Sy);

          //居中，减去水滴icon的宽高的一半
          // Sx = Sx-8;
          // Sy = Sy-12;
          return {
              Sx:Sx,
              Sy:Sy
          };
      },
      //旋转坐标
      rotateCoordinateAxis(x,y,angel){
          var theta = angel*2*Math.PI/360;
          // console.log('theta',theta);
          //逆时针变换公式
          var s = x*Math.cos(theta) + y*Math.sin(theta),
              t = y*Math.cos(theta) - x*Math.sin(theta);
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
     /* this.getStream();*/
      this.initSocket();
    },
    beforeDestroy(){
      clearTimeout(this.timer);
      this.timer = null;//清除直播报活

    },
    computed:{
      carsDataformate(){
          var that = this;
          // console.log(this.carsData.length);
          if(this.carsData && this.carsData.length > 0) {
            var carsDataformate = this.carsData.map(function(item,index,self){
                var formateItem = that.mapPtToScrPt(item.longitude,item.latitude);
               /* //模拟动态数据
                var numx = Math.random()*100,
                    numy = Math.random()*100;
  */
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
    destroyed(){
        //销毁Socket
        this.socket.onclose = this.close
    }
  }
</script>

<style>
  .monitor-video .vjs-custom-skin > .video-js .vjs-big-play-button{
    font-size: 1em;
  }
</style>
<style scoped>
  .monitor-right{
    width: 300px;
    min-width: 200px;
    height:100%;
  }
  .monitor-perception{
    position: relative;
    border:1px solid #402800;
    height: 180px;
    margin:5%;
    min-width: 270px;
    overflow: hidden;
  }
  .monitor-video{
    margin-left:auto;
    margin-right: auto;
    width:270px;
    height:180px;
    border:1px solid #402800
  }

  .monitor-perception > span:nth-child(1){
    position: absolute;
    left: 0px;
    top: 0px;
    padding: 7px;
    border-style: solid;
    border-color: #8e5a00;
    border-width: 0px;
    box-shadow: -1px -1px 0px 0px #8e5a00;
  }
  .monitor-perception > span:nth-child(2){
    position: absolute;
    right: 0px;
    top: 0px;
    padding: 7px;
    border-style: solid;
    border-color: #8e5a00;
    border-width: 0px;
    box-shadow: 1px -1px 0px 0px #8e5a00;
  }
  .monitor-perception > span:nth-child(3){
    position: absolute;
    right: 0px;
    bottom: 0px;
    padding: 7px;
    border-style: solid;
    border-color: #8e5a00;
    border-width: 0px;
    box-shadow: 1px 1px 0px 0px #8e5a00;
  }
  .monitor-perception> span:nth-child(4){
    position: absolute;
    left: 0px;
    bottom: 0px;
    padding: 7px;
    border-style: solid;
    border-color: #8e5a00;
    border-width:0px;
    box-shadow: -1px 1px 0px 0px #8e5a00;
  }
  .drive-container{
    width: 270px;
    height: 250px;
    margin-left:5%;
  }
  .car-position{
    position: absolute;
    left: 124px;
    top: 145px;
    width: 22px;
    transform: rotate(-90deg);
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
  }
  .host-vehicle{
    position: absolute;
    z-index: 2;
    width: 26px;
    height: 20px;
    transform:rotate(-90deg);
  }
  .item{
    position: absolute;
    z-index: 1;
    width: 16px;
    height: 24px;
    margin: -12px 0 0 -8px;
  }
  .car-position1{
    width: 16px;
    height: 24px;
  }

</style>
