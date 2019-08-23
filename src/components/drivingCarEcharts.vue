<template>
  <div class="c-relative">
    <h3 class="c-title">{{title}}</h3>
    <div class="echarts-box" :id="id"></div>
    <div class="c-dirving-num">{{responseData.curTotal}}</div>
  </div>
</template>

<script>
import { getHisVehStat } from '@/api/dataMonitor'
export default {
	name: 'DrivingCarEcharts',
	props: {
	    title: String
	},
	data () {
		return {
            id: "driving-car-echarts",
            // 获取在驶车辆实时数据（辆）
            webSocket:{},
            webSocketData: {
                action: "vehicleOLCount",
                token: 'fpx'
            },
            dataLength: 1440,
            responseData: {
                curTotal: 0,
                // last: [],
                curDay: []
            },
			echarts: null
		}
	},
	mounted() {
        this.getHisVehStat();
		this.echarts = this.$echarts.init(document.getElementById(this.id));
	},
	methods: {
		getHisVehStat() {
            // console.log('获取上周当天在驶车辆分布数量（分钟）以及获取当天0点到目前的分布数量');
            getHisVehStat().then(res => {
                let _resultCurDay = res.data.curDay;
                this.responseData.curTotal = _resultCurDay[_resultCurDay.length-1].count;

                _resultCurDay.forEach(item => {
                    this.responseData.curDay.push(item.count);
                });
                this.echarts.setOption(this.defaultOption());
                this.initWebSocket();
            });
        },
        initWebSocket(){
            // console.log('websocket获取当前时间节点的车辆分布数量');
            if ('WebSocket' in window) {
                this.webSocket = new WebSocket(window.config.socketUrl);  //获得WebSocket对象
            }
            this.webSocket.onmessage = this.onmessage;
            this.webSocket.onclose = this.onclose;
            this.webSocket.onopen = this.onopen;
            this.webSocket.onerror = this.onerror;
        },
        onmessage(message){
            let _json = JSON.parse(message.data),
                _result = _json.result;
            this.responseData.curTotal = _result.count;
            if(this.responseData.curDay.length >= this.dataLength) {
                this.responseData.curDay.shift();
            }
            this.responseData.curDay.push(_result.count);
            // console.log(this.responseData.curDay.length);
            this.echarts.setOption(this.defaultOption());
        },
        onclose(data){
            // console.log("结束--vehicleOLCount--连接");
        },
        onopen(data){
            // console.log("建立--vehicleOLCount--连接");
            //行程
            this.sendMsg(JSON.stringify(this.webSocketData));
        },
        sendMsg(msg) {
            // console.log("vehicleOLCount--连接状态："+this.webSocket.readyState);
            if(window.WebSocket){
                if(this.webSocket.readyState == WebSocket.OPEN) { //如果WebSocket是打开状态
                    this.webSocket.send(msg); //send()发送消息
                    // console.log("vehicleOLCount--已发送消息:"+ msg);
                }
            }else{
                return;
            }
        },
        defaultOption() {
            let option = {
                grid:{
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 0
                },
                xAxis: {
                    type: 'category',
                    show: false,
                    data: new Array(this.dataLength)
                },
                yAxis:  {
                    type: 'value',
                    show: false
                },
                series: {
                    name: "今日在使车辆",
                    type: 'line',
                    smooth: true,
                    symbol: 'none',
                    lineStyle: {
                        color: '#37ba7b',
                        width: 1
                    },
                    areaStyle: {
                        color: 'rgba(55, 186, 123, .8)'
                    },
                    data: this.responseData.curDay
                }
            };
            return option;
        }
	},
    destroyed(){
        //销毁Socket
        this.webSocket&&this.webSocket.close();
    }
}
</script>
<style lang="scss" scoped>
@import "@/assets/scss/theme.scss";
.echarts-box {
    height: 30px;
    margin: 96px 0 20px;
}
.c-dirving-num {
    position: absolute;
    left: 0;
    top: 55px;
    right: 0;
    bottom: 0;
    font-family: carfont;
    font-size: 38px;
    color: #ccc;
    @include layoutMode();
}
</style>