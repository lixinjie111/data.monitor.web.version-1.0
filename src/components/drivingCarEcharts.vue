<template>
  <div class="c-relative">
    <h3 class="c-title">{{title}}</h3>
    <div class="c-echarts-box" :id="id"></div>
    <div class="c-echarts-x">
        <span>0</span>
        <span>6</span>
        <span>12</span>
        <span>18</span>
        <span>24</span>
    </div>
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
            dataLength: 0,
            responseData: {
                last: [],
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
                let _resultLast = res.data.last,
                    _resultCurDay = res.data.curDay;
                this.dataLength = _resultLast.length;
                // console.log(this.dataLength);
                _resultLast.forEach(item => {
                    this.responseData.last.push(item.count);
                });
                _resultCurDay.forEach(item => {
                    this.responseData.curDay.push(item.count);
                });
                this.echarts.setOption(this.defaultOption());
                // this.initWebSocket();
            });
        },
        initWebSocket(){
            console.log('websocket获取当前时间节点的车辆分布数量');
            if ('WebSocket' in window) {
                this.webSocket = new WebSocket(window.cfg.socketUrl);  //获得WebSocket对象
            }
            this.webSocket.onmessage = this.onmessage;
            this.webSocket.onclose = this.onclose;
            this.webSocket.onopen = this.onopen;
            this.webSocket.onerror = this.onerror;
        },
        onmessage(message){
            let _json = JSON.parse(message.data),
                _result = _json.result;
            if(this.responseData.curDay.length >= this.dataLength) {
                this.responseData.curDay.shift();
            }
            this.responseData.curDay.push(_result.count);
            // console.log(this.responseData.curDay.length);
            this.echarts.setOption(this.defaultOption());
        },
        onclose(data){
            console.log("结束--vehicleOLCount--连接");
        },
        onopen(data){
            console.log("建立--vehicleOLCount--连接");
            //行程
            this.sendMsg(JSON.stringify(this.webSocketData));
        },
        sendMsg(msg) {
            console.log("vehicleOLCount--连接状态："+this.webSocket.readyState);
            if(window.WebSocket){
                if(this.webSocket.readyState == WebSocket.OPEN) { //如果WebSocket是打开状态
                    this.webSocket.send(msg); //send()发送消息
                    console.log("vehicleOLCount--已发送消息:"+ msg);
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
                    y2: 20
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
                    // data: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24]
                },
                yAxis:  {
                    type: 'value',
                    show: false
                },
                series: [{
                    name: "昨日在使车辆",
                    type: 'line',
                    smooth: true,
                    symbol: 'none',
                    lineStyle: {
                        color: '#575757',
                        width: 1
                    },
                    areaStyle: {
                        color: 'rgba(87, 87, 87, .1)'
                    },
                    data: this.responseData.last
                },{
                    name: "今日在使车辆",
                    type: 'line',
                    smooth: true,
                    symbol: 'none',
                    lineStyle: {
                        color: '#37ba7b',
                        width: 1
                    },
                    areaStyle: {
                        color: 'rgba(55, 186, 123, .1)'
                    },
                    data: this.responseData.curDay
                }]
            };
            return option;
        }
	}
}
</script>
<style lang="scss" scoped>
@import "@/assets/scss/theme.scss";
.c-echarts-x {
    position: absolute;
    left: 0;
    right: 0;
    top: 167px;
    font-size: 12px;
    color: #918d84;
    line-height: 20px;
    letter-spacing: 0;
    @include layoutMode(between);
    span {
        display: inline-block;
        width: 15px;
        text-align: center;
    }
}
</style>
