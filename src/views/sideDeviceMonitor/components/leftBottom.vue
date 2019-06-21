<template>
  <div>

      <h3 class="c-title">累计数据
        <span class="c-sub-title">累计:{{count}}GB</span>
      </h3>
      <div id="sideTotalId" class="side-total-echarts"></div>

    <h3 class="c-title ">设备实时数据</h3>
    <div id="sideRealId" class="side-real-echarts"></div>
    <div class="legend-show">
      <div class="side-real-legend">
        <span class="real-legend-style rsu-style"></span>
        <span>RSU</span>
      </div>
      <div class="side-real-legend">
        <span class="real-legend-style rcu-style"></span>
        <span>RCU</span>
      </div>
      <div class="side-real-legend">
        <span class="real-legend-style light-style"></span>
        <span>红绿灯</span>
      </div>
    </div>
  </div>
</template>
<script>
  import {getTotalData} from '@/api/sideDeviceMonitor'
    export default {
        data() {
            return {
              sideTotalEcharts:{},
              sideRealEcharts:{},
              count:0,
              webSocket:{},
              realWebSocket:{},
              totalData:[],
              rsuData:[],
              rcuData:[],
              videoData:[],
              lightData:[],
              xData:Array(300)
            }
        },
        methods: {
          totalOption(data) {
            let option = {
              grid:{
                x: 0,
                y: 0,
                x2: 0,
                y2: 0
              },
              xAxis: {
                type: 'category',
                splitLine: {
                  show:false
                },
                axisLine:{
                  lineStyle:{
                    color:'rgba(211, 134, 0 , 0.4)'
                  }
                },
                axisTick:{
                  show:false
                },
                axisLabel:{
                  interval: 5,
                  textStyle: {
                    color: "#918d84"
                  }
                },
                data:this.xData
              },
              yAxis:  {
                type: 'value',
                show: false
              },
              series: [{
                name: "累计数据",
                type: 'line',
                smooth: true,
                symbol: 'none',
                symbolSize: 2,
                lineStyle: {
                  color: 'rgba(55, 186, 123, .2)',
                  width:1,
                  opacity: 0.7
                },
                areaStyle: {
                  color: 'rgba(55, 186, 123, .2)'
                },
                data: data
               // data: [245, 182, 434, 791, 390, 245, 465, 245, 182, 434, 791, 390, 245, 465, 245, 182, 434, 791, 390, 245, 465, 245, 182, 434, 121]
              }]
            };
            return option;
          },
          realOption(data1,data2,data3,data4){
            let option = {
              grid:{
                x: 0,
                y: 0,
                x2: 0,
                y2: 0
              },
              xAxis: {
                type: 'category',
                show:false,
                data: this.xData,
              },
              yAxis: {
                type: 'value',
                splitLine: {
                  show:false
                },
                show:false,
                min: 0,
              },
              series: [{
                /*data: [820, 932, 901, 934, 1290, 1330, 1320], */
                data: data1,
                type: 'line',
                smooth: true,
                symbol: 'none',
                lineStyle: {
                  color: '#936314',
                  width: 1,
                  opacity:0.7
                }
              },
                {
                  /*data: [700, 632, 501, 334, 990, 730, 520],*/
                  data: data2,
                  type: 'line',
                  smooth: true,
                  symbol: 'none',
                  lineStyle: {
                    color: '#2c815f',
                    width: 1,
                    opacity:0.7
                  }
                },
                {
                  /*data: [770, 632, 801, 734, 690, 230, 120],*/
                  data: data3,
                  type: 'line',
                  smooth: true,
                  symbol: 'none',
                  lineStyle: {
                    color: '#368099',
                    width: 1,
                    opacity:0.7
                  }
                },
                {
                  /*data: [420, 532, 101,734, 190, 830, 920],*/
                  data: data4,
                  type: 'line',
                  smooth: true,
                  symbol: 'none',
                  lineStyle: {
                    color: '#ff0000',
                    width: 1,
                    opacity:0.7
                  }
                }]
            };
            return option;
          },
          getTotalData(){
            getTotalData().then(res => {
              this.count = res.data[0].total;
            })
          },
          initWebSocket(){
            let _this=this;
            if ('WebSocket' in window) {
              _this.webSocket = new WebSocket(window.cfg.websocketUrl);  //获得WebSocket对象
            }
            _this.webSocket.onmessage = _this.onmessage;
            _this.webSocket.onclose = _this.onclose;
            _this.webSocket.onopen = _this.onopen;
            _this.webSocket.onerror = _this.onerror;
          },
          onmessage(mesasge){
            let _this=this;
            var json = JSON.parse(mesasge.data);
            var result = json.result;
            //设置横坐标
            let date = new Date();
            /*result.forEach(item=>{

            })*/
//            _this.xData.push(date);
            var typeData=[];
            var typeArray = [1,3,4,5];
            result.forEach(item=>{
//              将横坐标数据删除
             /* if(_this.rsuData.length>=300||_this.rcuData.length>=300||_this.videoData.length>=300||_this.lightData.length){
                _this.xData.shift();
              }*/
              //total----0
              if(item.devType==0){
                _this.totalData.push(item.count);
                if(_this.totalData.length>=300){
                  _this.totalData.shift();
                }
                var option = this.totalOption(_this.totalData);
                this.sideTotalEcharts.setOption(option);
              }
              //cam----1
              if(item.devType==1){
                typeData.push(1);
                _this.videoData.push(item.count);
                if(_this.videoData.length>=300){
                  _this.videoData.shift();
                }
              }
              //spat----3
              if(item.devType==3){
                typeData.push(3);
                _this.lightData.push(item.count);
                if(_this.lightData.length>=300){
                  _this.lightData.shift();
                }
              }
              //rcu----4
              if(item.devType==4){
                typeData.push(4);
                _this.rcuData.push(item.count);
                if(_this.rcuData.length>=300){
                  _this.rcuData.shift();
                }
              }
              //rsu----5
              if(item.devType==5){
                typeData.push(5);
                _this.rsuData.push(item.count);
                if(_this.rsuData.length>=300){
                  _this.rsuData.shift();
                }
              }
            })
            typeArray.forEach(item=>{
              if(typeData.indexOf(item)==-1){
                if(item==1){
                  _this.videoData.push(null);
                }
                if(item==3){
                  _this.lightData.push(null);
                }
                if(item==4){
                  _this.rcuData.push(null);
                }
                if(item==5){
                  _this.rsuData.push(null);
                /*  console.log("rsu的长度------"+_this.rsuData.length)*/
                }
              }
            })
            var option = this.realOption(_this.rsuData,_this.rcuData,_this.videoData,_this.lightData);
            this.sideRealEcharts.setOption(option);
          },
          onclose(data){
            console.log("结束连接");
          },
          onopen(data){
            //获取车辆状态
            var deviceCount = {
              'action': "deviceCount",
              'token': ''
            }
            var deviceCountMsg = JSON.stringify(deviceCount);
            this.sendMsg(deviceCountMsg);
          },
          sendMsg(msg) {
            let _this=this;
            console.log("连接状态："+_this.webSocket.readyState);
            if(window.WebSocket){
              if(_this.webSocket.readyState == WebSocket.OPEN) { //如果WebSocket是打开状态
                _this.webSocket.send(msg); //send()发送消息
                console.log("已发送消息:"+ msg);
              }
            }else{
              return;
            }
          }


        },
        mounted() {
          this.sideTotalEcharts = this.$echarts.init(document.getElementById("sideTotalId"));
          this.sideRealEcharts = this.$echarts.init(document.getElementById("sideRealId"));
          this.getTotalData();
          this.initWebSocket();
//          this.initRealWebSocket();
        },
      destroyed(){
        //销毁Socket
        this.webSocket.close();
      }
    }
</script>
<style scoped lang="scss">
  .side-total-echarts{
    margin:28px 0px 50px 0px;
    height: 68px;
  }
  .side-real-echarts{
    height: 68px;
    margin-top: 28px;
  }
  .legend-show{
    margin-top:15px;
    /*display: flex;
    justify-content: center;*/
    float: left;
    .side-real-legend{
      display: inline-block;
      font-size: 12px;
      /*padding:2px 22px;*/
      opacity: 0.6;
      .real-legend-style{
        display: inline-block;
        width: 10px;
        height: 4px;
        background-color: yellow;
        vertical-align: middle;
      }
      .rsu-style{
        background-color: #936314;
      }
      .rcu-style{
        background-color:#2c815f ;
        margin-left: 10px;
      }
      .light-style{
        background-color:#ff0000 ;
        margin-left: 10px;
      }
    }
  }
</style>
