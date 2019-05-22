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
      <div id="cmsplayer" style="width:100%;height:100%"></div>
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
      <img src="@/assets/images/car/car-16.png" class="host-vehicle" :style="{position:'absolute', left:screenConfig.scrWidth/2-13+'px',top:screenConfig.scrHeight*3/4-10+'px',transform:'rotate('+-90+'deg)'}"/>
      <div class="otherCarsContainer">
        <div class="item" v-for="(carItem,index) in carsDataformate" :style="{position:'absolute', left:carItem.Sx+'px',top:carItem.Sy+'px',transform:'rotate('+carItem.headingAngle+'deg)'}">
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
  import { getVehicleCalendarData, getLiveDeviceInfo, startStream, sendStreamHeart } from '@/api/carMoniter'
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
            scrWidth:270, //屏幕宽 px
            scrHeight:180, //屏幕高 px
            showHeight:1800000, //显示高 m
        },
        //自车数据
        currentCar:{
        },
        carsData:[
        ],
      }
    },
    methods: {
      getDriveCalendar(){
        var _this = this;
        this.calendarMap = this.$echarts.init(document.getElementById('driveContainer'));
        this.mapData=[];
        getVehicleCalendarData({
          'vehicleId': this.vehicleId,
        }).then(res => {
          if(res.status == 200){
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
                  {min: 7200000, max: 14400000, color: '#2b2218'},//2-4小时
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
          }else{
            this.$message.error("获取获取行车日历失败");
          }
        }).catch(err => {
            this.$message.error("error: 获取获取行车日历失败");
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
          if(res.status == 200){
            this.liveDeviceInfo = res.liveDeviceData;
            this.getStream();
          }else{
            this.$message.error("获取车辆实时视频数据失败1");
          }
        }).catch(err => {
            this.$message.error("error: 获取车辆实时视频数据失败1");
        });
      },
      getStream(){
        startStream({
          'vehicleId': this.vehicleId,
          'camId':this.liveDeviceInfo.serialNum,
          'protocal':this.liveDeviceInfo.protocol
        }).then(res => {
          if(res.status == 200){
            this.streamInfo = res.streamInfoRes;
            //获取视频地址并赋值
            let videoUrl = this.streamInfo.rtmp;
            this.embedFlash(videoUrl);
            //直播报活调用
            this.repeatFn();//拉取流后，保活
          }else{
            this.$message.error("获取车辆实时视频数据失败2");
          }
        }).catch(err => {
            this.$message.error("error: 获取车辆实时视频数据失败2");
        });
      },
      keepStream(){
        sendStreamHeart({
          'vehicleId': this.vehicleId,
          'camId':this.liveDeviceInfo.serialNum,
          'protocal':this.liveDeviceInfo.protocol
        }).then(res => {
          // if(res.status == 200){
          // }else{
          //   this.$message.error("获取车辆实时视频数据失败3");
          // }
        }).catch(err => {
            this.$message.error("error: 获取车辆实时视频数据失败3");
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
      embedFlash(rtmpSource){//部署
        var flashVars = "&src=";
        flashVars += rtmpSource; //视频文件
        flashVars += "&autoHideControlBar=true";
        flashVars += "&streamType=";
        flashVars += "live";// vod点播 live直播
        flashVars += "&autoPlay=true";
        flashVars += "&verbose=true";

        var embedCode =  '<object id="flashPlayer" name="flashPlayer" width="100%" height="100%" type="application/x-shockwave-flash"> ';
        embedCode += '<param name="movie" value="static/swf/StrobeMediaPlayback.swf"></param>';
        embedCode += '<param name="flashvars" value="' + flashVars + '"></param>';
        embedCode += '<param name="allowFullScreen" value="true"></param><param name="allowscriptaccess" value="always"></param>';
        embedCode += '<param name="wmode" value="opaque"></param>';
        embedCode += '<embed  id="flashPlayer" name="flashPlayer" src="static/swf/StrobeMediaPlayback.swf" type="application/x-shockwave-flash"';
        embedCode += ' allowscriptaccess="always" allowfullscreen="true" ';
        embedCode += ' wmode="opaque" ';
        embedCode += ' width="100%" height="100%" ';
        embedCode += 'flashvars="' + flashVars + '">';
        embedCode += '</embed></object>';
        console.log(embedCode);
        document.getElementById("cmsplayer").innerHTML = embedCode;
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
          this.carsData = res.result.liveRadarDetailList;
          // console.log("*******************************************");
          // console.log(res.result);
          // console.log(res.result.liveRadarDetailList);
          // console.log(res.result.liveRadarDetailList.length);
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
          var scrWidth = this.screenConfig.scrWidth,//屏幕宽 px
              scrHeight = this.screenConfig.scrHeight,//屏幕高 px
              showHeight = this.screenConfig.showHeight,//显示高度 m
              srcCenterPtX = this.screenConfig.scrWidth/2,//视图中心点x
              srcCenterPtY = this.screenConfig.scrHeight*3/4,//视图中心点y
              srcMapCenterLng = this.currentCar.longitude, //当前车经度
              srcMapCenterLat = this.currentCar.latitude,//当前车纬度
              meterPerDegree = 108000, //1度=多少米 m
              scalefactor = (showHeight/scrHeight)/meterPerDegree,//一个像素相当于多少度
              lng1 = longitude, //其他车经度
              lat1 = latitude; //其他车纬度

          //当前车是否偏移中心点  假设在3/4高度处
          // var movedMapPt = this.movePt(0,this.screenConfig.scrHeight/4,longitude,latitude);
          // var srcMapCenterLng = movedMapPt.lng,
          //     srcMapCenterLat = movedMapPt.lat;

          //根据比例尺1像素=多少度，计算出其他车相对于中心点的偏移量
          var Ssx = (lng1 - srcMapCenterLng)/scalefactor,
              Ssy = (lat1 - srcMapCenterLat)/scalefactor;
              // console.log('Ssx',Ssx,'Ssy',Ssy)

          //判断是否需要旋转坐标
          if(this.currentCar.headingAngle != 0){
              var rotatedData = this.rotateCoordinateAxis(Ssx,Ssy,this.currentCar.headingAngle);
              Ssx = rotatedData.s;
              Ssy = rotatedData.t;
          }
          var Sx = srcCenterPtX + Ssx,
              Sy = srcCenterPtY + Ssy;
          // console.log('Sx',Sx,'Sy',Sy);

          //居中，减去水滴icon的宽高的一半
          Sx = Sx-8;
          Sy = Sy-12;
          return {
              Sx:Sx,
              Sy:Sy
          };
      },
      /**
       * scrPtToMapPt 屏幕坐标转地理坐标
       * @param {*} x 屏幕坐标x
       * @param {*} y 屏幕坐标y
       */
      scrPtToMapPt(x,y){
          //已知：1度=多少米;偏移地图中心点的距离（单位米）；偏移屏幕中心点的距离单位px
          //求：1像素=多少度？
          var meterPerDegree = 108000, //1度=多少米 m
              srcCenterPtX = this.screenConfig.scrWidth/2,//视图中心点x
              srcCenterPtY = this.screenConfig.scrHeight/2,//视图中心点y
              showHeight = this.screenConfig.showHeight,//显示高度 m
              srcMapCenterLng = this.currentCar.longitude, //当前车经度
              srcMapCenterLat = this.currentCar.latitude,//当前车纬度
              //计算比例尺（1像素=多少度）= (1像素=多少米)/(1度=多少米)
              scalefactor = (showHeight/this.screenConfig.scrHeight)/meterPerDegree;

          //计算距离地理中心偏移量 单位：度
          _lng = (x-srcCenterPtX)*scalefactor;
          _lat = (y-srcCenterPtY)*scalefactor;
          // console.log('_lng',_lng,'_lat',_lat);

          var lng1 = srcMapCenterLng + _lng,
              lat1 = srcMapCenterLat + _lat;
          // console.log('scrPtToMapPt:',lng1,lat1);

          return{
              lng: lng1,
              lat: lat1
          }
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
      movePt(moveX,moveY,longitude,latitude){
          var meterPerDegree = 108000, //1度=多少米 m
          //计算比例尺（1像素=多少度）= (1像素=多少米)/(1度=多少米)
          scalefactor = (this.screenConfig.showHeight/this.screenConfig.scrHeight)/meterPerDegree;

          //地理偏移量 单位度
          moveLng = moveX*scalefactor;
          moveLat = moveY*scalefactor;
          // console.log('平移后的经纬度：',longitude + moveLng,latitude + moveLat);
          return {
              lng: longitude + moveLng,
              lat: latitude + moveLat,
          }

      },
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
          // console.log("------------------------------------------------------");
          // console.log(this.carsData);
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

<style scoped>
  .monitor-right{
    width: 300px;
    /*  background: #24212c;*/
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
  /*  .monitor-title{
      font-size: 18px;
      color: #fff;
      padding-left: 5%;
      margin-top:10%;
    }
    .clear:after{
      content: '';
      clear: both;
      line-height:0;
      height:0;
      display: block;
      visibility: hidden;
    }
    .line-style{
      padding-left: 5%;
    }
    .line{
      float: left;
    }
    .line-1{
      width: 10%;
    }
    .line-2{
      width: 85%;
    }
    .line1{
      border-top: 2px solid #ef920e;
      display: block;
    }
    .line2{
      border-top: 1px solid #ef920e;
      display: block;
      margin-top: 0.5px;
    }*/
  .car-position{
    position: absolute;
    left: 124px;
    top: 145px;
    width: 22px;
    transform: rotate(-90deg);
  }
  .car-position1{
    position: absolute;
    left: 100px;
    top: 100px;
    width: 15px;
    transform: rotate(50deg);
  }
  .car-position2{
    position: absolute;
    left: 150px;
    top: 80px;
    width: 15px;
  }
  .car-position3{
    position: absolute;
    left: 120px;
    top: 50px;
    width: 15px;
  }
  .right-title{
    margin-top: 35px!important;
  }
  /* 感知数据 */
  /* .monitor-perception{
       width: 270px;
       height: 180px;
       margin: 200px auto;
       position: relative;
       overflow: hidden;
   }*/
  .otherCarsContainer{
    width: 270px;
    height: 180px;
    position: absolute;
    left: 0;
    top: 0;
  }
  .host-vehicle{
    width: 26px;
    height: 20px;
  }
  .car-position1{
    width: 16px;
    height: 24px;
  }
</style>
