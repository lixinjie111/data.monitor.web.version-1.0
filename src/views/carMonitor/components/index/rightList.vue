<template>
  <ul class="right-list-wrap">
    <router-link tag="li" to="/singleCarMonitor/B21E-00-017" class="c-car-list">
    	<div class="right-list-head">
    		<div class="left clearfix">
	    		<span class="model c-left">L3</span>
	    		<span class="plate c-left">沪A090901</span>
	    	</div>
	    	<div class="right clearfix">
	    		<span class="gears c-left">D</span>
	    		<span class="direction c-left"><i class="direction-icon" style="transform: rotate(30deg);"></i></span>
	    		<span class="turn c-left">
	    			<i class="turn-icon turn-left c-left"></i>
	    			<i class="turn-icon turn-right c-right"></i>
	    		</span>
	    	</div>
    	</div>
    	<div class="car-middle-info">
    		<img src="@/assets/images/develop/car-1.png" class="car-img" />
    		<div class="speed">45.5</div>
    		<div class="echarts-wrap" id="echarts-1"></div>
    	</div>
    </router-link>
    <router-link tag="li" to="/singleCarMonitor/B21E-00-017" class="c-car-list">
    	<div class="right-list-head">
    		<div class="left clearfix">
	    		<span class="model c-left">L3</span>
	    		<span class="plate c-left">沪A090901</span>
	    	</div>
	    	<div class="right clearfix">
	    		<span class="gears c-left">D</span>
	    		<span class="direction c-left"><i class="direction-icon"></i></span>
	    		<span class="turn c-left">
	    			<i class="turn-icon turn-left c-left active"></i>
	    			<i class="turn-icon turn-right c-right"></i>
	    		</span>
	    	</div>
    	</div>
    	<div class="car-middle-info">
    		<img src="@/assets/images/develop/car-2.png" class="car-img" />
    		<div class="speed">45.5</div>
    		<div class="echarts-wrap" id="echarts-2"></div>
    	</div>
    </router-link>
    <router-link tag="li" to="/singleCarMonitor/B21E-00-017" class="c-car-list">
    	<div class="right-list-head">
    		<div class="left clearfix">
	    		<span class="model c-left">L3</span>
	    		<span class="plate c-left">沪A090901</span>
	    	</div>
	    	<div class="right clearfix">
	    		<span class="gears c-left">D</span>
	    		<span class="direction c-left"><i class="direction-icon"></i></span>
	    		<span class="turn c-left">
	    			<i class="turn-icon turn-left c-left"></i>
	    			<i class="turn-icon turn-right c-right active"></i>
	    		</span>
	    	</div>
    	</div>
    	<div class="car-middle-info">
    		<img src="@/assets/images/develop/car-3.png" class="car-img" />
    		<div class="speed">45.5</div>
    		<div class="echarts-wrap" id="echarts-3"></div>
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
			echarts1: null,
			echarts2: null,
			echarts3: null,
			echartsOption: {
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
                    },
                    data: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24]
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
                    data: [245, 182, 434, 791, 390, 245, 465, 245, 182, 434, 791, 390, 245, 465, 245, 182, 434, 791, 390, 245, 465, 245, 182, 434, 121]
                }]
			}		
		}
	},
	watch: {
	// 	shareData:{
	// 		handler(curVal,oldVal){
				
	// 		},
	// 　　　	deep:true
	// 	}
	},
	created() {
		
	},
	mounted() {
		this.echarts1 = this.$echarts.init(document.getElementById("echarts-1"));
		this.echarts1.setOption(this.echartsOption);
		this.echarts2 = this.$echarts.init(document.getElementById("echarts-2"));
		this.echarts2.setOption(this.echartsOption);
		this.echarts3 = this.$echarts.init(document.getElementById("echarts-3"));
		this.echarts3.setOption(this.echartsOption);
	},
	methods: {
		
	}
}
</script>
<style lang="scss" scoped>
@import '@/assets/scss/theme.scss'; 
.right-list-wrap {                  
	.c-car-list {
		cursor: pointer;
		// padding: 14px 12px;
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
