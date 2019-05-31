<template>
  <div class="c-relative">
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
            countNum: 0,
            maxNum: 30,
            maxGroup: 10,
            curGroup: 0,
            responseData: {
                total: 0,
                VehReport: [],
                RcuReport: [],
                ThirdPartReport: []
            },
            id: 'echarts',
			echarts: null,
            xData: new Array(10)
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
            this.responseData.total = _json.result.total != undefined ? _json.result.total : this.responseData.total;
            // countNum: 0, maxNum: 30, maxGroup: 10, curGroup: 0,
            if(this.countNum < this.maxNum) {

            }else {
                // if(this.curGroup < ) {

                // }
                this.countNum = 0;
                this.curGroup ++;
            }

            // _result.forEach((item, index) => {
            //     let _type = item.type;
                
            // });
            // this.count ++;
            this.echarts.setOption(this.defaultOption());
        },
        onclose(data){
            // console.log("结束--flow--连接");
        },
        onopen(data){
            // console.log("建立--flow--连接");
            //行程
            this.sendMsg(JSON.stringify(this.webSocketData));
        },
        sendMsg(msg) {
            // console.log("flow--连接状态："+this.webSocket.readyState);
            if(window.WebSocket){
                if(this.webSocket.readyState == WebSocket.OPEN) { //如果WebSocket是打开状态
                    this.webSocket.send(msg); //send()发送消息
                    // console.log("flow--已发送消息:"+ msg);
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
                tooltip : {
                    trigger: 'axis',
                    axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                        type : 'shadow'        // 默认为直线，可选为：'line'
                    }
                },
                legend: {
                    left: '0%',
                    right: '0%',
                    bottom: 12,
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
                    axisLine:{
                        lineStyle:{
                            color:'rgba(211, 134, 0 , 0.4)'
                        }
                    },
                    axisTick:{
                        show: false
                    },
                    axisLabel:{
                        color:'#ccc',
                        fontSize: 14,
                        fontFamily: 'MicrosoftYaHei',
                        show: false
                    },
                    data: this.xData
                },
                yAxis:  {
                    type: 'value',
                    show: false
                },
                series: [{
                    name: '车辆上报',
                    type: 'bar',
                    stack: '总量',
                    barCategoryGap: '50%',
                    data: this.responseData.VehReport
                    // data: [1,2,3,4,5,6,7,8,9,10]
                },{
                    name: '路侧上报',
                    type: 'bar',
                    stack: '总量',
                    barCategoryGap: '50%',
                    data: this.responseData.RcuReport
                    // data: [11,12,13,14,15,16,17,18,19,20]
                },{
                    name: '第三方平台上报',
                    type: 'bar',
                    stack: '总量',
                    barCategoryGap: '50%',
                    data: this.responseData.ThirdPartReport
                    // data: [5,6,7,8,9,10,11,12,13,14]
                }]
            };
            return option;
        }
	}
}
</script>
<style lang="scss" scoped>

</style>
