<template>
  <ul class="right-list-wrap">
    <router-link tag="li" :to="'/singleCarMonitor/'+item.vehicleId" class="c-car-list" v-for="(item, index) in responseData" :key="item.vehicleId">
    	<div class="right-list-head">
    		<div class="left clearfix">
	    		<span class="model c-left">L{{item.autoLevel}}</span>
	    		<span class="plate c-left">{{item.platNo}}</span>
	    	</div>
	    	<div class="right clearfix">
	    		<span class="gears c-left">{{item.transmission}}</span>
	    		<span class="direction c-left">
	    			<i class="direction-icon" v-if="item.headingAngle" :style="{transform:'rotate('+ item.headingAngle +'deg)'}"></i>
	    			<i class="direction-icon" v-else></i>
	    		</span>
	    		<span class="turn c-left">
	    			<i class="turn-icon turn-left c-left" :class="item.turnLight == 'left' ? 'active' : ''"></i>
	    			<i class="turn-icon turn-right c-right" :class="item.turnLight == 'right' ? 'active' : ''"></i>
	    		</span>
	    	</div>
    	</div>
    	<div class="car-middle-info">
    		<!-- <img :src="item.vehicleLogo" class="car-img" /> -->
    		<img src="@/assets/images/develop/car-1.png" class="car-img" v-if="index%3 == 0" />
    		<img src="@/assets/images/develop/car-2.png" class="car-img" v-if="index%3 == 1" />
    		<img src="@/assets/images/develop/car-3.png" class="car-img" v-if="index%3 == 2" />
    		<div class="speed">{{item.speed || 0}}</div>
    		<div class="echarts-wrap" :id="item.id"></div>
    	</div>
    </router-link>
  </ul>
</template>

