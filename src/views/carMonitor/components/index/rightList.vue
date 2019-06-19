<template>
  <ul class="right-list-wrap">
    <li class="c-car-list" v-for="item in responseData" :key="item.vehicleId" @click="showView(item.vehicleId)">
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
    		<img :src="item.vehicleLogo" class="car-img" />
    		<div class="speed">{{item.speed || 0}}</div>
    		<div class="echarts-wrap" :id="item.id"></div>
    	</div>
    </li>
  </ul>
</template>

<script>
import { getGpsRealConfig, getGpsRealList } from '@/api/carMonitor'
export default {
	name: 'RightList',
	data () {
		return {
			vehicleIds: 'B21E-00-017,B21E-00-018,B21E-00-019,B21E-00-020',
			responseData: [],
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
		this.getGpsRealConfig();
		// this.initWebSocket();
	},
	methods: {
		getGpsRealConfig() {
            // console.log('获取典型车辆列表初始化配置数据');
			getGpsRealConfig().then(res => {
				this.vehicleIds = res.data;
				this.webSocketData.vehicleIds = res.data;
				this.initWebSocket();
			});
		},
		getGpsRealList() {
            // console.log('初始化页面，获取典型车辆列表实时信息');
			getGpsRealList({
				vehicleId: this.vehicleIds
			}).then(res => {
				let _responseData = res.data;
				_responseData.forEach(item => {
					this.initResult(item.vehicleId, item);
				});
			});
		},
        initResult(attr, result) {
    		let _filterResult = {};
			_filterResult.vehicleId = result.vehicleId;
			_filterResult.transmission = result.transmission;
			_filterResult.speed = result.speed;
			_filterResult.headingAngle = result.headingAngle;
			_filterResult.turnLight = result.turnLight;
			_filterResult.autoLevel = result.autoLevel;
			_filterResult.vehicleLogo = result.vehicleLogo;
			_filterResult.platNo = result.platNo;

			_filterResult.id = "echarts-" + attr;
			_filterResult.echarts = null;
			_filterResult.echartsData = [];
			_filterResult.echartsData.push(result.speed);
			this.responseData.push(_filterResult);
        },
        initWebSocket(){
            // console.log('websocket获取指定车辆实时信息');
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
            	_result = _json.result,
            	_vehicleId = _result.vehicleId;

            this.responseData.forEach((item, index) => {
            	if(item.vehicleId == _vehicleId ) {
		            item.transmission = _result.transmission;
            		if(_result.transmission != 'P') {
		            	item.speed = _result.speed;
		            	item.headingAngle = _result.headingAngle;
		            	item.turnLight = _result.turnLight;

		            	if(item.echartsData.length >= 180) {
		            		item.echartsData.shift();
		            	}
		            	item.echartsData.push(_result.speed);
		        		setTimeout(() => {
							if(!item.echarts) {
								item.echarts = this.$echarts.init(document.getElementById(item.id));
							}
		        			let _option = this.defaultOption(item.echartsData);
		            		item.echarts.setOption(_option);
		            	}, 0);
            		}
            	}
            });
        },
        onclose(data){
            // console.log("结束--vehicleList--连接");
        },
        onopen(data){
            // console.log("建立--vehicleList--连接");
            //行程
            this.sendMsg(JSON.stringify(this.webSocketData));
        },
        sendMsg(msg) {
            // console.log("vehicleList--连接状态："+this.webSocket.readyState);
            if(window.WebSocket){
                if(this.webSocket.readyState == WebSocket.OPEN) { //如果WebSocket是打开状态
                    this.webSocket.send(msg); //send()发送消息
                    // console.log("vehicleList--已发送消息:"+ msg);
        			this.getGpsRealList();
                }
            }else{
                return;
            }
        },
        showView(carId) {
        	const { href } = this.$router.resolve({
                name: 'SingleCarMonitor',
                params: {
                    vehicleId: carId
                }
            })
            window.open(href, '_blank')
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
	},
    destroyed(){
        //销毁Socket
        this.webSocket.close();
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
					// width: 26px;
					padding: 0 4px 0 5px;
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
				object-fit: cover;
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
