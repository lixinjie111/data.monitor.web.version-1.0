<template>
  <div class="m-left-bottom">
    <div class="c-car-list">
      <h3 class="c-title">道路级别</h3>
      <div id="roadLevel" class="m-pie-style">
      </div>
    </div>
    <div class="c-car-list">
      <h3 class="c-title">道路分类</h3>
      <div id="roadClassify" class="m-pie-style">

      </div>
    </div>
    <div class="c-car-list">
      <h3 class="c-title">交通事件<span class="c-sub-title">今日总数:{{trafficCount}}</span></h3>

      
      <ul class="m-traffic-list">
          <li v-for="(item, index) in trafficData" :key="index" class="m-traffic-item clearfix">
            <span class="m-traffic-span">{{$dateUtil.formatTime(Number(item.beginTime))}}</span>
            <span class="m-traffic-span">{{item.eventName}}</span>
            <span class="m-traffic-span">{{item.roadName}}</span>     
          </li>
      </ul>
        
    </div>
    
  </div>
</template>
<script>
  import {roadLevel,roadCategory} from '@/api/roadMonitor'
  import $echarts from 'echarts'
    export default {
        data() {
            return {
              levelPie:{},
              classifyPie:{},
              webSocket: null,
              webSocketData: {
                action: "event_top5_data",
                token: 'tusvn',
              },
              trafficData:[],
              trafficCount:0
            }
        },
        methods: {
          defaultOption(data) {
            let option = {
              tooltip: {
                trigger: 'item',
                formatter: function(params) {
                  return '<div>'+params.name+': <span style="color: #dc8c00;">'+params.value.toFixed(1)+'</span></div><div>占比: <span style="color: #dc8c00;">'+params.percent.toFixed(1)+'%</span></div>'
                }
              },
              legend: {
                itemWidth:5,
                itemHeight:15,
                orient: 'vertical',
                right: '15%',
                y: 'center',
                itemGap: 0,
                textStyle: {
                  color: '#ccc',
                  lineHeight: 30,
                  fontFamily: 'MicrosoftYaHei',
                  padding:[0,8]
                }
              },
              color: ["#4666f1", "#35a376", "#91bb66", "#e5bf4d", "#9496a1" ],
              series: [
                {
                  type:'pie',
                  radius: ['45%', '70%'],
                  center: ['30%', '48%'],
                  avoidLabelOverlap: false,
                  label: {
                    normal: {
                      show: true,
                      position: 'inside',
                      formatter:function(data){
                        return data.percent > 10 ? data.percent.toFixed(1)+'%' : '';
                      },
                      color: '#fff',
                    },
                    emphasis: {
                      show: true,
                      textStyle: {
                        fontSize: '12'
                      }
                    },
                  },
                  labelLine: {
                    normal: {
                      show: true
                    }
                  },
                  data: data
                   /*data:[
                       {value:1548, name:'高速'},
                       {value:1032, name:'国道'},
                       {value:534, name:'省道'},
                       {value:235, name:'城市道路'},
                       {value:154, name:'乡道'}
                   ]*/
                }
              ]
            };
            return option;
          },
          getRoadLevel(){
            roadLevel().then(res=>{
              let result = res.data;
              let data = [];
              result.forEach(item=>{
                let obj = {};
                obj.value = item.value;
                obj.name = item.name;
                data.push(obj);
              })
              let option = this.defaultOption(data);
              this.levelPie.setOption(option);
            });
          },
          getRoadCategory(){
            roadCategory().then(res=>{
              let result = res.data;
              // console.log('result', result);
              let data = [];
              result.forEach(item=>{
                let obj = {};
                obj.value = item.value;
                obj.name = item.name;
                data.unshift(obj);
              })
              // console.log('data --- 道路', data);
              let option = this.defaultOption(data);
              this.classifyPie.setOption(option);
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
            var json = JSON.parse(mesasge.data);
            this.trafficCount=json.result.eventCount;
            Array.prototype.push.apply(this.trafficData, json.result.data);
            if(this.trafficData.length > 5) {
              this.trafficData.splice(0, this.trafficData.length - 5);
            }
            //var result = json.result.roadVeh;

          },
          onclose(data){
            console.log("结束连接");
          },
          onopen(data){
            //获取在驶车辆状态
            var _traffic = JSON.stringify(this.webSocketData);
            this.sendMsg(_traffic);
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
        mounted() {
        
         this.initWebSocket();
         this.levelPie = $echarts.init(document.getElementById("roadLevel"));
         this.classifyPie = $echarts.init(document.getElementById("roadClassify"));
         this.getRoadLevel();
         this.getRoadCategory();

        }
    }
</script>
<style lang="scss" scoped>
@import "@/assets/scss/theme.scss";
  .m-pie-style{
    height: 160px;
  }
  .m-traffic-list{
    margin:12px 0;
    line-height: 36px;
    height:180px;
    text-align: center;
    .m-traffic-item{    
      .m-traffic-span{
        @include lineClampOne();
        margin-right: 10px;
        float: left;
        &:nth-of-type(1){
          width: 176px;
        }
        &:nth-of-type(2){
          width: 100px;
        }
        &:nth-of-type(3){
          width: 60px;
          margin-right: 0;   
        }
      }
    }
  }
</style>