<script>
// import { requestGetShareData } from '@/api/carMoniter'
export default {
	name: 'RightList',
	data () {
		return {
			responseData: [],
			// responseData: [
			// 	{
			// 		vehicleId: 'B21E-00-017',
			// 		// vehicleLogo: 'static/images/develop/car-1.png',
			// 		platNo: '沪A090901',
			// 		autoLevel: '1',
			// 		transmission: 'D',
			// 		headingAngle: 0,
			// 		speed: '45.1',
			// 		turnLight: 'left',

			// 		id: "echarts-0",
			// 		echarts: null,
			// 		echartsData: ['45.1']
			// 	},
			// 	{
			// 		vehicleId: 'B21E-00-018',
			// 		// vehicleLogo: 'static/images/develop/car-2.png',
			// 		platNo: '沪A090902',
			// 		autoLevel: '2',
			// 		transmission: 'P',
			// 		headingAngle: 70,
			// 		speed: '45.2',
			// 		turnLight: 'right',

			// 		id: "echarts-1",
			// 		echarts: null,
			// 		echartsData: ['45.2']
			// 	},
			// 	{
			// 		vehicleId: 'B21E-00-019',
			// 		// vehicleLogo: 'static/images/develop/car-3.png',
			// 		platNo: '沪A090903',
			// 		autoLevel: '3',
			// 		transmission: 'D',
			// 		headingAngle: 240,
			// 		speed: '45.3',
			// 		turnLight: '',

			// 		id: "echarts-2",
			// 		echarts: null,
			// 		echartsData: ['45.3']
			// 	},
			// 	{
			// 		vehicleId: 'B21E-00-020',
			// 		// vehicleLogo: 'static/images/develop/car-3.png',
			// 		platNo: '沪A090904',
			// 		autoLevel: '4',
			// 		transmission: 'D',
			// 		headingAngle: 300,
			// 		speed: '45.4',
			// 		turnLight: '',

			// 		id: "echarts-3",
			// 		echarts: null,
			// 		echartsData: ['45.4']
			// 	}
			// ],
			// 获取指定车辆实时信息
            webSocket:{},
            webSocketData: {
                action: 'vehicleList',
                token: 'fpx',
                vehicleIds: 'B21E-00-017,B21E-00-018,B21E-00-019,B21E-00-020'
            }		
		}
	},
	mounted() {

        this.initWebSocket();
	},
	methods: {
        initWebSocket(){
            console.log('websocket获取指定车辆实时信息');
            if ('WebSocket' in window) {
                this.webSocket = new WebSocket(window.cfg.websocketUrl);  //获得WebSocket对象
            }
            this.webSocket.onmessage = this.onmessage;
            this.webSocket.onclose = this.onclose;
            this.webSocket.onopen = this.onopen;
            this.webSocket.onerror = this.onerror;
        },
        onmessage(message){
            let _json = JSON.parse(message.data),
            	_result = _json.result;
			if(!this.responseData.length) {
				this.initResult(_result);
			}else {
				let _isLoad = false;
	            this.responseData.forEach((item, index) => {
	            	if(item.vehicleId == _result.vehicleId ) {
	            		_isLoad = true
		            	item.speed = _result.speed || 0;
		            	item.transmission = _result.transmission;
		            	item.headingAngle = _result.headingAngle || 0;
		            	item.turnLight = _result.turnLight || '';

		            	if(item.echartsData.length >= 180) {
		            		item.echartsData.shift();
		            	}
		            	item.echartsData.push(_result.speed);
		        		let _option = this.defaultOption(item.echartsData);
		            	item.echarts.setOption(_option);
	            	}
	            });
	            if(!_isLoad) {
	            	this.initResult(_result);
	            }
			}
        },
        initResult(result) {
        	let _filterResult = result;
				_filterResult.id = "echarts-"+this.responseData.length;
				_filterResult.echarts = null;
				_filterResult.echartsData = [];
				_filterResult.echartsData.push(_filterResult.speed);
			this.responseData.push(_filterResult);
			setTimeout(() => {
				let _handlerObj = this.responseData[this.responseData.length-1],
					_option = this.defaultOption(_handlerObj.echartsData);
		        	_handlerObj.echarts = this.$echarts.init(document.getElementById(_handlerObj.id));
		        	_handlerObj.echarts.setOption(_option);
		    }, 0);
        },
        onclose(data){
            console.log("结束--trackAll--连接");
        },
        onopen(data){
            console.log("建立--trackAll--连接");
            //行程
            this.sendMsg(JSON.stringify(this.webSocketData));
        },
        sendMsg(msg) {
            console.log("trackAll--连接状态："+this.webSocket.readyState);
            if(window.WebSocket){
                if(this.webSocket.readyState == WebSocket.OPEN) { //如果WebSocket是打开状态
                    this.webSocket.send(msg); //send()发送消息
                    console.log("trackAll--已发送消息:"+ msg);
                }
            }else{
                return;
            }
        },
		defaultOption(data) {
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
                    name: "今日在使车辆",
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
		}
	}
}
</script>
<style lang="scss" scoped>
@import '@/assets/scss/theme.scss'; 
.right-list-wrap {                  
	.c-car-list {
		cursor: pointer;
		padding: 14px 12px;
		.right-list-head {
			@include layoutMode(between);
			line-height: 26px;
			.left {
				.model {
					display: inline-block;
					text-align: center;
					width: 26px;
					height: 26px;
					font-size: 14px;
					letter-spacing: 1px;
					background-color: #0b5330;
					border-radius: 3px;
					margin-right: 11px;
				}
				.plate {
					font-size: 20px;
				}
			}
			.right {
				text-align: center;
				.gears, .direction, .turn {
					width: 30px;
					height: 100%;
				}
				.gears {
					font-size: 24px;
					color: #dc8c00;
					font-weight: bold;
				}
				.direction-icon {
					display: inline-block;
					width: 26px;
					height: 100%;
					background: url('../../../../assets/images/carMonitor/arrow.png') no-repeat center center;
					background-size: auto 24px;
					// transform-origin: center center !important;
				}
				.turn {
					width: 41px;
					padding-left: 10px;
					.turn-icon {
						width: 19px;
						height: 100%;
						background-repeat: no-repeat;
						background-position: center center;
						background-size: 100% auto;
						&.turn-left {
							background-image: url('../../../../assets/images/carMonitor/arrow-left.png');
							&.active {
								background-image: url('../../../../assets/images/carMonitor/arrow-left-active.png');
							}
						}
						&.turn-right {
							background-image: url('../../../../assets/images/carMonitor/arrow-right.png');
							&.active {
								background-image: url('../../../../assets/images/carMonitor/arrow-right-active.png');
							}
						}
					}
				}
			}
		}
		.car-middle-info {
			height: 55px;
			margin-top: 42px;
			margin-bottom: 27px;
			line-height: 26px;    
			@include layoutMode(all);
			.car-img {
				width: 110px;
				height: 100%;
				object-fit: contain;
			}
			.speed {
				position: relative;
				@include layoutMode(pack);
				font-family: carFont;
				font-size: 36px;
				letter-spacing: 4px;
				color: #37ba7b;
				&:after {
					content: "KM/H";
					position: absolute;
					left: 50%;
					top: 100%;
					transform: translate(-50%, 0);
					letter-spacing: 1px;
					color: #999;
					font-family: MicrosoftYaHei;
					font-size: 14px;
					line-height: 30px;
				}
			}
			.echarts-wrap {
				width: 90px;
				height: 30px;
			}
		}
	}
}
</style>
