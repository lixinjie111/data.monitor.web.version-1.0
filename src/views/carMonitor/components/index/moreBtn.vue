
<template>
	<div class="more-wrapper">
		<a href="javascript:;" class="more-btn c-car-list" @click="dialogVisible = true">更多</a>
		<div class="c-dialog-wrapper" v-show="dialogVisible">
			<div class="c-dialog-container">
				<div class="c-dialog-header">
					<span class="c-dialog-title">车辆数据</span>
					<i class="c-dialog-close" @click="dialogVisible = false"></i>
				</div>
				<div class="c-dialog-content">
					<div class="c-scroll-wrap">
						<ul class="c-scroll-inner">
							<li class="echarts-classify-wrap">
								<p class="title">车辆分析</p>
								<ul class="echarts-list-wrap clearfix">
									<li class="echarts-list">
										<p class="echarts-list-title">车型品牌分布</p>
										<div class="echarts-list-box" id="echarts-1-1"></div>
									</li>
									<li class="echarts-list">
										<p class="echarts-list-title">车辆自动驾驶等级分布</p>
										<div class="echarts-list-box" id="echarts-1-2"></div>
									</li>
									<li class="echarts-list">
										<p class="echarts-list-title">车辆用途分布</p>
										<div class="echarts-list-box" id="echarts-1-3"></div>
									</li>
									<li class="echarts-list">
										<p class="echarts-list-title">车辆动力类型分布</p>
										<div class="echarts-list-box" id="echarts-1-4"></div>
									</li>
								</ul>
							</li>
							<li class="echarts-classify-wrap">
								<p class="title">活跃车辆（近30天）</p>
								<ul class="echarts-list-wrap clearfix">
									<li class="echarts-list">
										<p class="echarts-list-title">行驶里程Top5</p>
										<div class="echarts-list-box" id="echarts-2-1"></div>
									</li>
									<li class="echarts-list">
										<p class="echarts-list-title">行驶时长Top5</p>
										<div class="echarts-list-box" id="echarts-2-2"></div>
									</li>
								</ul>
							</li>
							<li class="echarts-classify-wrap">
								<p class="title">行程分析（近30天）</p>
								<ul class="echarts-list-wrap clearfix">
									<li class="echarts-list">
										<p class="echarts-list-title">行程距离分布</p>
										<div class="echarts-list-box" id="echarts-3-1"></div>
									</li>
									<li class="echarts-list">
										<p class="echarts-list-title">行程时长分布</p>
										<div class="echarts-list-box" id="echarts-3-2"></div>
									</li>
									<li class="echarts-list">
										<p class="echarts-list-title">行程时段分布</p>
										<div class="echarts-list-box" id="echarts-3-3"></div>
									</li>
								</ul>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
