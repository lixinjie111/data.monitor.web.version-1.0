<template>
  <div class="c-circle-wrap clearfix">
    <h3 class="c-title">{{title}}<span class="c-sub-title">累计数量：{{responseData.total || '--'}}</span></h3>
    <div class="c-echarts-box" :id="id"></div>
  </div>
</template>

<script>
import { getTotalFlow } from '@/api/dataMonitor'
export default {
	name: 'PlatformDataEcharts',
	props: {
	    title: String
	},
	data () {
		return {
            // 获取在驶车辆实时数据（辆）
            webSocket:{},
            webSocketData: {
                action: "flow",
                token: 'fpx'
            },
            count: 0,
            maxNum: 300,
            responseData: {
                total: 0,
                VehReport: [],
                RcuReport: [],
                ThirdPartReport: []
            },
            wholeResponseData: [],
            id: 'echarts',
			echarts: null		
		}
	},
    watch: {
        deep: true,
        countNum(newVal, oldVal) {

        }
    },
	mounted() {
        this.getTotalFlow();
        this.echarts = this.$echarts.init(document.getElementById(this.id));
        this.echarts.setOption(this.defaultOption());
        this.initWebSocket();
	},
	methods: {
        getTotalFlow() {
            // console.log('获取平台总数据流量');
            getTotalFlow().then(res => {
                this.responseData.total = res.data.flow;
            });
        },
        initWebSocket(){
            // console.log('websocket获取当前时间节点的平台数据流量');
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
                _result = _json.result.flow;
            _result.forEach((item, index) => {
                let _type = item.type;
                if(this.count >= this.maxNum) {
                    this.responseData[_type].shift();
                }
                this.responseData[_type].push(item.flow);
            });
            this.count ++;
            this.echarts.setOption(this.defaultOption());
        },
        onclose(data){
            console.log("结束--flow--连接");
        },
        onopen(data){
            console.log("建立--flow--连接");
            //行程
            this.sendMsg(JSON.stringify(this.webSocketData));
        },
        sendMsg(msg) {
            console.log("flow--连接状态："+this.webSocket.readyState);
            if(window.WebSocket){
                if(this.webSocket.readyState == WebSocket.OPEN) { //如果WebSocket是打开状态
                    this.webSocket.send(msg); //send()发送消息
                    console.log("flow--已发送消息:"+ msg);
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
                    y2: 50
                },
                legend: {
                    left: '0%',
                    right: '0%',
                    bottom: 15,
                    itemGap: 40,
                    icon: "rect",
                    itemWidth: 10,
                    itemHeight: 10,
                    textStyle:{
                        fontSize: 14,
                        color: "#ccc"
                    }
                },
                color: ['#dc8c00', '#37ba7b', '#41cdff'],
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    show: false
                },
                yAxis:  {
                    type: 'value',
                    show: false
                },
                series: [{
                    name: '车辆上报',
                    type: 'line',
                    smooth: true,
                    symbol: 'none',
                    lineStyle: {
                        width: 1
                    },
                    data: this.responseData.VehReport
                },{
                    name: '路侧上报',
                    type: 'line',
                    smooth: true,
                    symbol: 'none',
                    lineStyle: {
                        width: 1
                    },
                    data: this.responseData.RcuReport
                },{
                    name: '第三方平台上报',
                    type: 'line',
                    smooth: true,
                    symbol: 'none',
                    lineStyle: {
                        width: 1
                    },
                    data: this.responseData.ThirdPartReport
                }]
            };
            return option;
        }
	}
}
</script>
<style lang="scss" scoped>

</style>
