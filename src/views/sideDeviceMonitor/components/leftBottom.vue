<template>
  <div>

      <h3 class="c-title">累计数据
        <span class="c-sub-title">累计:{{count}}GB</span>
      </h3>
      <div id="sideTotalId" class="side-total-echarts"></div>

    <h3 class="c-title">设备实时数据</h3>
    <div id="sideRealId" class="side-real-echarts"></div>
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
              rsuWebsocket:{},
              rcuWebsocket:{},
              videoWebsocket:{},
              lightWebsocket:{},
              totalData:[],
              rsuData:[],
              rcuData:[],
              videoData:[],
              lightData:[]
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
                }
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
                  opacity: 0
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
                show:false
              },
              yAxis: {
                type: 'value',
                splitLine: {
                  show:false
                },
                show:false
              },
              series: [{
                /*data: [820, 932, 901, 934, 1290, 1330, 1320], */
                data: data1,
                type: 'line',
                smooth: true,
                symbol: 'none',
                lineStyle: {
                  color: '#936314',
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
            _this.totalData.push(json.result.count);
            if(_this.totalData.length>=300){
              _this.totalData.shift();
            }
            var option = this.totalOption(_this.totalData);
            this.sideTotalEcharts.setOption(option);

          },
          onclose(data){
            console.log("结束连接");
          },
          onopen(data){
            //获取车辆状态
            var deviceCount = {
              action: "deviceCount",
              token: ''
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
          },
          initRealWebSocket(){
            let _this=this;
            if ('WebSocket' in window) {
              _this.realWebSocket = new WebSocket(window.cfg.websocketUrl);  //获得WebSocket对象
            }
            _this.realWebSocket.onmessage = _this.onRealMessage;
            _this.realWebSocket.onclose = _this.onRealClose;
            _this.realWebSocket.onopen = _this.onRealOpen;
          },
          onRealMessage(mesasge){
            let _this=this;
            var json = JSON.parse(mesasge.data);
            _this.totalData.push(json.result.count);
            if(_this.totalData.length>=300){
              _this.totalData.shift();
            }
            var option = this.totalOption(_this.totalData);
            this.sideTotalEcharts.setOption(option);

          },
          onRealClose(data){
            console.log("结束连接");
          },
          onRealOpen(data){
            //获取车辆状态
            var deviceCount = {
              action: "deviceCount",
              token: ''
            }
            var deviceCountMsg = JSON.stringify(deviceCount);
            this.sendRealMsg(deviceCountMsg);
          },
          sendRealMsg(msg) {
            let _this=this;
            console.log("连接状态："+_this.realWebSocket.readyState);
            if(window.WebSocket){
              if(_this.realWebSocket.readyState == WebSocket.OPEN) { //如果WebSocket是打开状态
                _this.realWebSocket.send(msg); //send()发送消息
                console.log("已发送消息:"+ msg);
              }
            }else{
              return;
            }
          },
          initRsuWebSocket(){
            let _this=this;
            if ('WebSocket' in window) {
              _this.rsuWebsocket = new WebSocket(window.cfg.websocketUrl);  //获得WebSocket对象
            }
            _this.rsuWebsocket.onmessage = _this.onRsuMessage;
            _this.rsuWebsocket.onclose = _this.onRsuClose;
            _this.rsuWebsocket.onopen = _this.onRsuOpen;
          },
          onRsuMessage(mesasge){
            let _this=this;
            var json = JSON.parse(mesasge.data);
            _this.rsuData.push(json.result.count);
            if(_this.rsuData.length>=300){
              _this.rsuData.shift();
            }
            var option = this.realOption(_this.rsuData,null,null,null);
            this.sideRealEcharts.setOption(option);

          },
          onRsuClose(data){
            console.log("结束连接");
          },
          onRsuOpen(data){
            //获取车辆状态
            var deviceRsuCount = {
              "action": "deviceCount",
              "devType": "1"
            }
            var deviceRsuMsg = JSON.stringify(deviceRsuCount);
            this.sendRsuMsg(deviceRsuMsg);
          },
          sendRsuMsg(msg) {
            let _this=this;
            console.log("连接状态："+_this.rsuWebsocket.readyState);
            if(window.WebSocket){
              if(_this.rsuWebsocket.readyState == WebSocket.OPEN) { //如果WebSocket是打开状态
                _this.rsuWebsocket.send(msg); //send()发送消息
                console.log("已发送消息:"+ msg);
              }
            }else{
              return;
            }
          },
          initRcuWebSocket(){
            let _this=this;
            if ('WebSocket' in window) {
              _this.rcuWebsocket = new WebSocket(window.cfg.websocketUrl);  //获得WebSocket对象
            }
            _this.rcuWebsocket.onmessage = _this.onRcuMessage;
            _this.rcuWebsocket.onclose = _this.onRcuClose;
            _this.rcuWebsocket.onopen = _this.onRcuOpen;
          },
          onRcuMessage(mesasge){
            let _this=this;
            var json = JSON.parse(mesasge.data);
            _this.rcuData.push(json.result.count);
            if(_this.rcuData.length>=300){
              _this.rcuData.shift();
            }
            var option = this.realOption(null,_this.rcuData,null,null);
            this.sideRealEcharts.setOption(option);

          },
          onRcuClose(data){
            console.log("结束连接");
          },
          onRcuOpen(data){
            //获取车辆状态
            var deviceRcuCount = {
              "action": "deviceCount",
              "devType": "2"
            }
            var deviceRcuMsg = JSON.stringify(deviceRcuCount);
            this.sendRcuMsg(deviceRcuMsg);
          },
          sendRcuMsg(msg) {
            let _this=this;
            console.log("连接状态："+_this.rcuWebsocket.readyState);
            if(window.WebSocket){
              if(_this.rcuWebsocket.readyState == WebSocket.OPEN) { //如果WebSocket是打开状态
                _this.rcuWebsocket.send(msg); //send()发送消息
                console.log("已发送消息:"+ msg);
              }
            }else{
              return;
            }
          },
          initVideoWebSocket(){
            let _this=this;
            if ('WebSocket' in window) {
              _this.videoWebsocket = new WebSocket(window.cfg.websocketUrl);  //获得WebSocket对象
            }
            _this.videoWebsocket.onmessage = _this.onVideoMessage;
            _this.videoWebsocket.onclose = _this.onVideoClose;
            _this.videoWebsocket.onopen = _this.onVideoOpen;
          },
          onVideoMessage(mesasge){
            let _this=this;
            var json = JSON.parse(mesasge.data);
            _this.videoData.push(json.result.count);
            if(_this.videoData.length>=300){
              _this.videoData.shift();
            }
            var option = this.realOption(null,null,_this.videoData,null);
            this.sideRealEcharts.setOption(option);

          },
          onVideoClose(data){
            console.log("结束连接");
          },
          onVideoOpen(data){
            //获取车辆状态
            var deviceVideoCount = {
              "action": "deviceCount",
              "devType": "3"
            }
            var deviceVideoMsg = JSON.stringify(deviceVideoCount);
            this.sendVideoMsg(deviceVideoMsg);
          },
          sendVideoMsg(msg) {
            let _this=this;
            console.log("连接状态："+_this.videoWebsocket.readyState);
            if(window.WebSocket){
              if(_this.videoWebsocket.readyState == WebSocket.OPEN) { //如果WebSocket是打开状态
                _this.videoWebsocket.send(msg); //send()发送消息
                console.log("已发送消息:"+ msg);
              }
            }else{
              return;
            }
          },
          initLightWebSocket(){
            let _this=this;
            if ('WebSocket' in window) {
              _this.lightWebsocket = new WebSocket(window.cfg.websocketUrl);  //获得WebSocket对象
            }
            _this.lightWebsocket.onmessage = _this.onLightMessage;
            _this.lightWebsocket.onclose = _this.onLightClose;
            _this.lightWebsocket.onopen = _this.onLightOpen;
          },
          onLightMessage(mesasge){
            let _this=this;
            var json = JSON.parse(mesasge.data);
            _this.lightData.push(json.result.count);
            if(_this.lightData.length>=300){
              _this.lightData.shift();
            }
            var option = this.realOption(null,null,null,_this.lightData);
            this.sideRealEcharts.setOption(option);

          },
          onLightClose(data){
            console.log("结束连接");
          },
          onLightOpen(data){
            //获取车辆状态
            var deviceLightCount = {
              "action": "deviceCount",
              "devType": "4"
            }
            var deviceLightMsg = JSON.stringify(deviceLightCount);
            this.sendLightMsg(deviceLightMsg);
          },
          sendLightMsg(msg) {
            let _this=this;
            console.log("连接状态："+_this.lightWebsocket.readyState);
            if(window.WebSocket){
              if(_this.lightWebsocket.readyState == WebSocket.OPEN) { //如果WebSocket是打开状态
                _this.lightWebsocket.send(msg); //send()发送消息
                console.log("已发送消息:"+ msg);
              }
            }else{
              return;
            }
          }
        },
        mounted() {
          this.sideTotalEcharts = this.$echarts.init(document.getElementById("sideTotalId"));
        /*  var option = this.totalOption();
          this.sideTotalEcharts.setOption(option);*/
          this.sideRealEcharts = this.$echarts.init(document.getElementById("sideRealId"));
         /* var realOption = this.realOption();
          this.sideRealEcharts.setOption(realOption);*/
//          this.getTotalData();
//          this.initWebSocket();
          /*this.initRsuWebSocket();
          this.initRcuWebSocket();*/
//          this.initVideoWebSocket();
//          this.initLightWebSocket();
        },
      destroyed(){
        //销毁Socket
        this.webSocket.close();
        this.rsuWebsocket.close();
        this.rcuWebsocket.close();
        this.videoWebsocket.close();
        this.lightWebsocket.close();
      }
    }
</script>
<style scoped>
  .side-total-echarts{
    margin:28px 0px 58px 0px;
    height: 68px;
  }
  .side-real-echarts{
    height: 60px;
    margin-top: 28px;
  }
</style>