// import { requestGetShareData } from './api/share'
export default {
	name: 'MoreBtn',
	data () {
		var _this = this;
		return {
			dialogVisible: false,
			echarts11: null,
			echarts21: null,
			echarts31: null,

			echartsOption1: {
				tooltip: {
			        trigger: 'item',
			        formatter: "{b}: {c} <br/>占比: {d}%",
			        textStyle: {
			        	color: "#dc8c00"
			        	// fontWeight: "bold"
			        }
			    },
			 	grid: {
			 		right: "10%"
			 	},
			    legend: {
			        orient: 'vertical',
			        right: '2%',
			        y: 'center',
			        itemGap: 0,
			        padding: [0, 30, 0, 0],
			        textStyle: {
			        	color: '#ccc',
			        	lineHeight: 20,
			        	fontFamily: 'MicrosoftYaHei'
			        }
			    },
			    color: ["#139cbe", "#41b27e", "#9ccc68", "#f7ca49", "#9496a1", "#4666f1"],
			    series: [
			        {
			            // name:'adfasdfasf',
			            type:'pie',
			            radius: ['40%', '70%'],
			            center: ['37%', '51%'],
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
			                // normal: {
			                //     show: false,
			                //     position: 'center'
			                // },
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
			            data:[
			                {value:1548, name:'直接访问'},
			                {value:1032, name:'邮件营销'},
			                {value:534, name:'联盟广告'},
			                {value:235, name:'视频广告'},
			                {value:154, name:'搜索引擎'},
			                {value:99, name:'搜索引擎2'}
			            ]
			        }
			    ]
			},
			echartsOption2: {
			    dataset: {
			        source: [
			            {name:'label', value: 'value'},
			            {name:'沪A898810', value: 89.3},
			            {name:'沪A898811', value: 57.1},
			            {name:'沪A898812', value: 74.4},
			            {name:'沪A898813', value: 50.1},
			            {name:'沪A898814', value: 89.7}
			        ]
			    },
			    grid: {
			    	left: 124,
			    	right: 40,
			    	top: 40,
			    	bottom: 40
			    },
			    tooltip: {
			        trigger: 'axis',
			        axisPointer: {
			            type: 'shadow'
			        }
			    },
			    color: "#41b27e",
			    xAxis: {
			    	show: false
			    },
			    yAxis: {
			    	type: 'category',
			    	boundaryGap: false,
			    	axisLine:{
                        show: false
                    },
                    axisTick:{
                        show: false
                    },
                    axisLabel:{
                        color:'#ccc',
                        fontSize: 14,
                        fontFamily: 'MicrosoftYaHei'
                    }
			    },
			    series: {
		            type: 'bar',
		            encode: {
		                x: 'value',
		                y: 'label'
		            },
		    		barCategoryGap: '50%',
		    		label: {
		    			show: true,
		    			distance: 10,
		    			position: 'right',
		    			// position: 'insideRight',
		    			color: '#fff'
		    		}
		        }
			},
			echartsOption3: {
				dataset: {
			        source: [
			            ['label', 'value'],
			            ['0-3', 89.3],
			            ['3-6', 57.1],
			            ['6-9', 74.4],
			            ['9-12', 50.1],
			            ['12-15', 89.7],
			            ['15-18', 57.1],
			            ['18-21', 74.4],
			            ['21-24', 89.7]
			        ]
			    },
			    grid: {
			    	left: 30,
			    	right: 30,
			    	top: 40,
			    	bottom: 40
			    },
			    tooltip: {
			        trigger: 'axis',
			        axisPointer: {
			            type: 'shadow'
			        }
			    },
			    color: "#41b27e",
			    xAxis: {
			        type: 'category',
			        boundaryGap: true,
			    	axisLine:{
                        show: false
                    },
                    axisTick:{
                        show: false
                    },
                    axisLabel:{
                        color:'#ccc',
                        fontSize: 12,
                        fontFamily: 'MicrosoftYaHei'
                    }
			    },
			    yAxis: {
			        show: false
			    },
			    series: {
		            type: 'bar',
		            encode: {
		                x: 'label',
		                y: 'value'
		            },
		    		barCategoryGap: '50%'
		        }
			}

		}
	},
	watch: {
      	deep: true,
		dialogVisible: {
			handler(newVal, oldVal) {
				if(newVal) {

					setTimeout(() => {
						this.echarts11 = this.$echarts.init(document.getElementById("echarts-1-1"));
						this.echarts11.setOption(this.echartsOption1);
						this.echarts21 = this.$echarts.init(document.getElementById("echarts-2-1"));
						this.echarts21.setOption(this.echartsOption2);
						this.echarts31 = this.$echarts.init(document.getElementById("echarts-3-1"));
						this.echarts31.setOption(this.echartsOption3);
					}, 0);

					setTimeout(() => {
						this.echarts11.setOption(this.echartsOption1);
						this.echarts21.setOption(this.echartsOption2);
						this.echarts31.setOption(this.echartsOption3);
					}, 2000);
				}
			}
		}
	},
	created() {
	},
	mounted() {
		// this.echarts11 = this.$echarts.init(document.getElementById("echarts-1-1"));
		// this.echarts11.setOption(this.echartsOption1);
		// this.echarts21 = this.$echarts.init(document.getElementById("echarts-2-1"));
		// this.echarts21.setOption(this.echartsOption2);
		// this.echarts31 = this.$echarts.init(document.getElementById("echarts-3-1"));
		// this.echarts31.setOption(this.echartsOption3);

		
	},
	methods: {
		
	}
}
</script>
<style lang="scss" scoped>
@import "@/assets/scss/theme.scss";
.more-btn {
    position: absolute;
    top: 94px;
    right: 417px;
    z-index: 3;
    width: 65px;
    height: 36px;
    @include layoutMode();
    font-size: 20px;
    color: #ccc;
}
.echarts-classify-wrap {
	margin-bottom: 18px;
	margin-right: 20px;
	&:last-child {
		margin-bottom: 0;
	}
	.title {
		position: relative;
		padding-left: 11px;
		height: 30px;
		line-height: 30px;
		font-size: 18px;
		&:before {
			content: "";
			position: absolute;
			left: 0;
			top: 50%;
			margin-top: -9px;
			width: 2px;
			height: 18px;
			background-color: #41b27e;
		}
	}
	.echarts-list-wrap {
		margin: 0 -1%;
		.echarts-list {
			position: relative;
			float: left;
			width: 30.85%;
			margin: 18px 1% 0;
			padding-bottom: 16.75%;
		}
		.echarts-list-title {
			padding: 0 17px;
			font-size: 18px;
			background-color: rgba(204, 204, 204, .1);
		}
		.echarts-list-box {
			position: absolute;
			left: 0;
			right: 0;
			top: 40px;
			bottom: 0;
			background-color: rgba(0, 0, 0, .1);
		}
	}
}
</style>
