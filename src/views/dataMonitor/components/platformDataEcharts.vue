<template>
  <div class="c-relative">
    <h3 class="c-title">{{title}}<span class="c-sub-title">累计数量：{{responseData.total || '--'}}</span></h3>
    <div class="echarts-box" :id="id"></div>
  </div>
</template>

<script>
// import { getTotalFlow } from '@/api/dataMonitor'
import WebSocketObj from '@/assets/js/utils/webSocket.js'
import $echarts from 'echarts'
export default {
	name: 'PlatformDataEcharts',
	props: {
	    title: String
	},
	data () {
		return {
            // 获取在驶车辆实时数据（辆）
            webSocket:null,
            webSocketData: {
                action: "flow",
                token: 'fpx'
            },
            countNum: 0,
            maxNum: 30,
            maxGroup: 10,
            curGroup: 0,
            totalData: {
                VehReport: 0,
                RcuReport: 0,
                ThirdPartReport: 0
            },
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
        // this.getTotalFlow();
        this.echarts = $echarts.init(document.getElementById(this.id));
        this.echarts.setOption(this.defaultOption());
        this.initWebSocket();
	},
	methods: {
        // getTotalFlow() {
        //     // console.log('获取平台总数据流量');
        //     getTotalFlow().then(res => {
        //         this.responseData.total = res.data.flow;
        //     });
        // },
        initWebSocket(){
            this.webSocket = new WebSocketObj(this, window.config.websocketUrl, this.webSocketData, this.onmessage);
        },
        onmessage(message){
            let _json = JSON.parse(message.data),
                _result = _json.result.flow,
                _curTime = this.$dateUtil.formatTime(parseInt(_json.result.curTime)).split(" ")[1];
            // console.log(_json.result.curTime);
            // console.log(_curTime);
            this.responseData.total = _json.result.total != undefined ? _json.result.total : this.responseData.total;
            // countNum: 0, maxNum: 30, maxGroup: 10, curGroup: 0,
            if(this.countNum >= this.maxNum) {
                this.countNum = 0;
                this.curGroup ++ ;
                // console.log('换组', this.curGroup);
                if(this.curGroup >= this.maxGroup) {
                    // console.log('移除一组数据');
                    for(let attr in this.responseData) {
                        console.log();
                        if(attr != 'total') {
                            let _obj = this.responseData[attr];
                            _obj.shift();
                        }
                    }
                    this.xData.shift();
                    this.curGroup -- ;
                    // console.log('删除后当前组：', this.curGroup);
                }
            }
            _result.forEach((item, index) => {
                let _type = item.type,
                    _obj = this.responseData[_type],
                    _value = _obj[this.curGroup] || 0;
                // _obj[this.curGroup] = parseInt(_value + item.flow).toFixed(2);
                _obj[this.curGroup] = (Number(_value) + Number(item.flow)).toFixed(2);

                if(this.countNum == 0) {
                    this.xData[this.curGroup] = _curTime+'~';
                }else {
                    let _firstTime = this.xData[this.curGroup].split('~')[0];
                    this.xData[this.curGroup] = _firstTime+'~'+_curTime;
                }
                // if(_type == 'VehReport') {
                //     // console.log('每一组的数据长度：', _obj.length);
                //     console.log(item.flow, _value, _obj[this.curGroup]);
                // }
            });
            // console.log('当前组：'+this.curGroup, '当前数：'+this.countNum);
            this.countNum ++ ;
            this.echarts.setOption(this.defaultOption());
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
                    itemGap: 37,
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
                    show: false,
                    max: function(value) {
                        return value.max + 2;
                    }
                },
                animation: false,
                series: [{
                    name: '车辆上报',
                    type: 'bar',
                    // stack: '总量',
                    barCategoryGap: '25%',
                    data: this.responseData.VehReport
                    // data: [1,2,3,4,5,6,7,8,9,10]
                },{
                    name: '路侧上报',
                    type: 'bar',
                    // stack: '总量',
                    barCategoryGap: '25%',
                    data: this.responseData.RcuReport
                    // data: [11,12,13,14,15,16,17,18,19,20]
                },{
                    name: '第三方平台上报',
                    type: 'bar',
                    // stack: '总量',
                    barCategoryGap: '25%',
                    data: this.responseData.ThirdPartReport
                    // data: [5,6,7,8,9,10,11,12,13,14]
                }]
            };
            return option;
        }
	},
    destroyed(){
        //销毁Socket
        this.webSocket&&this.webSocket.webSocket.close();
    }
}
</script>
<style lang="scss" scoped>
.echarts-box {
    margin-top: 20px;
    height: 126px;
}
</style>
