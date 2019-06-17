<template>
  <div>

      <h3 class="c-title">累计数据
        <span class="c-sub-title">累计:{{count}}GB</span>
      </h3>
      <div id="sideTotalId" class="side-total-echarts"></div>

    <h3 class="c-title ">设备实时数据</h3>
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
            var result = json.result;
            result.forEach(item=>{
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
                _this.videoData.push(item.count);
                if(_this.videoData.length>=300){
                  _this.videoData.shift();
                }
              }
              //spat----3
              if(item.devType==3){
                _this.lightData.push(item.count);
                if(_this.lightData.length>=300){
                  _this.lightData.shift();
                }
              }
              //rcu----4
              if(item.devType==4){
                _this.rcuData.push(item.count);
                if(_this.rcuData.length>=300){
                  _this.rcuData.shift();
                }
              }
              //rsu----5
              if(item.devType==5){
                _this.rsuData.push(item.count);
                if(_this.rsuData.length>=300){
                  _this.rsuData.shift();
                }
              }
              var option = this.realOption(_this.rsuData,_this.rcuData,_this.videoData,_this.lightData);
              this.sideRealEcharts.setOption(option);
            })

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
          },


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
<style scoped>
  .side-total-echarts{
    margin:28px 0px 50px 0px;
    height: 68px;
  }
  .side-real-echarts{
    height: 60px;
    margin-top: 28px;
  }
</style>
